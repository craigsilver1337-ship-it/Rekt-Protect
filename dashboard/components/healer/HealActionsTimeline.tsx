'use client';

import { HealAction } from '@/lib/types';
import { formatTime } from '@/lib/formatters';
import { Wrench } from 'lucide-react';

interface HealActionsTimelineProps {
  actions: HealAction[];
}

export default function HealActionsTimeline({ actions }: HealActionsTimelineProps) {
  return (
    <div className="bg-cyber-card border border-cyber-border rounded-lg p-4">
      <div className="flex items-center gap-2 mb-3">
        <Wrench size={14} className="text-cyber-green" />
        <h3 className="text-sm font-bold text-cyber-text-dim uppercase tracking-wider">
          Heal Actions
        </h3>
      </div>
      <div className="relative space-y-0 max-h-[400px] overflow-y-auto">
        {actions.length === 0 ? (
          <p className="text-xs text-cyber-text-dim text-center py-4">No heal actions yet</p>
        ) : (
          actions.map((action, i) => (
            <div key={i} className="flex gap-3 pb-3">
              <div className="flex flex-col items-center">
                <div className="w-2 h-2 rounded-full bg-cyber-green flex-shrink-0 mt-1.5" />
                {i < actions.length - 1 && (
                  <div className="w-px flex-1 bg-cyber-border mt-1" />
                )}
              </div>
              <div className="flex-1 min-w-0 pb-1">
                <div className="flex items-center justify-between mb-0.5">
                  <span className="text-[11px] text-cyber-text font-medium">
                    {action.type.replace(/_/g, ' ')}
                  </span>
                  <span className="text-[10px] text-cyber-text-dim flex-shrink-0 ml-2">
                    {formatTime(action.timestamp)}
                  </span>
                </div>
                <p className="text-[10px] text-cyber-text-dim">{action.description}</p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
