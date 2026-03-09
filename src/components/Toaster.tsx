'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, X, CheckCircle2, AlertCircle, Info, Sparkles, Trophy } from 'lucide-react';
import { useApp } from '@/lib/store';
import { cn } from '@/lib/utils';

export default function Toaster() {
    const { activeToast, setActiveToast } = useApp();
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        if (activeToast) {
            setIsVisible(true);
            const timer = setTimeout(() => {
                setIsVisible(false);
                setTimeout(() => setActiveToast(null), 500); // Wait for exit animation
            }, 6000);
            return () => clearTimeout(timer);
        }
    }, [activeToast, setActiveToast]);

    if (!activeToast) return null;

    const getIcon = (type: string) => {
        switch (type) {
            case 'achievement': return <Trophy className="w-5 h-5 text-amber-500" strokeWidth={1.5} />;
            case 'mission': return <CheckCircle2 className="w-5 h-5 text-green-500" strokeWidth={1.5} />;
            case 'alert': return <AlertCircle className="w-5 h-5 text-red-500" strokeWidth={1.5} />;
            case 'coach': return <Sparkles className="w-5 h-5 text-purple-500" strokeWidth={1.5} />;
            default: return <Bell className="w-5 h-5 text-blue-500" strokeWidth={1.5} />;
        }
    };

    const getColors = (type: string) => {
        switch (type) {
            case 'achievement': return 'border-amber-100 bg-amber-50/50';
            case 'mission': return 'border-green-100 bg-green-50/50';
            case 'alert': return 'border-red-100 bg-red-50/50';
            case 'coach': return 'border-purple-100 bg-purple-50/50';
            default: return 'border-[var(--border)] bg-white';
        }
    };

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ opacity: 0, y: 100, scale: 0.9, x: 20 }}
                    animate={{ opacity: 1, y: 0, scale: 1, x: 0 }}
                    exit={{ opacity: 0, y: 20, scale: 0.95, filter: 'blur(10px)' }}
                    transition={{ type: 'spring', damping: 20, stiffness: 100 }}
                    style={{ position: 'fixed', bottom: '32px', right: '32px', zIndex: 1000 }}
                    className={cn(
                        "w-[320px] p-4 rounded-2xl border backdrop-blur-xl shadow-2xl flex gap-4 items-start cursor-pointer group",
                        getColors(activeToast.type)
                    )}
                    onClick={() => setIsVisible(false)}
                >
                    <div className="mt-1">
                        {getIcon(activeToast.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                        <h4 className="text-[14px] font-bold text-[var(--primary-text)] tracking-tight mb-0.5">
                            {activeToast.title}
                        </h4>
                        <p className="text-[12px] text-[var(--secondary-text)] leading-relaxed line-clamp-2">
                            {activeToast.message}
                        </p>
                    </div>
                    <button
                        className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-black/5 rounded-lg"
                        onClick={(e) => {
                            e.stopPropagation();
                            setIsVisible(false);
                        }}
                    >
                        <X className="w-3.5 h-3.5 text-[var(--secondary-text)] opacity-40" />
                    </button>

                    {/* Progress Bar (Auto-close indicator) */}
                    <motion.div
                        initial={{ scaleX: 1 }}
                        animate={{ scaleX: 0 }}
                        transition={{ duration: 6, ease: 'linear' }}
                        className="absolute bottom-0 left-0 right-0 h-1 bg-black/5 origin-left rounded-b-2xl overflow-hidden"
                    />
                </motion.div>
            )}
        </AnimatePresence>
    );
}
