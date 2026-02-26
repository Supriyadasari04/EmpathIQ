'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Wind,
    Shield,
    Heart,
    Trash2,
    Zap,
    X,
    CheckCircle2,
    ChevronRight,
    Play,
    Timer,
    Sparkles
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useApp } from '@/lib/store';

const ACTIVITIES = [
    {
        id: 'breathing',
        title: 'Breathing Sanctuary',
        desc: 'Regulate your nervous system with the 4-7-8 technique.',
        icon: Wind,
        color: 'text-blue-500',
        bg: 'bg-blue-50',
        intensity: 'Low',
        duration: '2 min'
    },
    {
        id: 'grounding',
        title: 'Grounding Roots',
        desc: 'Re-center yourself using the 5-4-3-2-1 sensory method.',
        icon: Shield,
        color: 'text-green-500',
        bg: 'bg-green-50',
        intensity: 'Medium',
        duration: '5 min'
    },
    {
        id: 'gratitude',
        title: 'Gratitude Sparks',
        desc: 'Illuminate your mood by noting small wins.',
        icon: Heart,
        color: 'text-orange-500',
        bg: 'bg-orange-50',
        intensity: 'Low',
        duration: '3 min'
    },
    {
        id: 'declutter',
        title: 'Mind Declutter',
        desc: 'A digital space to dump and dissolve stressful thoughts.',
        icon: Trash2,
        color: 'text-purple-500',
        bg: 'bg-purple-50',
        intensity: 'High',
        duration: 'Unlimited'
    },
    {
        id: 'focus',
        title: 'Focus Sprint',
        desc: 'Gentle productivity blocks with mindful transitions.',
        icon: Timer,
        color: 'text-red-500',
        bg: 'bg-red-50',
        intensity: 'Medium',
        duration: '25 min'
    }
];

export default function ActivitiesPage() {
    const [activeActivity, setActiveActivity] = useState<string | null>(null);

    return (
        <div className="space-y-8 pb-16">
            <header className="space-y-1">
                <div className="flex items-center gap-2 text-[var(--secondary-text)] opacity-40">
                    <Sparkles className="w-3.5 h-3.5" strokeWidth={1.5} />
                    <span className="text-[11px] font-medium uppercase tracking-widest">Protocols</span>
                </div>
                <h1 className="text-[22px] font-semibold tracking-tight">Therapeutic Sanctuary</h1>
                <p className="text-[13px] text-[var(--secondary-text)] leading-relaxed max-w-xl">Medically-inspired sessions designed to help you regulate and find peace.</p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {ACTIVITIES.map((activity) => (
                    <motion.div
                        key={activity.id}
                        whileHover={{ y: -2 }}
                        className="card bg-white p-6 flex flex-col group cursor-pointer relative overflow-hidden shadow-sm"
                        onClick={() => setActiveActivity(activity.id)}
                    >
                        <div className={cn("w-10 h-10 rounded-lg flex items-center justify-center mb-4 transition-all group-hover:scale-105 shadow-xs relative z-10", activity.bg)}>
                            <activity.icon className={cn("w-5 h-5", activity.color)} strokeWidth={1.5} />
                        </div>
                        <h3 className="text-[16px] font-semibold tracking-tight mb-2 relative z-10">{activity.title}</h3>
                        <p className="text-[13px] text-[var(--secondary-text)] leading-relaxed mb-6 flex-1 relative z-10">{activity.desc}</p>

                        <div className="flex items-center justify-between mt-auto pt-4 border-t border-[var(--border)] relative z-10">
                            <div className="flex items-center gap-4">
                                <div className="flex flex-col">
                                    <span className="text-[10px] font-medium uppercase tracking-wider text-[var(--secondary-text)] opacity-40">Duration</span>
                                    <span className="text-[12px] font-medium text-[var(--primary-text)]">{activity.duration}</span>
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-[10px] font-medium uppercase tracking-wider text-[var(--secondary-text)] opacity-40">Load</span>
                                    <span className="text-[12px] font-medium text-[var(--primary-text)]">{activity.intensity}</span>
                                </div>
                            </div>
                            <button className="w-8 h-8 bg-[var(--accent)] text-[var(--primary-text)] rounded-lg flex items-center justify-center shadow-xs transition-all active:scale-95">
                                <Play className="w-3.5 h-3.5 fill-current" />
                            </button>
                        </div>
                    </motion.div>
                ))}
            </div>

            <AnimatePresence>
                {activeActivity && (
                    <ActivityModal
                        id={activeActivity}
                        onClose={() => setActiveActivity(null)}
                    />
                )}
            </AnimatePresence>
        </div>
    );
}

