'use client';

import { clsx } from 'clsx';
import { motion } from 'framer-motion';

interface GlowCardProps {
  children: React.ReactNode;
  className?: string;
  glow?: 'green' | 'blue' | 'red' | 'purple' | 'none';
  hover?: boolean;
  onClick?: () => void;
  delay?: number;
}

const colorMap = {
  green: '#00ff88',
  blue: '#00d4ff',
  red: '#ff3366',
  purple: '#a855f7',
  none: 'transparent',
};

export default function GlowCard({
  children,
  className,
  glow = 'none',
  hover = true,
  onClick,
  delay = 0,
}: GlowCardProps) {
  const color = colorMap[glow];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay, ease: "easeOut" }}
      whileHover={hover ? { y: -2 } : {}}
      onClick={onClick}
      className={clsx(
        'relative bg-cyber-card/40 backdrop-blur-xl border border-cyber-border rounded-xl p-4 overflow-hidden',
        'transition-all duration-300 group',
        onClick && 'cursor-pointer active:scale-[0.98]',
        glow !== 'none' && 'border-opacity-30',
        className,
      )}
      style={{
        borderColor: glow !== 'none' ? `${color}40` : undefined,
        boxShadow: glow !== 'none' ? `0 0 20px ${color}10` : 'none',
      }}
    >
      {/* Background Glow */}
      {glow !== 'none' && (
        <div
          className="absolute -inset-2 opacity-[0.03] group-hover:opacity-[0.06] transition-opacity duration-500 pointer-events-none"
          style={{ background: `radial-gradient(circle at center, ${color} 0%, transparent 70%)` }}
        />
      )}

      {/* Shine Effect */}
      {hover && (
        <div className="absolute top-0 -inset-full h-full w-1/2 z-5 block transform -skew-x-12 bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-0 group-hover:animate-shine pointer-events-none" />
      )}

      <div className="relative z-10">
        {children}
      </div>

      {/* Border Highlight Effect */}
      {glow !== 'none' && (
        <motion.div
          className="absolute inset-0 pointer-events-none rounded-xl border border-transparent"
          animate={{
            borderColor: [`${color}10`, `${color}30`, `${color}10`],
          }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        />
      )}
    </motion.div>
  );
}
