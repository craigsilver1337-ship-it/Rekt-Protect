'use client';

import { useState, useRef, useEffect } from 'react';
import { ChevronDown, Search } from 'lucide-react';
import type { SwapTokenInfo } from '@/lib/types';

interface TokenSelectorProps {
  tokens: SwapTokenInfo[];
  selected: SwapTokenInfo | null;
  onSelect: (token: SwapTokenInfo) => void;
  label: string;
}

export default function TokenSelector({ tokens, selected, onSelect, label }: TokenSelectorProps) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filtered = tokens.filter(
    (t) =>
      t.symbol.toLowerCase().includes(search.toLowerCase()) ||
      t.name.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div ref={ref} className="relative">
      <label className="text-[10px] text-cyber-text-dim uppercase tracking-wider mb-1 block">
        {label}
      </label>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full flex items-center gap-2 bg-cyber-darker border border-cyber-border rounded px-3 py-2 hover:border-cyber-green/40 transition-colors"
      >
        {selected ? (
          <>
            {selected.logoURI && (
              <img
                src={selected.logoURI}
                alt={selected.symbol}
                className="w-5 h-5 rounded-full"
                onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
              />
            )}
            <span className="text-sm font-mono text-cyber-text">{selected.symbol}</span>
            <span className="text-[10px] text-cyber-text-dim truncate">{selected.name}</span>
          </>
        ) : (
          <span className="text-sm text-cyber-text-dim">Select token</span>
        )}
        <ChevronDown size={14} className="ml-auto text-cyber-text-dim" />
      </button>

      {open && (
        <div className="absolute z-50 mt-1 w-full bg-cyber-card border border-cyber-border rounded-lg shadow-xl max-h-64 overflow-hidden">
          <div className="p-2 border-b border-cyber-border">
            <div className="flex items-center gap-2 bg-cyber-darker rounded px-2 py-1">
              <Search size={12} className="text-cyber-text-dim" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search tokens..."
                className="bg-transparent text-xs text-cyber-text w-full outline-none"
                autoFocus
              />
            </div>
          </div>
          <div className="overflow-auto max-h-48">
            {filtered.map((token) => (
              <button
                key={token.address}
                type="button"
                onClick={() => {
                  onSelect(token);
                  setOpen(false);
                  setSearch('');
                }}
                className="w-full flex items-center gap-2 px-3 py-2 hover:bg-cyber-green/10 transition-colors text-left"
              >
                {token.logoURI && (
                  <img
                    src={token.logoURI}
                    alt={token.symbol}
                    className="w-5 h-5 rounded-full"
                    onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                  />
                )}
                <div>
                  <span className="text-sm font-mono text-cyber-text">{token.symbol}</span>
                  <span className="text-[10px] text-cyber-text-dim ml-2">{token.name}</span>
                </div>
              </button>
            ))}
            {filtered.length === 0 && (
              <div className="px-3 py-4 text-xs text-cyber-text-dim text-center">No tokens found</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
