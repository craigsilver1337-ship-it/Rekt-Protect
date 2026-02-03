'use client';

import { clsx } from 'clsx';
import { motion } from 'framer-motion';

interface GlowCardProps {
  children: React.ReactNode;
  className?: string;
  glow?: 'green' | 'blue' | 'red' | 'purple' | 'none';
  hover?: boolean;
  onClick?: () => void;
}

const glowMap = {
  green: 'shadow-glow-green hover:shadow-[0_0_30px_rgba(0,255,136,0.2)]',
  blue: 'shadow-glow-blue hover:shadow-[0_0_30px_rgba(0,212,255,0.2)]',
  red: 'shadow-glow-red hover:shadow-[0_0_30px_rgba(255,51,102,0.2)]',
  purple: 'shadow-glow-purple hover:shadow-[0_0_30px_rgba(168,85,247,0.2)]',
  none: '',
};

export default function GlowCard({
  children,
  className,
  glow = 'none',
  hover = true,
  onClick,
}: GlowCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      onClick={onClick}
      className={clsx(
        'bg-cyber-card border border-cyber-border rounded-lg p-4',
        'transition-all duration-300',
        hover && 'hover:border-cyber-green/30',
        onClick && 'cursor-pointer',
        glowMap[glow],
        className,
      )}
    >
      {children}
    </motion.div>
  );
}
