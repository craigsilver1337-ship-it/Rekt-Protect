import { ThreatLevel } from './types';

export function formatAddress(address: string, chars = 4): string {
  if (!address || address.length < chars * 2 + 2) return address;
  return `${address.slice(0, chars)}...${address.slice(-chars)}`;
}

export function formatNumber(n: number): string {
  if (n >= 1_000_000_000) return `${(n / 1_000_000_000).toFixed(1)}B`;
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return n.toFixed(n < 10 ? 2 : 0);
}

export function formatUSD(n: number): string {
  return `$${formatNumber(n)}`;
}

export function formatPercent(n: number): string {
  return `${n.toFixed(1)}%`;
}

export function formatTime(timestamp: number): string {
  const now = Date.now();
  const diff = now - timestamp;

  if (diff < 60_000) return `${Math.floor(diff / 1000)}s ago`;
  if (diff < 3_600_000) return `${Math.floor(diff / 60_000)}m ago`;
  if (diff < 86_400_000) return `${Math.floor(diff / 3_600_000)}h ago`;
  return `${Math.floor(diff / 86_400_000)}d ago`;
}

export function formatUptime(ms: number): string {
  const hours = Math.floor(ms / 3_600_000);
  const minutes = Math.floor((ms % 3_600_000) / 60_000);
  if (hours > 24) {
    const days = Math.floor(hours / 24);
    return `${days}d ${hours % 24}h`;
  }
  return `${hours}h ${minutes}m`;
}

export function threatLevelColor(level: ThreatLevel): string {
  switch (level) {
    case ThreatLevel.SAFE: return 'text-cyber-green';
    case ThreatLevel.LOW: return 'text-cyber-blue';
    case ThreatLevel.MEDIUM: return 'text-cyber-yellow';
    case ThreatLevel.HIGH: return 'text-cyber-orange';
    case ThreatLevel.CRITICAL: return 'text-cyber-red';
    default: return 'text-cyber-text-dim';
  }
}

export function threatLevelBg(level: ThreatLevel): string {
  switch (level) {
    case ThreatLevel.SAFE: return 'bg-cyber-green/10 border-cyber-green/30';
    case ThreatLevel.LOW: return 'bg-cyber-blue/10 border-cyber-blue/30';
    case ThreatLevel.MEDIUM: return 'bg-cyber-yellow/10 border-cyber-yellow/30';
    case ThreatLevel.HIGH: return 'bg-cyber-orange/10 border-cyber-orange/30';
    case ThreatLevel.CRITICAL: return 'bg-cyber-red/10 border-cyber-red/30';
    default: return 'bg-cyber-card border-cyber-border';
  }
}

export function statusColor(status: string): string {
  switch (status) {
    case 'healthy':
    case 'ACTIVE':
    case 'active': return 'text-cyber-green';
    case 'degraded':
    case 'ALERT': return 'text-cyber-yellow';
    case 'failed':
    case 'ERROR': return 'text-cyber-red';
    case 'restarting':
    case 'DEFENDING': return 'text-cyber-orange';
    case 'IDLE': return 'text-cyber-text-dim';
    default: return 'text-cyber-text-dim';
  }
}

export function riskScoreColor(score: number): string {
  if (score <= 20) return '#00ff88';
  if (score <= 40) return '#00d4ff';
  if (score <= 60) return '#ffcc00';
  if (score <= 80) return '#ff8800';
  return '#ff3366';
}
