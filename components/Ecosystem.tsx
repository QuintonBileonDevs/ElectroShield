'use client';
import { motion, AnimatePresence } from 'motion/react';
import { useState } from 'react';
import { 
  Users, Briefcase, Landmark, Wrench, User, ShoppingBag, 
  Building, FileText, Code, Scale, School, Recycle, 
  Radio, Coins, Layers, ChevronRight
} from 'lucide-react';
import Link from 'next/link';

// Using simplified data structure based on the PDF
const ecosystemData = {
  public: {
    title: "For Public",
    icon: Users,
    activeColor: 'text-[#99C24D]',
    activeBg: 'bg-[#99C24D] text-white shadow-[#99C24D]/20',
    items: [
      { slug: "individuals", icon: User, title: "Individual", desc: "Register personal assets, report loss, and secure ownership certificates.", badge: "Free Plan", gradient: "from-indigo-500 to-indigo-600" },
      { slug: "families", icon: Users, title: "Family", desc: "Manage all household devices under one secure family umbrella.", badge: "Up to 10 Devices", gradient: "from-violet-500 to-violet-600" }
    ]
  },
  business: {
    title: "For Business",
    icon: Briefcase,
    activeColor: 'text-[#EE6C4D]',
    activeBg: 'bg-[#EE6C4D] text-white shadow-[#EE6C4D]/20',
    items: [
      { slug: "retailers", icon: ShoppingBag, title: "Retailer", desc: "Pre-register stock and transfer ownership instantly at point of sale.", badge: "API Ready", gradient: "from-emerald-500 to-emerald-600" },
      { slug: "enterprises", icon: Building, title: "Enterprise", desc: "Fleet management for corporate assets with full audit trails.", badge: "Corporate", gradient: "from-blue-500 to-blue-600" },
      { slug: "insurance", icon: FileText, title: "Insurance", desc: "Verify claims instantly and reduce fraud with real-time status data.", badge: "Fraud Prevention", gradient: "from-sky-500 to-sky-600" },
      { slug: "developers", icon: Code, title: "Developer", desc: "Build custom integrations using our robust API and webhooks.", badge: "API Access", gradient: "from-purple-500 to-purple-600" }
    ]
  },
  government: {
    title: "For Government",
    icon: Landmark,
    activeColor: 'text-[#561D25] dark:text-[#993341]',
    activeBg: 'bg-[#561D25] dark:bg-[#993341] text-white shadow-[#561D25]/20 dark:shadow-[#993341]/20',
    items: [
      { slug: "burs", icon: Landmark, title: "BURS", desc: "Track device movements across borders to prevent illegal trade.", badge: "Cross-border", gradient: "from-orange-500 to-orange-600" },
      { slug: "police", icon: Scale, title: "Police", desc: "Real-time search and recovery tools for police agencies.", badge: "Investigations", gradient: "from-rose-500 to-rose-600" }
    ]
  },
  services: {
    title: "For Services",
    icon: Wrench,
    activeColor: 'text-[#FFBA49]',
    activeBg: 'bg-[#FFBA49] text-white shadow-[#FFBA49]/20',
    items: [
      { slug: "academic-institutions", icon: School, title: "Academic Institutions", desc: "Asset tracking for educational devices and student equipment.", badge: "Education", gradient: "from-yellow-400 to-yellow-500" },
      { slug: "ewaste", icon: Recycle, title: "E-Waste Partners", desc: "Track end-of-life disposal and ensure environmentally safe recycling.", badge: "Eco Friendly", gradient: "from-green-500 to-green-600" },
      { slug: "repair-centers", icon: Wrench, title: "Repair Centers", desc: "Log service history and verify ownership before performing repairs.", badge: "Service Center", gradient: "from-amber-500 to-amber-600" },
      { slug: "mno", icon: Radio, title: "MNOs", desc: "Network-level IMEI blocking and unblocking for stolen devices.", badge: "Telecom", gradient: "from-cyan-500 to-cyan-600" },
      { slug: "pawn-shops", icon: Coins, title: "Pawn Shops", desc: "Verify device ownership before accepting items.", badge: "Compliance", gradient: "from-teal-500 to-teal-600" }
    ]
  }
};

type EcosystemKey = keyof typeof ecosystemData;

