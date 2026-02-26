'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Heart, Shield, Sparkles, Brain, ArrowRight, Activity, Zap, Check } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--primary-text)] font-sans selection:bg-[var(--accent)]/20">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 backdrop-blur-md bg-white/70 border-b border-[var(--border)]">
        <div className="max-w-5xl mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-[var(--accent)] rounded-lg flex items-center justify-center shadow-sm">
              <Heart className="text-[var(--primary-text)] w-4 h-4 fill-current" strokeWidth={0} />
            </div>
            <span className="font-semibold text-lg tracking-tight">EmpathIQ</span>
          </div>
          <div className="hidden md:flex items-center gap-8">
            <Link href="/docs?topic=coach" className="text-[11px] font-bold uppercase tracking-widest text-[var(--secondary-text)] opacity-40 hover:opacity-100 transition-all">Product</Link>
            <Link href="/docs?topic=mission" className="text-[11px] font-bold uppercase tracking-widest text-[var(--secondary-text)] opacity-40 hover:opacity-100 transition-all">Culture</Link>
            <Link href="/docs?topic=help" className="text-[11px] font-bold uppercase tracking-widest text-[var(--secondary-text)] opacity-40 hover:opacity-100 transition-all">Support</Link>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/login" className="text-[12px] font-medium px-3 py-1.5 hover:bg-[var(--surface)] border border-transparent hover:border-[var(--border)] rounded-lg transition-all">
              Log in
            </Link>
            <Link href="/signup" className="btn-primary h-8 px-4 rounded-lg text-[12px] font-medium transition-all flex items-center justify-center shadow-xs">
              Join
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-20 pb-12 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="space-y-6"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-[var(--surface)] border border-[var(--border)] rounded-full text-[10px] font-medium uppercase tracking-wider text-[var(--secondary-text)] opacity-60">
              <Sparkles className="w-3.5 h-3.5 text-blue-400" strokeWidth={1.5} />
              <span>Intelligence meets Soul</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-semibold mb-4 tracking-tight leading-[1.1] text-balance">
              Emotional Resonance. <br />
              <span className="text-[var(--accent)]">Simplified.</span>
            </h1>
            <p className="text-base md:text-lg text-[var(--secondary-text)] opacity-60 mb-8 max-w-2xl mx-auto leading-relaxed">
              The first AI companion designed to understand the frequency of your heart.
              Refined, personal, and perfectly synchronized with your wellness journey.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link href="/signup" className="btn-primary h-11 px-8 rounded-xl text-[14px] font-medium transition-all flex items-center justify-center gap-2 shadow-sm group">
                Enter the Sanctuary
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" strokeWidth={1.5} />
              </Link>
              <Link
                href="/docs?topic=about"
                className="h-[42px] px-8 bg-[var(--surface)] text-[var(--primary-text)] rounded-full flex items-center justify-center font-semibold text-[14px] hover:bg-[var(--border)] transition-all active:scale-[0.98] border border-[var(--border)]"
              >
                Learn More
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Feature Grid */}
      <section id="features" className="py-12 px-6 bg-white/50">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <FeatureCard
              icon={<Brain className="w-5 h-5" strokeWidth={1.5} />}
              title="AI Mental Coach"
              desc="Structured, therapeutic guidance trained on clinical wellness models."
              accent="bg-blue-50"
              iconColor="text-blue-500"
            />
            <FeatureCard
              icon={<Activity className="w-5 h-5" strokeWidth={1.5} />}
              title="Mood Analytics"
              desc="Visualize your emotional journey with GitHub-style data insights."
              accent="bg-green-50"
              iconColor="text-green-500"
            />
            <FeatureCard
              icon={<Shield className="w-5 h-5" strokeWidth={1.5} />}
              title="Private Sanctuary"
              desc="End-to-end encryption for your most personal sessions."
              accent="bg-purple-50"
              iconColor="text-purple-500"
            />
          </div>
        </div>
      </section>

      {/* Global CTA */}
      <section id="impact" className="py-16 px-6">
        <div className="max-w-4xl mx-auto bg-white border border-[var(--border)] rounded-[32px] p-12 text-center shadow-xs relative overflow-hidden group">
          <div className="w-12 h-12 bg-[var(--surface)] border border-[var(--border)] rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xs group-hover:scale-105 transition-transform">
            <Heart className="w-6 h-6 text-red-500" strokeWidth={1.5} />
          </div>
          <h2 className="text-3xl font-semibold mb-6 tracking-tight">The buddy you've always needed.</h2>
          <p className="text-[14px] text-[var(--secondary-text)] opacity-60 mb-10 max-w-sm mx-auto leading-relaxed">
            Join a sanctuary of wellness where technology serves your heart, not your screen time.
          </p>
          <Link href="/signup" className="btn-primary h-11 px-10 rounded-xl text-[14px] font-medium shadow-sm hover:scale-[1.02] transition-all inline-flex items-center gap-2">
            Get Started <ArrowRight className="w-4 h-4" />
          </Link>

          <div className="absolute -top-24 -right-24 w-64 h-64 bg-[var(--accent)]/5 blur-[80px] rounded-full pointer-events-none" />
          <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-blue-400/5 blur-[80px] rounded-full pointer-events-none" />
        </div>
      </section>

      {/* Footer */}
      <footer id="support" className="py-12 px-6 border-t border-[var(--border)]">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row justify-between items-start gap-12">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 bg-[var(--accent)] rounded-lg flex items-center justify-center shadow-xs">
                <Heart className="text-[var(--primary-text)] w-3.5 h-3.5 fill-current" strokeWidth={0} />
              </div>
              <span className="font-semibold text-base tracking-tight text-[var(--primary-text)]">EmpathIQ</span>
            </div>
            <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-[var(--secondary-text)] opacity-30 max-w-[200px]">Human resonance by design.</p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-12">
            <FooterColumn title="Product" links={['Coach', 'Analytics', 'Habits', 'Reflections']} />
            <FooterColumn title="Company" links={['Our Mission', 'Privacy', 'Ethics']} />
            <FooterColumn title="Support" links={['Help Center', 'Safety', 'Connect']} />
          </div>
        </div>
        <div className="max-w-5xl mx-auto mt-16 pt-8 border-t border-[var(--border)]/50 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-[10px] font-medium text-[var(--secondary-text)] opacity-20 uppercase tracking-widest">© 2026 EmpathIQ Sanctuary</p>
          <div className="flex gap-6 opacity-20 hover:opacity-100 transition-opacity">
          </div>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({ icon, title, desc, accent, iconColor }: { icon: React.ReactNode; title: string; desc: string; accent: string; iconColor: string }) {
  return (
    <div className="p-8 rounded-[24px] bg-white border border-[var(--border)] shadow-xs hover:border-[var(--accent)] transition-all group">
      <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center mb-6 shadow-xs group-hover:scale-110 transition-transform", accent, iconColor)}>
        {icon}
      </div>
      <h3 className="text-lg font-semibold mb-3 tracking-tight">{title}</h3>
      <p className="text-[13px] text-[var(--secondary-text)] opacity-60 leading-relaxed mb-6">{desc}</p>
      <div className="pt-4 border-t border-[var(--border)] opacity-30 group-hover:opacity-100 transition-opacity">
        <div className="w-7 h-7 rounded-lg bg-[var(--surface)] flex items-center justify-center hover:bg-[var(--accent)] hover:text-white transition-all cursor-pointer">
          <ArrowRight className="w-3.5 h-3.5" strokeWidth={1.5} />
        </div>
      </div>
    </div>
  );
}

function FooterColumn({ title, links }: { title: string; links: string[] }) {
  const getTopic = (link: string) => {
    switch (link.toLowerCase()) {
      case 'coach': return 'coach';
      case 'analytics': return 'analytics';
      case 'habits': return 'habits';
      case 'reflections': return 'reflections';
      case 'our mission': return 'mission';
      case 'privacy': return 'privacy';
      case 'ethics': return 'ethics';
      case 'help center': return 'help';
      case 'safety': return 'safety';
      case 'connect': return 'connect';
      default: return '';
    }
  };

  return (
    <div className="space-y-4">
      <p className="text-[10px] font-medium uppercase tracking-wider text-[var(--secondary-text)] opacity-20">{title}</p>
      <ul className="space-y-2">
        {links.map(l => (
          <li key={l}>
            <Link
              href={`/docs?topic=${getTopic(l)}`}
              className="text-[12px] font-medium text-[var(--secondary-text)] opacity-40 hover:opacity-100 transition-all"
            >
              {l}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
