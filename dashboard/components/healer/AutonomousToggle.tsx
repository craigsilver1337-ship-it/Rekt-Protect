'use client';

import { useState } from 'react';
import { setAutonomousMode } from '@/lib/api';
import { ThreatLevel } from '@/lib/types';
import { ThreatBadge } from '@/components/shared';
import { clsx } from 'clsx';
import { Bot, Cpu, AlertTriangle } from 'lucide-react';

interface AutonomousToggleProps {
  enabled: boolean;
  threatLevel: ThreatLevel;
  aiAvailable: boolean;
  aiProvider: string;
  onToggle: () => void;
}

export default function AutonomousToggle({
  enabled,
  threatLevel,
  aiAvailable,
  aiProvider,
  onToggle,
}: AutonomousToggleProps) {
  const [toggling, setToggling] = useState(false);

  const handleToggle = async () => {
    setToggling(true);
    try {
      await setAutonomousMode(!enabled);
      onToggle();
    } catch {
      // silently fail
    } finally {
      setToggling(false);
    }
  };

  return (
    <div className="bg-cyber-card border border-cyber-border rounded-lg p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Bot size={14} className="text-cyber-purple" />
          <h3 className="text-sm font-bold text-cyber-text-dim uppercase tracking-wider">
            Autonomous Mode
          </h3>
        </div>
        <button
          onClick={handleToggle}
          disabled={toggling}
          className={clsx(
            'relative inline-flex h-6 w-11 items-center rounded-full transition-colors',
            enabled ? 'bg-cyber-green/30' : 'bg-cyber-border',
            toggling && 'opacity-50',
          )}
        >
          <span
            className={clsx(
              'inline-block h-4 w-4 transform rounded-full transition-transform',
              enabled ? 'translate-x-6 bg-cyber-green' : 'translate-x-1 bg-cyber-text-dim',
            )}
          />
        </button>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs">
          <span className="text-cyber-text-dim flex items-center gap-1.5">
            <AlertTriangle size={10} />
            Threat Level
          </span>
          <ThreatBadge level={threatLevel} />
        </div>
        <div className="flex items-center justify-between text-xs">
          <span className="text-cyber-text-dim flex items-center gap-1.5">
            <Cpu size={10} />
            AI Engine
          </span>
          <span className={aiAvailable ? 'text-cyber-green' : 'text-cyber-red'}>
            {aiProvider} ({aiAvailable ? 'Online' : 'Offline'})
          </span>
        </div>
        <div className="flex items-center justify-between text-xs">
          <span className="text-cyber-text-dim">Status</span>
          <span className={enabled ? 'text-cyber-green font-bold' : 'text-cyber-text-dim'}>
            {enabled ? 'ACTIVE' : 'MANUAL'}
          </span>
        </div>
      </div>
    </div>
  );
}
