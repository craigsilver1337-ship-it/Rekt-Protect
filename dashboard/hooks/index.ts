import useSWR from 'swr';
import { fetcher } from '@/lib/api';
import { POLLING_INTERVALS } from '@/lib/constants';
import type {
  SwarmStatus,
  SwarmEvent,
  NetworkHealthReport,
  HealerStatus,
  WalletAlert,
  MarketSentiment,
  TokenRiskReport,
  Incident,
  HealAction,
} from '@/lib/types';

export function useSwarmStatus() {
  return useSWR<SwarmStatus>('/api/status', fetcher, {
    refreshInterval: POLLING_INTERVALS.status,
  });
}

export function useEvents() {
  return useSWR<{ events: SwarmEvent[] }>('/api/events', fetcher, {
    refreshInterval: POLLING_INTERVALS.events,
  });
}

export function useCriticalEvents() {
  return useSWR<{ events: SwarmEvent[] }>('/api/events/critical', fetcher, {
    refreshInterval: POLLING_INTERVALS.events,
  });
}

export function useNetworkHealth() {
  return useSWR<NetworkHealthReport>('/api/network/health', fetcher, {
    refreshInterval: POLLING_INTERVALS.networkHealth,
  });
}

export function useNetworkStats() {
  return useSWR('/api/network/stats', fetcher, {
    refreshInterval: POLLING_INTERVALS.networkHealth,
  });
}

export function useHealerStatus() {
  return useSWR<HealerStatus>('/api/healer/status', fetcher, {
    refreshInterval: POLLING_INTERVALS.healerStatus,
  });
}

export function useHealerIncidents() {
  return useSWR<{ incidents: Incident[] }>('/api/healer/incidents', fetcher, {
    refreshInterval: POLLING_INTERVALS.healerStatus,
  });
}

export function useHealerActions() {
  return useSWR<{ actions: HealAction[] }>('/api/healer/actions', fetcher, {
    refreshInterval: POLLING_INTERVALS.healerStatus,
  });
}

export function useAlerts(walletAddress?: string) {
  const key = walletAddress
    ? `/api/alerts?wallet=${walletAddress}`
    : '/api/alerts';
  return useSWR<{ alerts: WalletAlert[] }>(key, fetcher, {
    refreshInterval: POLLING_INTERVALS.alerts,
  });
}

export function useSentiment() {
  return useSWR<MarketSentiment>('/api/sentiment', fetcher, {
    refreshInterval: POLLING_INTERVALS.sentiment,
  });
}

export function useThreats() {
  return useSWR('/api/threats', fetcher, {
    refreshInterval: POLLING_INTERVALS.threats,
  });
}

export function useMonitoredWallets() {
  return useSWR('/api/monitor/wallets', fetcher, {
    refreshInterval: POLLING_INTERVALS.status,
  });
}

export function useDefenseLog() {
  return useSWR('/api/defense/log', fetcher, {
    refreshInterval: POLLING_INTERVALS.status,
  });
}

export function useLazarusAlerts() {
  return useSWR('/api/lazarus/alerts', fetcher, {
    refreshInterval: POLLING_INTERVALS.threats,
  });
}

export function useHoneypotDeployments() {
  return useSWR('/api/honeypot/deployments', fetcher, {
    refreshInterval: POLLING_INTERVALS.status,
  });
}

export function useTokenScan(address: string | null) {
  return useSWR<TokenRiskReport>(
    address ? `/api/scan/${address}` : null,
    fetcher,
  );
}

export function useAIStatus() {
  return useSWR('/api/ai/status', fetcher, {
    refreshInterval: POLLING_INTERVALS.status,
  });
}
