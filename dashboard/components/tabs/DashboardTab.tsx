'use client';

import { AgentGrid, StatsRow, EventFeed, SentimentGauge, CriticalAlerts } from '@/components/dashboard';

export default function DashboardTab() {
  return (
    <div className="space-y-4">
      <StatsRow />
      <AgentGrid />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2">
          <EventFeed />
        </div>
        <div className="space-y-4">
          <SentimentGauge />
          <CriticalAlerts />
        </div>
      </div>
    </div>
  );
}
