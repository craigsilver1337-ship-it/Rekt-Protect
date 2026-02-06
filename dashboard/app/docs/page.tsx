'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import {
  Shield,
  ArrowLeft,
  Terminal,
  Cpu,
  Zap,
  Activity,
  Lock,
  Bug,
  Brain,
  Network,
  FileText,
  BarChart3,
  Search,
  ChevronDown,
  ChevronRight,
  ExternalLink,
  Github,
  Twitter,
  Globe,
  Bot,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Clock,
  ZapOff
} from 'lucide-react';

// --- Types ---

interface AgentInfo {
  id: string;
  name: string;
  role: string;
  color: string;
  desc: string;
  details: string[];
  endpoint: string;
}

interface EndpointInfo {
  method: 'GET' | 'POST';
  path: string;
  desc: string;
  auth?: boolean;
}

interface EndpointCategory {
  category: string;
  color: string;
  items: EndpointInfo[];
}

// --- Data ---

const agents: AgentInfo[] = [
  {
    id: 'scanner',
    name: 'SCANNER',
    role: 'T-Cell',
    color: '#00ff88',
    desc: 'Token risk scoring engine. Identifying threats before they enter the system.',
    details: [
      'Risk Score 0-100',
      'LP Analysis & Locks',
      'Dev Wallet Age Tracking',
      'Permission Scan (Mint/Freeze)',
      'Holder Concentration Mapping',
      'AI Analysis via Claude'
    ],
    endpoint: 'GET /api/scan/:tokenAddress'
  },
  {
    id: 'sentinel',
    name: 'SENTINEL',
    role: 'Patrol Cell',
    color: '#00d4ff',
    desc: '24/7 wallet monitoring via Helius enhanced RPC.',
    details: [
      'Real-time TX Analysis',
      'Drainer Pattern Detection',
      'Unauthorized Auth Detection',
      'Price Crash EMA Alerts',
      'Multi-Wallet Support'
    ],
    endpoint: 'POST /api/monitor/wallet'
  },
  {
    id: 'network',
    name: 'NETWORK',
    role: 'Nervous System',
    color: '#0088FF',
    desc: 'Solana infrastructure health monitoring.',
    details: [
      'TPS & Block Time Tracking',
      'DDoS Detection (10K+ threshold)',
      'MEV/Sandwich Monitoring',
      'Congestion Assessment (5-Lv)',
      'Validator Stake Concentration'
    ],
    endpoint: 'GET /api/network/health'
  },
  {
    id: 'guardian',
    name: 'GUARDIAN',
    role: 'Killer Cell',
    color: '#FF3366',
    desc: 'Emergency defense execution and asset recovery.',
    details: [
      'Emergency Swap to USDC',
      'Revoke Dangerous Approvals',
      'Automatic Transfer to Safety',
      'Blacklist Attackers',
      'Protection Proof NFT Mints'
    ],
    endpoint: 'GET /api/defense/log'
  },
  {
    id: 'honeypot',
    name: 'HONEYPOT',
    role: 'Active Trap',
    color: '#FF8800',
    desc: 'Active offense-as-defense via bait wallets.',
    details: [
      'Deploy Configurable Bait',
      'Lure & Identify Attackers',
      'Capture Tool Signatures',
      'Profile Attacker TTP',
      'Automatic Attacker Blacklist'
    ],
    endpoint: 'POST /api/honeypot/deploy'
  },
  {
    id: 'intel',
    name: 'INTEL',
    role: 'Immune Memory',
    color: '#A855F7',
    desc: 'Threat intelligence hub and registry.',
    details: [
      'On-Chain Threat Registry',
      'Known Scammer Blacklist',
      'Pattern Matching Engine',
      'Antibody Rule Generation',
      'Multi-Agent Consensus'
    ],
    endpoint: 'GET /api/threats'
  },
  {
    id: 'lazarus',
    name: 'LAZARUS',
    role: 'Counter-Intel',
    color: '#FF6600',
    desc: 'First Solana tool tracking Lazarus Group (DPRK).',
    details: [
      '6+ Known Attack Patterns',
      'UTC+9 Timezone Matching',
      'Chain Hopping & Mixers',
      'Peel Chain Detection',
      'FBI/OFAC Flag Cross-Ref'
    ],
    endpoint: 'GET /api/lazarus/analyze/:address'
  },
  {
    id: 'prophet',
    name: 'PROPHET',
    role: 'Predictive Brain',
    color: '#88FF00',
    desc: 'AI-powered prediction engine with 361K+ patterns.',
    details: [
      'Rug Pull Probability',
      'Whale Dump Detection',
      'Market Sentiment AI',
      '11 Weighted Indicators',
      'Signal Analysis Engine'
    ],
    endpoint: 'GET /api/predict/:tokenAddress'
  },
  {
    id: 'reporter',
    name: 'REPORTER',
    role: 'Community Voice',
    color: '#FFCC00',
    desc: 'Documentation and on-chain verification.',
    details: [
      'Protection Proof NFTs',
      'On-Chain Defense Receipts',
      'Colosseum Forum Alerts',
      'Incident Reporting Pipeline'
    ],
    endpoint: 'Metaplex Integration'
  },
  {
    id: 'quantum',
    name: 'QUANTUM',
    role: 'Future Proof',
    color: '#00FFFF',
    desc: 'Post-quantum crypto readiness assessment.',
    details: [
      'Ed25519 Vulnerability Scan',
      'Harvest-Now-Decrypt-Later Risk',
      'NIST 2035 Deadline Tracking',
      'Migration Roadmap Generation'
    ],
    endpoint: 'GET /api/quantum/assess/:wallet'
  },
  {
    id: 'healer',
    name: 'HEALER',
    role: 'Autonomous Brain',
    color: '#FF88CC',
    desc: 'Self-healing brain with 6-phase IR.',
    details: [
      'Circuit Breaker Protection',
      'Auto-Restart Failed Agents',
      '6-Phase Incident Response',
      'Claude 3.5 Sonnet Integration',
      '15s Continuous Health Checks'
    ],
    endpoint: 'GET /api/healer/status'
  }
];

