'use client';

import { AddWalletForm, WalletTable, AlertList } from '@/components/wallets';
import { useMonitoredWallets, useAlerts } from '@/hooks';
import { WalletMonitorConfig, WalletAlert } from '@/lib/types';

export default function WalletsTab() {
  const { data: walletsData, mutate } = useMonitoredWallets();
  const { data: alertsData } = useAlerts();

  const wallets: WalletMonitorConfig[] = (walletsData as Record<string, unknown>)?.wallets as WalletMonitorConfig[] ?? [];
  const alerts: WalletAlert[] = alertsData?.alerts ?? [];

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-lg font-bold text-cyber-blue glow-text-blue mb-1">
          Wallet Monitor
        </h1>
        <p className="text-xs text-cyber-text-dim">
          Monitor wallets for threats with automatic defense capabilities
        </p>
      </div>

      <AddWalletForm onAdded={() => mutate()} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <WalletTable wallets={wallets} />
        <AlertList alerts={alerts} />
      </div>
    </div>
  );
}
