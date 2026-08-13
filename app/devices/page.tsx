'use client';
import { motion, AnimatePresence } from "motion/react";
import { 
  Smartphone, Plus, Search, Filter, ShieldCheck, 
  ChevronRight, ArrowUpRight, ShieldAlert, Laptop, 
  Tablet, Watch, MoreVertical, Settings, History,
  AlertTriangle, XCircle, Shield
} from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { useAuth } from "@/components/auth-provider";
import Link from "next/link";
import React, { useState } from "react";

const MOCK_DEVICES = [
  { id: '1', name: 'iPhone 15 Pro', brand: 'Apple', serial: 'S/N: 23948203', status: 'secured', type: 'Phone', lastSync: '2m ago' },
  { id: '2', name: 'MacBook Pro M3', brand: 'Apple', serial: 'S/N: 92834722', status: 'secured', type: 'Laptop', lastSync: '1h ago' },
  { id: '3', name: 'Galaxy Tab S9', brand: 'Samsung', serial: 'S/N: 11223344', status: 'caution', type: 'Tablet', lastSync: '3d ago' },
  { id: '4', name: 'Pixel Watch 2', brand: 'Google', serial: 'S/N: 55667788', status: 'lost', type: 'Watch', lastSync: 'Never' },
];

const getStatusConfig = (status: string) => {
  switch (status) {
    case 'secured':
      return {
        bg: 'bg-emerald-500/10',
        text: 'text-emerald-500',
        border: 'border-emerald-500/20',
        icon: ShieldCheck,
        label: 'Secured'
      };
    case 'caution':
      return {
        bg: 'bg-amber-500/10',
        text: 'text-amber-500',
        border: 'border-amber-500/20',
        icon: AlertTriangle,
        label: 'Caution'
      };
    case 'lost':
      return {
        bg: 'bg-rose-500/10',
        text: 'text-rose-500',
        border: 'border-rose-500/20',
        icon: XCircle,
        label: 'Lost'
      };
    default:
      return {
        bg: 'bg-slate-500/10',
        text: 'text-slate-500',
        border: 'border-slate-500/20',
        icon: Shield,
        label: 'Unknown'
      };
  }
};

