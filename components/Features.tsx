'use client';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ShieldCheck, 
  Search, 
  Bell, 
  Plus, 
  Minus, 
  ArrowUpRight, 
  ArrowRight,
  Eye,
  ShieldAlert,
  Smartphone,
  Zap
} from 'lucide-react';
import React, { useState } from 'react';
import Image from 'next/image';

const features = [
  {
    slug: "register",
    title: "AssetGuard",
    description: "Secure your assets in our national decentralized registry with defense-grade encryption and unique ID generation.",
    icon: ShieldCheck,
  },
  {
    slug: "verify",
    title: "StatusCheck",
    description: "Instantly check the status of any device using IMEI or Serial number before purchase to avoid stolen goods.",
    icon: Search,
  },
  {
    slug: "monitor",
    title: "AssetWatch",
    description: "Track your device lifecycle, service history, and ownership transfers in real-time with push alerts.",
    icon: Bell,
  },
  {
    slug: "recover",
    title: "RecoveryLink",
    description: "Activate our community-driven network to locate lost devices. Set secure bounties and seamlessly coordinate with finders for a safe, rewarded return.",
    icon: ShieldAlert,
  },
  {
    slug: "nmpr",
    title: "NMPRConnect",
    description: "Seamlessly integrate with police databases and mobile networks to broadcast theft alerts instantly.",
    icon: Zap,
  }
];

