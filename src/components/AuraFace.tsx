'use client';

import React from 'react';
import { motion } from 'framer-motion';

export type AuraMood = 'calm' | 'happy' | 'alert' | 'thinking';

interface AuraFaceProps {
    mood: AuraMood;
    className?: string;
}

export default function AuraFace({ mood, className }: AuraFaceProps) {
    return (
        <div className={className}>
            <svg viewBox="0 0 100 100" className="w-full h-full fill-current">
                {/* Eyes */}
                <motion.g>
                    {/* Left Eye */}
                    <motion.ellipse
                        initial={{ ry: 4 }}
                        animate={{
                            ry: mood === 'alert' ? 6 : mood === 'happy' ? 2 : 4,
                            cy: mood === 'happy' ? 42 : 45,
                            rx: mood === 'thinking' ? 2 : 4
                        }}
                        cx="35" cy="45" rx="4" ry="4"
                    />
                    {/* Right Eye */}
                    <motion.ellipse
                        initial={{ ry: 4 }}
                        animate={{
                            ry: mood === 'alert' ? 6 : mood === 'happy' ? 2 : 4,
                            cy: mood === 'happy' ? 42 : 45,
                            rx: mood === 'thinking' ? 2 : 4
                        }}
                        cx="65" cy="45" rx="4" ry="4"
                    />

                    {/* Blinking Logic */}
                    <motion.rect
                        animate={{ height: [0, 10, 0] }}
                        transition={{ repeat: Infinity, duration: 4, times: [0, 0.05, 0.1] }}
                        x="30" y="40" width="40" height="0" fill="white" className="mix-blend-destination-out"
                    />
                </motion.g>

                {/* Mouth */}
                <motion.path
                    initial={{ d: "M 35 70 Q 50 70 65 70" }}
                    animate={{
                        d: mood === 'happy'
                            ? "M 30 65 Q 50 80 70 65"
                            : mood === 'alert'
                                ? "M 45 75 Q 50 75 55 75"
                                : mood === 'thinking'
                                    ? "M 40 70 Q 50 65 60 70"
                                    : "M 35 70 Q 50 70 65 70"
                    }}
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="4"
                    strokeLinecap="round"
                />
            </svg>
        </div>
    );
}
