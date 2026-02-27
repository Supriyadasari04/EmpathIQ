'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Smile, Meh, Frown, X, ArrowRight, Heart, Sparkles, Zap } from 'lucide-react';
import { cn } from '@/lib/utils';

interface DailyCheckInProps {
    name: string;
    onClose: () => void;
    onSave: (val: number) => void;
}

export default function DailyCheckIn({ name, onClose, onSave }: DailyCheckInProps) {
    const [selected, setSelected] = useState<number | null>(null);

    const moods = [
        { val: 1, label: 'Distressed', icon: Frown, color: 'text-red-500', bg: 'bg-red-50' },
        { val: 2, label: 'Low Resonance', icon: Frown, color: 'text-orange-500', bg: 'bg-orange-50' },
        { val: 3, label: 'Steady Flow', icon: Meh, color: 'text-blue-500', bg: 'bg-blue-50' },
        { val: 4, label: 'Bright Signal', icon: Smile, color: 'text-blue-900', bg: 'bg-slate-50' },
        { val: 5, label: 'Radiant Peace', icon: Sparkles, color: 'text-yellow-600', bg: 'bg-yellow-50' },
    ];

    return (
        <div
            className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6 bg-[#D3D3FF]/40 backdrop-blur-md"
            aria-modal="true"
            role="dialog"
            onClick={(e) => e.stopPropagation()}
        >
            <motion.div
                initial={{ scale: 0.95, opacity: 0, y: 10 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                className="w-full max-w-[360px] max-h-[85vh] overflow-y-auto bg-white/95 rounded-[16px] shadow-[0_20px_40px_-15px_rgba(0,0,0,0.12)] p-6 relative border border-white/60"
            >
                <div className="absolute top-4 right-4">
                    <button onClick={onClose} className="p-1 hover:bg-[var(--surface)] rounded-md transition-all">
                        <X className="w-4 h-4 text-[var(--secondary-text)] opacity-40" strokeWidth={1.5} />
                    </button>
                </div>

                <div className="space-y-6">
                    <div className="text-center mb-2">
                        <div className="w-12 h-12 bg-[#D3D3FF]/30 rounded-full flex items-center justify-center mx-auto mb-3">
                            <Sparkles className="w-5 h-5 text-[#8A8AEB]" strokeWidth={1.5} />
                        </div>
                        <h2 className="text-[17px] font-semibold tracking-tight">How's your mood, {name}?</h2>
                        <p className="text-[12px] text-[var(--secondary-text)] opacity-60 mt-1.5">Select the frequency that matches your state.</p>
                    </div>

                    <div className="space-y-2">
                        {moods.map((m) => (
                            <button
                                key={m.val}
                                onClick={() => setSelected(m.val)}
                                className={cn(
                                    "w-full flex items-center justify-between p-3 rounded-xl border transition-all text-left group",
                                    selected === m.val
                                        ? "border-[#D3D3FF] bg-[#D3D3FF]/10 shadow-sm"
                                        : "border-transparent bg-[var(--surface)] hover:bg-[var(--surface)]/60 text-[var(--primary-text)]"
                                )}
                            >
                                <div className="flex items-center gap-3">
                                    <div className={cn(
                                        "w-10 h-10 rounded-lg flex items-center justify-center transition-all",
                                        selected === m.val ? "bg-white" : m.bg
                                    )}>
                                        <m.icon className={cn("w-4 h-4", selected === m.val ? "text-[var(--accent)]" : m.color)} strokeWidth={1.5} />
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="font-semibold text-[13px] leading-none mb-1">{m.label}</span>
                                        <span className="text-[10px] text-[var(--secondary-text)] opacity-40 uppercase tracking-widest">Level {m.val}</span>
                                    </div>
                                </div>
                                <div className={cn(
                                    "w-4 h-4 rounded-full border-2 transition-all",
                                    selected === m.val ? "border-[var(--accent)] bg-[var(--accent)]" : "border-[var(--border)] bg-transparent"
                                )} />
                            </button>
                        ))}
                    </div>

                    <button
                        disabled={selected === null}
                        onClick={() => {
                            if (selected !== null) {
                                onSave(selected);
                                window.dispatchEvent(new CustomEvent('buddy_trigger', {
                                    detail: { type: 'check_in', val: selected }
                                }));
                            }
                        }}
                        className="w-full h-[44px] bg-[#111118] hover:bg-black text-white rounded-xl font-medium text-[13px] disabled:opacity-40 transition-all flex items-center justify-center gap-2 group shadow-md hover:shadow-lg mt-2"
                    >
                        Save Entry <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" strokeWidth={1.5} />
                    </button>
                </div>
            </motion.div>
        </div>
    );
}
