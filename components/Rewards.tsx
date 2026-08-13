'use client';
import { motion } from 'motion/react';
import { 
  Crown, 
  ArrowRight, 
  QrCode, 
  ArrowRightLeft, 
  Trophy, 
  Ban, 
  Coins, 
  ShieldCheck, 
  ShieldAlert 
} from 'lucide-react';
import Image from 'next/image';

export function Rewards() {
  const benefits = [
    { icon: QrCode, title: 'Secret Engraving', desc: 'Unique recovery code per paid device' },
    { icon: ArrowRightLeft, title: 'Ownership Transfer', desc: 'Token-based secure transfer' },
    { icon: Trophy, title: 'Reward System', desc: 'Offer rewards for community recovery' },
    { icon: Ban, title: 'Blacklist / Unblacklist', desc: 'Real-time stolen device flagging' },
    { icon: Coins, title: 'Theft Compensation', desc: 'Up to 80% of device value' },
  ];

  return (
    <section className="py-24 bg-slate-900 border-t border-slate-800 relative overflow-hidden">
      <div className="absolute inset-0 z-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-sky-600/20 blur-[120px] rounded-full pointer-events-none" />
      </div>

      <div className="w-full px-6 md:px-12 lg:px-20 relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-xl bg-slate-800 border border-slate-700 text-sky-400 text-sm font-medium mb-6">
              <Crown className="w-4 h-4" /> Premium Protection
            </div>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-slate-50 mb-6">
              Be the +1 to Protected<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-sky-600 border-b-2 border-sky-500/30">Device Owners</span>
            </h2>

            <div className="space-y-6 mb-10">
              {benefits.map((benefit, i) => (
                <div key={i} className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center flex-shrink-0 text-sky-500">
                    <benefit.icon className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-slate-50 font-semibold mb-1">{benefit.title}</h3>
                    <p className="text-slate-400 text-sm leading-relaxed">{benefit.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <button suppressHydrationWarning className="flex items-center gap-2 bg-sky-700 hover:bg-sky-600 text-white px-8 py-4 rounded-2xl text-base font-semibold transition-all hover:scale-105 active:scale-95 shadow-xl shadow-sky-900/20">
              Explore Premium Plans <ArrowRight className="w-5 h-5" />
            </button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="flex justify-center relative p-12"
          >
             {/* Decorative Background Elements */}
             <div className="absolute inset-0 bg-sky-500/10 rounded-full blur-[100px] -z-10" />
             
             {/* Premium Card Mockup */}
             <div className="relative w-full max-w-sm aspect-[1.6/1] bg-slate-900 rounded-[2rem] border border-slate-800 shadow-2xl overflow-hidden group">
                {/* Glossy Overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-transparent z-10 pointer-events-none" />
                
                {/* Content */}
                <div className="relative z-20 p-8 h-full flex flex-col justify-between">
                   <div className="flex justify-between items-start">
                      <div className="w-12 h-12 rounded-xl bg-sky-600/20 border border-sky-500/30 flex items-center justify-center text-sky-400">
                         <ShieldCheck className="w-7 h-7" />
                      </div>
                      <div className="flex flex-col items-end">
                         <span className="text-[10px] font-bold text-sky-500 uppercase tracking-widest mb-1">Status</span>
                         <div className="flex items-center gap-2 bg-emerald-500/20 text-emerald-400 px-3 py-1 rounded-xl text-xs font-bold ring-1 ring-emerald-500/30">
                            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                            SECURED
                         </div>
                      </div>
                   </div>

                   <div className="space-y-1">
                      <p className="text-slate-500 text-xs font-bold uppercase tracking-widest">Ownership Token</p>
                      <h4 className="text-2xl font-mono font-black text-slate-100 tracking-tight">ESH-PRE-00249</h4>
                   </div>

                   <div className="flex justify-between items-center pt-6 border-t border-slate-800/50">
                      <div>
                         <p className="text-[10px] text-slate-500 font-bold uppercase mb-0.5">Coverage</p>
                         <p className="text-sm font-bold text-slate-300">National Protection</p>
                      </div>
                      <div className="text-right">
                         <p className="text-[10px] text-slate-500 font-bold uppercase mb-0.5">Tier</p>
                         <p className="text-sm font-bold text-sky-400">PLATINUM</p>
                      </div>
                   </div>
                </div>

                {/* Animated Scanning Line */}
                <motion.div 
                  animate={{ top: ['0%', '100%', '0%'] }}
                  transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
                  className="absolute left-0 right-0 h-[2px] bg-sky-500/30 shadow-[0_0_15px_rgba(14,165,233,0.5)] z-30"
                />
             </div>

             {/* Floating Badge */}
             <motion.div 
               animate={{ y: [0, -10, 0] }}
               transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
               className="absolute -top-4 -right-4 bg-slate-800 border border-slate-700 rounded-2xl p-4 shadow-xl z-40"
             >
                <div className="flex items-center gap-3">
                   <div className="w-10 h-10 rounded-xl bg-sky-500 flex items-center justify-center text-white">
                      <QrCode className="w-6 h-6" />
                   </div>
                   <div>
                      <p className="text-[10px] font-bold text-slate-500 uppercase">Verification</p>
                      <p className="text-sm font-bold text-slate-200">Instant Scan</p>
                   </div>
                </div>
             </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
