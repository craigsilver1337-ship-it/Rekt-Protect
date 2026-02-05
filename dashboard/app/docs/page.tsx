import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'REKT PROTECT | Documentation',
  description: 'Complete documentation for REKT PROTECT — 11-Agent Autonomous Digital Immune System for Solana. API reference, architecture, integration guides.',
};

const API_BASE = 'https://web-production-c5ac4.up.railway.app';

const agents = [
  { name: 'SCANNER', role: 'T-Cell', color: '#00ff88', desc: 'Token risk scoring engine. Scores every token 0-100 analyzing mint authority, freeze authority, LP lock, holder concentration, and deployer history. Groq AI enhancement on high-risk tokens.', endpoint: 'GET /api/scan/:tokenAddress' },
  { name: 'SENTINEL', role: 'Patrol Cell', color: '#00d4ff', desc: '24/7 wallet monitoring via Helius enhanced RPC. Detects suspicious transactions, unusual approvals, drainer contract interactions, and scam pattern matches.', endpoint: 'POST /api/monitor/wallet' },
  { name: 'GUARDIAN', role: 'Killer Cell', color: '#ff3366', desc: 'Autonomous emergency defense. Executes swaps via Jupiter to move risky tokens to USDC, revokes dangerous approvals, transfers assets to safety wallets. No human intervention.', endpoint: 'GET /api/defense/log' },
  { name: 'INTEL', role: 'Immune Memory', color: '#a855f7', desc: 'On-chain threat registry built with Anchor. Stores confirmed threats with multi-agent consensus (2+ agents required). Maintains attacker blacklist with damage estimates.', endpoint: 'GET /api/threats' },
  { name: 'REPORTER', role: 'Voice', color: '#ffcc00', desc: 'Mints Protection Proof NFTs via Metaplex when REKT PROTECT successfully defends a wallet. Permanent on-chain evidence of protection.', endpoint: 'Protection Proof NFTs' },
  { name: 'QUANTUM', role: 'Evolution', color: '#00d4ff', desc: 'Post-quantum cryptography readiness assessment. Evaluates Ed25519 wallet vulnerability to quantum attacks and tracks global quantum hardware developments.', endpoint: 'GET /api/quantum/assess/:wallet' },
  { name: 'LAZARUS', role: 'Counter-Intel', color: '#ff8800', desc: 'First Solana tool tracking DPRK/Lazarus Group. Cross-references addresses against known attack patterns, OFAC sanctions, FBI advisories. Maps state-sponsored wallet clusters.', endpoint: 'GET /api/lazarus/analyze/:address' },
  { name: 'HONEYPOT', role: 'Antibody', color: '#ff3366', desc: 'Active defense through bait wallet deployment. Captures attacker addresses, methods, timing, and patterns. All intelligence feeds back into INTEL.', endpoint: 'POST /api/honeypot/deploy' },
  { name: 'PROPHET', role: 'Predictive Brain', color: '#a855f7', desc: 'Rug pull prediction trained on 361,000+ Raydium pool patterns. Whale movement detection and market sentiment analysis via Pyth oracles.', endpoint: 'GET /api/predict/:tokenAddress' },
  { name: 'NETWORK', role: 'Nervous System', color: '#00d4ff', desc: 'Real-time Solana infrastructure monitoring. TPS, block times, DDoS indicators, MEV sandwich detection, suspicious program upgrades.', endpoint: 'GET /api/network/health' },
  { name: 'HEALER', role: 'Autonomous Brain', color: '#00ff88', desc: 'Self-healing meta-agent with 6-phase incident response: Detect (15s), Classify (AI), Contain, Eradicate, Recover, Learn. Circuit breakers prevent cascade failures.', endpoint: 'GET /api/healer/status' },
];

