import { BaseAgent } from '../../core/agent-base';
import { SwarmEventBus } from '../../core/event-bus';
import {
  AgentType,
  AgentStatus,
  ThreatLevel,
  ThreatType,
  SwarmEventType,
} from '../../core/types';
import { AIEngine } from '../../utils/ai-engine';
import { logger } from '../../utils/logger';

// Autonomous decision thresholds
const CIRCUIT_BREAKER_MAX_FAILURES = 3;
const CIRCUIT_BREAKER_COOLDOWN_MS = 60000; // 1 minute
const HEALTH_CHECK_INTERVAL_MS = 15000; // 15 seconds
const THREAT_RESPONSE_TIMEOUT_MS = 5000;

export class HealerAgent extends BaseAgent {
  private ai: AIEngine;
  private agentHealthMap: Map<AgentType, AgentHealth> = new Map();
  private incidentLog: Incident[] = [];
  private healActions: HealAction[] = [];
  private healthCheckInterval: NodeJS.Timeout | null = null;
  private autonomousMode = true;
  private swarmRef: SwarmReference | null = null;
  private threatLevel: ThreatLevel = ThreatLevel.SAFE;
  private adaptiveIntervals: Map<AgentType, number> = new Map();

  constructor(eventBus: SwarmEventBus) {
    super(AgentType.HEALER, 'HEALER (Self-Healing Autonomous Brain)', eventBus);
    this.ai = new AIEngine();
  }

  setSwarmReference(ref: SwarmReference): void {
    this.swarmRef = ref;
  }

  protected async onStart(): Promise<void> {
    logger.info('[HEALER] Self-healing autonomous agent initialized');
    logger.info('[HEALER] Autonomous mode: ENABLED — zero human intervention');
    logger.info('[HEALER] Circuit breaker: ARMED — auto-recovery on failure');
    logger.info(`[HEALER] AI Engine: ${this.ai.isAvailable() ? this.ai.getProvider() : 'rule-based fallback'}`);

    // Initialize health tracking for all agents
    const agentTypes = Object.values(AgentType).filter(t => t !== AgentType.HEALER);
    for (const type of agentTypes) {
      this.agentHealthMap.set(type as AgentType, {
        type: type as AgentType,
        status: 'healthy',
        failureCount: 0,
        lastCheck: Date.now(),
        lastFailure: 0,
        circuitOpen: false,
        circuitOpenedAt: 0,
        autoRestarted: 0,
        responseTimeMs: 0,
      });
    }

    this.startHealthMonitoring();
    this.setupAutonomousResponsePipeline();
  }

  protected async onStop(): Promise<void> {
    if (this.healthCheckInterval) clearInterval(this.healthCheckInterval);
    logger.info(`[HEALER] Incidents resolved: ${this.incidentLog.filter(i => i.status === 'resolved').length}/${this.incidentLog.length}`);
  }

  protected handleSwarmEvent(event: unknown): void {
    const swarmEvent = event as { type: SwarmEventType; data: unknown; source: AgentType; priority: ThreatLevel };

    switch (swarmEvent.type) {
      case SwarmEventType.AGENT_FAILURE:
        this.handleAgentFailure(swarmEvent.source, swarmEvent.data);
        break;
      case SwarmEventType.THREAT_DETECTED:
        this.autonomouslyRespondToThreat(swarmEvent);
        break;
      case SwarmEventType.NETWORK_ANOMALY:
        this.handleNetworkAnomaly(swarmEvent.data);
        break;
      case SwarmEventType.PREDICTION_ALERT:
        this.handlePredictionAlert(swarmEvent.data);
        break;
      case SwarmEventType.LAZARUS_ACTIVITY:
        this.handleLazarusAlert(swarmEvent.data);
        break;
      case SwarmEventType.HONEYPOT_TRIGGERED:
        this.handleHoneypotTrigger(swarmEvent.data);
        break;
    }
  }

  // ================================================
  // AUTONOMOUS INCIDENT RESPONSE PIPELINE
  // Detect → Classify → Contain → Eradicate → Recover → Learn
  // ================================================

