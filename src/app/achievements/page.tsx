'use client';

import React from 'react';
import { motion } from 'framer-motion';
import {
    Trophy,
    Lock,
    Star,
    Sparkles,
    ArrowLeft,
    CheckCircle2,
    Target,
    Zap
} from 'lucide-react';
import { useApp } from '@/lib/store';
import Link from 'next/link';
import { cn } from '@/lib/utils';

export default function AchievementsPage() {
    const { achievements, getStats } = useApp();
    const { unlockedCount, score } = getStats();

    return (
        <div className="max-w-4xl mx-auto pb-16">
            {/* Header */}
            <header className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
                <div className="space-y-4">
                    <Link href="/dashboard" className="w-8 h-8 rounded-lg bg-[var(--surface)] border border-[var(--border)] flex items-center justify-center hover:bg-white transition-all group">
                        <ArrowLeft className="w-4 h-4 text-[var(--secondary-text)] group-hover:-translate-x-0.5 transition-transform" strokeWidth={1.5} />
                    </Link>
                    <div>
                        <h1 className="text-[22px] font-semibold tracking-tight">Achievements</h1>
                        <p className="text-[13px] text-[var(--secondary-text)] leading-relaxed mt-0.5">Collecting artifacts of your resilience.</p>
                    </div>
                </div>

                <div className="flex gap-2">
                    <div className="bg-white border border-[var(--border)] p-3 rounded-xl shadow-xs min-w-[120px]">
                        <p className="text-[10px] font-medium uppercase tracking-wider text-[var(--secondary-text)] opacity-40 mb-0.5">Score</p>
                        <p className="text-[18px] font-semibold">{score}</p>
                    </div>
                    <div className="bg-[var(--accent)] border border-[var(--accent)] p-3 rounded-xl shadow-xs min-w-[120px]">
                        <p className="text-[10px] font-medium uppercase tracking-wider text-[var(--primary-text)] opacity-40 mb-0.5">Unlocked</p>
                        <p className="text-[18px] font-semibold flex items-center gap-1.5">
                            {unlockedCount} <span className="text-[12px] opacity-40 font-medium">/ {achievements.length}</span>
                        </p>
                    </div>
                </div>
            </header>

            {/* Achievements Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {achievements.map((achievement, idx) => (
                    <motion.div
                        key={achievement.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.05 }}
                        className={cn(
                            "relative overflow-hidden card bg-white p-6 flex flex-col items-center text-center group transition-all shadow-xs",
                            !achievement.unlocked && "bg-[var(--surface)] opacity-50 grayscale"
                        )}
                    >
                        {/* Status Badge */}
                        <div className="absolute top-3 right-3 text-[9px] font-medium uppercase tracking-wider px-1.5 py-0.5 rounded bg-[var(--surface)] border border-[var(--border)] text-[var(--secondary-text)] opacity-40">
                            {achievement.rarity}
                        </div>

                        {/* Icon Container */}
                        <div className={cn(
                            "w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-all duration-300",
                            achievement.unlocked ? "bg-[var(--accent)] text-[var(--primary-text)] shadow-sm" : "bg-white border border-[var(--border)] text-[var(--secondary-text)] opacity-20"
                        )}>
                            {achievement.unlocked ? (
                                <Star className="w-5 h-5" strokeWidth={2} />
                            ) : (
                                <Lock className="w-5 h-5" strokeWidth={1.5} />
                            )}
                        </div>

                        <h3 className="text-[15px] font-semibold mb-1">{achievement.title}</h3>
                        <p className="text-[11px] text-[var(--secondary-text)] opacity-60 leading-relaxed mb-4 px-2">
                            {achievement.description}
                        </p>

                        {/* Progress Bar (if locked) */}
                        {!achievement.unlocked && achievement.progress !== undefined && (
                            <div className="w-full space-y-1.5">
                                <div className="flex justify-between text-[9px] font-medium uppercase tracking-wider text-[var(--secondary-text)] opacity-40">
                                    <span>Progress</span>
                                    <span>{achievement.progress}%</span>
                                </div>
                                <div className="h-1 w-full bg-white border border-[var(--border)] rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-[var(--accent)] transition-all duration-1000"
                                        style={{ width: `${achievement.progress}%` }}
                                    />
                                </div>
                            </div>
                        )}

                        {achievement.unlocked && (
                            <div className="flex items-center gap-1.5 text-blue-400">
                                <CheckCircle2 className="w-3.5 h-3.5" />
                                <span className="text-[9px] font-medium uppercase tracking-wider">Unlocked</span>
                            </div>
                        )}
                    </motion.div>
                ))}

                {/* Secret Achievement */}
                <div className="card border-dashed border-[var(--border)] bg-transparent flex flex-col items-center justify-center p-6 opacity-30">
                    <Sparkles className="w-5 h-5 text-[var(--secondary-text)] mb-3" />
                    <p className="text-[10px] font-medium uppercase tracking-wider text-[var(--secondary-text)]">Hidden Artifact</p>
                </div>
            </div>
        </div>
    );
}
