'use client';

import { useCriticalEvents } from '@/hooks';
import { SwarmEvent } from '@/lib/types';
import { AGENT_META } from '@/lib/constants';
import { formatTime, threatLevelColor } from '@/lib/formatters';
import { AlertTriangle } from 'lucide-react';
import { clsx } from 'clsx';

export default function CriticalAlerts() {
  const { data } = useCriticalEvents();
  const events: SwarmEvent[] = data?.events?.slice(0, 10) ?? [];

  return (
    <div className="bg-cyber-card border border-cyber-red/20 rounded-lg p-4">
      <div className="flex items-center gap-2 mb-3">
        <AlertTriangle size={14} className="text-cyber-red" />
        <h3 className="text-sm font-bold text-cyber-red uppercase tracking-wider">
          Critical Alerts
        </h3>
        {events.length > 0 && (
          <span className="ml-auto bg-cyber-red/20 text-cyber-red text-[10px] px-2 py-0.5 rounded-full font-bold">
            {events.length}
          </span>
        )}
      </div>

      <div className="space-y-1.5 max-h-[200px] overflow-y-auto">
        {events.length === 0 ? (
          <p className="text-xs text-cyber-text-dim py-4 text-center">
            No critical alerts
          </p>
        ) : (
          events.map((event) => {
            const agentMeta = AGENT_META[event.source];
            return (
              <div
                key={event.id}
                className="flex items-center gap-2 py-1.5 px-2 rounded bg-cyber-red/5 border border-cyber-red/10"
              >
                <span className={clsx('text-[10px] font-bold', threatLevelColor(event.priority))}>
                  {event.priority}
                </span>
                <span className="text-[11px] text-cyber-text flex-1 truncate">
                  [{agentMeta?.shortName}] {event.type.replace(/_/g, ' ')}
                </span>
                <span className="text-[10px] text-cyber-text-dim flex-shrink-0">
                  {formatTime(event.timestamp)}
                </span>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
