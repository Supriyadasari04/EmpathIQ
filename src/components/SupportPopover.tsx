'use client';

import React, { useState } from 'react';
import { AlertCircle, X, LifeBuoy, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

export default function SupportPopover() {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="relative">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={cn(
                    "w-8 h-8 flex items-center justify-center rounded-lg transition-all border border-[var(--border)] hover:bg-red-50 hover:text-red-600 hover:border-red-100",
                    isOpen ? "bg-red-50 text-red-600 border-red-100 shadow-xs" : "bg-transparent text-[var(--secondary-text)] opacity-40 hover:opacity-100"
                )}
            >
                <AlertCircle className="w-4 h-4" strokeWidth={1.5} />
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
                            <div className="px-4 py-3 border-b border-[var(--border)] flex items-center justify-between bg-red-50/50">
                                <div className="flex items-center gap-2">
                                    <AlertCircle className="w-3.5 h-3.5 text-red-600" strokeWidth={1.5} />
                                    <h3 className="text-[12px] font-semibold tracking-tight text-red-900">Urgent Support</h3>
                                </div>
                                <button onClick={() => setIsOpen(false)} className="p-1 hover:bg-white rounded-md transition-colors">
                                    <X className="w-3 h-3 text-red-400" />
                                </button>
                            </div>

                            <div className="p-4 space-y-4">
                                <p className="text-[11px] text-red-800/70 leading-relaxed font-medium">
                                    If you are in immediate danger, please contact local emergency services immediately.
                                </p>

                                <div className="space-y-2">
                                    <div className="p-3 bg-[var(--surface)] border border-[var(--border)] rounded-lg flex items-center justify-between group cursor-pointer hover:border-[var(--accent)] transition-all">
                                        <div className="flex flex-col">
                                            <span className="text-[9px] uppercase tracking-widest font-bold opacity-30">US/Global</span>
                                            <span className="text-[13px] font-bold text-[var(--primary-text)]">988</span>
                                        </div>
                                        <ChevronRight className="w-3.5 h-3.5 opacity-20 group-hover:opacity-100 transition-opacity" />
                                    </div>
                                    <div className="p-3 bg-[var(--surface)] border border-[var(--border)] rounded-lg flex items-center justify-between group cursor-pointer hover:border-[var(--accent)] transition-all">
                                        <div className="flex flex-col">
                                            <span className="text-[9px] uppercase tracking-widest font-bold opacity-30">UK Specific</span>
                                            <span className="text-[13px] font-bold text-[var(--primary-text)]">111 / 999</span>
                                        </div>
                                        <ChevronRight className="w-3.5 h-3.5 opacity-20 group-hover:opacity-100 transition-opacity" />
                                    </div>
                                </div>

                                <button
                                    onClick={() => {
                                        window.location.href = '/docs?topic=safety';
                                        setIsOpen(false);
                                    }}
                                    className="w-full py-2 flex items-center justify-center gap-2 bg-white border border-[var(--border)] rounded-lg text-[11px] font-semibold hover:bg-[var(--surface)] transition-all"
                                >
                                    <LifeBuoy className="w-3.5 h-3.5" strokeWidth={1.5} />
                                    View Recovery Protocols
                                </button>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
}
