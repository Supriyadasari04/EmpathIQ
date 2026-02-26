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
        <div className="fixed inset-0 z-[500] flex items-center justify-center p-6 bg-black/5 backdrop-blur-sm">
            <motion.div
                initial={{ scale: 0.98, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="w-full max-w-sm bg-white rounded-2xl shadow-xl p-8 relative overflow-hidden border border-[var(--border)]"
            >
                <div className="absolute top-4 right-4">
                    <button onClick={onClose} className="p-1 hover:bg-[var(--surface)] rounded-md transition-all">
                        <X className="w-4 h-4 text-[var(--secondary-text)] opacity-40" strokeWidth={1.5} />
                    </button>
                </div>

                <div className="space-y-6">
                    <div className="text-center">
                        <h2 className="text-[17px] font-semibold tracking-tight">How's your mood, {name}?</h2>
                        <p className="text-[12px] text-[var(--secondary-text)] opacity-40 mt-1">Select the frequency that matches your state.</p>
                    </div>

                    <div className="space-y-2">
                        {moods.map((m) => (
                            <button
                                key={m.val}
                                onClick={() => setSelected(m.val)}
                                className={cn(
                                    "w-full flex items-center justify-between p-3 rounded-xl border transition-all text-left group",
                                    selected === m.val
                                        ? "border-[var(--accent)] bg-[var(--surface)] shadow-xs"
                                        : "border-[var(--border)] bg-white hover:bg-[var(--surface)] text-[var(--primary-text)]"
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
                        className="w-full h-10 btn-primary rounded-lg font-medium text-[13px] disabled:opacity-40 transition-all flex items-center justify-center gap-2 group"
                    >
                        Save Entry <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" strokeWidth={1.5} />
                    </button>
                </div>

            </motion.div>
        </div>
    );
}
