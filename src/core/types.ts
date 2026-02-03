import { PublicKey } from '@solana/web3.js';

// ============================================
// REKT SHIELD - Core Type Definitions
// 10-Agent Autonomous Swarm for Solana Defense
// ============================================

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
  IDLE = 'idle',
  ACTIVE = 'active',
  DEFENDING = 'defending',
  ALERT = 'alert',
  ERROR = 'error',
}

export enum ThreatLevel {
  SAFE = 'safe',
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  CRITICAL = 'critical',
}

export enum ThreatType {
  RUG_PULL = 'rug_pull',
  HONEYPOT_TOKEN = 'honeypot_token',
  DRAINER = 'drainer',
  PHISHING = 'phishing',
  SANDWICH_ATTACK = 'sandwich_attack',
  FLASH_LOAN = 'flash_loan',
  MINT_EXPLOIT = 'mint_exploit',
  FREEZE_EXPLOIT = 'freeze_exploit',
  OWNER_HIJACK = 'owner_hijack',
  STATE_SPONSORED = 'state_sponsored',
  QUANTUM_VULNERABLE = 'quantum_vulnerable',
  MALICIOUS_UPGRADE = 'malicious_upgrade',
}

export enum DefenseAction {
  EMERGENCY_SWAP = 'emergency_swap',
  REVOKE_APPROVAL = 'revoke_approval',
  TRANSFER_TO_SAFETY = 'transfer_to_safety',
  FREEZE_OPERATIONS = 'freeze_operations',
  ALERT_USER = 'alert_user',
  BLACKLIST_ADDRESS = 'blacklist_address',
  DEPLOY_HONEYPOT = 'deploy_honeypot',
  QUANTUM_MIGRATION = 'quantum_migration',
}

// Token risk analysis result
export interface TokenRiskReport {
  tokenAddress: string;
  tokenName: string;
  tokenSymbol: string;
  riskScore: number; // 0-100
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
  confidence: number; // 0-100
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
  age: number; // days
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
  rugProbability: number; // 0-100
  timeHorizon: string;
  confidence: number;
  signals: string[];
}

// Wallet monitoring
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

// Defense execution
export interface DefenseResult {
  success: boolean;
  action: DefenseAction;
  transactionSignature?: string;
  amountSaved?: number;
  details: string;
  timestamp: number;
}

// Quantum readiness
export interface QuantumReadinessReport {
  walletAddress: string;
  overallScore: number; // 0-100 (100 = fully quantum-safe)
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
  exposedValue: number; // USD
  recommendation: string;
}

// Lazarus tracking
export interface LazarusAlert {
  id: string;
  suspiciousAddress: string;
  matchConfidence: number; // 0-100
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

// Honeypot defense
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

// Network health
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

// Proof of Protection NFT
export interface ProtectionProof {
  id: string;
  protectedWallet: string;
  threatType: ThreatType;
  threatSource: string;
  amountSaved: number;
  defenseAction: DefenseAction;
  transactionSignature: string;
  nftMintAddress?: string;
  timestamp: number;
}

// Inter-agent communication
export interface SwarmEvent {
  id: string;
  source: AgentType;
  target: AgentType | 'ALL';
  type: SwarmEventType;
  priority: ThreatLevel;
  data: unknown;
  timestamp: number;
}

export enum SwarmEventType {
  THREAT_DETECTED = 'threat_detected',
  DEFENSE_REQUIRED = 'defense_required',
  DEFENSE_EXECUTED = 'defense_executed',
  INTEL_UPDATE = 'intel_update',
  PATTERN_LEARNED = 'pattern_learned',
  QUANTUM_ALERT = 'quantum_alert',
  LAZARUS_ACTIVITY = 'lazarus_activity',
  HONEYPOT_TRIGGERED = 'honeypot_triggered',
  PREDICTION_ALERT = 'prediction_alert',
  NETWORK_ANOMALY = 'network_anomaly',
  HEARTBEAT = 'heartbeat',
  AGENT_FAILURE = 'agent_failure',
  SELF_HEAL = 'self_heal',
  AUTO_ESCALATE = 'auto_escalate',
  INCIDENT_RESOLVED = 'incident_resolved',
}

// Colosseum integration
export interface ColosseumProject {
  name: string;
  description: string;
  repoLink: string;
  solanaIntegration: string;
  tags: string[];
}