export function Features() {
  const [activeTab, setActiveTab] = useState(features[0].slug);

  return (
    <section className="py-20 md:py-24 bg-slate-50/50 dark:bg-slate-950 transition-colors">
      <div className="w-full px-4 sm:px-6 md:px-12 lg:px-20">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 md:mb-20 gap-6 md:gap-8">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight text-slate-900 dark:text-white leading-[1.1] uppercase"
          >
            Do more with <br /> <span className="text-sky-600">ElectroShield</span>
          </motion.h2>
          <motion.button 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="flex items-center gap-2 text-slate-900 dark:text-white font-black uppercase text-[10px] md:text-sm tracking-widest hover:gap-4 transition-all pb-1 md:pb-2 border-b-2 border-transparent hover:border-sky-600"
          >
            Download the app <ArrowRight className="w-4 md:w-5 h-4 md:h-5 text-sky-600" />
          </motion.button>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 md:gap-16 items-start">
          
          {/* Left Side: Mockup Illustration Area */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="bg-white/60 dark:bg-slate-900 rounded-[2rem] md:rounded-[3rem] p-6 md:p-16 shadow-2xl shadow-sky-900/5 dark:shadow-none border border-slate-100 dark:border-slate-800 flex justify-center items-center min-h-[500px] md:min-h-[600px] relative overflow-hidden backdrop-blur-sm"
          >
            {/* Ambient Background Glow */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-sky-100 dark:bg-sky-900/20 rounded-full blur-3xl opacity-50 -translate-y-1/2 translate-x-1/2" />
            
            <div className="relative w-full max-w-[260px] md:max-w-[300px] aspect-[9/18.5] bg-slate-950 rounded-[3rem] md:rounded-[3.5rem] border-[8px] md:border-[10px] border-slate-900 shadow-[0_40px_100px_rgba(0,0,0,0.5)] relative p-1 overflow-hidden">
               {/* Phone Notch */}
               <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 md:w-28 h-5 md:h-6 bg-slate-900 rounded-b-2xl z-20" />
               
                {/* App UI Simulation */}
                <div className="relative z-10 p-4 md:p-5 pt-8 md:pt-10 text-white h-full flex flex-col font-sans">
                  <div className="flex justify-between items-center mb-6 md:mb-8">
                    <div className="flex flex-col">
                       <span className="text-[8px] md:text-[9px] font-black text-slate-500 uppercase tracking-[0.2em] mb-1 leading-none text-left">Security Node</span>
                       <span className="text-xs md:text-sm font-black text-sky-400 text-left">ESH-ACTIVE</span>
                    </div>
                    <div className="w-8 h-8 md:w-10 md:h-10 rounded-xl md:rounded-2xl bg-sky-600/10 border border-sky-500/20 flex items-center justify-center text-sky-400 shadow-[0_0_15px_rgba(14,165,233,0.1)]">
                       <ShieldCheck className="w-5 md:w-6 h-5 md:h-6" />
                    </div>
                  </div>

                  {/* Security Score Widget */}
                  <div className="bg-slate-900/60 rounded-2xl md:rounded-3xl p-4 md:p-6 border border-white/5 mb-4 md:mb-6 relative overflow-hidden group backdrop-blur-sm">
                     <div className="absolute top-0 right-0 w-32 h-32 bg-sky-500/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2 group-hover:bg-sky-500/15 transition-colors" />
                     <div className="relative z-10">
                        <div className="flex justify-between items-center mb-3 md:mb-4">
                           <p className="text-[9px] md:text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Risk Index</p>
                           <div className="text-[8px] md:text-[9px] font-black text-emerald-400 bg-emerald-400/10 px-1.5 md:px-2 py-0.5 rounded-md border border-emerald-400/20">98% SAFE</div>
                        </div>
                        <div className="flex items-baseline gap-1">
                           <span className="text-3xl md:text-4xl font-black text-white leading-none tracking-tighter">98.2</span>
                           <span className="text-[9px] md:text-[10px] font-bold text-slate-500 uppercase">Points</span>
                        </div>
                        <div className="mt-3 md:mt-4 h-1 md:h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                           <motion.div 
                             initial={{ width: 0 }}
                             whileInView={{ width: '98.2%' }}
                             transition={{ duration: 1.5, ease: 'easeOut' }}
                             className="h-full bg-gradient-to-r from-sky-600 to-sky-400 shadow-[0_0_10px_rgba(14,165,233,0.4)]" 
                           />
                        </div>
                     </div>
                  </div>

                  {/* Registry List */}
                  <div className="flex justify-between items-center mb-3 md:mb-4 px-1">
                     <h4 className="text-[9px] md:text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Asset Registry</h4>
                     <div className="flex items-center gap-1 md:gap-1.5">
                        <div className="w-1 md:w-1.5 h-1 md:h-1.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.8)]" />
                        <span className="text-[8px] md:text-[9px] font-bold text-slate-400 uppercase">12 SECURED</span>
                     </div>
                  </div>

                  <div className="space-y-2 md:space-y-3 flex-1 overflow-y-auto no-scrollbar pb-2 text-left">
                    <div className="bg-slate-800/40 border border-white/5 rounded-xl md:rounded-2xl p-3 md:p-4 transition-all hover:bg-slate-800/60 group">
                       <div className="flex items-center justify-between mb-2 md:mb-3 text-left">
                          <div className="flex items-center gap-2 md:gap-2.5">
                             <div className="w-6 md:w-7 h-6 md:h-7 rounded-md md:rounded-lg bg-sky-500/10 flex items-center justify-center border border-sky-500/10 group-hover:bg-sky-500/20 transition-colors">
                                <Smartphone className="w-3 md:w-4 h-3 md:w-4 text-sky-400" />
                             </div>
                             <span className="text-[10px] md:text-sm font-bold text-slate-200">iPhone 15 Pro</span>
                          </div>
                          <span className="text-[8px] md:text-[9px] font-black text-sky-400">VERIFIED</span>
                       </div>
                       <div className="flex justify-between items-center text-left">
                          <div className="flex flex-col">
                             <span className="text-[7px] md:text-[8px] font-bold text-slate-500 uppercase leading-none mb-0.5">Certificate</span>
                             <span className="text-[8px] md:text-[9px] font-mono text-slate-400 italic">#ESH-779-22</span>
                          </div>
                          <div className="flex -space-x-1">
                             {[1,2,3].map(i => <div key={i} className="w-2.5 md:w-3 h-2.5 md:h-3 rounded-full bg-slate-700 border border-slate-900" />)}
                          </div>
                       </div>
                    </div>

                    <div className="bg-slate-800/20 border border-white/5 rounded-xl md:rounded-2xl p-3 md:p-4 opacity-40 grayscale hover:grayscale-0 hover:opacity-100 transition-all text-left">
                       <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2 md:gap-2.5">
                             <div className="w-6 md:w-7 h-6 md:h-7 rounded-md md:rounded-lg bg-slate-700 flex items-center justify-center">
                                <Zap className="w-3 md:w-3.5 h-3 md:w-3.5 text-slate-500" />
                             </div>
                             <span className="text-[10px] md:text-sm font-bold text-slate-400">MacBook Pro</span>
                          </div>
                          <span className="text-[8px] md:text-[9px] font-bold text-slate-600 uppercase">STBY</span>
                       </div>
                    </div>
                  </div>

                  {/* App Navigation Simulation */}
                  <div className="mt-2 grid grid-cols-4 gap-2 pt-3 md:pt-4 border-t border-white/10 relative z-20">
                    {[Plus, ArrowRight, Search, Zap].map((Icon, i) => (
                      <div key={i} className="flex flex-col items-center gap-1 cursor-pointer group">
                        <div className={`w-8 h-8 md:w-10 md:h-10 rounded-lg md:rounded-xl flex items-center justify-center transition-all ${i === 0 ? 'bg-sky-600 text-white shadow-lg shadow-sky-600/30' : 'bg-slate-800/80 text-slate-500 group-hover:bg-slate-700 group-hover:text-white'}`}>
                          <Icon className="w-3.5 md:w-4 h-3.5 md:h-4" />
                        </div>
                        <span className="text-[6px] md:text-[7px] font-black text-slate-500 uppercase tracking-tighter">
                          {['Secure', 'Track', 'Verify', 'Shield'][i]}
                        </span>
                      </div>
                    ))}
                  </div>
               </div>
            </div>
          </motion.div>

          {/* Right Side: Accordion Content */}
          <div className="space-y-3 md:space-y-4">
            {features.map((feature) => {
              const isActive = activeTab === feature.slug;
              return (
                <motion.div 
                  key={feature.slug}
                  layout
                  onClick={() => setActiveTab(feature.slug)}
                  className={`group cursor-pointer transition-all duration-500 rounded-2xl md:rounded-[2.5rem] ${
                    isActive 
                      ? 'bg-sky-600 dark:bg-sky-950 text-white p-6 md:p-10 shadow-2xl shadow-sky-600/20 dark:shadow-none' 
                      : 'bg-white/40 dark:bg-transparent text-slate-900 dark:text-white p-6 md:p-10 hover:bg-white dark:hover:bg-slate-900/50 border border-transparent hover:border-slate-200 dark:hover:border-slate-800 backdrop-blur-sm'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 md:gap-8">
                      <div className={`transition-all duration-300 ${isActive ? 'text-sky-300 scale-125' : 'text-slate-400 group-hover:text-slate-900 dark:group-hover:text-white scale-100'}`}>
                        {isActive ? <ArrowUpRight className="w-6 md:w-7 h-6 md:h-7" /> : <feature.icon className="w-6 md:w-7 h-6 md:h-7" />}
                      </div>
                      <h3 className="text-xl md:text-3xl font-black tracking-tight uppercase">{feature.title}</h3>
                    </div>
                    <div className={`transition-transform duration-300 ${isActive ? 'rotate-0 opacity-100' : 'opacity-40 group-hover:opacity-100 group-hover:rotate-90'}`}>
                      {isActive ? <Minus className="w-5 md:w-6 h-5 md:h-6" /> : <Plus className="w-5 md:w-6 h-5 md:h-6" />}
                    </div>
                  </div>

                  <AnimatePresence mode="wait">
                    {isActive && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.4, ease: "circOut" }}
                        className="overflow-hidden"
                      >
                        <p className={`mt-4 md:mt-8 text-sm md:text-xl ${isActive ? 'text-sky-50' : 'text-slate-600'} leading-relaxed max-w-md font-medium`}>
                          {feature.description}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
