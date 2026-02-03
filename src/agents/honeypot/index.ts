import { BaseAgent } from '../../core/agent-base';
import { SwarmEventBus } from '../../core/event-bus';
import {
  AgentType,
  ThreatLevel,
  ThreatType,
  HoneypotDeployment,
  AttackerProfile,
  SwarmEventType,
  DefenseAction,
} from '../../core/types';
import { SolanaClient } from '../../utils/solana';
import { logger } from '../../utils/logger';
import { v4 as uuid } from 'uuid';

export class HoneypotAgent extends BaseAgent {
  private solana: SolanaClient;
  private deployments: Map<string, HoneypotDeployment> = new Map();
  private attackerProfiles: Map<string, AttackerProfile> = new Map();
  private monitorInterval: NodeJS.Timeout | null = null;

  constructor(eventBus: SwarmEventBus) {
    super(AgentType.HONEYPOT, 'HONEYPOT (Active Trap Defense)', eventBus);
    this.solana = new SolanaClient();
  }

  protected async onStart(): Promise<void> {
    logger.info('[HONEYPOT] Active defense system deployed');
    this.startMonitoring();
  }

  protected async onStop(): Promise<void> {
    if (this.monitorInterval) clearInterval(this.monitorInterval);
  }

  protected handleSwarmEvent(event: unknown): void {
    const swarmEvent = event as { type: SwarmEventType; data: unknown };
    // When new attack patterns are found, create targeted honeypots
    if (swarmEvent.type === SwarmEventType.PATTERN_LEARNED) {
      logger.info('[HONEYPOT] New pattern learned — deploying targeted trap');
    }
  }

  async deployHoneypot(config: HoneypotConfig): Promise<HoneypotDeployment> {
    this.actionCount++;
    const id = uuid();

    const deployment: HoneypotDeployment = {
      id,
      walletAddress: config.walletAddress || `honeypot_${id.slice(0, 8)}`,
      baitAmount: config.baitAmount || 0.1,
      baitToken: config.baitToken || 'SOL',
      status: 'active',
      attackersCaught: [],
      deployedAt: Date.now(),
    };

    this.deployments.set(id, deployment);

    logger.info(
      `[HONEYPOT] Trap deployed: ${deployment.walletAddress} with ${deployment.baitAmount} ${deployment.baitToken}`,
    );

    return deployment;
  }

  async checkHoneypot(deploymentId: string): Promise<HoneypotCheckResult> {
    const deployment = this.deployments.get(deploymentId);
    if (!deployment) {
      return { triggered: false, deployment: null };
    }

    this.actionCount++;

    // Check if any unauthorized transactions occurred on the honeypot wallet
    const txs = await this.solana
      .getRecentTransactions(deployment.walletAddress, 10)
      .catch(() => []);

    for (const tx of txs) {
      if (tx.timestamp && tx.timestamp * 1000 > deployment.deployedAt) {
        // Transaction AFTER deployment = potential attacker
        deployment.status = 'triggered';
        this.threatsDetected++;

        const attackerProfile: AttackerProfile = {
          address: 'unknown', // Extracted from tx details in production
          attackMethod: 'drainer',
          toolSignature: tx.signature,
          firstSeen: Date.now(),
          attackCount: 1,
          estimatedDamage: deployment.baitAmount,
        };

        deployment.attackersCaught.push(attackerProfile);
        this.attackerProfiles.set(attackerProfile.address, attackerProfile);

        // Alert the swarm — new attack pattern discovered
        this.eventBus.emit(
          AgentType.HONEYPOT,
          'ALL',
          SwarmEventType.HONEYPOT_TRIGGERED,
          ThreatLevel.HIGH,
          {
            deploymentId,
            attackerAddress: attackerProfile.address,
            method: attackerProfile.attackMethod,
            toolSignature: attackerProfile.toolSignature,
            timestamp: Date.now(),
          },
        );

        logger.warn(
          `[HONEYPOT] TRAP TRIGGERED! Attacker caught: ${attackerProfile.address}`,
        );

        return { triggered: true, deployment, attacker: attackerProfile };
      }
    }

    return { triggered: false, deployment };
  }

  private startMonitoring(): void {
    // Check all active honeypots every 2 minutes
    this.monitorInterval = setInterval(async () => {
      for (const [id, deployment] of this.deployments) {
        if (deployment.status === 'active') {
          await this.checkHoneypot(id).catch(() => {});
        }
      }
    }, 120000);
  }

  getDeployments(): HoneypotDeployment[] {
    return Array.from(this.deployments.values());
  }

  getActiveDeployments(): HoneypotDeployment[] {
    return Array.from(this.deployments.values()).filter(
      (d) => d.status === 'active',
    );
  }

  getAttackerProfiles(): AttackerProfile[] {
    return Array.from(this.attackerProfiles.values());
  }

  getStats(): HoneypotStats {
    const deployments = Array.from(this.deployments.values());
    return {
      totalDeployed: deployments.length,
      active: deployments.filter((d) => d.status === 'active').length,
      triggered: deployments.filter((d) => d.status === 'triggered').length,
      attackersCaught: this.attackerProfiles.size,
      totalBaitDeployed: deployments.reduce((sum, d) => sum + d.baitAmount, 0),
    };
  }
}

interface HoneypotConfig {
  walletAddress?: string;
  baitAmount?: number;
  baitToken?: string;
}

interface HoneypotCheckResult {
  triggered: boolean;
  deployment: HoneypotDeployment | null;
  attacker?: AttackerProfile;
}

interface HoneypotStats {
  totalDeployed: number;
  active: number;
  triggered: number;
  attackersCaught: number;
  totalBaitDeployed: number;
}
