'use client';

import dynamic from 'next/dynamic';
import { Shield, Cpu, Circle, Wallet, LogOut, Twitter, Github, FileText } from 'lucide-react';
import { useWallet } from '@solana/wallet-adapter-react';
import { useSwarmStatus, useAIStatus } from '@/hooks';
import { formatAddress } from '@/lib/formatters';

const WalletMultiButton = dynamic(
  () => import('@solana/wallet-adapter-react-ui').then((mod) => mod.WalletMultiButton),
  { ssr: false },
);

const SOCIAL_LINKS = [
  {
    name: 'Twitter',
    icon: Twitter,
    href: 'https://x.com/Web3__Youth',
    color: 'hover:text-[#1DA1F2]'
  },
  {
    name: 'GitHub',
    icon: Github,
    href: 'https://github.com/YouthAIAgent/rekt-shield',
    color: 'hover:text-white'
  },
  {
    name: 'Whitepaper',
    icon: FileText,
    href: '/docs',
    color: 'hover:text-cyber-green'
  }
];

export default function Header() {
  const { data: status } = useSwarmStatus();
  const { data: aiStatus } = useAIStatus();
  const { publicKey, connected } = useWallet();

  const handleLogout = () => {
    localStorage.removeItem('rekt_auth_success');
    window.location.reload();
  };

  const activeCount = status?.activeAgents ?? 0;
  const totalCount = status?.totalAgents ?? 11;
  const aiProvider = (aiStatus as Record<string, unknown>)?.provider as string ?? 'Claude';
  const aiAvailable = (aiStatus as Record<string, unknown>)?.available as boolean ?? false;

  return (
    <header className="h-12 bg-cyber-darker border-b border-cyber-border flex items-center justify-between px-4 flex-shrink-0">
      <div className="flex items-center">
        <div className="flex items-center gap-3 pr-6">
          <Shield size={18} className="text-cyber-green" />
          <span className="text-sm font-bold tracking-wider">
            <span className="text-cyber-green glow-text-green">REKT PROTECT</span>
            <span className="text-cyber-text-dim ml-2 font-mono">v0.1</span>
          </span>
        </div>

        <div className="hidden md:flex items-center gap-1 border-l border-cyber-border pl-6">
          {SOCIAL_LINKS.map((link) => (
            <a
              key={link.name}
              href={link.href}
              target={link.href.startsWith('http') ? '_blank' : undefined}
              rel={link.href.startsWith('http') ? 'noopener noreferrer' : undefined}
              className={`p-2 rounded-lg text-cyber-text-dim ${link.color} hover:bg-white/5 transition-all duration-300 group relative`}
              title={link.name}
            >
              <link.icon size={16} />
              <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 px-2 py-1 bg-cyber-card border border-cyber-border rounded text-[10px] font-bold text-white opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50">
                {link.name}
              </span>
            </a>
          ))}
        </div>

        <div className="hidden lg:flex items-center gap-2 border-l border-cyber-border pl-6 ml-2 group cursor-pointer"
          onClick={() => {
            navigator.clipboard.writeText('L84NryNjZWNDmBDVy5bYNGwgyxxoFExZmo3Qnohderp');
          }}
        >
          <div className="flex items-center gap-2 bg-black/20 border border-cyber-border rounded px-2 py-1 group-hover:border-cyber-green/50 transition-all">
            <span className="text-[10px] font-bold text-cyber-green/50 leading-none">CA:</span>
            <code className="text-[10px] text-cyber-text-dim font-mono group-hover:text-cyber-green transition-colors leading-none">
              L84NryNjZWNDmBDVy5bYNGwgyxxoFExZmo3Qnohderp
            </code>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-4 text-xs">
        <div className="hidden sm:flex items-center gap-2 bg-cyber-card border border-cyber-border rounded px-3 py-1">
          <Circle
            size={8}
            className={activeCount > 0 ? 'fill-cyber-green text-cyber-green' : 'fill-cyber-red text-cyber-red'}
          />
          <span className="text-cyber-text-dim">
            <span className="text-cyber-green font-bold">{activeCount}</span>
            /{totalCount} Active
          </span>
        </div>

        <div className="hidden sm:flex items-center gap-2 bg-cyber-card border border-cyber-border rounded px-3 py-1">
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

        <div className="flex items-center gap-2">
          <WalletMultiButton />
          <button
            onClick={handleLogout}
            className="p-1.5 rounded bg-cyber-card border border-cyber-border text-cyber-text-dim hover:text-cyber-red hover:border-cyber-red/50 transition-all duration-300"
            title="Disconnect Protocol"
          >
            <LogOut size={16} />
          </button>
        </div>
      </div>
    </header>
  );
}
