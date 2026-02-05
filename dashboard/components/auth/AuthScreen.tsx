'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Mail, Lock, User, ArrowRight, Wallet, Github, Twitter, Loader2 } from 'lucide-react';
import { clsx } from 'clsx';
import dynamic from 'next/dynamic';

import { useWallet } from '@solana/wallet-adapter-react';
import { useEffect } from 'react';

const WalletMultiButton = dynamic(
    () => import('@solana/wallet-adapter-react-ui').then((mod) => mod.WalletMultiButton),
    { ssr: false },
);

interface CyberInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label: string;
    icon: React.ElementType;
}

const CyberInput = ({ label, icon: Icon, ...props }: CyberInputProps) => {
    const [isFocused, setIsFocused] = useState(false);

    return (
        <div className="space-y-1.5 w-full group">
            <label className="text-[10px] font-bold text-cyber-text-dim uppercase tracking-[0.2em] ml-1 group-hover:text-cyber-green transition-colors">
                {label}
            </label>
            <div className="relative">
                <div className={clsx(
                    "absolute inset-0 bg-cyber-green/5 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none",
                    isFocused && "opacity-100"
                )} />
                <Icon
                    size={16}
                    className={clsx(
                        "absolute left-4 top-1/2 -translate-y-1/2 transition-colors duration-300 z-10",
                        isFocused ? "text-cyber-green" : "text-cyber-text-dim"
                    )}
                />
                <input
                    {...props}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    className={clsx(
                        "w-full bg-cyber-card/40 backdrop-blur-xl border border-cyber-border rounded-xl px-4 py-3 pl-11 text-sm text-white transition-all duration-300 outline-none relative z-0",
                        isFocused && "border-cyber-green/50 shadow-[0_0_20px_rgba(0,255,136,0.1)]"
                    )}
                />
            </div>
        </div>
    );
};

