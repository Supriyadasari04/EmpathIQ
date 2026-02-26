'use client';

import React, { useState } from 'react';
import { Bell, X, Trash2, ChevronRight, Info } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useApp } from '@/lib/store';
import { useRouter } from 'next/navigation';

export default function NotificationBell() {
    const { notifications, markNotificationRead, markAllNotificationsRead, clearAllNotifications, deleteNotification } = useApp();
    const [isOpen, setIsOpen] = useState(false);
    const router = useRouter();

    const unreadCount = notifications.filter(n => n.unread).length;

    return (
        <div className="relative">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={cn(
                    "w-8 h-8 flex items-center justify-center rounded-lg transition-all relative border border-[var(--border)] hover:bg-[var(--surface)]",
                    unreadCount > 0 ? "bg-white shadow-xs" : "bg-transparent text-[var(--secondary-text)] opacity-40 hover:opacity-100"
                )}
            >
                <Bell className={cn("w-4 h-4", unreadCount > 0 ? "text-[var(--primary-text)]" : "")} strokeWidth={1.5} />
                {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-red-500 text-white text-[8px] font-bold rounded-full flex items-center justify-center border border-white">
                        {unreadCount}
                    </span>
                )}
            </button>

            <AnimatePresence>
                {isOpen && (
                    <>
                        <div className="fixed inset-0 z-[60]" onClick={() => setIsOpen(false)} />
                        <motion.div
                            initial={{ opacity: 0, y: 8, scale: 0.98 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 8, scale: 0.98 }}
                            className="absolute right-0 mt-2 w-72 bg-white border border-[var(--border)] rounded-xl shadow-lg z-[70] overflow-hidden flex flex-col max-h-[440px] origin-top-right"
                        >
                            <div className="px-4 py-3 border-b border-[var(--border)] flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <Bell className="w-3.5 h-3.5 text-[var(--primary-text)] opacity-30" strokeWidth={1.5} />
                                    <h3 className="text-[12px] font-semibold tracking-tight">System Alerts</h3>
                                </div>
                                {notifications.length > 0 && (
                                    <button
                                        onClick={clearAllNotifications}
                                        className="text-[10px] font-medium text-[var(--secondary-text)] opacity-40 hover:opacity-100 flex items-center gap-1.5"
                                    >
                                        <Trash2 className="w-3 h-3" strokeWidth={1.5} /> Clear All
                                    </button>
                                )}
                            </div>

                            <div className="flex-1 overflow-y-auto scrollbar-none">
                                {notifications.length > 0 ? (
                                    <div className="flex flex-col">
                                        {notifications.map((n, i) => (
                                            <div
                                                key={`${n.id}-${i}`}
                                                className={cn(
                                                    "group p-4 border-b border-[var(--border)] last:border-0 hover:bg-[var(--surface)] transition-all relative",
                                                    !n.unread && "opacity-50"
                                                )}
                                            >
                                                <div className="flex justify-between items-start mb-1 pr-6">
                                                    <h4 className="text-[11px] font-semibold leading-tight line-clamp-1">{n.title}</h4>
                                                    <span className="text-[9px] font-medium text-[var(--secondary-text)] opacity-30">{n.time}</span>
                                                </div>
                                                <p className="text-[11px] text-[var(--secondary-text)] opacity-60 leading-relaxed line-clamp-2 mb-2 mr-2">{n.message}</p>

                                                <div className="flex items-center gap-3">
                                                    {n.unread && (
                                                        <button
                                                            onClick={() => markNotificationRead(n.id)}
                                                            className="text-[9px] font-semibold tracking-wide text-[var(--accent)] hover:underline"
                                                        >
                                                            Mark Read
                                                        </button>
                                                    )}
                                                    {n.link && (
                                                        <button
                                                            onClick={() => {
                                                                markNotificationRead(n.id);
                                                                router.push(n.link!);
                                                                setIsOpen(false);
                                                            }}
                                                            className="text-[9px] font-semibold tracking-wide text-blue-400 hover:underline"
                                                        >
                                                            View
                                                        </button>
                                                    )}
                                                </div>

                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        deleteNotification(n.id);
                                                    }}
                                                    className="absolute top-3 right-3 p-1 hover:bg-white rounded-md opacity-0 group-hover:opacity-100 transition-opacity"
                                                >
                                                    <X className="w-3 h-3 text-[var(--secondary-text)] opacity-40" strokeWidth={1.5} />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="py-12 flex flex-col items-center gap-3 text-center px-8">
                                        <div className="w-10 h-10 bg-[var(--surface)] rounded-xl flex items-center justify-center">
                                            <Info className="w-5 h-5 text-[var(--secondary-text)] opacity-10" strokeWidth={1.5} />
                                        </div>
                                        <div>
                                            <p className="text-[12px] font-semibold opacity-20">No Alerts</p>
                                            <p className="text-[10px] text-[var(--secondary-text)] opacity-20 mt-1">Updates from your coach will appear here.</p>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {unreadCount > 0 && (
                                <button
                                    onClick={markAllNotificationsRead}
                                    className="p-3 bg-[var(--accent)] text-[var(--primary-text)] text-[11px] font-medium hover:opacity-90 transition-all"
                                >
                                    Catch up with all
                                </button>
                            )}
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
}
