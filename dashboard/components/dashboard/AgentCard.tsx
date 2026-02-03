'use client';

import { clsx } from 'clsx';
import { Circle } from 'lucide-react';
import { AgentType, AgentStatus } from '@/lib/types';
import { AGENT_META } from '@/lib/constants';
import { statusColor } from '@/lib/formatters';

interface AgentCardProps {
  type: AgentType;
  status: AgentStatus;
  isRunning: boolean;
}

export default function AgentCard({ type, status, isRunning }: AgentCardProps) {
  const meta = AGENT_META[type];
  const Icon = meta.icon;

  return (
    <div
      className={clsx(
        'bg-cyber-card border border-cyber-border rounded-lg p-3 transition-all duration-300',
        'hover:border-opacity-60',
        isRunning && 'hover:shadow-lg',
      )}
      style={{
        borderColor: isRunning ? `${meta.color}30` : undefined,
      }}
    >
      <div className="flex items-center justify-between mb-2">
        <div
          className="w-8 h-8 rounded flex items-center justify-center"
          style={{ backgroundColor: `${meta.color}15` }}
        >
          <Icon size={16} style={{ color: meta.color }} />
        </div>
        <div className="flex items-center gap-1.5">
          <Circle
            size={6}
            className={clsx(
              'transition-colors',
              isRunning ? 'fill-cyber-green text-cyber-green' : 'fill-cyber-red text-cyber-red',
            )}
          />
          <span className={clsx('text-[10px] uppercase font-medium', statusColor(status))}>
            {status}
          </span>
        </div>
      </div>
      <p className="text-xs font-medium text-cyber-text truncate">{meta.shortName}</p>
      <p className="text-[10px] text-cyber-text-dim truncate mt-0.5">{meta.description}</p>
    </div>
  );
}
