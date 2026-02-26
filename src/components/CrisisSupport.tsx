'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Phone, Heart, ExternalLink, ShieldAlert } from 'lucide-react';

interface CrisisSupportProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function CrisisSupport({ isOpen, onClose }: CrisisSupportProps) {
    const internationalLink = "https://www.befrienders.org/";

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[500] flex items-center justify-center p-4 sm:p-6">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/5 backdrop-blur-sm"
                    />
                    <motion.div
                        initial={{ opacity: 0, scale: 0.98 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.98 }}
                        className="relative w-full max-w-sm bg-white shadow-xl rounded-2xl overflow-hidden border border-[var(--border)]"
                    >
                        <div className="bg-red-50/50 px-6 py-4 flex items-center justify-between border-b border-red-100">
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center">
                                    <ShieldAlert className="w-5 h-5 text-red-600" strokeWidth={1.5} />
                                </div>
                                <h2 className="text-[17px] font-semibold text-red-950 tracking-tight">Need Support?</h2>
                            </div>
                            <button onClick={onClose} className="p-1.5 hover:bg-black/5 rounded-lg transition-all">
                                <X className="w-4 h-4 text-red-950 opacity-40" strokeWidth={1.5} />
                            </button>
                        </div>

                        <div className="p-6 space-y-6 max-h-[60vh] overflow-y-auto scrollbar-none">
                            <p className="text-[13px] text-[var(--secondary-text)] opacity-60 leading-relaxed font-medium">
                                If you're in immediate danger, please dial <span className="text-red-600 font-semibold">112</span> or <span className="text-red-600 font-semibold">100</span> (India) immediately.
                            </p>

                            <div className="space-y-3">
                                <ResourceItem
                                    icon={<Phone className="w-4 h-4" strokeWidth={1.5} />}
                                    title="Kiran Helpline"
                                    contact="1800-599-0019"
                                    description="24/7 Mental Health Helpline."
                                />
                                <ResourceItem
                                    icon={<Heart className="w-4 h-4" strokeWidth={1.5} />}
                                    title="Vandrevala Foundation"
                                    contact="9999-666-555"
                                    description="24/7 Call or WhatsApp."
                                />

                                <a
                                    href={internationalLink}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="w-full p-4 bg-[var(--surface)] hover:bg-[var(--accent)] hover:text-white rounded-xl flex items-center justify-between group transition-all border border-[var(--border)]"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 bg-white border border-[var(--border)] rounded-lg flex items-center justify-center group-hover:bg-white/20">
                                            <ExternalLink className="w-3.5 h-3.5 opacity-40 group-hover:opacity-100" strokeWidth={1.5} />
                                        </div>
                                        <span className="text-[11px] font-semibold uppercase tracking-wider">International</span>
                                    </div>
                                    <ChevronRight className="w-3.5 h-3.5 opacity-20 group-hover:opacity-100" />
                                </a>
                            </div>
                        </div>

                        <div className="p-6 bg-[var(--surface)] border-t border-[var(--border)]">
                            <button
                                onClick={onClose}
                                className="h-10 w-full btn-primary rounded-lg text-[13px] font-medium"
                            >
                                Back to Buddy
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}

function ResourceItem({ icon, title, contact, description }: { icon: React.ReactNode; title: string; contact: string; description: string }) {
    return (
        <div className="p-4 border border-[var(--border)] rounded-xl flex items-start gap-4 hover:bg-[var(--surface)] transition-all group">
            <div className="w-10 h-10 bg-[var(--surface)] border border-[var(--border)] rounded-lg flex items-center justify-center text-[var(--secondary-text)] opacity-40 group-hover:opacity-100 transition-opacity">{icon}</div>
            <div className="flex-1">
                <h3 className="font-semibold text-[10px] uppercase tracking-wider text-[var(--secondary-text)] opacity-40 mb-1">{title}</h3>
                <p className="text-[17px] font-semibold tracking-tight text-[var(--primary-text)] mb-1">{contact}</p>
                <p className="text-[11px] text-[var(--secondary-text)] opacity-60 leading-relaxed font-medium">{description}</p>
            </div>
            <a href={`tel:${contact.replace(/-/g, '')}`} className="w-10 h-10 bg-[var(--surface)] border border-[var(--border)] text-[var(--primary-text)] rounded-lg flex items-center justify-center hover:bg-[var(--accent)] transition-all">
                <Phone className="w-3.5 h-3.5" strokeWidth={1.5} />
            </a>
        </div>
    );
}

function ChevronRight(props: any) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="m9 18 6-6-6-6" />
        </svg>
    );
}
