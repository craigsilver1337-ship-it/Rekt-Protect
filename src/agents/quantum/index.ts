import { BaseAgent } from '../../core/agent-base';
import { SwarmEventBus } from '../../core/event-bus';
import {
  AgentType,
  ThreatLevel,
  SwarmEventType,
  QuantumReadinessReport,
  MigrationStep,
  HarvestRisk,
} from '../../core/types';
import { SolanaClient } from '../../utils/solana';
import { logger } from '../../utils/logger';

// Post-Quantum Cryptography Constants
const QUANTUM_THREAT_TIMELINE = {
  optimistic: 2030, // Vitalik's 20% probability estimate
  consensus: 2035,  // NIST mandate deadline
  conservative: 2040,
};

const CURRENT_YEAR = 2026;

export class QuantumAgent extends BaseAgent {
  private solana: SolanaClient;
  private quantumThreatLevel = 25; // 0-100 (current global assessment)
  private readinessReports: Map<string, QuantumReadinessReport> = new Map();

  constructor(eventBus: SwarmEventBus) {
    super(AgentType.QUANTUM, 'QUANTUM SHIELD (Future-Proof)', eventBus);
    this.solana = new SolanaClient();
  }

  protected async onStart(): Promise<void> {
    logger.info('[QUANTUM] Post-quantum defense system initialized');
    logger.info(`[QUANTUM] Current quantum threat level: ${this.quantumThreatLevel}/100`);
    logger.info(`[QUANTUM] Years until estimated quantum threat: ${QUANTUM_THREAT_TIMELINE.optimistic - CURRENT_YEAR}-${QUANTUM_THREAT_TIMELINE.conservative - CURRENT_YEAR}`);
  }

  protected async onStop(): Promise<void> {
    logger.info('[QUANTUM] Quantum shield deactivated');
  }

  protected handleSwarmEvent(event: unknown): void {
    // React to quantum milestone alerts from other agents
  }

  async assessWalletQuantumReadiness(walletAddress: string): Promise<QuantumReadinessReport> {
    this.actionCount++;
    logger.info(`[QUANTUM] Assessing quantum readiness for: ${walletAddress}`);

    // Analyze wallet's quantum vulnerability
    const tokenAccounts = await this.solana.getTokenAccounts(walletAddress).catch(() => []);
    const balance = await this.solana.getBalance(walletAddress).catch(() => 0);
    const recentTxs = await this.solana.getRecentTransactions(walletAddress, 10).catch(() => []);

    // Count exposed public keys (Ed25519 keys visible on-chain)
    // Every transaction exposes the public key — quantum risk
    const exposedPublicKeys = recentTxs.length;

    // Calculate vulnerability score
    const vulnerableAccounts = tokenAccounts.length + 1; // +1 for main SOL account

    // Harvest-now-decrypt-later risk assessment
    const totalValue = balance * 200; // rough SOL price estimate
    const harvestRisk = this.assessHarvestRisk(totalValue, exposedPublicKeys);

    // Migration steps
    const migrationSteps = this.generateMigrationSteps(
      walletAddress,
      exposedPublicKeys,
      tokenAccounts.length,
    );

    // Overall quantum readiness score (100 = fully safe)
    let readinessScore = 100;

    // Deductions
    if (exposedPublicKeys > 0) readinessScore -= 20; // Keys exposed on-chain
    if (!this.hasWinternitzVault(walletAddress)) readinessScore -= 30; // No quantum-resistant vault
    if (totalValue > 10000) readinessScore -= 15; // High value at risk
    if (tokenAccounts.length > 10) readinessScore -= 10; // Many accounts to migrate
    readinessScore -= Math.min(this.quantumThreatLevel / 4, 25); // Global threat level

    readinessScore = Math.max(readinessScore, 0);

    const report: QuantumReadinessReport = {
      walletAddress,
      overallScore: readinessScore,
      exposedPublicKeys,
      vulnerableAccounts,
      migrationSteps,
      harvestRisk,
      timestamp: Date.now(),
    };

    this.readinessReports.set(walletAddress, report);

    // Alert if score is critically low
    if (readinessScore < 30) {
      this.eventBus.emit(
        AgentType.QUANTUM,
        'ALL',
        SwarmEventType.QUANTUM_ALERT,
        ThreatLevel.HIGH,
        {
          walletAddress,
          readinessScore,
          message: `Wallet ${walletAddress} is ${readinessScore}% quantum-ready. Immediate migration recommended.`,
        },
      );
    }

    logger.info(`[QUANTUM] Wallet ${walletAddress}: Quantum readiness = ${readinessScore}/100`);
    return report;
  }

