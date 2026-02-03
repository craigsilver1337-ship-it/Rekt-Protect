import { SwarmEventBus } from './event-bus';
import { AgentType, AgentStatus, ThreatLevel, SwarmEventType } from './types';
import { BaseAgent, AgentStatusReport } from './agent-base';
import { ScannerAgent } from '../agents/scanner';
import { SentinelAgent } from '../agents/sentinel';
import { GuardianAgent } from '../agents/guardian';
import { IntelAgent } from '../agents/intel';
import { ReporterAgent } from '../agents/reporter';
import { QuantumAgent } from '../agents/quantum';
import { LazarusAgent } from '../agents/lazarus';
import { HoneypotAgent } from '../agents/honeypot';
import { ProphetAgent } from '../agents/prophet';
import { NetworkAgent } from '../agents/network';
import { HealerAgent, SwarmReference } from '../agents/healer';
import { logger } from '../utils/logger';

export class RektShieldSwarm {
  private agents: Map<AgentType, BaseAgent> = new Map();
  private eventBus: SwarmEventBus;
  private startTime: number = 0;
  private totalThreatsBlocked: number = 0;
  private totalValueSaved: number = 0;

  constructor() {
    this.eventBus = new SwarmEventBus();
    this.initializeAgents();
    this.setupSwarmIntelligence();
  }

  private initializeAgents(): void {
    this.agents.set(AgentType.SCANNER, new ScannerAgent(this.eventBus));
    this.agents.set(AgentType.SENTINEL, new SentinelAgent(this.eventBus));
    this.agents.set(AgentType.GUARDIAN, new GuardianAgent(this.eventBus));
    this.agents.set(AgentType.INTEL, new IntelAgent(this.eventBus));
    this.agents.set(AgentType.REPORTER, new ReporterAgent(this.eventBus));
    this.agents.set(AgentType.QUANTUM, new QuantumAgent(this.eventBus));
    this.agents.set(AgentType.LAZARUS, new LazarusAgent(this.eventBus));
    this.agents.set(AgentType.HONEYPOT, new HoneypotAgent(this.eventBus));
    this.agents.set(AgentType.PROPHET, new ProphetAgent(this.eventBus));
    this.agents.set(AgentType.NETWORK, new NetworkAgent(this.eventBus));

    // 11th Agent: Self-Healing Autonomous Brain
    const healer = new HealerAgent(this.eventBus);
    healer.setSwarmReference(this.createSwarmReference());
    this.agents.set(AgentType.HEALER, healer);

    logger.info(`[SWARM] Initialized ${this.agents.size} agents`);
  }

  private createSwarmReference(): SwarmReference {
    return {
      getAgentStatus: (type: AgentType) => {
        const agent = this.agents.get(type);
        if (!agent) return { isRunning: false, status: AgentStatus.ERROR };
        const status = agent.getStatus();
        return { isRunning: status.isRunning, status: status.status };
      },
      restartAgent: async (type: AgentType) => {
        const agent = this.agents.get(type);
        if (!agent) throw new Error(`Agent ${type} not found`);
        await agent.stop();
        await agent.start();
        logger.info(`[SWARM] Agent ${type} restarted by HEALER`);
      },
    };
  }

