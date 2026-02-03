'use client';

import { clsx } from 'clsx';
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
    <div
      className={clsx(
        'bg-cyber-card border border-cyber-border rounded-lg p-4 flex items-center gap-3',
        className,
      )}
    >
      <div
        className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
        style={{ backgroundColor: `${color}15`, border: `1px solid ${color}30` }}
      >
        <Icon size={18} style={{ color }} />
      </div>
      <div className="min-w-0">
        <p className="text-xs text-cyber-text-dim uppercase tracking-wider">{label}</p>
        <p className="text-lg font-bold" style={{ color }}>
          {value}
        </p>
        {subValue && (
          <p className="text-xs text-cyber-text-dim">{subValue}</p>
        )}
      </div>
    </div>
  );
}
