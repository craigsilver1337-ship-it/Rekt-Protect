# REKT Shield — Digital Immune System for Solana

## Overview

REKT Shield is an 11-agent autonomous security swarm for Solana. It detects threats, predicts rug pulls, defends wallets, tracks state-sponsored hackers, and self-heals without human intervention. Modeled after the human immune system.

**Base URL:** `https://web-production-c5ac4.up.railway.app`
**Dashboard:** `https://rektshield.fun`
**GitHub:** `https://github.com/YouthAIAgent/rekt-shield`

## Quick Start

Scan any token before you swap:

```bash
curl https://web-production-c5ac4.up.railway.app/api/scan/So11111111111111111111111111111111111111112
```

No API key required for read operations.

## Agents

| Agent | Role | Endpoint Prefix |
|-------|------|-----------------|
| Scanner | Token risk scoring (0-100) with AI analysis | `/api/scan` |
| Sentinel | 24/7 wallet monitoring via Helius RPC | `/api/monitor` |
| Guardian | Emergency defense: swaps, revocations, transfers | `/api/defense` |
| Intel | On-chain threat registry (Anchor program) | `/api/threats` |
| Reporter | Protection Proof NFTs via Metaplex | — |
| Quantum Shield | Post-quantum readiness assessment | `/api/quantum` |
| Lazarus Tracker | DPRK/Lazarus Group pattern detection | `/api/lazarus` |
| Honeypot | Bait wallet deployment and attacker profiling | `/api/honeypot` |
| Prophet | Rug pull prediction (361K+ pool patterns) | `/api/predict` |
| Network Guardian | Solana infra health, MEV, DDoS monitoring | `/api/network` |
| Healer | Self-healing with 6-phase incident response | `/api/healer` |

## Authentication

Most read endpoints require no authentication. Mutation endpoints require one of:

- **Bearer Token:** `Authorization: Bearer <API_SECRET>`
- **API Key:** `x-api-key: <API_SECRET>`

## Rate Limits

| Tier | Limit | Applies To |
|------|-------|------------|
| Global | 200 req/min | All read endpoints |
| AI | 20 req/min | `/api/ai/*`, `/api/healer/decide` |
| Swap | 10 req/min | Swap execution, emergency evacuate |
| Mutation | 5 req/min | Authenticated write operations |

---

## Endpoints

### Health & Status

#### `GET /api/health`

System health check with all agent statuses.

```bash
curl https://web-production-c5ac4.up.railway.app/api/health
```

Response:
```json
{
  "status": "operational",
  "name": "REKT Shield",
  "version": "2.0.0",
  "agents": { "total": 11, "active": 11, "status": "all_healthy" },
  "ai": { "available": true, "provider": "groq" },
  "selfHealing": { "enabled": true, "healActions": 204 }
}
```

#### `GET /api/status`

Full swarm status with per-agent details.

```bash
curl https://web-production-c5ac4.up.railway.app/api/status
```

---

### Scanner — Token Risk Analysis

#### `GET /api/scan/:tokenAddress`

Scan any Solana token for risk. Returns a score from 0 (safe) to 100 (dangerous) with detailed threat breakdown.

**Parameters:**
- `tokenAddress` (path) — Solana token mint address

```bash
curl https://web-production-c5ac4.up.railway.app/api/scan/EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v
```

Response:
```json
{
  "tokenAddress": "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
  "riskScore": 15,
  "threatLevel": "LOW",
  "threats": [],
  "details": {
    "mintAuthority": "renounced",
    "freezeAuthority": "none",
    "lpLocked": true,
    "topHolderConcentration": 0.12
  }
}
```

**Use case:** Call this before any swap to check if the output token is safe. Trading bots, DEX aggregators, and yield optimizers should integrate this as a pre-trade check.

---

### Sentinel — Wallet Monitoring

#### `POST /api/monitor/wallet`