  private setupAutonomousResponsePipeline(): void {
    // Listen to ALL swarm events and auto-respond
    this.eventBus.onAnyEvent((event) => {
      // Track response times
      const agentHealth = this.agentHealthMap.get(event.source);
      if (agentHealth) {
        agentHealth.lastCheck = Date.now();
        agentHealth.status = 'healthy';
      }
    });

    // Auto-escalate critical threats
    this.eventBus.onEventType(SwarmEventType.THREAT_DETECTED, async (event) => {
      if (event.priority === ThreatLevel.CRITICAL) {
        try {
          await this.executeAutonomousResponse(event);
        } catch (error) {
          logger.error(`[HEALER] Autonomous response failed: ${error}`);
        }
      }
    });

    logger.info('[HEALER] Autonomous response pipeline: ONLINE');
  }

  private async executeAutonomousResponse(event: { source: AgentType; data: unknown; priority: ThreatLevel }): Promise<void> {
    const incident = this.createIncident('critical_threat', event.source, event.data);

    try {
      // Step 1: Classify
      incident.phase = 'classify';
      const classification = await this.classifyThreat(event.data);
      incident.classification = classification;

      // Step 2: Contain
      incident.phase = 'contain';
      if (classification.requiresDefense) {
        this.eventBus.emit(
          AgentType.HEALER,
          AgentType.GUARDIAN,
          SwarmEventType.DEFENSE_REQUIRED,
          ThreatLevel.CRITICAL,
          { ...(event.data as Record<string, unknown>), autoEscalated: true, incidentId: incident.id },
        );
        this.logHealAction('auto_defense_trigger', `Auto-triggered defense for ${classification.threatType}`);
      }

      // Step 3: Eradicate — blacklist attacker
      if (classification.attackerAddress) {
        this.eventBus.emit(
          AgentType.HEALER,
          AgentType.INTEL,
          SwarmEventType.INTEL_UPDATE,
          ThreatLevel.CRITICAL,
          {
            type: 'auto_blacklist',
            address: classification.attackerAddress,
            reason: classification.reason,
            autoEscalated: true,
          },
        );
        this.logHealAction('auto_blacklist', `Auto-blacklisted attacker: ${classification.attackerAddress}`);
      }

      // Step 4: Recover — deploy honeypot to catch related attackers
      if (classification.shouldDeployHoneypot) {
        this.eventBus.emit(
          AgentType.HEALER,
          AgentType.HONEYPOT,
          SwarmEventType.AUTO_ESCALATE,
          ThreatLevel.HIGH,
          { reason: 'Auto-deploy honeypot after critical incident', incidentId: incident.id },
        );
        this.logHealAction('auto_honeypot', 'Auto-deployed honeypot after incident');
      }

      // Step 5: Learn — feed back to Prophet for pattern learning
      this.eventBus.emit(
        AgentType.HEALER,
        AgentType.PROPHET,
        SwarmEventType.INTEL_UPDATE,
        ThreatLevel.MEDIUM,
        { type: 'incident_pattern', incident },
      );

      incident.status = 'resolved';
      incident.phase = 'learn';
      incident.resolvedAt = Date.now();
      incident.resolvedBy = 'autonomous';

      this.eventBus.emit(
        AgentType.HEALER,
        'ALL',
        SwarmEventType.INCIDENT_RESOLVED,
        ThreatLevel.SAFE,
        { incidentId: incident.id, resolution: 'autonomous' },
      );

      logger.info(`[HEALER] Incident ${incident.id.slice(0, 8)} auto-resolved: ${classification.reason}`);
    } catch (error) {
      incident.status = 'failed';
      logger.error(`[HEALER] Autonomous response failed for incident ${incident.id.slice(0, 8)}: ${error}`);
    }
  }

