'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
    ChevronRight,
    Book,
    Shield,
    Heart,
    Sparkles,
    Brain,
    Activity,
    Zap,
    ArrowLeft,
    CheckCircle2,
    Lock,
    LifeBuoy
} from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { useApp } from '@/lib/store';

const DOC_SECTIONS = [
    {
        title: 'Product',
        items: [
            { id: 'coach', label: 'AI Coach', icon: Brain, description: 'Your personal emotional intelligence companion.' },
            { id: 'analytics', label: 'Analytics', icon: Activity, description: 'Visualizing your emotional journey over time.' },
            { id: 'habits', label: 'Habits', icon: Zap, description: 'Building sustainable rhythms for mental wellness.' },
            { id: 'reflections', label: 'Reflections', icon: Book, description: 'Deep diving into your daily thoughts and signals.' },
        ]
    },
    {
        title: 'Company',
        items: [
            { id: 'mission', label: 'Our Mission', icon: Heart, description: 'Why we built the sanctuary.' },
            { id: 'privacy', label: 'Privacy', icon: Lock, description: 'How we protect your most sensitive data.' },
            { id: 'ethics', label: 'Ethics', icon: Shield, description: 'Our commitment to responsible AI.' },
        ]
    },
    {
        title: 'Foundation',
        items: [
            { id: 'about', label: 'E-AI Buddy', icon: Sparkles, description: 'The science of emotional resonance in modern AI.' },
        ]
    },
    {
        title: 'Support',
        items: [
            { id: 'help', label: 'Help Center', icon: LifeBuoy, description: 'Common questions and walkthroughs.' },
            { id: 'safety', label: 'Safety', icon: CheckCircle2, description: 'Crisis protocols and resources.' },
            { id: 'connect', label: 'Connect', icon: Sparkles, description: 'Getting in touch with our team.' },
        ]
    }
];

