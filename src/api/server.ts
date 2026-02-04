import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { PublicKey } from '@solana/web3.js';
import { RektShieldSwarm } from '../core/swarm';
import { AgentType, ThreatLevel, SwarmEventType } from '../core/types';
import { ScannerAgent } from '../agents/scanner';
import { SentinelAgent } from '../agents/sentinel';
import { GuardianAgent } from '../agents/guardian';
import { IntelAgent } from '../agents/intel';
import { QuantumAgent } from '../agents/quantum';
import { LazarusAgent } from '../agents/lazarus';
import { HoneypotAgent } from '../agents/honeypot';
import { ProphetAgent } from '../agents/prophet';
import { NetworkAgent } from '../agents/network';
import { HealerAgent } from '../agents/healer';
import { AIEngine } from '../utils/ai-engine';
import { JupiterClient, POPULAR_TOKENS } from '../utils/jupiter';
import { logger } from '../utils/logger';

// ============================================
// SECURITY HELPERS
// ============================================

/** Validate a Solana base58 public key */
function isValidSolanaAddress(address: string): boolean {
  try {
    new PublicKey(address);
    return true;
  } catch {
    return false;
  }
}

/** Sanitize error messages — never leak internals to client */
function safeError(message: string): string {
  if (process.env.NODE_ENV === 'production') {
    return 'An internal error occurred. Please try again later.';
  }
  return message;
}

/** Strip control characters and limit length for AI input sanitization */
function sanitizeUserInput(input: string, maxLength = 2000): string {
  return input
    .replace(/[\x00-\x1f\x7f]/g, '') // Remove control characters
    .slice(0, maxLength)
    .trim();
}

/** API key authentication middleware */
function requireAuth(req: Request, res: Response, next: NextFunction): void {
  const apiSecret = process.env.API_SECRET;

  // Require API_SECRET in production
  if (!apiSecret) {
    if (process.env.NODE_ENV === 'production') {
      res.status(500).json({ error: 'Server misconfiguration — API_SECRET not set' });
      return;
    }
    // Allow in dev mode without secret
    next();
    return;
  }

  const authHeader = req.headers.authorization;
  const apiKey = req.headers['x-api-key'] as string;

  if (authHeader === `Bearer ${apiSecret}` || apiKey === apiSecret) {
    next();
    return;
  }

  res.status(401).json({ error: 'Unauthorized — provide API key via Authorization header or x-api-key' });
}

