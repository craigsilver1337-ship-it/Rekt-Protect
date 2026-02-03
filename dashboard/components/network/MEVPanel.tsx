'use client';

import { MEVReport } from '@/lib/types';
import { formatUSD, formatAddress } from '@/lib/formatters';
import { Layers, Bot } from 'lucide-react';

interface MEVPanelProps {
  mev: MEVReport | null;
}

export default function MEVPanel({ mev }: MEVPanelProps) {
  return (
    <div className="bg-cyber-card border border-cyber-border rounded-lg p-4">
      <div className="flex items-center gap-2 mb-3">
        <Layers size={14} className="text-cyber-orange" />
        <h3 className="text-sm font-bold text-cyber-text-dim uppercase tracking-wider">
          MEV Activity
        </h3>
      </div>
      <div className="space-y-3">
        <div className="flex justify-between text-xs">
          <span className="text-cyber-text-dim">Sandwich Attacks (24h)</span>
          <span className="text-cyber-orange font-bold">{mev?.sandwichAttacks24h ?? 0}</span>
        </div>
        <div className="flex justify-between text-xs">
          <span className="text-cyber-text-dim">MEV Extracted</span>
          <span className="text-cyber-red font-bold">{formatUSD(mev?.estimatedMEVExtracted ?? 0)}</span>
        </div>

        {(mev?.topMEVBots?.length ?? 0) > 0 && (
          <div>
            <div className="flex items-center gap-1.5 mb-2">
              <Bot size={12} className="text-cyber-text-dim" />
              <span className="text-[10px] text-cyber-text-dim uppercase">Top MEV Bots</span>
            </div>
            <div className="space-y-1">
              {mev?.topMEVBots.map((bot, i) => (
                <div key={i} className="text-[10px] font-mono text-cyber-text-dim bg-cyber-darker rounded px-2 py-1">
                  {formatAddress(bot, 8)}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