export default function DocsPage() {
    const { user } = useApp();
    const searchParams = useSearchParams();
    const [activeId, setActiveId] = useState('coach');

    const exitHref = (user.isLoggedIn && user.id) ? '/dashboard' : '/';

    useEffect(() => {
        const topic = searchParams.get('topic');
        if (topic) {
            setActiveId(topic.toLowerCase());
        }
    }, [searchParams]);

    const activeItem = DOC_SECTIONS.flatMap(s => s.items).find(i => i.id === activeId);

    return (
        <div className="min-h-screen bg-[var(--background)] text-[var(--primary-text)] font-sans flex">
            {/* Mobile Nav */}
            <div className="md:hidden fixed top-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-[var(--border)] p-4 flex items-center justify-between">
                <Link href={exitHref} className="w-8 h-8 flex items-center justify-center rounded-lg bg-[var(--surface)] text-[var(--secondary-text)]">
                    <ArrowLeft className="w-4 h-4" />
                </Link>
                <div className="flex items-center gap-2">
                    <div className="w-6 h-6 bg-[var(--accent)] rounded-md flex items-center justify-center">
                        <Heart className="w-3.5 h-3.5" />
                    </div>
                    <span className="font-semibold text-[14px] tracking-tight">Docs</span>
                </div>
                <select
                    value={activeId}
                    onChange={(e) => setActiveId(e.target.value)}
                    className="w-10 h-8 opacity-0 absolute right-4 cursor-pointer"
                >
                    {DOC_SECTIONS.flatMap(s => s.items).map(i => (
                        <option key={i.id} value={i.id}>{i.label}</option>
                    ))}
                </select>
                <div className="w-8 h-8 flex items-center justify-center rounded-lg bg-[var(--surface)] pointer-events-none">
                    <Sparkles className="w-4 h-4 text-[var(--accent)]" strokeWidth={1.5} />
                </div>
            </div>

            {/* Sidebar */}
            <aside className="w-[var(--sidebar-width)] border-r border-[var(--border)] bg-white/50 backdrop-blur-md sticky top-0 h-screen overflow-y-auto hidden md:block shrink-0">
                <div className="p-6 border-b border-[var(--border)] bg-white/20">
                    <Link href={exitHref} className="flex items-center gap-2 group mb-5 hover:text-[var(--primary-text)] transition-all">
                        <ArrowLeft className="w-3.5 h-3.5 text-[var(--secondary-text)] group-hover:-translate-x-0.5 transition-transform" />
                        <span className="text-[10px] font-bold uppercase tracking-widest text-[var(--secondary-text)] opacity-40 group-hover:opacity-100">Exit Docs</span>
                    </Link>
                    <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 bg-[var(--accent)] rounded-lg flex items-center justify-center shadow-xs">
                            <Heart className="w-4 h-4 text-[var(--primary-text)]" />
                        </div>
                        <span className="font-semibold text-lg tracking-tight">Support</span>
                    </div>
                </div>

                <nav className="p-3 space-y-8 mt-4">
                    {DOC_SECTIONS.map((section) => (
                        <div key={section.title} className="space-y-2">
                            <h3 className="px-3 text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--secondary-text)] opacity-30">
                                {section.title}
                            </h3>
                            <div className="space-y-0.5">
                                {section.items.map((item) => (
                                    <button
                                        key={item.id}
                                        onClick={() => setActiveId(item.id)}
                                        className={cn(
                                            "w-full flex items-center justify-between px-3 py-2 rounded-lg text-[13px] font-medium transition-all group",
                                            activeId === item.id
                                                ? "bg-white text-[var(--primary-text)] shadow-xs border border-[var(--border)]"
                                                : "text-[var(--secondary-text)] opacity-60 hover:opacity-100 hover:bg-white/40"
                                        )}
                                    >
                                        <div className="flex items-center gap-2.5">
                                            <div className={cn(
                                                "w-6 h-6 rounded-md flex items-center justify-center transition-all",
                                                activeId === item.id ? "bg-[var(--accent)]" : "bg-[var(--surface)] opacity-40 group-hover:opacity-100"
                                            )}>
                                                <item.icon className={cn("w-3 h-3", activeId === item.id ? "text-[var(--primary-text)]" : "text-[var(--secondary-text)]")} strokeWidth={1.5} />
                                            </div>
                                            {item.label}
                                        </div>
                                        <ChevronRight className={cn("w-2.5 h-2.5 transition-transform opacity-20", activeId === item.id ? "rotate-90 opacity-40" : "group-hover:translate-x-0.5")} />
                                    </button>
                                ))}
                            </div>
                        </div>
                    ))}
                </nav>
            </aside>

            {/* Main Content */}
            <main className="flex-1 min-w-0 bg-white/40 backdrop-blur-[2px]">
                <div className="max-w-3xl mx-auto px-6 md:px-16 py-28 md:py-24">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={activeId}
                            initial={{ opacity: 0, x: 10 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -10 }}
                            transition={{ duration: 0.3, ease: "easeOut" }}
                        >
                            <div className="space-y-12">
                                <header className="space-y-4">
                                    <div className="inline-flex items-center gap-2 px-2.5 py-0.5 bg-white border border-[var(--border)] rounded-full text-[10px] font-semibold uppercase tracking-widest text-[var(--secondary-text)] opacity-60 shadow-xs">
                                        Support <ChevronRight className="w-2.5 h-2.5" /> {DOC_SECTIONS.find(s => s.items.some(i => i.id === activeId))?.title}
                                    </div>
                                    <h1 className="text-[22px] font-semibold tracking-tight">{activeItem?.label}</h1>
                                    <p className="text-[14px] text-[var(--secondary-text)] leading-relaxed max-w-2xl font-medium opacity-80">
                                        {activeItem?.description}
                                    </p>
                                </header>

                                <div className="pt-8 border-t border-[var(--border)]">
                                    <DocContent id={activeId} />
                                </div>
                            </div>
                        </motion.div>
                    </AnimatePresence>

                    {/* Footer decoration */}
                    <div className="mt-32 pt-12 border-t border-[var(--border)]/30 flex flex-col md:flex-row justify-between items-center gap-4 opacity-40">
                        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--secondary-text)]">© 2026 EmpathIQ Sanctuary</p>
                        <div className="flex items-center gap-2 text-[var(--secondary-text)]">
                            <Shield className="w-3.5 h-3.5" strokeWidth={1.5} />
                            <span className="text-[10px] font-bold uppercase tracking-widest">Clinical-Grade Privacy</span>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}