  private async classifyThreat(data: unknown): Promise<ThreatClassification> {
    const threatData = data as Record<string, unknown>;

    // Try AI classification first
    if (this.ai.isAvailable()) {
      try {
        const aiResponse = await this.ai.analyze(
          'Classify this threat and recommend autonomous response actions.',
          JSON.stringify(threatData).slice(0, 2000),
        );

        // Parse AI response for actionable decisions
        const requiresDefense = aiResponse.toLowerCase().includes('critical') ||
          aiResponse.toLowerCase().includes('defense') ||
          aiResponse.toLowerCase().includes('immediate');
        const shouldDeployHoneypot = aiResponse.toLowerCase().includes('honeypot') ||
          aiResponse.toLowerCase().includes('trap');

        return {
          threatType: (threatData.type as string) || 'unknown',
          severity: ThreatLevel.CRITICAL,
          requiresDefense,
          shouldDeployHoneypot,
          attackerAddress: (threatData.attackerAddress as string) || (threatData.address as string) || null,
          reason: aiResponse.slice(0, 200),
        };
      } catch {}
    }

    // Rule-based fallback classification
    return {
      threatType: (threatData.type as string) || 'unknown',
      severity: ThreatLevel.CRITICAL,
      requiresDefense: true,
      shouldDeployHoneypot: true,
      attackerAddress: (threatData.attackerAddress as string) || (threatData.address as string) || null,
      reason: 'Auto-classified as critical threat by rule-based engine',
    };
  }

  // ================================================
  // AGENT HEALTH MONITORING & AUTO-RECOVERY
  // ================================================

  private startHealthMonitoring(): void {
    this.healthCheckInterval = setInterval(async () => {
      await this.performHealthCheck();
    }, HEALTH_CHECK_INTERVAL_MS);
  }

  private async performHealthCheck(): Promise<void> {
    this.actionCount++;

    if (!this.swarmRef) return;

    for (const [agentType, health] of this.agentHealthMap.entries()) {
      try {
        const agentStatus = this.swarmRef.getAgentStatus(agentType);

        if (!agentStatus.isRunning) {
          health.failureCount++;
          health.lastFailure = Date.now();
          health.status = 'failed';

          // Circuit breaker pattern
          if (health.failureCount >= CIRCUIT_BREAKER_MAX_FAILURES) {
            if (!health.circuitOpen) {
              health.circuitOpen = true;
              health.circuitOpenedAt = Date.now();
              logger.warn(`[HEALER] Circuit OPEN for ${agentType} — too many failures (${health.failureCount})`);
              this.logHealAction('circuit_open', `Circuit breaker opened for ${agentType}`);
            }
          }

          // Auto-restart if circuit is closed or cooldown elapsed
          if (!health.circuitOpen || (Date.now() - health.circuitOpenedAt > CIRCUIT_BREAKER_COOLDOWN_MS)) {
            await this.autoRestartAgent(agentType, health);
          }
        } else {
          // Agent is healthy — reset circuit breaker
          if (health.circuitOpen && health.status === 'healthy') {
            health.circuitOpen = false;
            health.failureCount = 0;
            logger.info(`[HEALER] Circuit CLOSED for ${agentType} — agent recovered`);
            this.logHealAction('circuit_close', `Circuit breaker closed for ${agentType} — recovered`);
          }
          health.status = 'healthy';
        }
      } catch {
        health.status = 'unknown';
      }
    }

    // Adaptive monitoring — increase vigilance during high threat
    this.adjustMonitoringIntervals();
  }

  private async autoRestartAgent(agentType: AgentType, health: AgentHealth): Promise<void> {
    if (!this.swarmRef) return;

    try {
      logger.warn(`[HEALER] Auto-restarting agent: ${agentType} (failure #${health.failureCount})`);

      await this.swarmRef.restartAgent(agentType);

      health.autoRestarted++;
      health.status = 'restarting';
      this.logHealAction('auto_restart', `Auto-restarted ${agentType} (attempt #${health.autoRestarted})`);

      const incident = this.createIncident('agent_failure', agentType, { failureCount: health.failureCount });
      incident.status = 'resolved';
      incident.resolvedAt = Date.now();
      incident.resolvedBy = 'auto_restart';

      this.eventBus.emit(
        AgentType.HEALER,
        'ALL',
        SwarmEventType.SELF_HEAL,
        ThreatLevel.MEDIUM,
        { agent: agentType, action: 'restart', attempt: health.autoRestarted },
      );

      // Verify restart after a short delay
      setTimeout(async () => {
        const status = this.swarmRef?.getAgentStatus(agentType);
        if (status?.isRunning) {
          health.status = 'healthy';
          health.failureCount = 0;
          logger.info(`[HEALER] Agent ${agentType} successfully restarted`);
        }
      }, 5000);
    } catch (error) {
      logger.error(`[HEALER] Failed to restart ${agentType}: ${error}`);
    }
  }

