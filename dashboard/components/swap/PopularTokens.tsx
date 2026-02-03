'use client';

import type { SwapTokenInfo } from '@/lib/types';

interface PopularTokensProps {
  tokens: SwapTokenInfo[];
  onSelect: (token: SwapTokenInfo) => void;
  selectedAddress?: string;
}

export default function PopularTokens({ tokens, onSelect, selectedAddress }: PopularTokensProps) {
  return (
    <div>
      <div className="text-[10px] text-cyber-text-dim uppercase tracking-wider mb-2">
        Popular Tokens
      </div>
      <div className="flex flex-wrap gap-1.5">
        {tokens.map((token) => (
          <button
            key={token.address}
            type="button"
            onClick={() => onSelect(token)}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-xs font-mono transition-all ${
              selectedAddress === token.address
                ? 'bg-cyber-green/20 border-cyber-green/50 text-cyber-green'
                : 'bg-cyber-darker border-cyber-border text-cyber-text-dim hover:border-cyber-green/30 hover:text-cyber-text'
            }`}
          >
            {token.logoURI && (
              <img
                src={token.logoURI}
                alt={token.symbol}
                className="w-4 h-4 rounded-full"
                onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
              />
            )}
            {token.symbol}
          </button>
        ))}
      </div>
    </div>
  );
}
