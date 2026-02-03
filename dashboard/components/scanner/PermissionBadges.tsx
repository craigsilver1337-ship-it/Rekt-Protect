'use client';

import { PermissionAnalysis } from '@/lib/types';
import { clsx } from 'clsx';
import { Shield, Lock, Unlock } from 'lucide-react';

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
    <div>
      <div className="flex items-center gap-2 mb-2">
        <Shield size={14} className="text-cyber-blue" />
        <h3 className="text-sm font-bold text-cyber-text-dim uppercase tracking-wider">
          Permissions
        </h3>
      </div>
      <div className="flex flex-wrap gap-2">
        {items.map((item) => {
          const isRisk = item.dangerous ? item.value : !item.value;
          return (
            <span
              key={item.label}
              className={clsx(
                'inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-[11px] font-medium border',
                isRisk
                  ? 'bg-cyber-red/10 border-cyber-red/30 text-cyber-red'
                  : 'bg-cyber-green/10 border-cyber-green/30 text-cyber-green',
              )}
            >
              {isRisk ? <Unlock size={10} /> : <Lock size={10} />}
              {item.label}: {item.value ? 'Yes' : 'No'}
            </span>
          );
        })}
      </div>
    </div>
  );
}
