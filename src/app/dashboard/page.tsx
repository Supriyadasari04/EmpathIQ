'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
    Plus,
    Smile,
    Calendar,
    ArrowUpRight,
    AlertCircle,
    Zap,
    Brain,
    MessageCircle,
    CheckCircle2,
    ChevronRight,
    Sparkles,
    ShieldCheck,
    Heart
} from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import CrisisSupport from '@/components/CrisisSupport';
import DailyCheckIn from '@/components/DailyCheckIn';
import { useApp } from '@/lib/store';
import { AnimatePresence } from 'framer-motion';

import { useRouter } from 'next/navigation';

export default function DashboardPage() {
    const router = useRouter();
    const { user, reflections, habits, missions, toggleMission, getStats, onboardingData, addNotification, moodPixels, setMoodPixel, loading, hasOnboarded, buddy, getPredictiveInsight, detectedEmotion } = useApp();
    const [showCrisis, setShowCrisis] = useState(false);
    const [showCheckIn, setShowCheckIn] = useState(false);
    const { score, unlockedCount } = getStats();

    const todayDate = new Date().toISOString().split('T')[0];
    const today = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });

    React.useEffect(() => {
        if (loading) return;

        // AUTO-REDIRECT IF NOT ONBOARDED
        if (user.isLoggedIn && !hasOnboarded) {
            router.push('/onboarding');
            return;
        }

        // Trigger check-in if mood for today is missing
        if (!moodPixels[todayDate]) {
            const timer = setTimeout(() => setShowCheckIn(true), 1500);
            return () => clearTimeout(timer);
        }
    }, [moodPixels, todayDate, loading, hasOnboarded, router]);

    if (loading) {
        return (
            <div className="h-[60vh] flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-4 border-blue-900/10 border-t-blue-600 rounded-full animate-spin" />
                    <p className="text-sm font-semibold text-blue-900/50 uppercase tracking-widest">Synchronizing Sanctuary...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-8 pb-16 relative">
            {/* Background Glows - subtle */}
            <div className="absolute -top-20 -right-20 w-[400px] h-[400px] bg-[var(--accent)]/10 blur-[80px] rounded-full pointer-events-none" />

            <AnimatePresence>
                {showCheckIn && (
                    <DailyCheckIn
                        name={user.name}
                        onClose={() => setShowCheckIn(false)}
                        onSave={(val) => {
                            setMoodPixel(todayDate, val);
                            setShowCheckIn(false);
                            addNotification({
                                title: 'Mood Synced',
                                message: 'Your daily emotional pulse has been recorded. 📈',
                                type: 'mission'
                            });
                        }}
                    />
                )}
            </AnimatePresence>

            {/* Header / Focus Section */}
            <header className="space-y-6 relative z-10">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                    <div className="space-y-1">
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="flex items-center gap-2 text-[var(--secondary-text)]"
                        >
                            <Calendar className="w-3.5 h-3.5" strokeWidth={1.5} />
                            <span className="text-[11px] font-medium uppercase tracking-wider">{today}</span>
                        </motion.div>
                        <motion.h1
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.1 }}
                            className="text-[22px] font-semibold tracking-tight text-[var(--primary-text)]"
                        >
                            Good morning, {user.name}.
                        </motion.h1>
                    </div>
                </div>

                {/* Focus Banner */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="card bg-[var(--mood-accent)] text-[var(--primary-text)] p-6 flex flex-col md:flex-row items-center justify-between gap-6 overflow-hidden relative shadow-sm border-none transition-colors duration-1000"
                >
                    <div className="relative z-10 space-y-3 max-w-md text-center md:text-left">
                        <div className="inline-flex items-center gap-2 px-2.5 py-0.5 bg-white/30 rounded-full border border-white/20">
                            <Sparkles className="w-3 h-3 text-[var(--primary-text)]" strokeWidth={1.5} />
                            <span className="text-[11px] font-medium uppercase tracking-wider">Daily Atmosphere</span>
                        </div>
                        <h2 className="text-[18px] font-semibold tracking-tight leading-snug">Your sanctuary is calibrated. Ready for a new reflection?</h2>
                        <div className="flex flex-wrap gap-3 pt-1 justify-center md:justify-start">
                            <Link href="/reflections" className="h-[34px] px-4 bg-white text-[var(--primary-text)] rounded-lg flex items-center gap-2 font-medium shadow-sm transition-all hover:translate-y-[-1px] active:scale-[0.98] text-[13px]">
                                <Plus className="w-3.5 h-3.5" strokeWidth={1.5} />
                                New Log
                            </Link>
                            <Link href="/activities" className="h-[34px] px-4 bg-white/20 border border-white/30 text-[var(--primary-text)] rounded-lg flex items-center gap-2 font-medium backdrop-blur-md transition-all hover:bg-white/30 text-[13px]">
                                <Brain className="w-3.5 h-3.5" strokeWidth={1.5} />
                                Start Training
                            </Link>
                        </div>
                    </div>
                    {/* Care Momentum Energy Orb */}
                    <div className="relative w-32 h-32 md:w-40 md:h-40 flex items-center justify-center">
                        <motion.div
                            animate={{
                                scale: [1, 1.1, 1],
                                opacity: [0.1, 0.4, 0.1],
                                rotate: 360
                            }}
                            transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                            className="absolute inset-0 border-2 border-[var(--primary-text)] opacity-10 rounded-full"
                        />
                        <motion.div
                            animate={{
                                scale: [1, 1.2, 1],
                            }}
                            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                            className="w-24 h-24 bg-[var(--accent)] blur-2xl rounded-full absolute opacity-20"
                        />
                        <div className="relative z-10 flex flex-col items-center">
                            <Heart className="w-10 h-10 text-[var(--primary-text)] fill-current animate-pulse shadow-sm" strokeWidth={1} />
                            <span className="text-[10px] font-bold mt-2 text-[var(--primary-text)] opacity-70 uppercase tracking-tighter">Momentum</span>
                        </div>
                    </div>
                </motion.div>
            </header>

            {/* Main Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 relative z-10">
                <div className="lg:col-span-2 space-y-8">
                    {/* Stats Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <DashboardStatCard
                            icon={<Zap className="w-4 h-4 text-orange-500" strokeWidth={1.5} />}
                            label="Care Momentum"
                            value={`${habits[0]?.streak || 0} Day Flow`}
                            subValue={`Growing since ${onboardingData?.startDate || 'Day 1'}`}
                            color="bg-orange-50"
                        />
                        <DashboardStatCard
                            icon={<MessageCircle className="w-4 h-4 text-blue-500" strokeWidth={1.5} />}
                            label="Heart Depth"
                            value={`${reflections.length} Reflections`}
                            subValue={reflections[0] ? `Latest: ${reflections[0].date}` : "Safe space ready"}
                            color="bg-blue-50"
                        />
                    </div>

                    {/* Rhythms Card - Expanded to match row width */}
                    <section className="card bg-white p-6 shadow-xs border-[var(--border)]">
                        <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center gap-2">
                                <Zap className="w-4 h-4 text-orange-500" strokeWidth={1.5} />
                                <h2 className="font-semibold tracking-tight text-[15px] text-[var(--primary-text)]">Daily Rhythms</h2>
                            </div>
                            <Link href="/habits" className="text-[11px] font-semibold text-[var(--secondary-text)] hover:text-[var(--primary-text)] transition-colors uppercase tracking-widest">Ritual List</Link>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {habits.slice(0, 4).map(habit => (
                                <HabitSmallItem
                                    key={habit.id}
                                    name={habit.name}
                                    color="bg-[var(--accent-soft)]"
                                    streak={habit.streak}
                                    completed={habit.completedDays}
                                />
                            ))}
                            {habits.length === 0 && <p className="text-[11px] text-[var(--secondary-text)] opacity-40 py-1">No rituals found...</p>}
                        </div>
                    </section>

                    {/* Aura's Discovery Feed */}
                    <AuraDiscovery emotion={detectedEmotion?.emotion || 'Neutral'} />
                </div>

                {/* Secondary Content (Right Sidebar) */}
                <div className="space-y-6">
                    {/* Buddy Growth Card */}
                    <motion.section
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 }}
                        className="card bg-white border-[var(--border)] p-5 shadow-sm relative overflow-hidden group"
                    >
                        <div className="flex items-center gap-3 mb-4 relative z-10">
                            <div className="w-10 h-10 rounded-xl bg-[var(--accent)] text-[var(--primary-text)] flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
                                <Sparkles className="w-5 h-5" strokeWidth={1.5} />
                            </div>
                            <div>
                                <h2 className="font-semibold text-[15px] text-[var(--primary-text)]">{buddy.name}</h2>
                                <p className="text-[11px] text-[var(--secondary-text)] font-medium">Level {buddy.level} Resonance</p>
                            </div>
                        </div>

                        <div className="space-y-2 relative z-10">
                            <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest text-[var(--secondary-text)] opacity-40">
                                <span>Bond Progress</span>
                                <span>{buddy.xp} / {buddy.level * 100} XP</span>
                            </div>
                            <div className="h-1.5 w-full bg-[var(--surface)] rounded-full overflow-hidden border border-[var(--border)]/30">
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: `${(buddy.xp / (buddy.level * 100)) * 100}%` }}
                                    className="h-full bg-[var(--accent)]"
                                />
                            </div>
                        </div>

                        <div className="mt-4 pt-4 border-t border-[var(--border)]/50 relative z-10">
                            <p className="text-[10px] text-[var(--secondary-text)] leading-relaxed italic opacity-70">
                                {buddy.level < 3
                                    ? "We are just beginning our synergy journey."
                                    : "Our emotional bond is becoming profound."}
                            </p>
                        </div>
                        <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-[var(--accent)]/5 blur-2xl rounded-full" />
                    </motion.section>

                    {/* Predictive Pulse Card */}
                    {getPredictiveInsight().length > 0 && (
                        <motion.section
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.4 }}
                            className="card bg-orange-50 border-orange-100 p-5 shadow-sm relative overflow-hidden"
                        >
                            <div className="flex items-center gap-3 mb-3 relative z-10">
                                <div className="w-8 h-8 rounded-lg bg-white text-orange-500 flex items-center justify-center shadow-sm">
                                    <AlertCircle className="w-4 h-4" />
                                </div>
                                <h2 className="font-semibold text-[14px] text-orange-900">Predictive Insight</h2>
                            </div>
                            <p className="text-[12px] text-orange-800/80 leading-relaxed mb-4 relative z-10 font-medium">
                                {buddy.name} noticed that <span className="font-bold underline">
                                    {getPredictiveInsight().map(d => ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][d]).join(', ')}s
                                </span> are often challenging for you.
                                Shall we prepare a grounding ritual?
                            </p>
                            <Link href="/activities" className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest text-orange-600 hover:text-orange-700 transition-colors relative z-10">
                                View Rituals <ArrowUpRight className="w-3 h-3" />
                            </Link>
                            <div className="absolute -top-4 -left-4 w-16 h-16 bg-white/40 blur-2xl rounded-full" />
                        </motion.section>
                    )}

                    {/* Daily Wellness Missions */}
                    <section className="card bg-[var(--surface)] border-none p-4 relative overflow-hidden group h-fit">
                        <h2 className="font-semibold flex items-center gap-2 mb-4 text-[var(--primary-text)]">
                            <div className="w-6 h-6 rounded-lg bg-white text-[var(--accent)] flex items-center justify-center shadow-sm">
                                <CheckCircle2 className="w-3.5 h-3.5" strokeWidth={2} />
                            </div>
                            Missions
                        </h2>
                        <div className="space-y-6">
                            {onboardingData?.goalCategories ? (
                                onboardingData.goalCategories.map((category: string, idx: number) => (
                                    <MissionItem
                                        key={idx}
                                        label={`${category} Session`}
                                        completed={missions[idx]?.completed}
                                        onClick={() => toggleMission(missions[idx]?.id || idx.toString())}
                                    />
                                ))
                            ) : (
                                missions.map(mission => (
                                    <MissionItem
                                        key={mission.id}
                                        label={mission.label}
                                        completed={mission.completed}
                                        onClick={() => toggleMission(mission.id)}
                                    />
                                ))
                            )}
                        </div>
                        <div className="absolute top-0 right-0 w-20 h-20 bg-white/40 blur-3xl rounded-full" />
                    </section>
                </div>
            </div>

            <CrisisSupport isOpen={showCrisis} onClose={() => setShowCrisis(false)} />
        </div>
    );
}

