'use client';

import { useState } from 'react';
import { Search } from 'lucide-react';
import { CyberButton } from '@/components/shared';

interface TokenInputProps {
  onScan: (address: string) => void;
  loading: boolean;
}

export default function TokenInput({ onScan, loading }: TokenInputProps) {
  const [address, setAddress] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (address.trim()) {
      onScan(address.trim());
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <div className="flex-1 relative">
        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-cyber-text-dim" />
        <input
          type="text"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          placeholder="Enter Solana token address..."
          className="w-full bg-cyber-darker border border-cyber-border rounded px-3 py-2 pl-9 text-sm text-cyber-text font-mono placeholder:text-cyber-text-dim/50 focus:outline-none focus:border-cyber-green/50 transition-colors"
        />
      </div>
      <CyberButton type="submit" disabled={loading || !address.trim()}>
        {loading ? 'Scanning...' : 'Scan Token'}
      </CyberButton>
    </form>
  );
}
