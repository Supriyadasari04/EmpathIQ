'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Lock, Eye, EyeOff, CheckCircle2 } from 'lucide-react';
import { supabase } from '@/lib/supabase';

export default function ResetPasswordPage() {
    const router = useRouter();
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (password.length < 6) {
            setError('Password must be at least 6 characters');
            return;
        }

        setLoading(true);
        setError('');

        const { error } = await supabase.auth.updateUser({ password });

        if (error) {
            setError(error.message);
            setLoading(false);
        } else {
            setSuccess(true);
            setTimeout(() => {
                router.push('/login');
            }, 3000);
        }
    };

    if (success) {
        return (
            <div className="card bg-white p-8 shadow-xs border border-[var(--border)] text-center">
                <div className="w-16 h-16 bg-[var(--surface)] border border-[var(--border)] rounded-2xl flex items-center justify-center mx-auto mb-6">
                    <CheckCircle2 className="w-8 h-8 text-green-500" strokeWidth={1.5} />
                </div>
                <h1 className="text-[20px] font-semibold tracking-tight">Sanctuary Restored.</h1>
                <p className="text-[13px] text-[var(--secondary-text)] opacity-60 mt-2">
                    Your password has been updated.
                </p>
            </div>
        );
    }

    return (
        <div className="card bg-white p-8 shadow-xs border border-[var(--border)]">
            <div className="mb-6">
                <h1 className="text-[20px] font-semibold tracking-tight">New Gateway.</h1>
                <p className="text-[13px] text-[var(--secondary-text)] opacity-40 mt-1">Create a secure new password.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-1.5">
                    <label className="text-[10px] font-medium uppercase tracking-wider text-[var(--secondary-text)] opacity-40 px-0.5">New Password</label>
                    <div className="relative">
                        <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--secondary-text)] opacity-30" strokeWidth={1.5} />
                        <input
                            type={showPassword ? "text" : "password"}
                            required
                            className="w-full h-10 pl-14 pr-10 bg-[var(--surface)] border border-[var(--border)] rounded-lg text-[13px] font-medium outline-none focus:bg-white focus:ring-2 focus:ring-[var(--accent)] transition-all"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
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
                    disabled={loading || !password}
                    className="w-full btn-primary h-10 rounded-lg mt-2 font-medium disabled:opacity-40"
                >
                    {loading ? (
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                        'Update Password'
                    )}
                </button>
            </form>
        </div>
    );
}
