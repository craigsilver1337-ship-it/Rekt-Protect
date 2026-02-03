'use client';

import { ShieldCheck, DollarSign, Clock, AlertTriangle } from 'lucide-react';
import { useSwarmStatus, useAlerts, useDefenseLog } from '@/hooks';
import { formatNumber, formatUSD, formatUptime } from '@/lib/formatters';
import { StatCard } from '@/components/shared';

export default function StatsRow() {
  const { data: status } = useSwarmStatus();
  const { data: alertsData } = useAlerts();
  const { data: defenseData } = useDefenseLog();

  const defense = defenseData as Record<string, unknown> | undefined;
  const threatsBlocked = (defense?.totalDefenses as number) ?? 0;
  const valueSaved = (defense?.totalSaved as number) ?? 0;
  const uptime = status?.uptime ?? 0;
  const alertCount = (alertsData?.alerts?.length) ?? 0;

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-2">
      <StatCard
        label="Threats Blocked"
        value={formatNumber(threatsBlocked)}
        icon={ShieldCheck}
        color="#00ff88"
      />
      <StatCard
        label="Value Saved"
        value={formatUSD(valueSaved)}
        icon={DollarSign}
        color="#00d4ff"
      />
      <StatCard
        label="Uptime"
        value={formatUptime(uptime)}
        icon={Clock}
        color="#a855f7"
      />
      <StatCard
        label="Active Alerts"
        value={alertCount}
        icon={AlertTriangle}
        color={alertCount > 0 ? '#ff3366' : '#00ff88'}
      />
    </div>
  );
}