function ActivityModal({ id, onClose }: { id: string; onClose: () => void }) {
    const { addNotification } = useApp();
    const config = ACTIVITIES.find(a => a.id === id)!;
    const [step, setStep] = useState<'intro' | 'active' | 'complete'>('intro');

    const handleComplete = () => {
        setStep('complete');

        // Dispatch global trigger for AI Buddy
        window.dispatchEvent(new CustomEvent('buddy_trigger', {
            detail: { type: 'activity', title: config.title }
        }));

        addNotification({
            title: `${config.title} Complete`,
            message: `Great job focusing on your wellbeing. You've earned 25 XP!`,
            type: 'mission'
        });
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[300] flex items-center justify-center p-6 bg-white/80 backdrop-blur-xl"
        >
            <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                className="w-full max-w-lg bg-white border border-[var(--border)] rounded-[20px] shadow-lg overflow-hidden relative"
            >
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-lg hover:bg-[var(--surface)] transition-colors z-10"
                >
                    <X className="w-4 h-4" strokeWidth={1.5} />
                </button>

                <div className="p-8">
                    {step === 'intro' && (
                        <div className="flex flex-col items-center text-center space-y-6 py-4">
                            <div className={cn("w-16 h-16 rounded-xl flex items-center justify-center shadow-sm", config.bg)}>
                                <config.icon className={cn("w-8 h-8", config.color)} strokeWidth={1.5} />
                            </div>
                            <div>
                                <h2 className="text-[20px] font-semibold tracking-tight mb-2">{config.title}</h2>
                                <p className="text-[13px] text-[var(--secondary-text)] max-w-xs mx-auto leading-relaxed">{config.desc}</p>
                            </div>
                            <button
                                onClick={() => setStep('active')}
                                className="btn-primary h-[38px] px-8 rounded-lg flex items-center gap-2 text-[14px]"
                            >
                                <Play className="w-4 h-4 fill-current" /> Start Session
                            </button>
                        </div>
                    )}

                    {step === 'active' && (
                        <div className="py-4">
                            {id === 'breathing' && <BreathingExercise onComplete={handleComplete} />}
                            {id === 'grounding' && <GroundingExercise onComplete={handleComplete} />}
                            {id === 'gratitude' && <GratitudeExercise onComplete={handleComplete} />}
                            {id === 'declutter' && <DeclutterExercise onComplete={handleComplete} />}
                            {id === 'focus' && <FocusSprint onComplete={handleComplete} />}
                        </div>
                    )}

                    {step === 'complete' && (
                        <div className="flex flex-col items-center text-center space-y-6 py-4">
                            <div className="w-16 h-16 bg-green-50 rounded-xl flex items-center justify-center shadow-sm">
                                <CheckCircle2 className="w-8 h-8 text-green-500" strokeWidth={1.5} />
                            </div>
                            <div>
                                <h2 className="text-[20px] font-semibold tracking-tight mb-2">Well Done!</h2>
                                <p className="text-[13px] text-[var(--secondary-text)] max-w-xs mx-auto">You've successfully completed your {config.title} session.</p>
                            </div>
                            <button
                                onClick={onClose}
                                className="btn-primary h-[38px] px-8 rounded-lg text-[14px]"
                            >
                                Back to Sanctuary
                            </button>
                        </div>
                    )}
                </div>
            </motion.div>
        </motion.div>
    );
}

