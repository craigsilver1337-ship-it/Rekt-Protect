import { BaseAgent } from '../../core/agent-base';
import { SwarmEventBus } from '../../core/event-bus';
import {
  AgentType,
  ThreatLevel,
  ThreatType,
  ThreatDetail,
  SwarmEventType,
} from '../../core/types';
import { logger } from '../../utils/logger';

// On-Chain Threat Registry — Intelligence Agent
// In production: writes to Anchor program on devnet/mainnet

export interface ThreatRecord {
  id: string;
  address: string;
  threatType: ThreatType;
  riskScore: number;
  reportedBy: AgentType;
  evidence: string;
  confirmed: boolean;
  confirmations: number;
  timestamp: number;
}

export interface AttackerRecord {
  address: string;
  attackCount: number;
  totalDamage: number;
  methods: ThreatType[];
  firstSeen: number;
  lastSeen: number;
  isStateSponsored: boolean;
}

export class IntelAgent extends BaseAgent {
  // In-memory threat registry (synced to on-chain in production)
  private threatRegistry: Map<string, ThreatRecord> = new Map();
  private attackerBlacklist: Map<string, AttackerRecord> = new Map();
  private antibodies: Map<string, AntibodyRule> = new Map();

  constructor(eventBus: SwarmEventBus) {
    super(AgentType.INTEL, 'INTEL (Immune Memory)', eventBus);
  }

  protected async onStart(): Promise<void> {
    logger.info('[INTEL] On-chain Threat Registry initialized');
    await this.loadRegistryFromChain();
  }

  protected async onStop(): Promise<void> {
    logger.info('[INTEL] Syncing registry to chain...');
    await this.syncToChain();
  }

  protected handleSwarmEvent(event: unknown): void {
    const swarmEvent = event as {
      type: SwarmEventType;
      source: AgentType;
      data: unknown;
    };

    switch (swarmEvent.type) {
      case SwarmEventType.INTEL_UPDATE:
        this.processIntelUpdate(swarmEvent.source, swarmEvent.data);
        break;
      case SwarmEventType.PATTERN_LEARNED:
        this.createAntibody(swarmEvent.data);
        break;
      case SwarmEventType.HONEYPOT_TRIGGERED:
        this.processHoneypotIntel(swarmEvent.data);
        break;
    }
  }

