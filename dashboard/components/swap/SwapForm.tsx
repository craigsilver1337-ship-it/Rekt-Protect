'use client';

import { ArrowDownUp } from 'lucide-react';
import TokenSelector from './TokenSelector';
import type { SwapTokenInfo } from '@/lib/types';

interface SwapFormProps {
  tokens: SwapTokenInfo[];
  fromToken: SwapTokenInfo | null;
  toToken: SwapTokenInfo | null;
  amount: string;
  estimatedOutput: string;
  onFromSelect: (token: SwapTokenInfo) => void;
  onToSelect: (token: SwapTokenInfo) => void;
  onAmountChange: (amount: string) => void;
  onSwapDirection: () => void;
  loading: boolean;
}

export default function SwapForm({
  tokens,
  fromToken,
  toToken,
  amount,
  estimatedOutput,
  onFromSelect,
  onToSelect,
  onAmountChange,
  onSwapDirection,
  loading,
}: SwapFormProps) {
  return (
    <div className="space-y-3">
      {/* From */}
      <div className="bg-cyber-darker rounded-lg p-3 border border-cyber-border">
        <TokenSelector tokens={tokens} selected={fromToken} onSelect={onFromSelect} label="From" />
        <div className="mt-2">
          <input
            type="number"
            value={amount}
            onChange={(e) => onAmountChange(e.target.value)}
            placeholder="0.00"
            min="0"
            step="any"
            className="w-full bg-transparent text-xl font-mono text-cyber-text outline-none placeholder-cyber-text-dim/40"
          />
        </div>
      </div>

      {/* Swap direction button */}
      <div className="flex justify-center -my-1">
        <button
          type="button"
          onClick={onSwapDirection}
          className="bg-cyber-card border border-cyber-border rounded-full p-2 hover:border-cyber-green/40 hover:bg-cyber-green/10 transition-all"
        >
          <ArrowDownUp size={16} className="text-cyber-green" />
        </button>
      </div>

      {/* To */}
      <div className="bg-cyber-darker rounded-lg p-3 border border-cyber-border">
        <TokenSelector tokens={tokens} selected={toToken} onSelect={onToSelect} label="To" />
        <div className="mt-2">
          <div className="text-xl font-mono text-cyber-text-dim">
            {loading ? (
              <span className="animate-pulse">Fetching...</span>
            ) : estimatedOutput ? (
              <span className="text-cyber-text">{estimatedOutput}</span>
            ) : (
              '0.00'
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