  private setupSwarmIntelligence(): void {
    // Cross-agent threat escalation
    this.eventBus.onEventType(SwarmEventType.THREAT_DETECTED, (event) => {
      if (event.priority === ThreatLevel.CRITICAL) {
        this.totalThreatsBlocked++;
        logger.warn(`[SWARM] CRITICAL THREAT from ${event.source}`, event.data);
      }
    });

    this.eventBus.onEventType(SwarmEventType.DEFENSE_EXECUTED, (event) => {
      const data = event.data as { amountSaved?: number };
      if (data.amountSaved) {
        this.totalValueSaved += data.amountSaved;
      }
      logger.info(`[SWARM] Defense executed. Total saved: $${this.totalValueSaved}`);
    });

    // Honeypot trigger → Intel update → All agents learn
    this.eventBus.onEventType(SwarmEventType.HONEYPOT_TRIGGERED, (event) => {
      logger.warn(`[SWARM] Honeypot triggered! New attack pattern discovered.`);
      this.eventBus.emit(
        AgentType.HONEYPOT,
        AgentType.INTEL,
        SwarmEventType.PATTERN_LEARNED,
        ThreatLevel.HIGH,
        event.data,
      );
    });

    // Lazarus activity → immediate defense
    this.eventBus.onEventType(SwarmEventType.LAZARUS_ACTIVITY, (event) => {
      logger.warn(`[SWARM] LAZARUS GROUP ACTIVITY DETECTED!`);
      this.eventBus.emit(
        AgentType.LAZARUS,
        AgentType.GUARDIAN,
        SwarmEventType.DEFENSE_REQUIRED,
        ThreatLevel.CRITICAL,
        event.data,
      );
    });

    // Quantum alert → notify all
    this.eventBus.onEventType(SwarmEventType.QUANTUM_ALERT, (event) => {
      logger.warn(`[SWARM] Quantum threat level changed!`);
    });

    // Network anomaly → heighten all defenses
    this.eventBus.onEventType(SwarmEventType.NETWORK_ANOMALY, (event) => {
      logger.warn(`[SWARM] Network anomaly detected — heightening defenses`);
    });

    // Self-healing events
    this.eventBus.onEventType(SwarmEventType.SELF_HEAL, (event) => {
      logger.info(`[SWARM] Self-heal action executed by HEALER`);
    });

    this.eventBus.onEventType(SwarmEventType.INCIDENT_RESOLVED, (event) => {
      const data = event.data as { incidentId: string; resolution: string };
      logger.info(`[SWARM] Incident ${data.incidentId} resolved autonomously (${data.resolution})`);
    });

    this.eventBus.onEventType(SwarmEventType.AUTO_ESCALATE, (event) => {
      logger.warn(`[SWARM] Auto-escalation by HEALER → ${event.target}`);
    });
  }

  async startAll(): Promise<void> {
    this.startTime = Date.now();
    logger.info('[SWARM] ═══════════════════════════════════════');
    logger.info('[SWARM]   REKT SHIELD — 11-Agent Swarm');
    logger.info('[SWARM]   Self-Healing Digital Immune System');
    logger.info('[SWARM]   Autonomous Defense for Solana');
    logger.info('[SWARM] ═══════════════════════════════════════');

    const startPromises = Array.from(this.agents.values()).map((agent) =>
      agent.start().catch((err) => {
        logger.error(`[SWARM] Failed to start ${agent.name}: ${err.message}`);
      }),
    );

    await Promise.all(startPromises);
    logger.info(`[SWARM] All ${this.agents.size} agents are now ACTIVE`);
  }

  async stopAll(): Promise<void> {
    const stopPromises = Array.from(this.agents.values()).map((agent) =>
      agent.stop().catch((err) => {
        logger.error(`[SWARM] Failed to stop ${agent.name}: ${err.message}`);
      }),
    );

    await Promise.all(stopPromises);
    logger.info('[SWARM] All agents stopped');
  }

  getAgent<T extends BaseAgent>(type: AgentType): T {
    const agent = this.agents.get(type);
    if (!agent) throw new Error(`Agent ${type} not found`);
    return agent as T;
  }

  getSwarmStatus(): SwarmStatusReport {
    const agentStatuses: AgentStatusReport[] = [];
    for (const agent of this.agents.values()) {
      agentStatuses.push(agent.getStatus());
    }

    return {
      name: 'REKT SHIELD',
      version: '1.0.0',
      uptime: this.startTime ? Date.now() - this.startTime : 0,
      totalAgents: this.agents.size,
      activeAgents: agentStatuses.filter((a) => a.isRunning).length,
      totalThreatsBlocked: this.totalThreatsBlocked,
      totalValueSaved: this.totalValueSaved,
      agents: agentStatuses,
      eventStats: this.eventBus.getStats(),
    };
  }

  getEventBus(): SwarmEventBus {
    return this.eventBus;
  }
}

export interface SwarmStatusReport {
  name: string;
  version: string;
  uptime: number;
  totalAgents: number;
  activeAgents: number;
  totalThreatsBlocked: number;
  totalValueSaved: number;
  agents: AgentStatusReport[];
  eventStats: Record<string, number>;
}
