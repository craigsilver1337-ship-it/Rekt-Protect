'use client';

import { ProgramUpgrade } from '@/lib/types';
import { ThreatBadge } from '@/components/shared';
import { formatAddress, formatTime } from '@/lib/formatters';
import { Upload } from 'lucide-react';

interface ProgramUpgradesProps {
  upgrades: ProgramUpgrade[];
}

export default function ProgramUpgrades({ upgrades }: ProgramUpgradesProps) {
  return (
    <div className="bg-cyber-card border border-cyber-border rounded-lg p-4">
      <div className="flex items-center gap-2 mb-3">
        <Upload size={14} className="text-cyber-blue" />
        <h3 className="text-sm font-bold text-cyber-text-dim uppercase tracking-wider">
          Program Upgrades
        </h3>
      </div>
      <div className="space-y-2 max-h-[300px] overflow-y-auto">
        {upgrades.length === 0 ? (
          <p className="text-xs text-cyber-text-dim text-center py-4">No recent upgrades</p>
        ) : (
          upgrades.map((upgrade, i) => (
            <div key={i} className="bg-cyber-darker border border-cyber-border rounded p-2.5">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs text-cyber-text font-medium">
                  {upgrade.programName}
                </span>
                <ThreatBadge level={upgrade.riskAssessment} />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono text-cyber-text-dim">
                  {formatAddress(upgrade.programId, 6)}
                </span>
                <span className="text-[10px] text-cyber-text-dim">
                  {formatTime(upgrade.upgradeTime)}
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
