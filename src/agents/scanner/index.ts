import { BaseAgent } from '../../core/agent-base';
import { SwarmEventBus } from '../../core/event-bus';
import {
  AgentType,
  ThreatLevel,
  ThreatType,
  ThreatDetail,
  TokenRiskReport,
  SwarmEventType,
} from '../../core/types';
import { SolanaClient } from '../../utils/solana';
import { JupiterClient } from '../../utils/jupiter';
import { HeliusClient } from '../../utils/helius';
import { AIEngine, AITokenAnalysis } from '../../utils/ai-engine';
import { logger } from '../../utils/logger';

// Trusted tokens that should never be flagged (major stablecoins, native tokens, etc.)
const TRUSTED_TOKENS = new Set([
  'So11111111111111111111111111111111111111112',   // SOL (Wrapped SOL)
  'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v', // USDC
  'Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB', // USDT
  'JUPyiwrYJFskUPiHa7hkeR8VUtAeFoSYbKedZNsDvCN',  // JUP
  '4k3Dyjzvzp8eMZWUXbBCjEvwSkkk59S5iCNLY3QrkX6R', // RAY
  'DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263', // BONK
  'EKpQGSJtjMFqKZ9KQanSqYXRcF8fBopzLHYxdM65zcjm', // WIF
  'HZ1JovNiVvGrGNiiYvEozEVgZ58xaU3RKwX8eACQBCt3', // PYTH
  'mSoLzYCxHdYgdzU16g5QSh3i5K3z3KZK7ytfqcJm7So',  // mSOL
  'bSo13r4TkiE4KumL71LsHTPpL2euBYLFx6h9HP3piy1',  // bSOL
  '7dHbWXmci3dT8UFYWYZweBLXgycu7Y3iL6trKn1Y7ARj', // stSOL
  'jtojtomepa8beP8AuQc6eXt5FriJwfFMwQx2v2f9mCL',  // JTO
  'WENWENvqqNya429ubCdR81ZmD69brwQaaBYY6p91oHk',   // WEN
]);

export class ScannerAgent extends BaseAgent {
  private solana: SolanaClient;
  private jupiter: JupiterClient;
  private helius: HeliusClient;
  private ai: AIEngine;
  private scanCache: Map<string, TokenRiskReport> = new Map();
  private knownScammers: Set<string> = new Set();

  constructor(eventBus: SwarmEventBus) {
    super(AgentType.SCANNER, 'SCANNER (T-Cell)', eventBus);
    this.solana = new SolanaClient();
    this.jupiter = new JupiterClient();
    this.helius = new HeliusClient();
    this.ai = new AIEngine();
  }

  protected async onStart(): Promise<void> {
    logger.info('[SCANNER] Token risk analysis engine initialized');
    await this.loadKnownScammers();
  }

  protected async onStop(): Promise<void> {
    this.scanCache.clear();
  }

  protected handleSwarmEvent(event: unknown): void {
    // React to intel updates about new scammer addresses
    const swarmEvent = event as { type: SwarmEventType; data: unknown };
    if (swarmEvent.type === SwarmEventType.PATTERN_LEARNED) {
      const data = swarmEvent.data as { scammerAddress?: string };
      if (data.scammerAddress) {
        this.knownScammers.add(data.scammerAddress);
      }
    }
  }