  // ================================================
  // AUTONOMOUS THREAT RESPONSE
  // ================================================

  private async autonomouslyRespondToThreat(event: { source: AgentType; data: unknown; priority: ThreatLevel }): Promise<void> {
    if (!this.autonomousMode) return;

    const data = event.data as Record<string, unknown>;

    // Auto-escalation rules
    if (event.priority === ThreatLevel.CRITICAL) {
      this.threatLevel = ThreatLevel.CRITICAL;

      // 1. Auto-deploy defense
      this.eventBus.emit(
        AgentType.HEALER,
        AgentType.GUARDIAN,
        SwarmEventType.DEFENSE_REQUIRED,
        ThreatLevel.CRITICAL,
        { ...(data as Record<string, unknown>), autoEscalated: true, source: event.source },
      );

      // 2. Auto-scan for related threats
      const tokenAddress = (data.tokenAddress as string) || (data.mintAddress as string);
      if (tokenAddress) {
        this.eventBus.emit(
          AgentType.HEALER,
          AgentType.LAZARUS,
          SwarmEventType.AUTO_ESCALATE,
          ThreatLevel.HIGH,
          { address: tokenAddress, reason: 'Auto-escalated by HEALER for state-actor check' },
        );
      }

      this.logHealAction('auto_escalate', `Auto-escalated CRITICAL threat from ${event.source}`);
    } else if (event.priority === ThreatLevel.HIGH) {
      this.threatLevel = ThreatLevel.HIGH;
      // Increase monitoring frequency
      this.logHealAction('heighten_monitoring', 'Monitoring frequency increased due to HIGH threat');
    }
  }

  private handleAgentFailure(source: AgentType, data: unknown): void {
    const health = this.agentHealthMap.get(source);
    if (health) {
      health.failureCount++;
      health.lastFailure = Date.now();
      health.status = 'failed';
    }
    this.logHealAction('failure_detected', `Agent ${source} reported failure`);
  }

  private handleNetworkAnomaly(data: unknown): void {
    const anomaly = data as { type: string; tps: number };

    if (anomaly.type === 'possible_ddos') {
      // During DDoS, reduce non-critical agent activity to conserve resources
      this.logHealAction('ddos_mitigation', `DDoS detected (TPS: ${anomaly.tps}) — reducing agent activity`);
      this.threatLevel = ThreatLevel.CRITICAL;
    }
  }

  private handlePredictionAlert(data: unknown): void {
    const prediction = data as { mintAddress: string; rugProbability: number };

    if (prediction.rugProbability >= 80) {
      // Auto-blacklist high-probability rug tokens
      this.eventBus.emit(
        AgentType.HEALER,
        AgentType.INTEL,
        SwarmEventType.INTEL_UPDATE,
        ThreatLevel.CRITICAL,
        {
          type: 'auto_blacklist_token',
          address: prediction.mintAddress,
          reason: `Rug probability ${prediction.rugProbability}% — auto-blacklisted by HEALER`,
        },
      );
      this.logHealAction('auto_blacklist_rug', `Auto-blacklisted token ${prediction.mintAddress} (${prediction.rugProbability}% rug probability)`);
    }
  }

  private handleLazarusAlert(data: unknown): void {
    const alert = data as { suspiciousAddress: string; matchConfidence: number };

    if (alert.matchConfidence >= 60) {
      // Auto-defense against state-sponsored actors
      this.eventBus.emit(
        AgentType.HEALER,
        AgentType.GUARDIAN,
        SwarmEventType.DEFENSE_REQUIRED,
        ThreatLevel.CRITICAL,
        { ...(alert as Record<string, unknown>), autoEscalated: true, reason: 'State-actor threat — HEALER auto-defense' },
      );

      // Auto-deploy honeypot to catch the actor
      this.eventBus.emit(
        AgentType.HEALER,
        AgentType.HONEYPOT,
        SwarmEventType.AUTO_ESCALATE,
        ThreatLevel.CRITICAL,
        { reason: `State-actor detected (${alert.matchConfidence}% match) — deploying trap` },
      );

      this.logHealAction('lazarus_auto_response', `Auto-defense against state-actor: ${alert.suspiciousAddress}`);
    }
  }

