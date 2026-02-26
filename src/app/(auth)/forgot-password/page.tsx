'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Mail, ChevronRight } from 'lucide-react';
import { useApp } from '@/lib/store';

export default function ForgotPasswordPage() {
    const router = useRouter();
    const { sendPasswordResetEmail } = useApp();
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setMessage(null);

        const { error } = await sendPasswordResetEmail(email);

        if (error) {
            setMessage({ type: 'error', text: error.message });
        } else {
            setMessage({ type: 'success', text: 'Reset link sent! Please check your inbox.' });
        }
        setLoading(false);
    };

    return (
        <div className="card bg-white p-8 shadow-xs border border-[var(--border)]">
            <div className="mb-6">
                <button
                    onClick={() => router.push('/login')}
                    className="p-1.5 -ml-1.5 mb-4 rounded-lg hover:bg-[var(--surface)] transition-all"
                >
                    <ArrowLeft className="w-4 h-4 text-[var(--secondary-text)]" strokeWidth={1.5} />
                </button>
                <h1 className="text-[20px] font-semibold tracking-tight">Restore Sanctuary.</h1>
                <p className="text-[13px] text-[var(--secondary-text)] opacity-40 mt-1">Enter your email for a recovery link.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-1.5">
                    <label className="text-[10px] font-medium uppercase tracking-wider text-[var(--secondary-text)] opacity-40 px-0.5">Registered Email</label>
                    <div className="relative">
                        <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--secondary-text)] opacity-30" strokeWidth={1.5} />
                        <input
                            type="email"
                            required
                            className="w-full h-10 pl-14 pr-4 bg-[var(--surface)] border border-[var(--border)] rounded-lg text-[13px] font-medium outline-none focus:bg-white focus:ring-2 focus:ring-[var(--accent)] transition-all"
                            placeholder="name@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                </div>

                {message && (
                    <div className={cn(
                        "p-3 rounded-lg text-[11px] font-medium",
                        message.type === 'success' ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"
                    )}>
                        {message.text}
                    </div>
                )}

                <button
                    type="submit"
                    disabled={loading || !email}
                    className="w-full btn-primary h-10 rounded-lg mt-2 font-medium disabled:opacity-40"
                >
                    {loading ? (
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                        <div className="flex items-center justify-center gap-2">Send Link <ChevronRight className="w-3.5 h-3.5" strokeWidth={1.5} /></div>
                    )}
                </button>
            </form>

            <div className="mt-8 pt-6 border-t border-[var(--border)] text-center">
                <p className="text-[13px] text-[var(--secondary-text)] opacity-40">
                    Remembered it? <Link href="/login" className="text-[var(--primary-text)] font-semibold hover:underline">Log in</Link>
                </p>
            </div>
        </div>
    );
}

function cn(...classes: any[]) {
    return classes.filter(Boolean).join(' ');
}