Add a wallet to 24/7 monitoring. Sentinel watches for suspicious transactions, drainer interactions, and unusual approvals via Helius enhanced RPC.

**Auth required.**

**Body:**
```json
{
  "walletAddress": "YOUR_WALLET_ADDRESS",
  "alertThreshold": 70,
  "autoDefend": false,
  "safetyWallet": "OPTIONAL_SAFE_WALLET",
  "maxSlippage": 1
}
```

```bash
curl -X POST https://web-production-c5ac4.up.railway.app/api/monitor/wallet \
  -H "Content-Type: application/json" \
  -d '{"walletAddress": "YOUR_WALLET_ADDRESS"}'
```

#### `GET /api/monitor/wallets`

List all monitored wallets.

```bash
curl https://web-production-c5ac4.up.railway.app/api/monitor/wallets
```

#### `GET /api/alerts`

Get security alerts. Optionally filter by wallet.

**Query params:**
- `wallet` (optional) — Filter alerts for a specific wallet address

```bash
curl https://web-production-c5ac4.up.railway.app/api/alerts
curl https://web-production-c5ac4.up.railway.app/api/alerts?wallet=YOUR_WALLET
```

---

### Guardian — Defense Log

#### `GET /api/defense/log`

Get the defense action log showing all autonomous defense actions taken by Guardian, including emergency swaps, approval revocations, and asset transfers.

```bash
curl https://web-production-c5ac4.up.railway.app/api/defense/log
```

Response:
```json
{
  "log": [],
  "totalSaved": 0,
  "proofs": []
}
```

---

### Intel — Threat Registry

#### `GET /api/threats`

Get all known threats, blacklisted addresses, antibody rules, and statistics from the on-chain threat registry.

```bash
curl https://web-production-c5ac4.up.railway.app/api/threats
```

Response:
```json
{
  "threats": [],
  "blacklist": [],
  "antibodies": [],
  "stats": {
    "totalThreats": 0,
    "confirmedThreats": 0,
    "blacklistedAddresses": 0
  }
}
```

#### `GET /api/threats/:address`

Check if a specific address is a known threat or blacklisted attacker.

**Parameters:**
- `address` (path) — Solana address to check

```bash
curl https://web-production-c5ac4.up.railway.app/api/threats/SUSPECT_ADDRESS
```

Response:
```json
{
  "threat": null,
  "attacker": null,
  "isBlacklisted": false
}
```

**Use case:** Cross-reference any wallet or contract address against the REKT Shield threat database before interacting with it.

---

### Quantum Shield — Post-Quantum Assessment

#### `GET /api/quantum/assess/:walletAddress`

Assess a wallet's vulnerability to quantum computing attacks.

**Parameters:**
- `walletAddress` (path) — Solana wallet address

```bash
curl https://web-production-c5ac4.up.railway.app/api/quantum/assess/YOUR_WALLET
```

#### `GET /api/quantum/timeline`

Get the current quantum threat timeline assessment.

```bash
curl https://web-production-c5ac4.up.railway.app/api/quantum/timeline
```

#### `GET /api/quantum/threat-level`

Get the current global quantum threat level.

```bash
curl https://web-production-c5ac4.up.railway.app/api/quantum/threat-level
```

---

### Lazarus Tracker — State-Actor Detection

#### `GET /api/lazarus/analyze/:address`

Analyze any address for DPRK/Lazarus Group patterns. Cross-references against known attack patterns, OFAC sanctions lists, and FBI advisories.

**Parameters:**
- `address` (path) — Solana address to analyze

```bash
curl https://web-production-c5ac4.up.railway.app/api/lazarus/analyze/SUSPECT_ADDRESS
```

Response:
```json
{
  "alert": null,
  "isStateSponsoredThreat": false
}
```

#### `GET /api/lazarus/alerts`

Get all Lazarus Group related alerts and statistics.

