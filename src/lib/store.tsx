'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from './supabase';
import { User } from '@supabase/supabase-js';

export interface Reflection {
    id: string;
    date: string;
    content: string;
    mood: 'Happy' | 'Neutral' | 'Sad';
    type: 'Guided' | 'Free';
    prompt?: string;
    distortions?: string[];
}

export interface Habit {
    id: string;
    name: string;
    streak: number;
    completedDays: boolean[]; // last 7 days (M, T, W, T, F, S, S)
    category: string;
    consistency: number;
}

export interface Achievement {
    id: string;
    title: string;
    description: string;
    unlocked: boolean;
    rarity: 'Common' | 'Rare' | 'Legendary';
    progress?: number;
}

export interface Notification {
    id: string;
    title: string;
    message: string;
    time: string;
    unread: boolean;
    type: 'achievement' | 'coach' | 'mission' | 'alert';
    link?: string;
}

export interface ChatMessage {
    id: string;
    role: 'user' | 'assistant';
    content: string;
    created_at: string;
}

interface AppState {
    user: {
        id?: string;
        name: string;
        email: string;
        isLoggedIn: boolean;
    };
    buddy: {
        name: string;
        age: string;
        style: 'Friendly' | 'Clinical' | 'Direct' | 'Spiritual';
        level: number;
        xp: number;
        theme: 'Classic' | 'Midnight' | 'Sunset' | 'Ocean' | 'Candy';
    };
    addXP: (amount: number) => Promise<void>;
    detectedEmotion: { emotion: string; source: string; timestamp: number } | null;
    emotionHistory: { emotion: string; source: string; timestamp: number }[];
    reflections: Reflection[];
    habits: Habit[];
    achievements: Achievement[];
    missions: { id: string; label: string; completed: boolean }[];
    notifications: Notification[];
    moodPixels: { [date: string]: number };
    chatMessages: ChatMessage[];
    onboardingData: any;
    privacySettings: {
        privacyShield: boolean;
        localStore: boolean;
        aiTraining: boolean;
    };
    loading: boolean;
    hasOnboarded: boolean;
    reportEmotion: (emotion: string, source: string) => void;
    setOnboarding: (data: any) => void;
    updatePrivacy: (key: 'privacyShield' | 'localStore' | 'aiTraining', value: boolean) => void;
    markNotificationRead: (id: string) => void;
    markAllNotificationsRead: () => void;
    deleteNotification: (id: string) => void;
    clearAllNotifications: () => void;
    addNotification: (notification: Omit<Notification, 'id' | 'time' | 'unread'>) => void;
    addReflection: (reflection: Omit<Reflection, 'id' | 'date'>) => void;
    deleteReflection: (id: string) => void;
    addHabit: (habit: Omit<Habit, 'id' | 'streak' | 'completedDays' | 'consistency'>) => void;
    deleteHabit: (id: string) => void;
    toggleHabitDay: (habitId: string, dayIndex: number) => void;
    toggleMission: (id: string) => void;
    setMoodPixel: (date: string, intensity: number) => void;
    login: (email: string, password: string) => Promise<{ error: any }>;
    sendPasswordResetEmail: (email: string) => Promise<{ error: any }>;
    signup: (email: string, password: string, name: string) => Promise<{ data: any; error: any }>;
    logout: () => Promise<void>;
    addChatMessage: (role: 'user' | 'assistant', content: string) => Promise<void>;
    clearChatHistory: () => Promise<void>;
    getStats: () => { score: number; unlockedCount: number };
    getPredictiveInsight: () => number[];
    instantValidation: string | null;
    setInstantValidation: (msg: string | null) => void;
    getDynamicPrompt: (mood?: string) => string;
    activeToast: Notification | null;
    setActiveToast: (toast: Notification | null) => void;
}

