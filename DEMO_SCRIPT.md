# REKT SHIELD — Demo Video Script

**Target Duration:** 2-3 minutes
**Tone:** Confident, technical, hacker-style
**Music:** Dark electronic / cyberpunk ambient (low volume)

---

## SCENE 1: THE HOOK (0:00 - 0:15)

**[Screen: Black screen with green text typing effect]**

```
> $1 BILLION lost to rug pulls on Solana...
> 361,000+ malicious pools deployed...
> Zero autonomous defense systems...
> Until now.
```

**[VOICE]:**
> "One billion dollars. That's how much Solana users have lost to rug pulls, drainers, and exploits. There's no autonomous system protecting them. They find out AFTER they get rekt. We built REKT Shield to change that."

---

## SCENE 2: INTRO (0:15 - 0:30)

**[Screen: Terminal showing the boot sequence — `npm run dev`]**

Show the actual terminal output:
```
[SWARM] REKT SHIELD — 11-Agent Swarm
[SCANNER (T-Cell)]       Agent started ✓
[SENTINEL (Patrol)]      Agent started ✓
[GUARDIAN (Killer Cell)]  Agent started ✓
...all 11 agents...
[SWARM] All 11 agents are now ACTIVE
[API] REKT Shield API running on http://localhost:3000
```

**[VOICE]:**
> "REKT Shield is a digital immune system for Solana. 11 autonomous AI agents working as a coordinated swarm — modeled after the human body's immune response. Detect. Defend. Self-heal. Zero human intervention."

---

## SCENE 3: DASHBOARD OVERVIEW (0:30 - 0:50)