export function createAPIServer(swarm: RektShieldSwarm): express.Application {
  const app = express();

  // ============================================
  // SECURITY MIDDLEWARE
  // ============================================

  // Security headers (CSP, X-Frame-Options, X-Content-Type-Options, etc.)
  app.use(helmet({
    contentSecurityPolicy: false, // Disabled for API-only server
    crossOriginEmbedderPolicy: false,
  }));

  // CORS — restrict to known origins
  const allowedOrigins = [
    'https://rekt-shield.vercel.app',
    'https://dashboard-youths-projects-db1ba2a3.vercel.app',
    'http://localhost:3000',
    'http://localhost:3001',
  ];

  if (process.env.CORS_ORIGIN) {
    // Support comma-separated origins
    process.env.CORS_ORIGIN.split(',').forEach(origin => {
      allowedOrigins.push(origin.trim());
    });
  }

  app.use(cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (server-to-server, curl, Postman)
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(null, false);
      }
    },
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type', 'Authorization', 'x-api-key'],
  }));

  // Body parser with size limit
  app.use(express.json({ limit: '100kb' }));

  // Global rate limiter — 200 requests per minute per IP
  const globalLimiter = rateLimit({
    windowMs: 60 * 1000,
    max: 200,
    standardHeaders: true,
    legacyHeaders: false,
    message: { error: 'Too many requests — please slow down' },
  });
  app.use(globalLimiter);

  // Strict rate limiter for AI endpoints — 20 requests per minute per IP
  const aiLimiter = rateLimit({
    windowMs: 60 * 1000,
    max: 20,
    standardHeaders: true,
    legacyHeaders: false,
    message: { error: 'AI rate limit exceeded — max 20 requests/minute' },
  });

  // Strict rate limiter for swap/execute — 10 per minute per IP
  const swapLimiter = rateLimit({
    windowMs: 60 * 1000,
    max: 10,
    standardHeaders: true,
    legacyHeaders: false,
    message: { error: 'Swap rate limit exceeded — max 10 requests/minute' },
  });

  // Rate limiter for authenticated mutation endpoints — 5 per minute per IP
  const mutationLimiter = rateLimit({
    windowMs: 60 * 1000,
    max: 5,
    standardHeaders: true,
    legacyHeaders: false,
    message: { error: 'Too many mutation requests — max 5/minute' },
  });

  // AI Engine for direct API access
  const aiEngine = new AIEngine();

  // ============================================
  // HEALTH & STATUS (public)
  // ============================================
  app.get('/api/health', (_, res) => {
    res.json({
      status: 'ok',
      name: 'REKT Shield',
      version: '2.0.0',
      agents: 11,
      ai: aiEngine.isAvailable() ? aiEngine.getProvider() : 'rule-based',
      selfHealing: true,
    });
  });

  app.get('/api/status', (_, res) => {
    res.json(swarm.getSwarmStatus());
  });

  // ============================================
  // SCANNER — Token Risk Analysis (public read)
  // ============================================
  app.get('/api/scan/:tokenAddress', async (req, res) => {
    try {
      if (!isValidSolanaAddress(req.params.tokenAddress)) {
        res.status(400).json({ error: 'Invalid Solana address' });
        return;
      }
      const scanner = swarm.getAgent<ScannerAgent>(AgentType.SCANNER);
      const report = await scanner.scanToken(req.params.tokenAddress);
      res.json(report);
    } catch (error) {
      logger.error(`[API] Scan failed: ${error}`);
      res.status(500).json({ error: safeError('Token scan failed') });
    }
  });

  // ============================================
  // SENTINEL — Wallet Monitoring (auth required)
  // ============================================
  app.post('/api/monitor/wallet', requireAuth, mutationLimiter, (req, res) => {
    try {
      const { walletAddress } = req.body;
      if (!walletAddress || !isValidSolanaAddress(walletAddress)) {
        res.status(400).json({ error: 'Valid Solana wallet address is required' });
        return;
      }
      const sentinel = swarm.getAgent<SentinelAgent>(AgentType.SENTINEL);
      sentinel.addWallet({
        walletAddress,
        alertThreshold: req.body.alertThreshold || 'medium',
        autoDefend: req.body.autoDefend || false,
        safetyWallet: req.body.safetyWallet,
        maxSlippage: req.body.maxSlippage || 3,
      });
      res.json({ success: true, message: `Now monitoring wallet` });
    } catch (error) {
      logger.error(`[API] Monitor failed: ${error}`);
      res.status(500).json({ error: safeError('Wallet monitoring failed') });
    }
  });

  app.get('/api/monitor/wallets', (_, res) => {
    const sentinel = swarm.getAgent<SentinelAgent>(AgentType.SENTINEL);
    res.json({ wallets: sentinel.getMonitoredWallets() });
  });

  app.get('/api/alerts', (req, res) => {
    const wallet = req.query.wallet as string;
    if (wallet && !isValidSolanaAddress(wallet)) {
      res.status(400).json({ error: 'Invalid wallet address' });
      return;
    }
    const sentinel = swarm.getAgent<SentinelAgent>(AgentType.SENTINEL);
    res.json({ alerts: sentinel.getAlerts(wallet) });
  });

  // ============================================
  // GUARDIAN — Defense Log (public read)
  // ============================================
  app.get('/api/defense/log', (_, res) => {
    const guardian = swarm.getAgent<GuardianAgent>(AgentType.GUARDIAN);
    res.json({
      log: guardian.getDefenseLog(),
      totalSaved: guardian.getTotalSaved(),
      proofs: guardian.getProtectionProofs(),
    });
  });

  // ============================================
  // INTEL — Threat Registry (public read)
  // ============================================
  app.get('/api/threats', (_, res) => {
    const intel = swarm.getAgent<IntelAgent>(AgentType.INTEL);
    res.json({
      threats: intel.getAllThreats(),
      blacklist: intel.getBlacklist(),
      antibodies: intel.getAntibodies(),
      stats: intel.getStats(),
    });
  });

  app.get('/api/threats/:address', (req, res) => {
    if (!isValidSolanaAddress(req.params.address)) {
      res.status(400).json({ error: 'Invalid Solana address' });
      return;
    }
    const intel = swarm.getAgent<IntelAgent>(AgentType.INTEL);
    const threat = intel.getThreat(req.params.address);
    const attacker = intel.getAttacker(req.params.address);
    res.json({ threat, attacker, isBlacklisted: intel.isBlacklisted(req.params.address) });
  });

  // ============================================
  // QUANTUM — Quantum Readiness (public read)
  // ============================================
  app.get('/api/quantum/assess/:walletAddress', async (req, res) => {
    try {
      if (!isValidSolanaAddress(req.params.walletAddress)) {
        res.status(400).json({ error: 'Invalid Solana address' });
        return;
      }
      const quantum = swarm.getAgent<QuantumAgent>(AgentType.QUANTUM);
      const report = await quantum.assessWalletQuantumReadiness(req.params.walletAddress);
      res.json(report);
    } catch (error) {
      logger.error(`[API] Quantum assessment failed: ${error}`);
      res.status(500).json({ error: safeError('Quantum assessment failed') });
    }
  });

  app.get('/api/quantum/timeline', (_, res) => {
    const quantum = swarm.getAgent<QuantumAgent>(AgentType.QUANTUM);
    res.json(quantum.getTimelineAssessment());
  });

  app.get('/api/quantum/threat-level', (_, res) => {
    const quantum = swarm.getAgent<QuantumAgent>(AgentType.QUANTUM);
    res.json({ threatLevel: quantum.getQuantumThreatLevel() });
  });

  // ============================================
  // LAZARUS — State-Actor Tracking (public read)
  // ============================================
  app.get('/api/lazarus/analyze/:address', async (req, res) => {
    try {
      if (!isValidSolanaAddress(req.params.address)) {
        res.status(400).json({ error: 'Invalid Solana address' });
        return;
      }
      const lazarus = swarm.getAgent<LazarusAgent>(AgentType.LAZARUS);
      const alert = await lazarus.analyzeAddress(req.params.address);
      res.json({ alert, isStateSponsoredThreat: alert && alert.matchConfidence >= 60 });
    } catch (error) {
      logger.error(`[API] Lazarus analysis failed: ${error}`);
      res.status(500).json({ error: safeError('Lazarus analysis failed') });
    }
  });

  app.get('/api/lazarus/alerts', (_, res) => {
    const lazarus = swarm.getAgent<LazarusAgent>(AgentType.LAZARUS);
    res.json({ alerts: lazarus.getAlerts(), stats: lazarus.getStats() });
  });

  // ============================================
  // HONEYPOT — Active Defense (auth required)
  // ============================================
  app.post('/api/honeypot/deploy', requireAuth, mutationLimiter, async (req, res) => {
    try {
      const honeypot = swarm.getAgent<HoneypotAgent>(AgentType.HONEYPOT);

      // Validate baitToken
      if (req.body.baitToken && !isValidSolanaAddress(req.body.baitToken)) {
        res.status(400).json({ error: 'Invalid baitToken address' });
        return;
      }

      // Cap max deployments
      if (honeypot.getDeployments().length >= 50) {
        res.status(429).json({ error: 'Maximum honeypot deployment limit reached (50)' });
        return;
      }

      const deployment = await honeypot.deployHoneypot({
        baitAmount: Math.min(req.body.baitAmount || 0.1, 1), // Cap bait amount
        baitToken: req.body.baitToken,
      });
      res.json(deployment);
    } catch (error) {
      logger.error(`[API] Honeypot deployment failed: ${error}`);
      res.status(500).json({ error: safeError('Honeypot deployment failed') });
    }
  });

  app.get('/api/honeypot/deployments', (_, res) => {
    const honeypot = swarm.getAgent<HoneypotAgent>(AgentType.HONEYPOT);
    res.json({
      deployments: honeypot.getDeployments(),
      attackerProfiles: honeypot.getAttackerProfiles(),
      stats: honeypot.getStats(),
    });
  });

  // ============================================
  // PROPHET — Predictions (public read)
  // ============================================
  app.get('/api/predict/:tokenAddress', async (req, res) => {
    try {
      if (!isValidSolanaAddress(req.params.tokenAddress)) {
        res.status(400).json({ error: 'Invalid Solana address' });
        return;
      }
      const prophet = swarm.getAgent<ProphetAgent>(AgentType.PROPHET);
      const prediction = await prophet.predictRugPull(req.params.tokenAddress);
      res.json(prediction);
    } catch (error) {
      logger.error(`[API] Prediction failed: ${error}`);
      res.status(500).json({ error: safeError('Prediction failed') });
    }
  });

  app.get('/api/predict/whales/:tokenAddress', async (req, res) => {
    try {
      if (!isValidSolanaAddress(req.params.tokenAddress)) {
        res.status(400).json({ error: 'Invalid Solana address' });
        return;
      }
      const prophet = swarm.getAgent<ProphetAgent>(AgentType.PROPHET);
      const whaleAlerts = await prophet.detectWhaleMovements(req.params.tokenAddress);
      res.json({ whaleAlerts });
    } catch (error) {
      logger.error(`[API] Whale detection failed: ${error}`);
      res.status(500).json({ error: safeError('Whale detection failed') });
    }
  });

  app.get('/api/sentiment', async (_, res) => {
    try {
      const prophet = swarm.getAgent<ProphetAgent>(AgentType.PROPHET);
      const sentiment = await prophet.analyzeMarketSentiment();
      res.json(sentiment);
    } catch (error) {
      logger.error(`[API] Sentiment analysis failed: ${error}`);
      res.status(500).json({ error: safeError('Sentiment analysis failed') });
    }
  });

  // ============================================
  // NETWORK — Solana Health (public read)
  // ============================================
  app.get('/api/network/health', async (_, res) => {
    try {
      const network = swarm.getAgent<NetworkAgent>(AgentType.NETWORK);
      const health = await network.getNetworkHealth();
      res.json(health);
    } catch (error) {
      logger.error(`[API] Network health check failed: ${error}`);
      res.status(500).json({ error: safeError('Network health check failed') });
    }
  });

  app.get('/api/network/stats', (_, res) => {
    const network = swarm.getAgent<NetworkAgent>(AgentType.NETWORK);
    res.json(network.getStats());
  });

  // ============================================
  // SWARM — Cross-Agent Events (public read)
  // ============================================
  app.get('/api/events', (_, res) => {
    const events = swarm.getEventBus().getRecentEvents(100);
    res.json({ events, stats: swarm.getEventBus().getStats() });
  });

  app.get('/api/events/critical', (_, res) => {
    const events = swarm.getEventBus().getCriticalEvents();
    res.json({ events });
  });

  // ============================================
  // AI — Intelligence Engine (rate limited)
  // ============================================
  app.post('/api/ai/analyze-token', aiLimiter, async (req, res) => {
    try {
      const result = await aiEngine.analyzeTokenRisk(req.body);
      res.json(result);
    } catch (error) {
      logger.error(`[API] AI analysis failed: ${error}`);
      res.status(500).json({ error: safeError('AI analysis failed') });
    }
  });

  app.post('/api/ai/audit-contract', aiLimiter, async (req, res) => {
    try {
      const code = sanitizeUserInput(req.body.code || '', 5000);
      const result = await aiEngine.analyzeSmartContract(code);
      res.json(result);
    } catch (error) {
      logger.error(`[API] AI audit failed: ${error}`);
      res.status(500).json({ error: safeError('AI audit failed') });
    }
  });

  app.post('/api/ai/chat', aiLimiter, async (req, res) => {
    try {
      const message = sanitizeUserInput(req.body.message || '', 1000);
      if (!message) {
        res.status(400).json({ error: 'Message is required' });
        return;
      }
      const response = await aiEngine.chat(
        message,
        swarm.getSwarmStatus() as unknown as Record<string, unknown>,
      );
      res.json({ response, provider: aiEngine.getProvider() });
    } catch (error) {
      logger.error(`[API] AI chat failed: ${error}`);
      res.status(500).json({ error: safeError('AI chat failed') });
    }
  });

  app.post('/api/ai/threat-report', aiLimiter, async (req, res) => {
    try {
      const report = await aiEngine.generateThreatReport(req.body);
      res.json({ report, provider: aiEngine.getProvider() });
    } catch (error) {
      logger.error(`[API] Threat report failed: ${error}`);
      res.status(500).json({ error: safeError('Threat report generation failed') });
    }
  });

  app.post('/api/ai/market-risk', aiLimiter, async (req, res) => {
    try {
      const assessment = await aiEngine.predictMarketRisk(req.body);
      res.json({ assessment, provider: aiEngine.getProvider() });
    } catch (error) {
      logger.error(`[API] Market risk failed: ${error}`);
      res.status(500).json({ error: safeError('Market risk assessment failed') });
    }
  });

  app.get('/api/ai/status', (_, res) => {
    res.json({
      available: aiEngine.isAvailable(),
      provider: aiEngine.getProvider(),
      totalCalls: aiEngine.getTotalCalls(),
    });
  });

  // ============================================
  // HEALER — Self-Healing (auth required for mutations)
  // ============================================
  app.get('/api/healer/status', (_, res) => {
    try {
      const healer = swarm.getAgent<HealerAgent>(AgentType.HEALER);
      res.json(healer.getHealerStatus());
    } catch (error) {
      logger.error(`[API] Healer status failed: ${error}`);
      res.status(500).json({ error: safeError('Healer status failed') });
    }
  });

  app.get('/api/healer/incidents', (req, res) => {
    try {
      const healer = swarm.getAgent<HealerAgent>(AgentType.HEALER);
      const limit = Math.min(parseInt(req.query.limit as string) || 50, 200);
      res.json({ incidents: healer.getIncidentLog(limit) });
    } catch (error) {
      logger.error(`[API] Incident log failed: ${error}`);
      res.status(500).json({ error: safeError('Incident log failed') });
    }
  });

  app.get('/api/healer/actions', (req, res) => {
    try {
      const healer = swarm.getAgent<HealerAgent>(AgentType.HEALER);
      const limit = Math.min(parseInt(req.query.limit as string) || 50, 200);
      res.json({ actions: healer.getHealActions(limit) });
    } catch (error) {
      logger.error(`[API] Heal actions failed: ${error}`);
      res.status(500).json({ error: safeError('Heal actions failed') });
    }
  });

  app.post('/api/healer/decide', requireAuth, aiLimiter, async (req, res) => {
    try {
      const healer = swarm.getAgent<HealerAgent>(AgentType.HEALER);
      const context = sanitizeUserInput(req.body.context || 'General assessment', 500);
      const decision = await healer.makeAutonomousDecision(context);
      res.json(decision);
    } catch (error) {
      logger.error(`[API] Decision failed: ${error}`);
      res.status(500).json({ error: safeError('Autonomous decision failed') });
    }
  });

  app.post('/api/healer/autonomous-mode', requireAuth, mutationLimiter, (req, res) => {
    try {
      const healer = swarm.getAgent<HealerAgent>(AgentType.HEALER);
      healer.setAutonomousMode(req.body.enabled !== false);
      res.json({ success: true, autonomousMode: req.body.enabled !== false });
    } catch (error) {
      logger.error(`[API] Mode change failed: ${error}`);
      res.status(500).json({ error: safeError('Mode change failed') });
    }
  });

  // ============================================
  // SWAP — Risk-Aware Token Swapping
  // ============================================
  const jupiter = new JupiterClient();

  app.get('/api/swap/tokens', async (_, res) => {
    try {
      const tokens = await jupiter.getTokenList();
      res.json({ tokens, popular: POPULAR_TOKENS });
    } catch (error) {
      logger.error(`[API] Token list failed: ${error}`);
      res.status(500).json({ error: safeError('Failed to fetch tokens') });
    }
  });

  app.post('/api/swap/quote', async (req, res) => {
    try {
      const { inputMint, outputMint, amount, slippageBps } = req.body;
      if (!inputMint || !outputMint || !amount) {
        res.status(400).json({ error: 'inputMint, outputMint, and amount are required' });
        return;
      }

      if (!isValidSolanaAddress(inputMint) || !isValidSolanaAddress(outputMint)) {
        res.status(400).json({ error: 'Invalid token mint address' });
        return;
      }

      // Cap slippage at 1000 bps (10%)
      const safeSlippage = Math.min(slippageBps || 300, 1000);

      // Get quote from Jupiter
      const quote = await jupiter.getQuote({
        inputMint,
        outputMint,
        amount: Number(amount),
        slippageBps: safeSlippage,
      });

      // Auto risk-scan the output token
      let riskReport = null;
      let safeToSwap = true;
      let riskWarning: string | null = null;

      try {
        const scanner = swarm.getAgent<ScannerAgent>(AgentType.SCANNER);
        riskReport = await scanner.scanToken(outputMint);

        if (riskReport.threatLevel === ThreatLevel.CRITICAL || riskReport.threatLevel === ThreatLevel.HIGH) {
          safeToSwap = false;
          riskWarning = `BLOCKED: Token has ${riskReport.threatLevel} threat level (risk score: ${riskReport.riskScore}/100). ${riskReport.threats.length} threat(s) detected.`;
        } else if (riskReport.threatLevel === ThreatLevel.MEDIUM) {
          riskWarning = `WARNING: Token has MEDIUM threat level (risk score: ${riskReport.riskScore}/100). Proceed with caution.`;
        }
      } catch (scanError) {
        logger.warn(`[Swap] Risk scan failed: ${scanError}`);
        riskWarning = 'Risk scan unavailable — proceed with caution';
      }

      res.json({ quote, riskReport, safeToSwap, riskWarning });
    } catch (error) {
      logger.error(`[API] Quote failed: ${error}`);
      res.status(500).json({ error: safeError('Quote failed') });
    }
  });

  app.post('/api/swap/execute', swapLimiter, async (req, res) => {
    try {
      const { quoteResponse, userPublicKey, outputMint } = req.body;
      if (!quoteResponse || !userPublicKey) {
        res.status(400).json({ error: 'quoteResponse and userPublicKey are required' });
        return;
      }

      if (!isValidSolanaAddress(userPublicKey)) {
        res.status(400).json({ error: 'Invalid user public key' });
        return;
      }

      // Re-check risk before execution
      if (outputMint && isValidSolanaAddress(outputMint)) {
        try {
          const scanner = swarm.getAgent<ScannerAgent>(AgentType.SCANNER);
          const riskReport = await scanner.scanToken(outputMint);
          if (riskReport.threatLevel === ThreatLevel.CRITICAL || riskReport.threatLevel === ThreatLevel.HIGH) {
            res.status(403).json({
              error: 'SWAP BLOCKED',
              reason: `Token has ${riskReport.threatLevel} threat level`,
            });
            return;
          }
        } catch (scanError) {
          logger.warn(`[Swap] Pre-execution risk check failed: ${scanError}`);
        }
      }

      const swap = await jupiter.getSwapTransaction({
        quoteResponse,
        userPublicKey,
      });

      // Log swap to event bus
      swarm.getEventBus().emit(
        AgentType.GUARDIAN,
        'ALL',
        SwarmEventType.DEFENSE_EXECUTED,
        ThreatLevel.LOW,
        {
          action: 'SWAP_EXECUTED',
          inputMint: quoteResponse.inputMint,
          outputMint: quoteResponse.outputMint,
        },
      );

      logger.info(`[Swap] Transaction prepared for ${userPublicKey.slice(0, 8)}...`);
      res.json(swap);
    } catch (error) {
      logger.error(`[API] Swap execution failed: ${error}`);
      res.status(500).json({ error: safeError('Swap execution failed') });
    }
  });

  app.post('/api/swap/emergency-evacuate', swapLimiter, async (req, res) => {
    try {
      const { walletAddress, tokenAccounts } = req.body;
      if (!walletAddress || !isValidSolanaAddress(walletAddress)) {
        res.status(400).json({ error: 'Valid Solana wallet address is required' });
        return;
      }

      const scanner = swarm.getAgent<ScannerAgent>(AgentType.SCANNER);
      const USDC_MINT = 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v';
      const SOL_MINT = 'So11111111111111111111111111111111111111112';

      // Use provided token accounts or simulate with known tokens
      const tokens: Array<{ mint: string; amount: number; name?: string; symbol?: string }> =
        Array.isArray(tokenAccounts) ? tokenAccounts.slice(0, 50) : []; // Cap at 50 tokens

      const riskyTokens: Array<{
        mint: string;
        name: string;
        symbol: string;
        threatLevel: string;
        riskScore: number;
        estimatedUSDC: number | null;
        swapTransaction: string | null;
      }> = [];

      let totalEstimatedRecovery = 0;

      for (const token of tokens) {
        // Skip USDC and SOL — they're safe
        if (token.mint === USDC_MINT || token.mint === SOL_MINT) continue;
        if (!isValidSolanaAddress(token.mint)) continue;

        try {
          const riskReport = await scanner.scanToken(token.mint);

          if (riskReport.threatLevel === ThreatLevel.HIGH || riskReport.threatLevel === ThreatLevel.CRITICAL) {
            // Get price estimate
            const price = await jupiter.getTokenPrice(token.mint);
            const estimatedUSDC = price ? price * token.amount : null;
            if (estimatedUSDC) totalEstimatedRecovery += estimatedUSDC;

            let swapTx: string | null = null;
            try {
              const swapResult = await jupiter.emergencySwapToUSDC(
                token.mint,
                token.amount,
                walletAddress,
              );
              swapTx = swapResult?.swapTransaction || null;
            } catch {
              // Swap may fail for illiquid tokens
            }

            riskyTokens.push({
              mint: token.mint,
              name: riskReport.tokenName || token.name || 'Unknown',
              symbol: riskReport.tokenSymbol || token.symbol || '???',
              threatLevel: riskReport.threatLevel,
              riskScore: riskReport.riskScore,
              estimatedUSDC,
              swapTransaction: swapTx,
            });
          }
        } catch {
          // Skip tokens that fail scanning
        }
      }

      logger.warn(`[Swap] Emergency evacuate: found ${riskyTokens.length} risky tokens`);

      res.json({ riskyTokens, totalEstimatedRecovery, walletAddress });
    } catch (error) {
      logger.error(`[API] Emergency evacuate failed: ${error}`);
      res.status(500).json({ error: safeError('Emergency evacuate failed') });
    }
  });

  app.get('/api/swap/price/:tokenMint', async (req, res) => {
    try {
      if (!isValidSolanaAddress(req.params.tokenMint)) {
        res.status(400).json({ error: 'Invalid token mint address' });
        return;
      }
      const price = await jupiter.getTokenPrice(req.params.tokenMint);
      res.json({ mint: req.params.tokenMint, price });
    } catch (error) {
      logger.error(`[API] Price fetch failed: ${error}`);
      res.status(500).json({ error: safeError('Price fetch failed') });
    }
  });

  return app;
}
