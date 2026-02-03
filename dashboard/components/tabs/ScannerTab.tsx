'use client';

import { useState } from 'react';
import { TokenInput, RiskGauge, ThreatList, PermissionBadges } from '@/components/scanner';
import { GlowCard } from '@/components/shared';
import { TokenRiskReport, ThreatLevel } from '@/lib/types';
import { scanToken } from '@/lib/api';
import { formatAddress, formatPercent, formatNumber, formatUSD } from '@/lib/formatters';
import { User, Droplets, TrendingDown } from 'lucide-react';

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
    <div className="space-y-4">
      <div>
        <h1 className="text-lg font-bold text-cyber-green glow-text-green mb-1">
          Token Scanner
        </h1>
        <p className="text-xs text-cyber-text-dim">
          Analyze any Solana token for rug pull risk, honeypot detection, and security threats
        </p>
      </div>

      <TokenInput onScan={handleScan} loading={loading} />

      {error && (
        <div className="bg-cyber-red/10 border border-cyber-red/30 rounded p-3 text-sm text-cyber-red">
          {error}
        </div>
      )}

      {loading && (
        <div className="flex items-center justify-center py-12">
          <div className="text-cyber-green animate-pulse text-sm">Scanning token...</div>
        </div>
      )}

      {report && !loading && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Left: Risk gauge + token info */}
          <div className="space-y-4">
            <GlowCard glow={report.riskScore > 60 ? 'red' : report.riskScore > 30 ? 'blue' : 'green'}>
              <div className="text-center mb-2">
                <h2 className="text-sm font-bold text-cyber-text">
                  {report.tokenName} ({report.tokenSymbol})
                </h2>
                <p className="text-[10px] text-cyber-text-dim font-mono">
                  {formatAddress(report.tokenAddress, 8)}
                </p>
              </div>
              <RiskGauge score={report.riskScore} threatLevel={report.threatLevel} />
            </GlowCard>

            {/* Rug Prediction */}
            <GlowCard>
              <div className="flex items-center gap-2 mb-2">
                <TrendingDown size={14} className="text-cyber-orange" />
                <h3 className="text-sm font-bold text-cyber-text-dim uppercase tracking-wider">
                  Rug Prediction
                </h3>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-cyber-text-dim">Rug Probability</span>
                  <span className={report.prediction.rugProbability > 50 ? 'text-cyber-red' : 'text-cyber-green'}>
                    {formatPercent(report.prediction.rugProbability)}
                  </span>
                </div>
                <div className="w-full bg-cyber-darker rounded-full h-2">
                  <div
                    className="h-2 rounded-full transition-all duration-500"
                    style={{
                      width: `${report.prediction.rugProbability}%`,
                      backgroundColor: report.prediction.rugProbability > 50 ? '#ff3366' : '#00ff88',
                    }}
                  />
                </div>
                <div className="flex justify-between text-[10px] text-cyber-text-dim">
                  <span>Horizon: {report.prediction.timeHorizon}</span>
                  <span>Confidence: {report.prediction.confidence}%</span>
                </div>
                {report.prediction.signals.length > 0 && (
                  <div className="mt-2 space-y-1">
                    {report.prediction.signals.map((signal, i) => (
                      <p key={i} className="text-[10px] text-cyber-text-dim">
                        {signal}
                      </p>
                    ))}
                  </div>
                )}
              </div>
            </GlowCard>
          </div>

          {/* Center: Threats + Permissions */}
          <div className="space-y-4">
            <GlowCard>
              <ThreatList threats={report.threats} />
            </GlowCard>
            <GlowCard>
              <PermissionBadges permissions={report.permissions} />
            </GlowCard>
          </div>

          {/* Right: Dev wallet + Liquidity */}
          <div className="space-y-4">
            <GlowCard>
              <div className="flex items-center gap-2 mb-3">
                <User size={14} className="text-cyber-purple" />
                <h3 className="text-sm font-bold text-cyber-text-dim uppercase tracking-wider">
                  Dev Wallet
                </h3>
              </div>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-cyber-text-dim">Address</span>
                  <span className="text-cyber-text font-mono">{formatAddress(report.devWallet.address)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-cyber-text-dim">Holding</span>
                  <span className="text-cyber-text">{formatPercent(report.devWallet.holdingPercentage)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-cyber-text-dim">Wallet Age</span>
                  <span className="text-cyber-text">{report.devWallet.age} days</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-cyber-text-dim">TX Count</span>
                  <span className="text-cyber-text">{formatNumber(report.devWallet.transactionCount)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-cyber-text-dim">Previous Rugs</span>
                  <span className={report.devWallet.previousRugs > 0 ? 'text-cyber-red' : 'text-cyber-green'}>
                    {report.devWallet.previousRugs}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-cyber-text-dim">Known Scammer</span>
                  <span className={report.devWallet.isKnownScammer ? 'text-cyber-red' : 'text-cyber-green'}>
                    {report.devWallet.isKnownScammer ? 'YES' : 'NO'}
                  </span>
                </div>
              </div>
            </GlowCard>

            <GlowCard>
              <div className="flex items-center gap-2 mb-3">
                <Droplets size={14} className="text-cyber-blue" />
                <h3 className="text-sm font-bold text-cyber-text-dim uppercase tracking-wider">
                  Liquidity
                </h3>
              </div>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-cyber-text-dim">Total Liquidity</span>
                  <span className="text-cyber-text">{formatUSD(report.liquidity.totalLiquidity)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-cyber-text-dim">Locked</span>
                  <span className={report.liquidity.isLocked ? 'text-cyber-green' : 'text-cyber-red'}>
                    {report.liquidity.isLocked ? 'YES' : 'NO'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-cyber-text-dim">Lock %</span>
                  <span className="text-cyber-text">{formatPercent(report.liquidity.lockPercentage)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-cyber-text-dim">Top 5 Holders</span>
                  <span className="text-cyber-text">{formatPercent(report.liquidity.top5HoldersPercentage)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-cyber-text-dim">LP Burned</span>
                  <span className="text-cyber-text">{formatPercent(report.liquidity.lpBurnPercentage)}</span>
                </div>
              </div>
            </GlowCard>
          </div>
        </div>
      )}
    </div>
  );
}
