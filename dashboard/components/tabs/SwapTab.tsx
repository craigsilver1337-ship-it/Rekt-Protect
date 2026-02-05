'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { Zap, Shield, Wallet } from 'lucide-react';
import { useWallet } from '@solana/wallet-adapter-react';
import { GlowCard, CyberButton } from '@/components/shared';
import {
  SwapForm,
  QuoteDisplay,
  RiskWarningPanel,
  EmergencyEvacuate,
  PopularTokens,
} from '@/components/swap';
import { getSwapTokens, getSwapQuote, executeSwap } from '@/lib/api';
import { formatTokenAmount } from '@/lib/formatters';
import type { SwapTokenInfo, SwapQuoteResult } from '@/lib/types';

const DEFAULT_POPULAR: SwapTokenInfo[] = [
  { address: 'So11111111111111111111111111111111111111112', name: 'Wrapped SOL', symbol: 'SOL', decimals: 9, logoURI: 'https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/So11111111111111111111111111111111111111112/logo.png' },
  { address: 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v', name: 'USD Coin', symbol: 'USDC', decimals: 6, logoURI: 'https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v/logo.png' },
  { address: 'Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB', name: 'USDT', symbol: 'USDT', decimals: 6, logoURI: 'https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB/logo.png' },
  { address: 'DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263', name: 'Bonk', symbol: 'BONK', decimals: 5, logoURI: 'https://arweave.net/hQiPZOsRZXGXBJd_82PhVdlM_hACsT_q6wqwf5cSY7I' },
  { address: 'JUPyiwrYJFskUPiHa7hkeR8VUtAeFoSYbKedZNsDvCN', name: 'Jupiter', symbol: 'JUP', decimals: 6, logoURI: 'https://static.jup.ag/jup/icon.png' },
  { address: '4k3Dyjzvzp8eMZWUXbBCjEvwSkkk59S5iCNLY3QrkX6R', name: 'Raydium', symbol: 'RAY', decimals: 6, logoURI: 'https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/4k3Dyjzvzp8eMZWUXbBCjEvwSkkk59S5iCNLY3QrkX6R/logo.png' },
  { address: 'EKpQGSJtjMFqKZ9KQanSqYXRcF8fBopzLHYxdM65zcjm', name: 'dogwifhat', symbol: 'WIF', decimals: 6, logoURI: 'https://bafkreibk3covs5ltyqxa272uodhculbr6kea6betiez5tcoafatiksmre.ipfs.nftstorage.link' },
  { address: 'HZ1JovNiVvGrGNiiYvEozEVgZ58xaU3RKwX8eACQBCt3', name: 'Pyth Network', symbol: 'PYTH', decimals: 6, logoURI: 'https://pyth.network/token.svg' },
];

export default function SwapTab() {
  const { publicKey, connected } = useWallet();
  const [tokens, setTokens] = useState<SwapTokenInfo[]>(DEFAULT_POPULAR);
  const [popularTokens, setPopularTokens] = useState<SwapTokenInfo[]>(DEFAULT_POPULAR);
  const [fromToken, setFromToken] = useState<SwapTokenInfo | null>(DEFAULT_POPULAR[0]); // SOL
  const [toToken, setToToken] = useState<SwapTokenInfo | null>(DEFAULT_POPULAR[1]); // USDC
  const [amount, setAmount] = useState('');
  const [quoteResult, setQuoteResult] = useState<SwapQuoteResult | null>(null);
  const [estimatedOutput, setEstimatedOutput] = useState('');
  const [quoteLoading, setQuoteLoading] = useState(false);
  const [swapLoading, setSwapLoading] = useState(false);
  const [swapSuccess, setSwapSuccess] = useState<string | null>(null);
  const [swapError, setSwapError] = useState<string | null>(null);
  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  // Fetch token list on mount
  useEffect(() => {
    getSwapTokens()
      .then((data: any) => {
        if (data.tokens && data.tokens.length > 0) {
          setTokens(data.tokens);
        }
        if (data.popular && data.popular.length > 0) {
          setPopularTokens(data.popular);
        }
      })
      .catch(() => {
        // Use defaults on failure
      });
  }, []);

  // Debounced quote fetching
  const fetchQuote = useCallback(async () => {
    if (!fromToken || !toToken || !amount || parseFloat(amount) <= 0) {
      setQuoteResult(null);
      setEstimatedOutput('');
      return;
    }

    setQuoteLoading(true);
    setSwapError(null);
    setSwapSuccess(null);

    try {
      const rawAmount = Math.floor(parseFloat(amount) * Math.pow(10, fromToken.decimals));
      const result = await getSwapQuote({
        inputMint: fromToken.address,
        outputMint: toToken.address,
        amount: rawAmount,
      }) as SwapQuoteResult;

      setQuoteResult(result);
      if (result.quote) {
        setEstimatedOutput(
          formatTokenAmount(result.quote.outAmount, toToken.decimals),
        );
      }
    } catch (err) {
      setQuoteResult(null);
      setEstimatedOutput('');
      setSwapError(err instanceof Error ? err.message : 'Failed to fetch quote');
    } finally {
      setQuoteLoading(false);
    }
  }, [fromToken, toToken, amount]);

  // Debounce amount changes
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(fetchQuote, 500);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [fetchQuote]);

  const handleSwapDirection = () => {
    setFromToken(toToken);
    setToToken(fromToken);
    setAmount('');
    setQuoteResult(null);
    setEstimatedOutput('');
  };

  const handleSwap = async () => {
    if (!quoteResult?.quote || !quoteResult.safeToSwap) return;

    setSwapLoading(true);
    setSwapError(null);
    setSwapSuccess(null);

    try {
      await executeSwap({
        quoteResponse: quoteResult.quote,
        userPublicKey: publicKey!.toBase58(),
        outputMint: toToken?.address,
      });
      setSwapSuccess('Swap transaction prepared successfully! Sign with your wallet to execute.');
      setAmount('');
      setQuoteResult(null);
      setEstimatedOutput('');
    } catch (err) {
      setSwapError(err instanceof Error ? err.message : 'Swap failed');
    } finally {
      setSwapLoading(false);
    }
  };

  const handlePopularSelect = (token: SwapTokenInfo) => {
    // If no "to" token selected, set it as "to". Otherwise set as "from"
    if (!toToken || toToken.address === fromToken?.address) {
      setToToken(token);
    } else {
      setToToken(token);
    }
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-bold text-cyber-green glow-text-green mb-1 flex items-center gap-2">
            <Shield size={20} />
            Risk-Aware Swap
          </h1>
          <p className="text-[10px] text-cyber-text-dim/50 uppercase tracking-widest font-mono text-center">
            Powered by Jupiter + REKT PROTECT — every swap is auto-scanned for threats
          </p>
        </div>
      </div>

      {/* Main layout: two columns */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Left: Swap Form */}
        <div className="space-y-4">
          <GlowCard glow="green">
            <SwapForm
              tokens={tokens}
              fromToken={fromToken}
              toToken={toToken}
              amount={amount}
              estimatedOutput={estimatedOutput}
              onFromSelect={setFromToken}
              onToSelect={setToToken}
              onAmountChange={setAmount}
              onSwapDirection={handleSwapDirection}
              loading={quoteLoading}
            />

            {/* Quote details */}
            <div className="mt-3">
              <QuoteDisplay quote={quoteResult} fromToken={fromToken} toToken={toToken} />
            </div>

            {/* Swap button */}
            <div className="mt-4">
              {swapSuccess && (
                <div className="bg-cyber-green/10 border border-cyber-green/30 rounded p-2 text-xs text-cyber-green mb-3">
                  {swapSuccess}
                </div>
              )}
              {swapError && (
                <div className="bg-cyber-red/10 border border-cyber-red/30 rounded p-2 text-xs text-cyber-red mb-3">
                  {swapError}
                </div>
              )}

              <CyberButton
                variant={quoteResult && !quoteResult.safeToSwap ? 'danger' : 'primary'}
                className="w-full py-3 text-sm font-bold"
                onClick={handleSwap}
                disabled={
                  !connected ||
                  !quoteResult ||
                  !quoteResult.safeToSwap ||
                  swapLoading ||
                  quoteLoading ||
                  !amount
                }
              >
                {!connected ? (
                  <span className="flex items-center justify-center gap-2">
                    <Wallet size={16} />
                    CONNECT WALLET TO SWAP
                  </span>
                ) : swapLoading ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="animate-spin">...</span> Processing
                  </span>
                ) : quoteResult && !quoteResult.safeToSwap ? (
                  <span className="flex items-center justify-center gap-2">
                    SWAP BLOCKED — Token Too Risky
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    <Zap size={16} />
                    SWAP NOW
                  </span>
                )}
              </CyberButton>

              {quoteResult && !quoteResult.safeToSwap && quoteResult.riskReport?.threatLevel === 'MEDIUM' && (
                <CyberButton
                  variant="secondary"
                  className="w-full mt-2 py-2 text-xs"
                  onClick={handleSwap}
                  disabled={swapLoading}
                >
                  Proceed Anyway (Not Recommended)
                </CyberButton>
              )}
            </div>
          </GlowCard>
        </div>

        {/* Right: Risk Panel + Popular Tokens */}
        <div className="space-y-4">
          <RiskWarningPanel quoteResult={quoteResult} scanning={quoteLoading} />

          <GlowCard>
            <PopularTokens
              tokens={popularTokens}
              onSelect={handlePopularSelect}
              selectedAddress={toToken?.address}
            />
          </GlowCard>
        </div>
      </div>

      {/* Emergency Evacuate Section */}
      <EmergencyEvacuate />
    </div>
  );
}
