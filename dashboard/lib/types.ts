// Mirror of backend src/core/types.ts

export enum AgentType {
  SCANNER = 'SCANNER',
  SENTINEL = 'SENTINEL',
  GUARDIAN = 'GUARDIAN',
  INTEL = 'INTEL',
  REPORTER = 'REPORTER',
  QUANTUM = 'QUANTUM',
  LAZARUS = 'LAZARUS',
  HONEYPOT = 'HONEYPOT',
  PROPHET = 'PROPHET',
  NETWORK = 'NETWORK',
  HEALER = 'HEALER',
}

export enum AgentStatus {
  IDLE = 'IDLE',
  ACTIVE = 'ACTIVE',
  DEFENDING = 'DEFENDING',
  ALERT = 'ALERT',
  ERROR = 'ERROR',
}

export enum ThreatLevel {
  SAFE = 'SAFE',
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  CRITICAL = 'CRITICAL',
}

export enum ThreatType {
  RUG_PULL = 'RUG_PULL',
  HONEYPOT_TOKEN = 'HONEYPOT_TOKEN',
  DRAINER = 'DRAINER',
  PHISHING = 'PHISHING',
  SANDWICH_ATTACK = 'SANDWICH_ATTACK',
  FLASH_LOAN = 'FLASH_LOAN',
  MINT_EXPLOIT = 'MINT_EXPLOIT',
  FREEZE_EXPLOIT = 'FREEZE_EXPLOIT',
  OWNER_HIJACK = 'OWNER_HIJACK',
  STATE_SPONSORED = 'STATE_SPONSORED',
  QUANTUM_VULNERABLE = 'QUANTUM_VULNERABLE',
  MALICIOUS_UPGRADE = 'MALICIOUS_UPGRADE',
}

export enum DefenseAction {
  EMERGENCY_SWAP = 'EMERGENCY_SWAP',
  REVOKE_APPROVAL = 'REVOKE_APPROVAL',
  TRANSFER_TO_SAFETY = 'TRANSFER_TO_SAFETY',
  FREEZE_OPERATIONS = 'FREEZE_OPERATIONS',
  ALERT_USER = 'ALERT_USER',
  BLACKLIST_ADDRESS = 'BLACKLIST_ADDRESS',
  DEPLOY_HONEYPOT = 'DEPLOY_HONEYPOT',
  QUANTUM_MIGRATION = 'QUANTUM_MIGRATION',
}

export enum SwarmEventType {
  THREAT_DETECTED = 'THREAT_DETECTED',
  DEFENSE_EXECUTED = 'DEFENSE_EXECUTED',
  WALLET_COMPROMISED = 'WALLET_COMPROMISED',
  TOKEN_FLAGGED = 'TOKEN_FLAGGED',
  LAZARUS_ALERT = 'LAZARUS_ALERT',
  QUANTUM_WARNING = 'QUANTUM_WARNING',
  HONEYPOT_TRIGGERED = 'HONEYPOT_TRIGGERED',
  PREDICTION_ALERT = 'PREDICTION_ALERT',
  NETWORK_ANOMALY = 'NETWORK_ANOMALY',
  SWARM_COORDINATION = 'SWARM_COORDINATION',
  AGENT_STATUS_CHANGE = 'AGENT_STATUS_CHANGE',
  PROOF_OF_PROTECTION = 'PROOF_OF_PROTECTION',
  INTELLIGENCE_UPDATE = 'INTELLIGENCE_UPDATE',
  MARKET_ALERT = 'MARKET_ALERT',
  HEALER_ACTION = 'HEALER_ACTION',
}

// Token Analysis
export interface TokenRiskReport {
  tokenAddress: string;
  tokenName: string;
  tokenSymbol: string;
  riskScore: number;
  threatLevel: ThreatLevel;
  threats: ThreatDetail[];
  liquidity: LiquidityAnalysis;
  devWallet: DevWalletAnalysis;
  permissions: PermissionAnalysis;
  prediction: PredictionResult;
  timestamp: number;
}

export interface ThreatDetail {
  type: ThreatType;
  severity: ThreatLevel;
  description: string;
  evidence: string;
  confidence: number;
}

export interface LiquidityAnalysis {
  totalLiquidity: number;
  isLocked: boolean;
  lockDuration: number | null;
  lockPercentage: number;
  top5HoldersPercentage: number;
  lpBurnPercentage: number;
}

export interface DevWalletAnalysis {
  address: string;
  holdingPercentage: number;
  transactionCount: number;
  age: number;
  hasMultipleTokens: boolean;
  previousRugs: number;
  isKnownScammer: boolean;
}

export interface PermissionAnalysis {
  mintAuthority: boolean;
  freezeAuthority: boolean;
  upgradeAuthority: boolean;
  ownerCanModify: boolean;
  isRenounced: boolean;
}

export interface PredictionResult {
  rugProbability: number;
  timeHorizon: string;
  confidence: number;
  signals: string[];
}

