'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Heart } from 'lucide-react';

export default function AuthLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen bg-[var(--background)] flex items-center justify-center p-6 select-none">
            <motion.div
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4 }}
                className="w-full max-w-[360px]"
            >
                <div className="text-center mb-8">
                    <div className="w-10 h-10 bg-[var(--accent)] rounded-xl flex items-center justify-center mx-auto mb-4 shadow-xs">
                        <Heart className="text-[var(--primary-text)] w-5 h-5" strokeWidth={1.5} />
                    </div>
                </div>
                {children}
            </motion.div>
        </div>
    );
}