export default function AuthScreen({ onAuthSuccess }: { onAuthSuccess: () => void }) {
    const [mode, setMode] = useState<'login' | 'register'>('login');
    const [loading, setLoading] = useState(false);
    const { connected } = useWallet();

    // Auto-auth when wallet connects
    useEffect(() => {
        if (connected) {
            setLoading(true);
            const timer = setTimeout(() => {
                onAuthSuccess();
                setLoading(false);
            }, 1500);
            return () => clearTimeout(timer);
        }
    }, [connected, onAuthSuccess]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        // Simulate auth
        setTimeout(() => {
            setLoading(false);
            onAuthSuccess();
        }, 2000);
    };

    return (
        <div className="min-h-screen w-full flex items-center justify-center p-4 relative overflow-hidden">
            {/* Decorative Background Elements */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-[600px] h-[600px] bg-cyber-green/5 blur-[120px] rounded-full pointer-events-none" />

            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-[450px] relative z-10"
            >
                <div className="text-center mb-8">
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", damping: 12, delay: 0.2 }}
                        className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-cyber-green/10 border border-cyber-green/30 shadow-[0_0_30px_rgba(0,255,136,0.1)] mb-6"
                    >
                        <Shield size={40} className="text-cyber-green" />
                    </motion.div>
                    <h1 className="text-4xl font-black text-white tracking-tighter uppercase mb-2">
                        Rekt <span className="text-cyber-green glow-text-green">Protect</span>
                    </h1>
                    <p className="text-xs text-cyber-text-dim font-mono tracking-widest">
                        AUTHENTICATION_REQUIRED // SYSTEM_V0.1
                    </p>
                </div>

                <div className="bg-cyber-card/40 backdrop-blur-2xl border border-cyber-border rounded-3xl p-8 shadow-2xl overflow-hidden relative group">
                    {/* Internal Glow */}
                    <div className="absolute -top-[50%] -left-[50%] w-[200%] h-[200%] bg-[radial-gradient(circle_at_center,rgba(0,255,136,0.03)_0%,transparent_70%)] pointer-events-none" />

                    <div className="flex bg-black/40 p-1 rounded-2xl mb-8 relative z-10">
                        <button
                            onClick={() => setMode('login')}
                            className={clsx(
                                "flex-1 py-2 text-xs font-bold uppercase tracking-widest rounded-xl transition-all duration-300",
                                mode === 'login' ? "bg-cyber-green text-black" : "text-cyber-text-dim hover:text-white"
                            )}
                        >
                            Login
                        </button>
                        <button
                            onClick={() => setMode('register')}
                            className={clsx(
                                "flex-1 py-2 text-xs font-bold uppercase tracking-widest rounded-xl transition-all duration-300",
                                mode === 'register' ? "bg-cyber-green text-black" : "text-cyber-text-dim hover:text-white"
                            )}
                        >
                            Register
                        </button>
                    </div>

                    <AnimatePresence mode="wait">
                        <motion.div
                            key={mode}
                            initial={{ opacity: 0, x: mode === 'login' ? -20 : 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: mode === 'login' ? 20 : -20 }}
                            transition={{ duration: 0.3 }}
                            className="space-y-5 relative z-10"
                        >
                            <form onSubmit={handleSubmit} className="space-y-5">
                                {mode === 'register' && (
                                    <CyberInput
                                        label="Username"
                                        icon={User}
                                        type="text"
                                        placeholder="Enter your system alias"
                                        required
                                    />
                                )}
                                <CyberInput
                                    label="Email Address"
                                    icon={Mail}
                                    type="email"
                                    placeholder="email@rektprotect.com"
                                    required
                                />
                                <CyberInput
                                    label="Password"
                                    icon={Lock}
                                    type="password"
                                    placeholder="••••••••"
                                    required
                                />

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full bg-cyber-green text-black py-4 rounded-xl font-black text-sm uppercase tracking-[0.2em] flex items-center justify-center gap-3 group transition-all duration-500 hover:shadow-[0_0_30px_rgba(0,255,136,0.3)] hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50"
                                >
                                    {loading ? (
                                        <Loader2 size={18} className="animate-spin" />
                                    ) : (
                                        <>
                                            {mode === 'login' ? 'Initiate Link' : 'Register Core'}
                                            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                                        </>
                                    )}
                                </button>
                            </form>

                            <div className="relative">
                                <div className="absolute inset-0 flex items-center">
                                    <div className="w-full border-t border-cyber-border/50" />
                                </div>
                                <div className="relative flex justify-center text-[10px]">
                                    <span className="px-3 bg-[#0a0a0f] text-cyber-text-dim font-bold uppercase tracking-widest">
                                        Or alternative protocols
                                    </span>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <button
                                    onClick={() => {
                                        setLoading(true);
                                        setTimeout(() => {
                                            setLoading(false);
                                            onAuthSuccess();
                                        }, 1500);
                                    }}
                                    className="flex items-center justify-center gap-2 py-3 bg-black/40 border border-cyber-border rounded-xl text-[10px] font-bold uppercase tracking-widest text-cyber-text-dim hover:border-cyber-blue hover:text-cyber-blue transition-all duration-300"
                                >
                                    <Github size={14} />
                                    Github
                                </button>
                                <button
                                    onClick={() => {
                                        setLoading(true);
                                        setTimeout(() => {
                                            setLoading(false);
                                            onAuthSuccess();
                                        }, 1500);
                                    }}
                                    className="flex items-center justify-center gap-2 py-3 bg-black/40 border border-cyber-border rounded-xl text-[10px] font-bold uppercase tracking-widest text-cyber-text-dim hover:border-cyber-blue hover:text-cyber-blue transition-all duration-300"
                                >
                                    <Twitter size={14} />
                                    Twitter
                                </button>
                            </div>

                            <div className="mt-4 pt-4 border-t border-cyber-border/30 flex flex-col items-center">
                                <p className="text-[10px] text-cyber-text-dim font-bold uppercase tracking-widest mb-3">
                                    Decentralized Web3 Access
                                </p>
                                <div className="wallet-adapter-custom">
                                    <WalletMultiButton />
                                </div>
                            </div>
                        </motion.div>
                    </AnimatePresence>
                </div>

                <p className="text-[10px] text-center text-cyber-text-dim mt-8 font-mono leading-relaxed opacity-50">
                    BY PROCEEDING, YOU AGREE TO OUR <span className="text-cyber-green underline cursor-pointer">SERVICE_PROTOCOL</span><br />
                    AND <span className="text-cyber-green underline cursor-pointer">PRIVACY_ENCRYPTION_STANDARDS</span>
                </p>
            </motion.div>

            {/* CSS Overrides for Wallet Button to match theme */}
            <style jsx global>{`
        .wallet-adapter-button {
          background-color: transparent !important;
          border: 1px solid rgba(0, 255, 136, 0.2) !important;
          border-radius: 12px !important;
          font-family: inherit !important;
          font-size: 10px !important;
          font-weight: 800 !important;
          text-transform: uppercase !important;
          letter-spacing: 0.1em !important;
          height: 40px !important;
          width: 100% !important;
          justify-content: center !important;
          transition: all 0.3s ease !important;
        }
        .wallet-adapter-button:not([disabled]):hover {
          background-color: rgba(0, 255, 136, 0.05) !important;
          border-color: rgba(0, 255, 136, 0.5) !important;
          box-shadow: 0 0 20px rgba(0, 255, 136, 0.1) !important;
        }
        .wallet-adapter-button-trigger {
          background-color: transparent !important;
        }
      `}</style>
        </div>
    );
}
