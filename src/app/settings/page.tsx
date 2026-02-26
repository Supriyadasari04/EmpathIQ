'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
    User,
    Shield,
    Bell,
    Trash2,
    ChevronRight,
    LogOut,
    Sparkles,
    MessageSquare,
    Save,
    ArrowLeft
} from 'lucide-react';
import { useApp } from '@/lib/store';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { cn } from '@/lib/utils';

export default function SettingsPage() {
    const { user, buddy, setOnboarding, logout, addNotification } = useApp();
    const router = useRouter();
    const [isSaving, setIsSaving] = useState(false);
    const [activeTab, setActiveTab] = useState<'profile' | 'account' | 'notifications'>('profile');

    // Local state for editing
    const [profileData, setProfileData] = useState({
        userName: user.name,
        buddyName: buddy.name,
        buddyStyle: buddy.style,
        buddyAge: buddy.age
    });

    const handleSave = async () => {
        setIsSaving(true);
        try {
            // Update via the onboarding function which handles buddy persistence
            await setOnboarding({
                ...profileData,
                goalCategories: [], // Empty to keep existing goals if we had them
            });
            addNotification({
                title: 'Settings Saved',
                message: 'Your sanctuary preferences have been updated. ✨',
                type: 'mission'
            });
        } catch (err) {
            console.error(err);
        } finally {
            setIsSaving(false);
        }
    };

    const handleLogout = async () => {
        await logout();
        router.push('/login');
    };

    const handleDeleteAccount = () => {
        const confirmed = window.confirm("Are you absolutely sure? This will permanently erase your reflections, habits, and AI history. This action cannot be undone.");
        if (confirmed) {
            addNotification({
                title: 'Account Deletion Requested',
                message: 'Please contact support@empathiq.ai to finalize deletion in this version.',
                type: 'alert'
            });
        }
    };

    return (
        <div className="max-w-4xl mx-auto pb-16">
            {/* Header */}
            <div className="flex items-center gap-4 mb-8">
                <Link href="/dashboard" className="w-8 h-8 rounded-lg bg-[var(--surface)] border border-[var(--border)] flex items-center justify-center hover:bg-white transition-all">
                    <ArrowLeft className="w-4 h-4 text-[var(--secondary-text)]" strokeWidth={1.5} />
                </Link>
                <div className="space-y-0.5">
                    <h1 className="text-[22px] font-semibold tracking-tight">Settings</h1>
                    <p className="text-[13px] text-[var(--secondary-text)] leading-relaxed">Refine your environment and protocols.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-[200px_1fr] gap-8">
                {/* Sidebar Navigation */}
                <aside className="space-y-1">
                    <button
                        onClick={() => setActiveTab('profile')}
                        className={cn(
                            "w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-[13px] font-medium transition-all",
                            activeTab === 'profile' ? "bg-white text-[var(--primary-text)] shadow-xs border border-[var(--border)]" : "text-[var(--secondary-text)] opacity-60 hover:opacity-100"
                        )}
                    >
                        <User className="w-3.5 h-3.5" strokeWidth={1.5} /> Profile & Buddy
                    </button>
                    <button
                        onClick={() => setActiveTab('account')}
                        className={cn(
                            "w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-[13px] font-medium transition-all",
                            activeTab === 'account' ? "bg-white text-[var(--primary-text)] shadow-xs border border-[var(--border)]" : "text-[var(--secondary-text)] opacity-60 hover:opacity-100"
                        )}
                    >
                        <Shield className="w-3.5 h-3.5" strokeWidth={1.5} /> Security & Privacy
                    </button>
                    <div className="h-[1px] bg-[var(--border)] my-3 mx-2" />
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-[13px] font-medium text-red-500 hover:bg-red-50 transition-all"
                    >
                        <LogOut className="w-3.5 h-3.5" strokeWidth={1.5} /> Sign Out
                    </button>
                </aside>

                {/* Main Content Area */}
                <main className="space-y-6">
                    {activeTab === 'profile' && (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="space-y-6"
                        >
                            <section className="card bg-white p-6 space-y-6 shadow-xs">
                                <div className="space-y-0.5">
                                    <h2 className="text-[16px] font-semibold flex items-center gap-2">
                                        Your Identity
                                    </h2>
                                    <p className="text-[12px] text-[var(--secondary-text)] opacity-40">How the coach addresses you.</p>
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-medium uppercase tracking-wider text-[var(--secondary-text)] opacity-40 px-0.5">Display Name</label>
                                    <input
                                        type="text"
                                        value={profileData.userName}
                                        onChange={(e) => setProfileData({ ...profileData, userName: e.target.value })}
                                        className="w-full h-10 px-4 rounded-lg border border-[var(--border)] bg-[var(--surface)] focus:bg-white focus:ring-2 focus:ring-[var(--accent)] outline-none transition-all text-[13px] font-medium"
                                    />
                                </div>
                            </section>

                            <section className="card bg-white p-6 space-y-6 shadow-xs">
                                <div className="space-y-0.5">
                                    <h2 className="text-[16px] font-semibold flex items-center gap-2">
                                        Buddy Configuration
                                    </h2>
                                    <p className="text-[12px] text-[var(--secondary-text)] opacity-40">Customize your AI therapeutic partner.</p>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div className="space-y-1.5">
                                        <label className="text-[10px] font-medium uppercase tracking-wider text-[var(--secondary-text)] opacity-40 px-0.5">Buddy Name</label>
                                        <input
                                            type="text"
                                            value={profileData.buddyName}
                                            onChange={(e) => setProfileData({ ...profileData, buddyName: e.target.value })}
                                            className="w-full h-10 px-4 rounded-lg border border-[var(--border)] bg-[var(--surface)] focus:bg-white focus:ring-2 focus:ring-[var(--accent)] outline-none transition-all text-[13px] font-medium"
                                        />
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-[10px] font-medium uppercase tracking-wider text-[var(--secondary-text)] opacity-40 px-0.5">Persona</label>
                                        <div className="relative">
                                            <select
                                                value={profileData.buddyStyle}
                                                onChange={(e) => setProfileData({ ...profileData, buddyStyle: e.target.value as any })}
                                                className="w-full h-10 px-4 rounded-lg border border-[var(--border)] bg-[var(--surface)] focus:bg-white focus:ring-2 focus:ring-[var(--accent)] outline-none transition-all text-[13px] font-medium appearance-none"
                                            >
                                                <option>Friendly</option>
                                                <option>Clinical</option>
                                                <option>Direct</option>
                                                <option>Spiritual</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>
                            </section>

                            <div className="flex justify-end">
                                <button
                                    onClick={handleSave}
                                    disabled={isSaving}
                                    className="btn-primary h-10 px-6 rounded-lg text-[13px] flex items-center gap-2"
                                >
                                    {isSaving ? (
                                        <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    ) : (
                                        <Save className="w-3.5 h-3.5" />
                                    )}
                                    Update Sanctuary
                                </button>
                            </div>
                        </motion.div>
                    )}

                    {activeTab === 'account' && (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="space-y-6"
                        >
                            <section className="card bg-white p-6 space-y-4 shadow-xs">
                                <div className="space-y-0.5">
                                    <h2 className="text-[16px] font-semibold">Email Address</h2>
                                    <p className="text-[12px] text-[var(--secondary-text)] opacity-40">Used for sanctuary backup and notifications.</p>
                                </div>
                                <div className="p-3 rounded-lg bg-[var(--surface)] border border-[var(--border)] flex items-center justify-between">
                                    <span className="text-[13px] font-medium">{user.email}</span>
                                    <span className="px-1.5 py-0.5 bg-green-50 text-green-600 text-[9px] font-medium uppercase rounded border border-green-100">Verified</span>
                                </div>
                            </section>

                            <section className="card bg-red-50/10 border border-red-100 p-6 space-y-4">
                                <div className="space-y-0.5">
                                    <h2 className="text-[16px] font-semibold text-red-900">Danger Zone</h2>
                                    <p className="text-[12px] text-red-900/40">These actions are irreversible.</p>
                                </div>
                                <button
                                    onClick={handleDeleteAccount}
                                    className="h-10 px-4 rounded-lg border border-red-200 text-red-600 text-[13px] font-medium hover:bg-red-50 transition-all flex items-center gap-2"
                                >
                                    <Trash2 className="w-3.5 h-3.5" /> Erase Sanctuary Data
                                </button>
                            </section>
                        </motion.div>
                    )}
                </main>
            </div>
        </div>
    );
}