const AppContext = createContext<AppState | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<{ id?: string; name: string; email: string; isLoggedIn: boolean }>({
        name: '',
        email: '',
        isLoggedIn: false
    });
    const [buddy, setBuddy] = useState<{ name: string, age: string, style: 'Friendly' | 'Clinical' | 'Direct' | 'Spiritual', level: number, xp: number, theme: 'Classic' | 'Midnight' | 'Sunset' | 'Ocean' | 'Candy' }>({
        name: 'Nexus',
        age: '24',
        style: 'Friendly',
        level: 1,
        xp: 0,
        theme: 'Classic'
    });
    const [onboardingData, setOnboardingData] = useState<any>(null);
    const [hasOnboarded, setHasOnboarded] = useState<boolean>(() => {
        if (typeof window !== 'undefined') {
            return localStorage.getItem('empathiq_onboarded') === 'true';
        }
        return false;
    });
    const [loading, setLoading] = useState(true);
    const [detectedEmotion, setDetectedEmotion] = useState<{ emotion: string; source: string; timestamp: number } | null>(null);
    const [emotionHistory, setEmotionHistory] = useState<{ emotion: string; source: string; timestamp: number }[]>([]);
    const [reflections, setReflections] = useState<Reflection[]>([]);
    const [habits, setHabits] = useState<Habit[]>([]);
    const [achievements, setAchievements] = useState<Achievement[]>([
        { id: '1', title: 'The First Spark', description: 'Complete your first mental wellness reflection.', unlocked: false, rarity: 'Common', progress: 0 },
        { id: '2', title: 'Unbreakable', description: 'Maintain a 7-day streak for any wellness habit.', unlocked: false, rarity: 'Rare', progress: 0 },
        { id: '3', title: 'Deep Listener', description: 'Have 50 meaningful conversations with your Coach.', unlocked: false, rarity: 'Legendary', progress: 0 },
        { id: '4', title: 'Emotional Voyager', description: 'Log 30 days of unique emotional signals.', unlocked: false, rarity: 'Rare', progress: 0 },
        { id: '5', title: 'Shield of Calm', description: 'Successfully complete 20 grounding exercises.', unlocked: false, rarity: 'Rare', progress: 0 },
        { id: '6', title: 'Goal Setter', description: 'Set at least 3 primary wellness goals.', unlocked: false, rarity: 'Common', progress: 0 },
    ]);
    const [missions, setMissions] = useState([
        { id: '1', label: 'Daily Mindful Check-in', completed: false },
        { id: '2', label: '10-Minute Movement', completed: false },
        { id: '3', label: 'Express Gratitude', completed: false }
    ]);
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [moodPixels, setMoodPixels] = useState<{ [date: string]: number }>({});
    const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
    const [instantValidation, setInstantValidation] = useState<string | null>(null);
    const [activeToast, setActiveToast] = useState<Notification | null>(null);
    const [privacySettings, setPrivacySettings] = useState({
        privacyShield: true,
        localStore: true,
        aiTraining: false
    });

    // 1. Auth Listener & Initial Sync
    useEffect(() => {
        const initSession = async () => {
            setLoading(true);
            const { data: { session } } = await supabase.auth.getSession();
            if (session) {
                await handleAuthChange(session.user);
            } else {
                setLoading(false);
            }
        };
        initSession();

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            if (session) {
                handleAuthChange(session.user);
            } else {
                handleLogoutState();
                setLoading(false);
            }
        });

        return () => subscription.unsubscribe();
    }, []);

    const handleAuthChange = async (supabaseUser: any) => {
        setLoading(true);
        const isAlreadyOnboarded = supabaseUser.user_metadata?.onboarding_completed ||
            (typeof window !== 'undefined' && localStorage.getItem('empathiq_onboarded') === 'true');

        setUser({
            id: supabaseUser.id,
            email: supabaseUser.email || '',
            name: supabaseUser.user_metadata?.name || 'User',
            isLoggedIn: true
        });

        if (isAlreadyOnboarded) {
            setHasOnboarded(true);
        }

        await fetchAppData();
    };

    const handleLogoutState = () => {
        setUser({ name: '', email: '', isLoggedIn: false });
        setReflections([]);
        setHabits([]);
        setMoodPixels({});
        setChatMessages([]);
        setNotifications([]);
        setBuddy({ name: 'Nexus', age: '24', style: 'Friendly', level: 1, xp: 0, theme: 'Classic' });
        setHasOnboarded(false);
        if (typeof window !== 'undefined') {
            localStorage.removeItem('empathiq_onboarded');
        }
    };

    const fetchAppData = async () => {
        setLoading(true);
        try {
            const { data: { user: currentUser } } = await supabase.auth.getUser();
            if (!currentUser) return;

            const results = await Promise.all([
                supabase.from('reflections').select('*').eq('user_id', currentUser.id).order('date', { ascending: false }),
                supabase.from('mood_pixels').select('*').eq('user_id', currentUser.id),
                supabase.from('habits').select('*').eq('user_id', currentUser.id),
                supabase.from('notifications').select('*').eq('user_id', currentUser.id).order('id', { ascending: false }),
                supabase.from('buddy_stats').select('*').eq('user_id', currentUser.id).single(),
                supabase.from('chat_messages').select('*').eq('user_id', currentUser.id).order('created_at', { ascending: true })
            ]);

            const [{ data: refl }, { data: pix }, { data: hab }, { data: notif }, { data: stats }, { data: chatData }] = results;

            if (refl) setReflections(refl as Reflection[]);
            if (pix) {
                const pixelMap: { [date: string]: number } = {};
                pix.forEach((p: any) => pixelMap[p.date] = p.intensity);
                setMoodPixels(pixelMap);
            }
            if (hab) {
                const formattedHabits = hab.map((h: any) => ({
                    ...h,
                    completedDays: Array.isArray(h.completed_days) ? h.completed_days : JSON.parse(h.completed_days || '[]')
                }));
                setHabits(formattedHabits);
            }
            if (notif) setNotifications(notif as Notification[]);
            if (chatData) setChatMessages(chatData as ChatMessage[]);

            // DETERMINE ONBOARDING STATUS (Aggressive Persistence)
            const hasAnyData = !!(stats || (refl && refl.length > 0) || (hab && hab.length > 0) || currentUser.user_metadata?.onboarding_completed);

            if (hasAnyData) {
                if (stats) {
                    setBuddy({
                        name: stats.name,
                        age: stats.age,
                        style: stats.style,
                        level: stats.level || 1,
                        xp: stats.xp || 0,
                        theme: stats.theme || 'Classic'
                    });
                    setOnboardingData(stats.onboarding_json || null);
                }
                setHasOnboarded(true);
                localStorage.setItem('empathiq_onboarded', 'true');

                // Backup sync: If metadata is missing but we found DB data, fix the metadata
                if (!currentUser.user_metadata?.onboarding_completed) {
                    supabase.auth.updateUser({ data: { onboarding_completed: true } });
                }
            } else {
                // ONLY set to false if we are absolutely sure this is a stone-cold new user
                setHasOnboarded(prev => prev || false);
            }

        } catch (err) {
            console.error('Error fetching data:', err);
        } finally {
            setLoading(false);
            checkInactivity();
        }
    };

    const checkInactivity = () => {
        if (typeof window === 'undefined') return;

        const lastLogin = localStorage.getItem('empathiq_last_active');
        const now = Date.now();

        if (lastLogin) {
            const diff = now - parseInt(lastLogin);
            const hours = diff / (1000 * 60 * 60);

            if (hours >= 24) {
                setTimeout(() => {
                    addNotification({
                        title: buddy.name,
                        message: `Hey! I've really missed you. 🤍 I noticed you haven't logged your mood in over a day. Everything okay?`,
                        type: 'coach'
                    });
                }, 2000);
            }
        }
        localStorage.setItem('empathiq_last_active', now.toString());
    };

    const login = async (email: string, password: string) => {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        return { error };
    };

    const sendPasswordResetEmail = async (email: string) => {
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
            redirectTo: `${window.location.origin}/reset-password`,
        });
        return { error };
    };

    const signup = async (email: string, password: string, name: string) => {
        const result = await supabase.auth.signUp({
            email,
            password,
            options: { data: { name } }
        });
        return result;
    };

    const logout = async () => {
        await supabase.auth.signOut();
        handleLogoutState();
    };

    const addChatMessage = async (role: 'user' | 'assistant', content: string) => {
        const { data: { user: currentUser } } = await supabase.auth.getUser();
        if (!currentUser) return;

        const newMessage = {
            id: `msg-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
            role,
            content,
            created_at: new Date().toISOString()
        };

        setChatMessages(prev => [...prev, newMessage as ChatMessage]);
        await supabase.from('chat_messages').insert({
            user_id: currentUser.id,
            role,
            content
        });
    };

    const clearChatHistory = async () => {
        const { data: { user: currentUser } } = await supabase.auth.getUser();
        if (!currentUser) return;

        setChatMessages([]);
        await supabase.from('chat_messages').delete().eq('user_id', currentUser.id);
    };

    const reportEmotion = (emotion: string, source: string) => {
        const payload = { emotion, source, timestamp: Date.now() };
        setDetectedEmotion(payload);
        setEmotionHistory(prev => [...prev.slice(-99), payload]); // Keep last 100 points
        window.dispatchEvent(new CustomEvent('emotion_detected', { detail: payload }));
    };

    const setOnboarding = async (data: any) => {
        const { data: { user: currentUser } } = await supabase.auth.getUser();
        if (!currentUser) return;

        let defaultTheme: any = 'Classic';
        if (data.userAge === 'Under 18') defaultTheme = 'Candy';
        else if (data.userAge === '18-24') defaultTheme = 'Ocean';
        else if (data.userAge === '25-34') defaultTheme = 'Midnight';
        else if (data.userAge === '35-44') defaultTheme = 'Sunset';

        const newBuddy = {
            name: data.buddyName || "Nexus",
            age: data.buddyAge || "24",
            style: data.buddyStyle || "Friendly",
            level: 1,
            xp: 0,
            theme: data.theme || defaultTheme
        };
        setBuddy(newBuddy);
        setOnboardingData(data);
        // Set persistence indicators immediately
        setHasOnboarded(true);
        localStorage.setItem('empathiq_onboarded', 'true');

        await Promise.all([
            supabase.from('buddy_stats').upsert({
                user_id: currentUser.id,
                ...newBuddy,
                onboarding_json: data
            }, { onConflict: 'user_id' }),
            supabase.auth.updateUser({
                data: { onboarding_completed: true }
            })
        ]);

        // Trigger achievement if 3 goals
        if ((data.goalCategories || []).length >= 3) {
            unlockAchievement('6');
        }
    };

    const addXP = async (amount: number) => {
        const { data: { user: currentUser } } = await supabase.auth.getUser();
        if (!currentUser) return;

        setBuddy(prev => {
            const newXP = prev.xp + amount;
            const xpToNextLevel = prev.level * 100;
            let newLevel = prev.level;
            let finalXP = newXP;

            if (newXP >= xpToNextLevel) {
                newLevel += 1;
                finalXP = newXP - xpToNextLevel;
                addNotification({
                    title: 'Buddy Level Up!',
                    message: `${prev.name} has reached Level ${newLevel}!`,
                    type: 'achievement'
                });
            }

            const updatedBuddy = { ...prev, level: newLevel, xp: finalXP };

            // Sync to DB
            supabase.from('buddy_stats').update({
                level: newLevel,
                xp: finalXP
            }).eq('user_id', currentUser.id).then();

            return updatedBuddy;
        });
    };

    const updatePrivacy = (key: 'privacyShield' | 'localStore' | 'aiTraining', value: boolean) => {
        setPrivacySettings(prev => ({ ...prev, [key]: value }));
    };

    const markNotificationRead = async (id: string) => {
        setNotifications(prev => prev.map(n => n.id === id ? { ...n, unread: false } : n));
        await supabase.from('notifications').update({ unread: false }).eq('id', id);
    };

    const markAllNotificationsRead = async () => {
        setNotifications(prev => prev.map(n => ({ ...n, unread: false })));
        await supabase.from('notifications').update({ unread: false }).eq('unread', true);
    };

    const deleteNotification = async (id: string) => {
        setNotifications(prev => prev.filter(n => n.id !== id));
        await supabase.from('notifications').delete().eq('id', id);
    };

    const clearAllNotifications = async () => {
        setNotifications([]);
        await supabase.from('notifications').delete().neq('id', '0');
    };

    const addNotification = async (notification: Omit<Notification, 'id' | 'time' | 'unread'>) => {
        const newNotification: Notification = {
            id: Math.random().toString(36).substr(2, 9),
            unread: true,
            time: 'Just now',
            ...notification
        };
        setNotifications(prev => [newNotification, ...prev]);
        setActiveToast(newNotification);
        await supabase.from('notifications').insert(newNotification);
    };

    const addReflection = async (reflection: Omit<Reflection, 'id' | 'date'>) => {
        // Perform sentiment and distortion check
        let detectedMood = reflection.mood;
        let detectedDistortions = [];

        try {
            const resp = await fetch('/api/analyze-sentiment', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ text: reflection.content })
            });
            const data = await resp.json();
            if (data.mood) detectedMood = data.mood;
            if (data.distortions) detectedDistortions = data.distortions;
        } catch (e) {
            console.error("Sentiment analysis failed:", e);
        }

        const newEntry = {
            id: `refl-${Date.now()}`,
            ...reflection,
            mood: detectedMood,
            distortions: detectedDistortions,
            date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
        };

        setReflections(prev => [newEntry as Reflection, ...prev]);
        await supabase.from('reflections').insert(newEntry);

        addXP(30);
        reportEmotion(detectedMood, 'Reflection');
        unlockAchievement('1');

        // Innovation 4: Trigger Instant Validation Bubble
        try {
            const systemPrompt = `You are a warm, empathic wellness buddy named ${buddy.name}. 
            The user just wrote a reflection and is feeling ${detectedMood}.
            Give them ONE sentence of deep, resonant validation. 
            Do not give advice. Just let them know they are seen.`;

            const resp = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    messages: [{ role: 'system', content: systemPrompt }, { role: 'user', content: reflection.content }],
                    detectedMood: detectedMood
                })
            });
            const chatData = await resp.json();
            if (chatData.content) {
                setInstantValidation(chatData.content);
            }
        } catch (e) {
            console.error("Instant validation failed:", e);
        }
    };

    const deleteReflection = async (id: string) => {
        setReflections(prev => prev.filter(r => r.id !== id));
        await supabase.from('reflections').delete().eq('id', id);
    };

    const addHabit = async (habit: Omit<Habit, 'id' | 'streak' | 'completedDays' | 'consistency'>) => {
        const { data: { user: currentUser } } = await supabase.auth.getUser();
        if (!currentUser) return;

        const newHabit = {
            id: `hab-${Date.now()}`,
            ...habit,
            streak: 0,
            completedDays: [false, false, false, false, false, false, false],
            consistency: 0
        };
        setHabits(prev => [...prev, newHabit as Habit]);

        // Map to DB schema
        const dbHabit = {
            id: newHabit.id,
            user_id: currentUser.id,
            name: newHabit.name,
            category: newHabit.category,
            streak: newHabit.streak,
            consistency: newHabit.consistency,
            completed_days: newHabit.completedDays
        };
        await supabase.from('habits').insert(dbHabit);
    };

    const deleteHabit = async (id: string) => {
        setHabits(prev => prev.filter(h => h.id !== id));
        await supabase.from('habits').delete().eq('id', id);
    };

    const toggleHabitDay = async (habitId: string, dayIndex: number) => {
        const habit = habits.find(h => h.id === habitId);
        if (!habit) return;

        const newCompleted = [...habit.completedDays];
        newCompleted[dayIndex] = !newCompleted[dayIndex];
        const doneCount = newCompleted.filter(Boolean).length;
        const consistency = Math.round((doneCount / 7) * 100);

        let streak = 0;
        for (let i = dayIndex; i >= 0; i--) {
            if (newCompleted[i]) streak++;
            else break;
        }

        const updatedHabit = { ...habit, completedDays: newCompleted, consistency, streak };
        setHabits(prev => prev.map(h => h.id === habitId ? updatedHabit : h));

        await supabase.from('habits').update({
            completed_days: newCompleted,
            consistency,
            streak
        }).eq('id', habitId);

        if (doneCount === 7) {
            unlockAchievement('2');
            addNotification({
                title: 'Habit Mastery!',
                message: `Legendary! You've maintained ${habit.name} for a full week.`,
                type: 'achievement'
            });
        }
    };

    const toggleMission = (id: string) => {
        setMissions(prev => {
            const newMissions = prev.map(m => m.id === id ? { ...m, completed: !m.completed } : m);
            const mission = newMissions.find(m => m.id === id);
            if (mission?.completed) {
                addXP(50);
                addNotification({
                    title: 'Mission Accomplished',
                    message: `You've completed: ${mission.label}. +50 XP`,
                    type: 'mission'
                });
            }
            return newMissions;
        });
    };

    const setMoodPixel = async (date: string, intensity: number) => {
        setMoodPixels(prev => ({ ...prev, [date]: intensity }));
        await supabase.from('mood_pixels').upsert({ date, intensity });
    };

    const unlockAchievement = (id: string) => {
        setAchievements(prev => {
            const ach = prev.find(a => a.id === id);
            if (ach && !ach.unlocked) {
                addNotification({
                    title: 'New Achievement!',
                    message: `Unlocked: ${ach.title}`,
                    type: 'achievement'
                });
                return prev.map(a => a.id === id ? { ...a, unlocked: true } : a);
            }
            return prev;
        });
    };

    const getStats = () => {
        const unlockedCount = achievements.filter(a => a.unlocked).length;
        const score = unlockedCount * 100 + reflections.length * 50;
        return { score, unlockedCount };
    };

    const getPredictiveInsight = () => {
        const dayCounts: { [key: number]: { total: number, low: number } } = {};
        Object.entries(moodPixels).forEach(([date, intensity]) => {
            const day = new Date(date).getDay();
            if (!dayCounts[day]) dayCounts[day] = { total: 0, low: 0 };
            dayCounts[day].total++;
            if (intensity <= 2) dayCounts[day].low++;
        });

        const heavyDays = Object.entries(dayCounts)
            .filter(([_, stats]) => stats.total >= 3 && (stats.low / stats.total) >= 0.5)
            .map(([day]) => parseInt(day));

        return heavyDays;
    };

    const getDynamicPrompt = (mood?: string) => {
        const prompts: Record<string, string[]> = {
            Happy: [
                "What was the highlight of your day?",
                "How did you make someone else smile today?",
                "What are you most grateful for right now?",
                "What's one thing you're proud of yourself for?"
            ],
            Sad: [
                "What is weighing most heavily on your heart?",
                "If your sadness was a flavor, what would it be?",
                "What's one small thing that felt okay today?",
                "If you could say anything to your younger self right now, what would it be?"
            ],
            Neutral: [
                "How did your day unfold?",
                "What's one thing you noticed today that usually goes unseen?",
                "How does your body feel in this moment?",
                "What's one intention you have for tomorrow?"
            ]
        };
        const m = mood || 'Neutral';
        const list = prompts[m] || prompts.Neutral;
        return list[Math.floor(Math.random() * list.length)];
    };

    return (
        <AppContext.Provider value={{
            user,
            buddy,
            detectedEmotion,
            emotionHistory,
            reflections,
            habits,
            achievements,
            missions,
            notifications,
            moodPixels,
            chatMessages,
            onboardingData,
            privacySettings,
            loading,
            hasOnboarded,
            reportEmotion,
            setOnboarding,
            addXP,
            getPredictiveInsight,
            instantValidation,
            setInstantValidation,
            getDynamicPrompt,
            activeToast,
            setActiveToast,
            updatePrivacy,
            markNotificationRead,
            markAllNotificationsRead,
            deleteNotification,
            clearAllNotifications,
            addNotification,
            addReflection,
            deleteReflection,
            addHabit,
            deleteHabit,
            toggleHabitDay,
            toggleMission,
            setMoodPixel,
            login,
            sendPasswordResetEmail,
            signup,
            logout,
            addChatMessage,
            clearChatHistory,
            getStats
        }}>
            {children}
        </AppContext.Provider>
    );
}

export function useApp() {
    const context = useContext(AppContext);
    if (context === undefined) throw new Error('useApp must be used within an AppProvider');
    return context;
}