```bash
curl https://web-production-c5ac4.up.railway.app/api/lazarus/alerts
```

**Use case:** Run any address through this before large transactions. Detects wallet clusters tied to state-sponsored actors.

---

### Honeypot — Active Defense

#### `POST /api/honeypot/deploy`

Deploy a bait wallet with trackable tokens to attract and profile attackers.

**Auth required.**

**Body:**
```json
{
  "baitAmount": 0.1,
  "baitToken": "SOL"
}
```

```bash
curl -X POST https://web-production-c5ac4.up.railway.app/api/honeypot/deploy \
  -H "Content-Type: application/json" \
  -d '{"baitAmount": 0.1}'
```

#### `GET /api/honeypot/deployments`

List all honeypot deployments, captured attacker profiles, and statistics.

```bash
curl https://web-production-c5ac4.up.railway.app/api/honeypot/deployments
```

---

### Prophet — Predictions

#### `GET /api/predict/:tokenAddress`

Predict rug pull probability for a token. Trained on 361,000+ Raydium pool patterns.

**Parameters:**
- `tokenAddress` (path) — Solana token mint address

```bash
curl https://web-production-c5ac4.up.railway.app/api/predict/TOKEN_ADDRESS
```

#### `GET /api/predict/whales/:tokenAddress`

Get whale movement alerts for a specific token.

**Parameters:**
- `tokenAddress` (path) — Solana token mint address

```bash
curl https://web-production-c5ac4.up.railway.app/api/predict/whales/TOKEN_ADDRESS
```

#### `GET /api/sentiment`

Get current market sentiment analysis powered by Pyth oracles.

```bash
curl https://web-production-c5ac4.up.railway.app/api/sentiment
```

**Use case:** Check rug pull probability before buying any token. Combine with `/api/scan` for comprehensive risk assessment.

---

### Network Guardian — Solana Health

#### `GET /api/network/health`

Real-time Solana network health: TPS, block times, DDoS indicators, congestion status.

```bash
curl https://web-production-c5ac4.up.railway.app/api/network/health
```

#### `GET /api/network/stats`

Detailed network statistics including MEV activity, sandwich attack detection, and program upgrade monitoring.

```bash
curl https://web-production-c5ac4.up.railway.app/api/network/stats
```

**Use case:** Check network health before executing large transactions. If the network is congested or under attack, adjust your strategy.

---

### Swarm Events

#### `GET /api/events`

Get recent cross-agent events (max 100) with swarm statistics.

```bash
curl https://web-production-c5ac4.up.railway.app/api/events
```

#### `GET /api/events/critical`

Get critical security events only.

```bash
curl https://web-production-c5ac4.up.railway.app/api/events/critical
```

---

### AI Engine

#### `POST /api/ai/chat`

Chat with the REKT Shield swarm intelligence. Powered by Groq with Claude and GPT fallback.

**Body:**
```json
{
  "message": "Is this token safe to buy? EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v"
}
```

```bash
curl -X POST https://web-production-c5ac4.up.railway.app/api/ai/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "What are the current top threats on Solana?"}'
```

Response:
```json
{
  "response": "Based on current intelligence...",
  "provider": "groq"
}
```

#### `POST /api/ai/analyze-token`

Deep AI analysis of token risk data.

```bash
curl -X POST https://web-production-c5ac4.up.railway.app/api/ai/analyze-token \
  -H "Content-Type: application/json" \
  -d '{"tokenAddress": "TOKEN", "riskData": {}}'
```

#### `POST /api/ai/audit-contract`

AI-powered smart contract audit. Max 5000 characters.

**Body:**
```json
{
  "code": "your contract source code here"
}
```

```bash
curl -X POST https://web-production-c5ac4.up.railway.app/api/ai/audit-contract \
  -H "Content-Type: application/json" \
  -d '{"code": "pub fn transfer(...) { ... }"}'
```

#### `POST /api/ai/threat-report`

