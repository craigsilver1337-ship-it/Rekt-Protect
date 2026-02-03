import { BaseAgent } from '../../core/agent-base';
import { SwarmEventBus } from '../../core/event-bus';
import {
  AgentType,
  ThreatLevel,
  ThreatType,
  WalletMonitorConfig,
  WalletAlert,
  SwarmEventType,
  DefenseAction,
} from '../../core/types';
import { SolanaClient } from '../../utils/solana';
import { HeliusClient, EnhancedTransaction } from '../../utils/helius';
import { PythClient, PRICE_FEEDS } from '../../utils/pyth';
import { logger } from '../../utils/logger';
import { v4 as uuid } from 'uuid';

export class SentinelAgent extends BaseAgent {
  private solana: SolanaClient;
  private helius: HeliusClient;
  private pyth: PythClient;
  private monitoredWallets: Map<string, WalletMonitorConfig> = new Map();
  private alerts: WalletAlert[] = [];
  private monitorInterval: NodeJS.Timeout | null = null;

  constructor(eventBus: SwarmEventBus) {
    super(AgentType.SENTINEL, 'SENTINEL (Patrol)', eventBus);
    this.solana = new SolanaClient();
    this.helius = new HeliusClient();
    this.pyth = new PythClient();
  }

  protected async onStart(): Promise<void> {
    logger.info('[SENTINEL] Real-time wallet monitoring activated');
    this.startMonitoring();
  }

  protected async onStop(): Promise<void> {
    if (this.monitorInterval) {
      clearInterval(this.monitorInterval);
    }
  }

  protected handleSwarmEvent(event: unknown): void {
    const swarmEvent = event as { type: SwarmEventType; data: unknown };
    if (swarmEvent.type === SwarmEventType.NETWORK_ANOMALY) {
      logger.warn('[SENTINEL] Network anomaly detected — increasing scan frequency');
    }
  }

  addWallet(config: WalletMonitorConfig): void {
    this.monitoredWallets.set(config.walletAddress, config);
    logger.info(`[SENTINEL] Now monitoring wallet: ${config.walletAddress}`);
  }

  removeWallet(address: string): void {
    this.monitoredWallets.delete(address);
  }

  private startMonitoring(): void {
    // Poll every 30 seconds for transaction changes
    this.monitorInterval = setInterval(async () => {
      for (const [address, config] of this.monitoredWallets) {
        await this.checkWallet(address, config).catch((err) => {
          logger.error(`[SENTINEL] Error monitoring ${address}: ${err.message}`);
        });
      }
    }, 30000);
  }

  private async checkWallet(
    address: string,
    config: WalletMonitorConfig,
  ): Promise<void> {
    this.actionCount++;

    // Get recent transactions
    const txs = await this.helius.getEnhancedTransactions(address).catch(() => []);

    for (const tx of txs.slice(0, 5)) {
      const threats = this.analyzeTx(tx, address);
      for (const threat of threats) {
        const alert = this.createAlert(address, threat, tx);
        this.alerts.push(alert);

        // Broadcast to swarm
        this.broadcastThreat(threat.threatLevel, alert);

        // Auto-defend if enabled
        if (config.autoDefend && threat.threatLevel === ThreatLevel.CRITICAL) {
          this.requestDefense({
            walletAddress: address,
            safetyWallet: config.safetyWallet,
            threat,
            action: DefenseAction.EMERGENCY_SWAP,
          });
          alert.autoDefended = true;
        }
      }
    }

    // Check for price crashes on held tokens
    await this.checkPriceCrashes(address);
  }

  private analyzeTx(
    tx: EnhancedTransaction,
    walletAddress: string,
  ): DetectedThreat[] {
    const threats: DetectedThreat[] = [];

    // 1. Large outbound transfers (potential drainer)
    for (const transfer of tx.tokenTransfers || []) {
      if (
        transfer.fromUserAccount === walletAddress &&
        transfer.tokenAmount > 0
      ) {
        // Check if transfer is to an unknown address
        threats.push({
          type: ThreatType.DRAINER,
          threatLevel: ThreatLevel.HIGH,
          description: `Outbound token transfer detected: ${transfer.tokenAmount} tokens to ${transfer.toUserAccount}`,
          txSignature: tx.signature,
        });
      }
    }

    // 2. Large SOL drains
    for (const transfer of tx.nativeTransfers || []) {
      if (
        transfer.fromUserAccount === walletAddress &&
        transfer.amount > 1_000_000_000 // > 1 SOL
      ) {
        threats.push({
          type: ThreatType.DRAINER,
          threatLevel: ThreatLevel.HIGH,
          description: `Large SOL outflow: ${(transfer.amount / 1e9).toFixed(2)} SOL to ${transfer.toUserAccount}`,
          txSignature: tx.signature,
        });
      }
    }

    // 3. Owner permission changes (Jan 2026 phishing attack vector)
    if (tx.type === 'TRANSFER' && tx.description?.includes('authority')) {
      threats.push({
        type: ThreatType.OWNER_HIJACK,
        threatLevel: ThreatLevel.CRITICAL,
        description: 'Owner/authority change detected! Possible permission hijack attack.',
        txSignature: tx.signature,
      });
    }

    return threats;
  }

  private async checkPriceCrashes(walletAddress: string): Promise<void> {
    const crash = await this.pyth.detectPriceCrash(PRICE_FEEDS.SOL_USD, 15);
    if (crash) {
      const alert: WalletAlert = {
        id: uuid(),
        walletAddress,
        type: ThreatType.RUG_PULL,
        threatLevel: ThreatLevel.HIGH,
        description: `SOL price crash detected: -${crash.dropPercent.toFixed(1)}% (${crash.currentPrice.toFixed(2)} → EMA: ${crash.emaPrice.toFixed(2)})`,
        timestamp: Date.now(),
        autoDefended: false,
      };
      this.alerts.push(alert);
      this.broadcastThreat(ThreatLevel.HIGH, alert);
    }
  }

  private createAlert(
    address: string,
    threat: DetectedThreat,
    tx: EnhancedTransaction,
  ): WalletAlert {
    return {
      id: uuid(),
      walletAddress: address,
      type: threat.type,
      threatLevel: threat.threatLevel,
      description: threat.description,
      transactionSignature: tx.signature,
      timestamp: Date.now(),
      autoDefended: false,
    };
  }

  getAlerts(walletAddress?: string): WalletAlert[] {
    if (walletAddress) {
      return this.alerts.filter((a) => a.walletAddress === walletAddress);
    }
    return this.alerts;
  }

  getMonitoredWallets(): string[] {
    return Array.from(this.monitoredWallets.keys());
  }
}

interface DetectedThreat {
  type: ThreatType;
  threatLevel: ThreatLevel;
  description: string;
  txSignature: string;
}
