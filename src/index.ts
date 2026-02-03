import dotenv from 'dotenv';
dotenv.config();

import { RektShieldSwarm } from './core/swarm';
import { createAPIServer } from './api/server';
import { logger } from './utils/logger';

const PORT = process.env.PORT || 3000;

async function main() {
  console.log(`
  ╔═══════════════════════════════════════════════════════╗
  ║                                                       ║
  ║   ██████╗ ███████╗██╗  ██╗████████╗                  ║
  ║   ██╔══██╗██╔════╝██║ ██╔╝╚══██╔══╝                  ║
  ║   ██████╔╝█████╗  █████╔╝    ██║                      ║
  ║   ██╔══██╗██╔══╝  ██╔═██╗    ██║                      ║
  ║   ██║  ██║███████╗██║  ██╗   ██║                      ║
  ║   ╚═╝  ╚═╝╚══════╝╚═╝  ╚═╝   ╚═╝                      ║
  ║                                                       ║
  ║   ███████╗██╗  ██╗██╗███████╗██╗     ██████╗          ║
  ║   ██╔════╝██║  ██║██║██╔════╝██║     ██╔══██╗         ║
  ║   ███████╗███████║██║█████╗  ██║     ██║  ██║         ║
  ║   ╚════██║██╔══██║██║██╔══╝  ██║     ██║  ██║         ║
  ║   ███████║██║  ██║██║███████╗███████╗██████╔╝         ║
  ║   ╚══════╝╚═╝  ╚═╝╚═╝╚══════╝╚══════╝╚═════╝          ║
  ║                                                       ║
  ║   Self-Healing Digital Immune System                  ║
  ║   11-Agent Autonomous Defense Swarm                   ║
  ║                                                       ║
  ║   Built by Youth — Colosseum Agent Hackathon 2026     ║
  ║                                                       ║
  ╚═══════════════════════════════════════════════════════╝
  `);

  // Initialize the 11-agent self-healing swarm
  const swarm = new RektShieldSwarm();

  // Start all agents
  await swarm.startAll();

  // Create and start API server
  const app = createAPIServer(swarm);

  app.listen(PORT, () => {
    logger.info(`[API] REKT Shield API running on http://localhost:${PORT}`);
    logger.info('[API] Endpoints:');
    logger.info('[API]   GET  /api/health              - Health check');
    logger.info('[API]   GET  /api/status              - Swarm status');
    logger.info('[API]   GET  /api/scan/:token         - Scan token risk');
    logger.info('[API]   POST /api/monitor/wallet      - Monitor wallet');
    logger.info('[API]   GET  /api/alerts              - Get alerts');
    logger.info('[API]   GET  /api/defense/log         - Defense log');
    logger.info('[API]   GET  /api/threats             - Threat registry');
    logger.info('[API]   GET  /api/quantum/assess/:w   - Quantum readiness');
    logger.info('[API]   GET  /api/quantum/timeline    - Quantum timeline');
    logger.info('[API]   GET  /api/lazarus/analyze/:a  - Lazarus analysis');
    logger.info('[API]   POST /api/honeypot/deploy     - Deploy honeypot');
    logger.info('[API]   GET  /api/predict/:token      - Rug prediction');
    logger.info('[API]   GET  /api/sentiment           - Market sentiment');
    logger.info('[API]   GET  /api/network/health      - Network health');
    logger.info('[API]   GET  /api/events              - Swarm events');
    logger.info('[API]   --- AI Intelligence ---');
    logger.info('[API]   POST /api/ai/analyze-token    - AI token analysis');
    logger.info('[API]   POST /api/ai/audit-contract   - AI contract audit');
    logger.info('[API]   POST /api/ai/chat             - AI chat');
    logger.info('[API]   POST /api/ai/threat-report    - AI threat report');
    logger.info('[API]   POST /api/ai/market-risk      - AI market risk');
    logger.info('[API]   GET  /api/ai/status           - AI engine status');
    logger.info('[API]   --- Self-Healing Agent ---');
    logger.info('[API]   GET  /api/healer/status       - Healer status');
    logger.info('[API]   GET  /api/healer/incidents     - Incident log');
    logger.info('[API]   GET  /api/healer/actions       - Heal actions');
    logger.info('[API]   POST /api/healer/decide        - AI decision');
    logger.info('[API]   POST /api/healer/autonomous    - Toggle mode');
  });

  // Graceful shutdown
  process.on('SIGINT', async () => {
    logger.info('[SWARM] Shutting down gracefully...');
    await swarm.stopAll();
    process.exit(0);
  });

  process.on('SIGTERM', async () => {
    await swarm.stopAll();
    process.exit(0);
  });
}

main().catch((err) => {
  logger.error(`Fatal error: ${err.message}`);
  process.exit(1);
});