**[Screen: Open browser → http://localhost:3001 → Dashboard tab]**

**[ACTION]:** Slowly scroll through the dashboard showing:
1. All 11 agent cards — all green/active
2. Stats row — threats blocked, value saved, uptime
3. Live event feed — events flowing in real-time
4. Market sentiment gauge
5. Critical alerts panel

**[VOICE]:**
> "This is the command center. 7 tabs, real-time data, cyberpunk theme. You can see all 11 agents are active. The event feed updates every 3 seconds. Stats show threats blocked and value saved in real-time."

---

## SCENE 4: TOKEN SCANNER (0:50 - 1:20)

**[Screen: Click Scanner tab]**

**[ACTION]:**
1. Paste token address: `EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v`
2. Click "Scan Token"
3. Show the risk gauge filling up (circular SVG animation)
4. Point at each section: threats, permissions, rug prediction, dev wallet, liquidity

**[VOICE]:**
> "The Token Scanner is our T-Cell — first line of defense. Paste any Solana token address and get an instant risk analysis. Risk score 0 to 100, detected threats with confidence percentages, permission checks — does the dev have mint authority? Freeze authority? — rug pull prediction based on 361,000 Raydium pool patterns, and full dev wallet history including previous rugs."

**[Pause on the rug prediction section]**

> "This isn't just detection. It's PREDICTION. We tell you the probability of a rug pull before it happens."

---

## SCENE 5: WALLET MONITORING (1:20 - 1:40)

**[Screen: Click Wallets tab]**

**[ACTION]:**
1. Paste a wallet address in the form
2. Toggle "Auto-Defend" ON
3. Click "Add"
4. Show it appear in the monitored wallets table
5. Show alert history

**[VOICE]:**
> "The Sentinel agent monitors your wallets 24/7. Add any Solana wallet, set your alert threshold, and enable auto-defend. If a drainer tries to steal your tokens, Guardian — our Killer Cell — will automatically swap, revoke approvals, or transfer your assets to a safety wallet. No human needed."

---

## SCENE 6: THREAT INTEL + LAZARUS (1:40 - 2:00)

**[Screen: Click Threat Intel tab]**

**[ACTION]:**
1. Show the threat registry table
2. Show the blacklist
3. Scroll to the Lazarus Group tracking panel
4. Point at fund flow visualization

**[VOICE]:**
> "Our Intel agent maintains a real-time threat registry and blacklist. But here's what makes us unique — the Lazarus Tracker. We're the first tool on Solana that tracks North Korean state-sponsored hackers. We detect their patterns — chain hopping, mixer usage, UTC+9 activity — and trace fund flows across chains. No one else is doing this."

---

## SCENE 7: AI CHAT (2:00 - 2:15)

**[Screen: Click AI Chat tab]**

**[ACTION]:**
1. Show the terminal-style interface
2. Click "Threat Report" quick action button
3. Show Claude AI generating a response
4. Briefly show the response

**[VOICE]:**
> "Every agent feeds intelligence to our Claude-powered AI engine. Ask it anything — generate threat reports, analyze market risk, or get security recommendations. It has full context of the entire swarm's activity."

---

## SCENE 8: SELF-HEALING (2:15 - 2:35)

**[Screen: Click Healer tab]**

**[ACTION]:**
1. Show the agent health table — all 11 healthy, circuit breakers closed
2. Show the incident log with 6-phase pipeline
3. Show the autonomous mode toggle (ON)
4. Show heal actions timeline

**[VOICE]:**
> "This is the brain of the system — the Healer. It monitors all 11 agents with circuit breakers. If any agent fails 3 times, it auto-pauses, waits 60 seconds, and restarts it. Every threat goes through a 6-phase incident response — detect, classify, contain, eradicate, recover, learn. Autonomous mode means ZERO human intervention. The system heals itself."

---

## SCENE 9: NETWORK + CLOSING (2:35 - 2:50)

**[Screen: Quick flash of Network tab — TPS, DDoS, MEV stats]**

**[VOICE]:**
> "We also monitor Solana's infrastructure — TPS, DDoS attacks, MEV sandwich bots — because the network itself can be a threat vector."

**[Screen: Back to Dashboard — all agents green]**

> "11 agents. 33 API endpoints. 7 dashboard tabs. Self-healing. AI-powered. Bio-inspired. Built for Solana."

---

## SCENE 10: TAGLINE (2:50 - 3:00)

**[Screen: Black screen, green text typing animation]**

```
> DON'T GET REKT. GET SHIELDED.
```

**[Screen: Show GitHub URL]**

```
github.com/RektProtect/RektProtect
```

**[VOICE]:**
> "REKT Shield. Don't get rekt. Get shielded."

**[END]**

---

## RECORDING TIPS

### Screen Recording
- Use **OBS Studio** (free) or **Loom**
- Resolution: **1920x1080** minimum
- Record browser + terminal side by side for boot sequence
- Use **zoom-in** on important sections (risk gauge, Lazarus panel)

### Voice
- Record voice separately for clean audio
- Speak **confidently** — you built something unique
- Don't rush — let visuals breathe

### Editing
- Add **subtle screen transitions** (fade or cut)
- Background music: search "cyberpunk ambient" on YouTube Audio Library (royalty-free)
- Add **text overlays** on key numbers ($1B+, 11 agents, 361K patterns)
- Speed up loading times if needed (2x speed)

### Before Recording
1. Start backend: `npm run dev` (port 3000)
2. Start dashboard: `cd dashboard && npm run dev` (port 3001)
3. Wait for all 11 agents to show ACTIVE
4. Open browser to http://localhost:3001
5. Clear browser console
6. Have token address ready to paste: `EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v`

### Timeline Summary
| Scene | Time | Content |
|-------|------|---------|
| Hook | 0:00-0:15 | Problem statement |
| Intro | 0:15-0:30 | Boot sequence |
| Dashboard | 0:30-0:50 | Overview tab |
| Scanner | 0:50-1:20 | Token scan demo |
| Wallets | 1:20-1:40 | Wallet monitoring |
| Threats | 1:40-2:00 | Lazarus tracking |
| AI Chat | 2:00-2:15 | Claude chat |
| Healer | 2:15-2:35 | Self-healing |
| Network | 2:35-2:50 | Infra + closing |
| Tagline | 2:50-3:00 | CTA |
