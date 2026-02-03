'use client';

import { Incident } from '@/lib/types';
import { ThreatBadge } from '@/components/shared';
import { formatTime } from '@/lib/formatters';
import { FileWarning } from 'lucide-react';
import { clsx } from 'clsx';
import { ThreatLevel } from '@/lib/types';

interface IncidentLogProps {
  incidents: Incident[];
}

const PHASE_COLORS: Record<string, string> = {
  detect: 'text-cyber-blue',
  classify: 'text-cyber-purple',
  contain: 'text-cyber-orange',
  eradicate: 'text-cyber-red',
  recover: 'text-cyber-green',
  learn: 'text-cyber-yellow',
};

const STATUS_COLORS: Record<string, string> = {
  active: 'bg-cyber-yellow/10 text-cyber-yellow border-cyber-yellow/30',
  resolved: 'bg-cyber-green/10 text-cyber-green border-cyber-green/30',
  failed: 'bg-cyber-red/10 text-cyber-red border-cyber-red/30',
};

export default function IncidentLog({ incidents }: IncidentLogProps) {
  return (
    <div className="bg-cyber-card border border-cyber-border rounded-lg p-4">
      <div className="flex items-center gap-2 mb-3">
        <FileWarning size={14} className="text-cyber-orange" />
        <h3 className="text-sm font-bold text-cyber-text-dim uppercase tracking-wider">
          Incident Log ({incidents.length})
        </h3>
      </div>
      <div className="space-y-2 max-h-[400px] overflow-y-auto">
        {incidents.length === 0 ? (
          <p className="text-xs text-cyber-text-dim text-center py-4">No incidents recorded</p>
        ) : (
          incidents.map((incident) => (
            <div key={incident.id} className="bg-cyber-darker border border-cyber-border rounded p-2.5">
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-2">
                  <span className={clsx('text-[10px] px-2 py-0.5 rounded border', STATUS_COLORS[incident.status])}>
                    {incident.status.toUpperCase()}
                  </span>
                  <span className={clsx('text-[10px] font-medium', PHASE_COLORS[incident.phase])}>
                    Phase: {incident.phase}
                  </span>
                </div>
                <span className="text-[10px] text-cyber-text-dim">
                  {formatTime(incident.createdAt)}
                </span>
              </div>
              <p className="text-[11px] text-cyber-text">
                [{incident.source}] {incident.type.replace(/_/g, ' ')}
              </p>
              {incident.classification && (
                <div className="mt-1.5 flex items-center gap-2">
                  <ThreatBadge level={incident.classification.severity as ThreatLevel} />
                  <span className="text-[10px] text-cyber-text-dim truncate">
                    {incident.classification.reason}
                  </span>
                </div>
              )}
              {incident.resolvedBy && (
                <p className="text-[10px] text-cyber-green mt-1">
                  Resolved by: {incident.resolvedBy}
                </p>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
