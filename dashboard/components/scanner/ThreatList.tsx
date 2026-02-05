'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { ThreatDetail } from '@/lib/types';
import { ThreatBadge } from '@/components/shared';
import { ShieldAlert, CheckCircle2 } from 'lucide-react';
import { clsx } from 'clsx';

interface ThreatListProps {
  threats: ThreatDetail[];
}

export default function ThreatList({ threats }: ThreatListProps) {
  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          {threats.length > 0 ? (
            <ShieldAlert size={16} className="text-cyber-red" />
          ) : (
            <CheckCircle2 size={16} className="text-cyber-green" />
          )}
          <h3 className="text-xs font-bold text-cyber-text-dim uppercase tracking-[0.2em]">
            Threat Analysis
          </h3>
        </div>
        {threats.length > 0 && (
          <span className="text-[10px] bg-cyber-red/20 text-cyber-red px-2 py-0.5 rounded font-bold">
            {threats.length} DETECTED
          </span>
        )}
      </div>

      <div className="space-y-3 overflow-y-auto pr-2 custom-scrollbar max-h-[400px]">
        <AnimatePresence mode="popLayout">
          {threats.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center justify-center py-10 opacity-40"
            >
              <CheckCircle2 size={32} className="text-cyber-green mb-2" />
              <span className="text-[10px] text-cyber-text-dim uppercase tracking-widest font-mono">No threats detected</span>
            </motion.div>
          ) : (
            threats.map((threat, idx) => (
              <motion.div
                key={`${threat.type}-${idx}`}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="group p-3 rounded-lg bg-cyber-dark/30 border border-cyber-border/50 hover:border-cyber-red/30 hover:bg-cyber-red/[0.02] transition-all duration-300"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-bold text-cyber-text tracking-tight uppercase group-hover:text-cyber-red transition-colors">
                    {threat.type.replace(/_/g, ' ')}
                  </span>
                  <div className="flex items-center gap-2">
                    <ThreatBadge level={threat.severity} />
                    <span className="text-[9px] font-mono text-cyber-text-dim bg-black/40 px-1.5 py-0.5 rounded">
                      {threat.confidence}% CONF
                    </span>
                  </div>
                </div>

                <p className="text-[11px] text-cyber-text-dim leading-relaxed group-hover:text-cyber-text transition-colors">
                  {threat.description}
                </p>

                {threat.evidence && (
                  <div className="mt-2 flex items-start gap-1.5">
                    <div className="w-[2px] self-stretch bg-cyber-border group-hover:bg-cyber-red/30" />
                    <p className="text-[10px] text-cyber-text-dim/60 font-mono italic">
                      EVIDENCE: {threat.evidence}
                    </p>
                  </div>
                )}
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
