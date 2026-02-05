'use client';

import { motion } from 'framer-motion';
import { riskScoreColor } from '@/lib/formatters';
import { ThreatLevel } from '@/lib/types';

interface RiskGaugeProps {
  score: number;
  threatLevel: ThreatLevel;
}

export default function RiskGauge({ score, threatLevel }: RiskGaugeProps) {
  const color = riskScoreColor(score);
  const radius = 70;
  const circumference = 2 * Math.PI * radius;

  return (
    <div className="flex flex-col items-center relative group">
      <svg width="220" height="220" viewBox="0 0 200 200" className="transform -rotate-90">
        <defs>
          <linearGradient id="gaugeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={color} stopOpacity="0.4" />
            <stop offset="100%" stopColor={color} stopOpacity="1" />
          </linearGradient>
          <filter id="gaugeGlow">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Background track */}
        <circle
          cx="100"
          cy="100"
          r={radius}
          fill="none"
          stroke="rgba(255,255,255,0.05)"
          strokeWidth="10"
        />

        {/* Animated score arc */}
        <motion.circle
          cx="100"
          cy="100"
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth="10"
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: circumference - (score / 100) * circumference }}
          transition={{ duration: 1.5, ease: "easeOut", delay: 0.5 }}
          style={{ filter: `drop-shadow(0 0 8px ${color}60)` }}
        />

        {/* Floating particles along the arc (optional/advanced, skipping for stability) */}
      </svg>

      {/* Center Text */}
      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
        <motion.span
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 1 }}
          className="text-4xl font-black font-mono tracking-tighter"
          style={{ color, filter: `drop-shadow(0 0 10px ${color}40)` }}
        >
          {score}
        </motion.span>
        <span className="text-[10px] text-cyber-text-dim uppercase tracking-[0.3em] font-bold mt-1">RISK_SCORE</span>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="mt-1 px-3 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-widest border"
          style={{
            color,
            borderColor: `${color}40`,
            backgroundColor: `${color}10`
          }}
        >
          {threatLevel}
        </motion.div>
      </div>
    </div>
  );
}
