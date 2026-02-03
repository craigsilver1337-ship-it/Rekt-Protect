import express from 'express';
import cors from 'cors';
import { RektShieldSwarm } from '../core/swarm';
import { AgentType } from '../core/types';
import { ScannerAgent } from '../agents/scanner';
import { SentinelAgent } from '../agents/sentinel';
import { GuardianAgent } from '../agents/guardian';
import { IntelAgent } from '../agents/intel';
import { QuantumAgent } from '../agents/quantum';
import { LazarusAgent } from '../agents/lazarus';
import { HoneypotAgent } from '../agents/honeypot';
import { ProphetAgent } from '../agents/prophet';
import { NetworkAgent } from '../agents/network';
import { logger } from '../utils/logger';

export function createAPIServer(swarm: RektShieldSwarm): express.Application {
  const app = express();
  app.use(cors());
  app.use(express.json());

  // ============================================
  // HEALTH & STATUS
  // ============================================
  app.get('/api/health', (_, res) => {
    res.json({ status: 'ok', name: 'REKT Shield', version: '1.0.0', agents: 10 });
  });

  app.get('/api/status', (_, res) => {
    res.json(swarm.getSwarmStatus());
  });

  // ============================================
  // SCANNER — Token Risk Analysis
  // ============================================
  app.get('/api/scan/:tokenAddress', async (req, res) => {
    try {
      const scanner = swarm.getAgent<ScannerAgent>(AgentType.SCANNER);
      const report = await scanner.scanToken(req.params.tokenAddress);
      res.json(report);
    } catch (error) {
      res.status(500).json({ error: `Scan failed: ${error}` });
    }
  });

  // ============================================
  // SENTINEL — Wallet Monitoring
  // ============================================
  app.post('/api/monitor/wallet', (req, res) => {
    try {
      const sentinel = swarm.getAgent<SentinelAgent>(AgentType.SENTINEL);
      sentinel.addWallet({
        walletAddress: req.body.walletAddress,
        alertThreshold: req.body.alertThreshold || 'medium',
        autoDefend: req.body.autoDefend || false,
        safetyWallet: req.body.safetyWallet,
        maxSlippage: req.body.maxSlippage || 3,
      });
      res.json({ success: true, message: `Now monitoring ${req.body.walletAddress}` });
    } catch (error) {
      res.status(500).json({ error: `Monitor failed: ${error}` });
    }
  });

  app.get('/api/monitor/wallets', (_, res) => {
    const sentinel = swarm.getAgent<SentinelAgent>(AgentType.SENTINEL);
    res.json({ wallets: sentinel.getMonitoredWallets() });
  });

  app.get('/api/alerts', (req, res) => {
    const sentinel = swarm.getAgent<SentinelAgent>(AgentType.SENTINEL);
    res.json({ alerts: sentinel.getAlerts(req.query.wallet as string) });
  });

  // ============================================
  // GUARDIAN — Defense Log
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
  // INTEL — Threat Registry
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
    const intel = swarm.getAgent<IntelAgent>(AgentType.INTEL);
    const threat = intel.getThreat(req.params.address);
    const attacker = intel.getAttacker(req.params.address);
    res.json({ threat, attacker, isBlacklisted: intel.isBlacklisted(req.params.address) });
  });

  // ============================================
  // QUANTUM — Quantum Readiness
  // ============================================
  app.get('/api/quantum/assess/:walletAddress', async (req, res) => {
    try {
      const quantum = swarm.getAgent<QuantumAgent>(AgentType.QUANTUM);
      const report = await quantum.assessWalletQuantumReadiness(req.params.walletAddress);
      res.json(report);
    } catch (error) {
      res.status(500).json({ error: `Quantum assessment failed: ${error}` });
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
  // LAZARUS — State-Actor Tracking
  // ============================================
  app.get('/api/lazarus/analyze/:address', async (req, res) => {
    try {
      const lazarus = swarm.getAgent<LazarusAgent>(AgentType.LAZARUS);
      const alert = await lazarus.analyzeAddress(req.params.address);
      res.json({ alert, isStateSponsoredThreat: alert && alert.matchConfidence >= 60 });
    } catch (error) {
      res.status(500).json({ error: `Lazarus analysis failed: ${error}` });
    }
  });

  app.get('/api/lazarus/alerts', (_, res) => {
    const lazarus = swarm.getAgent<LazarusAgent>(AgentType.LAZARUS);
    res.json({ alerts: lazarus.getAlerts(), stats: lazarus.getStats() });
  });

  // ============================================
  // HONEYPOT — Active Defense
  // ============================================
  app.post('/api/honeypot/deploy', async (req, res) => {
    try {
      const honeypot = swarm.getAgent<HoneypotAgent>(AgentType.HONEYPOT);
      const deployment = await honeypot.deployHoneypot({
        baitAmount: req.body.baitAmount,
        baitToken: req.body.baitToken,
      });
      res.json(deployment);
    } catch (error) {
      res.status(500).json({ error: `Honeypot deployment failed: ${error}` });
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
  // PROPHET — Predictions
  // ============================================
  app.get('/api/predict/:tokenAddress', async (req, res) => {
    try {
      const prophet = swarm.getAgent<ProphetAgent>(AgentType.PROPHET);
      const prediction = await prophet.predictRugPull(req.params.tokenAddress);
      res.json(prediction);
    } catch (error) {
      res.status(500).json({ error: `Prediction failed: ${error}` });
    }
  });

  app.get('/api/predict/whales/:tokenAddress', async (req, res) => {
    try {
      const prophet = swarm.getAgent<ProphetAgent>(AgentType.PROPHET);
      const whaleAlerts = await prophet.detectWhaleMovements(req.params.tokenAddress);
      res.json({ whaleAlerts });
    } catch (error) {
      res.status(500).json({ error: `Whale detection failed: ${error}` });
    }
  });

  app.get('/api/sentiment', async (_, res) => {
    try {
      const prophet = swarm.getAgent<ProphetAgent>(AgentType.PROPHET);
      const sentiment = await prophet.analyzeMarketSentiment();
      res.json(sentiment);
    } catch (error) {
      res.status(500).json({ error: `Sentiment analysis failed: ${error}` });
    }
  });

  // ============================================
  // NETWORK — Solana Health
  // ============================================
  app.get('/api/network/health', async (_, res) => {
    try {
      const network = swarm.getAgent<NetworkAgent>(AgentType.NETWORK);
      const health = await network.getNetworkHealth();
      res.json(health);
    } catch (error) {
      res.status(500).json({ error: `Network health check failed: ${error}` });
    }
  });

  app.get('/api/network/stats', (_, res) => {
    const network = swarm.getAgent<NetworkAgent>(AgentType.NETWORK);
    res.json(network.getStats());
  });

  // ============================================
  // SWARM — Cross-Agent Events
  // ============================================
  app.get('/api/events', (_, res) => {
    const events = swarm.getEventBus().getRecentEvents(100);
    res.json({ events, stats: swarm.getEventBus().getStats() });
  });

  app.get('/api/events/critical', (_, res) => {
    const events = swarm.getEventBus().getCriticalEvents();
    res.json({ events });
  });

  return app;
}
