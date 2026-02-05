import type { Metadata } from 'next';
import { Analytics } from '@vercel/analytics/react';
import { WalletContextProvider } from '@/components/providers';
import { AnimatedBackground } from '@/components/shared';
import './globals.css';

export const metadata: Metadata = {
  title: 'REKT PROTECT v0.1 | Digital Immune System',
  description: '11-Agent Autonomous Swarm — Digital Immune System for Solana',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen overflow-hidden antialiased">
        <AnimatedBackground />
        <WalletContextProvider>{children}</WalletContextProvider>
        <Analytics />
      </body>
    </html>
  );
}