const endpoints = [
  {
    category: 'Health & Status',
    color: '#00ff88',
    items: [
      { method: 'GET', path: '/api/health', desc: 'System health check with all agent statuses', auth: false },
      { method: 'GET', path: '/api/status', desc: 'Full swarm status with per-agent details', auth: false },
    ],
  },
  {
    category: 'Scanner — Token Risk',
    color: '#00ff88',
    items: [
      { method: 'GET', path: '/api/scan/:tokenAddress', desc: 'Scan any token for risk score (0-100) with threat breakdown', auth: false },
    ],
  },
  {
    category: 'Sentinel — Wallet Monitoring',
    color: '#00d4ff',
    items: [
      { method: 'POST', path: '/api/monitor/wallet', desc: 'Add wallet to 24/7 monitoring', auth: true },
      { method: 'GET', path: '/api/monitor/wallets', desc: 'List all monitored wallets', auth: false },
      { method: 'GET', path: '/api/alerts', desc: 'Get security alerts (filter by ?wallet=)', auth: false },
    ],
  },
  {
    category: 'Guardian — Defense',
    color: '#ff3366',
    items: [
      { method: 'GET', path: '/api/defense/log', desc: 'Defense action log with total saved and proofs', auth: false },
    ],
  },
  {
    category: 'Intel — Threat Registry',
    color: '#a855f7',
    items: [
      { method: 'GET', path: '/api/threats', desc: 'All threats, blacklist, antibodies, and statistics', auth: false },
      { method: 'GET', path: '/api/threats/:address', desc: 'Check if address is known threat or blacklisted', auth: false },
    ],
  },
  {
    category: 'Quantum Shield',
    color: '#00d4ff',
    items: [
      { method: 'GET', path: '/api/quantum/assess/:walletAddress', desc: 'Quantum vulnerability assessment for wallet', auth: false },
      { method: 'GET', path: '/api/quantum/timeline', desc: 'Quantum threat timeline', auth: false },
      { method: 'GET', path: '/api/quantum/threat-level', desc: 'Current global quantum threat level', auth: false },
    ],
  },
  {
    category: 'Lazarus Tracker',
    color: '#ff8800',
    items: [
      { method: 'GET', path: '/api/lazarus/analyze/:address', desc: 'Analyze address for DPRK/Lazarus patterns', auth: false },
      { method: 'GET', path: '/api/lazarus/alerts', desc: 'All Lazarus-related alerts and stats', auth: false },
    ],
  },
  {
    category: 'Honeypot',
    color: '#ff3366',
    items: [
      { method: 'POST', path: '/api/honeypot/deploy', desc: 'Deploy bait wallet with trackable tokens', auth: true },
      { method: 'GET', path: '/api/honeypot/deployments', desc: 'List honeypot deployments and attacker profiles', auth: false },
    ],
  },
  {
    category: 'Prophet — Predictions',
    color: '#a855f7',
    items: [
      { method: 'GET', path: '/api/predict/:tokenAddress', desc: 'Rug pull prediction for token', auth: false },
      { method: 'GET', path: '/api/predict/whales/:tokenAddress', desc: 'Whale movement alerts for token', auth: false },
      { method: 'GET', path: '/api/sentiment', desc: 'Market sentiment analysis via Pyth', auth: false },
    ],
  },
  {
    category: 'Network Guardian',
    color: '#00d4ff',
    items: [
      { method: 'GET', path: '/api/network/health', desc: 'Solana network health (TPS, block times, DDoS)', auth: false },
      { method: 'GET', path: '/api/network/stats', desc: 'Network stats with MEV and program upgrades', auth: false },
    ],
  },
  {
    category: 'Swarm Events',
    color: '#00ff88',
    items: [
      { method: 'GET', path: '/api/events', desc: 'Recent cross-agent events (max 100)', auth: false },
      { method: 'GET', path: '/api/events/critical', desc: 'Critical security events only', auth: false },
    ],
  },
  {
    category: 'AI Engine',
    color: '#ffcc00',
    items: [
      { method: 'POST', path: '/api/ai/chat', desc: 'Chat with swarm intelligence', auth: false },
      { method: 'POST', path: '/api/ai/analyze-token', desc: 'Deep AI token analysis', auth: false },
      { method: 'POST', path: '/api/ai/audit-contract', desc: 'AI smart contract audit (max 5000 chars)', auth: false },
      { method: 'POST', path: '/api/ai/threat-report', desc: 'Generate AI threat report', auth: false },
      { method: 'POST', path: '/api/ai/market-risk', desc: 'AI market risk assessment', auth: false },
      { method: 'GET', path: '/api/ai/status', desc: 'AI engine availability and provider', auth: false },
    ],
  },
  {
    category: 'Healer — Self-Healing',
    color: '#00ff88',
    items: [
      { method: 'GET', path: '/api/healer/status', desc: 'Healer status, circuit breakers, heal stats', auth: false },
      { method: 'GET', path: '/api/healer/incidents', desc: 'Incident history (?limit=50)', auth: false },
      { method: 'GET', path: '/api/healer/actions', desc: 'Autonomous heal action history', auth: false },
      { method: 'POST', path: '/api/healer/decide', desc: 'Request AI autonomous decision', auth: true },
      { method: 'POST', path: '/api/healer/autonomous-mode', desc: 'Enable/disable autonomous mode', auth: true },
    ],
  },
  {
    category: 'Swap — Risk-Aware Trading',
    color: '#00ff88',
    items: [
      { method: 'GET', path: '/api/swap/tokens', desc: 'Available tokens with popular list', auth: false },
      { method: 'POST', path: '/api/swap/quote', desc: 'Swap quote with automatic risk analysis', auth: false },
      { method: 'POST', path: '/api/swap/execute', desc: 'Execute swap after quote', auth: false },
      { method: 'POST', path: '/api/swap/emergency-evacuate', desc: 'Scan wallet and evacuate risky tokens to USDC', auth: false },
      { method: 'GET', path: '/api/swap/price/:tokenMint', desc: 'Current USD price of any token', auth: false },
    ],
  },
];