function DocContent({ id }: { id: string }) {
    switch (id) {
        case 'coach':
            return (
                <div className="space-y-10 text-[13px] leading-relaxed text-[var(--secondary-text)]">
                    <section className="card bg-white p-6 border-[var(--border)] space-y-4 shadow-xs">
                        <h4 className="text-[15px] font-semibold text-[var(--primary-text)]">Pulse-Aware Conversations</h4>
                        <p>EmpathIQ’s AI Coach doesn’t just process text; it resonates with your emotional frequency. By analyzing your latest "Mind Logs" and "Daily Pulses", the coach adapts its tone to meet you where you are.</p>
                        <div className="bg-[var(--surface)] rounded-lg p-4 border border-[var(--border)] font-mono text-[11px] opacity-70">
                            "I see you've had a few high-stress days lately. Let's focus on a grounding exercise today."
                        </div>
                    </section>
                    <section className="space-y-4 px-1">
                        <h4 className="text-[15px] font-semibold text-[var(--primary-text)] tracking-tight">Clinical Logic</h4>
                        <p>The coaching interface uses a simplified clinical model focusing on:</p>
                        <ul className="space-y-3">
                            <li className="flex gap-3">
                                <div className="w-1.5 h-1.5 rounded-full bg-[var(--accent)] mt-1.5 shrink-0" />
                                <span>CBT (Cognitive Behavioral Therapy) patterns for thought reframing.</span>
                            </li>
                            <li className="flex gap-3">
                                <div className="w-1.5 h-1.5 rounded-full bg-[var(--accent)] mt-1.5 shrink-0" />
                                <span>Mindfulness-based stress reduction (MBSR) suggestions.</span>
                            </li>
                            <li className="flex gap-3">
                                <div className="w-1.5 h-1.5 rounded-full bg-[var(--accent)] mt-1.5 shrink-0" />
                                <span>Safe protocols that trigger "Crisis Support" when intensive signals are detected.</span>
                            </li>
                        </ul>
                    </section>
                </div>
            );
        case 'analytics':
            return (
                <div className="space-y-10 text-[13px] leading-relaxed text-[var(--secondary-text)]">
                    <section className="space-y-4 px-1">
                        <h4 className="text-[15px] font-semibold text-[var(--primary-text)]">The Wellness Grid</h4>
                        <p>Our analytics are inspired by the clarity of contribution graphs. Every "Pixel" represents a daily manual pulse entry, ranging from <span className="text-red-500 font-semibold">Distressed</span> to <span className="text-yellow-600 font-semibold">Radiant</span>.</p>
                        <div className="grid grid-cols-10 gap-1.5 p-4 bg-white border border-[var(--border)] rounded-xl w-fit shadow-xs">
                            {[1, 2, 3, 4, 5, 4, 3, 5, 2, 1].map((lvl, i) => (
                                <div key={i} className={cn("w-3.5 h-3.5 rounded-[3px] shadow-xs",
                                    lvl === 1 ? "bg-red-400" : lvl === 2 ? "bg-orange-300" : lvl === 3 ? "bg-blue-300" : lvl === 4 ? "bg-blue-600" : "bg-yellow-400"
                                )} />
                            ))}
                        </div>
                    </section>
                    <section className="card bg-white p-6 border-[var(--border)] space-y-4 shadow-xs">
                        <h4 className="text-[15px] font-semibold text-[var(--primary-text)]">Resonance Synthesis</h4>
                        <p>Beyond manual logs, EmpathIQ synthesizes your text journals into "Emotional Distribution" charts, helping you identify long-term triggers and stability trends.</p>
                    </section>
                </div>
            );
        case 'habits':
            return (
                <div className="space-y-10 text-[13px] leading-relaxed text-[var(--secondary-text)]">
                    <p className="px-1">Building mental resilience requires consistency. Our "Rhythms" system allows you to track therapeutic rituals like meditation, gratitude, or sleep hygiene.</p>
                    <section className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="card bg-white p-5 border-[var(--border)] shadow-xs">
                            <h4 className="font-semibold text-[var(--primary-text)] mb-2 text-[14px]">Momentum Rhythms</h4>
                            <p className="opacity-70 leading-relaxed">Visualizing continuity to encourage daily practice without the pressure of "perfection."</p>
                        </div>
                        <div className="card bg-white p-5 border-[var(--border)] shadow-xs">
                            <h4 className="font-semibold text-[var(--primary-text)] mb-2 text-[14px]">Ritual Intensity</h4>
                            <p className="opacity-70 leading-relaxed">Categorized by load to help you choose the right ritual for your current state.</p>
                        </div>
                    </section>
                </div>
            );
        case 'reflections':
            return (
                <div className="space-y-10 text-[13px] leading-relaxed text-[var(--secondary-text)]">
                    <section className="space-y-4 text-center py-10">
                        <div className="w-16 h-16 bg-[var(--surface)] rounded-2xl flex items-center justify-center mx-auto mb-2 shadow-sm">
                            <Book className="w-8 h-8 text-[var(--accent)]" strokeWidth={1} />
                        </div>
                        <h4 className="text-[18px] font-semibold text-[var(--primary-text)] tracking-tight">The Art of Logging</h4>
                        <p className="max-w-md mx-auto opacity-80 leading-relaxed">Mind Logs are the heartbeat of the sanctuary. These are non-linear, encrypted journals where you speak your truth without judgment.</p>
                    </section>
                    <div className="card bg-[var(--accent)]/10 p-6 border-none text-center">
                        <h4 className="text-[14px] font-semibold text-[var(--primary-text)] mb-2 uppercase tracking-widest opacity-60">Synthesis Protocol</h4>
                        <p className="font-medium">Reflections are automatically parsed by your AI Buddy to prepare for your next coaching session, ensuring every conversation starts with context.</p>
                    </div>
                </div>
            );
        case 'mission':
            return (
                <div className="space-y-10 text-[13px] leading-relaxed text-[var(--secondary-text)]">
                    <h4 className="text-[18px] font-semibold text-[var(--primary-text)] tracking-tight px-1">Humanity in Every Line of Code.</h4>
                    <div className="space-y-6 px-1 opacity-90">
                        <p>EmpathIQ Sanctuary was born from a simple observation: modern AI feels cold, and modern mental health tools feel like homework.</p>
                        <p>Our mission is to create a digital space that feels like a quiet room—breathable, calm, and deeply personal. We believe technology should be a mirror to your heart, helping you see yourself more clearly.</p>
                    </div>
                </div>
            );
        case 'privacy':
            return (
                <div className="space-y-10 text-[13px] leading-relaxed text-[var(--secondary-text)]">
                    <div className="card bg-white p-8 border-[var(--border)] flex items-start gap-6 shadow-sm">
                        <div className="w-12 h-12 bg-green-50 rounded-2xl flex items-center justify-center shrink-0 shadow-xs">
                            <Lock className="w-6 h-6 text-green-600" strokeWidth={1.5} />
                        </div>
                        <div>
                            <h4 className="text-[16px] font-semibold text-[var(--primary-text)] mb-1">Sanctuary Trust</h4>
                            <p className="opacity-80 leading-relaxed">Your data is yours. We use clinical-grade encryption and a strict "Privacy-First" architecture. Reflections, logs, and pulses are stored securely and never used for advertising.</p>
                        </div>
                    </div>
                    <ul className="space-y-4 px-2">
                        <li className="flex items-center gap-3">
                            <div className="w-5 h-5 bg-green-50 rounded-lg flex items-center justify-center">
                                <CheckCircle2 className="w-3.5 h-3.5 text-green-600" />
                            </div>
                            <span className="font-medium">No Third-Party Tracking</span>
                        </li>
                        <li className="flex items-center gap-3">
                            <div className="w-5 h-5 bg-green-50 rounded-lg flex items-center justify-center">
                                <CheckCircle2 className="w-3.5 h-3.5 text-green-600" />
                            </div>
                            <span className="font-medium">Encrypted Journal Storage</span>
                        </li>
                        <li className="flex items-center gap-3">
                            <div className="w-5 h-5 bg-green-50 rounded-lg flex items-center justify-center">
                                <CheckCircle2 className="w-3.5 h-3.5 text-green-600" />
                            </div>
                            <span className="font-medium">Instant Data Deletion options</span>
                        </li>
                    </ul>
                </div>
            );
        case 'ethics':
            return (
                <div className="space-y-10 text-[13px] leading-relaxed text-[var(--secondary-text)]">
                    <h4 className="text-[16px] font-semibold text-[var(--primary-text)] px-1">AI Responsiblity</h4>
                    <p className="px-1 opacity-90">We believe AI should assist, not replace, human connection. Our ethical guidelines ensure:</p>
                    <div className="space-y-6">
                        <div className="card bg-white p-6 border-[var(--border)] shadow-xs">
                            <h5 className="font-semibold text-[var(--primary-text)] mb-2 text-[14px]">Transparency Protocols</h5>
                            <p className="opacity-70 leading-relaxed">You will always know when you are interacting with our AI Buddy. We do not engage in human deception.</p>
                        </div>
                        <div className="card bg-white p-6 border-[var(--border)] shadow-xs">
                            <h5 className="font-semibold text-[var(--primary-text)] mb-2 text-[14px]">Safety-First Signal Detection</h5>
                            <p className="opacity-70 leading-relaxed">Our models are trained to detect high-risk signals and immediately redirect to human crisis resources.</p>
                        </div>
                    </div>
                </div>
            );
        case 'about':
            return (
                <div className="space-y-12 text-[13px] leading-relaxed text-[var(--secondary-text)]">
                    <section className="space-y-6">
                        <div className="relative group overflow-hidden rounded-[24px] border border-[var(--border)] shadow-sm">
                            <img src="/mental_health_ai_companion_1772096314940.png" alt="AI Companion" className="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-105" />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />
                        </div>
                        <div className="px-1 space-y-4">
                            <h4 className="text-[16px] font-semibold text-[var(--primary-text)]">Why Emotion-Aware AI?</h4>
                            <p>Most mental health apps focus on tracking or static content. EmpathIQ represents a shift toward <strong>Resonance</strong>. While tools like Headspace or Calm offer excellent guided sessions, they often feel "static." They don't know if you're crying, overwhelmed, or triumphant.</p>
                            <p>Our platform uses advanced E-AI (Emotional AI) to sit in the space between you and your thoughts. It recognizes the nuances in your reflections and adapts its coaching protocol in real-time.</p>
                        </div>
                    </section>

                    <section className="grid grid-cols-1 md:grid-cols-2 gap-6 px-1">
                        <div className="space-y-4">
                            <h4 className="text-[15px] font-semibold text-[var(--primary-text)]">Our Edge</h4>
                            <ul className="space-y-3 opacity-90">
                                <li className="flex gap-3">
                                    <div className="w-1.5 h-1.5 rounded-full bg-[var(--accent)] mt-1.5 shrink-0" />
                                    <span>Real-time sentiment-aware coaching.</span>
                                </li>
                                <li className="flex gap-3">
                                    <div className="w-1.5 h-1.5 rounded-full bg-[var(--accent)] mt-1.5 shrink-0" />
                                    <span>Non-linear journaling with auto-synthesis.</span>
                                </li>
                                <li className="flex gap-3">
                                    <div className="w-1.5 h-1.5 rounded-full bg-[var(--accent)] mt-1.5 shrink-0" />
                                    <span>Clinical-grade data encryption and privacy.</span>
                                </li>
                            </ul>
                        </div>
                        <div className="rounded-2xl border border-[var(--border)] overflow-hidden shadow-sm">
                            <img src="/ai_mental_health_visualization_1772096491768.png" alt="Neural Resonance" className="w-full h-full object-cover" />
                        </div>
                    </section>

                    <section className="card bg-[var(--surface)] border-none p-8 text-center space-y-4">
                        <h4 className="text-[18px] font-semibold text-[var(--primary-text)] tracking-tight">Mental Health is Not a Choice.</h4>
                        <p className="max-w-md mx-auto opacity-70">Over 1 in 5 adults live with a mental illness. EmpathIQ isn't just an app—it's a proactive sanctuary designed to lower the barrier to support and self-understanding.</p>
                    </section>
                </div>
            );
        case 'help':
            return (
                <div className="space-y-6 text-[13px] text-[var(--secondary-text)]">
                    <div className="space-y-4">
                        <div className="card bg-white border border-[var(--border)] rounded-xl p-6 shadow-xs">
                            <h5 className="font-semibold text-[var(--primary-text)] mb-3 text-[14px]">How do Mood Pixels work?</h5>
                            <p className="opacity-70 leading-relaxed">Simply tap a pixel on the Analytics page or complete your Daily Pulse check-in. The color represents your emotional intensity for that day.</p>
                        </div>
                    </div>
                </div>
            );
        case 'safety':
            return (
                <div className="space-y-10 text-[13px] leading-relaxed text-[var(--secondary-text)]">
                    <div className="card bg-red-50 p-8 border-none shadow-sm">
                        <h4 className="text-[17px] font-semibold text-red-900 mb-4 flex items-center gap-3">
                            <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center shadow-xs">
                                <LifeBuoy className="w-4 h-4 text-red-600" />
                            </div>
                            Urgent Support
                        </h4>
                        <p className="text-red-800/80 mb-8 font-medium leading-relaxed">If you are in immediate danger, please contact local emergency services or a crisis hotline immediately.</p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <div className="p-4 bg-white rounded-xl text-red-900 font-bold shadow-xs flex flex-col items-center text-center">
                                <span className="opacity-40 text-[9px] uppercase tracking-widest mb-1">US/Global</span>
                                <span className="text-[15px]">988</span>
                            </div>
                            <div className="p-4 bg-white rounded-xl text-red-900 font-bold shadow-xs flex flex-col items-center text-center">
                                <span className="opacity-40 text-[9px] uppercase tracking-widest mb-1">UK Specific</span>
                                <span className="text-[15px]">111 / 999</span>
                            </div>
                        </div>
                    </div>
                    <p className="px-1 opacity-80 leading-relaxed">Our "Crisis Support" protocol is accessible from every page via the help icon. It provides localized resources and immediate grounding techniques.</p>
                </div>
            );
        case 'connect':
            return (
                <div className="space-y-8 text-[13px] leading-relaxed text-[var(--secondary-text)]">
                    <p className="px-1">We are a small team dedicated to mental wellness. Whether you have feedback, a bug report, or just want to share your sanctuary experience, we’d love to hear from you.</p>
                    <div className="space-y-4">
                        <div className="card bg-white border border-[var(--border)] p-5 rounded-2xl flex items-center justify-between shadow-xs">
                            <div className="flex flex-col">
                                <span className="text-[10px] uppercase tracking-widest font-bold opacity-30 mb-0.5">Contact</span>
                                <span className="font-semibold text-[var(--primary-text)]">hello@empathiq.ai</span>
                            </div>
                            <Sparkles className="w-4 h-4 text-[var(--accent)]" />
                        </div>
                        <div className="card bg-white border border-[var(--border)] p-5 rounded-2xl flex items-center justify-between shadow-xs">
                            <div className="flex flex-col">
                                <span className="text-[10px] uppercase tracking-widest font-bold opacity-30 mb-0.5">Clinical</span>
                                <span className="font-semibold text-[var(--primary-text)]">clinical@empathiq.ai</span>
                            </div>
                            <Heart className="w-4 h-4 text-red-400 opacity-40" />
                        </div>
                    </div>
                </div>
            );
        default:
            return <div className="py-20 text-center opacity-30 text-[15px] font-medium tracking-tight">Select a topic to begin.</div>;
    }
}
