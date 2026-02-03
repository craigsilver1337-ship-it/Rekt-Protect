'use client';

import { ThreatDetail } from '@/lib/types';
import { ThreatBadge } from '@/components/shared';
import { AlertTriangle } from 'lucide-react';

interface ThreatListProps {
  threats: ThreatDetail[];
}

export default function ThreatList({ threats }: ThreatListProps) {
  if (threats.length === 0) {
    return (
      <div className="text-center py-6 text-cyber-text-dim text-xs">
        No threats detected
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2 mb-2">
        <AlertTriangle size={14} className="text-cyber-orange" />
        <h3 className="text-sm font-bold text-cyber-text-dim uppercase tracking-wider">
          Detected Threats ({threats.length})
        </h3>
      </div>
      {threats.map((threat, i) => (
        <div
          key={i}
          className="bg-cyber-darker border border-cyber-border rounded p-3"
        >
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs font-medium text-cyber-text">
              {threat.type.replace(/_/g, ' ')}
            </span>
            <div className="flex items-center gap-2">
              <ThreatBadge level={threat.severity} />
              <span className="text-[10px] text-cyber-text-dim">
                {threat.confidence}% conf
              </span>
            </div>
          </div>
          <p className="text-[11px] text-cyber-text-dim">{threat.description}</p>
          {threat.evidence && (
            <p className="text-[10px] text-cyber-text-dim/60 mt-1 italic">
              Evidence: {threat.evidence}
            </p>
          )}
        </div>
      ))}
    </div>
  );
}
