'use client';

import React from 'react';
import { motion } from 'framer-motion';

const AnimatedBackground: React.FC = () => {
    return (
        <div className="fixed inset-0 z-[-1] overflow-hidden bg-[#0a0a0f] pointer-events-none">
            {/* Perspective Grid */}
            <div
                className="absolute inset-0 opacity-[0.1]"
                style={{
                    perspective: '1000px',
                }}
            >
                <motion.div
                    className="absolute inset-[-100%] origin-center"
                    style={{
                        backgroundImage: `
              linear-gradient(to right, #00ff88 1px, transparent 1px),
              linear-gradient(to bottom, #00ff88 1px, transparent 1px)
            `,
                        backgroundSize: '80px 80px',
                        transform: 'rotateX(45deg)',
                    }}
                    animate={{
                        y: [0, 80],
                    }}
                    transition={{
                        duration: 3,
                        repeat: Infinity,
                        ease: "linear",
                    }}
                />
            </div>

            {/* Radial Glows for depth */}
            <motion.div
                className="absolute w-[1000px] h-[1000px] rounded-full"
                style={{
                    background: 'radial-gradient(circle, rgba(0, 255, 136, 0.08) 0%, transparent 70%)',
                    top: '-10%',
                    left: '-10%',
                    filter: 'blur(60px)',
                }}
                animate={{
                    scale: [1, 1.1, 1],
                    opacity: [0.5, 0.8, 0.5],
                }}
                transition={{
                    duration: 10,
                    repeat: Infinity,
                    ease: "easeInOut",
                }}
            />

            <motion.div
                className="absolute w-[800px] h-[800px] rounded-full"
                style={{
                    background: 'radial-gradient(circle, rgba(0, 212, 255, 0.06) 0%, transparent 70%)',
                    bottom: '0%',
                    right: '0%',
                    filter: 'blur(60px)',
                }}
                animate={{
                    scale: [1.2, 1, 1.2],
                    opacity: [0.4, 0.7, 0.4],
                }}
                transition={{
                    duration: 12,
                    repeat: Infinity,
                    ease: "easeInOut",
                }}
            />

            {/* Data Streams (Horizontal) */}
            {[...Array(6)].map((_, i) => (
                <motion.div
                    key={`stream-${i}`}
                    className="absolute h-[1px] bg-gradient-to-r from-transparent via-[#00ff88] to-transparent opacity-[0.2]"
                    style={{
                        top: `${20 + i * 15}%`,
                        width: '200%',
                        left: '-50%',
                    }}
                    animate={{
                        x: ['-50%', '0%'],
                    }}
                    transition={{
                        duration: 10 + i * 2,
                        repeat: Infinity,
                        ease: "linear",
                    }}
                />
            ))}

            {/* Floating Particles */}
            {[...Array(30)].map((_, i) => (
                <motion.div
                    key={`particle-${i}`}
                    className="absolute bg-[#00ff88] rounded-full opacity-0"
                    style={{
                        width: Math.random() * 2 + 1 + 'px',
                        height: Math.random() * 2 + 1 + 'px',
                        left: Math.random() * 100 + '%',
                        top: Math.random() * 100 + '%',
                        filter: 'blur(1px) drop-shadow(0 0 5px #00ff88)',
                    }}
                    animate={{
                        y: [0, -100],
                        opacity: [0, 0.6, 0],
                        scale: [0, 1.5, 0],
                    }}
                    transition={{
                        duration: Math.random() * 4 + 4,
                        repeat: Infinity,
                        ease: "easeOut",
                        delay: Math.random() * 10,
                    }}
                />
            ))}

            {/* CRT Scanline Overlay */}
            <div className="absolute inset-0 pointer-events-none opacity-[0.03] overflow-hidden">
                <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_2px,3px_100%]" />
                <motion.div
                    className="absolute top-0 left-0 right-0 h-[2px] bg-[#00ff88] shadow-[0_0_15px_#00ff88]"
                    animate={{
                        top: ['-10%', '110%'],
                    }}
                    transition={{
                        duration: 10,
                        repeat: Infinity,
                        ease: "linear",
                    }}
                />
            </div>

            {/* Final Vignette & Darkening */}
            <div className="absolute inset-0 bg-[radial-gradient(circle,transparent_40%,rgba(0,0,0,0.5)_100%)]" />
        </div>
    );
};

export default AnimatedBackground;