  async scanToken(mintAddress: string): Promise<TokenRiskReport> {
    // Check cache (valid for 5 minutes)
    const cached = this.scanCache.get(mintAddress);
    if (cached && Date.now() - cached.timestamp < 300000) {
      return cached;
    }

    logger.info(`[SCANNER] Scanning token: ${mintAddress}`);
    this.actionCount++;

    // Trusted tokens bypass — USDC, USDT, SOL, etc.
    if (TRUSTED_TOKENS.has(mintAddress)) {
      const safeReport: TokenRiskReport = {
        tokenAddress: mintAddress,
        tokenName: '',
        tokenSymbol: '',
        riskScore: 0,
        threatLevel: ThreatLevel.SAFE,
        threats: [],
        liquidity: { totalLiquidity: 0, isLocked: false, lockDuration: null, lockPercentage: 0, top5HoldersPercentage: 0, lpBurnPercentage: 0 },
        devWallet: { address: 'trusted', holdingPercentage: 0, transactionCount: 0, age: 9999, hasMultipleTokens: false, previousRugs: 0, isKnownScammer: false },
        permissions: { mintAuthority: false, freezeAuthority: false, upgradeAuthority: false, ownerCanModify: false, isRenounced: true },
        prediction: { rugProbability: 0, timeHorizon: '48h', confidence: 99, signals: ['Verified trusted token'] },
        timestamp: Date.now(),
      };
      this.scanCache.set(mintAddress, safeReport);
      logger.info(`[SCANNER] Token ${mintAddress}: TRUSTED — bypassed risk checks`);
      return safeReport;
    }

    const threats: ThreatDetail[] = [];
    let riskScore = 0;

    // 1. Check mint info (permissions)
    const mintInfo = await this.solana.getTokenMintInfo(mintAddress).catch(() => null);
    if (mintInfo) {
      // Mint authority not renounced
      if (mintInfo.mintAuthority) {
        riskScore += 25;
        threats.push({
          type: ThreatType.MINT_EXPLOIT,
          severity: ThreatLevel.HIGH,
          description: 'Mint authority is NOT renounced. Unlimited tokens can be created.',
          evidence: `Mint authority: ${mintInfo.mintAuthority}`,
          confidence: 95,
        });
      }

      // Freeze authority present
      if (mintInfo.freezeAuthority) {
        riskScore += 20;
        threats.push({
          type: ThreatType.FREEZE_EXPLOIT,
          severity: ThreatLevel.HIGH,
          description: 'Freeze authority present. Your tokens can be frozen anytime.',
          evidence: `Freeze authority: ${mintInfo.freezeAuthority}`,
          confidence: 95,
        });
      }
    }

    // 2. Check holder concentration
    const holders = await this.solana.getTokenHolders(mintAddress).catch(() => []);
    if (holders.length > 0 && mintInfo) {
      const totalSupply = mintInfo.supply / Math.pow(10, mintInfo.decimals);
      let top5Total = 0;
      for (const holder of holders.slice(0, 5)) {
        holder.percentage = (holder.amount / totalSupply) * 100;
        top5Total += holder.percentage;
      }

      if (top5Total > 80) {
        riskScore += 30;
        threats.push({
          type: ThreatType.RUG_PULL,
          severity: ThreatLevel.CRITICAL,
          description: `Top 5 holders own ${top5Total.toFixed(1)}% of supply. Extreme rug pull risk.`,
          evidence: `Top holder: ${holders[0]?.address} (${holders[0]?.percentage.toFixed(1)}%)`,
          confidence: 90,
        });
      } else if (top5Total > 50) {
        riskScore += 15;
        threats.push({
          type: ThreatType.RUG_PULL,
          severity: ThreatLevel.MEDIUM,
          description: `Top 5 holders own ${top5Total.toFixed(1)}% of supply. Moderate concentration.`,
          evidence: `Top holder: ${holders[0]?.address}`,
          confidence: 75,
        });
      }
    }

    // 3. Check dev wallet age and history
    if (mintInfo?.mintAuthority) {
      const devAge = await this.solana.getAccountAge(mintInfo.mintAuthority).catch(() => 0);

      if (devAge < 7) {
        riskScore += 15;
        threats.push({
          type: ThreatType.RUG_PULL,
          severity: ThreatLevel.HIGH,
          description: `Developer wallet is only ${devAge} days old. New wallet = high risk.`,
          evidence: `Dev wallet age: ${devAge} days`,
          confidence: 80,
        });
      }

      // Check if dev is known scammer
      if (this.knownScammers.has(mintInfo.mintAuthority)) {
        riskScore = 100;
        threats.push({
          type: ThreatType.RUG_PULL,
          severity: ThreatLevel.CRITICAL,
          description: 'Developer wallet is a KNOWN SCAMMER from REKT Shield database.',
          evidence: `Blacklisted address: ${mintInfo.mintAuthority}`,
          confidence: 99,
        });
      }
    }

    // 4. Check token price and liquidity
    const price = await this.jupiter.getTokenPrice(mintAddress);
    if (price === null || price === 0) {
      riskScore += 10;
      threats.push({
        type: ThreatType.HONEYPOT_TOKEN,
        severity: ThreatLevel.MEDIUM,
        description: 'No price data available. Token may be illiquid or a honeypot.',
        evidence: 'Jupiter price API returned no data',
        confidence: 60,
      });
    }

    // Determine threat level
    const threatLevel = this.scoreToThreatLevel(riskScore);

    const report: TokenRiskReport = {
      tokenAddress: mintAddress,
      tokenName: '',
      tokenSymbol: '',
      riskScore: Math.min(riskScore, 100),
      threatLevel,
      threats,
      liquidity: {
        totalLiquidity: 0,
        isLocked: false,
        lockDuration: null,
        lockPercentage: 0,
        top5HoldersPercentage: 0,
        lpBurnPercentage: 0,
      },
      devWallet: {
        address: mintInfo?.mintAuthority || 'renounced',
        holdingPercentage: 0,
        transactionCount: 0,
        age: 0,
        hasMultipleTokens: false,
        previousRugs: 0,
        isKnownScammer: mintInfo?.mintAuthority
          ? this.knownScammers.has(mintInfo.mintAuthority)
          : false,
      },
      permissions: {
        mintAuthority: !!mintInfo?.mintAuthority,
        freezeAuthority: !!mintInfo?.freezeAuthority,
        upgradeAuthority: false,
        ownerCanModify: !!mintInfo?.mintAuthority || !!mintInfo?.freezeAuthority,
        isRenounced: !mintInfo?.mintAuthority && !mintInfo?.freezeAuthority,
      },
      prediction: {
        rugProbability: Math.min(riskScore * 1.1, 100),
        timeHorizon: '48h',
        confidence: 70,
        signals: threats.map((t) => t.description),
      },
      timestamp: Date.now(),
    };

    // AI-Enhanced Analysis — deep threat intelligence
    let aiAnalysis: AITokenAnalysis | null = null;
    if (this.ai.isAvailable()) {
      try {
        aiAnalysis = await this.ai.analyzeTokenRisk({
          mintAddress,
          riskScore,
          threats: threats.map(t => ({ type: t.type, severity: t.severity, description: t.description })),
          mintAuthority: !!mintInfo?.mintAuthority,
          freezeAuthority: !!mintInfo?.freezeAuthority,
          holdersCount: holders.length,
          price,
        });

        // Merge AI risk score with rule-based score (weighted average)
        if (aiAnalysis.aiRiskScore > 0) {
          report.riskScore = Math.min(
            Math.round(riskScore * 0.4 + aiAnalysis.aiRiskScore * 0.6),
            100,
          );
          report.threatLevel = this.scoreToThreatLevel(report.riskScore);
        }

        // Add AI red flags as additional threats
        for (const flag of aiAnalysis.redFlags) {
          report.threats.push({
            type: ThreatType.RUG_PULL,
            severity: ThreatLevel.MEDIUM,
            description: `[AI] ${flag}`,
            evidence: `AI analysis by ${this.ai.getProvider()}`,
            confidence: 85,
          });
        }

        logger.info(`[SCANNER] AI enhanced score: ${report.riskScore}/100 (rule: ${riskScore}, AI: ${aiAnalysis.aiRiskScore})`);
      } catch (error) {
        logger.warn(`[SCANNER] AI analysis failed, using rule-based only: ${error}`);
      }
    }

    // Cache the result
    this.scanCache.set(mintAddress, report);

    // Broadcast threat if high risk
    if (report.threatLevel === ThreatLevel.CRITICAL || report.threatLevel === ThreatLevel.HIGH) {
      this.broadcastThreat(report.threatLevel, report);
    }

    // Share intel with INTEL agent
    this.shareIntel({ type: 'scan_result', report, aiAnalysis });

    logger.info(
      `[SCANNER] Token ${mintAddress}: Risk=${report.riskScore}/100 Level=${report.threatLevel}`,
    );

    return report;
  }

  private scoreToThreatLevel(score: number): ThreatLevel {
    if (score >= 80) return ThreatLevel.CRITICAL;
    if (score >= 60) return ThreatLevel.HIGH;
    if (score >= 40) return ThreatLevel.MEDIUM;
    if (score >= 20) return ThreatLevel.LOW;
    return ThreatLevel.SAFE;
  }

  private async loadKnownScammers(): Promise<void> {
    // Pre-loaded known scammer addresses
    // In production, this would sync from the on-chain Threat Registry
    this.knownScammers = new Set([
      // Placeholder — populated from INTEL agent's on-chain registry
    ]);
    logger.info(`[SCANNER] Loaded ${this.knownScammers.size} known scammer addresses`);
  }

  getCachedReport(mintAddress: string): TokenRiskReport | undefined {
    return this.scanCache.get(mintAddress);
  }

  getScannedCount(): number {
    return this.scanCache.size;
  }
}
