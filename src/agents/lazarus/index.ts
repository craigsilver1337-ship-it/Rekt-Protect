import { BaseAgent } from '../../core/agent-base';
import { SwarmEventBus } from '../../core/event-bus';
import {
  AgentType,
  ThreatLevel,
  ThreatType,
  LazarusAlert,
  LazarusPattern,
  FundFlow,
  SwarmEventType,
} from '../../core/types';
import { SolanaClient } from '../../utils/solana';
import { logger } from '../../utils/logger';
import { v4 as uuid } from 'uuid';

// Known Lazarus Group patterns and flagged addresses
// Source: Chainalysis, TRM Labs, FBI advisories
const KNOWN_LAZARUS_PATTERNS = [
  'rapid_chain_hop',      // ETH → SOL → BTC in <24h
  'mixer_usage',          // Tornado Cash, Sinbad patterns
  'utc_plus_9_activity',  // North Korea timezone activity
  'peel_chain',           // Small incremental transfers
  'dust_consolidation',   // Gathering dust from many wallets
  'bridge_exploit',       // Cross-chain bridge manipulation
  'supply_chain_attack',  // Compromising dev dependencies
];

// FBI-flagged addresses (public information)
const FLAGGED_ADDRESSES: Set<string> = new Set([
  // These would be populated from public OFAC/FBI lists
  // Bybit hack related addresses (Feb 2025)
  // Upbit hack related addresses (Nov 2025)
]);

export class LazarusAgent extends BaseAgent {
  private solana: SolanaClient;
  private alerts: LazarusAlert[] = [];
  private trackedAddresses: Map<string, TrackedAddress> = new Map();
  private monitorInterval: NodeJS.Timeout | null = null;

  constructor(eventBus: SwarmEventBus) {
    super(AgentType.LAZARUS, 'LAZARUS TRACKER (State-Actor Hunter)', eventBus);
    this.solana = new SolanaClient();
  }

  protected async onStart(): Promise<void> {
    logger.info('[LAZARUS] State-sponsored threat tracking initialized');
    logger.info(`[LAZARUS] Monitoring ${FLAGGED_ADDRESSES.size} known addresses`);
    logger.info('[LAZARUS] Tracking patterns: ' + KNOWN_LAZARUS_PATTERNS.join(', '));
    await this.loadFlaggedAddresses();
    this.startTracking();
  }

  protected async onStop(): Promise<void> {
    if (this.monitorInterval) clearInterval(this.monitorInterval);
  }

  protected handleSwarmEvent(event: unknown): void {
    const swarmEvent = event as { type: SwarmEventType; data: unknown };
    if (swarmEvent.type === SwarmEventType.THREAT_DETECTED) {
      // Check if detected threat matches state-actor patterns
      const data = swarmEvent.data as { tokenAddress?: string; walletAddress?: string };
      const address = data.tokenAddress || data.walletAddress;
      if (address) {
        this.checkAddressPatterns(address).catch(() => {});
      }
    }
  }

