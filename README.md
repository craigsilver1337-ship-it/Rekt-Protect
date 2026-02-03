# REKT SHIELD v2.0

### Self-Healing Digital Immune System for Solana

> 11 Autonomous AI Agents working as a coordinated swarm to detect threats, predict rug pulls, defend wallets, track state-sponsored hackers, and self-heal — all without human intervention.

Built for **Colosseum Agent Hackathon 2026**

---

## The Problem

Solana DeFi users lose **billions** to rug pulls, drainer attacks, honeypot tokens, sandwich attacks, and state-sponsored hackers. There is no autonomous, real-time defense system — users only find out **after** they get rekt.

## The Solution

REKT Shield is a **digital immune system** — modeled after the human body's immune response. 11 specialized AI agents operate as an autonomous swarm, continuously scanning, detecting, defending, and learning — just like white blood cells, antibodies, and the nervous system protect a living organism.

---

## Architecture

```
                         ┌─────────────────────────────────────────┐
                         │          REKT SHIELD DASHBOARD          │
                         │         Next.js (port 3001)             │
                         │                                         │
                         │  ┌───────┬───────┬───────┬───────────┐  │
                         │  │Dashboard│Scanner│Wallets│Threat Intel│ │
                         │  ├───────┼───────┼───────┼───────────┤  │
                         │  │Network│AI Chat│Healer │           │  │
                         │  └───────┴───────┴───────┴───────────┘  │
                         └──────────────────┬──────────────────────┘
                                            │ HTTP/REST
                                            ▼
                         ┌─────────────────────────────────────────┐
                         │          EXPRESS API SERVER              │
                         │         (port 3000) — 33+ endpoints     │
                         └──────────────────┬──────────────────────┘
                                            │
                    ┌───────────────────────┼───────────────────────┐
                    │                       │                       │
                    ▼                       ▼                       ▼
        ┌──────────────────┐   ┌──────────────────┐   ┌──────────────────┐
        │   DETECTION TIER │   │   DEFENSE TIER   │   │ INTELLIGENCE TIER│
        │                  │   │                  │   │                  │
        │  ┌────────────┐  │   │  ┌────────────┐  │   │  ┌────────────┐  │
        │  │  SCANNER   │  │   │  │  GUARDIAN   │  │   │  │   INTEL    │  │
        │  │  (T-Cell)  │  │   │  │(Killer Cell)│  │   │  │(Immune Mem)│  │
        │  └────────────┘  │   │  └────────────┘  │   │  └────────────┘  │
        │  ┌────────────┐  │   │  ┌────────────┐  │   │  ┌────────────┐  │
        │  │  SENTINEL  │  │   │  │  HONEYPOT  │  │   │  │  LAZARUS   │  │
        │  │  (Patrol)  │  │   │  │(Active Trap)│  │   │  │ (State-Act)│  │
        │  └────────────┘  │   │  └────────────┘  │   │  └────────────┘  │
        │  ┌────────────┐  │   │                  │   │  ┌────────────┐  │
        │  │  NETWORK   │  │   │                  │   │  │  PROPHET   │  │
        │  │(Infra Mon) │  │   │                  │   │  │(Predictive)│  │
        │  └────────────┘  │   │                  │   │  └────────────┘  │
        └──────────────────┘   └──────────────────┘   └──────────────────┘
                    │                       │                       │
                    └───────────────────────┼───────────────────────┘
                                            │
                              ┌─────────────▼──────────────┐
                              │     SWARM EVENT BUS        │
                              │   (EventEmitter3 — P2P)    │
                              └─────────────┬──────────────┘
                                            │
              ┌─────────────────────────────┼─────────────────────────────┐
              │                             │                             │
              ▼                             ▼                             ▼
  ┌──────────────────┐        ┌──────────────────┐        ┌──────────────────┐
  │     HEALER       │        │    REPORTER       │        │    QUANTUM       │
  │ (Self-Healing    │        │  (Community       │        │   (Post-Quantum  │
  │  Autonomous      │        │   Voice)          │        │    Defense)      │
  │  Brain)          │        │                   │        │                  │
  │                  │        │  - Proof of       │        │  - Harvest Risk  │
  │  - Circuit       │        │    Protection     │        │    Assessment    │
  │    Breaker       │        │    NFTs           │        │  - Migration     │
  │  - Auto Restart  │        │  - Incident       │        │    Planning      │
  │  - 6-Phase IR    │        │    Reports        │        │  - Key Exposure  │
  │  - AI Decisions  │        │                   │        │    Tracking      │
  └──────────────────┘        └──────────────────┘        └──────────────────┘
              │
              ▼
  ┌──────────────────┐
  │  CLAUDE AI       │
  │  (Intelligence   │
  │   Engine)        │
  │                  │
  │  - Threat        │
  │    Classification│
  │  - Chat          │
  │  - Autonomous    │
  │    Decisions     │
  │  - Risk Analysis │
  └──────────────────┘
```

### Immune System Analogy