// Sub-components for each exercise
function BreathingExercise({ onComplete }: { onComplete: () => void }) {
    const [cycle, setCycle] = useState<'Inhale' | 'Hold' | 'Exhale'>('Inhale');
    const [duration, setDuration] = useState(4);
    const [cyclesLeft, setCyclesLeft] = useState(4);

    React.useEffect(() => {
        if (cyclesLeft === 0) {
            onComplete();
            return;
        }

        const timer = setInterval(() => {
            setDuration(prev => {
                if (prev === 1) {
                    if (cycle === 'Inhale') { setCycle('Hold'); return 7; }
                    if (cycle === 'Hold') { setCycle('Exhale'); return 8; }
                    if (cycle === 'Exhale') { setCycle('Inhale'); setCyclesLeft(c => c - 1); return 4; }
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [cycle, cyclesLeft]);

    return (
        <div className="flex flex-col items-center justify-center space-y-16">
            <div className="relative flex items-center justify-center">
                <motion.div
                    animate={{
                        scale: cycle === 'Inhale' ? 1.5 : cycle === 'Hold' ? 1.5 : 1,
                        opacity: cycle === 'Inhale' ? 0.3 : 0.1
                    }}
                    transition={{ duration: cycle === 'Inhale' ? 4 : cycle === 'Exhale' ? 8 : 0 }}
                    className="absolute w-64 h-64 bg-blue-500 rounded-full blur-3xl"
                />
                <motion.div
                    animate={{
                        scale: cycle === 'Inhale' ? 1.5 : cycle === 'Hold' ? 1.5 : 1
                    }}
                    transition={{ duration: cycle === 'Inhale' ? 4 : cycle === 'Exhale' ? 8 : 0 }}
                    className="w-48 h-48 border-4 border-blue-500/20 rounded-full flex items-center justify-center bg-white shadow-2xl"
                >
                    <span className="text-2xl font-bold text-blue-600">{duration}</span>
                </motion.div>
            </div>
            <div className="text-center">
                <h3 className="text-2xl font-bold uppercase tracking-widest text-blue-900/20 mb-2">{cycle}</h3>
                <p className="text-sm font-bold text-blue-900/60">Cycles remaining: {cyclesLeft}</p>
            </div>
        </div>
    );
}

function GroundingExercise({ onComplete }: { onComplete: () => void }) {
    const prompts = [
        "Find 5 things you can SEE around you.",
        "Identify 4 things you can TOUCH right now.",
        "Listen for 3 things you can HEAR.",
        "Notice 2 things you can SMELL.",
        "Tell me 1 thing you can TASTE."
    ];
    const [idx, setIdx] = useState(0);

    return (
        <div className="space-y-12 py-6 text-center">
            <div className="space-y-4">
                <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-blue-900/20">Sensory Phase 0{idx + 1}</span>
                <h3 className="text-2xl font-bold leading-tight">{prompts[idx]}</h3>
            </div>
            <div className="flex justify-center flex-wrap gap-3">
                {Array.from({ length: 5 - idx }).map((_, i) => (
                    <div key={i} className="w-10 h-10 border border-blue-900/10 rounded-xl flex items-center justify-center bg-white shadow-sm">
                        <Sparkles className="w-4 h-4 text-green-500" />
                    </div>
                ))}
            </div>
            <button
                onClick={() => idx === 4 ? onComplete() : setIdx(idx + 1)}
                className="h-14 px-10 bg-blue-600 text-white rounded-2xl font-bold text-sm"
            >
                {idx === 4 ? 'Complete Grounding' : 'Next Step'}
            </button>
        </div>
    );
}

function GratitudeExercise({ onComplete }: { onComplete: () => void }) {
    const [entries, setEntries] = useState(['', '', '']);
    return (
        <div className="space-y-8">
            <div className="text-center mb-8">
                <h3 className="text-xl font-bold">What are you grateful for?</h3>
                <p className="text-sm text-blue-900/40 mt-1">Focus on small, simple joys.</p>
            </div>
            {entries.map((val, i) => (
                <input
                    key={i}
                    placeholder={`Light point 0${i + 1}...`}
                    className="w-full h-14 px-6 bg-[#fbfbfd] border border-blue-900/5 rounded-2xl text-sm font-semibold outline-none focus:border-orange-500/20 transition-all"
                    value={val}
                    onChange={(e) => {
                        const newE = [...entries];
                        newE[i] = e.target.value;
                        setEntries(newE);
                    }}
                />
            ))}
            <button
                onClick={onComplete}
                disabled={entries.some(e => !e)}
                className="w-full h-14 bg-blue-600 text-white rounded-2xl font-bold text-sm disabled:opacity-20"
            >
                Ignite Gratitude
            </button>
        </div>
    );
}

function DeclutterExercise({ onComplete }: { onComplete: () => void }) {
    const [text, setText] = useState('');
    const [dissolving, setDissolving] = useState(false);

    const handleDissolve = () => {
        setDissolving(true);
        setTimeout(() => {
            setText('');
            setDissolving(false);
            onComplete();
        }, 3000);
    };

    return (
        <div className="space-y-8 text-center">
            <div className="mb-4">
                <h3 className="text-xl font-bold">Thought Incinerator</h3>
                <p className="text-sm text-blue-900/40 mt-1">Dump any heavy thoughts here, then watch them vanish.</p>
            </div>
            <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Write whatever is bothering you..."
                className={cn(
                    "w-full h-48 p-8 bg-blue-600/5 rounded-[32px] border-none outline-none text-sm leading-relaxed font-medium transition-all",
                    dissolving && "scale-90 opacity-0 blur-3xl duration-[3000ms]"
                )}
            />
            <button
                onClick={handleDissolve}
                disabled={!text || dissolving}
                className="h-14 px-10 bg-purple-600 text-white rounded-2xl font-bold text-sm shadow-xl shadow-purple-200 disabled:opacity-20"
            >
                {dissolving ? 'Dissolving...' : 'Release & Let Go'}
            </button>
        </div>
    );
}

function FocusSprint({ onComplete }: { onComplete: () => void }) {
    const [timeLeft, setTimeLeft] = useState(25 * 60);
    const [isActive, setIsActive] = useState(false);

    React.useEffect(() => {
        let timer: any;
        if (isActive && timeLeft > 0) {
            timer = setInterval(() => setTimeLeft(t => t - 1), 1000);
        } else if (timeLeft === 0) {
            onComplete();
        }
        return () => clearInterval(timer);
    }, [isActive, timeLeft]);

    const formatTime = (s: number) => {
        const m = Math.floor(s / 60);
        const sec = s % 60;
        return `${m}:${sec.toString().padStart(2, '0')}`;
    };

    return (
        <div className="flex flex-col items-center space-y-12 text-center py-6">
            <div className="space-y-4">
                <h3 className="text-2xl font-bold font-mono tracking-tighter">{formatTime(timeLeft)}</h3>
                <p className="text-xs font-bold uppercase tracking-[0.3em] text-blue-900/20">Work Block Active</p>
            </div>
            <div className="flex gap-4">
                <button
                    onClick={() => setIsActive(!isActive)}
                    className="h-14 px-10 bg-blue-600 text-white rounded-2xl font-bold text-sm flex items-center gap-2"
                >
                    {isActive ? 'Pause' : 'Resume Focus'}
                </button>
                <button
                    onClick={onComplete}
                    className="h-14 px-10 bg-blue-600/5 text-blue-900 rounded-2xl font-bold text-sm"
                >
                    Skip to End
                </button>
            </div>
        </div>
    );
}
