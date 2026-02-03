'use client';

import { ThreatBadge } from '@/components/shared';
import { formatTime, formatAddress } from '@/lib/formatters';
import { Database } from 'lucide-react';

interface ThreatEntry {
  address: string;
  type: string;
  threatLevel: string;
  description: string;
  firstSeen: number;
  reportCount: number;
}

interface ThreatRegistryProps {
  threats: ThreatEntry[];
}

export default function ThreatRegistry({ threats }: ThreatRegistryProps) {
  return (
    <div className="bg-cyber-card border border-cyber-border rounded-lg overflow-hidden">
      <div className="flex items-center gap-2 px-4 py-3 border-b border-cyber-border">
        <Database size={14} className="text-cyber-purple" />
        <h3 className="text-sm font-bold text-cyber-text-dim uppercase tracking-wider">
          Threat Registry ({threats.length})
        </h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-xs">
          <thead>
            <tr className="border-b border-cyber-border text-cyber-text-dim">
              <th className="text-left px-4 py-2 font-medium">Address</th>
              <th className="text-left px-4 py-2 font-medium">Type</th>
              <th className="text-left px-4 py-2 font-medium">Level</th>
              <th className="text-left px-4 py-2 font-medium">Description</th>
              <th className="text-left px-4 py-2 font-medium">First Seen</th>
              <th className="text-right px-4 py-2 font-medium">Reports</th>
            </tr>
          </thead>
          <tbody>
            {threats.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center py-6 text-cyber-text-dim">
                  No threats registered
                </td>
              </tr>
            ) : (
              threats.map((t, i) => (
                <tr key={i} className="border-b border-cyber-border/50 hover:bg-cyber-darker transition-colors">
                  <td className="px-4 py-2 font-mono text-cyber-text">
                    {formatAddress(t.address, 6)}
                  </td>
                  <td className="px-4 py-2 text-cyber-text-dim">
                    {t.type.replace(/_/g, ' ')}
                  </td>
                  <td className="px-4 py-2">
                    <ThreatBadge level={t.threatLevel as never} />
                  </td>
                  <td className="px-4 py-2 text-cyber-text-dim max-w-[200px] truncate">
                    {t.description}
                  </td>
                  <td className="px-4 py-2 text-cyber-text-dim">
                    {formatTime(t.firstSeen)}
                  </td>
                  <td className="px-4 py-2 text-right text-cyber-text">
                    {t.reportCount}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
