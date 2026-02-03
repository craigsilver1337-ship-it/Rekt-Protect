const API_BASE = '/api';

async function fetchAPI<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${endpoint}`, {
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
    ...options,
  });

  if (!res.ok) {
    throw new Error(`API Error: ${res.status} ${res.statusText}`);
  }

  return res.json();
}

// Health & Status
export const getHealth = () => fetchAPI('/health');
export const getStatus = () => fetchAPI('/status');

// Scanner
export const scanToken = (address: string) => fetchAPI(`/scan/${address}`);

// Sentinel
export const monitorWallet = (config: {
  walletAddress: string;
  alertThreshold?: string;
  autoDefend?: boolean;
  safetyWallet?: string;
  maxSlippage?: number;
}) =>
  fetchAPI('/monitor/wallet', {
    method: 'POST',
    body: JSON.stringify(config),
  });

export const getMonitoredWallets = () => fetchAPI('/monitor/wallets');
export const getAlerts = (walletAddress?: string) =>
  fetchAPI(`/alerts${walletAddress ? `?wallet=${walletAddress}` : ''}`);

// Guardian
export const getDefenseLog = () => fetchAPI('/defense/log');

// Intel
export const getThreats = () => fetchAPI('/threats');
export const getThreatByAddress = (address: string) => fetchAPI(`/threats/${address}`);

// Quantum
export const assessQuantum = (walletAddress: string) =>
  fetchAPI(`/quantum/assess/${walletAddress}`);
export const getQuantumTimeline = () => fetchAPI('/quantum/timeline');
export const getQuantumThreatLevel = () => fetchAPI('/quantum/threat-level');

// Lazarus
export const analyzeLazarus = (address: string) => fetchAPI(`/lazarus/analyze/${address}`);
export const getLazarusAlerts = () => fetchAPI('/lazarus/alerts');

// Honeypot
export const deployHoneypot = (config: {
  walletAddress: string;
  baitAmount?: number;
  baitToken?: string;
}) =>
  fetchAPI('/honeypot/deploy', {
    method: 'POST',
    body: JSON.stringify(config),
  });
export const getHoneypotDeployments = () => fetchAPI('/honeypot/deployments');

// Prophet
export const predictRugPull = (tokenAddress: string) => fetchAPI(`/predict/${tokenAddress}`);
export const detectWhales = (tokenAddress: string) =>
  fetchAPI(`/predict/whales/${tokenAddress}`);
export const getSentiment = () => fetchAPI('/sentiment');

// Network
export const getNetworkHealth = () => fetchAPI('/network/health');
export const getNetworkStats = () => fetchAPI('/network/stats');

// Events
export const getEvents = () => fetchAPI('/events');
export const getCriticalEvents = () => fetchAPI('/events/critical');

// AI
export const aiAnalyzeToken = (tokenAddress: string) =>
  fetchAPI('/ai/analyze-token', {
    method: 'POST',
    body: JSON.stringify({ tokenAddress }),
  });
export const aiAuditContract = (programId: string) =>
  fetchAPI('/ai/audit-contract', {
    method: 'POST',
    body: JSON.stringify({ programId }),
  });
export const aiChat = (message: string, context?: string) =>
  fetchAPI('/ai/chat', {
    method: 'POST',
    body: JSON.stringify({ message, context }),
  });
export const aiThreatReport = () =>
  fetchAPI('/ai/threat-report', { method: 'POST' });
export const aiMarketRisk = () =>
  fetchAPI('/ai/market-risk', { method: 'POST' });
export const getAIStatus = () => fetchAPI('/ai/status');

// Healer
export const getHealerStatus = () => fetchAPI('/healer/status');
export const getHealerIncidents = () => fetchAPI('/healer/incidents');
export const getHealerActions = () => fetchAPI('/healer/actions');
export const healerDecide = (context: { situation: string; options: string[] }) =>
  fetchAPI('/healer/decide', {
    method: 'POST',
    body: JSON.stringify(context),
  });
export const setAutonomousMode = (enabled: boolean) =>
  fetchAPI('/healer/autonomous-mode', {
    method: 'POST',
    body: JSON.stringify({ enabled }),
  });

// Swap
export const getSwapTokens = () => fetchAPI('/swap/tokens');
export const getSwapQuote = (params: {
  inputMint: string;
  outputMint: string;
  amount: number;
  slippageBps?: number;
}) =>
  fetchAPI('/swap/quote', {
    method: 'POST',
    body: JSON.stringify(params),
  });
export const executeSwap = (params: {
  quoteResponse: unknown;
  userPublicKey: string;
  outputMint?: string;
}) =>
  fetchAPI('/swap/execute', {
    method: 'POST',
    body: JSON.stringify(params),
  });
export const emergencyEvacuate = (params: {
  walletAddress: string;
  tokenAccounts?: Array<{ mint: string; amount: number; name?: string; symbol?: string }>;
}) =>
  fetchAPI('/swap/emergency-evacuate', {
    method: 'POST',
    body: JSON.stringify(params),
  });
export const getTokenPrice = (tokenMint: string) => fetchAPI(`/swap/price/${tokenMint}`);

// Generic fetcher for SWR
export const fetcher = (url: string) => fetch(url).then((r) => r.json());