Generate an AI threat report from threat data.

```bash
curl -X POST https://web-production-c5ac4.up.railway.app/api/ai/threat-report \
  -H "Content-Type: application/json" \
  -d '{"threatType": "rug_pull", "details": {}}'
```

#### `POST /api/ai/market-risk`

AI market risk assessment from market data.

```bash
curl -X POST https://web-production-c5ac4.up.railway.app/api/ai/market-risk \
  -H "Content-Type: application/json" \
  -d '{"marketData": {}}'
```

#### `GET /api/ai/status`

Check AI engine availability and provider status.

```bash
curl https://web-production-c5ac4.up.railway.app/api/ai/status
```

Response:
```json
{
  "available": true,
  "provider": "groq",
  "totalCalls": 150
}
```

---

### Healer — Self-Healing System

#### `GET /api/healer/status`

Get Healer agent status including autonomous mode, circuit breaker states, and heal statistics.

```bash
curl https://web-production-c5ac4.up.railway.app/api/healer/status
```

#### `GET /api/healer/incidents`

Get incident history.

**Query params:**
- `limit` (optional, max 200, default 50)

```bash
curl https://web-production-c5ac4.up.railway.app/api/healer/incidents?limit=10
```

#### `GET /api/healer/actions`

Get autonomous heal action history.

**Query params:**
- `limit` (optional, max 200, default 50)

```bash
curl https://web-production-c5ac4.up.railway.app/api/healer/actions?limit=10
```

#### `POST /api/healer/decide`

Request an AI-powered autonomous decision from Healer.

**Auth required.**

**Body:**
```json
{
  "context": "Agent Scanner is unresponsive for 30 seconds"
}
```

```bash
curl -X POST https://web-production-c5ac4.up.railway.app/api/healer/decide \
  -H "Content-Type: application/json" \
  -d '{"context": "Network latency spike detected"}'
```

#### `POST /api/healer/autonomous-mode`

Enable or disable Healer autonomous mode.

**Auth required.**

**Body:**
```json
{
  "enabled": true
}
```

---

### Swap — Risk-Aware Token Trading

#### `GET /api/swap/tokens`

Get available tokens for swapping with popular token list.

```bash
curl https://web-production-c5ac4.up.railway.app/api/swap/tokens
```

#### `POST /api/swap/quote`

Get a swap quote with automatic risk analysis on the output token. The risk report is included in the response.

**Body:**
```json
{
  "inputMint": "So11111111111111111111111111111111111111112",
  "outputMint": "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
  "amount": 1000000000,
  "slippageBps": 50
}
```

```bash
curl -X POST https://web-production-c5ac4.up.railway.app/api/swap/quote \
  -H "Content-Type: application/json" \
  -d '{"inputMint":"So11111111111111111111111111111111111111112","outputMint":"EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v","amount":1000000000}'
```

Response:
```json
{
  "quote": { "inputMint": "...", "outputMint": "...", "inAmount": "...", "outAmount": "..." },
  "riskReport": { "riskScore": 15, "threatLevel": "LOW", "threats": [] },
  "safeToSwap": true,
  "riskWarning": null
}
```

**Use case:** Always get a quote before swapping. The risk report tells you if the output token is safe. If `safeToSwap` is false, do not execute the swap.

#### `POST /api/swap/execute`

Execute a swap after getting a quote.

**Body:**
```json
{
  "quoteResponse": {},
  "userPublicKey": "YOUR_WALLET_ADDRESS",
  "outputMint": "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v"
}
```

#### `POST /api/swap/emergency-evacuate`

Scan a wallet for risky tokens and generate emergency swap transactions to convert them to USDC.

**Body:**
```json
{
  "walletAddress": "YOUR_WALLET_ADDRESS",
  "tokenAccounts": []
}
```

