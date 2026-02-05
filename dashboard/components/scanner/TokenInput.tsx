'use client';

import { useState } from 'react';
import { Search, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';

interface TokenInputProps {
  onScan: (address: string) => void;
  loading: boolean;
}

export default function TokenInput({ onScan, loading }: TokenInputProps) {
  const [address, setAddress] = useState('');
  const [isFocused, setIsFocused] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (address.trim() && !loading) {
      onScan(address.trim());
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-3">
      <div className="flex-1 relative group">
        <motion.div
          className="absolute inset-0 bg-cyber-green/5 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
          animate={isFocused ? { opacity: 1, scale: [1, 1.01, 1] } : {}}
        />
        <Search
          size={16}
          className={clsx(
            "absolute left-4 top-1/2 -translate-y-1/2 transition-colors duration-300",
            isFocused ? "text-cyber-green" : "text-cyber-text-dim"
          )}
        />
        <input
          type="text"
          value={address}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          onChange={(e) => setAddress(e.target.value)}
          placeholder="Enter Solana token address (e.g. 7Jdom4Rm...)"
          className={clsx(
            "w-full bg-cyber-card/40 backdrop-blur-xl border border-cyber-border rounded-xl px-4 py-3 pl-11 text-sm text-cyber-text font-mono placeholder:text-cyber-text-dim/50 focus:outline-none transition-all duration-300",
            isFocused && "border-cyber-green/50 shadow-[0_0_20px_rgba(0,255,136,0.1)]"
          )}
        />
      </div>
      <button
        type="submit"
        disabled={loading || !address.trim()}
        className={clsx(
          "px-6 rounded-xl font-bold text-sm tracking-widest uppercase transition-all duration-300 flex items-center gap-2",
          "disabled:opacity-50 disabled:cursor-not-allowed",
          address.trim() && !loading
            ? "bg-cyber-green text-black hover:shadow-[0_0_20px_rgba(0,255,136,0.3)] hover:scale-[1.02] active:scale-[0.98]"
            : "bg-cyber-border text-cyber-text-dim"
        )}
      >
        {loading ? (
          <>
            <Loader2 size={16} className="animate-spin" />
            Scanning
          </>
        ) : (
          'Scan Token'
        )}
      </button>
    </form>
  );
}

import { clsx } from 'clsx';