const threatTypes = [
  'RugPull', 'HoneypotToken', 'Drainer', 'Phishing', 'SandwichAttack', 'FlashLoan',
  'MintExploit', 'FreezeExploit', 'OwnerHijack', 'StateSponsored', 'QuantumVulnerable', 'MaliciousUpgrade',
];

const protocols = [
  { name: 'Jupiter DEX', use: 'Risk-aware swaps + emergency wallet evacuation', color: '#00ff88' },
  { name: 'Helius', use: 'Enhanced RPC for real-time wallet monitoring', color: '#00d4ff' },
  { name: 'Pyth Network', use: 'Price oracles + crash detection + sentiment', color: '#a855f7' },
  { name: 'Metaplex', use: 'Protection Proof NFT minting', color: '#ffcc00' },
  { name: 'SPL Token', use: 'Token analysis + holder concentration mapping', color: '#ff8800' },
  { name: 'Anchor', use: 'On-chain threat-registry program', color: '#ff3366' },
  { name: 'Wallet Adapter', use: 'Phantom, Solflare, Torus with auto-connect', color: '#00d4ff' },
];

function MethodBadge({ method }: { method: string }) {
  const colors: Record<string, string> = {
    GET: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
    POST: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    PUT: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
    DELETE: 'bg-red-500/20 text-red-400 border-red-500/30',
  };
  return (
    <span className={`px-2 py-0.5 text-[10px] font-bold border rounded ${colors[method] || 'bg-gray-500/20 text-gray-400'}`}>
      {method}
    </span>
  );
}