function AuraDiscovery({ emotion }: { emotion: string }) {
    const discoveries: Record<string, any[]> = {
        Happy: [
            { title: "The Science of Positivity", source: "Greater Good", link: "https://greatergood.berkeley.edu/", type: "Article" },
            { title: "Joyful Movement Guide", source: "Healthline", link: "https://www.healthline.com/health/fitness/joyful-movement", type: "Wellness" },
            { title: "Uplifting News Today", source: "Positive News", link: "https://www.positive.news/", type: "News" }
        ],
        Sad: [
            { title: "Gentle Self-Compassion", source: "Self-Compassion.org", link: "https://self-compassion.org/", type: "Practice" },
            { title: "The Art of Doing Nothing", source: "Psychology Today", link: "https://www.psychologytoday.com/us/blog/the-art-doing-nothing", type: "Insight" },
            { title: "Rainy Day Sanctuary Mix", source: "Spotify/Aura", link: "#", type: "Audio" }
        ],
        Neutral: [
            { title: "Mindfulness for Busy Lives", source: "Mindful.org", link: "https://www.mindful.org/", type: "Guide" },
            { title: "The Power of Small Habits", source: "James Clear", link: "https://jamesclear.com/atomic-habits", type: "Book" },
            { title: "Emotional Intelligence 101", source: "Harvard Business Review", link: "https://hbr.org/topic/emotional-intelligence", type: "Education" }
        ]
    };

    const items = discoveries[emotion] || discoveries.Neutral;

    return (
        <section className="space-y-4">
            <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-purple-500" strokeWidth={1.5} />
                <h2 className="font-semibold tracking-tight text-[15px] text-[var(--primary-text)]">Aura's Discovery</h2>
                <span className="text-[10px] bg-purple-50 text-purple-600 px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">Curated for your Joy</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {items.map((item, i) => (
                    <a
                        key={i}
                        href={item.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="card bg-white p-4 border-[var(--border)] shadow-xs hover:border-purple-200 hover:shadow-md transition-all group flex flex-col justify-between min-h-[120px]"
                    >
                        <div>
                            <span className="text-[10px] font-bold text-purple-400 uppercase tracking-widest">{item.type}</span>
                            <h3 className="text-[14px] font-semibold text-[var(--primary-text)] group-hover:text-purple-600 transition-colors mt-1">{item.title}</h3>
                        </div>
                        <div className="flex items-center justify-between mt-4">
                            <span className="text-[11px] text-[var(--secondary-text)] opacity-60">{item.source}</span>
                            <ArrowUpRight className="w-3 h-3 text-[var(--secondary-text)] opacity-0 group-hover:opacity-100 transition-all" />
                        </div>
                    </a>
                ))}
            </div>
        </section>
    );
}

function DashboardStatCard({ icon, label, value, subValue, color }: { icon: React.ReactNode; label: string; value: string; subValue: string; color: string }) {
    return (
        <div className="card p-4 group overflow-hidden relative border-[var(--border)] shadow-sm hover:shadow-md transition-all bg-white">
            <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center mb-4 relative z-10 transition-all group-hover:scale-105 shadow-sm", color)}>
                {icon}
            </div>
            <p className="text-[11px] font-medium text-[var(--secondary-text)] uppercase tracking-wider mb-0.5 relative z-10">{label}</p>
            <h3 className="text-[18px] font-semibold tracking-tight text-[var(--primary-text)] mb-0.5 relative z-10">{value}</h3>
            <p className="text-[12px] text-[var(--secondary-text)] relative z-10 font-medium">{subValue}</p>
        </div>
    );
}

function MissionItem({ label, completed = false, onClick }: { label: string; completed?: boolean; onClick?: () => void }) {
    return (
        <div
            onClick={onClick}
            className="flex items-center gap-3 group cursor-pointer"
        >
            <div className={cn(
                "w-6 h-6 rounded-lg flex items-center justify-center transition-all border",
                completed ? "bg-[var(--accent)] border-[var(--accent)] text-[var(--primary-text)]" : "bg-white border-[var(--border)] text-transparent"
            )}>
                <CheckCircle2 className="w-3.5 h-3.5" strokeWidth={2} />
            </div>
            <div className="flex flex-col">
                <span className={cn("text-[13px] font-medium tracking-tight transition-all", completed ? "text-[var(--secondary-text)] line-through" : "text-[var(--primary-text)] group-hover:translate-x-0.5")}>{label}</span>
                {!completed && <span className="text-[11px] text-[var(--secondary-text)] opacity-60">+10 XP</span>}
            </div>
        </div>
    );
}

function HabitSmallItem({ name, color, streak, completed }: { name: string; color: string; streak: number; completed: boolean[] }) {
    return (
        <div className="space-y-2">
            <div className="flex justify-between items-end">
                <span className="text-[13px] font-medium text-[var(--primary-text)] tracking-tight">{name}</span>
                <span className="text-[11px] text-[var(--secondary-text)] opacity-60">{streak}d</span>
            </div>
            <div className="flex gap-1">
                {completed.map((done, i) => (
                    <div
                        key={i}
                        className={cn(
                            "h-1.5 flex-1 rounded-full bg-[var(--surface)] transition-all",
                            done ? color : ""
                        )}
                    />
                ))}
            </div>
        </div>
    );
}
