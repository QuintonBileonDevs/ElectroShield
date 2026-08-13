'use client';
import { motion } from 'motion/react';
import { Shield, Headphones, Lock, Infinity, ArrowRight } from 'lucide-react';

export function BottomCTA() {
  return (
    <section className="py-24 bg-sky-950 relative overflow-hidden">
      {/* Background patterns */}
      <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-[800px] h-[800px] bg-sky-800 rounded-full blur-3xl opacity-30" />
      <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-sky-900 rounded-full blur-3xl opacity-30" />
      
      <div className="w-full px-6 md:px-12 lg:px-20 relative z-10">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-xl bg-sky-800/50 text-slate-200 text-sm font-medium mb-6 backdrop-blur-sm border border-sky-500/30">
            <Shield className="w-4 h-4" />
            Keeping your devices safe
          </div>
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-slate-50 mb-6">
            Trusted by thousands
          </h2>
          <p className="text-slate-200 text-lg max-w-2xl mx-auto mb-12">
            We use advanced encryptions to safeguard your data and provide 24/7 support.
          </p>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto mb-20 text-left">
            {[
              { icon: Headphones, title: "Dedicated support", desc: "Get the answers you need anytime with our 24/7 customer support team.", gradient: "from-blue-500 to-indigo-600" },
              { icon: Lock, title: "Privacy and data", desc: "Your privacy matters. We use advanced encryptions to safeguard your data.", gradient: "from-emerald-500 to-teal-600" },
              { icon: Shield, title: "National safeguarding", desc: "Your devices are safely protected under leading defense-grade security.", gradient: "from-sky-500 to-blue-600" }
            ].map((item, i) => (
              <motion.div 
                key={i} 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ y: -5 }}
                className="group relative bg-slate-900/60 backdrop-blur-xl rounded-[2.5rem] p-8 border border-white/5 hover:border-sky-500/50 transition-all duration-500 shadow-2xl overflow-hidden"
              >
                {/* Background Glow */}
                <div className={`absolute -top-24 -right-24 w-48 h-48 bg-gradient-to-br ${item.gradient} opacity-0 group-hover:opacity-20 blur-[80px] transition-opacity duration-700`} />
                
                <div className="relative z-10">
                   <div className="relative mb-6">
                      {/* Orbital Ring */}
                      <div className={`absolute -inset-4 rounded-full border border-dashed border-sky-500/0 group-hover:border-sky-500/30 group-hover:rotate-45 transition-all duration-700 pointer-events-none`} />
                      
                      <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${item.gradient} flex items-center justify-center shadow-lg relative z-10 transform group-hover:scale-110 group-hover:-rotate-3 transition-all duration-500`}>
                        {/* Shimmer effect */}
                        <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                        <item.icon className="w-8 h-8 text-white relative z-20" />
                      </div>
                   </div>

                   <h3 className="font-black text-slate-50 text-xl mb-3 tracking-tight group-hover:text-sky-400 transition-colors">
                     {item.title}
                   </h3>
                   <p className="text-slate-400 text-base leading-relaxed font-medium group-hover:text-slate-300 transition-colors">
                     {item.desc}
                   </p>

                   {/* Bottom status indicator */}
                   <div className="mt-6 flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest group-hover:text-emerald-500 transition-colors">Operational</span>
                   </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        <div className="bg-slate-900/40 backdrop-blur-md rounded-[3rem] p-8 md:p-20 shadow-2xl relative overflow-hidden flex flex-col items-center justify-center text-center border border-white/5">
          <div className="absolute top-0 right-0 w-96 h-96 bg-sky-500/10 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-indigo-500/10 blur-[120px] rounded-full translate-y-1/2 -translate-x-1/2" />
          
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="relative z-10 w-full max-w-3xl"
          >
            <div className="relative inline-block mb-10 group">
               {/* Pulse effect */}
               <div className="absolute inset-0 bg-sky-500/20 rounded-3xl animate-ping opacity-0 group-hover:opacity-100 transition-opacity" />
               
               <div className="w-24 h-24 bg-gradient-to-br from-sky-600 to-indigo-600 rounded-[2rem] flex items-center justify-center mx-auto shadow-2xl shadow-sky-900/40 transform rotate-12 group-hover:rotate-0 transition-all duration-500 relative z-10 border border-white/20">
                  <Infinity className="w-12 h-12 text-white" />
               </div>
            </div>
            
            <h2 className="text-4xl md:text-6xl font-black tracking-tighter text-slate-50 mb-8 leading-tight">
              Join 100,000+ Protected <br className="hidden md:block" /> Device Owners
            </h2>
            <p className="text-slate-400 text-xl mb-10 max-w-xl mx-auto font-medium leading-relaxed">
              Start protecting your devices today with our free plan or upgrade to premium for complete priority security.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
             <motion.button 
               whileHover={{ scale: 1.05, boxShadow: "0 0 30px rgba(2, 132, 199, 0.4)" }}
               whileTap={{ scale: 0.98 }}
               suppressHydrationWarning 
               className="relative overflow-hidden group flex items-center justify-center gap-3 bg-sky-600 text-white px-10 py-5 rounded-[2rem] text-lg font-black tracking-tight transition-all shadow-2xl shadow-sky-900/40"
             >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                Register Free Device
                <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
             </motion.button>
             <button suppressHydrationWarning className="flex items-center justify-center gap-2 bg-transparent border-2 border-slate-700/50 hover:border-slate-500 text-slate-50 px-10 py-5 rounded-[2rem] text-lg font-black tracking-tight transition-all hover:bg-slate-800/50 hover:scale-105 active:scale-95">
               View Premium Plans
             </button>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
