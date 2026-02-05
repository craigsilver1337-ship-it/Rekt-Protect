'use client';

import { useState } from 'react';
import { TabId } from '@/lib/constants';
import Sidebar from './Sidebar';
import Header from './Header';
import DashboardTab from '@/components/tabs/DashboardTab';
import ScannerTab from '@/components/tabs/ScannerTab';
import WalletsTab from '@/components/tabs/WalletsTab';
import ThreatsTab from '@/components/tabs/ThreatsTab';
import NetworkTab from '@/components/tabs/NetworkTab';
import ChatTab from '@/components/tabs/ChatTab';
import SwapTab from '@/components/tabs/SwapTab';
import HealerTab from '@/components/tabs/HealerTab';

const TAB_COMPONENTS: Record<TabId, React.ComponentType> = {
  dashboard: DashboardTab,
  scanner: ScannerTab,
  wallets: WalletsTab,
  threats: ThreatsTab,
  network: NetworkTab,
  chat: ChatTab,
  swap: SwapTab,
  healer: HealerTab,
};

export default function Shell() {
  const [activeTab, setActiveTab] = useState<TabId>('dashboard');
  const ActiveComponent = TAB_COMPONENTS[activeTab];

  return (
    <div className="h-screen flex flex-col overflow-hidden">
      <Header />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />
        <main className="flex-1 overflow-auto p-4 bg-transparent">
          <ActiveComponent />
        </main>
      </div>
    </div>
  );
}
