'use client';

import { useState } from 'react';
import { CyberButton } from '@/components/shared';
import { monitorWallet } from '@/lib/api';
import { ThreatLevel } from '@/lib/types';
import { Plus } from 'lucide-react';

interface AddWalletFormProps {
  onAdded: () => void;
}

export default function AddWalletForm({ onAdded }: AddWalletFormProps) {
  const [address, setAddress] = useState('');
  const [autoDefend, setAutoDefend] = useState(true);
  const [threshold, setThreshold] = useState<ThreatLevel>(ThreatLevel.HIGH);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!address.trim()) return;
    setLoading(true);
    try {
      await monitorWallet({
        walletAddress: address.trim(),
        alertThreshold: threshold,
        autoDefend,
        maxSlippage: 1,
      });
      setAddress('');
      onAdded();
    } catch {
      // Error handled silently
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-cyber-card border border-cyber-border rounded-lg p-4">
      <div className="flex items-center gap-2 mb-3">
        <Plus size={14} className="text-cyber-green" />
        <h3 className="text-sm font-bold text-cyber-text-dim uppercase tracking-wider">
          Monitor Wallet
        </h3>
      </div>
      <div className="flex flex-col sm:flex-row gap-2">
        <input
          type="text"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          placeholder="Solana wallet address..."
          className="flex-1 bg-cyber-darker border border-cyber-border rounded px-3 py-2 text-sm text-cyber-text font-mono placeholder:text-cyber-text-dim/50 focus:outline-none focus:border-cyber-green/50"
        />
        <select
          value={threshold}
          onChange={(e) => setThreshold(e.target.value as ThreatLevel)}
          className="bg-cyber-darker border border-cyber-border rounded px-3 py-2 text-xs text-cyber-text font-mono focus:outline-none focus:border-cyber-green/50"
        >
          {Object.values(ThreatLevel).map((level) => (
            <option key={level} value={level}>{level}</option>
          ))}
        </select>
        <label className="flex items-center gap-2 text-xs text-cyber-text-dim cursor-pointer whitespace-nowrap">
          <input
            type="checkbox"
            checked={autoDefend}
            onChange={(e) => setAutoDefend(e.target.checked)}
            className="accent-cyber-green"
          />
          Auto-Defend
        </label>
        <CyberButton type="submit" disabled={loading || !address.trim()}>
          {loading ? 'Adding...' : 'Add'}
        </CyberButton>
      </div>
    </form>
  );
}