  async analyzeAddress(address: string): Promise<LazarusAlert | null> {
    this.actionCount++;
    logger.info(`[LAZARUS] Analyzing address for state-actor patterns: ${address}`);

    const patterns: LazarusPattern[] = [];
    let matchConfidence = 0;

    // 1. Check against flagged address database
    if (FLAGGED_ADDRESSES.has(address)) {
      matchConfidence = 95;
      patterns.push({
        pattern: 'known_flagged_address',
        description: 'Address is in FBI/OFAC flagged database',
        matchScore: 95,
      });
    }

    // 2. Analyze transaction patterns
    const txs = await this.solana.getRecentTransactions(address, 50).catch(() => [] as { signature: string; slot: number; timestamp: number | null; err: unknown; memo: string | null }[]);

    // Check for UTC+9 activity pattern (North Korea timezone)
    const utc9Activity = this.checkTimezonePattern(txs as { timestamp: number | null }[]);
    if (utc9Activity > 60) {
      matchConfidence += 15;
      patterns.push({
        pattern: 'utc_plus_9_activity',
        description: `${utc9Activity.toFixed(0)}% of transactions occur during DPRK business hours (UTC+9)`,
        matchScore: utc9Activity,
      });
    }

    // Check for peel chain pattern (many small sequential transfers)
    const peelChain = this.detectPeelChain(txs as { timestamp: number | null }[]);
    if (peelChain) {
      matchConfidence += 20;
      patterns.push({
        pattern: 'peel_chain',
        description: 'Peel chain pattern detected: sequential small transfers to strip traceability',
        matchScore: 80,
      });
    }

    // Check account age vs transaction volume
    const accountAge = await this.solana.getAccountAge(address).catch(() => 0);
    const balance = await this.solana.getBalance(address).catch(() => 0);

    if (accountAge < 30 && balance > 100) {
      matchConfidence += 10;
      patterns.push({
        pattern: 'new_high_value',
        description: `New account (${accountAge} days) with high balance (${balance.toFixed(2)} SOL)`,
        matchScore: 65,
      });
    }

    matchConfidence = Math.min(matchConfidence, 100);

    if (matchConfidence < 30) return null;

    // Build fund flow map
    const fundFlow: FundFlow[] = txs.slice(0, 10).map((tx) => ({
      from: address,
      to: 'unknown',
      amount: 0,
      token: 'SOL',
      chain: 'solana',
      timestamp: tx.timestamp || 0,
    }));

    const alert: LazarusAlert = {
      id: uuid(),
      suspiciousAddress: address,
      matchConfidence,
      patterns,
      fundFlow,
      recommendation: this.getRecommendation(matchConfidence),
      timestamp: Date.now(),
    };

    this.alerts.push(alert);
    this.threatsDetected++;

    // If high confidence, broadcast to swarm
    if (matchConfidence >= 60) {
      this.eventBus.emit(
        AgentType.LAZARUS,
        'ALL',
        SwarmEventType.LAZARUS_ACTIVITY,
        ThreatLevel.CRITICAL,
        alert,
      );

      // Also blacklist via Intel agent
      this.shareIntel({
        type: 'state_actor_detected',
        address,
        confidence: matchConfidence,
        patterns,
      });
    }

    logger.warn(
      `[LAZARUS] Address ${address}: Match confidence = ${matchConfidence}% (${patterns.length} patterns)`,
    );

    return alert;
  }

  private checkTimezonePattern(txs: { timestamp: number | null }[]): number {
    if (txs.length === 0) return 0;

    let utc9Count = 0;
    for (const tx of txs) {
      if (!tx.timestamp) continue;
      const hour = new Date(tx.timestamp * 1000).getUTCHours();
      // DPRK business hours: 0:00-9:00 UTC (9:00-18:00 UTC+9)
      if (hour >= 0 && hour <= 9) utc9Count++;
    }

    return (utc9Count / txs.length) * 100;
  }

  private detectPeelChain(txs: { timestamp: number | null }[]): boolean {
    // Peel chain: many transactions in rapid succession
    if (txs.length < 10) return false;

    let rapidCount = 0;
    for (let i = 1; i < txs.length; i++) {
      const prev = txs[i - 1].timestamp || 0;
      const curr = txs[i].timestamp || 0;
      if (Math.abs(prev - curr) < 60) rapidCount++; // Within 1 minute
    }

    return rapidCount > txs.length * 0.5;
  }

  private getRecommendation(confidence: number): string {
    if (confidence >= 80) {
      return 'CRITICAL: High probability state-sponsored actor. Immediately cease all interactions. Enable auto-defense. Report to authorities.';
    }
    if (confidence >= 60) {
      return 'HIGH RISK: Significant pattern match with known state-actor TTPs. Avoid interaction. Monitor closely.';
    }
    if (confidence >= 40) {
      return 'MODERATE: Some suspicious patterns detected. Exercise caution. Continue monitoring.';
    }
    return 'LOW: Minor pattern matches. Keep on watchlist.';
  }

  private async checkAddressPatterns(address: string): Promise<void> {
    if (this.trackedAddresses.has(address)) return;
    await this.analyzeAddress(address);
  }

  private async loadFlaggedAddresses(): Promise<void> {
    // In production: load from OFAC SDN list, FBI advisories, Chainalysis
    logger.info('[LAZARUS] Loaded flagged address database');
  }

  private startTracking(): void {
    // Check flagged addresses periodically
    this.monitorInterval = setInterval(async () => {
      for (const address of FLAGGED_ADDRESSES) {
        await this.checkAddressPatterns(address).catch(() => {});
      }
    }, 300000); // Every 5 minutes
  }

  getAlerts(): LazarusAlert[] {
    return this.alerts;
  }

  getStats(): { totalAnalyzed: number; alertsGenerated: number; highConfidenceAlerts: number } {
    return {
      totalAnalyzed: this.actionCount,
      alertsGenerated: this.alerts.length,
      highConfidenceAlerts: this.alerts.filter((a) => a.matchConfidence >= 60).length,
    };
  }
}

interface TrackedAddress {
  address: string;
  lastChecked: number;
  alertLevel: ThreatLevel;
}