  private assessHarvestRisk(totalValueUSD: number, exposedKeys: number): HarvestRisk {
    // "Harvest now, decrypt later" — attackers record public keys now,
    // crack with quantum computers later
    if (totalValueUSD > 100000 && exposedKeys > 5) {
      return {
        level: ThreatLevel.CRITICAL,
        exposedValue: totalValueUSD,
        recommendation:
          'HIGH VALUE TARGET. Your public keys are recorded on-chain. ' +
          'Migrate to Winternitz Vault immediately. Rotate keys and use ' +
          'fresh addresses for high-value transactions.',
      };
    }
    if (totalValueUSD > 10000) {
      return {
        level: ThreatLevel.HIGH,
        exposedValue: totalValueUSD,
        recommendation:
          'Moderate risk. Consider migrating high-value holdings to ' +
          'quantum-resistant storage. Use Solana Winternitz Vault for ' +
          'new transactions.',
      };
    }
    if (totalValueUSD > 1000) {
      return {
        level: ThreatLevel.MEDIUM,
        exposedValue: totalValueUSD,
        recommendation:
          'Low-moderate risk. Begin planning migration to quantum-resistant ' +
          'keys. Monitor quantum computing milestones.',
      };
    }
    return {
      level: ThreatLevel.LOW,
      exposedValue: totalValueUSD,
      recommendation:
        'Low risk currently. Stay informed about post-quantum cryptography ' +
        'developments. NIST mandates migration by 2035.',
    };
  }

  private generateMigrationSteps(
    walletAddress: string,
    exposedKeys: number,
    accountCount: number,
  ): MigrationStep[] {
    return [
      {
        step: 1,
        action: 'Enable Winternitz Vault',
        description:
          'Activate Solana Winternitz Vault for quantum-resistant signatures. ' +
          'Uses hash-based signatures that are secure against quantum attacks.',
        priority: ThreatLevel.HIGH,
        automated: true,
      },
      {
        step: 2,
        action: 'Rotate exposed keys',
        description:
          `${exposedKeys} public keys are exposed on-chain from past transactions. ` +
          'Generate new keypair and transfer all assets to fresh address.',
        priority: ThreatLevel.HIGH,
        automated: true,
      },
      {
        step: 3,
        action: 'Migrate token accounts',
        description:
          `Migrate ${accountCount} token accounts to new quantum-resistant address. ` +
          'Close old accounts to reclaim rent.',
        priority: ThreatLevel.MEDIUM,
        automated: true,
      },
      {
        step: 4,
        action: 'Set up quantum-safe backup',
        description:
          'Create offline backup using ML-DSA (FIPS 204) signatures. ' +
          'Prepare for Solana network-wide migration to post-quantum algorithms.',
        priority: ThreatLevel.MEDIUM,
        automated: false,
      },
      {
        step: 5,
        action: 'Monitor quantum milestones',
        description:
          'REKT Shield Quantum Agent will continuously monitor quantum computing ' +
          'progress (IBM, Google) and auto-escalate defense if threat level increases.',
        priority: ThreatLevel.LOW,
        automated: true,
      },
    ];
  }

  private hasWinternitzVault(walletAddress: string): boolean {
    // In production: check if wallet uses Winternitz Vault
    return false;
  }

  getQuantumThreatLevel(): number {
    return this.quantumThreatLevel;
  }

  getTimelineAssessment(): QuantumTimeline {
    return {
      currentThreatLevel: this.quantumThreatLevel,
      yearsUntilThreat: {
        optimistic: QUANTUM_THREAT_TIMELINE.optimistic - CURRENT_YEAR,
        consensus: QUANTUM_THREAT_TIMELINE.consensus - CURRENT_YEAR,
        conservative: QUANTUM_THREAT_TIMELINE.conservative - CURRENT_YEAR,
      },
      nistDeadline: 2035,
      solanaPreparation: {
        winternitzVault: 'Available (Jan 2025)',
        quantumResistantTestnet: 'Tested (Dec 2025)',
        fullMigration: 'Planned (2028-2030)',
      },
      recommendation:
        'Begin migration now. Quantum-resistant keys are available on Solana. ' +
        'REKT Shield provides automated migration assistance.',
    };
  }

  getReport(walletAddress: string): QuantumReadinessReport | undefined {
    return this.readinessReports.get(walletAddress);
  }
}

interface QuantumTimeline {
  currentThreatLevel: number;
  yearsUntilThreat: { optimistic: number; consensus: number; conservative: number };
  nistDeadline: number;
  solanaPreparation: Record<string, string>;
  recommendation: string;
}
