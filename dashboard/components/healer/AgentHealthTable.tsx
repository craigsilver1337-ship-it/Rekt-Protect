'use client';

import { AgentHealth } from '@/lib/types';
import { AGENT_META } from '@/lib/constants';
import { statusColor } from '@/lib/formatters';
import { clsx } from 'clsx';
import { Heart, AlertCircle, RefreshCw } from 'lucide-react';

interface AgentHealthTableProps {
  agents: AgentHealth[];
}

export default function AgentHealthTable({ agents }: AgentHealthTableProps) {
  return (
    <div className="bg-cyber-card border border-cyber-border rounded-lg overflow-hidden">
      <div className="flex items-center gap-2 px-4 py-3 border-b border-cyber-border">
        <Heart size={14} className="text-cyber-green" />
        <h3 className="text-sm font-bold text-cyber-text-dim uppercase tracking-wider">
          Agent Health ({agents.length})
        </h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-xs">
          <thead>
            <tr className="border-b border-cyber-border text-cyber-text-dim">
              <th className="text-left px-4 py-2 font-medium">Agent</th>
              <th className="text-left px-4 py-2 font-medium">Status</th>
              <th className="text-right px-4 py-2 font-medium">Failures</th>
              <th className="text-right px-4 py-2 font-medium">Restarts</th>
              <th className="text-left px-4 py-2 font-medium">Circuit</th>
            </tr>
          </thead>
          <tbody>
            {agents.map((agent) => {
              const meta = AGENT_META[agent.agent];
              const Icon = meta?.icon ?? Heart;
              return (
                <tr key={agent.agent} className="border-b border-cyber-border/50 hover:bg-cyber-darker transition-colors">
                  <td className="px-4 py-2">
                    <div className="flex items-center gap-2">
                      <Icon size={12} style={{ color: meta?.color }} />
                      <span className="text-cyber-text">{meta?.shortName ?? agent.agent}</span>
                    </div>
                  </td>
                  <td className="px-4 py-2">
                    <span className={clsx('flex items-center gap-1', statusColor(agent.status))}>
                      {agent.status === 'failed' && <AlertCircle size={10} />}
                      {agent.status === 'restarting' && <RefreshCw size={10} className="animate-spin" />}
                      {agent.status}
                    </span>
                  </td>
                  <td className="px-4 py-2 text-right">
                    <span className={agent.failureCount > 0 ? 'text-cyber-red' : 'text-cyber-text-dim'}>
                      {agent.failureCount}
                    </span>
                  </td>
                  <td className="px-4 py-2 text-right">
                    <span className={agent.autoRestarts > 0 ? 'text-cyber-orange' : 'text-cyber-text-dim'}>
                      {agent.autoRestarts}
                    </span>
                  </td>
                  <td className="px-4 py-2">
                    <span className={clsx(
                      'text-[10px] px-2 py-0.5 rounded',
                      agent.circuitOpen
                        ? 'bg-cyber-red/10 text-cyber-red border border-cyber-red/30'
                        : 'bg-cyber-green/10 text-cyber-green border border-cyber-green/30',
                    )}>
                      {agent.circuitOpen ? 'OPEN' : 'CLOSED'}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
