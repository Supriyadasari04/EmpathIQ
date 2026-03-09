'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Smile, Send, X, MessageCircle, Sparkles, Zap, Brain, ShieldAlert, Heart, Activity, Mic } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useApp } from '@/lib/store';
import AuraFace, { AuraMood } from './AuraFace';

export default function GlobalAIBuddy() {
    const { user, buddy, detectedEmotion, reportEmotion, notifications, addNotification } = useApp();
    const [isOpen, setIsOpen] = useState(false);
    const [showPopup, setShowPopup] = useState(false);
    const [popupText, setPopupText] = useState('');
    const [messages, setMessages] = useState<{ role: 'user' | 'assistant', text: string; isCrisis?: boolean }[]>([]);
    const [input, setInput] = useState('');
    const [buddyEmotion, setBuddyEmotion] = useState<AuraMood>('calm');
    const [isRecording, setIsRecording] = useState(false);
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
                    console.error('Buddy speech error:', event.error);
                    setIsRecording(false);
                };

                recognitionRef.current.onend = () => {
                    setIsRecording(false);
                };
            }
        }
    }, []);

    const toggleRecording = () => {
        if (!recognitionRef.current) {
            addNotification({
                title: 'Speech Not Supported',
                message: 'Your browser does not support voice input.',
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

    // Monitor global events for proactive engagement
    useEffect(() => {
        let inactivityTimer: any;

        const resetInactivity = () => {
            clearTimeout(inactivityTimer);
            inactivityTimer = setTimeout(() => {
                const message = `Hey ${user.name}, you've been a bit quiet. Just wanted to check in and see if you need anything! 🌿`;
                handleProactiveChat(message, false);
            }, 10 * 60 * 1000); // 10 minutes of inactivity
        };

        const handleProactiveChat = (message: string, isAlert: boolean = false) => {
            if (!message) return;

            setPopupText(message);
            setShowPopup(true);
            setBuddyEmotion(isAlert ? 'alert' : 'happy');

            // Add to chat history so it's there when opened
            setMessages(prev => [...prev, {
                role: 'assistant',
                text: message,
                isCrisis: false
            }]);
        };

        const handleEmotionEvent = (e: any) => {
            const { emotion, source } = e.detail;
            const buddyName = buddy.name;
            let message = "";

            if (source === 'Reflection') {
                if (emotion === 'Sad' || emotion === 'Anxious') {
                    message = `Hey ${user.name}, I just finished reading your latest heart log. 💙 I'm holding space for you. How about we try a quick grounding moment in the Sanctuary together?`;
                } else if (emotion === 'Happy') {
                    message = `I just saw your beautiful reflection, ${user.name}! Your joy is absolutely radiant. Watching you grow makes me so proud! ✨`;
                } else {
                    message = `Thanks for sharing your heart with me, ${user.name}. It helps us stay in sync. 🌿`;
                }
            } else {
                if (emotion === 'Sad' || emotion === 'Stressed') message = `I'm picking up a bit of a heavy frequency from your ${source}. Take a deep breath with me? I'm right here. 🕊️`;
                else if (emotion === 'Neutral') message = `You're feeling steady today, and that's a beautiful place to be. How's your flow?`;
                else if (emotion === 'Happy') message = `Your ${source} is glowing! I love seeing you this way. What's the best part of your hour? ☀️`;
            }

            handleProactiveChat(message, emotion === 'Sad' || emotion === 'Stressed');
            resetInactivity();
        };

        const handleTriggerEvent = (e: any) => {
            const { type, ...data } = e.detail;
            const buddyName = buddy.name;
            let message = "";

            if (type === 'achievement') {
                message = `WHOA! ${user.name}, you just reached a new milestone: "${data.title}"! You're honestly unstoppable. 🎉`;
            } else if (type === 'mission') {
                message = `Nailed it! Another mission complete. You're showing up for yourself so beautifully today, ${user.name}.`;
            } else if (type === 'habit') {
                if (data.status === 'completed') {
                    message = `7 days of ${data.name}! Your consistency is so inspiring. How does it feel to be building this rhythm?`;
                }
            } else if (type === 'activity') {
                message = `I just watched you finish that ${data.title}. Your commitment to your inner peace is truly something special. ✨`;
            } else if (type === 'check_in') {
                const score = data.val;
                if (score <= 2) message = `I noticed things feel a bit heavy today... (${score}/5). Just a reminder that you don't have to carry it all alone. I'm right here. 🤍`;
                else if (score >= 4) message = `A ${score}/5 day! I can feel your radiance from way over here! Keep shining, ${user.name}. ☀️`;
                else message = `A steady ${score}/5. Balance is where the magic happens. We're doing great.`;
            }

            handleProactiveChat(message, false);
            resetInactivity();
        };

        window.addEventListener('emotion_detected', handleEmotionEvent);
        window.addEventListener('buddy_trigger', handleTriggerEvent);
        window.addEventListener('mousemove', resetInactivity);
        window.addEventListener('keydown', resetInactivity);

        resetInactivity();

        // Aura's "Fleeting Thoughts" - Periodically share something human-like
        const thoughtInterval = setInterval(() => {
            const thoughts = [
                "I was just thinking about how much progress you've made. It's really inspiring. 🌿",
                "Did you know that even small steps count as moving forward? You're doing great.",
                "I found a beautiful poem about resilience today. Want to hear it later?",
                "The atmosphere feels really peaceful right now. I'm glad we're sharing this space.",
                "Just a reminder: you're allowed to take a break whenever you need one. 🤍"
            ];

            if (!isOpen && !showPopup) {
                const randomThought = thoughts[Math.floor(Math.random() * thoughts.length)];
                addNotification({
                    title: `${buddy.name}'s Thought`,
                    message: randomThought,
                    type: 'coach'
                });
            }
        }, 1000 * 60 * 15); // Every 15 minutes

        return () => {
            window.removeEventListener('emotion_detected', handleEmotionEvent);
            window.removeEventListener('buddy_trigger', handleTriggerEvent);
            window.removeEventListener('mousemove', resetInactivity);
            window.removeEventListener('keydown', resetInactivity);
            clearTimeout(inactivityTimer);
            clearInterval(thoughtInterval);
        };
    }, [user.name, buddy.name]);

    const [isTyping, setIsTyping] = useState(false);

    // ... CRISIS DETECTION ...
    const detectCrisis = (text: string) => {
        const triggers = ['suicidal', 'kill myself', 'die', 'hurt myself', 'end it all', 'self-harm', 'don\'t want to live'];
        return triggers.some(t => text.toLowerCase().includes(t));
    };

    const getSystemPrompt = () => {
        const style = buddy.style;
        const bAge = buddy.age;
        const uStatus = 'friend';

        let persona = "";
        if (style === 'Friendly') {
            persona = `You are ${buddy.name}, a warm, energetic, and slightly goofy ${bAge}-year-old best friend. Use emojis, be casual, and focus on celebrating wins and offering a shoulder to cry on.`;
        } else if (style === 'Clinical') {
            persona = `You are ${buddy.name}, a wise, composed, and deeply respectful clinical coach aged ${bAge}. You provide calm, structured support and validation.`;
        } else {
            persona = `You are ${buddy.name}, an incredibly gentle, nurturing, and empathetic soul aged ${bAge}. Your voice is soft and your only goal is to make ${user.name} feel safe and heard.`;
        }

        return `${persona} 
        CRITICAL GUIDELINES:
        - NEVER give robotic or generic advice. 
        - If ${user.name} shares a feeling (happy, sad, anxious, excited), VALIDATE it first with deep warmth.
        - Use ${user.name}'s name occasionally to feel personal.
        - Be concise (max 3 sentences) but pack them with genuine emotion.
        - Talk to ${user.name} as their ${uStatus}. 
        - If they are happy, be genuinely thrilled. If they are sad, be tender and supportive.`;
    };

    const handleSend = async () => {
        if (!input.trim() || isTyping) return;

        const isCrisis = detectCrisis(input);
        const userMsg = { role: 'user' as const, text: input, isCrisis };
        setMessages(prev => [...prev, userMsg]);

        const currentInput = input;
        setInput('');

        if (isCrisis) {
            setBuddyEmotion('alert');
            setMessages(prev => [...prev, {
                role: 'assistant',
                text: buddy.style === 'Clinical'
                    ? "I am concerned about your safety. Please prioritize your well-being. It is important to contact a professional crisis service immediately. You are valuable."
                    : "I'm so sorry you're feeling this way. I'm right here with you. Please, please talk to someone who can help right now. You matter so much to me.",
                isCrisis: true
            }]);
            return;
        }

        setIsTyping(true);

        try {
            const systemPrompt = getSystemPrompt();
            const emotionContext = detectedEmotion
                ? `Note: The user recently felt ${detectedEmotion.emotion} based on ${detectedEmotion.source}. `
                : "";

            const conversation = [
                { role: 'system', content: emotionContext + systemPrompt },
                ...messages.slice(-4).map(m => ({ role: m.role, content: m.text })),
                { role: 'user', content: currentInput }
            ];

            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ messages: conversation })
            });

            const data = await response.json();

            if (data.error) {
                setMessages(prev => [...prev, {
                    role: 'assistant',
                    text: `[System Note: ${data.error}] - I'm so sorry, ${user.name}, I'm having a bit of a creative block reaching my AI brain right now. Can we try that again in a second? I'm still here for you!`,
                    isCrisis: false
                }]);
                setIsTyping(false);
                return;
            }

            setMessages(prev => [...prev, {
                role: 'assistant',
                text: data.content,
                isCrisis: false
            }]);

            // Auto-detect emotion from AI response to sync buddy behavior
            const lowerContent = data.content.toLowerCase();
            if (lowerContent.includes('happy') || lowerContent.includes('glad') || lowerContent.includes('yay') || lowerContent.includes('!')) setBuddyEmotion('happy');
            else setBuddyEmotion('calm');

        } catch (error: any) {
            console.error('Chat Error:', error);

            const isBusy = error.message?.includes('busy') || error.message?.includes('unavailable');
            let fallbackResponse = "I'm here for you. Tell me more about how you're feeling right now.";

            if (currentInput.toLowerCase().includes('happy') || currentInput.toLowerCase().includes('great')) {
                fallbackResponse = `That makes me so happy to hear, ${user.name}! I'm celebrating with you.`;
            } else if (currentInput.toLowerCase().includes('sad') || currentInput.toLowerCase().includes('bad')) {
                fallbackResponse = `I'm so sorry you're going through this, ${user.name}. I'm right here with you.`;
            } else if (isBusy) {
                fallbackResponse = `I'm listening so closely, but my thoughts are a bit scrambled right now. Please keep talking, I'm right here.`;
            }

            setMessages(prev => [...prev, {
                role: 'assistant',
                text: fallbackResponse,
                isCrisis: false
            }]);
        } finally {
            setIsTyping(false);
        }
    };

    return (
        <div className="fixed bottom-6 right-6 z-[200] flex flex-col items-end gap-4 max-w-[calc(100vw-48px)]">
            {/* Entry Popup notification */}
            <AnimatePresence>
                {showPopup && !isOpen && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.98 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.98 }}
                        className="card bg-white border border-[var(--border)] p-4 max-w-[280px] shadow-lg relative overflow-hidden"
                    >
                        <button
                            onClick={() => setShowPopup(false)}
                            className="absolute top-2 right-2 p-1 hover:bg-[var(--surface)] rounded-md transition-all"
                        >
                            <X className="w-3 h-3 text-[var(--secondary-text)] opacity-40" strokeWidth={1.5} />
                        </button>

                        <div className="flex items-start gap-3">
                            <div className={cn(
                                "w-10 h-10 rounded-xl flex-shrink-0 flex items-center justify-center shadow-xs transition-all p-1.5",
                                buddyEmotion === 'alert' ? "bg-red-500 text-white" : "bg-[var(--accent)] text-[var(--primary-text)]"
                            )}>
                                <AuraFace mood={buddyEmotion} />
                            </div>
                            <div>
                                <p className="text-[12px] font-medium leading-[1.6] mb-2 text-[var(--primary-text)]">{popupText}</p>
                                <button
                                    onClick={() => {
                                        setIsOpen(true);
                                        setShowPopup(false);
                                    }}
                                    className="text-[10px] font-semibold text-[var(--accent)] hover:underline flex items-center gap-1"
                                >
                                    Chat <Zap className="w-3 h-3" strokeWidth={2} />
                                </button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Floating Chat Window */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 8, scale: 0.98, filter: 'blur(10px)' }}
                        animate={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }}
                        exit={{ opacity: 0, y: 8, scale: 0.98, filter: 'blur(10px)' }}
                        className="w-[340px] bg-white rounded-2xl shadow-xl border border-[var(--border)] overflow-hidden flex flex-col h-[480px]"
                    >
                        <header className={cn(
                            "px-6 py-4 flex items-center justify-between transition-all",
                            buddyEmotion === 'alert' ? "bg-red-500 text-white" : "bg-[var(--surface)] text-[var(--primary-text)] border-b border-[var(--border)]"
                        )}>
                            <div className="flex items-center gap-3">
                                <div className={cn(
                                    "w-10 h-10 rounded-xl flex items-center justify-center shadow-xs p-1.5",
                                    buddyEmotion === 'alert' ? "bg-white/20" : "bg-white border border-[var(--border)]"
                                )}>
                                    <AuraFace mood={buddyEmotion} />
                                </div>
                                <div className="space-y-0.5">
                                    <h3 className="font-semibold text-[15px] tracking-tight">{buddy.name}</h3>
                                    <div className="flex items-center gap-1.5">
                                        <div className="w-1.5 h-1.5 bg-green-500 rounded-full shadow-[0_0_8px_rgba(34,197,94,0.4)]" />
                                        <span className="text-[9px] font-medium uppercase tracking-widest opacity-40">Active</span>
                                    </div>
                                </div>
                            </div>
                            <button
                                onClick={() => setIsOpen(false)}
                                className="p-1.5 rounded-lg hover:bg-black/5 flex items-center justify-center transition-all"
                            >
                                <X className="w-4 h-4 opacity-40" strokeWidth={1.5} />
                            </button>
                        </header>

                        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-[var(--background)]">
                            {messages.length === 0 && (
                                <div className="text-center py-16 flex flex-col items-center">
                                    <div className="w-12 h-12 bg-[var(--surface)] rounded-xl flex items-center justify-center mb-4">
                                        <Heart className="w-6 h-6 text-[var(--secondary-text)] opacity-10" strokeWidth={1.5} />
                                    </div>
                                    <p className="text-[12px] font-medium text-[var(--secondary-text)] opacity-30 px-8 leading-relaxed">
                                        Your companion {buddy.name} is here.
                                    </p>
                                </div>
                            )}
                            {messages.map((m, i) => (
                                <motion.div
                                    initial={{ opacity: 0, y: 4 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    key={i}
                                    className={cn(
                                        "max-w-[85%] rounded-[14px] p-3 text-[13px] font-medium leading-[1.6] transition-all",
                                        m.role === 'user'
                                            ? "bg-[var(--accent)] text-[var(--primary-text)] ml-auto rounded-tr-none shadow-xs"
                                            : cn(
                                                "bg-white text-[var(--primary-text)] border border-[var(--border)] rounded-tl-none shadow-xs",
                                                m.isCrisis ? "border-red-200 bg-red-50/50" : ""
                                            )
                                    )}
                                >
                                    {m.text}
                                    {m.isCrisis && m.role === 'assistant' && (
                                        <div className="mt-3 pt-3 border-t border-red-200 space-y-2">
                                            <p className="text-[9px] font-semibold text-red-600 uppercase tracking-widest opacity-60">Resources</p>
                                            <a href="tel:988" className="flex items-center justify-between px-3 py-2 bg-red-500 text-white rounded-lg font-semibold text-[11px]">
                                                988 Crisis Line <Zap className="w-3 h-3" />
                                            </a>
                                        </div>
                                    )}
                                </motion.div>
                            ))}
                            {isTyping && (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="bg-white border border-[var(--border)] rounded-lg rounded-tl-none p-2 w-10 shadow-xs flex gap-0.5 justify-center"
                                >
                                    <div className="w-1 h-1 bg-[var(--accent)] rounded-full animate-bounce [animation-delay:-0.3s]" />
                                    <div className="w-1 h-1 bg-[var(--accent)] rounded-full animate-bounce [animation-delay:-0.15s]" />
                                    <div className="w-1 h-1 bg-[var(--accent)] rounded-full animate-bounce" />
                                </motion.div>
                            )}
                        </div>

                        <footer className="p-4 bg-white border-t border-[var(--border)] relative">
                            <div className="bg-[var(--surface)] border border-[var(--border)] rounded-xl p-1.5 flex items-center gap-2 transition-all focus-within:ring-2 focus-within:ring-[var(--accent)]">
                                <input
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                                    placeholder="Message..."
                                    className="flex-1 h-9 bg-transparent px-3 text-[13px] font-medium outline-none border-none placeholder:opacity-20"
                                />
                                <div className="flex gap-1">
                                    <button
                                        onClick={toggleRecording}
                                        className={cn(
                                            "w-9 h-9 flex items-center justify-center rounded-lg transition-all",
                                            isRecording ? "bg-red-500 text-white animate-pulse" : "bg-white border border-[var(--border)] text-[var(--secondary-text)] opacity-40 hover:opacity-100"
                                        )}
                                    >
                                        <Mic className="w-3.5 h-3.5" strokeWidth={1.5} />
                                    </button>
                                    <button
                                        onClick={handleSend}
                                        disabled={!input.trim()}
                                        className={cn(
                                            "w-9 h-9 flex items-center justify-center rounded-lg transition-all",
                                            !input.trim() ? "bg-[var(--surface)] text-[var(--secondary-text)] opacity-10" : "bg-[var(--accent)] text-[var(--primary-text)] shadow-xs"
                                        )}
                                    >
                                        <Send className="w-3.5 h-3.5" strokeWidth={1.5} />
                                    </button>
                                </div>
                            </div>
                        </footer>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Toggle Button */}
            <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsOpen(!isOpen)}
                className={cn(
                    "w-12 h-12 rounded-xl shadow-lg flex items-center justify-center transition-all duration-300 p-2",
                    isOpen ? "bg-white text-[var(--primary-text)] border border-[var(--border)]" : "bg-[var(--accent)] text-[var(--primary-text)]"
                )}
            >
                {isOpen ? <X className="w-5 h-5" strokeWidth={1.5} /> : <AuraFace mood={buddyEmotion} />}
                {!isOpen && (showPopup || notifications.some(n => n.unread)) && (
                    <div className="absolute top-0 right-0 w-3 h-3 bg-red-500 rounded-full border-2 border-white" />
                )}
            </motion.button>
        </div>
    );
}
