'use client';

import { useLazarusAlerts } from '@/hooks';
import { formatAddress, formatTime, formatUSD } from '@/lib/formatters';
import { Skull, ArrowRight } from 'lucide-react';
import { LazarusAlert } from '@/lib/types';

export default function LazarusPanel() {
  const { data } = useLazarusAlerts();
  const alerts: LazarusAlert[] = (data as Record<string, unknown>)?.alerts as LazarusAlert[] ?? [];

  return (
    <div className="bg-cyber-card border border-cyber-orange/20 rounded-lg p-4">
      <div className="flex items-center gap-2 mb-3">
        <Skull size={14} className="text-cyber-orange" />
        <h3 className="text-sm font-bold text-cyber-orange uppercase tracking-wider">
          Lazarus Group Tracking
        </h3>
        <span className="ml-auto text-[10px] text-cyber-text-dim bg-cyber-orange/10 px-2 py-0.5 rounded-full">
          State-Actor Intel
        </span>
      </div>

      <div className="space-y-3 max-h-[400px] overflow-y-auto">
        {alerts.length === 0 ? (
          <p className="text-xs text-cyber-text-dim text-center py-4">
            No Lazarus group activity detected
          </p>
        ) : (
          alerts.map((alert) => (
            <div key={alert.id} className="bg-cyber-darker border border-cyber-border rounded p-3">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-mono text-cyber-orange">
                  {formatAddress(alert.suspiciousAddress, 6)}
                </span>
                <span className="text-[10px] text-cyber-text-dim">
                  {formatTime(alert.timestamp)}
                </span>
              </div>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-[10px] text-cyber-text-dim">Match Confidence:</span>
                <div className="flex-1 bg-cyber-black rounded-full h-1.5">
                  <div
                    className="h-1.5 rounded-full bg-cyber-orange"
                    style={{ width: `${alert.matchConfidence}%` }}
                  />
                </div>
                <span className="text-[10px] text-cyber-orange font-bold">
                  {alert.matchConfidence}%
                </span>
              </div>
              {alert.patterns.length > 0 && (
                <div className="mb-2">
                  {alert.patterns.slice(0, 3).map((p, i) => (
                    <p key={i} className="text-[10px] text-cyber-text-dim">
                      {p.pattern}: {p.description}
                    </p>
                  ))}
                </div>
              )}
              {alert.fundFlow.length > 0 && (
                <div className="border-t border-cyber-border pt-2">
                  <p className="text-[10px] text-cyber-text-dim mb-1">Fund Flow:</p>
                  {alert.fundFlow.slice(0, 3).map((flow, i) => (
                    <div key={i} className="flex items-center gap-1 text-[10px]">
                      <span className="text-cyber-text-dim font-mono">{formatAddress(flow.from)}</span>
                      <ArrowRight size={8} className="text-cyber-orange" />
                      <span className="text-cyber-text-dim font-mono">{formatAddress(flow.to)}</span>
                      <span className="text-cyber-orange ml-1">{formatUSD(flow.amount)}</span>
                    </div>
                  ))}
                </div>
              )}
              <p className="text-[10px] text-cyber-green mt-2">{alert.recommendation}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
