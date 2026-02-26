'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    CheckCircle2,
    Plus,
    Flame,
    TrendingUp,
    MoreVertical,
    X,
    Target,
    BarChart2,
    Calendar,
    ChevronRight,
    Search,
    Trash2
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useApp } from '@/lib/store';

const categories = ['All', 'Mindfulness', 'Health', 'Growth', 'Social'];

export default function HabitsPage() {
    const { habits, addHabit, toggleHabitDay, deleteHabit } = useApp();
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [searchQuery, setSearchQuery] = useState('');
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [newHabitName, setNewHabitName] = useState('');
    const [newHabitCategory, setNewHabitCategory] = useState('Mindfulness');

    const filteredHabits = habits
        .filter(h => selectedCategory === 'All' || h.category === selectedCategory)
        .filter(h => h.name.toLowerCase().includes(searchQuery.toLowerCase()));

    const handleCreateHabit = () => {
        if (!newHabitName.trim()) return;
        addHabit({
            name: newHabitName,
            category: newHabitCategory
        });
        setNewHabitName('');
        setShowCreateModal(false);
    };

    return (
        <div className="space-y-8 pb-16 max-w-4xl mx-auto">
            {/* Header Content */}
            <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div className="space-y-1">
                    <h1 className="text-[22px] font-semibold tracking-tight">Habit Hub</h1>
                    <p className="text-[13px] text-[var(--secondary-text)] leading-relaxed max-w-sm">
                        Consistency creates clarity. Track your daily rhythms.
                    </p>
                </div>
                <button
                    onClick={() => setShowCreateModal(true)}
                    className="btn-primary h-9 px-5 rounded-lg flex items-center gap-2 text-[13px]"
                >
                    <Plus className="w-3.5 h-3.5" />
                    Create New
                </button>
            </header>

            {/* Controls Bar */}
            <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex gap-1 bg-[var(--surface)] p-1 rounded-lg border border-[var(--border)]">
                    {categories.map(cat => (
                        <button
                            key={cat}
                            onClick={() => setSelectedCategory(cat)}
                            className={cn(
                                "px-4 py-1.5 rounded-md text-[11px] font-medium transition-all",
                                selectedCategory === cat ? "bg-white text-[var(--primary-text)] shadow-xs" : "text-[var(--secondary-text)] opacity-40 hover:opacity-100"
                            )}
                        >
                            {cat}
                        </button>
                    ))}
                </div>
                <div className="relative flex-1 max-w-[240px]">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[var(--secondary-text)] opacity-30" />
                    <input
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Find a habit..."
                        className="w-full h-9 pl-9 bg-white border border-[var(--border)] rounded-lg text-[13px] outline-none focus:ring-2 focus:ring-[var(--accent)] transition-all"
                    />
                </div>
            </div>

            {/* Habits Grid */}
            <div className="grid grid-cols-1 gap-4">
                {filteredHabits.map((habit) => (
                    <motion.section
                        layout
                        key={habit.id}
                        className="card bg-white p-6 group transition-all shadow-xs"
                    >
                        <div className="flex flex-col md:flex-row gap-8">
                            {/* Stats Info */}
                            <div className="w-full md:w-56 space-y-4">
                                <div className="flex items-center justify-between">
                                    <span className="text-[10px] font-medium uppercase tracking-wider text-[var(--secondary-text)] opacity-40">{habit.category}</span>
                                    <button
                                        onClick={() => {
                                            if (confirm(`Are you sure you want to remove the "${habit.name}" habit? This cannot be undone.`)) {
                                                deleteHabit(habit.id);
                                            }
                                        }}
                                        className="p-1 hover:bg-red-50 text-[var(--secondary-text)] opacity-20 hover:text-red-500 hover:opacity-100 rounded-lg transition-all"
                                    >
                                        <Trash2 className="w-3.5 h-3.5" strokeWidth={1.5} />
                                    </button>
                                </div>
                                <div>
                                    <h3 className="text-[18px] font-semibold mb-3 tracking-tight group-hover:text-[var(--primary-text)] transition-colors">{habit.name}</h3>
                                    <div className="flex items-center gap-6">
                                        <div className="flex flex-col">
                                            <div className="flex items-center gap-1.5 mb-1">
                                                <Flame className={cn("w-3.5 h-3.5", habit.streak > 0 ? "text-orange-400" : "text-[var(--secondary-text)] opacity-20")} />
                                                <span className="text-[18px] font-semibold">{habit.streak}</span>
                                            </div>
                                            <span className="text-[10px] font-medium text-[var(--secondary-text)] opacity-40 uppercase tracking-wider">Streak</span>
                                        </div>
                                        <div className="flex flex-col">
                                            <div className="flex items-center gap-1.5 mb-1">
                                                <TrendingUp className="w-3.5 h-3.5 text-blue-400" />
                                                <span className="text-[18px] font-semibold">{habit.consistency}%</span>
                                            </div>
                                            <span className="text-[10px] font-medium text-[var(--secondary-text)] opacity-40 uppercase tracking-wider">Consistency</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Recording Grid */}
                            <div className="flex-1">
                                <p className="text-[11px] font-medium uppercase tracking-wider text-[var(--secondary-text)] opacity-40 mb-4 px-0.5">Weekly Rhythm</p>
                                <div className="grid grid-cols-7 gap-2">
                                    {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, i) => {
                                        const isDone = habit.completedDays[i];
                                        return (
                                            <div key={day} className="flex flex-col items-center gap-3">
                                                <button
                                                    onClick={() => toggleHabitDay(habit.id, i)}
                                                    className={cn(
                                                        "w-full aspect-square rounded-xl flex items-center justify-center transition-all border shadow-xs group/pod relative overflow-hidden",
                                                        isDone
                                                            ? "bg-[var(--accent)] border-[var(--accent)] text-[var(--primary-text)] shadow-sm"
                                                            : "bg-white border-[var(--border)] hover:bg-[var(--surface)] text-[var(--secondary-text)] opacity-30 hover:opacity-100"
                                                    )}
                                                >
                                                    {isDone ? <CheckCircle2 className="w-5 h-5" strokeWidth={1.5} /> : <Plus className="w-4 h-4 opacity-0 group-hover/pod:opacity-100 transition-opacity" />}
                                                </button>
                                                <span className={cn("text-[10px] font-medium uppercase tracking-wider", isDone ? "text-[var(--primary-text)]" : "text-[var(--secondary-text)] opacity-40")}>
                                                    {day}
                                                </span>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                    </motion.section>
                ))}
                {filteredHabits.length === 0 && (
                    <div className="text-center py-20 bg-blue-600/[0.01] rounded-[40px] border border-dashed border-blue-900/5">
                        <Target className="w-12 h-12 text-blue-900/10 mx-auto mb-4" />
                        <p className="text-blue-900/40 font-bold">No habits found.</p>
                        <button onClick={() => setShowCreateModal(true)} className="mt-4 text-xs font-bold uppercase tracking-widest text-blue-500 hover:underline">Start one today</button>
                    </div>
                )}
            </div>

            <AnimatePresence>
                {showCreateModal && (
                    <div className="fixed inset-0 z-[300] bg-black/5 backdrop-blur-sm flex items-center justify-center p-6">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="card w-full max-w-sm bg-white shadow-xl border border-[var(--border)] p-8 overflow-hidden relative rounded-2xl"
                        >
                            <button
                                onClick={() => setShowCreateModal(false)}
                                className="absolute top-4 right-4 p-2 hover:bg-[var(--surface)] rounded-lg transition-colors"
                            >
                                <X className="w-5 h-5" strokeWidth={1.5} />
                            </button>

                            <div className="mb-8">
                                <h2 className="text-[20px] font-semibold tracking-tight mb-2">New Habit</h2>
                                <p className="text-[13px] text-[var(--secondary-text)] leading-relaxed">Define a goal for your growth.</p>
                            </div>

                            <div className="space-y-6 mb-8">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-medium uppercase tracking-wider text-[var(--secondary-text)] opacity-40 px-0.5">Name</label>
                                    <input
                                        autoFocus
                                        value={newHabitName}
                                        onChange={(e) => setNewHabitName(e.target.value)}
                                        placeholder="E.g. Daily Meditation"
                                        className="w-full h-11 px-4 bg-[var(--surface)] border border-[var(--border)] rounded-lg text-[13px] font-medium outline-none focus:ring-2 focus:ring-[var(--accent)] transition-all"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-medium uppercase tracking-wider text-[var(--secondary-text)] opacity-40 px-0.5">Category</label>
                                    <div className="grid grid-cols-2 gap-2">
                                        {categories.filter(c => c !== 'All').map(c => (
                                            <button
                                                key={c}
                                                onClick={() => setNewHabitCategory(c)}
                                                className={cn(
                                                    "h-9 rounded-lg text-[11px] font-medium transition-all",
                                                    newHabitCategory === c ? "bg-[var(--accent)] text-[var(--primary-text)] shadow-xs" : "bg-[var(--surface)] text-[var(--secondary-text)] opacity-40 hover:opacity-100"
                                                )}
                                            >
                                                {c}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <button
                                onClick={handleCreateHabit}
                                className="btn-primary w-full h-11 rounded-lg text-[13px]"
                            >
                                Establish Habit
                            </button>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
