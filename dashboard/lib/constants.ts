import { AgentType } from './types';
import {
  Shield, Eye, Swords, Brain, FileText, Atom,
  Skull, Bug, TrendingUp, Wifi, Heart,
  LayoutDashboard, Search, Wallet, AlertTriangle,
  Activity, MessageSquare, Stethoscope,
} from 'lucide-react';

export const AGENT_META: Record<AgentType, {
  name: string;
  shortName: string;
  description: string;
  icon: typeof Shield;
  color: string;
}> = {
  [AgentType.SCANNER]: {
    name: 'Token Scanner',
    shortName: 'Scanner',
    description: 'Real-time token risk analysis & rug detection',
    icon: Search,
    color: '#00ff88',
  },
  [AgentType.SENTINEL]: {
    name: 'Wallet Sentinel',
    shortName: 'Sentinel',
    description: 'Continuous wallet monitoring & alert system',
    icon: Eye,
    color: '#00d4ff',
  },
  [AgentType.GUARDIAN]: {
    name: 'Defense Guardian',
    shortName: 'Guardian',
    description: 'Automated defense execution & emergency response',
    icon: Swords,
    color: '#ff3366',
  },
  [AgentType.INTEL]: {
    name: 'Threat Intel',
    shortName: 'Intel',
    description: 'Threat intelligence gathering & blacklist management',
    icon: Brain,
    color: '#a855f7',
  },
  [AgentType.REPORTER]: {
    name: 'Reporter',
    shortName: 'Reporter',
    description: 'Incident reporting & proof of protection NFTs',
    icon: FileText,
    color: '#ffcc00',
  },
  [AgentType.QUANTUM]: {
    name: 'Quantum Guard',
    shortName: 'Quantum',
    description: 'Post-quantum cryptography readiness assessment',
    icon: Atom,
    color: '#00ffff',
  },
  [AgentType.LAZARUS]: {
    name: 'Lazarus Tracker',
    shortName: 'Lazarus',
    description: 'State-sponsored threat actor tracking',
    icon: Skull,
    color: '#ff8800',
  },
  [AgentType.HONEYPOT]: {
    name: 'Honeypot Defense',
    shortName: 'Honeypot',
    description: 'Active defense honeypot deployment',
    icon: Bug,
    color: '#ff6600',
  },
  [AgentType.PROPHET]: {
    name: 'Market Prophet',
    shortName: 'Prophet',
    description: 'AI-powered market prediction & whale detection',
    icon: TrendingUp,
    color: '#88ff00',
  },
  [AgentType.NETWORK]: {
    name: 'Network Monitor',
    shortName: 'Network',
    description: 'Solana network health & DDoS detection',
    icon: Wifi,
    color: '#0088ff',
  },
  [AgentType.HEALER]: {
    name: 'Self-Healer',
    shortName: 'Healer',
    description: 'Autonomous self-healing & incident response',
    icon: Heart,
    color: '#ff88cc',
  },
};

export type TabId = 'dashboard' | 'scanner' | 'wallets' | 'threats' | 'network' | 'chat' | 'healer';

export const TABS: { id: TabId; label: string; icon: typeof Shield }[] = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'scanner', label: 'Token Scanner', icon: Search },
  { id: 'wallets', label: 'Wallets', icon: Wallet },
  { id: 'threats', label: 'Threat Intel', icon: AlertTriangle },
  { id: 'network', label: 'Network', icon: Activity },
  { id: 'chat', label: 'AI Chat', icon: MessageSquare },
  { id: 'healer', label: 'Healer', icon: Stethoscope },
];

export const POLLING_INTERVALS = {
  status: 5000,
  events: 3000,
  networkHealth: 10000,
  healerStatus: 5000,
  alerts: 5000,
  sentiment: 30000,
  threats: 15000,
} as const;
