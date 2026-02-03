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
  ║   Digital Immune System for Solana                    ║
  ║   10-Agent Autonomous Defense Swarm                   ║
  ║                                                       ║
  ║   Built by Youth — Colosseum Agent Hackathon 2026     ║
  ║                                                       ║
  ╚═══════════════════════════════════════════════════════╝
  `);

  // Initialize the 10-agent swarm
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
