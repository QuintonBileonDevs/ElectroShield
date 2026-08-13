'use client';

import { motion } from 'motion/react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { ScrollReveal } from '@/components/ScrollReveal';
import { 
  Shield, 
  Cpu, 
  Network, 
  Lock, 
  Zap, 
  Users, 
  Radio, 
  Binary,
  Layers,
  Activity,
  ChevronRight,
  Database,
  Search,
  Scan,
  Database as DatabaseIcon,
  Globe,
  PlusCircle,
  ShieldAlert
} from 'lucide-react';
import Image from 'next/image';

const systemFeatures = [
  {
    id: "01",
    icon: Cpu,
    title: "Neural Threat Analysis",
    subtitle: "AI Core Protocol",
    desc: "Our system checker core scans through countless database entries each second, identifying anomalities and flags.",
    stats: "2.4M signatures/sec",
    gradient: "from-blue-600 to-cyan-500"
  },
  {
    id: "02",
    icon: Network,
    title: "Decentralized Registry",
    subtitle: "Distributed Ledger",
    desc: "Device ownership and status are logged across a secure, decentralized network, making records immutable and instantly verifiable.",
    stats: "0.003s verification",
    gradient: "from-indigo-600 to-purple-500"
  },
  {
    id: "03",
    icon: Binary,
    title: "End-to-End Encryption",
    subtitle: "Quantum Resistant",
    desc: "All communication between our monitoring center and user nodes uses E2E encryption standards for enhanced security.",
    stats: "AES-256-GCM",
    gradient: "from-emerald-600 to-teal-500"
  }
];