export function Ecosystem() {
  const [activeTab, setActiveTab] = useState<EcosystemKey>('public');
  const activeEcosystem = ecosystemData[activeTab];

  return (
    <section className="py-20 md:py-24 bg-slate-50/50 dark:bg-slate-950 relative overflow-hidden transition-colors">
      <div className="absolute top-0 right-0 -translate-y-12 translate-x-1/3">
        <div className="w-[800px] h-[800px] rounded-full bg-slate-100 dark:bg-slate-900/50 blur-3xl opacity-50 pointer-events-none" />
      </div>

      <div className="w-full px-4 sm:px-6 md:px-12 lg:px-20 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-12 md:mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-xl bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-[10px] md:text-sm font-black uppercase tracking-widest mb-6 border border-slate-200 dark:border-white/5 shadow-sm">
            <Layers className="w-3.5 md:w-4 h-3.5 md:h-4" /> Unified Ecosystem
          </div>
          <h2 className="text-3xl md:text-5xl lg:text-6xl font-black tracking-tight text-slate-900 dark:text-slate-50 mb-6 transition-colors duration-300 uppercase">
            A dashboard for each <span className={ecosystemData[activeTab].activeColor}>use case</span>
          </h2>
          <p className="text-lg text-slate-600 dark:text-slate-400 font-medium leading-relaxed">
            One powerful platform connecting every stakeholder in the device lifecycle.
          </p>
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap justify-center gap-3 md:gap-4 mb-12">
          {(Object.keys(ecosystemData) as EcosystemKey[]).map((key) => {
            const Icon = ecosystemData[key].icon;
            const tabColor = ecosystemData[key].activeColor;
            const tabBg = ecosystemData[key].activeBg;
            const isActive = activeTab === key;
            return (
              <button suppressHydrationWarning
                key={key}
                onClick={() => setActiveTab(key)}
                className={`flex items-center gap-2 px-4 md:px-6 py-2.5 md:py-3 rounded-xl text-[10px] md:text-xs font-black uppercase tracking-widest transition-all duration-300 ${
                  isActive 
                    ? tabBg + ' shadow-xl'
                    : 'bg-white/60 dark:bg-slate-950 border-2 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-slate-300 dark:hover:border-slate-600 hover:text-slate-900 dark:hover:text-slate-50 backdrop-blur-sm'
                }`}
              >
                <Icon className={`w-4 md:w-5 h-4 md:h-5 ${isActive ? 'text-white' : tabColor}`} />
                {ecosystemData[key].title}
              </button>
            )
          })}
        </div>

        {/* Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6"
          >
            {activeEcosystem.items.map((item, idx) => (
              <Link key={item.slug} href={`/ecosystem/${item.slug}`} className="block h-full">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                  whileHover={{ y: -8 }}
                  className="group relative h-full bg-white/60 dark:bg-slate-900/40 backdrop-blur-xl border border-slate-200 dark:border-white/5 rounded-[2rem] p-6 md:p-8 hover:shadow-[0_0_50px_-12px_rgba(14,165,233,0.2)] dark:hover:border-sky-500/50 transition-all duration-700 overflow-hidden"
                >
                  {/* Neural Link Background Pattern */}
                  <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.07] pointer-events-none" 
                       style={{ backgroundImage: 'radial-gradient(circle, currentColor 1px, transparent 1px)', backgroundSize: '24px 24px' }} />
                  
                  {/* Advanced Multi-layered Glow */}
                  <div className={`absolute -top-32 -right-32 w-64 h-64 bg-gradient-to-br ${item.gradient} opacity-0 group-hover:opacity-20 blur-[100px] transition-all duration-1000 group-hover:scale-150`} />
                  <div className={`absolute -bottom-32 -left-32 w-64 h-64 bg-gradient-to-tr ${item.gradient} opacity-0 group-hover:opacity-10 blur-[100px] transition-all duration-1000 group-hover:scale-150`} />

                  {/* Cyber Border Accent - Top Right */}
                  <div className="absolute top-0 right-0 w-24 h-24 overflow-hidden pointer-events-none">
                    <div className={`absolute top-6 right-6 w-12 h-[2px] bg-gradient-to-l from-current to-transparent opacity-0 group-hover:opacity-100 transition-all duration-700 ${item.gradient.split(' ')[1].replace('to-', 'text-')}`} />
                    <div className={`absolute top-6 right-6 w-[2px] h-12 bg-gradient-to-t from-current to-transparent opacity-0 group-hover:opacity-100 transition-all duration-700 ${item.gradient.split(' ')[1].replace('to-', 'text-')}`} />
                  </div>
                  
                  <div className="flex flex-col h-full relative z-10">
                    <div className="flex items-start justify-between mb-6 md:mb-8">
                      <div className="relative">
                        {/* Mechanical Orbital Effect */}
                        <div className={`absolute -inset-6 rounded-full border border-dashed border-sky-500/0 group-hover:border-sky-500/20 group-hover:rotate-[120deg] transition-all duration-[3000ms] ease-linear pointer-events-none`} />
                        <div className={`absolute -inset-4 rounded-full border border-sky-500/0 group-hover:border-sky-500/40 group-hover:scale-110 transition-all duration-700 ease-out pointer-events-none`} />
                        
                        {/* Main icon container */}
                        <div className={`w-12 h-12 md:w-16 md:h-16 rounded-xl md:rounded-2xl bg-gradient-to-br flex-shrink-0 ${item.gradient} shadow-2xl shadow-current flex items-center justify-center relative z-10 transform group-hover:translate-z-10 group-hover:-rotate-6 transition-all duration-500 overflow-hidden`}>
                          <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                          <div className="absolute inset-[2px] rounded-[0.9rem] bg-black/10 backdrop-blur-sm" />
                          <item.icon className="w-6 md:w-8 h-6 md:h-8 text-white relative z-20 drop-shadow-lg" />
                        </div>

                        {/* Pulse indicator */}
                        <div className="absolute -top-1 -left-1 w-2.5 h-2.5 md:w-3 md:h-3 bg-emerald-500 rounded-full border-2 border-white dark:border-slate-950 z-30 animate-pulse" />
                      </div>
                      
                      {item.badge && (
                        <span className={`text-[8px] md:text-[9px] px-2 md:px-2.5 py-0.5 md:py-1 rounded-lg font-black uppercase tracking-widest bg-white dark:bg-slate-900 text-slate-500 dark:text-slate-400 border border-slate-100 dark:border-slate-800 shadow-sm group-hover:border-sky-500/30 transition-all`}>
                          {item.badge}
                        </span>
                      )}
                    </div>

                    <div className="flex-1">
                      <div className="flex items-center gap-2 md:gap-3 mb-3">
                        <div className="h-[1px] w-4 md:w-6 bg-sky-500/50" />
                        <span className="text-[8px] md:text-[9px] font-black text-sky-500 uppercase tracking-widest leading-none">Protocol {idx.toString().padStart(2, '0')}</span>
                      </div>
                      <h3 className="text-lg md:text-2xl font-black text-slate-900 dark:text-slate-50 mb-2 tracking-tight group-hover:text-sky-600 dark:group-hover:text-sky-400 transition-colors uppercase">
                        {item.title}
                      </h3>
                      <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-xs md:text-sm font-medium opacity-90 group-hover:opacity-100 transition-opacity">
                        {item.desc}
                      </p>
                    </div>
                    
                    <div className="flex items-center justify-between pt-4 md:pt-6 mt-6 md:mt-8 border-t border-slate-100 dark:border-white/5">
                      <span className="text-[8px] md:text-[10px] font-black text-slate-400 dark:text-slate-500 group-hover:text-sky-600 dark:group-hover:text-sky-400 uppercase tracking-[0.2em] transition-colors leading-none">
                        Access Portal
                      </span>
                      <div className="relative">
                        <div className="absolute inset-0 bg-sky-500 blur-lg opacity-0 group-hover:opacity-40 transition-opacity" />
                        <div className="w-8 h-8 md:w-10 md:h-10 rounded-lg md:rounded-xl bg-white dark:bg-slate-900 flex items-center justify-center text-slate-400 dark:text-slate-500 group-hover:bg-sky-600 group-hover:text-white transition-all duration-500 transform group-hover:scale-110 shadow-lg relative z-10 overflow-hidden">
                          {/* Animated Arrow Effect */}
                          <div className="relative w-4 md:w-5 h-4 md:h-5 pointer-events-none">
                            <ChevronRight className="w-4 md:w-5 h-4 md:h-5 absolute inset-0 transition-all duration-300 ease-out group-hover:translate-x-3 group-hover:opacity-0" />
                            <ChevronRight className="w-4 md:w-5 h-4 md:h-5 absolute inset-0 -translate-x-3 opacity-0 transition-all duration-300 ease-out delay-75 group-hover:translate-x-0 group-hover:opacity-100" />
                          </div>
                          
                          {/* Inner scanning line */}
                          <motion.div 
                            animate={{ y: ["-100%", "100%"] }}
                            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                            className="absolute inset-x-0 w-full h-[1px] bg-sky-400 opacity-0 group-hover:opacity-100"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </Link>
            ))}
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}
