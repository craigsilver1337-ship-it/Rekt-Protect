'use client';

import { useEvents } from '@/hooks';
import { SwarmEvent, ThreatLevel } from '@/lib/types';
import { AGENT_META } from '@/lib/constants';
import { formatTime, threatLevelColor } from '@/lib/formatters';
import { clsx } from 'clsx';
import { Activity } from 'lucide-react';

export default function EventFeed() {
  const { data } = useEvents();
  const events: SwarmEvent[] = data?.events?.slice(0, 20) ?? [];

  return (
    <div className="bg-cyber-card border border-cyber-border rounded-lg p-4">
      <div className="flex items-center gap-2 mb-3">
        <Activity size={14} className="text-cyber-green" />
        <h3 className="text-sm font-bold text-cyber-text-dim uppercase tracking-wider">
          Live Event Feed
        </h3>
      </div>

      <div className="space-y-1 max-h-[300px] overflow-y-auto">
        {events.length === 0 ? (
          <p className="text-xs text-cyber-text-dim py-4 text-center">
            Waiting for events...
          </p>
        ) : (
          events.map((event) => {
            const agentMeta = AGENT_META[event.source];
            const Icon = agentMeta?.icon ?? Activity;
            return (
              <div
                key={event.id}
                className="flex items-start gap-2 py-1.5 px-2 rounded hover:bg-cyber-darker transition-colors"
              >
                <Icon
                  size={12}
                  style={{ color: agentMeta?.color ?? '#808090' }}
                  className="mt-0.5 flex-shrink-0"
                />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span
                      className="text-[10px] font-medium"
                      style={{ color: agentMeta?.color }}
                    >
                      {agentMeta?.shortName ?? event.source}
                    </span>
                    <span className={clsx('text-[10px]', threatLevelColor(event.priority))}>
                      [{event.priority}]
                    </span>
                    <span className="text-[10px] text-cyber-text-dim ml-auto flex-shrink-0">
                      {formatTime(event.timestamp)}
                    </span>
                  </div>
                  <p className="text-[11px] text-cyber-text-dim truncate">
                    {event.type.replace(/_/g, ' ')}
                    {event.target !== 'ALL' ? ` → ${event.target}` : ''}
                  </p>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
