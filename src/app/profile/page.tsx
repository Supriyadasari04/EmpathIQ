'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
    User,
    Mail,
    Settings,
    Camera,
    Check,
    ChevronRight,
    Info
} from 'lucide-react';
import { cn } from '@/lib/utils';

import { useApp } from '@/lib/store';
import { useRouter } from 'next/navigation';

export default function ProfilePage() {
    const {
        user,
        buddy,
        onboardingData,
        setOnboarding
    } = useApp();
    const router = useRouter();
    const [activeTab, setActiveTab] = useState<'details'>('details');
    const [userName, setUserName] = useState(user.name);
    const [email, setEmail] = useState(user.email);
    const [isSaved, setIsSaved] = useState(false);

    const handleSave = async () => {
        // Use setOnboarding to update both profile and buddy data as per the store logic
        await setOnboarding({
            ...onboardingData,
            userName,
            userEmail: email, // Assuming this is where it's stored in data
        });
        setIsSaved(true);
        setTimeout(() => setIsSaved(false), 2000);
    };

    const updateUserDetails = async (key: string, value: string) => {
        await setOnboarding({
            ...onboardingData,
            [key]: value
        });
    };

    const getInitials = (name: string) => {
        return (name || 'U')
            .split(' ')
            .map(n => n[0])
            .join('')
            .toUpperCase()
            .slice(0, 2);
    };

    return (
        <div className="max-w-4xl mx-auto pb-16">
            <div className="flex items-center gap-6 mb-8">
                <div className="relative group">
                    <div className="w-16 h-16 bg-[var(--surface)] border border-[var(--border)] rounded-2xl flex items-center justify-center shadow-xs">
                        <span className="text-[var(--primary-text)] text-xl font-semibold opacity-60">{getInitials(user.name)}</span>
                    </div>
                    <button className="absolute -bottom-1.5 -right-1.5 w-7 h-7 bg-white border border-[var(--border)] rounded-lg flex items-center justify-center shadow-sm hover:bg-[var(--surface)] transition-all">
                        <Camera className="w-3.5 h-3.5 text-[var(--secondary-text)]" strokeWidth={1.5} />
                    </button>
                </div>
                <div className="space-y-0.5">
                    <h1 className="text-[22px] font-semibold tracking-tight">{user.name}</h1>
                    <p className="text-[13px] text-[var(--secondary-text)] opacity-40">Member since February 2026</p>
                </div>
            </div>

            <div className="flex border-b border-[var(--border)] mb-8">
                {['details'].map(tab => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab as any)}
                        className={cn(
                            "px-6 py-2.5 text-[13px] font-medium uppercase tracking-wider transition-all relative",
                            activeTab === tab ? "text-[var(--primary-text)]" : "text-[var(--secondary-text)] opacity-40 hover:opacity-100"
                        )}
                    >
                        {tab}
                        {activeTab === tab && (
                            <motion.div layoutId="underline" className="absolute bottom-[-1px] left-0 right-0 h-[2px] bg-[var(--accent)]" />
                        )}
                    </button>
                ))}
            </div>

            <div className="min-h-[400px]">
                {activeTab === 'details' && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-8"
                    >
                        <section className="space-y-4">
                            <h2 className="text-[10px] font-medium uppercase tracking-wider text-[var(--secondary-text)] opacity-40 px-0.5 border-b border-[var(--border)] pb-1.5">Your Profile</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-medium uppercase tracking-wider text-[var(--secondary-text)] opacity-40 px-0.5">Display Name</label>
                                    <div className="relative">
                                        <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[var(--secondary-text)] opacity-30" strokeWidth={1.5} />
                                        <input
                                            value={userName}
                                            onChange={(e) => setUserName(e.target.value)}
                                            className="w-full h-10 pl-10 pr-4 bg-[var(--surface)] border border-[var(--border)] rounded-lg text-[13px] font-medium outline-none focus:bg-white focus:ring-2 focus:ring-[var(--accent)] transition-all"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-medium uppercase tracking-wider text-[var(--secondary-text)] opacity-40 px-0.5">Email Address</label>
                                    <div className="relative">
                                        <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[var(--secondary-text)] opacity-30" strokeWidth={1.5} />
                                        <input
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            className="w-full h-10 pl-10 pr-4 bg-[var(--surface)] border border-[var(--border)] rounded-lg text-[13px] font-medium outline-none focus:bg-white focus:ring-2 focus:ring-[var(--accent)] transition-all"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-medium uppercase tracking-wider text-[var(--secondary-text)] opacity-40 px-0.5">Age Range</label>
                                    <select
                                        value={onboardingData?.userAge || ''}
                                        onChange={(e) => updateUserDetails('userAge', e.target.value)}
                                        className="w-full h-10 px-4 bg-[var(--surface)] border border-[var(--border)] rounded-lg text-[13px] font-medium outline-none appearance-none cursor-pointer"
                                    >
                                        <option value="Under 18">Under 18</option>
                                        <option value="18-24">18-24</option>
                                        <option value="25-34">25-34</option>
                                        <option value="35-44">35-44</option>
                                        <option value="45+">45+</option>
                                    </select>
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-medium uppercase tracking-wider text-[var(--secondary-text)] opacity-40 px-0.5">Status</label>
                                    <select
                                        value={onboardingData?.userStatus || ''}
                                        onChange={(e) => updateUserDetails('userStatus', e.target.value)}
                                        className="w-full h-10 px-4 bg-[var(--surface)] border border-[var(--border)] rounded-lg text-[13px] font-medium outline-none appearance-none cursor-pointer"
                                    >
                                        <option value="Student">Student</option>
                                        <option value="Professional">Professional</option>
                                        <option value="Entrepreneur">Entrepreneur</option>
                                        <option value="Self-employed">Self-employed</option>
                                        <option value="Other">Other</option>
                                    </select>
                                </div>
                            </div>
                        </section>

                        <section className="space-y-4">
                            <h2 className="text-[10px] font-medium uppercase tracking-wider text-[var(--secondary-text)] opacity-40 px-0.5 border-b border-[var(--border)] pb-1.5">Buddy Profile</h2>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="card bg-white p-4 flex flex-col gap-0.5 shadow-xs">
                                    <label className="text-[9px] font-medium uppercase tracking-wider text-[var(--secondary-text)] opacity-40">Name</label>
                                    <p className="text-[14px] font-semibold">{buddy.name}</p>
                                </div>
                                <div className="card bg-white p-4 flex flex-col gap-0.5 shadow-xs">
                                    <label className="text-[9px] font-medium uppercase tracking-wider text-[var(--secondary-text)] opacity-40">Age</label>
                                    <p className="text-[14px] font-semibold">{buddy.age}</p>
                                </div>
                                <div className="card bg-white p-4 flex flex-col gap-0.5 shadow-xs">
                                    <label className="text-[9px] font-medium uppercase tracking-wider text-[var(--secondary-text)] opacity-40">Style</label>
                                    <p className="text-[14px] font-semibold text-blue-400">{buddy.style}</p>
                                </div>
                            </div>
                        </section>

                        <div className="bg-[var(--surface)] border border-[var(--border)] rounded-xl p-6 flex items-start gap-4 shadow-xs">
                            <Info className="w-5 h-5 text-[var(--secondary-text)] opacity-30 flex-shrink-0 mt-0.5" strokeWidth={1.5} />
                            <div className="space-y-1">
                                <p className="text-[13px] font-semibold">Personalization Data</p>
                                <p className="text-[12px] text-[var(--secondary-text)] opacity-60 leading-relaxed">
                                    Your profile and buddy <b>{buddy.name}</b>'s settings are synchronized across your sanctuary.
                                </p>
                            </div>
                        </div>

                        <div className="pb-8">
                            <button
                                onClick={handleSave}
                                className={cn(
                                    "btn-primary px-8 h-10 rounded-lg flex items-center justify-center gap-2",
                                    isSaved && "bg-green-500 border-green-500"
                                )}
                            >
                                {isSaved ? <><Check className="w-4 h-4" /> Saved</> : 'Save Changes'}
                            </button>
                        </div>
                    </motion.div>
                )}
            </div>
        </div>
    );
}
