'use client';

import { NetworkHealthReport, ThreatLevel } from '@/lib/types';
import { StatCard } from '@/components/shared';
import { Zap, Clock, Server, ShieldAlert, AlertTriangle, Layers } from 'lucide-react';
import { formatNumber } from '@/lib/formatters';

interface NetworkStatsGridProps {
  health: NetworkHealthReport | null;
}

export default function NetworkStatsGrid({ health }: NetworkStatsGridProps) {
  const tps = health?.tps ?? 0;
  const blockTime = health?.avgBlockTime ?? 0;
  const validators = health?.validatorCount ?? 0;
  const ddos = health?.recentDDoSIndicators ?? 0;
  const congestion = health?.congestionLevel ?? ThreatLevel.SAFE;
  const sandwiches = health?.mevActivity?.sandwichAttacks24h ?? 0;

  return (
    <div className="grid grid-cols-2 lg:grid-cols-3 gap-2">
      <StatCard
        label="TPS"
        value={formatNumber(tps)}
        icon={Zap}
        color="#00ff88"
        subValue="Transactions/sec"
      />
      <StatCard
        label="Block Time"
        value={`${blockTime.toFixed(2)}s`}
        icon={Clock}
        color="#00d4ff"
        subValue="Average"
      />
      <StatCard
        label="Validators"
        value={formatNumber(validators)}
        icon={Server}
        color="#a855f7"
      />
      <StatCard
        label="Congestion"
        value={congestion}
        icon={AlertTriangle}
        color={congestion === ThreatLevel.SAFE ? '#00ff88' : congestion === ThreatLevel.HIGH ? '#ff8800' : '#ff3366'}
      />
      <StatCard
        label="DDoS Indicators"
        value={ddos}
        icon={ShieldAlert}
        color={ddos > 0 ? '#ff3366' : '#00ff88'}
      />
      <StatCard
        label="Sandwich Attacks (24h)"
        value={sandwiches}
        icon={Layers}
        color="#ff8800"
      />
    </div>
  );
}
