'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Target, Sparkles, Smile, Shield, Check, ChevronRight, BookOpen } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useApp } from '@/lib/store';

const steps = [
    {
        id: 'user_details',
        title: "Let's start with your story",
        description: "I'm so glad you're here. Tell me a bit about yourself so I can support you better.",
        fields: [
            { id: 'userName', label: 'What should I call you?', placeholder: 'Your name', type: 'text' },
            {
                id: 'userAge',
                label: 'How many summers have you seen?',
                type: 'dropdown',
                choices: ['Under 18', '18-24', '25-34', '35-44', '45+']
            },
            {
                id: 'userStatus',
                label: 'What keeps you busy these days?',
                type: 'dropdown',
                choices: ['Student', 'Professional', 'Entrepreneur', 'Self-employed', 'Other']
            },
            { id: 'userHighMoment', label: 'A recent moment that made you smile?', placeholder: 'Something good...', type: 'text' }
        ],
        icon: <Smile className="w-5 h-5" strokeWidth={1.5} />
    },
    {
        id: 'buddy_profile',
        title: 'Meet your new companion',
        description: 'Every journey is better with a friend. Who will be walking beside you?',
        fields: [
            { id: 'buddyName', label: "What should I name your buddy?", placeholder: 'e.g., Aura', type: 'text' },
            {
                id: 'buddyAge',
                label: "How wise should your buddy be?",
                type: 'dropdown',
                choices: ['Young adult (20s)', 'Mature (30s)', 'Wise (40s+)', 'Ageless']
            }
        ],
        options: {
            id: 'buddyStyle',
            title: 'How should we talk?',
            choices: ['Friendly', 'Gentle', 'Direct']
        },
        icon: <Sparkles className="w-5 h-5" strokeWidth={1.5} />
    },
    {
        id: 'goal_categories',
        title: "What's weighing on your mind?",
        description: "Be honest with yourself. What do you want to nurture?",
        multiSelect: true,
        options: {
            id: 'goalCategories',
            choices: ['Less Stress', 'Better Sleep', 'Emotional Balance', 'Personal Growth', 'Deep Focus', 'Movement']
        },
        icon: <Target className="w-5 h-5" strokeWidth={1.5} />
    },
    {
        id: 'goal_details',
        title: 'Your promise to yourself',
        description: "Let's put words to your intention. This is your sanctuary.",
        fields: [
            { id: 'goalTitle', label: 'Your North Star', placeholder: 'e.g., Finding my inner peace', type: 'text' },
            { id: 'goalDescription', label: 'Why does this matter to you?', placeholder: 'Share your why...', type: 'textarea' }
        ],
        icon: <BookOpen className="w-5 h-5" strokeWidth={1.5} />
    },
];

