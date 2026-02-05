'use client';

import { motion } from 'framer-motion';
import { PermissionAnalysis } from '@/lib/types';
import { clsx } from 'clsx';
import { Shield, Lock, Unlock, ShieldCheck, ShieldAlert } from 'lucide-react';

interface PermissionBadgesProps {
  permissions: PermissionAnalysis;
}

interface PermItem {
  label: string;
  dangerous: boolean;
  value: boolean;
}

export default function PermissionBadges({ permissions }: PermissionBadgesProps) {
  const items: PermItem[] = [
    { label: 'Mint Authority', dangerous: true, value: permissions.mintAuthority },
    { label: 'Freeze Authority', dangerous: true, value: permissions.freezeAuthority },
    { label: 'Upgrade Authority', dangerous: true, value: permissions.upgradeAuthority },
    { label: 'Owner Can Modify', dangerous: true, value: permissions.ownerCanModify },
    { label: 'Renounced', dangerous: false, value: permissions.isRenounced },
  ];

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center gap-2 mb-4">
        <Shield size={16} className="text-cyber-blue" />
        <h3 className="text-xs font-bold text-cyber-text-dim uppercase tracking-[0.2em]">
          Smart Contract Permissions
        </h3>
      </div>

      <div className="flex flex-wrap gap-2">
        {items.map((item, idx) => {
          const isRisk = item.dangerous ? item.value : !item.value;
          return (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: idx * 0.05 }}
              whileHover={{ scale: 1.05 }}
              className={clsx(
                'group relative flex items-center gap-2 px-3 py-1.5 rounded-lg text-[10px] font-bold tracking-tight border transition-all duration-300',
                isRisk
                  ? 'bg-cyber-red/10 border-cyber-red/30 text-cyber-red'
                  : 'bg-cyber-green/10 border-cyber-green/30 text-cyber-green',
              )}
            >
              {isRisk ? (
                <ShieldAlert size={12} className="animate-pulse" />
              ) : (
                <ShieldCheck size={12} />
              )}
              <span className="opacity-80 uppercase">{item.label}:</span>
              <span className="font-mono">{item.value ? 'DETECTED' : 'SAFE'}</span>

              {/* Subtle hover glow */}
              <div
                className={clsx(
                  "absolute inset-0 opacity-0 group-hover:opacity-20 rounded-lg transition-opacity duration-300 pointer-events-none",
                  isRisk ? "bg-cyber-red shadow-[0_0_10px_rgba(255,51,102,0.5)]" : "bg-cyber-green shadow-[0_0_10px_rgba(0,255,136,0.5)]"
                )}
              />
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
