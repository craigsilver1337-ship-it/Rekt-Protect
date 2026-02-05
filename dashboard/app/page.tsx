'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shell } from '@/components/layout';
import AuthScreen from '@/components/auth/AuthScreen';
import { Loader2, Shield } from 'lucide-react';

export default function Home() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isInitializing, setIsInitializing] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const authStatus = localStorage.getItem('rekt_auth_success');
    if (authStatus === 'true') {
      setIsAuthenticated(true);
    }
    setLoading(false);
  }, []);

  const handleAuthSuccess = () => {
    setIsInitializing(true);
    // Cinematic delay for system initialization
    setTimeout(() => {
      setIsAuthenticated(true);
      setIsInitializing(false);
      localStorage.setItem('rekt_auth_success', 'true');
    }, 2500);
  };

  if (loading) return null;

  return (
    <main className="relative h-screen w-screen overflow-hidden">
      <AnimatePresence mode="wait">
        {isInitializing ? (
          <motion.div
            key="initializing"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#0a0a0f]"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="relative mb-8"
            >
              <div className="absolute inset-0 bg-cyber-green/20 blur-2xl rounded-full animate-pulse" />
              <div className="relative w-24 h-24 rounded-2xl bg-cyber-dark border border-cyber-green/30 flex items-center justify-center">
                <Shield size={48} className="text-cyber-green" />
                <motion.div
                  className="absolute inset-[-4px] border border-cyber-green/30 rounded-[18px]"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                />
              </div>
            </motion.div>

            <div className="space-y-4 text-center">
              <motion.h2
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="text-xl font-black text-white tracking-[0.3em] uppercase"
              >
                Initializing <span className="text-cyber-green">Core</span>
              </motion.h2>

              <div className="w-64 h-1 bg-cyber-card rounded-full overflow-hidden border border-cyber-border/30">
                <motion.div
                  className="h-full bg-cyber-green shadow-[0_0_15px_#00ff88]"
                  initial={{ width: "0%" }}
                  animate={{ width: "100%" }}
                  transition={{ duration: 2, ease: "easeInOut" }}
                />
              </div>

              <div className="flex flex-col gap-1">
                {[
                  "Establishing secure link...",
                  "Syncing neural agents...",
                  "Bypassing firewalls...",
                  "Access granted."
                ].map((text, i) => (
                  <motion.p
                    key={i}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 + i * 0.4 }}
                    className="text-[10px] text-cyber-text-dim font-mono uppercase tracking-widest"
                  >
                    {`> ${text}`}
                  </motion.p>
                ))}
              </div>
            </div>
          </motion.div>
        ) : isAuthenticated ? (
          <motion.div
            key="shell"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
            className="h-full w-full"
          >
            <Shell />
          </motion.div>
        ) : (
          <motion.div
            key="auth"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            transition={{ duration: 0.5 }}
            className="h-full w-full"
          >
            <AuthScreen onAuthSuccess={handleAuthSuccess} />
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