| Agent | Biological Equivalent | Function |
|-------|----------------------|----------|
| Scanner | T-Cell | Identifies threats on first contact |
| Sentinel | Patrol Cell | Continuously monitors for anomalies |
| Guardian | Killer Cell | Executes emergency defense actions |
| Intel | Immune Memory | Remembers and catalogs known threats |
| Reporter | Voice | Communicates threats to the community |
| Quantum | Future-Proof | Prepares for next-gen threats |
| Lazarus | Counter-Intel | Tracks state-sponsored attackers |
| Honeypot | Active Trap | Lures and catches attackers |
| Prophet | Predictive Brain | Predicts threats before they happen |
| Network | Infrastructure Shield | Monitors the network itself |
| Healer | Autonomous Brain | Self-heals the entire immune system |

---

## Agent Swarm — 11 Agents

### Detection Tier
- **Scanner** — Real-time token risk analysis. Checks liquidity, dev wallets, permissions, holder concentration. Generates risk scores 0-100.
- **Sentinel** — Continuous wallet monitoring. Watches for suspicious transactions, drainer approvals, and unauthorized transfers.
- **Network** — Solana infrastructure health. TPS, block time, congestion, DDoS detection, MEV/sandwich attack monitoring.

### Defense Tier
- **Guardian** — Emergency defense execution. Auto-swaps compromised tokens, revokes approvals, transfers assets to safety wallets.
- **Honeypot** — Active defense. Deploys bait wallets to lure and identify attackers, captures their tools and methods.

### Intelligence Tier
- **Intel** — Threat registry and blacklist management. Maintains on-chain database of known scammers, drainers, and malicious contracts.
- **Lazarus** — State-sponsored threat actor tracking. Monitors Lazarus Group (DPRK) patterns: chain hopping, mixer usage, UTC+9 activity, peel chains.
- **Prophet** — AI-powered predictions. Rug pull probability, whale movement detection, market sentiment analysis. Trained on 361,000+ Raydium pool patterns.

### Support Tier
- **Reporter** — Proof of Protection NFTs. Documents every defense action as an on-chain NFT receipt.
- **Quantum** — Post-quantum cryptography readiness. Assesses wallet exposure to harvest-now-decrypt-later attacks, plans migration to quantum-resistant keys.
- **Healer** — Self-healing autonomous brain. Circuit breakers, auto-restarts, 6-phase incident response (Detect → Classify → Contain → Eradicate → Recover → Learn).

---

## Tech Stack

### Backend
- **TypeScript** + **Node.js**
- **Express** — REST API (33+ endpoints)
- **Solana web3.js** — On-chain interaction
- **Anthropic Claude** — AI intelligence engine
- **EventEmitter3** — Inter-agent communication bus
- **Winston** — Structured logging

### Frontend
- **Next.js 14** — React framework (App Router)
- **Tailwind CSS** — Cyberpunk theme (deep black, neon green, cyber blue)
- **SWR** — Data fetching with auto-polling (pseudo real-time)
- **Framer Motion** — Animations
- **Lucide React** — Icons
- **JetBrains Mono** — Monospace hacker font

### Infrastructure
- Solana Mainnet-Beta / Devnet
- Helius RPC (enhanced Solana APIs)
- Jupiter Aggregator (emergency swaps)
- Metaplex (Proof of Protection NFTs)

---

## Dashboard — 7 Tabs

| Tab | Purpose |
|-----|---------|
| **Dashboard** | Agent grid, stats, live event feed, market sentiment, critical alerts |
| **Token Scanner** | Paste any token address → risk score, threats, permissions, rug prediction |
| **Wallets** | Add wallets to monitor, auto-defend toggle, alert history |
| **Threat Intel** | Threat registry, blacklist, Lazarus Group tracking panel |
| **Network** | TPS, block time, congestion, DDoS status, MEV activity |
| **AI Chat** | Terminal-style chat with the swarm AI (powered by Claude) |
| **Healer** | Agent health table, incident log, heal actions, autonomous mode toggle |

---

## API Endpoints (33+)

```
GET  /api/health                  Health check
GET  /api/status                  Full swarm status

GET  /api/scan/:tokenAddress      Scan token for risks
POST /api/monitor/wallet          Add wallet to monitoring
GET  /api/monitor/wallets         List monitored wallets
GET  /api/alerts                  Get alerts

GET  /api/defense/log             Defense execution log
GET  /api/threats                 Threat registry + blacklist
GET  /api/threats/:address        Lookup specific threat

GET  /api/quantum/assess/:wallet  Quantum readiness assessment
GET  /api/quantum/timeline        Quantum threat timeline
GET  /api/quantum/threat-level    Current quantum threat level

GET  /api/lazarus/analyze/:addr   Analyze address for state-actor patterns
GET  /api/lazarus/alerts          Lazarus group alerts

POST /api/honeypot/deploy         Deploy honeypot trap
GET  /api/honeypot/deployments    Active honeypot deployments

GET  /api/predict/:tokenAddress   Rug pull prediction
GET  /api/predict/whales/:token   Whale movement detection
GET  /api/sentiment               Market sentiment

GET  /api/network/health          Network health report
GET  /api/network/stats           Network statistics
GET  /api/events                  Swarm events (last 100)
GET  /api/events/critical         Critical events only

POST /api/ai/analyze-token        AI token risk analysis
POST /api/ai/audit-contract       AI smart contract audit
POST /api/ai/chat                 AI chatbot
POST /api/ai/threat-report        AI threat report
POST /api/ai/market-risk          AI market risk prediction
GET  /api/ai/status               AI engine status

GET  /api/healer/status           Healer status
GET  /api/healer/incidents        Incident log
GET  /api/healer/actions          Heal actions log
POST /api/healer/decide           AI autonomous decision
POST /api/healer/autonomous-mode  Toggle autonomous mode
```