export default function OnboardingPage() {
    const router = useRouter();
    const { setOnboarding, hasOnboarded, loading } = useApp();

    React.useEffect(() => {
        if (!loading && hasOnboarded) {
            router.replace('/dashboard');
        }
    }, [hasOnboarded, loading, router]);

    const [currentStep, setCurrentStep] = useState(0);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [selections, setSelections] = useState<Record<string, any>>({
        goalCategories: []
    });

    const handleFieldChange = (id: string, value: any) => {
        setSelections(prev => ({ ...prev, [id]: value }));
    };

    const toggleMultiSelect = (id: string, value: string) => {
        setSelections(prev => {
            const current = prev[id] || [];
            if (current.includes(value)) {
                return { ...prev, [id]: current.filter((v: string) => v !== value) };
            }
            return { ...prev, [id]: [...current, value] };
        });
    };

    const handleContinue = async () => {
        if (currentStep < steps.length - 1) {
            setCurrentStep(currentStep + 1);
        } else {
            setIsSubmitting(true);
            await setOnboarding(selections);
            router.push('/dashboard');
        }
    };

    const isStepComplete = () => {
        const step = steps[currentStep];
        if (step.id === 'goal_categories') {
            return (selections.goalCategories || []).length > 0;
        }
        if (step.fields) {
            return step.fields.every(f => selections[f.id]);
        }
        if (step.options) {
            return selections[step.options.id];
        }
        return true;
    };

    const progress = ((currentStep + 1) / steps.length) * 100;

    return (
        <div className="min-h-screen bg-[var(--background)] flex flex-col items-center justify-center p-6">
            <div className="w-full max-w-[440px]">
                {/* Progress Bar */}
                <div className="w-full h-1 bg-[var(--surface)] border border-[var(--border)] rounded-full mb-8 overflow-hidden">
                    <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${progress}%` }}
                        className="h-full bg-[var(--accent)] rounded-full"
                    />
                </div>

                <AnimatePresence mode="wait">
                    <motion.div
                        key={currentStep}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.98 }}
                        className="card bg-white p-8 shadow-xs border border-[var(--border)]"
                    >
                        <div className="w-10 h-10 bg-[var(--surface)] border border-[var(--border)] rounded-xl flex items-center justify-center mb-6">
                            {steps[currentStep].icon}
                        </div>

                        <h1 className="text-[20px] font-semibold mb-1.5 tracking-tight">{steps[currentStep].title}</h1>
                        <p className="text-[13px] text-[var(--secondary-text)] opacity-60 mb-8 leading-relaxed">
                            {steps[currentStep].description}
                        </p>

                        <div className="space-y-4 mb-8">
                            {steps[currentStep].fields?.map((field) => (
                                <div key={field.id} className="space-y-1.5">
                                    <label className="text-[10px] font-medium uppercase tracking-wider text-[var(--secondary-text)] opacity-40 px-0.5">{field.label}</label>
                                    {field.type === 'dropdown' ? (
                                        <select
                                            value={selections[field.id] || ''}
                                            onChange={(e) => handleFieldChange(field.id, e.target.value)}
                                            className="w-full h-10 px-4 bg-[var(--surface)] border border-[var(--border)] rounded-lg text-[13px] font-medium outline-none focus:ring-2 focus:ring-[var(--accent)] transition-all appearance-none cursor-pointer"
                                        >
                                            <option value="" disabled>Select</option>
                                            {field.choices?.map(c => (
                                                <option key={c} value={c}>{c}</option>
                                            ))}
                                        </select>
                                    ) : field.type === 'textarea' ? (
                                        <textarea
                                            placeholder={field.placeholder}
                                            value={selections[field.id] || ''}
                                            onChange={(e) => handleFieldChange(field.id, e.target.value)}
                                            className="w-full h-24 p-4 bg-[var(--surface)] border border-[var(--border)] rounded-lg text-[13px] font-medium outline-none focus:ring-2 focus:ring-[var(--accent)] transition-all resize-none"
                                        />
                                    ) : (
                                        <input
                                            type={field.type}
                                            placeholder={field.placeholder}
                                            value={selections[field.id] || ''}
                                            onChange={(e) => handleFieldChange(field.id, e.target.value)}
                                            className="w-full h-10 px-4 bg-[var(--surface)] border border-[var(--border)] rounded-lg text-[13px] font-medium outline-none focus:ring-2 focus:ring-[var(--accent)] transition-all"
                                        />
                                    )}
                                </div>
                            ))}

                            {steps[currentStep].options && (
                                <div className="space-y-3">
                                    {steps[currentStep].options.title && (
                                        <label className="text-[10px] font-medium uppercase tracking-wider text-[var(--secondary-text)] opacity-40 px-0.5">{steps[currentStep].options.title}</label>
                                    )}
                                    <div className="grid grid-cols-2 gap-2">
                                        {steps[currentStep].options.choices.map((choice) => {
                                            if (!steps[currentStep].options) return null;
                                            const isSelected = steps[currentStep].multiSelect
                                                ? (selections[steps[currentStep].options!.id] || []).includes(choice)
                                                : selections[steps[currentStep].options!.id] === choice;

                                            return (
                                                <button
                                                    key={choice}
                                                    onClick={() => steps[currentStep].multiSelect
                                                        ? toggleMultiSelect(steps[currentStep].options!.id, choice)
                                                        : handleFieldChange(steps[currentStep].options!.id, choice)}
                                                    className={cn(
                                                        "w-full h-10 px-4 rounded-lg text-center text-[13px] font-medium transition-all flex items-center justify-center gap-2",
                                                        isSelected ? "bg-[var(--accent)] text-[var(--primary-text)] border border-[var(--accent)] shadow-xs" : "bg-[var(--surface)] text-[var(--secondary-text)] border border-[var(--border)] opacity-60"
                                                    )}
                                                >
                                                    {choice}
                                                    {isSelected && <Check className="w-3.5 h-3.5" strokeWidth={2} />}
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="flex gap-3">
                            {currentStep > 0 && (
                                <button
                                    onClick={() => setCurrentStep(currentStep - 1)}
                                    className="flex-1 h-10 rounded-lg text-[13px] font-medium border border-[var(--border)] hover:bg-[var(--surface)] transition-all"
                                >
                                    Back
                                </button>
                            )}
                            <button
                                onClick={handleContinue}
                                disabled={!isStepComplete() || isSubmitting}
                                className="btn-primary flex-[2] h-10 rounded-lg text-[13px] flex items-center justify-center gap-2"
                            >
                                {isSubmitting ? (
                                    <>
                                        <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                        Syncing...
                                    </>
                                ) : (
                                    currentStep === steps.length - 1 ? 'Finish' : 'Continue'
                                )}
                            </button>
                        </div>
                    </motion.div>
                </AnimatePresence>

                <div className="mt-6 flex items-center justify-center gap-2 text-[var(--secondary-text)] opacity-30">
                    <Shield className="w-3.5 h-3.5" strokeWidth={1.5} />
                    <span className="text-[11px] font-medium">Your data is private and secure.</span>
                </div>
            </div>
        </div>
    );
}