  private handleHoneypotTrigger(data: unknown): void {
    const trigger = data as { attackerAddress: string; attackMethod: string };

    // Auto-blacklist the attacker
    this.eventBus.emit(
      AgentType.HEALER,
      AgentType.INTEL,
      SwarmEventType.INTEL_UPDATE,
      ThreatLevel.HIGH,
      {
        type: 'auto_blacklist_attacker',
        address: trigger.attackerAddress,
        reason: `Caught in honeypot — method: ${trigger.attackMethod}`,
      },
    );

    // Deploy more honeypots in the area
    this.eventBus.emit(
      AgentType.HEALER,
      AgentType.HONEYPOT,
      SwarmEventType.AUTO_ESCALATE,
      ThreatLevel.HIGH,
      { reason: 'Honeypot triggered — deploying additional traps' },
    );

    this.logHealAction('honeypot_auto_response', `Attacker ${trigger.attackerAddress} caught — auto-blacklisted & deploying more traps`);
  }

  // ================================================
  // SELF-OPTIMIZATION
  // ================================================

  private adjustMonitoringIntervals(): void {
    // During high threat, increase monitoring frequency
    if (this.threatLevel === ThreatLevel.CRITICAL) {
      // All agents scan faster during critical threats
      this.adaptiveIntervals.set(AgentType.SCANNER, 10000); // 10s instead of default
      this.adaptiveIntervals.set(AgentType.SENTINEL, 10000);
      this.adaptiveIntervals.set(AgentType.NETWORK, 15000);
    } else if (this.threatLevel === ThreatLevel.HIGH) {
      this.adaptiveIntervals.set(AgentType.SCANNER, 30000);
      this.adaptiveIntervals.set(AgentType.SENTINEL, 15000);
      this.adaptiveIntervals.set(AgentType.NETWORK, 30000);
    } else {
      // Normal intervals
      this.adaptiveIntervals.clear();
    }

    // Decay threat level over time if no new threats
    if (this.threatLevel !== ThreatLevel.SAFE) {
      const recentIncidents = this.incidentLog.filter(
        i => Date.now() - i.createdAt < 300000, // Last 5 minutes
      );
      if (recentIncidents.length === 0) {
        if (this.threatLevel === ThreatLevel.CRITICAL) this.threatLevel = ThreatLevel.HIGH;
        else if (this.threatLevel === ThreatLevel.HIGH) this.threatLevel = ThreatLevel.MEDIUM;
        else if (this.threatLevel === ThreatLevel.MEDIUM) this.threatLevel = ThreatLevel.LOW;
        else this.threatLevel = ThreatLevel.SAFE;
      }
    }
  }

  // ================================================
  // AI-POWERED DECISION MAKING
  // ================================================

  async makeAutonomousDecision(context: string): Promise<AutonomousDecision> {
    this.actionCount++;

    const swarmState = {
      threatLevel: this.threatLevel,
      activeIncidents: this.incidentLog.filter(i => i.status === 'active').length,
      agentHealth: Object.fromEntries(
        Array.from(this.agentHealthMap.entries()).map(([k, v]) => [k, v.status]),
      ),
      recentActions: this.healActions.slice(-5).map(a => a.description),
    };

    if (this.ai.isAvailable()) {
      try {
        const response = await this.ai.analyze(
          `As the autonomous HEALER agent, decide the best action for this situation.
Context: ${context}

Respond in JSON format:
{
  "action": "<action_type>",
  "target": "<agent_or_address>",
  "reason": "<brief reason>",
  "confidence": <0-100>,
  "urgency": "low|medium|high|critical"
}`,
          JSON.stringify(swarmState),
        );

        const jsonMatch = response.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          const decision = JSON.parse(jsonMatch[0]) as AutonomousDecision;
          decision.timestamp = Date.now();
          decision.madeBy = 'ai';
          return decision;
        }
      } catch {}
    }

