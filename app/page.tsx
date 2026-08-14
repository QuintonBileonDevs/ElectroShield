'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/auth-provider';

import { Navbar } from '@/components/Navbar';
import { Hero } from '@/components/Hero';
import { Features } from '@/components/Features';
import { Ecosystem } from '@/components/Ecosystem';
import { Rewards } from '@/components/Rewards';
import { BottomCTA } from '@/components/BottomCTA';
import { Footer } from '@/components/Footer';

import { ScrollReveal } from '@/components/ScrollReveal';

export default function Home() {
  const { user, loading } = useAuth();
  const router = useRouter();

  const sessionAdmin = typeof window !== 'undefined' && sessionStorage.getItem('super_admin_authenticated') === 'true';
  const isSuperAdmin = sessionAdmin || user?.accountType === 'super_admin' || user?.accountType === 'admin';

  useEffect(() => {
    if (loading) return;

    if (isSuperAdmin) {
      router.replace('/admin?tab=overview');
    } else if (user) {
      router.replace('/dashboard');
    }
  }, [user, loading, isSuperAdmin, router]);

  if (loading || isSuperAdmin || user) {
    return (
      <main className="min-h-screen bg-slate-50 dark:bg-black flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-4 border-sky-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-xs font-mono text-slate-400 uppercase tracking-widest">Verifying session...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 dark:bg-black selection:bg-sky-200 dark:selection:bg-sky-900">
      <Navbar />
      
      <div className="flex flex-col min-h-screen overflow-hidden">
        {/* Sections flow seamlessly edge-to-edge */}
        <section className="relative z-0 overflow-hidden">
          <Hero />
        </section>

        <ScrollReveal direction="up">
          <section className="relative z-10 w-full">
            <Features />
          </section>
        </ScrollReveal>

        <ScrollReveal direction="up">
          <section className="relative z-10 bg-white dark:bg-slate-900 overflow-hidden border-y border-slate-100 dark:border-slate-800 w-full">
            <Ecosystem />
          </section>
        </ScrollReveal>

        <ScrollReveal direction="up">
          <section className="relative z-10 bg-slate-900 dark:bg-slate-950 overflow-hidden w-full">
            <Rewards />
          </section>
        </ScrollReveal>

        <ScrollReveal direction="up">
          <section className="relative z-10 w-full">
            <BottomCTA />
          </section>
        </ScrollReveal>

        <section className="relative z-0 bg-white dark:bg-slate-950 overflow-hidden border-t border-slate-100 dark:border-slate-800 w-full">
          <Footer />
        </section>
      </div>
    </main>
  );
}


