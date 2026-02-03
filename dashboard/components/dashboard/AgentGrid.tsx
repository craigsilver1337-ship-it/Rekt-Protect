'use client';

import { useSwarmStatus } from '@/hooks';
import { AgentType, AgentStatus } from '@/lib/types';
import AgentCard from './AgentCard';

export default function AgentGrid() {
  const { data } = useSwarmStatus();

  const agents = data?.agents ?? Object.values(AgentType).map((type) => ({
    type,
    status: AgentStatus.IDLE,
    isRunning: false,
  }));

  return (
    <div>
      <h2 className="text-sm font-bold text-cyber-text-dim uppercase tracking-wider mb-3">
        Agent Swarm
      </h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2">
        {agents.map((agent) => (
          <AgentCard
            key={agent.type}
            type={agent.type as AgentType}
            status={(agent.status as AgentStatus) ?? AgentStatus.IDLE}
            isRunning={agent.isRunning ?? false}
          />
        ))}
      </div>
    </div>
  );
}
