import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'REKT SHIELD v2.0 | Digital Immune System',
  description: '11-Agent Autonomous Swarm — Digital Immune System for Solana',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen overflow-hidden">
        {children}
      </body>
    </html>
  );
}