const lifecycleSteps = [
  { step: "01", label: "Registration", detail: "Initial hardware fingerprinting" },
  { step: "02", label: "Verification", detail: "Multi-point link validation" },
  { step: "03", label: "Monitoring", detail: "Real-time state tracking" },
  { step: "04", label: "Protection", detail: "Active threat neutralization" }
];

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-white dark:bg-[#020617] selection:bg-sky-500/30 font-sans">
      <Navbar />

      {/* Hero Section - High Production Value */}
      <section className="relative pt-32 pb-20 px-6 overflow-hidden min-h-[70vh] flex items-center">
        {/* Background Image & Overlay */}
        <div className="absolute inset-0 z-0">
          <Image 
            src="https://images.pexels.com/photos/5380642/pexels-photo-5380642.jpeg"
            alt="Cybersecurity Background"
            fill
            className="object-cover opacity-60 dark:opacity-40"
            priority
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-slate-900/60 dark:bg-[#020617]/80 backdrop-blur-[2px]" />
        </div>

        {/* Background Grid & Ambient Glows */}
        <div className="absolute inset-0 z-[1] pointer-events-none overflow-hidden">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-sky-500/10 blur-[120px] rounded-full opacity-30" />
        </div>

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="flex flex-col items-center text-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 mb-8 backdrop-blur-md"
            >
              <div className="w-2 h-2 rounded-full bg-sky-500 animate-pulse" />
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 dark:text-slate-400">National Device Registry</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="text-6xl md:text-8xl lg:text-9xl font-black tracking-tighter text-white leading-[0.85] mb-10"
            >
              ARCHITECTING <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 via-sky-200 to-white">ABSOLUTE</span> TRUST.
            </motion.h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="max-w-2xl text-slate-200 lg:text-slate-100 text-lg md:text-xl font-medium leading-relaxed mb-12"
            >
              ElectroShield is not just a registry; it is the infrastructure layer for a secure society. 
              Our mission is to proactively neutralize theft threats before they manifest in the physical world.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="flex flex-wrap justify-center gap-4"
            >
              <button className="flex items-center gap-3 px-8 py-4 rounded-2xl bg-white text-slate-950 font-black text-sm uppercase tracking-widest hover:scale-105 transition-transform shadow-2xl shadow-sky-500/20">
                <PlusCircle className="w-5 h-5" />
                Register Device
              </button>
              <button className="flex items-center gap-3 px-8 py-4 rounded-2xl border border-white/30 text-white font-black text-sm uppercase tracking-widest hover:bg-white/10 transition-all backdrop-blur-md">
                <ShieldAlert className="w-5 h-5 text-sky-400" />
                Report Theft
              </button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* The Core System Section - Bento Grid */}
      <section className="py-20 px-6 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Main Large Card */}
          <div className="lg:col-span-8 bg-slate-50/50 dark:bg-white/[0.02] border border-slate-200 dark:border-white/5 rounded-[3rem] p-8 md:p-12 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-8">
              <Scan className="w-24 h-24 text-sky-500/10 group-hover:text-sky-500/20 transition-colors" />
            </div>
            
            <div className="relative z-10 max-w-xl">
              <div className="flex items-center gap-3 mb-6">
                <div className="h-[1px] w-12 bg-sky-500" />
                <span className="text-[10px] font-black text-sky-500 uppercase tracking-[0.4em]">Core Protocol</span>
              </div>
              <h2 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white mb-6 leading-tight">
                Synchronized <br /> Protection Layer.
              </h2>
              <p className="text-slate-600 dark:text-slate-400 text-lg leading-relaxed mb-8 text-justify">
                The ElectroShield Engine operates at the intersection of hardware identification and real-time online community trust. Every device registered within our ecosystem becomes part of a resilient, self-guarding and self-monitoring network.
              </p>
              
              <div className="grid grid-cols-2 gap-8 pt-8 border-t border-slate-200 dark:border-white/5">
                <div>
                  <div className="text-3xl font-black text-sky-600 dark:text-sky-400 mb-1 tracking-tight">13</div>
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Account Types</div>
                </div>
                <div>
                  <div className="text-3xl font-black text-indigo-600 dark:text-indigo-400 mb-1 tracking-tight">99.99%</div>
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Threat neutralized</div>
                </div>
              </div>
            </div>
            
            {/* Ambient Background Effect */}
            <div className="absolute bottom-0 right-0 w-full h-full bg-[radial-gradient(circle_at_bottom_right,rgba(56,189,248,0.1)_0,transparent_50%)] pointer-events-none" />
          </div>

          {/* Secondary Stats Card */}
          <div className="lg:col-span-4 bg-slate-900 rounded-[3rem] p-8 md:p-10 text-white relative overflow-hidden flex flex-col justify-between">
            <div className="absolute inset-0 opacity-10">
              <div className="absolute inset-x-0 top-0 h-[1px] bg-white/20" />
              <div className="absolute inset-y-0 left-0 w-[1px] bg-white/20" />
            </div>
            
            <div>
              <Zap className="w-10 h-10 text-sky-400 mb-8" />
              <h3 className="text-2xl font-black mb-4">Zero-Latency <br /> Neutralization.</h3>
              <p className="text-slate-400 font-medium leading-relaxed text-sm text-justify">
                If a device is flagged as stolen or compromised, our system executes a lock-down protocol across all integrated services within milliseconds.
              </p>
            </div>

            <div className="mt-8 space-y-4">
              {lifecycleSteps.map((s, i) => (
                <div key={i} className="flex items-center justify-between group/step">
                  <div className="flex items-center gap-4">
                    <span className="font-mono text-[10px] text-sky-500">{s.step}</span>
                    <span className="text-xs font-bold uppercase tracking-widest text-slate-400 group-hover/step:text-white transition-colors">{s.label}</span>
                  </div>
                  <div className="h-[1px] flex-1 mx-4 bg-white/5" />
                  <div className="w-2 h-2 rounded-full border border-white/20 group-hover/step:bg-sky-500 group-hover/step:border-sky-500 transition-all" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Feature Grid - Technical Specification Style */}
      <section className="py-20 px-6 max-w-7xl mx-auto border-t border-slate-100 dark:border-white/5">
        <div className="flex flex-col md:flex-row items-end justify-between mb-16 gap-8">
          <div className="max-w-xl">
             <div className="flex items-center gap-3 mb-6">
                <div className="h-[1px] w-12 bg-sky-500" />
                <span className="text-[10px] font-black text-sky-500 uppercase tracking-[0.4em]">Specifications</span>
              </div>
              <h2 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tighter">TECHNICAL <br /> PRIMITIVES.</h2>
          </div>
          <div className="flex gap-2">
            <div className="w-12 h-12 rounded-full border border-slate-200 dark:border-white/10 flex items-center justify-center text-slate-400">
               <ChevronRight className="w-5 h-5 rotate-180" />
            </div>
            <div className="w-12 h-12 rounded-full bg-slate-900 dark:bg-white flex items-center justify-center text-white dark:text-slate-900 shadow-xl">
               <ChevronRight className="w-5 h-5" />
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {systemFeatures.map((f, i) => (
            <ScrollReveal key={i} delay={i * 0.1}>
              <div className="group bg-white dark:bg-white/[0.01] border border-slate-200 dark:border-white/5 rounded-[2.5rem] p-8 hover:border-sky-500/50 transition-all duration-500 relative overflow-hidden h-full">
                {/* Decorative Elements */}
                <div className="font-mono text-[10px] text-slate-300 dark:text-slate-700 absolute top-8 right-8">
                  REF_LIB::{f.id}
                </div>
                
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${f.gradient} flex items-center justify-center text-white shadow-lg mb-8 transform group-hover:scale-110 group-hover:rotate-3 transition-all duration-500`}>
                  <f.icon className="w-7 h-7" />
                </div>

                <div className="mb-8">
                  <h4 className="text-[10px] font-black text-sky-500 uppercase tracking-[0.2em] mb-2">{f.subtitle}</h4>
                  <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-4 tracking-tighter">{f.title}</h3>
                  <p className="text-slate-600 dark:text-slate-400 font-medium leading-relaxed text-justify">
                    {f.desc}
                  </p>
                </div>

                <div className="pt-6 border-t border-slate-100 dark:border-white/5 flex items-center justify-between">
                  <span className="font-mono text-[11px] text-slate-400 uppercase">{f.stats}</span>
                  <Activity className="w-4 h-4 text-sky-500/40" />
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </section>

      {/* Visual Data Section - Atmospheric */}
      <section className="py-20 px-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-slate-900 dark:bg-[#020617] -z-10" />
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_center,#3b82f6_0,#000_100%)] blur-[100px]" />
        
        <div className="max-w-7xl mx-auto rounded-[4rem] border border-white/5 bg-white/[0.02] backdrop-blur-3xl overflow-hidden p-8 md:p-16">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
             <div className="relative z-10">
                <h2 className="text-4xl md:text-6xl font-black text-white mb-8 tracking-tighter">THE FUTURE OF <br /> SOVEREIGN SECURITY.</h2>
                <div className="space-y-6">
                   <div className="flex gap-6 p-6 rounded-3xl bg-white/[0.03] border border-white/5 hover:bg-white/[0.05] transition-colors group">
                      <div className="w-12 h-12 rounded-2xl bg-sky-500/10 flex items-center justify-center text-sky-400 group-hover:scale-110 transition-transform">
                        <Lock className="w-6 h-6" />
                      </div>
                      <div>
                        <h4 className="text-white font-bold mb-1">State-Grade Privacy</h4>
                        <p className="text-slate-400 text-sm font-medium">Data is anonymized at the edge before hitting our secure cloud environment.</p>
                      </div>
                   </div>
                   <div className="flex gap-6 p-6 rounded-3xl bg-white/[0.03] border border-white/5 hover:bg-white/[0.05] transition-colors group">
                      <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 flex items-center justify-center text-indigo-400 group-hover:scale-110 transition-transform">
                        <DatabaseIcon className="w-6 h-6" />
                      </div>
                      <div>
                        <h4 className="text-white font-bold mb-1">Audit-Ready Logs</h4>
                        <p className="text-slate-400 text-sm font-medium">Every system action is logged and verifiable by independent security auditors.</p>
                      </div>
                   </div>
                </div>
             </div>

             <div className="relative aspect-square">
               {/* Decorative Technical Ring */}
               <div className="absolute inset-0 rounded-full border border-white/5 animate-[spin_20s_linear_infinite]" />
               <div className="absolute inset-4 rounded-full border border-sky-500/10 animate-[spin_15s_linear_infinite_reverse]" />
               <div className="absolute inset-8 rounded-full border border-white/5 border-dashed" />
               
               <div className="absolute inset-0 flex items-center justify-center">
                 <motion.div
                   animate={{ scale: [1, 1.05, 1], rotate: [0, 5, 0] }}
                   transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                   className="relative w-48 h-48 rounded-[2.5rem] bg-gradient-to-br from-sky-600 to-indigo-700 shadow-2xl flex items-center justify-center"
                 >
                   <Shield className="w-20 h-20 text-white" />
                   <div className="absolute -inset-4 bg-sky-500/20 blur-2xl rounded-full -z-10" />
                 </motion.div>
               </div>

               {/* Floating elements */}
               <div className="absolute top-1/4 right-0 px-4 py-2 bg-white/10 backdrop-blur-md rounded-xl border border-white/10 text-[10px] font-mono text-white tracking-widest">
                 SECURE_INIT::SUCCESS
               </div>
               <div className="absolute bottom-1/4 left-0 px-4 py-2 bg-white/10 backdrop-blur-md rounded-xl border border-white/10 text-[10px] font-mono text-white tracking-widest">
                 NODE_HEALTH::100%
               </div>
             </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 px-6 max-w-4xl mx-auto text-center">
         <ScrollReveal>
           <h2 className="text-3xl md:text-5xl font-black text-slate-900 dark:text-white mb-8 tracking-tighter leading-none italic">
             START SECURING YOUR <br /> DIGITAL FRONT-LINE.
           </h2>
           <button className="h-16 px-12 rounded-full bg-slate-900 dark:bg-white text-white dark:text-slate-950 font-black text-sm uppercase tracking-[0.3em] hover:scale-105 active:scale-95 transition-all shadow-2xl">
             Launch Portal
           </button>
         </ScrollReveal>
      </section>

      <Footer />
    </main>
  );
}
