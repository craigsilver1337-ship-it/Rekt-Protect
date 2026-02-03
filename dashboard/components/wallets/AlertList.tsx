'use client';

import { WalletAlert } from '@/lib/types';
import { ThreatBadge } from '@/components/shared';
import { formatTime, formatAddress } from '@/lib/formatters';
import { Bell, Shield } from 'lucide-react';
import { clsx } from 'clsx';

interface AlertListProps {
  alerts: WalletAlert[];
}

export default function AlertList({ alerts }: AlertListProps) {
  return (
    <div className="bg-cyber-card border border-cyber-border rounded-lg p-4">
      <div className="flex items-center gap-2 mb-3">
        <Bell size={14} className="text-cyber-orange" />
        <h3 className="text-sm font-bold text-cyber-text-dim uppercase tracking-wider">
          Alert History ({alerts.length})
        </h3>
      </div>
      <div className="space-y-2 max-h-[400px] overflow-y-auto">
        {alerts.length === 0 ? (
          <p className="text-xs text-cyber-text-dim text-center py-4">No alerts yet</p>
        ) : (
          alerts.map((alert) => (
            <div
              key={alert.id}
              className="bg-cyber-darker border border-cyber-border rounded p-2.5"
            >
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-2">
                  <ThreatBadge level={alert.threatLevel} />
                  <span className="text-[11px] text-cyber-text">
                    {alert.type.replace(/_/g, ' ')}
                  </span>
                </div>
                <span className="text-[10px] text-cyber-text-dim">
                  {formatTime(alert.timestamp)}
                </span>
              </div>
              <p className="text-[10px] text-cyber-text-dim">{alert.description}</p>
              <div className="flex items-center gap-3 mt-1.5">
                <span className="text-[10px] text-cyber-text-dim font-mono">
                  {formatAddress(alert.walletAddress)}
                </span>
                {alert.autoDefended && (
                  <span className={clsx('text-[10px] flex items-center gap-1 text-cyber-green')}>
                    <Shield size={8} /> Auto-Defended
                  </span>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
