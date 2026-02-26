'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { ArrowLeft, User, Mail, Lock } from 'lucide-react';
import { useApp } from '@/lib/store';

export default function SignupPage() {
    const router = useRouter();
    const { signup } = useApp();
    const [formData, setFormData] = useState({ name: '', email: '', password: '' });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [isSubmitted, setIsSubmitted] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.name || !formData.email || !formData.password) {
            setError('Please fill in all fields');
            return;
        }

        setLoading(true);
        setError('');

        const { data, error } = await signup(formData.email, formData.password, formData.name);

        if (error) {
            if (error.message.toLowerCase().includes('already registered') || error.message.toLowerCase().includes('already exists')) {
                setError('This email is already in use. Try logging in instead.');
            } else {
                setError(error.message);
            }
            setLoading(false);
        } else {
            // If session is null, it means email confirmation is required
            if (!data.session) {
                setIsSubmitted(true);
                setLoading(false);
            } else {
                router.push('/onboarding');
            }
        }
    };

    if (isSubmitted) {
        return (
            <motion.div
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                className="card bg-white p-8 shadow-xs border border-[var(--border)] text-center"
            >
                <div className="w-16 h-16 bg-[var(--surface)] border border-[var(--border)] rounded-2xl flex items-center justify-center mx-auto mb-6">
                    <Mail className="w-8 h-8 text-[var(--accent)]" strokeWidth={1.5} />
                </div>
                <h1 className="text-[20px] font-semibold tracking-tight mb-2">Check your inbox.</h1>
                <p className="text-[13px] text-[var(--secondary-text)] opacity-60 leading-relaxed mb-8">
                    We've sent a magic link to <span className="font-semibold text-[var(--primary-text)]">{formData.email}</span>.
                </p>
                <div className="space-y-4">
                    <button
                        onClick={() => router.push('/login')}
                        className="w-full btn-primary h-10 rounded-lg text-[13px] font-medium"
                    >
                        Back to Login
                    </button>
                    <p className="text-[11px] text-[var(--secondary-text)] opacity-30">
                        Didn't receive it? Check your spam folder.
                    </p>
                </div>
            </motion.div>
        );
    }

    return (
        <div className="card bg-white p-8 shadow-xs border border-[var(--border)]">
            <div className="mb-6">
                <button
                    onClick={() => router.push('/login')}
                    className="p-1.5 -ml-1.5 mb-4 rounded-lg hover:bg-[var(--surface)] transition-all"
                >
                    <ArrowLeft className="w-4 h-4 text-[var(--secondary-text)]" strokeWidth={1.5} />
                </button>
                <h1 className="text-[20px] font-semibold tracking-tight">Create account.</h1>
                <p className="text-[13px] text-[var(--secondary-text)] opacity-40 mt-1">Start your journey today.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-1.5">
                    <label className="text-[10px] font-medium uppercase tracking-wider text-[var(--secondary-text)] opacity-40 px-0.5">Full Name</label>
                    <div className="relative">
                        <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--secondary-text)] opacity-30" strokeWidth={1.5} />
                        <input
                            type="text"
                            className="w-full h-10 pl-14 pr-4 bg-[var(--surface)] border border-[var(--border)] rounded-lg text-[13px] font-medium outline-none focus:bg-white focus:ring-2 focus:ring-[var(--accent)] transition-all"
                            placeholder="John Doe"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        />
                    </div>
                </div>

                <div className="space-y-1.5">
                    <label className="text-[10px] font-medium uppercase tracking-wider text-[var(--secondary-text)] opacity-40 px-0.5">Email</label>
                    <div className="relative">
                        <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--secondary-text)] opacity-30" strokeWidth={1.5} />
                        <input
                            type="email"
                            className="w-full h-10 pl-14 pr-4 bg-[var(--surface)] border border-[var(--border)] rounded-lg text-[13px] font-medium outline-none focus:bg-white focus:ring-2 focus:ring-[var(--accent)] transition-all"
                            placeholder="name@example.com"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        />
                    </div>
                </div>

                <div className="space-y-1.5">
                    <label className="text-[10px] font-medium uppercase tracking-wider text-[var(--secondary-text)] opacity-40 px-0.5">Password</label>
                    <div className="relative">
                        <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--secondary-text)] opacity-30" strokeWidth={1.5} />
                        <input
                            type="password"
                            className="w-full h-10 pl-14 pr-4 bg-[var(--surface)] border border-[var(--border)] rounded-lg text-[13px] font-medium outline-none focus:bg-white focus:ring-2 focus:ring-[var(--accent)] transition-all"
                            placeholder="••••••••"
                            value={formData.password}
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        />
                    </div>
                </div>

                {error && <p className="text-[11px] font-medium text-red-500 px-0.5">{error}</p>}

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full btn-primary h-10 rounded-lg mt-2 font-medium disabled:opacity-40"
                >
                    {loading ? 'Creating...' : 'Sign Up'}
                </button>
            </form>

            <div className="mt-8 pt-6 border-t border-[var(--border)] text-center">
                <p className="text-[13px] text-[var(--secondary-text)] opacity-40">
                    Active account? <Link href="/login" className="text-[var(--primary-text)] font-semibold hover:underline">Log in</Link>
                </p>
            </div>
        </div>
    );
}
