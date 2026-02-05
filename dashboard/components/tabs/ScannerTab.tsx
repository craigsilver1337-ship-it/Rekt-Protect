'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TokenInput, RiskGauge, ThreatList, PermissionBadges } from '@/components/scanner';
import { GlowCard } from '@/components/shared';
import { TokenRiskReport } from '@/lib/types';
import { scanToken } from '@/lib/api';
import { formatAddress, formatPercent, formatNumber, formatUSD } from '@/lib/formatters';
import { User, Droplets, TrendingDown, Info, ShieldCheck, Search } from 'lucide-react';
import { clsx } from 'clsx';

export default function ScannerTab() {
  const [report, setReport] = useState<TokenRiskReport | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleScan = async (address: string) => {
    setLoading(true);
    setError(null);
    try {
      const result = await scanToken(address) as TokenRiskReport;
      setReport(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Scan failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-[1400px] mx-auto pb-12">
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <div className="flex items-center gap-3 mb-1">
            <div className="w-8 h-8 rounded-lg bg-cyber-green/20 flex items-center justify-center border border-cyber-green/30">
              <Search size={18} className="text-cyber-green" />
            </div>
            <h1 className="text-2xl font-black text-white tracking-tight uppercase">
              Token <span className="text-cyber-green glow-text-green">Scanner</span>
            </h1>
          </div>
          <p className="text-xs text-cyber-text-dim font-mono tracking-widest">
            V2.1 // AUTONOMOUS_RISK_ASSESSMENT_ENGINE
          </p>
        </div>
        <div className="hidden md:flex items-center gap-4 text-[10px] text-cyber-text-dim font-mono">
          <div className="flex flex-col items-end">
            <span className="text-cyber-green font-bold text-xs uppercase">Engine Status</span>
            <span>SYSTEMS_OPERATIONAL</span>
          </div>
          <div className="w-[1px] h-8 bg-cyber-border" />
          <div className="flex flex-col items-end">
            <span className="text-cyber-blue font-bold text-xs uppercase">Security Level</span>
            <span>MAXIMUM_ENFORCEMENT</span>
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <TokenInput onScan={handleScan} loading={loading} />
      </motion.div>

      <AnimatePresence mode="wait">
        {error && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-cyber-red/10 border border-cyber-red/30 rounded-xl p-4 flex items-center gap-3 text-sm text-cyber-red"
          >
            <Info size={16} />
            <span className="font-mono font-bold tracking-tight">{error}</span>
          </motion.div>
        )}

        {loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center justify-center py-20 gap-4"
          >
            <div className="relative w-16 h-16">
              <motion.div
                className="absolute inset-0 border-2 border-cyber-green/30 border-t-cyber-green rounded-full"
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              />
              <div className="absolute inset-2 border border-cyber-green/10 rounded-full" />
            </div>
            <div className="text-center">
              <p className="text-cyber-green font-mono font-bold tracking-[0.3em] animate-pulse">ANALYZING_TOKEN_METRICS</p>
              <p className="text-[10px] text-cyber-text-dim font-mono mt-1 italic">Querying Solana mainnet-beta...</p>
            </div>
          </motion.div>
        )}

        {report && !loading && (
          <motion.div
            initial="hidden"
            animate="show"
            variants={{
              hidden: { opacity: 0 },
              show: {
                opacity: 1,
                transition: { staggerChildren: 0.1 }
              }
            }}
            className="grid grid-cols-1 lg:grid-cols-12 gap-6"
          >
            {/* Left Column (4/12) */}
            <div className="lg:col-span-4 space-y-6">
              <GlowCard
                glow={report.riskScore > 60 ? 'red' : report.riskScore > 30 ? 'blue' : 'green'}
                className="flex flex-col items-center py-8"
              >
                <div className="text-center mb-6">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-black/40 border border-cyber-border mb-3">
                    <ShieldCheck size={12} className="text-cyber-green" />
                    <span className="text-[10px] font-bold text-cyber-text tracking-widest uppercase">Verified Record</span>
                  </div>
                  <h2 className="text-2xl font-black text-white tracking-tight">
                    {report.tokenName} <span className="text-cyber-text-dim text-lg">({report.tokenSymbol})</span>
                  </h2>
                  <p className="text-xs text-cyber-green/70 font-mono mt-1 font-bold">
                    {report.tokenAddress}
                  </p>
                </div>
                <RiskGauge score={report.riskScore} threatLevel={report.threatLevel} />
              </GlowCard>

              <GlowCard>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <TrendingDown size={14} className="text-cyber-orange" />
                    <h3 className="text-xs font-bold text-cyber-text-dim uppercase tracking-[0.2em]">
                      Rug Prediction
                    </h3>
                  </div>
                  <span className="text-[10px] font-mono text-cyber-text-dim uppercase">Model: PREDICT_V4</span>
                </div>

                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <div className="flex justify-between items-end">
                      <span className="text-[10px] text-cyber-text-dim uppercase font-bold tracking-wider">Probability</span>
                      <span className={clsx("text-lg font-black font-mono", report.prediction.rugProbability > 50 ? 'text-cyber-red' : 'text-cyber-green')}>
                        {formatPercent(report.prediction.rugProbability)}
                      </span>
                    </div>
                    <div className="w-full bg-black/40 rounded-full h-1.5 overflow-hidden border border-cyber-border/30">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${report.prediction.rugProbability}%` }}
                        transition={{ duration: 1, ease: "easeOut" }}
                        className={clsx(
                          "h-full rounded-full",
                          report.prediction.rugProbability > 50 ? 'bg-cyber-red shadow-[0_0_10px_#ff3366]' : 'bg-cyber-green shadow-[0_0_10px_#00ff88]'
                        )}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-black/20 p-2 rounded-lg border border-cyber-border/30">
                      <p className="text-[9px] text-cyber-text-dim uppercase font-bold">Time Horizon</p>
                      <p className="text-xs text-white font-mono">{report.prediction.timeHorizon}</p>
                    </div>
                    <div className="bg-black/20 p-2 rounded-lg border border-cyber-border/30">
                      <p className="text-[9px] text-cyber-text-dim uppercase font-bold">Confidence</p>
                      <p className="text-xs text-white font-mono">{report.prediction.confidence}%</p>
                    </div>
                  </div>

                  {report.prediction.signals.length > 0 && (
                    <div className="space-y-1.5 mt-2">
                      <p className="text-[9px] text-cyber-text-dim uppercase font-bold tracking-[0.1em]">AI Indicators:</p>
                      {report.prediction.signals.map((signal, i) => (
                        <div key={i} className="flex items-center gap-2 text-[10px] text-cyber-text-dim bg-black/20 px-2 py-1 rounded">
                          <div className="w-1 h-1 rounded-full bg-cyber-orange" />
                          <span>{signal}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </GlowCard>
            </div>

            {/* Center Column (4/12) */}
            <div className="lg:col-span-4 space-y-6">
              <GlowCard className="h-fit">
                <ThreatList threats={report.threats} />
              </GlowCard>
              <GlowCard className="h-fit">
                <PermissionBadges permissions={report.permissions} />
              </GlowCard>
            </div>

            {/* Right Column (4/12) */}
            <div className="lg:col-span-4 space-y-6">
              <GlowCard>
                <div className="flex items-center justify-between mb-5">
                  <div className="flex items-center gap-2">
                    <User size={14} className="text-cyber-purple" />
                    <h3 className="text-xs font-bold text-cyber-text-dim uppercase tracking-[0.2em]">
                      Dev Wallet
                    </h3>
                  </div>
                  <div className="px-2 py-0.5 rounded bg-cyber-purple/10 border border-cyber-purple/20">
                    <span className="text-[9px] text-cyber-purple font-bold font-mono uppercase">Tracking</span>
                  </div>
                </div>

                <div className="space-y-3">
                  {[
                    { label: 'Address', value: formatAddress(report.devWallet.address), mono: true },
                    { label: 'Holding', value: formatPercent(report.devWallet.holdingPercentage), color: report.devWallet.holdingPercentage > 10 ? 'red' : 'green' },
                    { label: 'Wallet Age', value: `${report.devWallet.age} days` },
                    { label: 'TX Count', value: formatNumber(report.devWallet.transactionCount) },
                    { label: 'Previous Rugs', value: report.devWallet.previousRugs, color: report.devWallet.previousRugs > 0 ? 'red' : 'green' },
                    { label: 'Known Scammer', value: report.devWallet.isKnownScammer ? 'YES' : 'NO', color: report.devWallet.isKnownScammer ? 'red' : 'green' },
                  ].map((stat, i) => (
                    <div key={i} className="flex justify-between items-center py-2 border-b border-cyber-border/30 last:border-0 border-dashed">
                      <span className="text-[10px] text-cyber-text-dim font-bold uppercase tracking-wider">{stat.label}</span>
                      <span className={clsx(
                        "text-xs font-bold",
                        stat.mono && "font-mono",
                        stat.color === 'red' ? 'text-cyber-red' : stat.color === 'green' ? 'text-cyber-green' : 'text-white'
                      )}>
                        {stat.value}
                      </span>
                    </div>
                  ))}
                </div>
              </GlowCard>

              <GlowCard>
                <div className="flex items-center justify-between mb-5">
                  <div className="flex items-center gap-2">
                    <Droplets size={14} className="text-cyber-blue" />
                    <h3 className="text-xs font-bold text-cyber-text-dim uppercase tracking-[0.2em]">
                      Liquidity
                    </h3>
                  </div>
                  <div className="px-2 py-0.5 rounded bg-cyber-blue/10 border border-cyber-blue/20">
                    <span className="text-[9px] text-cyber-blue font-bold font-mono uppercase">Analysis</span>
                  </div>
                </div>

                <div className="space-y-3">
                  {[
                    { label: 'Total Liquidity', value: formatUSD(report.liquidity.totalLiquidity) },
                    { label: 'Locked Status', value: report.liquidity.isLocked ? 'PROTECTED' : 'UNSECURED', color: report.liquidity.isLocked ? 'green' : 'red' },
                    { label: 'Lock Percentage', value: formatPercent(report.liquidity.lockPercentage) },
                    { label: 'Top 5 Holders', value: formatPercent(report.liquidity.top5HoldersPercentage), color: report.liquidity.top5HoldersPercentage > 30 ? 'red' : '' },
                    { label: 'LP Burned', value: formatPercent(report.liquidity.lpBurnPercentage), color: report.liquidity.lpBurnPercentage > 0 ? 'green' : '' },
                  ].map((stat, i) => (
                    <div key={i} className="flex justify-between items-center py-2 border-b border-cyber-border/30 last:border-0 border-dashed">
                      <span className="text-[10px] text-cyber-text-dim font-bold uppercase tracking-wider">{stat.label}</span>
                      <span className={clsx(
                        "text-xs font-bold",
                        stat.color === 'red' ? 'text-cyber-red' : stat.color === 'green' ? 'text-cyber-green' : 'text-white'
                      )}>
                        {stat.value}
                      </span>
                    </div>
                  ))}
                </div>
              </GlowCard>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
