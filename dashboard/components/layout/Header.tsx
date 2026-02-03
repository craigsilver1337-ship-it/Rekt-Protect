'use client';

import dynamic from 'next/dynamic';
import { Shield, Cpu, Circle, Wallet } from 'lucide-react';
import { useWallet } from '@solana/wallet-adapter-react';
import { useSwarmStatus, useAIStatus } from '@/hooks';
import { formatAddress } from '@/lib/formatters';

const WalletMultiButton = dynamic(
  () => import('@solana/wallet-adapter-react-ui').then((mod) => mod.WalletMultiButton),
  { ssr: false },
);

export default function Header() {
  const { data: status } = useSwarmStatus();
  const { data: aiStatus } = useAIStatus();
  const { publicKey, connected } = useWallet();

  const activeCount = status?.activeAgents ?? 0;
  const totalCount = status?.totalAgents ?? 11;
  const aiProvider = (aiStatus as Record<string, unknown>)?.provider as string ?? 'Claude';
  const aiAvailable = (aiStatus as Record<string, unknown>)?.available as boolean ?? false;

  return (
    <header className="h-12 bg-cyber-darker border-b border-cyber-border flex items-center justify-between px-4 flex-shrink-0">
      <div className="flex items-center gap-3">
        <Shield size={18} className="text-cyber-green" />
        <span className="text-sm font-bold tracking-wider">
          <span className="text-cyber-green glow-text-green">REKT SHIELD</span>
          <span className="text-cyber-text-dim ml-2">v2.0</span>
        </span>
      </div>

      <div className="flex items-center gap-4 text-xs">
        <div className="flex items-center gap-2 bg-cyber-card border border-cyber-border rounded px-3 py-1">
          <Circle
            size={8}
            className={activeCount > 0 ? 'fill-cyber-green text-cyber-green' : 'fill-cyber-red text-cyber-red'}
          />
          <span className="text-cyber-text-dim">
            <span className="text-cyber-green font-bold">{activeCount}</span>
            /{totalCount} Active
          </span>
        </div>

        <div className="flex items-center gap-2 bg-cyber-card border border-cyber-border rounded px-3 py-1">
          <Cpu size={12} className={aiAvailable ? 'text-cyber-blue' : 'text-cyber-red'} />
          <span className="text-cyber-text-dim">
            AI: <span className={aiAvailable ? 'text-cyber-blue' : 'text-cyber-red'}>{aiProvider}</span>
          </span>
        </div>

        {connected && publicKey && (
          <div className="flex items-center gap-2 bg-cyber-card border border-cyber-green/30 rounded px-3 py-1">
            <Wallet size={12} className="text-cyber-green" />
            <span className="text-cyber-green font-mono">
              {formatAddress(publicKey.toBase58())}
            </span>
          </div>
        )}

        <WalletMultiButton />
      </div>
    </header>
  );
}
