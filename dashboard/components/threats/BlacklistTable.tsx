'use client';

import { formatAddress, formatTime } from '@/lib/formatters';
import { Ban } from 'lucide-react';

interface BlacklistEntry {
  address: string;
  reason: string;
  addedAt: number;
  source: string;
}

interface BlacklistTableProps {
  entries: BlacklistEntry[];
}

export default function BlacklistTable({ entries }: BlacklistTableProps) {
  return (
    <div className="bg-cyber-card border border-cyber-red/20 rounded-lg overflow-hidden">
      <div className="flex items-center gap-2 px-4 py-3 border-b border-cyber-border">
        <Ban size={14} className="text-cyber-red" />
        <h3 className="text-sm font-bold text-cyber-red uppercase tracking-wider">
          Blacklist ({entries.length})
        </h3>
      </div>
      <div className="max-h-[300px] overflow-y-auto">
        {entries.length === 0 ? (
          <p className="text-xs text-cyber-text-dim text-center py-6">Blacklist empty</p>
        ) : (
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-cyber-border text-cyber-text-dim">
                <th className="text-left px-4 py-2 font-medium">Address</th>
                <th className="text-left px-4 py-2 font-medium">Reason</th>
                <th className="text-left px-4 py-2 font-medium">Source</th>
                <th className="text-left px-4 py-2 font-medium">Added</th>
              </tr>
            </thead>
            <tbody>
              {entries.map((entry, i) => (
                <tr key={i} className="border-b border-cyber-border/50 hover:bg-cyber-darker">
                  <td className="px-4 py-2 font-mono text-cyber-red">
                    {formatAddress(entry.address, 6)}
                  </td>
                  <td className="px-4 py-2 text-cyber-text-dim truncate max-w-[200px]">
                    {entry.reason}
                  </td>
                  <td className="px-4 py-2 text-cyber-text-dim">{entry.source}</td>
                  <td className="px-4 py-2 text-cyber-text-dim">{formatTime(entry.addedAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
