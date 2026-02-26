'use client';

import React, { useState } from 'react';
import { ShieldCheck, X, Lock, EyeOff, Shield } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

export default function TrustPopover() {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="relative">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={cn(
                    "w-8 h-8 flex items-center justify-center rounded-lg transition-all border border-[var(--border)] hover:bg-green-50 hover:text-green-600 hover:border-green-100",
                    isOpen ? "bg-green-50 text-green-600 border-green-100 shadow-xs" : "bg-transparent text-[var(--secondary-text)] opacity-40 hover:opacity-100"
                )}
            >
                <ShieldCheck className="w-4 h-4" strokeWidth={1.5} />
            </button>

            <AnimatePresence>
                {isOpen && (
                    <>
                        <div className="fixed inset-0 z-[60]" onClick={() => setIsOpen(false)} />
                        <motion.div
                            initial={{ opacity: 0, y: 8, scale: 0.98 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 8, scale: 0.98 }}
                            className="absolute right-0 mt-2 w-72 bg-white border border-[var(--border)] rounded-xl shadow-lg z-[70] overflow-hidden flex flex-col origin-top-right"
                        >
                            <div className="px-4 py-3 border-b border-[var(--border)] flex items-center justify-between bg-green-50/50">
                                <div className="flex items-center gap-2">
                                    <ShieldCheck className="w-3.5 h-3.5 text-green-600" strokeWidth={1.5} />
                                    <h3 className="text-[12px] font-semibold tracking-tight text-green-900">Sanctuary Trust</h3>
                                </div>
                                <button onClick={() => setIsOpen(false)} className="p-1 hover:bg-white rounded-md transition-colors">
                                    <X className="w-3 h-3 text-green-400" />
                                </button>
                            </div>

                            <div className="p-5 space-y-5">
                                <div className="flex flex-col items-center text-center gap-2">
                                    <div className="w-10 h-10 bg-green-50 rounded-full flex items-center justify-center">
                                        <Lock className="w-5 h-5 text-green-600" strokeWidth={1.5} />
                                    </div>
                                    <p className="text-[11px] text-[var(--secondary-text)] leading-relaxed">
                                        Your journal entries and emotional data are protected by clinical-grade encryption.
                                    </p>
                                </div>

                                <div className="space-y-3">
                                    <div className="flex items-center gap-3">
                                        <div className="w-6 h-6 rounded-lg bg-[var(--surface)] flex items-center justify-center">
                                            <EyeOff className="w-3 h-3 opacity-40" />
                                        </div>
                                        <span className="text-[11px] font-medium opacity-70">No Third-Party Access</span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <div className="w-6 h-6 rounded-lg bg-[var(--surface)] flex items-center justify-center">
                                            <Shield className="w-3 h-3 opacity-40" />
                                        </div>
                                        <span className="text-[11px] font-medium opacity-70">Zero-Knowledge Storage</span>
                                    </div>
                                </div>

                                <button
                                    onClick={() => {
                                        window.location.href = '/docs?topic=privacy';
                                        setIsOpen(false);
                                    }}
                                    className="w-full py-2 flex items-center justify-center gap-2 bg-white border border-[var(--border)] rounded-lg text-[11px] font-semibold hover:bg-[var(--surface)] transition-all"
                                >
                                    Privacy Manifesto
                                </button>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
}
