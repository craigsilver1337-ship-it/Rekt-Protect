'use client';

import {
  AgentHealthTable,
  IncidentLog,
  HealerStatusPanel,
  HealActionsTimeline,
  AutonomousToggle,
} from '@/components/healer';
import { useHealerStatus, useHealerIncidents, useHealerActions } from '@/hooks';
import { HealerStatus, Incident, HealAction, ThreatLevel } from '@/lib/types';

export default function HealerTab() {
  const { data: statusData, mutate: mutateStatus } = useHealerStatus();
  const { data: incidentsData } = useHealerIncidents();
  const { data: actionsData } = useHealerActions();

  const status = statusData as HealerStatus | null;
  const incidents: Incident[] = incidentsData?.incidents ?? [];
  const actions: HealAction[] = actionsData?.actions ?? [];

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-lg font-bold text-[#ff88cc] mb-1">
          Self-Healing System
        </h1>
        <p className="text-xs text-cyber-text-dim">
          Autonomous incident response, agent health monitoring, and self-healing capabilities
        </p>
      </div>

      <HealerStatusPanel status={status} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2">
          <AgentHealthTable agents={status?.agentHealth ?? []} />
        </div>
        <AutonomousToggle
          enabled={status?.autonomousMode ?? false}
          threatLevel={status?.currentThreatLevel ?? ThreatLevel.SAFE}
          aiAvailable={status?.aiAvailable ?? false}
          aiProvider={status?.aiProvider ?? 'Claude'}
          onToggle={() => mutateStatus()}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <IncidentLog incidents={incidents} />
        <HealActionsTimeline actions={actions} />
      </div>
    </div>
  );
}
