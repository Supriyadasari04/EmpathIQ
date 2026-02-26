'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Compass, ArrowLeft, Home } from 'lucide-react';

export default function NotFound() {
    return (
        <div className="min-h-screen bg-[var(--background)] flex items-center justify-center p-6 text-center">
            <motion.div
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                className="max-w-xs space-y-6"
            >
                <div className="w-16 h-16 bg-[var(--accent)] rounded-[24px] flex items-center justify-center mx-auto shadow-xs">
                    <Compass className="w-8 h-8 text-[var(--primary-text)]" strokeWidth={1.5} />
                </div>

                <div className="space-y-2">
                    <h1 className="text-[20px] font-semibold tracking-tight">Sanctuary Lost.</h1>
                    <p className="text-[13px] text-[var(--secondary-text)] opacity-40 leading-relaxed max-w-[240px] mx-auto">
                        This part of the emotional landscape hasn't been mapped yet.
                    </p>
                </div>

                <div className="flex flex-col gap-2 pt-2">
                    <Link href="/dashboard" className="btn-primary h-10 px-6 rounded-lg flex items-center justify-center gap-2 text-[13px] font-medium shadow-xs">
                        <Home className="w-3.5 h-3.5" strokeWidth={1.5} />
                        Back to Dashboard
                    </Link>
                    <button
                        onClick={() => window.history.back()}
                        className="h-10 px-6 bg-white border border-[var(--border)] text-[var(--secondary-text)] opacity-60 rounded-lg flex items-center justify-center gap-2 text-[13px] font-medium hover:bg-[var(--surface)] transition-all"
                    >
                        <ArrowLeft className="w-3.5 h-3.5" strokeWidth={1.5} />
                        Step Back
                    </button>
                </div>

                <div className="pt-8">
                    <p className="text-[9px] font-medium uppercase tracking-widest text-[var(--secondary-text)] opacity-10">Error 404 — EmpathIQ Sanctuary</p>
                </div>
            </motion.div>
        </div>
    );
}
