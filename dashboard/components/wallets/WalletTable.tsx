'use client';

import { WalletMonitorConfig } from '@/lib/types';
import { formatAddress } from '@/lib/formatters';
import { ThreatBadge } from '@/components/shared';
import { Eye, Shield, ShieldOff } from 'lucide-react';
import { clsx } from 'clsx';
import { ThreatLevel } from '@/lib/types';

interface WalletTableProps {
  wallets: WalletMonitorConfig[];
}

export default function WalletTable({ wallets }: WalletTableProps) {
  return (
    <div className="bg-cyber-card border border-cyber-border rounded-lg overflow-hidden">
      <div className="flex items-center gap-2 px-4 py-3 border-b border-cyber-border">
        <Eye size={14} className="text-cyber-blue" />
        <h3 className="text-sm font-bold text-cyber-text-dim uppercase tracking-wider">
          Monitored Wallets ({wallets.length})
        </h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-xs">
          <thead>
            <tr className="border-b border-cyber-border text-cyber-text-dim">
              <th className="text-left px-4 py-2 font-medium">Address</th>
              <th className="text-left px-4 py-2 font-medium">Alert Threshold</th>
              <th className="text-left px-4 py-2 font-medium">Auto-Defend</th>
              <th className="text-left px-4 py-2 font-medium">Slippage</th>
            </tr>
          </thead>
          <tbody>
            {wallets.length === 0 ? (
              <tr>
                <td colSpan={4} className="text-center py-6 text-cyber-text-dim">
                  No wallets monitored yet
                </td>
              </tr>
            ) : (
              wallets.map((w) => (
                <tr key={w.walletAddress} className="border-b border-cyber-border/50 hover:bg-cyber-darker transition-colors">
                  <td className="px-4 py-2 font-mono text-cyber-text">
                    {formatAddress(w.walletAddress, 6)}
                  </td>
                  <td className="px-4 py-2">
                    <ThreatBadge level={w.alertThreshold as ThreatLevel} />
                  </td>
                  <td className="px-4 py-2">
                    <span className={clsx('flex items-center gap-1', w.autoDefend ? 'text-cyber-green' : 'text-cyber-text-dim')}>
                      {w.autoDefend ? <Shield size={12} /> : <ShieldOff size={12} />}
                      {w.autoDefend ? 'Enabled' : 'Disabled'}
                    </span>
                  </td>
                  <td className="px-4 py-2 text-cyber-text-dim">
                    {w.maxSlippage}%
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
