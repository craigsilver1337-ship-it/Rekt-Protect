'use client';

import { clsx } from 'clsx';
import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  label: string;
  value: string | number;
  icon: LucideIcon;
  color?: string;
  subValue?: string;
  className?: string;
}

export default function StatCard({
  label,
  value,
  icon: Icon,
  color = '#00ff88',
  subValue,
  className,
}: StatCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: 1.02, y: -2 }}
      className={clsx(
        'relative bg-cyber-card/40 backdrop-blur-xl border border-cyber-border rounded-xl p-4 flex items-center gap-4 group overflow-hidden',
        className,
      )}
      style={{
        boxShadow: `0 0 20px ${color}05`,
      }}
    >
      <div
        className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 relative overflow-hidden"
        style={{
          backgroundColor: `${color}10`,
          border: `1px solid ${color}30`
        }}
      >
        <motion.div
          className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent"
          animate={{
            x: ['-100%', '200%'],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "linear",
            delay: Math.random() * 2,
          }}
        />
        <Icon size={22} style={{ color }} className="relative z-10" />
      </div>

      <div className="min-w-0 relative z-10">
        <p className="text-[10px] text-cyber-text-dim uppercase tracking-[0.2em] mb-1">{label}</p>
        <div className="flex items-baseline gap-2">
          <p className="text-xl font-bold tracking-tight" style={{ color }}>
            {value}
          </p>
          {subValue && (
            <span className="text-[10px] text-cyber-text-dim font-mono">{subValue}</span>
          )}
        </div>
      </div>

      {/* Decorative background element */}
      <div
        className="absolute -right-4 -bottom-4 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity duration-500"
        style={{ color }}
      >
        <Icon size={80} />
      </div>

      {/* Hover Light Streak */}
      <div className="absolute top-0 -inset-full h-full w-1/2 z-5 block transform -skew-x-12 bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-0 group-hover:animate-shine pointer-events-none" />
    </motion.div>
  );
}
