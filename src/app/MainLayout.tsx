'use client';

import React from 'react';
import Sidebar from '@/components/Sidebar';
import GlobalAIBuddy from '@/components/GlobalAIBuddy';
import NotificationBell from '@/components/NotificationBell';
import SupportPopover from '@/components/SupportPopover';
import TrustPopover from '@/components/TrustPopover';
import { usePathname, useRouter } from 'next/navigation';
import { useApp } from '@/lib/store';

export default function MainLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();
    const router = useRouter();
    const { user, loading } = useApp();

    const isPublicLayout = pathname === '/' || pathname === '/login' || pathname === '/signup' || pathname === '/onboarding' || pathname === '/forgot-password' || pathname === '/reset-password' || pathname === '/docs';

    React.useEffect(() => {
        if (!loading && !user.isLoggedIn && !isPublicLayout) {
            router.push('/');
        }
    }, [user.isLoggedIn, loading, isPublicLayout, router]);

    if (isPublicLayout) {
        return (
            <div className="relative min-h-screen">
                {children}
            </div>
        );
    }

    return (
        <div className="flex min-h-screen bg-[var(--background)]">
            <Sidebar />
            <main className="flex-1 pl-[220px] pr-8 pb-16 relative min-h-screen">
                <header className="flex justify-end items-center gap-2 pt-6 pb-4 sticky top-0 bg-[var(--background)]/80 backdrop-blur-xl z-30 mb-6 border-b border-[var(--border)]">
                    <SupportPopover />
                    <TrustPopover />
                    <NotificationBell />
                </header>
                <div className="max-w-[1024px] mx-auto px-6">
                    {children}
                </div>
            </main>
            <GlobalAIBuddy />
        </div>
    );
}
