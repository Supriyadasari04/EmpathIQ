'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Sparkles,
    BookOpen,
    ChevronRight,
    Calendar,
    Clock,
    Smile,
    Meh,
    Frown,
    X,
    Filter,
    Plus,
    Search,
    Trash2,
    AlertCircle
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useApp, Reflection } from '@/lib/store';

export default function ReflectionsPage() {
    const { reflections, addReflection, deleteReflection, reportEmotion, instantValidation, setInstantValidation, buddy, getDynamicPrompt, detectedEmotion } = useApp();
    const [view, setView] = useState<'list' | 'editor'>('list');
    const [editorType, setEditorType] = useState<'Guided' | 'Free'>('Free');
    const [selectedEntry, setSelectedEntry] = useState<Reflection | null>(null);
    const [filter, setFilter] = useState<'All' | 'Guided' | 'Free'>('All');
    const [searchQuery, setSearchQuery] = useState('');
    const [content, setContent] = useState('');
    const [activePrompt, setActivePrompt] = useState('');

    React.useEffect(() => {
        if (view === 'editor' && editorType === 'Guided') {
            setActivePrompt(getDynamicPrompt(detectedEmotion?.emotion));
        }
    }, [view, editorType, getDynamicPrompt, detectedEmotion]);

    const filteredEntries = reflections
        .filter(e => filter === 'All' || e.type === filter)
        .filter(e => e.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (e.prompt?.toLowerCase().includes(searchQuery.toLowerCase())));

    const [isAnalyzing, setIsAnalyzing] = useState(false);

    const handleSave = async () => {
        if (!content.trim() || isAnalyzing) return;

        setIsAnalyzing(true);
        let detectedMood: 'Happy' | 'Neutral' | 'Sad' = 'Neutral';

        try {
            const res = await fetch('/api/analyze-sentiment', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ text: content })
            });
            const data = await res.json();
            if (data.mood) detectedMood = data.mood;
        } catch (err) {
            console.error('Mood detection failed, falling back to Neutral');
        }

        const reflectionPrompt = editorType === 'Guided' ? activePrompt : undefined;
        await addReflection({
            content,
            mood: detectedMood,
            type: editorType,
            prompt: reflectionPrompt
        });

        setIsAnalyzing(false);
        // We stay in editor view until validation is cleared or user clicks away
    };

    const handleBackToList = () => {
        setInstantValidation(null);
        setContent('');
        setView('list');
    };

    const handleDelete = (id: string, e: React.MouseEvent) => {
        e.stopPropagation();
        if (confirm('Are you sure you want to delete this reflection?')) {
            deleteReflection(id);
            if (selectedEntry?.id === id) setSelectedEntry(null);
        }
    };

    return (
        <div className="space-y-8 pb-16 max-w-4xl mx-auto">
            <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div className="space-y-1">
                    <h1 className="text-[22px] font-semibold tracking-tight">Reflections</h1>
                    <p className="text-[13px] text-[var(--secondary-text)] leading-relaxed max-w-md">
                        Capture your journey and find clarity.
                    </p>
                </div>
                {view === 'list' && (
                    <div className="flex gap-2">
                        <button
                            onClick={() => { setEditorType('Guided'); setView('editor'); }}
                            className="h-9 px-4 rounded-lg bg-white border border-[var(--border)] flex items-center gap-2 font-medium text-[13px] hover:bg-[var(--surface)] transition-all"
                        >
                            <Sparkles className="w-3.5 h-3.5 text-[var(--primary-text)] opacity-60" strokeWidth={1.5} />
                            Guided
                        </button>
                        <button
                            onClick={() => { setEditorType('Free'); setView('editor'); }}
                            className="btn-primary h-9 px-5 rounded-lg flex items-center gap-2 text-[13px]"
                        >
                            <Plus className="w-3.5 h-3.5" />
                            New Entry
                        </button>
                    </div>
                )}
            </header>

            <AnimatePresence mode="wait">
                {view === 'list' ? (
                    <motion.div
                        key="list"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.98 }}
                        className="space-y-6"
                    >
                        {/* Control Bar */}
                        <div className="flex flex-wrap items-center justify-between gap-4">
                            <div className="flex gap-1 bg-[var(--surface)] p-1 rounded-lg border border-[var(--border)]">
                                {['All', 'Guided', 'Free'].map(t => (
                                    <button
                                        key={t}
                                        onClick={() => setFilter(t as any)}
                                        className={cn(
                                            "px-4 py-1.5 rounded-md text-[11px] font-medium transition-all",
                                            filter === t ? "bg-white text-[var(--primary-text)] shadow-xs" : "text-[var(--secondary-text)] opacity-40 hover:opacity-100"
                                        )}
                                    >
                                        {t}
                                    </button>
                                ))}
                            </div>
                            <div className="relative flex-1 max-w-[240px]">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[var(--secondary-text)] opacity-30" />
                                <input
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    placeholder="Search entries..."
                                    className="w-full h-9 pl-9 bg-white border border-[var(--border)] rounded-lg text-[13px] outline-none focus:ring-2 focus:ring-[var(--accent)] transition-all"
                                />
                            </div>
                        </div>

                        {/* Reflections List */}
                        <div className="grid grid-cols-1 gap-3">
                            {filteredEntries.map((entry) => (
                                <motion.div
                                    key={entry.id}
                                    whileHover={{ y: -1 }}
                                    onClick={() => setSelectedEntry(entry)}
                                    className="card bg-white p-4 flex items-start gap-4 cursor-pointer group hover:bg-[var(--surface)] transition-all relative overflow-hidden shadow-xs"
                                >
                                    <div className="flex-shrink-0 text-center space-y-0.5 bg-[var(--surface)] p-2 rounded-lg min-w-[60px]">
                                        <p className="text-[10px] font-medium text-[var(--secondary-text)] opacity-40 uppercase tracking-wider">{entry.date.includes(',') ? entry.date.split(',')[1].trim() : ''}</p>
                                        <p className="text-[16px] font-semibold">{entry.date.split(' ')[1]?.replace(',', '') || ''}</p>
                                        <p className="text-[10px] font-medium text-[var(--secondary-text)] opacity-40 uppercase">{entry.date.split(' ')[0]}</p>
                                    </div>
                                    <div className="flex-1 space-y-2">
                                        <div className="flex items-center gap-2">
                                            <span className={cn(
                                                "text-[10px] font-medium uppercase tracking-wider px-1.5 py-0.5 rounded",
                                                entry.type === 'Guided' ? "bg-[var(--accent)] text-[var(--primary-text)]" : "bg-[var(--surface)] text-[var(--secondary-text)]"
                                            )}>
                                                {entry.type}
                                            </span>
                                            {entry.prompt && <span className="text-[11px] text-[var(--secondary-text)] opacity-40 line-clamp-1">/ {entry.prompt}</span>}
                                        </div>
                                        <p className="text-[13px] text-[var(--secondary-text)] leading-relaxed line-clamp-2">{entry.content}</p>
                                        {/* Innovation 3: Distortions Badge */}
                                        {entry.distortions && entry.distortions.length > 0 && (
                                            <div className="flex flex-wrap gap-1 pt-1">
                                                {entry.distortions.map(d => (
                                                    <span key={d} className="text-[8px] font-bold text-orange-600 bg-orange-50 px-1.5 py-0.5 rounded border border-orange-100 uppercase tracking-tighter">
                                                        AI: {d}
                                                    </span>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex items-center gap-2 self-center">
                                        <button
                                            onClick={(e) => handleDelete(entry.id, e)}
                                            className="p-1.5 opacity-0 group-hover:opacity-100 hover:bg-red-50 hover:text-red-500 rounded-md transition-all"
                                        >
                                            <Trash2 className="w-3.5 h-3.5" strokeWidth={1.5} />
                                        </button>
                                        <ChevronRight className="w-4 h-4 text-[var(--secondary-text)] opacity-20 group-hover:opacity-100 transition-all" />
                                    </div>
                                </motion.div>
                            ))}

                            {filteredEntries.length === 0 && (
                                <div className="text-center py-24 bg-blue-600/[0.01] rounded-[48px] border border-dashed border-blue-900/10">
                                    <BookOpen className="w-12 h-12 text-blue-900/10 mx-auto mb-4" />
                                    <p className="text-blue-900/30 font-bold tracking-tight">Your story begins with a single word.</p>
                                    <button onClick={() => setView('editor')} className="mt-4 text-xs font-bold uppercase tracking-widest text-blue-500 hover:underline">Start writing now</button>
                                </div>
                            )}
                        </div>
                    </motion.div>
                ) : (
                    <motion.div
                        key="editor"
                        initial={{ opacity: 0, scale: 0.98 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="card bg-white p-8 min-h-[500px] flex flex-col relative overflow-hidden"
                    >
                        <AnimatePresence>
                            {instantValidation && (
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.9 }}
                                    className="absolute inset-0 z-50 bg-[var(--mood-bg)]/95 backdrop-blur-md flex flex-col items-center justify-center p-12 text-center"
                                >
                                    <div className="w-16 h-16 bg-[var(--mood-accent)] rounded-2xl flex items-center justify-center mb-6 shadow-sm">
                                        <Sparkles className="w-8 h-8 text-[var(--primary-text)] opacity-60" />
                                    </div>
                                    <h3 className="text-[18px] font-semibold mb-4 tracking-tight">{buddy.name} says...</h3>
                                    <p className="text-[16px] text-[var(--secondary-text)] leading-relaxed italic mb-8 max-w-md">
                                        "{instantValidation}"
                                    </p>
                                    <button
                                        onClick={handleBackToList}
                                        className="btn-primary px-8 rounded-full"
                                    >
                                        Continue Journey
                                    </button>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        <button
                            onClick={handleBackToList}
                            className="absolute top-6 right-6 p-2 hover:bg-[var(--surface)] rounded-lg transition-colors"
                        >
                            <X className="w-5 h-5" strokeWidth={1.5} />
                        </button>

                        <div className="max-w-2xl mx-auto w-full flex-1 flex flex-col">
                            <div className="flex items-center gap-3 mb-8">
                                <h2 className="text-[20px] font-semibold tracking-tight">{editorType === 'Guided' ? 'Guided Reflection' : 'Free Writing'}</h2>
                            </div>

                            {editorType === 'Guided' && (
                                <div className="space-y-4 mb-8">
                                    <div className="p-6 bg-[var(--mood-bg)] rounded-2xl border border-[var(--mood-accent)] shadow-sm">
                                        <p className="text-[15px] text-[var(--primary-text)] font-semibold leading-relaxed italic">
                                            "{activePrompt}"
                                        </p>
                                    </div>
                                </div>
                            )}

                            <textarea
                                autoFocus
                                value={content}
                                onChange={(e) => setContent(e.target.value)}
                                placeholder="Let it all out here... this is your safe space."
                                className="flex-1 w-full bg-transparent border-none outline-none text-[16px] leading-relaxed resize-none text-[var(--primary-text)] placeholder:opacity-20 min-h-[250px]"
                            />

                            <div className="mt-8 pt-6 border-t border-[var(--border)] flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    {isAnalyzing && (
                                        <div className="flex items-center gap-2 px-3 py-1.5 bg-[var(--surface)] rounded-full border border-[var(--border)]">
                                            <div className="w-1.5 h-1.5 bg-[var(--accent)] rounded-full animate-pulse" />
                                            <span className="text-[10px] font-medium uppercase tracking-wider text-[var(--secondary-text)]">Analyzing...</span>
                                        </div>
                                    )}
                                </div>
                                <button
                                    onClick={handleSave}
                                    disabled={!content.trim() || isAnalyzing}
                                    className="btn-primary h-[38px] px-8 rounded-lg text-[13px]"
                                >
                                    {isAnalyzing ? 'Processing...' : 'Save Entry'}
                                </button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Entry Detail Modal */}
            <AnimatePresence>
                {selectedEntry && (
                    <div className="fixed inset-0 z-[300] bg-black/5 backdrop-blur-sm flex items-center justify-center p-6">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="card w-full max-w-2xl bg-white shadow-xl border border-[var(--border)] p-8 max-h-[80vh] overflow-y-auto relative rounded-2xl"
                        >
                            <button
                                onClick={() => setSelectedEntry(null)}
                                className="absolute top-4 right-4 p-2 hover:bg-[var(--surface)] rounded-lg transition-colors"
                            >
                                <X className="w-5 h-5" strokeWidth={1.5} />
                            </button>

                            <div className="space-y-6">
                                <div className="flex items-start gap-4">
                                    <div className="p-3 bg-[var(--surface)] rounded-xl">
                                        {selectedEntry.type === 'Guided' ? <Sparkles className="w-6 h-6 text-[var(--primary-text)] opacity-40" /> : <BookOpen className="w-6 h-6 text-[var(--primary-text)] opacity-40" />}
                                    </div>
                                    <div>
                                        <h2 className="text-[18px] font-semibold tracking-tight">{selectedEntry.date}</h2>
                                        <p className="text-[11px] font-medium text-[var(--secondary-text)] opacity-40 uppercase tracking-wider">{selectedEntry.type} Entry</p>
                                    </div>
                                </div>

                                {selectedEntry.prompt && (
                                    <div className="p-5 bg-[var(--surface)] rounded-xl border border-[var(--border)]">
                                        <p className="text-[10px] font-medium text-[var(--secondary-text)] opacity-40 uppercase tracking-wider mb-2">Guided Prompt</p>
                                        <p className="text-[15px] font-medium text-[var(--primary-text)] leading-tight">“{selectedEntry.prompt}”</p>
                                    </div>
                                )}

                                <div className="text-[16px] text-[var(--secondary-text)] leading-relaxed whitespace-pre-wrap">
                                    {selectedEntry.content}
                                </div>

                                {/* Innovation 3: Detailed Distortion Analysis */}
                                {selectedEntry.distortions && selectedEntry.distortions.length > 0 && (
                                    <div className="p-4 bg-orange-50 rounded-xl border border-orange-100 space-y-2">
                                        <div className="flex items-center gap-2 text-orange-700">
                                            <AlertCircle className="w-4 h-4" />
                                            <h3 className="text-[12px] font-bold uppercase tracking-wider">A Gentle Perspective</h3>
                                        </div>
                                        <p className="text-[12px] text-orange-800/80 leading-relaxed font-medium">
                                            I noticed a few common "thinking traps" in your words—like **{selectedEntry.distortions.join(', ')}**. They are so human, and you're doing great just by noticing them.
                                        </p>
                                    </div>
                                )}

                                <div className="flex items-center justify-between pt-6 border-t border-[var(--border)]">
                                    <div className="flex items-center gap-2 px-3 py-1 bg-[var(--surface)] rounded-md border border-[var(--border)]">
                                        <span className="text-[11px] font-medium uppercase tracking-wider text-[var(--secondary-text)]">{selectedEntry.mood}</span>
                                    </div>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={(e) => handleDelete(selectedEntry.id, e as any)}
                                            className="h-9 px-4 rounded-lg text-[12px] font-medium text-red-500 hover:bg-red-50 transition-all"
                                        >
                                            Delete
                                        </button>
                                        <button
                                            onClick={() => setSelectedEntry(null)}
                                            className="btn-primary h-9 px-6 rounded-lg text-[12px]"
                                        >
                                            Close
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