---

## Quick Start

### Prerequisites
- Node.js 18+
- npm or yarn

### 1. Install & Start Backend
```bash
cd rekt-shield
npm install
npm run dev
# Backend starts on http://localhost:3000
```

### 2. Install & Start Dashboard
```bash
cd dashboard
npm install
npm run dev
# Dashboard starts on http://localhost:3001
```

### 3. Open Dashboard
Navigate to **http://localhost:3001** in your browser.

### Environment Variables (optional)
Create a `.env` file in the project root:
```env
ANTHROPIC_API_KEY=sk-ant-...      # Claude AI (enables AI chat & autonomous decisions)
SOLANA_RPC_URL=https://...         # Custom Solana RPC (default: mainnet-beta)
HELIUS_API_KEY=...                 # Helius enhanced APIs
```

---

## Self-Healing Architecture

The Healer agent implements a production-grade self-healing system:

```
  Threat Detected
        │
        ▼
  ┌──────────┐    ┌──────────┐    ┌──────────┐
  │  DETECT   │───▶│ CLASSIFY │───▶│ CONTAIN  │
  │           │    │          │    │          │
  │ Event     │    │ AI/Rules │    │ Isolate  │
  │ Capture   │    │ Severity │    │ Threat   │
  └──────────┘    └──────────┘    └──────────┘
                                        │
                                        ▼
  ┌──────────┐    ┌──────────┐    ┌──────────┐
  │  LEARN   │◀───│ RECOVER  │◀───│ERADICATE │
  │          │    │          │    │          │
  │ Update   │    │ Restart  │    │ Execute  │
  │ Patterns │    │ Agents   │    │ Defense  │
  └──────────┘    └──────────┘    └──────────┘
```

**Circuit Breaker Pattern:**
- 3 consecutive failures → circuit opens → agent paused
- 60-second cooldown → automatic restart attempt
- Prevents cascading failures across the swarm

---

## Key Differentiators

1. **11-Agent Autonomous Swarm** — Not a single bot. A coordinated multi-agent system with inter-agent communication.
2. **Self-Healing** — The system fixes itself. No human intervention required.
3. **Lazarus Group Tracking** — First Solana tool to track state-sponsored (DPRK) threat actors on-chain.
4. **Post-Quantum Defense** — Prepares wallets for the quantum computing era with harvest risk assessment.
5. **Full-Stack Product** — Backend + Frontend + AI + Real Solana integration. Production-ready architecture.
6. **Biological Design** — Modeled after the human immune system. Each agent maps to a biological defense mechanism.

---

## Project Structure

```
rekt-shield/
├── src/
│   ├── index.ts                 # Entry point — boots swarm + API
│   ├── core/
│   │   ├── types.ts             # All TypeScript interfaces
│   │   └── swarm.ts             # Swarm orchestrator
│   ├── api/
│   │   └── server.ts            # Express API (33+ endpoints)
│   ├── agents/
│   │   ├── scanner/             # Token risk analysis
│   │   ├── sentinel/            # Wallet monitoring
│   │   ├── guardian/            # Defense execution
│   │   ├── intel/               # Threat intelligence
│   │   ├── reporter/            # Proof of Protection
│   │   ├── quantum/             # Post-quantum defense
│   │   ├── lazarus/             # State-actor tracking
│   │   ├── honeypot/            # Active defense traps
│   │   ├── prophet/             # AI predictions
│   │   ├── network/             # Network monitoring
│   │   └── healer/              # Self-healing brain
│   └── utils/
│       ├── ai-engine.ts         # Claude AI integration
│       └── logger.ts            # Winston logger
├── dashboard/
│   ├── app/                     # Next.js App Router
│   ├── components/
│   │   ├── layout/              # Shell, Sidebar, Header
│   │   ├── tabs/                # 7 tab components
│   │   ├── dashboard/           # AgentGrid, StatsRow, EventFeed
│   │   ├── scanner/             # RiskGauge, ThreatList
│   │   ├── wallets/             # WalletTable, AlertList
│   │   ├── threats/             # ThreatRegistry, LazarusPanel
│   │   ├── network/             # NetworkStats, MEVPanel
│   │   ├── chat/                # ChatWindow, ChatInput
│   │   ├── healer/              # AgentHealth, IncidentLog
│   │   └── shared/              # GlowCard, ThreatBadge, CyberButton
│   ├── hooks/                   # SWR data fetching hooks
│   └── lib/                     # Types, API, constants, formatters
└── package.json
```

---

## License

MIT

---

**Built by Youth** — Colosseum Agent Hackathon 2026