const endpoints: EndpointCategory[] = [
  {
    category: 'Health & Status',
    color: '#00ff88',
    items: [
      { method: 'GET', path: '/api/health', desc: 'System health check' },
      { method: 'GET', path: '/api/status', desc: 'Full swarm status (11 agents)' },
    ],
  },
  {
    category: 'Scanner & Prophet',
    color: '#00ff88',
    items: [
      { method: 'GET', path: '/api/scan/:tokenAddress', desc: 'Scan token for risk score' },
      { method: 'GET', path: '/api/predict/:tokenAddress', desc: 'Rug pull probability score' },
      { method: 'GET', path: '/api/sentiment', desc: 'Market sentiment report' },
    ],
  },
  {
    category: 'Wallet & Defense',
    color: '#ff3366',
    items: [
      { method: 'POST', path: '/api/monitor/wallet', desc: 'Add wallet to monitoring', auth: true },
      { method: 'GET', path: '/api/alerts', desc: 'Get wallet specific alerts' },
      { method: 'GET', path: '/api/defense/log', desc: 'Defense action logs' },
    ],
  },
  {
    category: 'Intelligence & Lazarus',
    color: '#a855f7',
    items: [
      { method: 'GET', path: '/api/threats', desc: 'Threat registry & blacklist' },
      { method: 'GET', path: '/api/lazarus/analyze/:address', desc: 'DPRK pattern analysis' },
      { method: 'GET', path: '/api/lazarus/alerts', desc: 'State-actor specific alerts' },
    ],
  },
  {
    category: 'AI & Autonomy',
    color: '#ffcc00',
    items: [
      { method: 'POST', path: '/api/ai/chat', desc: 'Claude-powered agent chat' },
      { method: 'POST', path: '/api/ai/analyze-token', desc: 'Deep AI scan' },
      { method: 'POST', path: '/api/healer/autonomous-mode', desc: 'Toggle autonomy', auth: true },
    ],
  },
  {
    category: 'Swap & Evacuate',
    color: '#FF8800',
    items: [
      { method: 'POST', path: '/api/swap/quote', desc: 'Jupiter quote + risk scan' },
      { method: 'POST', path: '/api/swap/evacuate', desc: 'Emergency wallet evacuate' },
    ],
  }
];

// --- Components ---

const Badge = ({ children, color = '#00ff88' }: { children: React.ReactNode, color?: string }) => (
  <span
    className="px-2 py-0.5 rounded border text-[10px] font-bold tracking-wider uppercase"
    style={{ color, borderColor: `${color}40`, backgroundColor: `${color}10` }}
  >
    {children}
  </span>
);

const GlowCard = ({ children, className = "", color = "#00ff88" }: { children: React.ReactNode, className?: string, color?: string }) => (
  <div
    className={`bg-cyber-card border border-cyber-border rounded-lg p-6 relative overflow-hidden group hover:border-opacity-50 transition-all duration-300 ${className}`}
    style={{ boxShadow: `0 0 15px ${color}05` }}
  >
    <div
      className="absolute top-0 left-0 w-1 h-full opacity-30 group-hover:opacity-100 transition-opacity"
      style={{ backgroundColor: color }}
    />
    {children}
  </div>
);

const ASCIIBox = ({ children, title }: { children: string, title?: string }) => (
  <div className="font-mono text-[10px] md:text-sm leading-tight text-cyber-green bg-black/40 p-4 border border-cyber-green/20 rounded-lg overflow-x-auto whitespace-pre">
    {title && <div className="text-cyber-green-dim mb-2 border-b border-cyber-green/10 pb-1">{title}</div>}
    {children}
  </div>
);

