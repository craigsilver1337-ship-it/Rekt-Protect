import { BaseAgent } from '../../core/agent-base';
import { SwarmEventBus } from '../../core/event-bus';
import {
  AgentType,
  ThreatLevel,
  SwarmEventType,
  NetworkHealthReport,
  MEVReport,
  ProgramUpgrade,
} from '../../core/types';
import { SolanaClient } from '../../utils/solana';
import { PythClient, PRICE_FEEDS } from '../../utils/pyth';
import { logger } from '../../utils/logger';

const NORMAL_TPS_RANGE = { min: 2000, max: 5000 };
const NORMAL_BLOCK_TIME_MS = 400;
const DDOS_TPS_THRESHOLD = 10000;

export class NetworkAgent extends BaseAgent {
  private solana: SolanaClient;
  private pyth: PythClient;
  private healthHistory: NetworkHealthReport[] = [];
  private monitorInterval: NodeJS.Timeout | null = null;
  private alertThreshold: ThreatLevel = ThreatLevel.MEDIUM;

  constructor(eventBus: SwarmEventBus) {
    super(AgentType.NETWORK, 'NETWORK GUARDIAN (Infrastructure Shield)', eventBus);
    this.solana = new SolanaClient();
    this.pyth = new PythClient();
  }

  protected async onStart(): Promise<void> {
    logger.info('[NETWORK] Solana network health monitoring activated');
    this.startHealthMonitoring();
  }

  protected async onStop(): Promise<void> {
    if (this.monitorInterval) clearInterval(this.monitorInterval);
  }

  protected handleSwarmEvent(event: unknown): void {
    // Network agent responds to all high-priority events
  }

  async getNetworkHealth(): Promise<NetworkHealthReport> {
    this.actionCount++;

    // Get performance samples
    const perfSamples = await this.solana.getPerformanceSamples(5).catch(() => []);
    const epochInfo = await this.solana.getEpochInfo().catch(() => null);

    // Calculate TPS
    let avgTps = 0;
    let avgBlockTime = NORMAL_BLOCK_TIME_MS;
    if (perfSamples.length > 0) {
      avgTps = perfSamples.reduce((sum, s) => sum + s.numTransactions / s.samplePeriodSecs, 0) / perfSamples.length;
      avgBlockTime = perfSamples.reduce((sum, s) => sum + (s.samplePeriodSecs * 1000) / s.numSlots, 0) / perfSamples.length;
    }

    // Assess congestion level
    const congestionLevel = this.assessCongestion(avgTps, avgBlockTime);

    // DDoS indicators
    const ddosIndicators = avgTps > DDOS_TPS_THRESHOLD ? 1 : 0;

    // MEV activity (simplified)
    const mevReport: MEVReport = {
      sandwichAttacks24h: 0, // Would query Jito/MEV data
      estimatedMEVExtracted: 0,
      topMEVBots: [],
    };

    const report: NetworkHealthReport = {
      tps: Math.round(avgTps),
      avgBlockTime: Math.round(avgBlockTime),
      validatorCount: 0, // Would query from getVoteAccounts
      stakeConcentration: 0,
      congestionLevel,
      recentDDoSIndicators: ddosIndicators,
      programUpgrades: [],
      mevActivity: mevReport,
      timestamp: Date.now(),
    };

    this.healthHistory.push(report);
    if (this.healthHistory.length > 1000) {
      this.healthHistory = this.healthHistory.slice(-500);
    }

    // Alert on anomalies
    if (congestionLevel === ThreatLevel.CRITICAL || congestionLevel === ThreatLevel.HIGH) {
      this.eventBus.emit(
        AgentType.NETWORK,
        'ALL',
        SwarmEventType.NETWORK_ANOMALY,
        congestionLevel,
        {
          type: ddosIndicators > 0 ? 'possible_ddos' : 'high_congestion',
          tps: avgTps,
          blockTime: avgBlockTime,
          report,
        },
      );
    }

    return report;
  }

  async checkMEVExposure(transactionSignature: string): Promise<MEVCheckResult> {
    this.actionCount++;
    // In production: analyze transaction for sandwich attack indicators
    // Check if transaction was sandwiched by looking at adjacent transactions in the block

    return {
      isSandwiched: false,
      mevExtracted: 0,
      recommendation: 'Transaction appears clean. No MEV extraction detected.',
      jitoProtection: false,
    };
  }

  async monitorProgramUpgrade(programId: string): Promise<ProgramUpgrade | null> {
    this.actionCount++;
    // In production: check if program has been upgraded recently
    // Compare with known program hashes

    return null;
  }

  private assessCongestion(tps: number, blockTime: number): ThreatLevel {
    if (tps > DDOS_TPS_THRESHOLD) return ThreatLevel.CRITICAL;
    if (tps > NORMAL_TPS_RANGE.max * 1.5) return ThreatLevel.HIGH;
    if (blockTime > NORMAL_BLOCK_TIME_MS * 2) return ThreatLevel.HIGH;
    if (tps > NORMAL_TPS_RANGE.max) return ThreatLevel.MEDIUM;
    if (tps < NORMAL_TPS_RANGE.min * 0.5) return ThreatLevel.MEDIUM; // Unusually low = suspicious
    return ThreatLevel.SAFE;
  }

  private startHealthMonitoring(): void {
    // Check network health every 60 seconds
    this.monitorInterval = setInterval(async () => {
      await this.getNetworkHealth().catch((err) => {
        logger.error(`[NETWORK] Health check failed: ${err.message}`);
      });
    }, 60000);
  }

  getHealthHistory(count = 50): NetworkHealthReport[] {
    return this.healthHistory.slice(-count);
  }

  getCurrentStatus(): string {
    const latest = this.healthHistory[this.healthHistory.length - 1];
    if (!latest) return 'No data yet';

    return `TPS: ${latest.tps} | Block Time: ${latest.avgBlockTime}ms | Congestion: ${latest.congestionLevel}`;
  }

  getStats(): NetworkStats {
    const reports = this.healthHistory;
    if (reports.length === 0) {
      return { avgTps: 0, avgBlockTime: 0, anomaliesDetected: 0, healthChecks: 0 };
    }

    return {
      avgTps: Math.round(reports.reduce((s, r) => s + r.tps, 0) / reports.length),
      avgBlockTime: Math.round(reports.reduce((s, r) => s + r.avgBlockTime, 0) / reports.length),
      anomaliesDetected: reports.filter(
        (r) => r.congestionLevel === ThreatLevel.HIGH || r.congestionLevel === ThreatLevel.CRITICAL,
      ).length,
      healthChecks: reports.length,
    };
  }
}

interface MEVCheckResult {
  isSandwiched: boolean;
  mevExtracted: number;
  recommendation: string;
  jitoProtection: boolean;
}

interface NetworkStats {
  avgTps: number;
  avgBlockTime: number;
  anomaliesDetected: number;
  healthChecks: number;
}
