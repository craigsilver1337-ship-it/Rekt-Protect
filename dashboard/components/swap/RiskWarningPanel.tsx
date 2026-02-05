'use client';

import { ShieldCheck, ShieldAlert, ShieldX, Loader2 } from 'lucide-react';
import { GlowCard } from '@/components/shared';
import { riskScoreColor } from '@/lib/formatters';
import type { SwapQuoteResult } from '@/lib/types';

interface RiskWarningPanelProps {
  quoteResult: SwapQuoteResult | null;
  scanning: boolean;
}

export default function RiskWarningPanel({ quoteResult, scanning }: RiskWarningPanelProps) {
  if (scanning) {
    return (
      <GlowCard glow="blue">
        <div className="flex flex-col items-center py-4 gap-3">
          <Loader2 size={24} className="text-cyber-blue animate-spin" />
          <div className="text-sm text-cyber-blue font-mono">Scanning token...</div>
          <p className="text-[10px] text-cyber-text-dim text-center">
            Analyzing for rug pulls, honeypots, and security threats
          </p>
        </div>
      </GlowCard>
    );
  }

  if (!quoteResult) {
    return (
      <GlowCard>
        <div className="text-center py-6">
          <ShieldCheck size={32} className="text-cyber-text-dim mx-auto mb-2 opacity-30" />
          <p className="text-xs text-cyber-text-dim">
            Select tokens and enter an amount to see risk analysis
          </p>
        </div>
      </GlowCard>
    );
  }

  const { riskReport, safeToSwap, riskWarning } = quoteResult;
  const score = riskReport?.riskScore ?? 0;
  const threatLevel = riskReport?.threatLevel ?? 'SAFE';
  const color = riskScoreColor(score);

  // Determine glow and icon
  let glow: 'green' | 'red' | 'blue' = 'green';
  let Icon = ShieldCheck;
  let statusText = 'Token passed security scan';
  let statusColor = 'text-cyber-green';

  if (!safeToSwap) {
    glow = 'red';
    Icon = ShieldX;
    statusText = 'SWAP BLOCKED — High Risk Detected';
    statusColor = 'text-cyber-red';
  } else if (threatLevel === 'MEDIUM') {
    glow = 'blue';
    Icon = ShieldAlert;
    statusText = 'Caution — Medium Risk';
    statusColor = 'text-cyber-yellow';
  }

  return (
    <GlowCard glow={glow}>
      <div className="flex items-center gap-2 mb-3">
        <ShieldCheck size={14} className="text-cyber-green" />
        <h3 className="text-xs font-bold text-cyber-red uppercase tracking-widest">
          REKT PROTECT Risk Scan
        </h3>
      </div>

      {/* Mini risk gauge */}
      <div className="flex flex-col items-center mb-3">
        <svg width="120" height="120" viewBox="0 0 120 120">
          <circle cx="60" cy="60" r="45" fill="none" stroke="#1e1e2e" strokeWidth="8" />
          <circle
            cx="60"
            cy="60"
            r="45"
            fill="none"
            stroke={color}
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={2 * Math.PI * 45}
            strokeDashoffset={2 * Math.PI * 45 - (score / 100) * 2 * Math.PI * 45}
            transform="rotate(-90 60 60)"
            style={{ transition: 'stroke-dashoffset 0.8s ease-out' }}
          />
          <text x="60" y="55" textAnchor="middle" fill={color} fontSize="24" fontFamily="monospace" fontWeight="bold">
            {score}
          </text>
          <text x="60" y="72" textAnchor="middle" fill="#808090" fontSize="8" fontFamily="monospace">
            RISK SCORE
          </text>
        </svg>
      </div>

      {/* Status */}
      <div className="flex items-center justify-center gap-2 mb-2">
        <Icon size={16} className={statusColor} />
        <span className={`text-sm font-mono font-bold ${statusColor}`}>{threatLevel}</span>
      </div>
      <p className="text-xs text-center text-cyber-text-dim mb-2">{statusText}</p>

      {/* Risk warning message */}
      {riskWarning && (
        <div className={`text-[10px] p-2 rounded border ${safeToSwap
            ? 'bg-cyber-yellow/10 border-cyber-yellow/30 text-cyber-yellow'
            : 'bg-cyber-red/10 border-cyber-red/30 text-cyber-red'
          }`}>
          {riskWarning}
        </div>
      )}

      {/* Threat details */}
      {riskReport && riskReport.threats.length > 0 && (
        <div className="mt-3 space-y-1">
          <div className="text-[10px] text-cyber-text-dim uppercase tracking-wider">Threats Found</div>
          {riskReport.threats.slice(0, 3).map((threat, i) => (
            <div key={i} className="text-[10px] text-cyber-text-dim flex items-start gap-1">
              <span className="text-cyber-red mt-0.5">*</span>
              <span>{threat.description}</span>
            </div>
          ))}
        </div>
      )}
    </GlowCard>
  );
}
