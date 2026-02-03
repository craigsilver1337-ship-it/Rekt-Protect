'use client';

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
  const strokeDashoffset = circumference - (score / 100) * circumference;

  return (
    <div className="flex flex-col items-center">
      <svg width="200" height="200" viewBox="0 0 200 200">
        {/* Background circle */}
        <circle
          cx="100"
          cy="100"
          r={radius}
          fill="none"
          stroke="#1e1e2e"
          strokeWidth="12"
        />
        {/* Score arc */}
        <circle
          cx="100"
          cy="100"
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth="12"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          transform="rotate(-90 100 100)"
          style={{ transition: 'stroke-dashoffset 0.8s ease-out, stroke 0.5s ease' }}
          opacity="0.85"
        />
        {/* Glow filter */}
        <defs>
          <filter id="glow">
            <feGaussianBlur stdDeviation="3" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        {/* Score text */}
        <text
          x="100"
          y="92"
          textAnchor="middle"
          fill={color}
          fontSize="36"
          fontFamily="monospace"
          fontWeight="bold"
          filter="url(#glow)"
        >
          {score}
        </text>
        <text
          x="100"
          y="112"
          textAnchor="middle"
          fill="#808090"
          fontSize="10"
          fontFamily="monospace"
          style={{ textTransform: 'uppercase' }}
        >
          RISK SCORE
        </text>
        <text
          x="100"
          y="130"
          textAnchor="middle"
          fill={color}
          fontSize="12"
          fontFamily="monospace"
          fontWeight="bold"
        >
          {threatLevel}
        </text>
      </svg>
    </div>
  );
}