  reportThreat(
    address: string,
    threatType: ThreatType,
    riskScore: number,
    reportedBy: AgentType,
    evidence: string,
  ): ThreatRecord {
    this.actionCount++;

    const existing = this.threatRegistry.get(address);
    if (existing) {
      existing.confirmations++;
      existing.riskScore = Math.max(existing.riskScore, riskScore);
      existing.confirmed = existing.confirmations >= 2;
      logger.info(
        `[INTEL] Threat confirmed (${existing.confirmations}x): ${address}`,
      );
      return existing;
    }

    const record: ThreatRecord = {
      id: `threat_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
      address,
      threatType,
      riskScore,
      reportedBy,
      evidence,
      confirmed: false,
      confirmations: 1,
      timestamp: Date.now(),
    };

    this.threatRegistry.set(address, record);
    this.threatsDetected++;

    logger.info(
      `[INTEL] New threat recorded: ${address} (${threatType}, score: ${riskScore})`,
    );

    return record;
  }

  blacklistAttacker(
    address: string,
    method: ThreatType,
    damage: number,
    isStateSponsored = false,
  ): void {
    const existing = this.attackerBlacklist.get(address);
    if (existing) {
      existing.attackCount++;
      existing.totalDamage += damage;
      if (!existing.methods.includes(method)) existing.methods.push(method);
      existing.lastSeen = Date.now();
      existing.isStateSponsored = existing.isStateSponsored || isStateSponsored;
    } else {
      this.attackerBlacklist.set(address, {
        address,
        attackCount: 1,
        totalDamage: damage,
        methods: [method],
        firstSeen: Date.now(),
        lastSeen: Date.now(),
        isStateSponsored,
      });
    }

    // Broadcast to all agents
    this.eventBus.emit(
      AgentType.INTEL,
      'ALL',
      SwarmEventType.PATTERN_LEARNED,
      ThreatLevel.CRITICAL,
      { scammerAddress: address, method, isStateSponsored },
    );

    logger.warn(`[INTEL] Attacker blacklisted: ${address} (state-sponsored: ${isStateSponsored})`);
  }

  isBlacklisted(address: string): boolean {
    return this.attackerBlacklist.has(address);
  }

  getThreat(address: string): ThreatRecord | undefined {
    return this.threatRegistry.get(address);
  }

  getAttacker(address: string): AttackerRecord | undefined {
    return this.attackerBlacklist.get(address);
  }

  getAllThreats(): ThreatRecord[] {
    return Array.from(this.threatRegistry.values());
  }

  getBlacklist(): AttackerRecord[] {
    return Array.from(this.attackerBlacklist.values());
  }

  getAntibodies(): AntibodyRule[] {
    return Array.from(this.antibodies.values());
  }

  getStats(): IntelStats {
    return {
      totalThreats: this.threatRegistry.size,
      confirmedThreats: Array.from(this.threatRegistry.values()).filter(
        (t) => t.confirmed,
      ).length,
      blacklistedAddresses: this.attackerBlacklist.size,
      stateSponsoredActors: Array.from(this.attackerBlacklist.values()).filter(
        (a) => a.isStateSponsored,
      ).length,
      antibodyRules: this.antibodies.size,
      totalDamageRecorded: Array.from(this.attackerBlacklist.values()).reduce(
        (sum, a) => sum + a.totalDamage,
        0,
      ),
    };
  }

  private processIntelUpdate(source: AgentType, data: unknown): void {
    const update = data as { type: string; report?: { tokenAddress: string; riskScore: number; threats: ThreatDetail[] } };
    if (update.type === 'scan_result' && update.report) {
      if (update.report.riskScore >= 60) {
        this.reportThreat(
          update.report.tokenAddress,
          update.report.threats[0]?.type || ThreatType.RUG_PULL,
          update.report.riskScore,
          source,
          JSON.stringify(update.report.threats.map((t) => t.description)),
        );
      }
    }
  }

  private createAntibody(data: unknown): void {
    const pattern = data as { scammerAddress: string; method: ThreatType; attackSignature?: string };
    const id = `antibody_${Date.now()}`;
    this.antibodies.set(id, {
      id,
      pattern: pattern.method,
      signature: pattern.attackSignature || 'unknown',
      createdFrom: pattern.scammerAddress,
      createdAt: Date.now(),
      matchCount: 0,
    });
    logger.info(`[INTEL] New antibody created: ${pattern.method} from ${pattern.scammerAddress}`);
  }

  private processHoneypotIntel(data: unknown): void {
    const honeypotData = data as {
      attackerAddress: string;
      method: string;
      toolSignature: string;
    };

    this.blacklistAttacker(
      honeypotData.attackerAddress,
      ThreatType.DRAINER,
      0,
      false,
    );

    this.createAntibody({
      scammerAddress: honeypotData.attackerAddress,
      method: ThreatType.DRAINER,
      attackSignature: honeypotData.toolSignature,
    });
  }

  private async loadRegistryFromChain(): Promise<void> {
    // In production: load from Anchor program
    logger.info('[INTEL] Loading threat registry from on-chain data...');
  }

  private async syncToChain(): Promise<void> {
    // In production: write new records to Anchor program
    logger.info(
      `[INTEL] Syncing ${this.threatRegistry.size} records to chain...`,
    );
  }
}

interface AntibodyRule {
  id: string;
  pattern: ThreatType;
  signature: string;
  createdFrom: string;
  createdAt: number;
  matchCount: number;
}

interface IntelStats {
  totalThreats: number;
  confirmedThreats: number;
  blacklistedAddresses: number;
  stateSponsoredActors: number;
  antibodyRules: number;
  totalDamageRecorded: number;
}