// Wallet Monitoring
export interface WalletMonitorConfig {
  walletAddress: string;
  alertThreshold: ThreatLevel;
  autoDefend: boolean;
  safetyWallet?: string;
  maxSlippage: number;
}

export interface WalletAlert {
  id: string;
  walletAddress: string;
  type: ThreatType;
  threatLevel: ThreatLevel;
  description: string;
  transactionSignature?: string;
  timestamp: number;
  autoDefended: boolean;
  defenseAction?: DefenseAction;
}

// Defense
export interface DefenseResult {
  success: boolean;
  action: DefenseAction;
  transactionSignature?: string;
  amountSaved?: number;
  details: string;
  timestamp: number;
}

// Quantum
export interface QuantumReadinessReport {
  walletAddress: string;
  overallScore: number;
  exposedPublicKeys: number;
  vulnerableAccounts: number;
  migrationSteps: MigrationStep[];
  harvestRisk: HarvestRisk;
  timestamp: number;
}

export interface MigrationStep {
  step: number;
  action: string;
  description: string;
  priority: ThreatLevel;
  automated: boolean;
}

export interface HarvestRisk {
  level: ThreatLevel;
  exposedValue: number;
  recommendation: string;
}

// Lazarus
export interface LazarusAlert {
  id: string;
  suspiciousAddress: string;
  matchConfidence: number;
  patterns: LazarusPattern[];
  fundFlow: FundFlow[];
  recommendation: string;
  timestamp: number;
}

export interface LazarusPattern {
  pattern: string;
  description: string;
  matchScore: number;
}

export interface FundFlow {
  from: string;
  to: string;
  amount: number;
  token: string;
  chain: string;
  timestamp: number;
}

// Honeypot
export interface HoneypotDeployment {
  id: string;
  walletAddress: string;
  baitAmount: number;
  baitToken: string;
  status: 'active' | 'triggered' | 'expired';
  attackersCaught: AttackerProfile[];
  deployedAt: number;
}

export interface AttackerProfile {
  address: string;
  attackMethod: string;
  toolSignature: string;
  firstSeen: number;
  attackCount: number;
  estimatedDamage: number;
}

// Network
export interface NetworkHealthReport {
  tps: number;
  avgBlockTime: number;
  validatorCount: number;
  stakeConcentration: number;
  congestionLevel: ThreatLevel;
  recentDDoSIndicators: number;
  programUpgrades: ProgramUpgrade[];
  mevActivity: MEVReport;
  timestamp: number;
}

export interface ProgramUpgrade {
  programId: string;
  programName: string;
  upgradeTime: number;
  riskAssessment: ThreatLevel;
}

export interface MEVReport {
  sandwichAttacks24h: number;
  estimatedMEVExtracted: number;
  topMEVBots: string[];
}

// Swarm Events
export interface SwarmEvent {
  id: string;
  source: AgentType;
  target: AgentType | 'ALL';
  type: SwarmEventType;
  priority: ThreatLevel;
  data: unknown;
  timestamp: number;
}

// Healer
export interface AgentHealth {
  agent: AgentType;
  status: 'healthy' | 'degraded' | 'failed' | 'restarting' | 'unknown';
  failureCount: number;
  autoRestarts: number;
  circuitOpen: boolean;
}

export interface Incident {
  id: string;
  type: string;
  source: string;
  data: unknown;
  status: 'active' | 'resolved' | 'failed';
  phase: 'detect' | 'classify' | 'contain' | 'eradicate' | 'recover' | 'learn';
  classification: ThreatClassification | null;
  createdAt: number;
  resolvedAt: number | null;
  resolvedBy: string | null;
}

export interface ThreatClassification {
  threatType: string;
  severity: ThreatLevel;
  requiresDefense: boolean;
  shouldDeployHoneypot: boolean;
  attackerAddress: string | null;
  reason: string;
}

export interface HealAction {
  type: string;
  description: string;
  timestamp: number;
}

export interface HealerStatus {
  autonomousMode: boolean;
  currentThreatLevel: ThreatLevel;
  aiAvailable: boolean;
  aiProvider: string;
  totalIncidents: number;
  resolvedIncidents: number;
  failedIncidents: number;
  activeIncidents: number;
  totalHealActions: number;
  agentHealth: AgentHealth[];
}

// AI Chat
export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
}

// Sentiment
export interface MarketSentiment {
  overall: 'BULLISH' | 'BEARISH' | 'NEUTRAL' | 'FEAR' | 'EXTREME_FEAR';
  score: number;
  signals: string[];
  timestamp: number;
}

// API Response wrappers
export interface SwarmStatus {
  status: string;
  version: string;
  agents: {
    type: AgentType;
    status: AgentStatus;
    isRunning: boolean;
  }[];
  totalAgents: number;
  activeAgents: number;
  uptime: number;
}

export interface HealthResponse {
  status: string;
  version: string;
  agentCount: number;
  aiAvailable: boolean;
  aiProvider: string;
}
