'use client';

import { useState, useEffect } from 'react';
import { AlertTriangle, Loader2, Skull } from 'lucide-react';
import { useWallet } from '@solana/wallet-adapter-react';
import { GlowCard, CyberButton } from '@/components/shared';
import { emergencyEvacuate } from '@/lib/api';
import { formatAddress, formatUSD } from '@/lib/formatters';
import type { EmergencyEvacResult } from '@/lib/types';

export default function EmergencyEvacuate() {
  const { publicKey, connected } = useWallet();
  const [walletAddress, setWalletAddress] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<EmergencyEvacResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (connected && publicKey) {
      setWalletAddress(publicKey.toBase58());
    }
  }, [connected, publicKey]);

  const handleEvacuate = async () => {
    if (!walletAddress.trim()) return;
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const data = await emergencyEvacuate({ walletAddress: walletAddress.trim() }) as EmergencyEvacResult;
      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Evacuation scan failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <GlowCard glow="red">
      <div className="flex items-center gap-2 mb-3">
        <AlertTriangle size={16} className="text-cyber-red" />
        <h3 className="text-sm font-bold text-cyber-red uppercase tracking-wider">
          Emergency Evacuate
        </h3>
      </div>
      <p className="text-[10px] text-cyber-text-dim mb-3">
        Scan your wallet for risky tokens and prepare emergency swaps to USDC.
        All HIGH and CRITICAL risk tokens will be identified for evacuation.
      </p>

      <div className="flex gap-2 mb-3">
        <input
          type="text"
          value={walletAddress}
          onChange={(e) => setWalletAddress(e.target.value)}
          placeholder="Enter wallet address..."
          className="flex-1 bg-cyber-darker border border-cyber-border rounded px-3 py-2 text-xs font-mono text-cyber-text outline-none focus:border-cyber-red/50 placeholder-cyber-text-dim/40"
        />
        <CyberButton
          variant="danger"
          size="sm"
          onClick={handleEvacuate}
          disabled={loading || !walletAddress.trim()}
        >
          {loading ? (
            <span className="flex items-center gap-1">
              <Loader2 size={12} className="animate-spin" />
              Scanning
            </span>
          ) : (
            <span className="flex items-center gap-1">
              <Skull size={12} />
              EVACUATE
            </span>
          )}
        </CyberButton>
      </div>

      {error && (
        <div className="bg-cyber-red/10 border border-cyber-red/30 rounded p-2 text-xs text-cyber-red mb-3">
          {error}
        </div>
      )}

      {result && (
        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs">
            <span className="text-cyber-text-dim">Risky Tokens Found</span>
            <span className="text-cyber-red font-mono font-bold">{result.riskyTokens.length}</span>
          </div>
          <div className="flex items-center justify-between text-xs">
            <span className="text-cyber-text-dim">Est. Total Recovery</span>
            <span className="text-cyber-green font-mono font-bold">
              {formatUSD(result.totalEstimatedRecovery)}
            </span>
          </div>

          {result.riskyTokens.length > 0 ? (
            <div className="space-y-2 max-h-48 overflow-auto">
              {result.riskyTokens.map((token, i) => (
                <div
                  key={i}
                  className="bg-cyber-darker rounded p-2 border border-cyber-red/20 flex items-center justify-between"
                >
                  <div>
                    <div className="text-xs font-mono text-cyber-text">
                      {token.symbol} <span className="text-cyber-text-dim">({token.name})</span>
                    </div>
                    <div className="text-[10px] text-cyber-text-dim font-mono">
                      {formatAddress(token.mint)}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={`text-[10px] font-mono font-bold ${
                      token.threatLevel === 'CRITICAL' ? 'text-cyber-red' : 'text-cyber-orange'
                    }`}>
                      {token.threatLevel}
                    </div>
                    <div className="text-[10px] text-cyber-text-dim">
                      Score: {token.riskScore}
                    </div>
                    {token.estimatedUSDC !== null && (
                      <div className="text-[10px] text-cyber-green">
                        ~{formatUSD(token.estimatedUSDC)}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-4">
              <div className="text-xs text-cyber-green font-mono">No risky tokens found</div>
              <p className="text-[10px] text-cyber-text-dim mt-1">Your wallet appears clean</p>
            </div>
          )}
        </div>
      )}
    </GlowCard>
  );
}
