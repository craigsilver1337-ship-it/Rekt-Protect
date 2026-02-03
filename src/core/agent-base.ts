import { AgentType, AgentStatus, ThreatLevel, SwarmEventType } from './types';
import { SwarmEventBus } from './event-bus';
import { logger } from '../utils/logger';

export abstract class BaseAgent {
  readonly type: AgentType;
  readonly name: string;
  protected status: AgentStatus = AgentStatus.IDLE;
  protected eventBus: SwarmEventBus;
  protected startTime: number = 0;
  protected actionCount: number = 0;
  protected threatsDetected: number = 0;
  protected isRunning: boolean = false;

  constructor(type: AgentType, name: string, eventBus: SwarmEventBus) {
    this.type = type;
    this.name = name;
    this.eventBus = eventBus;
    this.setupEventListeners();
  }

  private setupEventListeners(): void {
    this.eventBus.onAgentEvent(this.type, (event) => {
      this.handleSwarmEvent(event);
    });
  }

  async start(): Promise<void> {
    if (this.isRunning) return;
    this.isRunning = true;
    this.startTime = Date.now();
    this.status = AgentStatus.ACTIVE;
    logger.info(`[${this.name}] Agent started`);

    this.eventBus.emit(
      this.type,
      'ALL',
      SwarmEventType.HEARTBEAT,
      ThreatLevel.SAFE,
      { status: 'started', agent: this.name },
    );

    await this.onStart();
  }

  async stop(): Promise<void> {
    this.isRunning = false;
    this.status = AgentStatus.IDLE;
    logger.info(`[${this.name}] Agent stopped`);
    await this.onStop();
  }

  getStatus(): AgentStatusReport {
    return {
      type: this.type,
      name: this.name,
      status: this.status,
      uptime: this.startTime ? Date.now() - this.startTime : 0,
      actionCount: this.actionCount,
      threatsDetected: this.threatsDetected,
      isRunning: this.isRunning,
    };
  }

  protected broadcastThreat(
    threatLevel: ThreatLevel,
    data: unknown,
  ): void {
    this.threatsDetected++;
    this.eventBus.emit(
      this.type,
      'ALL',
      SwarmEventType.THREAT_DETECTED,
      threatLevel,
      data,
    );
  }

  protected requestDefense(data: unknown): void {
    this.eventBus.emit(
      this.type,
      AgentType.GUARDIAN,
      SwarmEventType.DEFENSE_REQUIRED,
      ThreatLevel.CRITICAL,
      data,
    );
  }

  protected shareIntel(data: unknown): void {
    this.eventBus.emit(
      this.type,
      AgentType.INTEL,
      SwarmEventType.INTEL_UPDATE,
      ThreatLevel.MEDIUM,
      data,
    );
  }

  protected abstract onStart(): Promise<void>;
  protected abstract onStop(): Promise<void>;
  protected abstract handleSwarmEvent(event: unknown): void;
}

export interface AgentStatusReport {
  type: AgentType;
  name: string;
  status: AgentStatus;
  uptime: number;
  actionCount: number;
  threatsDetected: number;
  isRunning: boolean;
}