export default function DocsPage() {
  return (
    <div className="min-h-screen bg-cyber-black text-cyber-text overflow-y-auto">
      {/* Navigation Bar */}
      <nav className="sticky top-0 z-50 bg-cyber-black/90 backdrop-blur-md border-b border-cyber-border">
        <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-cyber-green animate-pulse-glow" />
            <span className="text-cyber-green font-bold tracking-wider text-sm">REKT PROTECT</span>
            <span className="text-cyber-text-dim text-xs">v0.1 DOCS</span>
          </div>
          <div className="flex items-center gap-4 text-xs">
            <a href="/" className="text-cyber-text-dim hover:text-cyber-green transition-colors">Dashboard</a>
            <a href="https://github.com/YouthAIAgent/rekt-shield" target="_blank" rel="noopener" className="text-cyber-text-dim hover:text-cyber-green transition-colors">GitHub</a>
            <a href="https://x.com/Web3__Youth" target="_blank" rel="noopener" className="text-cyber-text-dim hover:text-cyber-green transition-colors">Twitter</a>
            <a href="https://colosseum.com/agent-hackathon/projects/rekt-shield" target="_blank" rel="noopener" className="px-3 py-1 bg-cyber-green/10 text-cyber-green border border-cyber-green/30 rounded hover:bg-cyber-green/20 transition-colors">Vote</a>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <header className="relative border-b border-cyber-border overflow-hidden">
        <div className="absolute inset-0 cyber-grid opacity-50" />
        <div className="relative max-w-6xl mx-auto px-6 py-20">
          <div className="flex items-center gap-2 mb-4">
            <div className="px-2 py-0.5 bg-cyber-green/10 border border-cyber-green/30 rounded text-cyber-green text-[10px] font-bold tracking-widest">DOCUMENTATION</div>
            <div className="px-2 py-0.5 bg-cyber-blue/10 border border-cyber-blue/30 rounded text-cyber-blue text-[10px] font-bold tracking-widest">v0.1</div>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="text-cyber-green glow-text-green">REKT PROTECT</span>
          </h1>
          <p className="text-lg text-cyber-text-dim max-w-2xl mb-8">
            11-Agent Autonomous Digital Immune System for Solana. Bio-inspired swarm intelligence that detects, predicts, and neutralizes threats in real time.
          </p>
          <div className="flex flex-wrap gap-3 mb-8">
            {[
              { label: '11 Agents', value: 'Active' },
              { label: '33+ Endpoints', value: 'REST API' },
              { label: '361K+ Patterns', value: 'Prediction' },
              { label: '7 Protocols', value: 'Solana' },
              { label: '3 AI Providers', value: 'Failover' },
              { label: '0 Downtime', value: 'Self-Healing' },
            ].map((s) => (
              <div key={s.label} className="px-3 py-2 bg-cyber-card border border-cyber-border rounded">
                <div className="text-[10px] text-cyber-text-dim uppercase tracking-wider">{s.value}</div>
                <div className="text-sm font-semibold text-cyber-text">{s.label}</div>
              </div>
            ))}
          </div>
          <div className="bg-cyber-darker border border-cyber-border rounded p-4">
            <div className="text-[10px] text-cyber-text-dim mb-2 uppercase tracking-wider">Quick Start</div>
            <code className="text-sm text-cyber-green">
              curl {API_BASE}/api/scan/So11111111111111111111111111111111111111112
            </code>
            <p className="text-xs text-cyber-text-dim mt-2">No API key required for read operations.</p>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-6">

        {/* Table of Contents */}
        <section className="py-10 border-b border-cyber-border">
          <h2 className="text-xs text-cyber-text-dim uppercase tracking-widest mb-4">Contents</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {['Architecture', 'The 11 Agents', 'API Reference', 'Rate Limits', 'On-Chain Program', 'Solana Protocols', 'Integration Examples', 'Links'].map((item) => (
              <a key={item} href={`#${item.toLowerCase().replace(/\s+/g, '-')}`} className="px-3 py-2 bg-cyber-card border border-cyber-border rounded text-sm text-cyber-text-dim hover:text-cyber-green hover:border-cyber-green/30 transition-colors">
                {item}
              </a>
            ))}
          </div>
        </section>

        {/* Architecture */}
        <section id="architecture" className="py-12 border-b border-cyber-border">
          <h2 className="text-2xl font-bold text-cyber-green mb-2">Architecture</h2>
          <p className="text-cyber-text-dim mb-8 max-w-3xl">
            Modeled after the human immune system. Each agent mirrors a biological defense mechanism. Agents communicate through a peer-to-peer event bus (EventEmitter3). When one agent detects a threat, the entire swarm mobilizes autonomously.
          </p>

          <div className="grid md:grid-cols-2 gap-4 mb-8">
            <div className="bg-cyber-card border border-cyber-border rounded p-5">
              <h3 className="text-sm font-bold text-cyber-blue mb-3">Communication</h3>
              <ul className="space-y-2 text-sm text-cyber-text-dim">
                <li className="flex items-start gap-2"><span className="text-cyber-green mt-1 text-xs">&#9656;</span>P2P event bus via EventEmitter3</li>
                <li className="flex items-start gap-2"><span className="text-cyber-green mt-1 text-xs">&#9656;</span>Real-time threat intelligence sharing</li>
                <li className="flex items-start gap-2"><span className="text-cyber-green mt-1 text-xs">&#9656;</span>Multi-agent consensus for threat confirmation</li>
                <li className="flex items-start gap-2"><span className="text-cyber-green mt-1 text-xs">&#9656;</span>Circuit breakers prevent cascade failures</li>
              </ul>
            </div>
            <div className="bg-cyber-card border border-cyber-border rounded p-5">
              <h3 className="text-sm font-bold text-cyber-blue mb-3">AI Engine</h3>
              <ul className="space-y-2 text-sm text-cyber-text-dim">
                <li className="flex items-start gap-2"><span className="text-cyber-green mt-1 text-xs">&#9656;</span>Groq (primary — fast inference)</li>
                <li className="flex items-start gap-2"><span className="text-cyber-green mt-1 text-xs">&#9656;</span>Claude (fallback — deep analysis)</li>
                <li className="flex items-start gap-2"><span className="text-cyber-green mt-1 text-xs">&#9656;</span>GPT (backup — zero downtime)</li>
                <li className="flex items-start gap-2"><span className="text-cyber-green mt-1 text-xs">&#9656;</span>Automatic failover, no manual switch</li>
              </ul>
            </div>
          </div>

          <div className="bg-cyber-darker border border-cyber-border rounded p-5">
            <h3 className="text-sm font-bold text-cyber-text-dim mb-3">Tech Stack</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
              {[
                { label: 'Frontend', value: 'Next.js 14 + Tailwind + Framer Motion' },
                { label: 'Backend', value: 'Express + TypeScript + Node.js' },
                { label: 'Blockchain', value: 'Anchor (Rust) + @solana/web3.js' },
                { label: 'AI', value: 'Groq + Claude + GPT fallback chain' },
              ].map((t) => (
                <div key={t.label}>
                  <div className="text-[10px] text-cyber-text-dim uppercase tracking-wider">{t.label}</div>
                  <div className="text-cyber-text">{t.value}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* The 11 Agents */}
        <section id="the-11-agents" className="py-12 border-b border-cyber-border">
          <h2 className="text-2xl font-bold text-cyber-green mb-2">The 11 Agents</h2>
          <p className="text-cyber-text-dim mb-8">Each agent is autonomous, isolated, and connected through the P2P event bus.</p>
          <div className="grid md:grid-cols-2 gap-4">
            {agents.map((agent) => (
              <div key={agent.name} className="bg-cyber-card border border-cyber-border rounded p-5 hover:border-opacity-50 transition-colors" style={{ borderColor: `${agent.color}20` }}>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: agent.color }} />
                    <h3 className="font-bold text-sm" style={{ color: agent.color }}>{agent.name}</h3>
                  </div>
                  <span className="text-[10px] px-2 py-0.5 rounded border border-cyber-border text-cyber-text-dim">{agent.role}</span>
                </div>
                <p className="text-xs text-cyber-text-dim mb-3 leading-relaxed">{agent.desc}</p>
                <code className="text-[11px] text-cyber-green bg-cyber-darker px-2 py-1 rounded">{agent.endpoint}</code>
              </div>
            ))}
          </div>
        </section>

        {/* API Reference */}
        <section id="api-reference" className="py-12 border-b border-cyber-border">
          <h2 className="text-2xl font-bold text-cyber-green mb-2">API Reference</h2>
          <p className="text-cyber-text-dim mb-4">
            Base URL: <code className="text-cyber-green bg-cyber-darker px-2 py-0.5 rounded text-sm">{API_BASE}</code>
          </p>
          <p className="text-cyber-text-dim mb-8 text-sm">No API key required for read operations. All endpoints return JSON.</p>

          <div className="space-y-8">
            {endpoints.map((cat) => (
              <div key={cat.category}>
                <h3 className="text-sm font-bold mb-3 flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: cat.color }} />
                  <span style={{ color: cat.color }}>{cat.category}</span>
                </h3>
                <div className="bg-cyber-card border border-cyber-border rounded overflow-hidden">
                  {cat.items.map((ep, i) => (
                    <div key={ep.path} className={`flex items-start gap-3 px-4 py-3 ${i > 0 ? 'border-t border-cyber-border' : ''}`}>
                      <div className="pt-0.5 flex-shrink-0">
                        <MethodBadge method={ep.method} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <code className="text-sm text-cyber-text break-all">{ep.path}</code>
                        <p className="text-xs text-cyber-text-dim mt-0.5">{ep.desc}</p>
                      </div>
                      {ep.auth && (
                        <span className="flex-shrink-0 px-1.5 py-0.5 text-[9px] bg-amber-500/10 text-amber-400 border border-amber-500/20 rounded">AUTH</span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Rate Limits */}
        <section id="rate-limits" className="py-12 border-b border-cyber-border">
          <h2 className="text-2xl font-bold text-cyber-green mb-6">Rate Limits</h2>
          <div className="grid md:grid-cols-4 gap-4">
            {[
              { tier: 'Global', limit: '200 req/min', scope: 'All read endpoints', color: '#00ff88' },
              { tier: 'AI', limit: '20 req/min', scope: '/api/ai/* endpoints', color: '#ffcc00' },
              { tier: 'Swap', limit: '10 req/min', scope: 'Swap execute & evacuate', color: '#00d4ff' },
              { tier: 'Mutation', limit: '5 req/min', scope: 'Authenticated writes', color: '#ff3366' },
            ].map((r) => (
              <div key={r.tier} className="bg-cyber-card border border-cyber-border rounded p-4">
                <div className="text-[10px] uppercase tracking-wider mb-1" style={{ color: r.color }}>{r.tier}</div>
                <div className="text-lg font-bold text-cyber-text">{r.limit}</div>
                <div className="text-xs text-cyber-text-dim mt-1">{r.scope}</div>
              </div>
            ))}
          </div>
          <div className="mt-6 bg-cyber-darker border border-cyber-border rounded p-4">
            <h3 className="text-sm font-bold text-cyber-text-dim mb-2">Authentication</h3>
            <p className="text-sm text-cyber-text-dim mb-2">Most read endpoints are public. Mutation endpoints require one of:</p>
            <div className="space-y-1">
              <code className="block text-xs text-cyber-green">Authorization: Bearer &lt;API_SECRET&gt;</code>
              <code className="block text-xs text-cyber-green">x-api-key: &lt;API_SECRET&gt;</code>
            </div>
          </div>
        </section>

        {/* On-Chain Program */}
        <section id="on-chain-program" className="py-12 border-b border-cyber-border">
          <h2 className="text-2xl font-bold text-cyber-green mb-2">On-Chain Program</h2>
          <p className="text-cyber-text-dim mb-6">Anchor-based threat registry deployed on Solana.</p>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-sm font-bold text-cyber-blue mb-3">Instructions (6)</h3>
              <div className="bg-cyber-card border border-cyber-border rounded overflow-hidden">
                {[
                  { name: 'initialize', desc: 'Boot the threat registry' },
                  { name: 'report_threat', desc: 'Submit threat with evidence hash' },
                  { name: 'confirm_threat', desc: 'Multi-agent consensus (2+ required)' },
                  { name: 'blacklist_attacker', desc: 'Record malicious address + damage estimate' },
                  { name: 'is_blacklisted', desc: 'Query blacklist status' },
                  { name: 'record_protection', desc: 'Log successful defense on-chain' },
                ].map((inst, i) => (
                  <div key={inst.name} className={`px-4 py-2.5 ${i > 0 ? 'border-t border-cyber-border' : ''}`}>
                    <code className="text-sm text-cyber-green">{inst.name}</code>
                    <p className="text-xs text-cyber-text-dim mt-0.5">{inst.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-sm font-bold text-cyber-blue mb-3">Threat Types (12)</h3>
              <div className="bg-cyber-card border border-cyber-border rounded p-4">
                <div className="flex flex-wrap gap-2">
                  {threatTypes.map((t) => (
                    <span key={t} className="px-2 py-1 text-xs bg-cyber-darker border border-cyber-border rounded text-cyber-text-dim">
                      {t}
                    </span>
                  ))}
                </div>
              </div>

              <h3 className="text-sm font-bold text-cyber-blue mb-3 mt-6">Features</h3>
              <div className="bg-cyber-card border border-cyber-border rounded p-4">
                <ul className="space-y-2 text-sm text-cyber-text-dim">
                  <li className="flex items-start gap-2"><span className="text-cyber-green text-xs mt-0.5">&#9656;</span>Multi-agent consensus prevents false positives</li>
                  <li className="flex items-start gap-2"><span className="text-cyber-green text-xs mt-0.5">&#9656;</span>Attacker blacklist with damage estimates</li>
                  <li className="flex items-start gap-2"><span className="text-cyber-green text-xs mt-0.5">&#9656;</span>State-sponsored activity flagging</li>
                  <li className="flex items-start gap-2"><span className="text-cyber-green text-xs mt-0.5">&#9656;</span>Permanent, verifiable, public records</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Solana Protocols */}
        <section id="solana-protocols" className="py-12 border-b border-cyber-border">
          <h2 className="text-2xl font-bold text-cyber-green mb-6">7 Solana Protocols</h2>
          <div className="grid md:grid-cols-2 gap-3">
            {protocols.map((p) => (
              <div key={p.name} className="flex items-center gap-4 bg-cyber-card border border-cyber-border rounded px-4 py-3">
                <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: p.color }} />
                <div>
                  <div className="text-sm font-semibold" style={{ color: p.color }}>{p.name}</div>
                  <div className="text-xs text-cyber-text-dim">{p.use}</div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Integration Examples */}
        <section id="integration-examples" className="py-12 border-b border-cyber-border">
          <h2 className="text-2xl font-bold text-cyber-green mb-6">Integration Examples</h2>

          <div className="space-y-6">
            {/* cURL */}
            <div>
              <h3 className="text-sm font-bold text-cyber-blue mb-3">cURL</h3>
              <div className="bg-cyber-darker border border-cyber-border rounded p-4 overflow-x-auto">
                <pre className="text-xs text-cyber-green whitespace-pre">{`# Scan a token
curl ${API_BASE}/api/scan/EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v

# Check threats
curl ${API_BASE}/api/threats

# Get swap quote with risk analysis
curl -X POST ${API_BASE}/api/swap/quote \\
  -H "Content-Type: application/json" \\
  -d '{"inputMint":"So11111111111111111111111111111111111111112","outputMint":"EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v","amount":1000000000}'

# Chat with AI
curl -X POST ${API_BASE}/api/ai/chat \\
  -H "Content-Type: application/json" \\
  -d '{"message":"What are the current threats on Solana?"}'

# Check Lazarus patterns
curl ${API_BASE}/api/lazarus/analyze/SUSPECT_ADDRESS

# Network health
curl ${API_BASE}/api/network/health`}</pre>
              </div>
            </div>

            {/* Python */}
            <div>
              <h3 className="text-sm font-bold text-cyber-blue mb-3">Python</h3>
              <div className="bg-cyber-darker border border-cyber-border rounded p-4 overflow-x-auto">
                <pre className="text-xs text-cyber-green whitespace-pre">{`import requests

BASE = "${API_BASE}"

# Scan token for risk
risk = requests.get(f"{BASE}/api/scan/TOKEN_ADDRESS").json()
print(f"Risk: {risk['riskScore']}/100 — {risk['threatLevel']}")

# Check if address is blacklisted
threats = requests.get(f"{BASE}/api/threats/ADDRESS").json()
print(f"Blacklisted: {threats['isBlacklisted']}")

# Get risk-aware swap quote
quote = requests.post(f"{BASE}/api/swap/quote", json={
    "inputMint": "So11111111111111111111111111111111111111112",
    "outputMint": "TOKEN_ADDRESS",
    "amount": 1000000000
}).json()
print(f"Safe to swap: {quote['safeToSwap']}")

# Predict rug pull
prediction = requests.get(f"{BASE}/api/predict/TOKEN_ADDRESS").json()

# Market sentiment
sentiment = requests.get(f"{BASE}/api/sentiment").json()`}</pre>
              </div>
            </div>

            {/* JavaScript */}
            <div>
              <h3 className="text-sm font-bold text-cyber-blue mb-3">JavaScript / TypeScript</h3>
              <div className="bg-cyber-darker border border-cyber-border rounded p-4 overflow-x-auto">
                <pre className="text-xs text-cyber-green whitespace-pre">{`const BASE = "${API_BASE}";

// Scan token
const risk = await fetch(\`\${BASE}/api/scan/TOKEN_ADDRESS\`).then(r => r.json());
console.log(\`Risk: \${risk.riskScore}/100\`);

// Chat with swarm AI
const chat = await fetch(\`\${BASE}/api/ai/chat\`, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ message: "Analyze current Solana threats" })
}).then(r => r.json());
console.log(chat.response);

// Risk-aware swap quote
const quote = await fetch(\`\${BASE}/api/swap/quote\`, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    inputMint: "So11111111111111111111111111111111111111112",
    outputMint: "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
    amount: 1000000000
  })
}).then(r => r.json());
console.log(\`Safe: \${quote.safeToSwap}\`);`}</pre>
              </div>
            </div>

            {/* Pre-Swap Workflow */}
            <div>
              <h3 className="text-sm font-bold text-cyber-blue mb-3">Pre-Swap Safety Workflow</h3>
              <div className="bg-cyber-card border border-cyber-border rounded p-5">
                <div className="space-y-3">
                  {[
                    { step: '1', label: 'Scan token', endpoint: 'GET /api/scan/:tokenAddress', desc: 'Get risk score and threat breakdown' },
                    { step: '2', label: 'Check registry', endpoint: 'GET /api/threats/:address', desc: 'Verify against known threats and blacklist' },
                    { step: '3', label: 'Predict rug', endpoint: 'GET /api/predict/:tokenAddress', desc: 'Check rug pull probability' },
                    { step: '4', label: 'Check Lazarus', endpoint: 'GET /api/lazarus/analyze/:deployer', desc: 'Screen for state-sponsored patterns' },
                    { step: '5', label: 'Get quote', endpoint: 'POST /api/swap/quote', desc: 'Risk-aware quote with safeToSwap flag' },
                  ].map((s) => (
                    <div key={s.step} className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-full bg-cyber-green/10 border border-cyber-green/30 flex items-center justify-center flex-shrink-0">
                        <span className="text-[10px] font-bold text-cyber-green">{s.step}</span>
                      </div>
                      <div>
                        <div className="text-sm text-cyber-text">{s.label} <code className="text-xs text-cyber-text-dim ml-2">{s.endpoint}</code></div>
                        <div className="text-xs text-cyber-text-dim">{s.desc}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Links */}
        <section id="links" className="py-12">
          <h2 className="text-2xl font-bold text-cyber-green mb-6">Links</h2>
          <div className="grid md:grid-cols-3 gap-4">
            {[
              { label: 'Live Dashboard', url: 'https://rektshield.fun', desc: '8-tab cyberpunk dashboard' },
              { label: 'API Base', url: API_BASE, desc: '33+ REST endpoints' },
              { label: 'GitHub', url: 'https://github.com/YouthAIAgent/rekt-shield', desc: 'Full open source code' },
              { label: 'Skill File', url: 'https://raw.githubusercontent.com/YouthAIAgent/rekt-shield/main/skill.md', desc: 'Agent integration spec' },
              { label: 'Twitter', url: 'https://x.com/Web3__Youth', desc: 'Updates and deep dives' },
              { label: 'Vote', url: 'https://colosseum.com/agent-hackathon/projects/rekt-shield', desc: 'Colosseum hackathon' },
            ].map((link) => (
              <a key={link.label} href={link.url} target="_blank" rel="noopener" className="bg-cyber-card border border-cyber-border rounded p-4 hover:border-cyber-green/30 hover:shadow-glow-green transition-all group">
                <div className="text-sm font-semibold text-cyber-text group-hover:text-cyber-green transition-colors">{link.label}</div>
                <div className="text-xs text-cyber-text-dim mt-1">{link.desc}</div>
                <div className="text-[10px] text-cyber-text-dim mt-2 truncate">{link.url}</div>
              </a>
            ))}
          </div>
        </section>

        {/* Footer */}
        <footer className="py-8 border-t border-cyber-border text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <div className="w-1.5 h-1.5 rounded-full bg-cyber-green animate-pulse-glow" />
            <span className="text-sm text-cyber-green font-bold tracking-wider">REKT PROTECT v0.1</span>
          </div>
          <p className="text-xs text-cyber-text-dim">
            11 Agents. Zero Human Intervention. Digital Immune System for Solana.
          </p>
          <p className="text-xs text-cyber-text-dim mt-1">
            Built by Youth for the Colosseum Agent Hackathon 2026
          </p>
        </footer>
      </div>
    </div>
  );
}
