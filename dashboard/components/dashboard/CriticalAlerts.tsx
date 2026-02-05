'use client';

import { useCriticalEvents } from '@/hooks';
import { SwarmEvent } from '@/lib/types';
import { AGENT_META } from '@/lib/constants';
import { formatTime, threatLevelColor } from '@/lib/formatters';
import { AlertTriangle } from 'lucide-react';
import { clsx } from 'clsx';
import { motion, AnimatePresence } from 'framer-motion';

export default function CriticalAlerts() {
  const { data } = useCriticalEvents();
  const events: SwarmEvent[] = data?.events?.slice(0, 10) ?? [];

  return (
    <div className="bg-cyber-card/40 backdrop-blur-xl border border-cyber-red/30 rounded-xl p-5 relative overflow-hidden">
      <div className="flex items-center gap-2 mb-4">
        <div className="relative">
          <AlertTriangle size={16} className="text-cyber-red" />
          <motion.div
            className="absolute inset-0 text-cyber-red opacity-50"
            animate={{ scale: [1, 1.8, 1], opacity: [0.5, 0, 0.5] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            <AlertTriangle size={16} />
          </motion.div>
        </div>
        <h3 className="text-xs font-bold text-cyber-red uppercase tracking-[0.2em]">
          Critical Alerts
        </h3>
        <AnimatePresence>
          {events.length > 0 && (
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              className="ml-auto bg-cyber-red text-black text-[10px] px-2 py-0.5 rounded-md font-bold tracking-tighter"
            >
              DETECTED: {events.length}
            </motion.span>
          )}
        </AnimatePresence>
      </div>

      <div className="space-y-2 max-h-[200px] overflow-y-auto pr-2 custom-scrollbar">
        {events.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-10 opacity-40">
            <span className="text-[10px] text-cyber-text-dim uppercase tracking-widest font-mono">No active threats detected</span>
          </div>
        ) : (
          events.map((event) => {
            const agentMeta = AGENT_META[event.source];
            return (
              <motion.div
                initial={{ x: 20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                key={event.id}
                className="flex items-center gap-3 p-2.5 rounded-lg bg-cyber-red/5 border border-cyber-red/20 group hover:bg-cyber-red/10 transition-colors"
              >
                <div className="flex flex-col items-center min-w-[40px]">
                  <span className={clsx('text-[9px] font-black uppercase tracking-tighter px-1 rounded', threatLevelColor(event.priority), 'bg-black/40')}>
                    {event.priority}
                  </span>
                </div>

                <div className="min-w-0 flex-1">
                  <p className="text-[11px] text-cyber-text font-medium truncate">
                    <span className="text-cyber-red/60 font-mono mr-1">[{agentMeta?.shortName}]</span>
                    {event.type.replace(/_/g, ' ')}
                  </p>
                  <span className="text-[9px] text-cyber-text-dim font-mono">
                    {formatTime(event.timestamp)}
                  </span>
                </div>
              </motion.div>
            );
          })
        )}
      </div>

      {/* Background Pulse */}
      {events.length > 0 && (
        <motion.div
          className="absolute inset-0 pointer-events-none border-2 border-cyber-red/20 rounded-xl"
          animate={{ opacity: [0, 0.3, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
      )}
    </div>
  );
}
