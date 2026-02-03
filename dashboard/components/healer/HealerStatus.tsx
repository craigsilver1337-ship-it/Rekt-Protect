'use client';

import { HealerStatus as HealerStatusType, ThreatLevel } from '@/lib/types';
import { StatCard } from '@/components/shared';
import { ThreatBadge } from '@/components/shared';
import { Heart, FileWarning, CheckCircle, XCircle, Zap, Cpu } from 'lucide-react';

interface HealerStatusProps {
  status: HealerStatusType | null;
}

export default function HealerStatusPanel({ status }: HealerStatusProps) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-2">
      <StatCard
        label="Total Incidents"
        value={status?.totalIncidents ?? 0}
        icon={FileWarning}
        color="#ff8800"
      />
      <StatCard
        label="Resolved"
        value={status?.resolvedIncidents ?? 0}
        icon={CheckCircle}
        color="#00ff88"
      />
      <StatCard
        label="Failed"
        value={status?.failedIncidents ?? 0}
        icon={XCircle}
        color="#ff3366"
      />
      <StatCard
        label="Heal Actions"
        value={status?.totalHealActions ?? 0}
        icon={Heart}
        color="#ff88cc"
      />
    </div>
  );
}
