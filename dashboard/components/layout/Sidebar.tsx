'use client';

import { clsx } from 'clsx';
import { Shield } from 'lucide-react';
import { TABS, TabId } from '@/lib/constants';

interface SidebarProps {
  activeTab: TabId;
  onTabChange: (tab: TabId) => void;
}

export default function Sidebar({ activeTab, onTabChange }: SidebarProps) {
  return (
    <aside className="w-[60px] bg-cyber-darker border-r border-cyber-border flex flex-col items-center py-4 gap-1 flex-shrink-0">
      <div className="w-10 h-10 rounded-lg bg-cyber-green/10 border border-cyber-green/30 flex items-center justify-center mb-4">
        <Shield size={20} className="text-cyber-green" />
      </div>

      {TABS.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            title={tab.label}
            className={clsx(
              'w-10 h-10 rounded-lg flex items-center justify-center transition-all duration-200 relative group',
              isActive
                ? 'bg-cyber-green/15 text-cyber-green border border-cyber-green/30'
                : 'text-cyber-text-dim hover:text-cyber-text hover:bg-cyber-card border border-transparent',
            )}
          >
            <Icon size={18} />
            <span className="absolute left-14 bg-cyber-card border border-cyber-border rounded px-2 py-1 text-xs whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50 text-cyber-text">
              {tab.label}
            </span>
          </button>
        );
      })}
    </aside>
  );
}
