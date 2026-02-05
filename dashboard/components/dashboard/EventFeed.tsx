'use client';

import { useEvents } from '@/hooks';
import { SwarmEvent } from '@/lib/types';
import { AGENT_META } from '@/lib/constants';
import { formatTime, threatLevelColor } from '@/lib/formatters';
import { clsx } from 'clsx';
import { Activity } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function EventFeed() {
  const { data } = useEvents();
  const events: SwarmEvent[] = data?.events?.slice(0, 20) ?? [];

  return (
    <div className="bg-cyber-card/40 backdrop-blur-xl border border-cyber-border rounded-xl p-5 flex flex-col h-full overflow-hidden">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="relative">
            <Activity size={16} className="text-cyber-green" />
            <motion.div
              className="absolute inset-0 text-cyber-green opacity-50"
              animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Activity size={16} />
            </motion.div>
          </div>
          <h3 className="text-xs font-bold text-cyber-text-dim uppercase tracking-[0.2em]">
            Live Event Feed
          </h3>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-cyber-green animate-pulse" />
          <span className="text-[10px] text-cyber-green/70 font-mono font-bold tracking-tighter">LIVE_MONITOR</span>
        </div>
      </div>

      <div className="flex-1 space-y-2 overflow-y-auto pr-2 custom-scrollbar">
        <AnimatePresence initial={false}>
          {events.length === 0 ? (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-xs text-cyber-text-dim py-12 text-center font-mono italic"
            >
              Initializing sensor array...
            </motion.p>
          ) : (
            events.map((event, idx) => {
              const agentMeta = AGENT_META[event.source];
              const Icon = agentMeta?.icon ?? Activity;
              return (
                <motion.div
                  layout
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  key={event.id}
                  className="group flex items-start gap-4 p-3 rounded-lg bg-cyber-dark/30 border border-transparent hover:border-cyber-border hover:bg-cyber-card/60 transition-all duration-300"
                >
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: `${agentMeta?.color}10`, border: `1px solid ${agentMeta?.color}20` }}
                  >
                    <Icon
                      size={14}
                      style={{ color: agentMeta?.color ?? '#808090' }}
                    />
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between mb-0.5">
                      <div className="flex items-center gap-2">
                        <span
                          className="text-[11px] font-bold tracking-tight"
                          style={{ color: agentMeta?.color }}
                        >
                          {agentMeta?.shortName ?? event.source}
                        </span>
                        <span className={clsx('text-[10px] font-mono px-1.5 py-0.5 rounded-md bg-black/40', threatLevelColor(event.priority))}>
                          {event.priority}
                        </span>
                      </div>
                      <span className="text-[10px] text-cyber-text-dim font-mono">
                        {formatTime(event.timestamp)}
                      </span>
                    </div>
                    <p className="text-[11px] text-cyber-text-dim leading-relaxed truncate group-hover:text-cyber-text transition-colors">
                      {event.type.replace(/_/g, ' ')}
                      {event.target !== 'ALL' ? ` → ${event.target}` : ''}
                    </p>
                  </div>
                </motion.div>
              );
            })
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
