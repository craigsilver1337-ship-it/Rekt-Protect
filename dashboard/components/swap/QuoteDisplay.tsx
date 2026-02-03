'use client';

import { Info } from 'lucide-react';
import type { SwapQuoteResult, SwapTokenInfo } from '@/lib/types';
import { formatTokenAmount } from '@/lib/formatters';

interface QuoteDisplayProps {
  quote: SwapQuoteResult | null;
  fromToken: SwapTokenInfo | null;
  toToken: SwapTokenInfo | null;
}

export default function QuoteDisplay({ quote, fromToken, toToken }: QuoteDisplayProps) {
  if (!quote || !fromToken || !toToken) return null;

  const { quote: q } = quote;
  const inAmt = parseFloat(q.inAmount) / Math.pow(10, fromToken.decimals);
  const outAmt = parseFloat(q.outAmount) / Math.pow(10, toToken.decimals);
  const rate = inAmt > 0 ? outAmt / inAmt : 0;
  const minReceived = parseFloat(q.otherAmountThreshold) / Math.pow(10, toToken.decimals);
  const priceImpact = parseFloat(q.priceImpactPct);

  return (
    <div className="bg-cyber-darker/50 rounded-lg p-3 border border-cyber-border space-y-2">
      <div className="flex items-center gap-1 mb-1">
        <Info size={12} className="text-cyber-blue" />
        <span className="text-[10px] text-cyber-text-dim uppercase tracking-wider">Quote Details</span>
      </div>

      <div className="flex justify-between text-xs">
        <span className="text-cyber-text-dim">Rate</span>
        <span className="text-cyber-text font-mono">
          1 {fromToken.symbol} = {rate.toFixed(rate < 1 ? 6 : 2)} {toToken.symbol}
        </span>
      </div>

      <div className="flex justify-between text-xs">
        <span className="text-cyber-text-dim">Price Impact</span>
        <span className={priceImpact > 1 ? 'text-cyber-orange font-mono' : 'text-cyber-green font-mono'}>
          {priceImpact.toFixed(4)}%
        </span>
      </div>

      <div className="flex justify-between text-xs">
        <span className="text-cyber-text-dim">Min Received</span>
        <span className="text-cyber-text font-mono">
          {minReceived.toFixed(minReceived < 1 ? 6 : 2)} {toToken.symbol}
        </span>
      </div>

      <div className="flex justify-between text-xs">
        <span className="text-cyber-text-dim">Slippage</span>
        <span className="text-cyber-text font-mono">{q.slippageBps / 100}%</span>
      </div>

      {q.routePlan && q.routePlan.length > 0 && (
        <div className="flex justify-between text-xs">
          <span className="text-cyber-text-dim">Route Steps</span>
          <span className="text-cyber-text font-mono">{q.routePlan.length}</span>
        </div>
      )}
    </div>
  );
}
