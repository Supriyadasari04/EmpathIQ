'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
    Home,
    Brain,
    PlusCircle,
    BarChart3,
    CheckCircle2,
    Trophy,
    User,
    LogOut,
    Heart,
    ChevronRight,
    Sparkles
} from 'lucide-react';
import NotificationBell from './NotificationBell';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { useApp } from '@/lib/store';

const navItems = [
    { icon: Home, label: 'Omni Dashboard', href: '/dashboard' },
    { icon: Brain, label: 'Clinical Coach', href: '/coach' },
    { icon: Sparkles, label: 'Therapeutic Sanctuary', href: '/activities' },
    { icon: PlusCircle, label: 'Mind Logs', href: '/reflections' },
    { icon: BarChart3, label: 'Empathy Analytics', href: '/analytics' },
    { icon: CheckCircle2, label: 'Habit Rituals', href: '/habits' },
    { icon: Trophy, label: 'Achievements', href: '/achievements' },
];

export default function Sidebar() {
    const pathname = usePathname();
    const router = useRouter();
    const { logout } = useApp();

    const handleLogout = async () => {
        await logout();
        router.push('/login');
    };

    return (
        <div className="fixed left-0 top-0 bottom-0 w-[220px] z-40 bg-[var(--surface)] border-r border-[var(--border)]">
            <div className="h-full flex flex-col p-4 relative overflow-hidden">
                {/* Logo Section */}
                <div className="flex items-center gap-3 mb-8 px-2">
                    <div className="w-8 h-8 bg-[var(--accent)] rounded-lg flex items-center justify-center shadow-sm">
                        <Heart className="text-[var(--primary-text)] w-4 h-4 fill-current" strokeWidth={0} />
                    </div>
                    <div className="flex flex-col">
                        <span className="font-semibold text-[15px] tracking-tight text-[var(--primary-text)]">EmpathIQ</span>
                    </div>
                </div>

                {/* Navigation */}
                <nav className="flex-1 space-y-1 overflow-y-auto pr-1">
                    {navItems.map((item) => {
                        const isActive = pathname === item.href;
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={cn(
                                    "flex items-center gap-3 px-3 py-2 rounded-lg text-[13px] font-medium transition-all group",
                                    isActive
                                        ? "bg-[var(--accent)] text-[var(--primary-text)] shadow-sm font-semibold"
                                        : "text-[var(--secondary-text)] hover:bg-[var(--accent-soft)] hover:text-[var(--primary-text)]"
                                )}
                            >
                                <item.icon className={cn(
                                    "w-4 h-4 transition-all",
                                    isActive ? "text-[var(--primary-text)]" : "text-[var(--secondary-text)] group-hover:text-[var(--primary-text)]"
                                )} />
                                {item.label}
                            </Link>
                        );
                    })}
                </nav>

                <div className="mt-auto space-y-1 pt-4 border-t border-[var(--border)]">
                    <Link
                        href="/settings"
                        className={cn(
                            "flex items-center gap-3 px-3 py-2 rounded-lg text-[13px] font-medium transition-all group",
                            pathname === '/settings' ? "bg-[var(--accent)] text-[var(--primary-text)] shadow-sm font-semibold" : "text-[var(--secondary-text)] hover:bg-[var(--accent-soft)] hover:text-[var(--primary-text)]"
                        )}
                    >
                        <User className="w-4 h-4" />
                        Settings
                    </Link>
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-[13px] font-medium text-red-500/70 hover:bg-red-50 hover:text-red-600 transition-all text-left"
                    >
                        <LogOut className="w-4 h-4" />
                        Log Out
                    </button>
                </div>
            </div>
        </div>
    );
}