const MethodBadge = ({ method }: { method: 'GET' | 'POST' }) => (
  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${method === 'GET' ? 'bg-cyber-green/10 text-cyber-green border border-cyber-green/30' : 'bg-cyber-blue/10 text-cyber-blue border border-cyber-blue/30'}`}>
    {method}
  </span>
);

export default function Whitepaper() {
  const [activeTab, setActiveTab] = useState<'intro' | 'agents' | 'api' | 'roadmap'>('intro');

  return (
    <div className="fixed inset-0 h-screen overflow-y-auto bg-cyber-black text-cyber-text selection:bg-cyber-green/30 pb-20 scroll-smooth">
      {/* Background Grid and Glow */}
      <div className="fixed inset-0 cyber-grid opacity-[0.15] pointer-events-none z-0" />
      <div className="fixed top-0 left-1/4 w-[500px] h-[500px] bg-cyber-green/5 blur-[120px] rounded-full pointer-events-none z-0" />
      <div className="fixed bottom-0 right-1/4 w-[500px] h-[500px] bg-cyber-blue/5 blur-[120px] rounded-full pointer-events-none z-0" />

      {/* Back Button */}
      <div className="fixed top-6 left-6 z-[100]">
        <Link
          href="/"
          className="flex items-center gap-2 px-4 py-2 bg-cyber-dark/80 backdrop-blur-md border border-cyber-border rounded-full text-xs font-bold text-cyber-text-dim hover:text-cyber-green hover:border-cyber-green/50 hover:shadow-glow-green transition-all group"
        >
          <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
          BACK TO SWARM
        </Link>
      </div>

      {/* Header Image Section */}
      <div className="relative w-full max-w-5xl mx-auto pt-24 px-4">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center"
        >
          <img
            src="https://github.com/user-attachments/assets/0fa8d8c3-36e1-4a5e-a7c1-84456aaae9a2"
            alt="REKT PROTECT"
            className="w-full h-auto rounded-xl border border-cyber-border shadow-2xl"
          />

          <div className="mt-8 flex flex-col items-center text-center px-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-2xl md:text-3xl font-black text-cyber-green font-mono uppercase tracking-[0.2em] glow-text-green mb-2"
            >
              ⚡ 11 Autonomous AI Agents
            </motion.div>
            <div className="text-xs md:text-sm text-cyber-blue font-bold tracking-[0.3em] uppercase opacity-70">
              Zero Human Intervention | Bio-Inspired Defense
            </div>
          </div>

          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Badge color="#9945FF">Solana Mainnet</Badge>
            <Badge color="#FF6B35">Claude AI Engine</Badge>
            <Badge color="#00FF88">11 Active Agents</Badge>
            <Badge color="#00D4FF">Fully Autonomous</Badge>
            <Badge color="#FF3366">Healing Active</Badge>
          </div>
        </motion.div>
      </div>

      {/* Navigation */}
      <nav className="sticky top-4 z-50 mt-12 mb-16 mx-auto max-w-fit px-2 py-2 bg-cyber-dark/80 backdrop-blur-xl border border-cyber-border rounded-full flex items-center gap-1 shadow-2xl">
        {[
          { id: 'intro', label: 'Overview', icon: FileText },
          { id: 'agents', label: 'Swarm Agents', icon: Bot },
          { id: 'api', label: 'API Reference', icon: Terminal },
          { id: 'roadmap', label: 'Roadmap', icon: Activity },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-6 py-2 rounded-full text-xs font-bold tracking-widest flex items-center gap-2 transition-all ${activeTab === tab.id
              ? 'bg-cyber-green text-cyber-black shadow-glow-green scale-105'
              : 'text-cyber-text-dim hover:text-cyber-text hover:bg-cyber-border'
              }`}
          >
            <tab.icon size={14} />
            {tab.label}
          </button>
        ))}
      </nav>

      {/* Content Sections */}
      <main className="max-w-6xl mx-auto px-6">
        <AnimatePresence mode="wait">
          {activeTab === 'intro' && (
            <motion.div
              key="intro"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="space-y-16"
            >
              {/* System Metrics */}
              <section>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                  {[
                    { label: 'Active Agents', value: '11 / 11', color: '#00ff88', sub: 'ONLINE' },
                    { label: 'REST Endpoints', value: '33+', color: '#00d4ff', sub: 'AVAILABLE' },
                    { label: 'Rug Patterns', value: '361K+', color: '#ff8800', sub: 'TRAINED' },
                    { label: 'Threat Response', value: '< 3s', color: '#ff3366', sub: 'LATENCY' },
                    { label: 'Solana TPS', value: '2.5K+', color: '#9945FF', sub: 'MONITORED' },
                  ].map((stat) => (
                    <div key={stat.label} className="bg-cyber-card border border-cyber-border rounded-lg p-4 text-center">
                      <div className="text-[10px] uppercase tracking-widest text-cyber-text-dim mb-1">{stat.label}</div>
                      <div className="text-xl md:text-2xl font-bold font-mono" style={{ color: stat.color }}>{stat.value}</div>
                      <div className="text-[10px] font-bold mt-1 opacity-50" style={{ color: stat.color }}>{stat.sub}</div>
                    </div>
                  ))}
                </div>
              </section>

              {/* Boot Sequence */}
              <section>
                <div className="flex items-center gap-3 mb-6">
                  <Terminal className="text-cyber-green" />
                  <h2 className="text-xl font-bold tracking-tight">SYSTEM BOOT SEQUENCE</h2>
                </div>
                <ASCIIBox title="KERNAL LOAD SUCCESS">
                  {`╔═══════════════════════════════════════════════════════════════════════════╗
║                                                                           ║
║   ██████╗ ███████╗██╗  ██╗████████╗   ██████╗ ██████╗  ██████╗ ████████╗  ║
║   ██╔══██╗██╔════╝██║ ██╔╝╚══██╔══╝   ██╔══██╗██╔══██╗██╔═══██╗╚══██╔══╝  ║
║   ██████╔╝█████╗  █████╔╝    ██║      ██████╔╝██████╔╝██║   ██║   ██║     ║
║   ██╔══██╗██╔══╝  ██╔═██╗    ██║      ██╔═══╝ ██╔══██╗██║   ██║   ██║     ║
║   ██║  ██║███████╗██║  ██╗   ██║      ██║      ██║  ██║╚██████╔╝   ██║     ║
║   ╚═╝  ╚═╝╚══════╝╚═╝  ╚═╝   ╚═╝      ╚═╝      ╚═╝  ╚═╝ ╚═════╝    ╚═╝     ║
║                                                                           ║
║   ███████╗ ██████╗████████╗                                               ║
║   ██╔════╝██╔════╝╚══██╔══╝                                               ║
║   █████╗  ██║        ██║                                                  ║
║   ██╔══╝  ██║        ██║                                                  ║
║   ███████╗╚██████╗   ██║                                                  ║
║   ╚══════╝ ╚═════╝   ╚═╝                                                  ║
║                                                                           ║
║   [■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■] 100%  BOOT COMPLETE          ║
╚═══════════════════════════════════════════════════════════════════════════╝

> Initializing swarm consciousness...           [OK]
> Loading 11 autonomous agents...               [OK]
> Connecting to Solana mainnet-beta...          [OK]
> Jupiter DEX integration online...             [OK]
> Wallet adapter (Phantom/Solflare/Torus)...    [OK]
> Enabling autonomous mode...                   [OK]
> AI Engine (Claude) connected...               [OK]
> Digital immune system: FULLY OPERATIONAL      [OK]`}
                </ASCIIBox>
              </section>

              {/* Problem vs Solution */}
              <section className="grid md:grid-cols-2 gap-8">
                <GlowCard color="#ff3366">
                  <h3 className="text-cyber-red font-bold text-lg mb-6 flex items-center gap-2">
                    <ZapOff size={20} /> THE PROBLEM
                  </h3>
                  <div className="space-y-4 font-mono text-sm">
                    {[
                      { msg: '$1B+ lost to rug pulls in 2024', sign: '-' },
                      { msg: '361,000+ malicious pools deployed', sign: '-' },
                      { msg: 'Lazarus Group (DPRK) targeting DeFi', sign: '-' },
                      { msg: 'Zero autonomous defense systems exist', sign: '-' },
                      { msg: 'Manual security = always too late', sign: '-' },
                      { msg: 'Users get rekt BEFORE discovering threats', sign: '-' },
                    ].map((item, i) => (
                      <div key={i} className="flex gap-4 text-cyber-red/80">
                        <span>{item.sign}</span>
                        <span>{item.msg}</span>
                      </div>
                    ))}
                  </div>
                </GlowCard>

                <GlowCard color="#00ff88">
                  <h3 className="text-cyber-green font-bold text-lg mb-6 flex items-center gap-2">
                    <Shield size={20} /> OUR SOLUTION
                  </h3>
                  <div className="space-y-4 font-mono text-sm">
                    {[
                      { msg: '11 AI agents — coordinated swarm', sign: '+' },
                      { msg: 'Threat detection in < 3 seconds', sign: '+' },
                      { msg: 'Auto-defense: swap, revoke, transfer', sign: '+' },
                      { msg: 'First tool tracking Lazarus on Solana', sign: '+' },
                      { msg: 'Self-heals with 6-phase AI response', sign: '+' },
                      { msg: 'Risk-aware swaps + auto-blocking', sign: '+' },
                    ].map((item, i) => (
                      <div key={i} className="flex gap-4 text-cyber-green/80">
                        <span>{item.sign}</span>
                        <span>{item.msg}</span>
                      </div>
                    ))}
                  </div>
                </GlowCard>
              </section>

              {/* Comparison Table */}
              <section>
                <div className="flex items-center gap-3 mb-6">
                  <BarChart3 className="text-cyber-orange" />
                  <h2 className="text-xl font-bold tracking-tight uppercase">WHY REKT PROTECT WINS</h2>
                </div>
                <div className="overflow-x-auto bg-cyber-card border border-cyber-border rounded-xl">
                  <table className="w-full text-sm border-collapse">
                    <thead>
                      <tr className="border-b border-cyber-border bg-black/20">
                        <th className="py-4 px-6 text-left text-cyber-text-dim uppercase tracking-widest text-[10px]">Feature</th>
                        <th className="py-4 px-6 text-center text-cyber-green uppercase tracking-widest text-[10px]">REKT PROTECT</th>
                        <th className="py-4 px-6 text-center text-cyber-text-dim uppercase tracking-widest text-[10px]">Legacy Tools</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        { f: 'Autonomous Agent Swarm (11 agents)', s: true, l: false },
                        { f: 'Self-Healing (Circuit Breaker + 6-Phase IR)', s: true, l: false },
                        { f: 'Lazarus Group (DPRK) Tracking', s: true, l: false },
                        { f: 'Post-Quantum Defense Framework', s: true, l: false },
                        { f: 'Claude 3.5 AI Engine Decisions', s: true, l: false },
                        { f: 'Active Honeypots (Offense-as-Defense)', s: true, l: false },
                        { f: 'Risk-Aware Swap Engine (Auto-Scan)', s: true, l: false },
                        { f: 'Zero Human Intervention Required', s: true, l: false },
                      ].map((row, i) => (
                        <tr key={i} className="border-b border-cyber-border/50 hover:bg-white/[0.02] transition-colors">
                          <td className="py-4 px-6 font-medium text-cyber-text/80">{row.f}</td>
                          <td className="py-4 px-6 text-center">
                            <CheckCircle2 className="mx-auto text-cyber-green" size={18} />
                          </td>
                          <td className="py-4 px-6 text-center">
                            <XCircle className="mx-auto text-cyber-red opacity-30" size={18} />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>

              {/* Architecture Diagram */}
              <section>
                <div className="flex items-center gap-3 mb-6">
                  <Cpu className="text-cyber-blue" />
                  <h2 className="text-xl font-bold tracking-tight uppercase">SYSTEM ARCHITECTURE</h2>
                </div>
                <ASCIIBox title="ARCHITECTURE_MAP_V1.0">
                  {`┌─────────────────────────────────────────────────────────────────────────────┐
│               CYBERPUNK DASHBOARD (Next.js 14 — :3001)                      │
│  ╔════════╗ ╔════════╗ ╔════════╗ ╔════════╗ ╔════════╗ ╔════╗ ╔════╗ ╔══╗ │
│  ║  DASH  ║ ║ SCAN   ║ ║WALLETS ║ ║THREATS ║ ║NETWORK ║ ║ AI ║ ║HEAL║ ║SW║ │
│  ║ BOARD  ║ ║  NER   ║ ║  MON   ║ ║ INTEL  ║ ║  MON   ║ ║CHAT║ ║ ER ║ ║AP║ │
│  ╚════════╝ ╚════════╝ ╚════════╝ ╚════════╝ ╚════════╝ ╚════╝ ╚════╝ ╚══╝ │
└──────────────────────────────────┬──────────────────────────────────────────┘
                                   │ REST API (33+ endpoints)
                                   ▼
┌──────────────────────────────────────────────────────────────────────────────┐
│               ⚡ EXPRESS API SERVER (:3000) — 33+ Endpoints                  │
│     Scanner · Sentinel · Guardian · Intel · Lazarus · Honeypot · Prophet     │
│     Network · Healer · Reporter · Quantum · AI Engine · Swap · Evacuate     │
└──────────────────────────────────┬──────────────────────────────────────────┘
                                   │
      ┌────────────────────────────┼─────────────────────────────┐
      ▼                            ▼                             ▼
╔════════════════╗    ╔═══════════════════════╗    ╔════════════════╗
║  DETECTION     ║    ║     DEFENSE           ║    ║  INTELLIGENCE  ║
║    TIER        ║    ║      TIER             ║    ║     TIER       ║
║                ║    ║                       ║    ║                ║
║  ► Scanner     ║    ║  ► Guardian           ║    ║  ► Intel       ║
║  ► Sentinel    ║    ║  ► Honeypot           ║    ║  ► Lazarus     ║
║  ► Network     ║    ║  ► Swap Engine        ║    ║  ► Prophet     ║
╚════════════════╝    ╚═══════════════════════╝    ╚════════════════╝
      │                            │                             │
      └────────────────────────────┼─────────────────────────────┘
                                   │
            ╔══════════════════════╧══════════════════════════╗
            ║      ⚡ SWARM EVENT BUS (EventEmitter3)            ║
            ╚══════════════════════╤══════════════════════════╝
                                   │
      ┌────────────────────────────┼─────────────────────────────┐
      ▼                            ▼                             ▼
╔════════════════╗    ╔═══════════════════════╗    ╔════════════════╗
║  SUPPORT       ║    ║    AUTONOMY           ║    ║  AI ENGINE     ║
║    TIER        ║    ║      TIER             ║    ║                ║
║  ► Reporter    ║    ║  ► HEALER             ║    ║  Claude Opus   ║
║  ► Quantum     ║    ║    Circuit Breaker    ║    ║  + GPT Backup  ║
╚════════════════╝    ╚═══════════════════════╝    ╚════════════════╝`}
                </ASCIIBox>
              </section>

              {/* Analogy Section */}
              <section className="bg-cyber-dark/40 border border-cyber-border rounded-2xl p-8 overflow-hidden relative">
                <div className="absolute top-0 right-0 w-64 h-64 bg-cyber-purple/10 blur-[80px] -z-10" />
                <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
                  <Globe className="text-cyber-purple" /> THE IMMUNE SYSTEM ANALOGY
                </h2>
                <p className="text-cyber-text-dim mb-8 max-w-2xl text-lg italic leading-relaxed">
                  "Your body has 11 defense systems working 24/7 without you thinking about it. REKT PROTECT works the same way."
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {[
                    { body: 'T-CELL', shield: 'SCANNER', action: 'Identifies threats', color: '#00ff88' },
                    { body: 'PATROL CELL', shield: 'SENTINEL', action: 'Monitors 24/7', color: '#00d4ff' },
                    { body: 'KILLER CELL', shield: 'GUARDIAN', action: 'Destroys invaders', color: '#ff3366' },
                    { body: 'MEMORY', shield: 'INTEL', action: 'Remembers attacks', color: '#a855f7' },
                    { body: 'ANTIBODY', shield: 'HONEYPOT', action: 'Traps attackers', color: '#ff8800' },
                    { body: 'BRAIN', shield: 'PROPHET', action: 'Predicts future', color: '#88ff00' },
                  ].map((item) => (
                    <div key={item.body} className="bg-cyber-card border border-cyber-border rounded-xl p-6 hover:shadow-glow-purple transition-all group">
                      <div className="text-[10px] text-cyber-text-dim mb-1 uppercase tracking-widest">{item.body}</div>
                      <div className="text-xl font-bold mb-2 group-hover:translate-x-1 transition-transform" style={{ color: item.color }}>→ {item.shield}</div>
                      <div className="text-xs text-cyber-text-dim leading-relaxed">{item.action}</div>
                    </div>
                  ))}
                </div>
              </section>

              {/* Quick Start Bash */}
              <section>
                <div className="flex items-center gap-3 mb-6">
                  <Zap className="text-cyber-yellow" />
                  <h2 className="text-xl font-bold tracking-tight uppercase">DEPLOY THE WEAPON</h2>
                </div>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <p className="text-sm text-cyber-text-dim">Deploy the full stack locally in under 2 minutes. Requires Node.js 18+ and Helius/Claude AI API keys.</p>
                    <div className="space-y-2">
                      <div className="text-[10px] font-bold text-cyber-text-dim uppercase">1. CLONE & INSTALL</div>
                      <ASCIIBox>
                        {`git clone rekt-protect
cd rekt-protect
npm install`}
                      </ASCIIBox>
                    </div>
                  </div>
                  <div className="space-y-2 pt-10">
                    <div className="text-[10px] font-bold text-cyber-text-dim uppercase">2. LAUNCH SWARM</div>
                    <ASCIIBox>
                      {`npm run dev
# → Backend: http://localhost:3000
# → Dashboard: http://localhost:3001`}
                    </ASCIIBox>
                  </div>
                </div>
              </section>

              {/* Project Map */}
              <section>
                <div className="flex items-center gap-3 mb-6">
                  <Network className="text-cyber-purple" />
                  <h2 className="text-xl font-bold tracking-tight uppercase">PROJECT MAP</h2>
                </div>
                <ASCIIBox title="ROOT_STRUCTURE">
                  {`rekt-protect/
├── 🧠 src/                 # Backend — The Brain (11 Agents)
│   ├── index.ts            # Swarm orchestrator boot
│   ├── agents/             # Autonomous agent modules
│   ├── core/               # P2P Event Bus & Base classes
│   └── utils/              # Claude AI, Helius, Jupiter integration
├── 🎨 dashboard/           # Frontend — The Eyes (Next.js 14)
│   ├── app/                # Main routes & whitepaper
│   ├── components/         # 60+ Cyberpunk UI modules
│   └── hooks/              # SWR real-time data hooks
└── .env.example            # Configuration template`}
                </ASCIIBox>
              </section>
            </motion.div>
          )}

          {activeTab === 'agents' && (
            <motion.div
              key="agents"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.05 }}
              className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {agents.map((agent) => (
                <GlowCard key={agent.id} color={agent.color} className="h-full flex flex-col">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-lg font-bold font-mono" style={{ color: agent.color }}>{agent.name}</h3>
                      <div className="text-[10px] text-cyber-text-dim uppercase tracking-widest font-bold">{agent.role}</div>
                    </div>
                    <div className="p-2 rounded-lg bg-black/20" style={{ color: agent.color }}>
                      <Bot size={20} />
                    </div>
                  </div>
                  <p className="text-sm text-cyber-text-dim mb-6 leading-relaxed">
                    {agent.desc}
                  </p>
                  <div className="space-y-2 mb-8 flex-grow">
                    {agent.details.map((detail, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-[11px] text-cyber-text/80 font-mono">
                        <div className="w-1 h-1 rounded-full" style={{ backgroundColor: agent.color }} />
                        {detail}
                      </div>
                    ))}
                  </div>
                  <div className="pt-4 border-t border-cyber-border">
                    <code className="text-[10px] text-cyber-text-dim block mb-1">INTERFACE:</code>
                    <code className="text-xs break-all" style={{ color: agent.color }}>{agent.endpoint}</code>
                  </div>
                </GlowCard>
              ))}
            </motion.div>
          )}

          {activeTab === 'api' && (
            <motion.div
              key="api"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-12"
            >
              <section className="bg-cyber-card border border-cyber-border rounded-xl p-8">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
                  <div>
                    <h2 className="text-2xl font-bold text-cyber-green flex items-center gap-3">
                      <Terminal /> API SYSTEM
                    </h2>
                    <p className="text-cyber-text-dim mt-1">33+ REST endpoints for developers and secondary protocols.</p>
                  </div>
                  <div className="bg-black/40 px-4 py-2 border border-cyber-border rounded font-mono text-sm flex items-center gap-3">
                    <Globe size={14} className="text-cyber-blue" />
                    <span className="text-cyber-text-dim">ENDPOINT:</span>
                    <span className="text-cyber-green">https://api.rektprotect.fun</span>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-8">
                  {endpoints.map((cat) => (
                    <div key={cat.category}>
                      <h3 className="text-xs font-bold tracking-widest uppercase mb-4 flex items-center gap-2" style={{ color: cat.color }}>
                        <div className="w-1 h-1 rounded-full" style={{ backgroundColor: cat.color }} />
                        {cat.category}
                      </h3>
                      <div className="space-y-3">
                        {cat.items.map((ep) => (
                          <div key={ep.path} className="group bg-cyber-dark/40 border border-cyber-border rounded-lg p-3 hover:border-cyber-green/30 transition-all">
                            <div className="flex items-center gap-3 mb-1">
                              <MethodBadge method={ep.method} />
                              <code className="text-xs font-mono text-cyber-text/90 group-hover:text-cyber-green transition-colors">{ep.path}</code>
                              {ep.auth && <Lock size={10} className="text-amber-500" />}
                            </div>
                            <p className="text-[10px] text-cyber-text-dim italic ml-[54px]">{ep.desc}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              <section>
                <h3 className="text-lg font-bold mb-6 flex items-center gap-3">
                  <Activity size={20} className="text-cyber-blue" /> QUICK INTEGRATION
                </h3>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <div className="text-xs font-bold text-cyber-text-dim uppercase tracking-wider">cURL — SCAN TOKEN</div>
                    <ASCIIBox>
                      {`curl -X GET "https://api.rektprotect.fun/api/scan/TOKEN_ADDRESS" \\
     -H "Accept: application/json"`}
                    </ASCIIBox>
                  </div>
                  <div className="space-y-2">
                    <div className="text-xs font-bold text-cyber-text-dim uppercase tracking-wider">JAVASCRIPT — FETCH STATUS</div>
                    <ASCIIBox>
                      {`const status = await fetch('https://api.rektprotect.fun/api/status');
const swarm = await status.json();
console.log(swarm.agents.filter(a => a.status === 'OK'));`}
                    </ASCIIBox>
                  </div>
                </div>
              </section>
            </motion.div>
          )}

          {activeTab === 'roadmap' && (
            <motion.div
              key="roadmap"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-12"
            >
              <section className="relative py-10">
                <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-cyber-border hidden md:block" />

                <div className="space-y-24">
                  {[
                    { phase: 'PHASE 1', title: 'GENESIS — Q1 2026', items: ['11 Agent Swarm Core', 'Cyberpunk Dashboard', '33+ API Endpoints', 'Risk-Aware Swap Engine'], align: 'left', color: '#00ff88', icon: Zap },
                    { phase: 'PHASE 2', title: 'EVOLVE — Q2 2026', items: ['Telegram Defense Bot', 'Mobile Response App', 'Browser Extension', 'API Tier Monetization'], align: 'right', color: '#00d4ff', icon: Brain },
                    { phase: 'PHASE 3', title: 'SCALE — Q3 2026', items: ['Solana Program Release', 'Token $SHIELD Launch', 'Staking Rewards', 'Partner DEX Integration'], align: 'left', color: '#a855f7', icon: Network },
                    { phase: 'PHASE 4', title: 'DOMINATE — Q4 2026', items: ['Cross-Chain Support', 'DAO Governance', 'Halborn Security Audit', 'Institutional Enterprise API'], align: 'right', color: '#ff3366', icon: Globe },
                  ].map((p, idx) => (
                    <div key={idx} className={`flex flex-col md:items-center relative ${p.align === 'left' ? 'md:flex-row' : 'md:flex-row-reverse'}`}>
                      <div className="md:w-1/2" />

                      <div className="absolute left-1/2 -ml-3 w-6 h-6 rounded-full border-2 border-cyber-border z-10 bg-cyber-black hidden md:flex items-center justify-center">
                        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: p.color }} />
                      </div>

                      <div className={`md:w-1/2 md:px-12 ${p.align === 'left' ? 'text-left' : 'text-right'}`}>
                        <div className="p-1 rounded-lg bg-cyber-card border border-cyber-border inline-block mb-3" style={{ color: p.color }}>
                          <p.icon size={20} />
                        </div>
                        <h4 className="text-[10px] font-bold tracking-widest uppercase mb-1" style={{ color: p.color }}>{p.phase}</h4>
                        <h3 className="text-xl font-bold mb-4">{p.title}</h3>
                        <div className={`flex flex-col gap-2 ${p.align === 'right' ? 'items-end' : 'items-start'}`}>
                          {p.items.map((item, i) => (
                            <div key={i} className="flex items-center gap-3 text-cyber-text-dim text-sm">
                              {p.align === 'left' && <CheckCircle2 size={12} className="text-cyber-green shrink-0" />}
                              {item}
                              {p.align === 'right' && <CheckCircle2 size={12} className="text-cyber-green shrink-0" />}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Footer */}
      <footer className="mt-32 max-w-6xl mx-auto px-6 border-t border-cyber-border pt-12 pb-20">
        <div className="grid md:grid-cols-4 gap-12">
          <div className="col-span-2">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-3 h-3 rounded-full bg-cyber-green animate-pulse-glow" />
              <span className="text-lg font-bold tracking-tighter">REKT PROTECT <span className="text-cyber-green text-xs">v0.1</span></span>
            </div>
            <p className="text-cyber-text-dim text-sm max-w-md leading-relaxed">
              11 Agents. Zero Human Intervention. The first self-healing digital immune system for Solana.
              Built for traders, powered by Claude AI, secured by the cluster.
            </p>
          </div>

          <div>
            <h4 className="text-xs font-bold uppercase tracking-widest text-cyber-text-dim mb-6">Connect</h4>
            <div className="flex flex-col gap-4">
              <a href="https://github.com/YouthAIAgent/rekt-protect" target="_blank" rel="noopener" className="flex items-center gap-3 text-sm text-cyber-text-dim hover:text-cyber-green transition-colors">
                <Github size={16} /> GitHub Repository
              </a>
              <a href="https://x.com/Web3__Youth" target="_blank" rel="noopener" className="flex items-center gap-3 text-sm text-cyber-text-dim hover:text-cyber-blue transition-colors">
                <Twitter size={16} /> Twitter / X
              </a>
            </div>
          </div>

          <div>
            <h4 className="text-xs font-bold uppercase tracking-widest text-cyber-text-dim mb-6">Security</h4>
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-3 text-xs text-cyber-text-dim">
                <CheckCircle2 size={14} className="text-cyber-green" /> Solana Mainnet-Beta
              </div>
              <div className="flex items-center gap-3 text-xs text-cyber-text-dim">
                <CheckCircle2 size={14} className="text-cyber-green" /> Claude 3.5 Sonnet
              </div>
              <div className="flex items-center gap-3 text-xs text-cyber-text-dim">
                <CheckCircle2 size={14} className="text-cyber-green" /> Jupiter DEX Verified
              </div>
            </div>
          </div>
        </div>

        <div className="mt-20 flex flex-col items-center">
          <div className="text-[10px] font-bold text-cyber-green/60 tracking-[0.5em] uppercase mb-8">
            ██ PREDICT · DETECT · DEFEND · SELF-HEAL · SWAP · EVACUATE · REPEAT ██
          </div>
          <div className="mt-8">
            <img width="854" height="180" alt="Footer Wave" src="https://github.com/user-attachments/assets/419ef841-7951-4e36-859e-9a88b3d183dc" loading="lazy" />
          </div>
          <p className="mt-8 text-[10px] text-cyber-text-dim font-mono">
            © 2026 REKT PROTECT · POWERED BY CLAUDE AI · SOLANA MAINNET
          </p>
        </div>
      </footer >
    </div >
  );
}