```bash
curl -X POST https://web-production-c5ac4.up.railway.app/api/swap/emergency-evacuate \
  -H "Content-Type: application/json" \
  -d '{"walletAddress": "YOUR_WALLET_ADDRESS"}'
```

Response:
```json
{
  "riskyTokens": [],
  "totalEstimatedRecovery": "0",
  "walletAddress": "YOUR_WALLET_ADDRESS"
}
```

#### `GET /api/swap/price/:tokenMint`

Get the current USD price of any token.

**Parameters:**
- `tokenMint` (path) — Solana token mint address

```bash
curl https://web-production-c5ac4.up.railway.app/api/swap/price/So11111111111111111111111111111111111111112
```

---

## Common Workflows

### Pre-Swap Safety Check

Before any token swap, run this sequence:

1. Scan the token: `GET /api/scan/:tokenAddress`
2. Check threat registry: `GET /api/threats/:tokenAddress`
3. Predict rug pull: `GET /api/predict/:tokenAddress`
4. Check Lazarus: `GET /api/lazarus/analyze/:deployer`
5. Get risk-aware quote: `POST /api/swap/quote`

If all checks pass and `safeToSwap` is true, proceed with the swap.

### Wallet Protection Setup

1. Add wallet to monitoring: `POST /api/monitor/wallet`
2. Check quantum readiness: `GET /api/quantum/assess/:wallet`
3. Check network health: `GET /api/network/health`
4. Monitor alerts: `GET /api/alerts?wallet=YOUR_WALLET`

### Threat Intelligence Query

1. Check address: `GET /api/threats/:address`
2. Lazarus analysis: `GET /api/lazarus/analyze/:address`
3. Full threat database: `GET /api/threats`
4. Market sentiment: `GET /api/sentiment`

---

## On-Chain Program

**Program:** threat-registry (Anchor/Rust)

**Instructions:**
- `initialize` — Boot the registry
- `report_threat` — Submit threat with evidence hash (multi-agent)
- `confirm_threat` — Consensus confirmation (2+ agents required)
- `blacklist_attacker` — Record malicious address with damage estimate
- `is_blacklisted` — Query blacklist status
- `record_protection` — Log successful defense on-chain

**Threat Types:** RugPull, HoneypotToken, Drainer, Phishing, SandwichAttack, FlashLoan, MintExploit, FreezeExploit, OwnerHijack, StateSponsored, QuantumVulnerable, MaliciousUpgrade

---

## Integration Examples

### Python

```python
import requests

BASE = "https://web-production-c5ac4.up.railway.app"

# Scan a token
risk = requests.get(f"{BASE}/api/scan/TOKEN_ADDRESS").json()
print(f"Risk: {risk['riskScore']}/100 - {risk['threatLevel']}")

# Check threats
threats = requests.get(f"{BASE}/api/threats/ADDRESS").json()
print(f"Blacklisted: {threats['isBlacklisted']}")

# Get swap quote with risk
quote = requests.post(f"{BASE}/api/swap/quote", json={
    "inputMint": "So11111111111111111111111111111111111111112",
    "outputMint": "TOKEN_ADDRESS",
    "amount": 1000000000
}).json()
print(f"Safe to swap: {quote['safeToSwap']}")
```

### JavaScript

```javascript
const BASE = "https://web-production-c5ac4.up.railway.app";

// Scan a token
const risk = await fetch(`${BASE}/api/scan/TOKEN_ADDRESS`).then(r => r.json());
console.log(`Risk: ${risk.riskScore}/100`);

// Chat with AI
const chat = await fetch(`${BASE}/api/ai/chat`, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ message: "Analyze current Solana threats" })
}).then(r => r.json());
console.log(chat.response);
```

---

## Contact

- **Agent:** Youth (ID: 157)
- **Twitter:** https://x.com/Web3__Youth
- **Dashboard:** https://rektshield.fun
- **Vote:** https://colosseum.com/agent-hackathon/projects/rekt-shield