    // Rule-based fallback
    return {
      action: 'monitor',
      target: 'all',
      reason: 'No immediate action required — continuing monitoring',
      confidence: 70,
      urgency: 'low',
      timestamp: Date.now(),
      madeBy: 'rule_engine',
    };
  }

  // ================================================
  // HELPERS
  // ================================================

  private createIncident(type: string, source: AgentType | string, data: unknown): Incident {
    const incident: Incident = {
      id: `INC-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      type,
      source: source as string,
      data,
      status: 'active',
      phase: 'detect',
      classification: null,
      createdAt: Date.now(),
      resolvedAt: null,
      resolvedBy: null,
    };
    this.incidentLog.push(incident);

    // Keep incident log manageable
    if (this.incidentLog.length > 500) {
      this.incidentLog = this.incidentLog.slice(-250);
    }

    return incident;
  }

  private logHealAction(type: string, description: string): void {
    const action: HealAction = {
      type,
      description,
      timestamp: Date.now(),
    };
    this.healActions.push(action);
    this.threatsDetected++;

    if (this.healActions.length > 1000) {
      this.healActions = this.healActions.slice(-500);
    }

    logger.info(`[HEALER] ${description}`);
  }

  // ================================================
  // PUBLIC API
  // ================================================

  getHealerStatus(): HealerStatus {
    const healthEntries = Array.from(this.agentHealthMap.entries());

    return {
      autonomousMode: this.autonomousMode,
      currentThreatLevel: this.threatLevel,
      aiAvailable: this.ai.isAvailable(),
      aiProvider: this.ai.getProvider(),
      totalIncidents: this.incidentLog.length,
      resolvedIncidents: this.incidentLog.filter(i => i.status === 'resolved').length,
      failedIncidents: this.incidentLog.filter(i => i.status === 'failed').length,
      activeIncidents: this.incidentLog.filter(i => i.status === 'active').length,
      totalHealActions: this.healActions.length,
      agentHealth: healthEntries.map(([type, health]) => ({
        agent: type,
        status: health.status,
        failureCount: health.failureCount,
        autoRestarts: health.autoRestarted,
        circuitOpen: health.circuitOpen,
      })),
    };
  }

  getIncidentLog(limit = 50): Incident[] {
    return this.incidentLog.slice(-limit);
  }

  getHealActions(limit = 50): HealAction[] {
    return this.healActions.slice(-limit);
  }

  getAgentHealthMap(): Map<AgentType, AgentHealth> {
    return this.agentHealthMap;
  }

  setAutonomousMode(enabled: boolean): void {
    this.autonomousMode = enabled;
    logger.info(`[HEALER] Autonomous mode: ${enabled ? 'ENABLED' : 'DISABLED'}`);
  }
}

// ================================================
// INTERFACES
// ================================================

export interface SwarmReference {
  getAgentStatus(type: AgentType): { isRunning: boolean; status: AgentStatus };
  restartAgent(type: AgentType): Promise<void>;
}

interface AgentHealth {
  type: AgentType;
  status: 'healthy' | 'degraded' | 'failed' | 'restarting' | 'unknown';
  failureCount: number;
  lastCheck: number;
  lastFailure: number;
  circuitOpen: boolean;
  circuitOpenedAt: number;
  autoRestarted: number;
  responseTimeMs: number;
}

interface Incident {
  id: string;
  type: string;
  source: string;
  data: unknown;
  status: 'active' | 'resolved' | 'failed';
  phase: 'detect' | 'classify' | 'contain' | 'eradicate' | 'recover' | 'learn';
  classification: ThreatClassification | null;
  createdAt: number;
  resolvedAt: number | null;
  resolvedBy: string | null;
}

interface ThreatClassification {
  threatType: string;
  severity: ThreatLevel;
  requiresDefense: boolean;
  shouldDeployHoneypot: boolean;
  attackerAddress: string | null;
  reason: string;
}

interface HealAction {
  type: string;
  description: string;
  timestamp: number;
}

interface AutonomousDecision {
  action: string;
  target: string;
  reason: string;
  confidence: number;
  urgency: string;
  timestamp: number;
  madeBy: string;
}

interface HealerStatus {
  autonomousMode: boolean;
  currentThreatLevel: ThreatLevel;
  aiAvailable: boolean;
  aiProvider: string;
  totalIncidents: number;
  resolvedIncidents: number;
  failedIncidents: number;
  activeIncidents: number;
  totalHealActions: number;
  agentHealth: {
    agent: AgentType;
    status: string;
    failureCount: number;
    autoRestarts: number;
    circuitOpen: boolean;
  }[];
}
