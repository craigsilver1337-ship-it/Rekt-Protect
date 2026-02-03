'use client';

import { NetworkStatsGrid, MEVPanel, ProgramUpgrades } from '@/components/network';
import { useNetworkHealth } from '@/hooks';
import { NetworkHealthReport } from '@/lib/types';

export default function NetworkTab() {
  const { data } = useNetworkHealth();
  const health = data as NetworkHealthReport | null;

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-lg font-bold text-cyber-blue glow-text-blue mb-1">
          Network Monitor
        </h1>
        <p className="text-xs text-cyber-text-dim">
          Solana network health, congestion, DDoS detection, and MEV monitoring
        </p>
      </div>

      <NetworkStatsGrid health={health} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <MEVPanel mev={health?.mevActivity ?? null} />
        <ProgramUpgrades upgrades={health?.programUpgrades ?? []} />
      </div>
    </div>
  );
}
