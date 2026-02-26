'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { useApp } from '@/lib/store';

export default function LoginPage() {
    const router = useRouter();
    const { login } = useApp();
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.email || !formData.password) {
            setError('Please fill in all fields');
            return;
        }

        setLoading(true);
        setError('');

        const { error } = await login(formData.email, formData.password);

        if (error) {
            setError(error.message);
            setLoading(false);
        } else {
            router.push('/dashboard');
        }
    };

    return (
        <div className="card bg-white p-8 shadow-xs border border-[var(--border)]">
            <div className="mb-6">
                <button
                    onClick={() => router.push('/')}
                    className="p-1.5 -ml-1.5 mb-4 rounded-lg hover:bg-[var(--surface)] transition-all"
                >
                    <ArrowLeft className="w-4 h-4 text-[var(--secondary-text)]" strokeWidth={1.5} />
                </button>
                <h1 className="text-[20px] font-semibold tracking-tight">Welcome back.</h1>
                <p className="text-[13px] text-[var(--secondary-text)] opacity-40 mt-1">Sign in to your sanctuary.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
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
                    <div className="flex items-center justify-between px-0.5">
                        <label className="text-[10px] font-medium uppercase tracking-wider text-[var(--secondary-text)] opacity-40">Password</label>
                        <button
                            type="button"
                            onClick={() => router.push('/forgot-password')}
                            className="text-[10px] font-medium text-blue-400 hover:underline"
                        >
                            Forgot?
                        </button>
                    </div>
                    <div className="relative">
                        <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--secondary-text)] opacity-30" strokeWidth={1.5} />
                        <input
                            type={showPassword ? "text" : "password"}
                            className="w-full h-10 pl-14 pr-10 bg-[var(--surface)] border border-[var(--border)] rounded-lg text-[13px] font-medium outline-none focus:bg-white focus:ring-2 focus:ring-[var(--accent)] transition-all"
                            placeholder="••••••••"
                            value={formData.password}
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 h-auto w-auto hover:bg-[var(--surface)] rounded-lg transition-all"
                        >
                            {showPassword ? <EyeOff className="w-3.5 h-3.5 text-[var(--secondary-text)] opacity-30" strokeWidth={1.5} /> : <Eye className="w-3.5 h-3.5 text-[var(--secondary-text)] opacity-30" strokeWidth={1.5} />}
                        </button>
                    </div>
                </div>

                {error && <p className="text-[11px] font-medium text-red-500 px-0.5">{error}</p>}

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full btn-primary h-10 rounded-lg mt-2 font-medium disabled:opacity-40"
                >
                    {loading ? 'Entering...' : 'Log In'}
                </button>
            </form>

            <div className="mt-8 pt-6 border-t border-[var(--border)] text-center">
                <p className="text-[13px] text-[var(--secondary-text)] opacity-40">
                    New here? <Link href="/signup" className="text-[var(--primary-text)] font-semibold hover:underline">Create account</Link>
                </p>
            </div>
        </div>
    );
}