export default function DevicesPage() {
  const { user, loading } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");

  if (loading || !user) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center">
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-12 h-12 border-4 border-sky-500 border-t-transparent rounded-full"
        />
      </div>
    );
  }

  // Get user's assigned colors
  const { text, bg, border, primary } = user.color;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#020617] selection:bg-sky-500/30 overflow-x-hidden relative">
      {/* Dynamic Background Elements */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <motion.div 
          animate={{ 
            x: [0, 100, 0], 
            y: [0, -50, 0],
            scale: [1, 1.2, 1]
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className={`absolute -top-24 -left-24 w-96 h-96 bg-${primary}-500/10 blur-[120px] rounded-full`} 
        />
        <motion.div 
          animate={{ 
            x: [0, -80, 0], 
            y: [0, 120, 0],
            scale: [1, 1.1, 1]
          }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          className="absolute top-1/2 -right-24 w-[30rem] h-[30rem] bg-indigo-500/5 blur-[150px] rounded-full" 
        />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-20" />
      </div>

      <Navbar />

      <section className="relative z-10 pt-28 md:pt-40 pb-16 md:pb-20 px-4 sm:px-6 md:px-12 lg:px-20 w-full">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 md:gap-12 mb-12 md:mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4 md:space-y-6"
          >
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className={`inline-flex items-center gap-2.5 px-3 py-1 md:px-4 md:py-1.5 rounded-full ${bg} ${text} ${border} border backdrop-blur-md text-[9px] md:text-[10px] font-black uppercase tracking-[0.3em] shadow-lg shadow-${primary}-500/5`}
            >
              <ShieldCheck className="w-3.5 md:w-4 h-3.5 md:h-4" /> Registry Protocol Active
            </motion.div>
            <h1 className="text-4xl md:text-7xl font-black text-slate-900 dark:text-white tracking-tighter leading-tight md:leading-[0.9]">
              Asset <br />
              <span className={`text-transparent bg-clip-text bg-gradient-to-r from-${primary}-500 via-${primary}-400 to-indigo-500 uppercase`}>Intelligence.</span>
            </h1>
            <p className="text-slate-600 dark:text-slate-300 font-medium text-lg md:text-xl max-w-lg leading-relaxed">
              Real-time synchronization and security management for your high-value digital and physical assets.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-3 md:gap-4"
          >
            <button className="flex items-center justify-center gap-3 px-6 md:px-8 py-4 md:py-5 bg-white/60 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl md:rounded-2xl text-slate-900 dark:text-white font-black text-[10px] md:text-xs uppercase tracking-widest hover:bg-white dark:hover:bg-white/10 transition-all hover:scale-[1.02] active:scale-95 shadow-xl shadow-black/5 backdrop-blur-sm">
              <History className="w-4 h-4" /> Sync History
            </button>
            <button className={`flex items-center justify-center gap-3 px-8 md:px-10 py-4 md:py-5 bg-${primary}-600 text-white rounded-xl md:rounded-2xl font-black text-[10px] md:text-xs uppercase tracking-widest hover:bg-${primary}-500 shadow-2xl shadow-${primary}-500/30 transition-all group hover:scale-[1.02] active:scale-95`}>
              <Plus className="w-4 h-4 group-hover:rotate-90 transition-transform duration-500" /> New Registry
            </button>
          </motion.div>
        </div>

        {/* Dashboard Header Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-8 mb-12 md:mb-16">
           {[
             { label: "Active Assets", value: "08", subLabel: "Secured", icon: ShieldCheck, color: primary },
             { label: "Storage Used", value: "24%", subLabel: "1.2GB/5GB", icon: Settings, color: "indigo" },
             { label: "Security Score", value: "98", subLabel: "Excellent", icon: ShieldCheck, color: "emerald" },
           ].map((stat, i) => (
             <motion.div
               key={i}
               initial={{ opacity: 0, y: 30 }}
               animate={{ opacity: 1, y: 0 }}
               transition={{ delay: 0.4 + (i * 0.1) }}
               className="p-6 md:p-10 rounded-2xl md:rounded-[3rem] bg-white/60 dark:bg-white/[0.02] border-2 border-transparent hover:border-sky-500/30 transition-all duration-500 shadow-2xl shadow-black/5 overflow-hidden relative group backdrop-blur-xl"
             >
                <div className={`absolute -right-8 -bottom-8 w-24 md:w-32 h-24 md:h-32 rounded-full bg-${stat.color}-500/5 group-hover:scale-[2] transition-transform duration-700 blur-2xl`} />
                <div className="relative z-10 flex flex-col gap-4 md:gap-6">
                   <div className="flex items-center justify-between">
                      <div className={`w-12 md:w-14 h-12 md:h-14 rounded-xl md:rounded-2xl bg-${stat.color}-500/10 flex items-center justify-center text-${stat.color}-600 dark:text-${stat.color}-400 group-hover:scale-110 transition-transform group-hover:bg-${stat.color}-500/20 shadow-inner`}>
                        <stat.icon className="w-6 md:w-7 h-6 md:h-7" />
                      </div>
                      <ArrowUpRight className="w-5 md:w-6 h-5 md:h-6 text-slate-300 group-hover:text-slate-900 dark:group-hover:text-white transition-all group-hover:translate-x-1 group-hover:-translate-y-1" />
                   </div>
                   <div>
                      <h3 className="text-[9px] md:text-[11px] font-black uppercase tracking-[0.3em] md:tracking-[0.4em] text-slate-500 dark:text-slate-400 mb-1 md:mb-2">{stat.label}</h3>
                      <div className="flex items-baseline gap-2 md:gap-3">
                        <span className="text-3xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tighter">{stat.value}</span>
                        <span className={`text-[9px] md:text-[11px] font-bold text-${stat.color}-600 dark:text-${stat.color}-400 uppercase tracking-widest`}>{stat.subLabel}</span>
                      </div>
                   </div>
                </div>
             </motion.div>
           ))}
        </div>

        {/* Device Control Panel */}
        <div className="bg-white/60 dark:bg-white/[0.01] border-2 border-slate-100 dark:border-transparent hover:border-sky-500/10 transition-all duration-500 rounded-[2rem] md:rounded-[3.5rem] shadow-2xl overflow-hidden backdrop-blur-3xl relative">
           <div className="absolute inset-0 bg-gradient-to-br from-white/40 to-transparent dark:from-white/5 pointer-events-none" />
           
           <div className="p-6 md:p-10 border-b border-slate-200 dark:border-white/5 flex flex-col lg:flex-row lg:items-center justify-between gap-6 md:gap-8 relative z-10">
              <div className="relative w-full lg:w-[32rem] group">
                <Search className="absolute left-5 md:left-6 top-1/2 -translate-y-1/2 w-5 md:w-6 h-5 md:h-6 text-slate-500 group-focus-within:text-sky-500 transition-colors" />
                <input 
                  type="text" 
                  placeholder="Search registered assets..." 
                  className="w-full pl-14 md:pl-16 pr-8 py-4 md:py-5 bg-white/60 dark:bg-black/20 border-2 border-transparent focus:border-sky-500/30 focus:bg-white dark:focus:bg-black/40 rounded-xl md:rounded-[2rem] text-xs md:text-sm font-bold text-slate-900 dark:text-white transition-all outline-none shadow-inner"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              
              <div className="flex flex-wrap items-center gap-3 md:gap-4 w-full lg:w-auto">
                 <button className="flex-1 lg:flex-none flex items-center justify-center gap-2 md:gap-3 px-6 md:px-8 py-3 md:py-4 bg-white/50 dark:bg-white/5 rounded-xl md:rounded-[1.5rem] text-slate-600 dark:text-slate-400 font-bold text-[10px] md:text-xs uppercase tracking-widest border border-slate-200 dark:border-white/10 hover:bg-white dark:hover:bg-white/10 transition-all active:scale-95 shadow-sm">
                    <Filter className="w-4 md:w-5 h-4 md:h-5" /> Filter
                 </button>
                 <button className="flex-1 lg:flex-none flex items-center justify-center gap-2 md:gap-3 px-6 md:px-8 py-3 md:py-4 bg-white/50 dark:bg-white/5 rounded-xl md:rounded-[1.5rem] text-slate-600 dark:text-slate-400 font-bold text-[10px] md:text-xs uppercase tracking-widest border border-slate-200 dark:border-white/10 hover:bg-white dark:hover:bg-white/10 transition-all active:scale-95 shadow-sm">
                    All <ChevronRight className="w-4 md:w-5 h-4 md:h-5 rotate-90" />
                 </button>
              </div>
           </div>

           <div className="p-4 md:p-8 lg:p-12 relative z-10">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                <AnimatePresence mode="popLayout">
                  {MOCK_DEVICES.filter(d => d.name.toLowerCase().includes(searchTerm.toLowerCase())).map((device, i) => (
                    <motion.div
                      layout
                      key={device.id}
                      initial={{ opacity: 0, scale: 0.9, y: 20 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.9, y: 20 }}
                      transition={{ duration: 0.5, delay: i * 0.05 }}
                      className="group"
                    >
                      <Link href={`/devices/${device.id}`}>
                        <div className="p-6 md:p-10 rounded-2xl md:rounded-[3rem] bg-white/60 dark:bg-black/20 border-2 border-transparent hover:border-sky-500/30 hover:bg-white dark:hover:bg-white/5 transition-all duration-500 relative flex flex-col gap-6 md:gap-10 overflow-hidden shadow-sm hover:shadow-2xl hover:shadow-sky-500/10 h-full group/card backdrop-blur-sm shadow-xl shadow-black/5">
                          {/* Inner decorative light */}
                          <div className={`absolute top-0 right-0 w-32 md:w-48 h-32 md:h-48 bg-${primary}-500/5 blur-3xl rounded-full opacity-0 group-hover/card:opacity-100 transition-opacity duration-700 translate-x-10 -translate-y-10`} />

                          <div className="flex items-start justify-between relative z-10">
                            <div className="flex items-center gap-4 md:gap-6">
                              <div className={`w-14 h-14 md:w-20 md:h-20 rounded-xl md:rounded-[2rem] bg-white dark:bg-white/10 flex items-center justify-center shadow-xl border border-slate-100 dark:border-white/5 group-hover/card:scale-110 group-hover/card:-translate-y-2 transition-all duration-500 group-hover/card:shadow-sky-500/10 shrink-0`}>
                                {device.type === 'Phone' && <Smartphone className="w-7 md:w-10 h-7 md:h-10 text-sky-500" />}
                                {device.type === 'Laptop' && <Laptop className="w-7 md:w-10 h-7 md:h-10 text-indigo-500" />}
                                {device.type === 'Tablet' && <Tablet className="w-7 md:w-10 h-7 md:h-10 text-purple-500" />}
                                {device.type === 'Watch' && <Watch className="w-7 md:w-10 h-7 md:h-10 text-rose-500" />}
                              </div>
                              <div className="min-w-0">
                                <div className="flex flex-wrap items-center gap-2 mb-1 md:mb-1.5">
                                  <h3 className="text-xl md:text-2xl font-black text-slate-900 dark:text-white tracking-tight group-hover/card:text-sky-600 transition-colors truncate uppercase">
                                    {device.name}
                                  </h3>
                                  {(() => {
                                    const config = getStatusConfig(device.status);
                                    const StatusIcon = config.icon;
                                    return (
                                      <div className={`flex items-center gap-1.5 px-2 px-2.5 py-0.5 rounded-full ${config.bg} ${config.text} ${config.border} border text-[8px] md:text-[9px] font-black uppercase tracking-widest shadow-sm`}>
                                        <StatusIcon className="w-2.5 md:w-3 h-2.5 md:h-3" />
                                        {config.label}
                                      </div>
                                    );
                                  })()}
                                </div>
                                <div className="flex items-center gap-2 md:gap-4 overflow-hidden">
                                  <span className="text-[9px] md:text-[11px] uppercase font-black tracking-widest text-slate-500 group-hover/card:text-slate-700 dark:group-hover:text-slate-300 transition-colors truncate">{device.brand}</span>
                                  <span className="w-1 h-1 rounded-full bg-slate-300 shrink-0" />
                                  <span className="text-[9px] md:text-[11px] uppercase font-black tracking-widest text-slate-500 group-hover/card:text-slate-700 dark:group-hover:text-slate-300 transition-colors truncate">{device.serial}</span>
                                </div>
                              </div>
                            </div>
                            
                            <button className="w-10 h-10 md:w-12 md:h-12 rounded-xl md:rounded-2xl hover:bg-slate-100 dark:hover:bg-white/10 flex items-center justify-center text-slate-400 hover:text-slate-900 dark:hover:text-white transition-all shadow-sm shrink-0">
                               <MoreVertical className="w-5 md:w-6 h-5 md:h-6" />
                            </button>
                          </div>

                          <div className="flex flex-col sm:flex-row sm:items-center justify-between relative z-10 pt-6 md:pt-8 border-t border-slate-100 dark:border-white/5 mt-auto gap-4 md:gap-0">
                             <div className="flex items-center gap-4 md:gap-8">
                                <div className="flex flex-col gap-1 md:gap-1.5">
                                   <span className="text-[8px] md:text-[10px] uppercase font-black tracking-widest text-slate-500">Security State</span>
                                   {(() => {
                                      const config = getStatusConfig(device.status);
                                      return (
                                        <div className={`flex items-center gap-2 px-2 md:px-3 py-1 rounded-full ${config.bg} border border-transparent group-hover/card:border-current transition-colors w-fit`}>
                                           <div className={`w-2 md:w-2.5 h-2 md:h-2.5 rounded-full ${device.status === 'secured' ? 'bg-emerald-500' : device.status === 'caution' ? 'bg-amber-500' : 'bg-rose-500'} animate-pulse shadow-sm shadow-current`} />
                                           <span className={`text-[8px] md:text-[10px] font-black uppercase tracking-widest ${config.text}`}>
                                             {config.label}
                                           </span>
                                        </div>
                                      );
                                   })()}
                                </div>
                                <div className="flex flex-col gap-1 md:gap-1.5 px-4 md:px-6 border-l border-slate-100 dark:border-white/5">
                                   <span className="text-[8px] md:text-[10px] uppercase font-black tracking-widest text-slate-500">Last Sync</span>
                                   <span className="text-[10px] md:text-[11px] uppercase font-black tracking-widest text-slate-900 dark:text-white group-hover/card:text-sky-600 transition-colors">{device.lastSync}</span>
                                </div>
                             </div>

                             <div className="flex items-center gap-2 md:gap-3 group/btn self-end sm:self-auto">
                                <span className={`text-[8px] md:text-[10px] uppercase font-black tracking-widest text-slate-500 group-hover/btn:text-sky-600 transition-colors`}>Inspect Detail</span>
                                <div className={`w-10 h-10 md:w-12 md:h-12 rounded-xl md:rounded-2xl bg-white dark:bg-white/5 shadow-lg flex items-center justify-center text-slate-400 group-hover/btn:bg-sky-600 group-hover/btn:text-white transition-all group-hover/btn:scale-110 group-hover/btn:shadow-sky-600/30`}>
                                   <ChevronRight className="w-4 md:w-5 h-4 md:h-5" />
                                </div>
                             </div>
                          </div>

                          {/* Animated bottom progress bar decoration */}
                          <div className={`absolute bottom-0 left-0 h-1 bg-gradient-to-r from-transparent via-${primary}-500 to-transparent w-full opacity-0 group-hover/card:opacity-100 transition-all duration-700 translate-y-1 group-hover/card:translate-y-0`} />
                        </div>
                      </Link>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>

              {MOCK_DEVICES.filter(d => d.name.toLowerCase().includes(searchTerm.toLowerCase())).length === 0 && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="py-40 text-center"
                >
                   <div className="w-32 h-32 rounded-[3rem] bg-slate-50 dark:bg-white/5 flex items-center justify-center mx-auto mb-8 shadow-inner shadow-black/5">
                      <ShieldAlert className="w-12 h-12 text-slate-300 animate-bounce" />
                   </div>
                   <h3 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight mb-3">Target asset not located.</h3>
                   <p className="text-slate-500 dark:text-slate-400 text-lg font-medium mb-10 max-w-md mx-auto">The search criteria provided does not match any records in the secure vault.</p>
                   <button 
                     onClick={() => setSearchTerm("")}
                     className="px-12 py-5 rounded-2xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-black text-xs uppercase tracking-[0.2em] hover:scale-105 active:scale-95 transition-all shadow-2xl"
                   >
                     Reset Registry View
                   </button>
                </motion.div>
              )}
           </div>
        </div>
      </section>


      <Footer />
    </div>
  );
}
