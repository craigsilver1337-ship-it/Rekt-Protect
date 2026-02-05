'use client';

import { motion } from 'framer-motion';
import { useSwarmStatus } from '@/hooks';
import { AgentType, AgentStatus } from '@/lib/types';
import AgentCard from './AgentCard';

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
    },
  },
};

export default function AgentGrid() {
  const { data } = useSwarmStatus();

  const agents = data?.agents ?? Object.values(AgentType).map((type) => ({
    type,
    status: AgentStatus.IDLE,
    isRunning: false,
  }));

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xs font-bold text-cyber-text-dim uppercase tracking-[0.2em]">
          Agent Swarm
        </h2>
        <div className="flex items-center gap-2">
          <div className="h-[1px] w-24 bg-gradient-to-r from-cyber-border to-transparent" />
          <span className="text-[10px] text-cyber-green/50 font-mono">ACTIVE_SWARM_V2.1</span>
        </div>
      </div>

      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3"
      >
        {agents.map((agent) => (
          <AgentCard
            key={agent.type}
            type={agent.type as AgentType}
            status={(agent.status as AgentStatus) ?? AgentStatus.IDLE}
            isRunning={agent.isRunning ?? false}
          />
        ))}
      </motion.div>
    </div>
  );
}
