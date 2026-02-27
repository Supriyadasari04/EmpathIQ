'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    BarChart3,
    Calendar,
    ChevronLeft,
    ChevronRight,
    Sparkles
} from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { useApp } from '@/lib/store';

export default function AnalyticsPage() {
    const { moodPixels, setMoodPixel, reflections, loading } = useApp();
    const [selectedYear, setSelectedYear] = useState(2026);
    const [selectedMonth, setSelectedMonth] = useState<number | 'all'>('all');
    const [editingDate, setEditingDate] = useState<string | null>(null);

    if (loading) {
        return (
            <div className="h-[60vh] flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-4 border-blue-900/5 border-t-blue-600 rounded-full animate-spin" />
                    <p className="text-sm font-bold text-blue-900/50 uppercase tracking-widest">Calculating Trends...</p>
                </div>
            </div>
        );
    }

    const months = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];

    // Calculate dynamic stats based on reflections
    const hasData = reflections.length > 0 || Object.keys(moodPixels).length > 0;

    const emotionDistribution = reflections.reduce((acc: any, curr) => {
        acc[curr.mood] = (acc[curr.mood] || 0) + 1;
        return acc;
    }, {});

    const trendData = reflections.slice(-7).map(r => ({
        day: r.date.split(',')[0],
        mood: r.mood,
        val: r.mood === 'Happy' ? 5 : r.mood === 'Neutral' ? 3 : 1
    }));

    const getDaysForYear = (year: number) => {
        const days = [];
        for (let m = 0; m < 12; m++) {
            const daysInMonth = new Date(year, m + 1, 0).getDate();
            for (let d = 1; d <= daysInMonth; d++) {
                days.push(new Date(year, m, d));
            }
        }
        return days;
    };

    const yearDays = getDaysForYear(selectedYear);

    return (
        <div className="space-y-8 pb-16">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div className="space-y-1">
                    <h1 className="text-[22px] font-semibold tracking-tight">Mood Sanctuary</h1>
                    <p className="text-[13px] text-[var(--secondary-text)]">Holistic insights from your private logs.</p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2 bg-white border border-[var(--border)] p-1 rounded-lg shadow-sm">
                        <button onClick={() => setSelectedYear(selectedYear - 1)} className="p-1 hover:bg-[rgba(0,0,0,0.03)] rounded-md"><ChevronLeft className="w-3.5 h-3.5" strokeWidth={1.5} /></button>
                        <span className="text-[13px] font-medium px-2">{selectedYear}</span>
                        <button onClick={() => setSelectedYear(selectedYear + 1)} className="p-1 hover:bg-[rgba(0,0,0,0.03)] rounded-md"><ChevronRight className="w-3.5 h-3.5" strokeWidth={1.5} /></button>
                    </div>
                </div>
            </div>

            {!hasData ? (
                <EmptyAnalyticsState />
            ) : (
                <>
                    {/* Intensity Pixels (Yearly Heatmap) */}
                    <section className="card bg-white p-6 relative overflow-hidden group">
                        <div className="flex flex-col md:flex-row md:items-start justify-between mb-8 gap-4 relative z-10">
                            <div className="space-y-1">
                                <h2 className="text-[18px] font-semibold tracking-tight flex items-center gap-2">
                                    <div className="w-8 h-8 rounded-lg bg-[var(--accent)] text-[var(--primary-text)] flex items-center justify-center shadow-sm">
                                        <Calendar className="w-4 h-4" strokeWidth={1.5} />
                                    </div>
                                    Wellness Grid
                                </h2>
                                <p className="text-[12px] text-[var(--secondary-text)] leading-relaxed">
                                    Your emotional landscape for {selectedYear}.
                                </p>
                            </div>
                            <div className="flex items-center gap-4">
                                <div className="flex flex-col gap-2 bg-[var(--surface)] p-2 rounded-lg border border-[var(--border)]">
                                    <span className="text-[9px] font-semibold text-[var(--secondary-text)] uppercase tracking-wider opacity-60">Status Scale</span>
                                    <div className="flex items-center gap-3">
                                        {[1, 2, 3, 4, 5].map(i => (
                                            <div key={i} className="flex items-center gap-1.5">
                                                <div className={cn("w-2.5 h-2.5 rounded-[2px] shadow-xs", getPixelColor(i))} />
                                                <span className="text-[10px] font-medium text-[var(--secondary-text)] opacity-60">{getIntensityEmotion(i)}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 relative z-10">
                            {months.map((monthName, mIdx) => {
                                const daysInMonthCount = new Date(selectedYear, mIdx + 1, 0).getDate();
                                const daysInMonth = [];
                                for (let d = 1; d <= daysInMonthCount; d++) {
                                    daysInMonth.push(new Date(selectedYear, mIdx, d));
                                }

                                return (
                                    <div key={monthName} className="space-y-2">
                                        <h3 className="text-[11px] font-semibold uppercase tracking-wider text-[var(--secondary-text)] opacity-40 px-0.5">{monthName}</h3>
                                        <div className="grid grid-cols-7 gap-1">
                                            {daysInMonth.map((dateObj) => {
                                                const dateKey = dateObj.toISOString().split('T')[0];
                                                const intensity = moodPixels[dateKey] || 0;
                                                return (
                                                    <Pixel
                                                        key={dateKey}
                                                        dateKey={dateKey}
                                                        intensity={intensity}
                                                        editingDate={editingDate}
                                                        setEditingDate={setEditingDate}
                                                        setMoodPixel={setMoodPixel}
                                                    />
                                                );
                                            })}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        {/* Background Flair */}
                        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/5 blur-[120px] rounded-full translate-x-1/2 -translate-y-1/2 pointer-events-none" />
                        <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-600/5 blur-[100px] rounded-full -translate-x-1/2 translate-y-1/2 pointer-events-none" />
                    </section>

                    {/* AI Synthesis & Insights */}
                    <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
                        <section className="card bg-white p-6 lg:col-span-3">
                            <h2 className="text-[11px] font-medium uppercase tracking-wider text-[var(--secondary-text)] mb-6">Reflection Synthesis</h2>
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
                                {Object.entries(emotionDistribution).length > 0 ? (
                                    Object.entries(emotionDistribution as Record<string, number>).map(([mood, count]) => {
                                        const percentage = Math.round((count / reflections.length) * 100);
                                        return (
                                            <div key={mood} className="space-y-3">
                                                <div className="flex justify-between items-end">
                                                    <span className="text-[13px] font-medium flex items-center gap-2">
                                                        <div className={cn(
                                                            "w-1.5 h-1.5 rounded-full",
                                                            mood === 'Happy' ? "bg-green-400" : mood === 'Neutral' ? "bg-blue-300" : "bg-red-400"
                                                        )} />
                                                        {mood}
                                                    </span>
                                                    <span className="text-[11px] text-[var(--secondary-text)] opacity-40">{percentage}%</span>
                                                </div>
                                                <div className="h-1 w-full bg-[var(--surface)] rounded-full overflow-hidden">
                                                    <motion.div
                                                        initial={{ width: 0 }}
                                                        animate={{ width: `${percentage}%` }}
                                                        transition={{ duration: 1 }}
                                                        className="h-full bg-[var(--accent)] rounded-full"
                                                    />
                                                </div>
                                            </div>
                                        );
                                    })
                                ) : (
                                    <div className="col-span-3 py-4 text-center text-[var(--secondary-text)] opacity-20 text-[13px]">Awaiting signals...</div>
                                )}
                            </div>
                        </section>

                        <section className="card bg-[var(--accent)] text-[var(--primary-text)] p-6 flex flex-col justify-between relative overflow-hidden shadow-sm border-none">
                            <div className="relative z-10">
                                <h3 className="text-[11px] font-medium uppercase tracking-wider opacity-60 mb-2">Resonance</h3>
                                {Object.entries(emotionDistribution).length > 0 ? (
                                    <div>
                                        <h4 className="text-[20px] font-semibold tracking-tight">
                                            {Object.entries(emotionDistribution as Record<string, number>).sort((a, b) => b[1] - a[1])[0][0]}
                                        </h4>
                                    </div>
                                ) : (
                                    <p className="text-[11px] font-medium uppercase opacity-20 mt-2">No Signal</p>
                                )}
                            </div>
                        </section>
                    </div>
                </>
            )}
        </div>
    );
}

function Pixel({ dateKey, intensity, editingDate, setEditingDate, setMoodPixel }: {
    dateKey: string;
    intensity: number;
    editingDate: string | null;
    setEditingDate: (d: string | null) => void;
    setMoodPixel: (date: string, intensity: number) => void;
}) {
    return (
        <div className="relative">
            <motion.div
                whileHover={{ scale: 1.15 }}
                onClick={() => setEditingDate(editingDate === dateKey ? null : dateKey)}
                className={cn(
                    "w-[10px] h-[10px] sm:w-[12px] sm:h-[12px] rounded-[3px] transition-all cursor-pointer bg-white shadow-xs border border-[var(--border)]",
                    getPixelColor(intensity),
                    editingDate === dateKey ? "ring-2 ring-[var(--accent)] ring-offset-1" : ""
                )}
                title={`${dateKey}: ${getIntensityEmotion(intensity)}`}
            />
            <AnimatePresence>
                {editingDate === dateKey && (
                    <motion.div
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 8 }}
                        className="absolute top-full left-1/2 -translate-x-1/2 mt-2 z-[100] bg-white border border-[var(--border)] p-2 rounded-lg shadow-md flex gap-1 min-w-[160px]"
                    >
                        <div className="grid grid-cols-2 gap-2">
                            {[1, 2, 3, 4, 5].map(lvl => (
                                <button
                                    key={lvl}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setMoodPixel(dateKey, lvl);
                                        setEditingDate(null);
                                    }}
                                    className={cn(
                                        "h-8 px-2 rounded-md transition-all flex items-center gap-1.5 text-[11px] font-medium shadow-xs",
                                        getPixelColor(lvl),
                                        "text-[var(--primary-text)]"
                                    )}
                                >
                                    {getIntensityEmotion(lvl)}
                                </button>
                            ))}
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setMoodPixel(dateKey, 0);
                                    setEditingDate(null);
                                }}
                                className="col-span-2 h-8 bg-[var(--surface)] rounded-md text-[11px] font-medium text-[var(--secondary-text)] hover:bg-[rgba(0,0,0,0.05)] transition-colors"
                            >
                                Clear
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

function getPixelColor(intensity: number) {
    switch (intensity) {
        case 0: return 'bg-blue-600/[0.03]';
        case 1: return 'bg-red-400';    // Distressed
        case 2: return 'bg-orange-300'; // Low
        case 3: return 'bg-blue-300';   // Steady
        case 4: return 'bg-blue-600';      // Bright (Deep)
        case 5: return 'bg-yellow-400'; // Radiant
        default: return 'bg-blue-600/[0.03]';
    }
}

function getIntensityEmotion(intensity: number) {
    switch (intensity) {
        case 0: return 'No Signal';
        case 1: return 'Distressed';
        case 2: return 'Low';
        case 3: return 'Steady';
        case 4: return 'Bright';
        case 5: return 'Radiant';
        default: return '';
    }
}

function EmptyAnalyticsState() {
    return (
        <div className="card py-32 flex flex-col items-center text-center bg-white">
            <div className="w-20 h-20 bg-blue-50 rounded-[28px] flex items-center justify-center mb-8">
                <BarChart3 className="w-10 h-10 text-blue-500" />
            </div>
            <h2 className="text-2xl font-bold mb-4">Awaiting Signal...</h2>
            <p className="text-blue-900/40 max-w-sm mx-auto mb-10 leading-relaxed font-medium">
                Your analytics sanctuary is ready for your annual data.
                Start logging your manual pulse in the pixels above or chatting with your buddy to see trends.
            </p>
            <div className="flex gap-4">
                <Link href="/coach" className="h-14 px-10 rounded-2xl bg-blue-600 text-white flex items-center font-bold shadow-2xl shadow-blue-900/20 transition-transform hover:scale-105">
                    Talk to Coach
                </Link>
            </div>
        </div>
    );
}
