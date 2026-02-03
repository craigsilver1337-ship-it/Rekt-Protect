'use client';

import { ThreatRegistry, BlacklistTable, LazarusPanel } from '@/components/threats';
import { useThreats } from '@/hooks';

export default function ThreatsTab() {
  const { data } = useThreats();

  const threats = (data as Record<string, unknown>)?.threats as Array<Record<string, unknown>> ?? [];
  const blacklist = (data as Record<string, unknown>)?.blacklist as Array<Record<string, unknown>> ?? [];
  const antibodies = (data as Record<string, unknown>)?.antibodies as number ?? 0;
  const stats = (data as Record<string, unknown>)?.stats as Record<string, unknown> ?? {};

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-bold text-cyber-purple mb-1">
            Threat Intelligence
          </h1>
          <p className="text-xs text-cyber-text-dim">
            Real-time threat registry, blacklist management, and state-actor tracking
          </p>
        </div>
        <div className="flex gap-3">
          <div className="bg-cyber-card border border-cyber-border rounded px-3 py-1.5 text-center">
            <p className="text-[10px] text-cyber-text-dim">Total Threats</p>
            <p className="text-sm font-bold text-cyber-purple">{threats.length}</p>
          </div>
          <div className="bg-cyber-card border border-cyber-border rounded px-3 py-1.5 text-center">
            <p className="text-[10px] text-cyber-text-dim">Blacklisted</p>
            <p className="text-sm font-bold text-cyber-red">{blacklist.length}</p>
          </div>
          <div className="bg-cyber-card border border-cyber-border rounded px-3 py-1.5 text-center">
            <p className="text-[10px] text-cyber-text-dim">Antibodies</p>
            <p className="text-sm font-bold text-cyber-green">{antibodies}</p>
          </div>
        </div>
      </div>

      <ThreatRegistry threats={threats as never[]} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <BlacklistTable entries={blacklist as never[]} />
        <LazarusPanel />
      </div>
    </div>
  );
}
