'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Send,
    Mic,
    Download,
    Sparkles,
    Smile,
    X,
    ChevronDown,
    Trash2,
    Brain,
    CheckCircle2,
    MoreHorizontal
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { jsPDF } from 'jspdf';
import CrisisSupport from '@/components/CrisisSupport';
import { useApp } from '@/lib/store';

interface Message {
    id: string;
    role: 'user' | 'assistant';
    content: string;
    timestamp: string;
    isCrisis?: boolean;
}

export default function MentalHealthCoach() {
    const { onboardingData, user, detectedEmotion, reportEmotion, addNotification, loading, chatMessages, addChatMessage, clearChatHistory: apiClearHistory } = useApp();
    const [input, setInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const [showCrisis, setShowCrisis] = useState(false);
    const [isRecording, setIsRecording] = useState(false);
    const [showMoreMenu, setShowMoreMenu] = useState(false);
    const chatEndRef = useRef<HTMLDivElement>(null);

    // Map store messages to UI component expected format
    const messages: Message[] = chatMessages.map(m => ({
        id: m.id,
        role: m.role,
        content: m.content,
        timestamp: new Date(m.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isCrisis: false // Can be inferred from UI triggers if needed
    }));

    // Initial greeting if history is empty
    useEffect(() => {
        if (loading) return;
        if (chatMessages.length === 0) {
            const goal = onboardingData?.goals || 'Personal Growth';
            const greet = `Hey ${user.name}, I'm so glad you're here. This is our safe space. I've been thinking about your focus on ${goal}—how are you really feeling today? I'm all ears.`;
            addChatMessage('assistant', greet);
        }
    }, [onboardingData, user.name, loading, chatMessages.length]);

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, isTyping]);

    const recognitionRef = useRef<any>(null);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
            if (SpeechRecognition) {
                recognitionRef.current = new SpeechRecognition();
                recognitionRef.current.continuous = true;
                recognitionRef.current.interimResults = true;

                recognitionRef.current.onresult = (event: any) => {
                    const transcript = Array.from(event.results)
                        .map((result: any) => result[0])
                        .map((result: any) => result.transcript)
                        .join('');
                    setInput(transcript);
                };

                recognitionRef.current.onerror = (event: any) => {
                    console.error('Speech recognition error:', event.error);
                    setIsRecording(false);
                    if (event.error === 'not-allowed') {
                        addNotification({
                            title: 'Microphone Blocked',
                            message: 'Please enable microphone access to use voice input.',
                            type: 'alert'
                        });
                    }
                };

                recognitionRef.current.onend = () => {
                    setIsRecording(false);
                };
            }
        }
    }, [addNotification]);

    if (loading) {
        return (
            <div className="h-[60vh] flex items-center justify-center">
                <div className="flex flex-col items-center gap-3">
                    <div className="w-8 h-8 border-2 border-[var(--border)] border-t-[var(--accent)] rounded-full animate-spin" />
                    <p className="text-[11px] font-medium text-[var(--secondary-text)] opacity-40 uppercase tracking-wider">Syncing Session...</p>
                </div>
            </div>
        );
    }

    const detectCrisis = (text: string) => {
        const triggers = ['suicidal', 'kill myself', 'die', 'hurt myself', 'end it all', 'self-harm', 'don\'t want to live'];
        return triggers.some(t => text.toLowerCase().includes(t));
    };

    const handleSend = async () => {
        if (!input.trim() || isTyping) return;

        const isCrisis = detectCrisis(input);
        const userContent = input;

        // Save user message to store (persists to Supabase)
        await addChatMessage('user', userContent);

        setInput('');
        setIsTyping(true);

        if (userContent.toLowerCase().includes('happy') || userContent.toLowerCase().includes('great')) reportEmotion('Happy', 'Coach Chat');
        if (userContent.toLowerCase().includes('sad') || userContent.toLowerCase().includes('bad') || userContent.toLowerCase().includes('anxious') || userContent.toLowerCase().includes('stress')) {
            reportEmotion('Sad', 'Coach Chat');
        }

        if (isCrisis) {
            await addChatMessage('assistant', "I'm very concerned about what you're sharing. Please know that you're not alone and help is available. I've prepared some immediate support resources for you.");
            setShowCrisis(true);
            setIsTyping(false);
            return;
        }

        try {
            const { emotion } = detectedEmotion || { emotion: 'Neutral' };

            const systemPrompt = `You are a warm, empathic wellness companion for ${user.name}. 
            Your goal is ${onboardingData?.goals || 'Personal Growth'}.

            SOUL-FIRST DIRECTIVES:
            - ALWAYS validate ${user.name}'s feelings first. Use phrases like "I hear how heavy that feels" or "It makes sense that you'd feel this way."
            - Mirror their emotional frequency. If they are ${emotion}, adjust your tone to match or provide a calming counter-balance if they are Sad.
            - Speak directly from the soul. Avoid clinical jargon. 
            - Use short, resonant sentences. (Max 3-4 sentences total).`;

            const conversation = [
                { role: 'system', content: systemPrompt },
                ...chatMessages.slice(-6).map(m => ({ role: m.role, content: m.content })),
                { role: 'user', content: userContent }
            ];

            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    messages: conversation,
                    detectedMood: emotion
                })
            });

            const data = await response.json();
            if (data.error) {
                await addChatMessage('assistant', `(Coach Note: ${data.error}) - I apologize, I'm finding it hard to connect to my deeper insights at the moment. I'm still here for you.`);
            } else {
                await addChatMessage('assistant', data.content);
            }

        } catch (error) {
            console.error('Coach Error:', error);
            await addChatMessage('assistant', "I'm here for you. Tell me more about what's on your mind.");
        } finally {
            setIsTyping(false);
        }
    };

    const clearHistory = async () => {
        await apiClearHistory();
        setShowMoreMenu(false);
        addNotification({
            title: 'History Cleared',
            message: 'Your chat history with the coach has been wiped.',
            type: 'alert'
        });
    };


    const exportChat = () => {
        const doc = new jsPDF();
        let y = 30;
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(28);
        doc.text('EmpathIQ', 20, y);
        y += 10;
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(10);
        doc.setTextColor(150);
        doc.text('Confidential Mental Wellness Session Export', 20, y);
        y += 20;

        messages.forEach(m => {
            doc.setFontSize(12);
            doc.setTextColor(0);
            const role = m.role === 'user' ? 'YOU' : 'COACH';
            doc.setFont('helvetica', 'bold');
            doc.text(`${role} — ${m.timestamp}`, 20, y);
            y += 7;
            doc.setFont('helvetica', 'normal');
            const lines = doc.splitTextToSize(m.content, 170);
            const lineHeight = 7;
            doc.text(lines, 20, y);
            y += lines.length * lineHeight + 10;
            if (y > 270) {
                doc.addPage();
                y = 30;
            }
        });

        doc.save(`buddy-session-${new Date().toLocaleDateString()}.pdf`);
        setShowMoreMenu(false);
    };


    const toggleRecording = () => {
        if (!recognitionRef.current) {
            addNotification({
                title: 'Speech Not Supported',
                message: 'Your browser does not support voice input. Try using Chrome or Edge.',
                type: 'alert'
            });
            return;
        }

        if (isRecording) {
            recognitionRef.current.stop();
            setIsRecording(false);
        } else {
            setInput('');
            try {
                recognitionRef.current.start();
                setIsRecording(true);
            } catch (err) {
                console.error('Failed to start recognition:', err);
                setIsRecording(false);
            }
        }
    };

    return (
        <div className="h-[calc(100vh-80px)] flex flex-col max-w-4xl mx-auto overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-[var(--border)] flex-shrink-0">
                <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-[var(--accent)] rounded-xl flex items-center justify-center shadow-xs">
                        <Brain className="w-5 h-5 text-[var(--primary-text)]" strokeWidth={1.5} />
                    </div>
                    <div>
                        <h1 className="text-[18px] font-semibold tracking-tight">Clinical Coach</h1>
                        <div className="flex items-center gap-1.5 mt-0.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-blue-400" />
                            <span className="text-[10px] font-medium uppercase tracking-wider text-[var(--secondary-text)] opacity-40">Protocol Active</span>
                        </div>
                    </div>
                </div>

                <div className="relative">
                    <button
                        onClick={() => setShowMoreMenu(!showMoreMenu)}
                        className="h-10 w-10 flex items-center justify-center rounded-lg border border-[var(--border)] hover:bg-[var(--surface)] transition-all"
                    >
                        <MoreHorizontal className="w-4 h-4 text-[var(--secondary-text)]" />
                    </button>

                    <AnimatePresence>
                        {showMoreMenu && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.98 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.98 }}
                                className="absolute right-0 mt-2 w-48 bg-white border border-[var(--border)] rounded-xl shadow-lg z-[100] p-1 overflow-hidden"
                            >
                                <button onClick={exportChat} className="w-full flex items-center gap-2.5 px-3 py-2 hover:bg-[var(--surface)] rounded-lg transition-colors text-[13px] font-medium">
                                    <Download className="w-3.5 h-3.5" /> Export PDF
                                </button>
                                <div className="h-[1px] bg-[var(--border)] my-1 mx-1" />
                                <button onClick={clearHistory} className="w-full flex items-center gap-2.5 px-3 py-2 hover:bg-red-50 text-red-500 rounded-lg transition-colors text-[13px] font-medium">
                                    <Trash2 className="w-3.5 h-3.5" /> Clear History
                                </button>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>

            {/* Chat Experience */}
            <div className="flex-1 overflow-y-auto px-2 space-y-8 pb-32 scrollbar-none">
                {messages.map((m) => (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        key={m.id}
                        className={cn(
                            "flex flex-col",
                            m.role === 'user' ? "items-end" : "items-start"
                        )}>
                        <div className={cn(
                            "max-w-[85%] sm:max-w-[70%] rounded-2xl p-4 text-[14px] leading-relaxed relative shadow-xs",
                            m.role === 'user'
                                ? "bg-[var(--accent)] text-[var(--primary-text)] rounded-tr-none"
                                : cn(
                                    "bg-white text-[var(--primary-text)] border border-[var(--border)] rounded-tl-none",
                                    m.isCrisis ? "border-red-500 bg-red-50 text-red-900" : ""
                                )
                        )}>
                            {m.content}
                        </div>
                        <span className="text-[9px] font-medium text-[var(--secondary-text)] opacity-30 mt-1.5 px-1 uppercase tracking-wider">
                            {m.timestamp}
                        </span>
                    </motion.div>
                ))}

                {isTyping && (
                    <div className="flex flex-col items-start px-2">
                        <div className="bg-white border border-blue-900/5 rounded-[24px] p-5 flex gap-2 shadow-sm">
                            <motion.div animate={{ scale: [1, 1.3, 1] }} transition={{ repeat: Infinity, duration: 1 }} className="w-2 h-2 bg-blue-600/10 rounded-full" />
                            <motion.div animate={{ scale: [1, 1.3, 1] }} transition={{ repeat: Infinity, duration: 1, delay: 0.2 }} className="w-2 h-2 bg-blue-600/10 rounded-full" />
                            <motion.div animate={{ scale: [1, 1.3, 1] }} transition={{ repeat: Infinity, duration: 1, delay: 0.4 }} className="w-2 h-2 bg-blue-600/10 rounded-full" />
                        </div>
                    </div>
                )}
                <div ref={chatEndRef} />
            </div>

            {/* Input Bar */}
            <div className="fixed bottom-6 left-[calc(50%+110px)] -translate-x-1/2 w-full max-w-xl px-4 z-10">
                <div className="bg-white/80 backdrop-blur-lg border border-[var(--border)] p-2 rounded-2xl flex items-center gap-2 shadow-sm">
                    <button
                        onClick={toggleRecording}
                        className={cn(
                            "w-9 h-9 flex items-center justify-center rounded-xl transition-all",
                            isRecording ? "bg-red-500 text-white animate-pulse" : "bg-[var(--surface)] text-[var(--secondary-text)] opacity-40 hover:opacity-100"
                        )}
                    >
                        <Mic className="w-4 h-4" strokeWidth={1.5} />
                    </button>
                    <input
                        autoFocus
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                        placeholder="Share your thoughts..."
                        className="flex-1 bg-transparent border-none outline-none text-[14px] px-2 font-medium text-[var(--primary-text)] placeholder:text-[var(--secondary-text)] placeholder:opacity-40"
                    />
                    <button
                        onClick={handleSend}
                        disabled={!input.trim()}
                        className={cn(
                            "w-9 h-9 flex items-center justify-center rounded-xl transition-all",
                            !input.trim() ? "bg-[var(--surface)] text-[var(--secondary-text)] opacity-20" : "bg-[var(--accent)] text-[var(--primary-text)] shadow-xs"
                        )}
                    >
                        <Send className="w-4 h-4" strokeWidth={1.5} />
                    </button>
                </div>
            </div>

            <CrisisSupport isOpen={showCrisis} onClose={() => setShowCrisis(false)} />
        </div>
    );
}
