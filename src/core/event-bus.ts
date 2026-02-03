import EventEmitter from 'eventemitter3';
import { v4 as uuid } from 'uuid';
import { AgentType, SwarmEvent, SwarmEventType, ThreatLevel } from './types';
import { logger } from '../utils/logger';

export class SwarmEventBus {
  private emitter: EventEmitter;
  private eventLog: SwarmEvent[] = [];
  private maxLogSize = 10000;

  constructor() {
    this.emitter = new EventEmitter();
  }

  emit(
    source: AgentType,
    target: AgentType | 'ALL',
    type: SwarmEventType,
    priority: ThreatLevel,
    data: unknown,
  ): SwarmEvent {
    const event: SwarmEvent = {
      id: uuid(),
      source,
      target,
      type,
      priority,
      data,
      timestamp: Date.now(),
    };

    this.eventLog.push(event);
    if (this.eventLog.length > this.maxLogSize) {
      this.eventLog = this.eventLog.slice(-this.maxLogSize / 2);
    }

    if (target === 'ALL') {
      this.emitter.emit('swarm:broadcast', event);
    } else {
      this.emitter.emit(`agent:${target}`, event);
    }
    this.emitter.emit('swarm:any', event);

    logger.debug(`[EventBus] ${source} → ${target}: ${type}`, {
      eventId: event.id,
      priority,
    });

    return event;
  }

  onAgentEvent(agent: AgentType, handler: (event: SwarmEvent) => void): void {
    this.emitter.on(`agent:${agent}`, handler);
    this.emitter.on('swarm:broadcast', handler);
  }

  onAnyEvent(handler: (event: SwarmEvent) => void): void {
    this.emitter.on('swarm:any', handler);
  }

  onEventType(type: SwarmEventType, handler: (event: SwarmEvent) => void): void {
    this.emitter.on('swarm:any', (event: SwarmEvent) => {
      if (event.type === type) handler(event);
    });
  }

  getRecentEvents(count = 50): SwarmEvent[] {
    return this.eventLog.slice(-count);
  }

  getCriticalEvents(): SwarmEvent[] {
    return this.eventLog.filter(
      (e) => e.priority === ThreatLevel.CRITICAL || e.priority === ThreatLevel.HIGH,
    );
  }

  getEventsByAgent(agent: AgentType): SwarmEvent[] {
    return this.eventLog.filter((e) => e.source === agent);
  }

  getStats(): Record<string, number> {
    const stats: Record<string, number> = { total: this.eventLog.length };
    for (const type of Object.values(SwarmEventType)) {
      stats[type] = this.eventLog.filter((e) => e.type === type).length;
    }
    return stats;
  }
}
