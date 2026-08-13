'use client';
import { motion } from 'motion/react';

export function Stats() {
  const stats = [
    { value: '25K+', label: 'Recovered', color: 'text-sky-600 dark:text-sky-400' },
    { value: '1.2M+', label: 'Total Devices', color: 'text-indigo-600 dark:text-indigo-400' },
    { value: '850K+', label: 'Active Users', color: 'text-sky-700 dark:text-sky-400' },
    { value: '89%', label: 'Recovery Rate', color: 'text-sky-600 dark:text-sky-400' },
  ];

  return (
    <div className="bg-slate-50/50 dark:bg-slate-950 border-t border-slate-200 dark:border-slate-900 py-8 md:py-12 relative z-20 transition-colors">
      <div className="max-w-[1920px] mx-auto px-4 sm:px-12 lg:px-20">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 max-w-4xl mx-auto"
        >
          {stats.map((stat, i) => (
            <div key={i} className="text-center p-4 md:p-6 rounded-2xl md:rounded-3xl bg-white/60 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm dark:shadow-none hover:shadow-md transition-shadow backdrop-blur-sm">
              <div className={`text-2xl md:text-4xl font-black mb-1 md:mb-2 tracking-tight ${stat.color}`}>
                {stat.value}
              </div>
              <div className="text-[8px] md:text-xs font-black text-slate-600 dark:text-slate-400 uppercase tracking-widest leading-none">
                {stat.label}
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
