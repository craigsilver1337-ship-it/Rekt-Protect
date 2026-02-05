'use client';

import { clsx } from 'clsx';
import { motion, AnimatePresence } from 'framer-motion';
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
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2, scale: 1.02 }}
      className={clsx(
        'relative bg-cyber-card/50 backdrop-blur-md border border-cyber-border rounded-xl p-4 transition-colors duration-300',
        'hover:border-opacity-100 group overflow-hidden'
      )}
      style={{
        borderColor: isRunning ? `${meta.color}40` : undefined,
        boxShadow: isRunning ? `0 0 15px ${meta.color}10` : 'none',
      }}
    >
      {/* Active Pulse Glow */}
      <AnimatePresence>
        {isRunning && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 pointer-events-none"
            style={{
              background: `radial-gradient(circle at center, ${meta.color}05 0%, transparent 100%)`,
            }}
          />
        )}
      </AnimatePresence>

      <div className="relative z-10">
        <div className="flex items-center justify-between mb-3">
          <div className="relative">
            <motion.div
              className="w-10 h-10 rounded-lg flex items-center justify-center relative overflow-hidden"
              style={{
                backgroundColor: `${meta.color}15`,
                border: `1px solid ${meta.color}30`
              }}
              animate={isRunning ? {
                boxShadow: [`0 0 0px ${meta.color}00`, `0 0 12px ${meta.color}40`, `0 0 0px ${meta.color}00`]
              } : {}}
              transition={{ duration: 2, repeat: Infinity }}
            >
              {/* Radar Scan Effect */}
              {isRunning && (
                <motion.div
                  className="absolute z-0"
                  style={{
                    width: '200%',
                    height: '200%',
                    background: `conic-gradient(from 0deg, ${meta.color}40 0%, transparent 30%, transparent 100%)`,
                    borderRadius: '50%',
                    left: '-50%',
                    top: '-50%',
                  }}
                  animate={{ rotate: 360 }}
                  transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                />
              )}

              <Icon
                size={18}
                style={{ color: meta.color }}
                className={clsx('relative z-10 transition-transform duration-500', isRunning && 'scale-110')}
              />

              {/* Internal Depth Glow */}
              {isRunning && (
                <motion.div
                  className="absolute inset-0 z-5"
                  style={{
                    background: `radial-gradient(circle at center, ${meta.color}15 0%, transparent 80%)`
                  }}
                  animate={{ opacity: [1, 0.4, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
              )}
            </motion.div>
          </div>

          <div className="flex flex-col items-end">
            <div className="flex items-center gap-1.5 mb-1">
              <motion.div
                animate={isRunning ? {
                  scale: [1, 1.2, 1],
                  opacity: [1, 0.6, 1],
                } : {}}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                <Circle
                  size={6}
                  className={clsx(
                    'transition-colors',
                    isRunning ? 'fill-cyber-green text-cyber-green' : 'fill-cyber-red text-cyber-red',
                  )}
                />
              </motion.div>
              <span className={clsx('text-[10px] tracking-widest uppercase font-bold', statusColor(status))}>
                {status}
              </span>
            </div>
            {isRunning && (
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-[9px] text-cyber-green font-mono"
              >
                LIVE
              </motion.span>
            )}
          </div>
        </div>

        <div>
          <h3 className="text-xs font-bold text-cyber-text group-hover:text-white transition-colors">
            {meta.shortName}
          </h3>
          <p className="text-[10px] text-cyber-text-dim leading-relaxed mt-1 line-clamp-2">
            {meta.description}
          </p>
        </div>
      </div>

      {/* Hover Light Streak */}
      <div className="absolute top-0 -inset-full h-full w-1/2 z-5 block transform -skew-x-12 bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-0 group-hover:animate-shine pointer-events-none" />
    </motion.div>
  );
}
