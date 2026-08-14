'use client';
import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { collection, onSnapshot } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export function Stats() {
  const [deviceCount, setDeviceCount] = useState<number>(0);
  const [stolenCount, setStolenCount] = useState<number>(0);
  const [orgCount, setOrgCount] = useState<number>(0);
  const [activeRate, setActiveRate] = useState<string>('100%');

  useEffect(() => {
    const unsubDevices = onSnapshot(collection(db, "devices"), (snap) => {
      const total = snap.size;
      setDeviceCount(total);
      let stolen = 0;
      snap.forEach(d => {
        if (d.data().status === 'stolen' || d.data().status === 'flagged') {
          stolen++;
        }
      });
      setStolenCount(stolen);
      if (total > 0) {
        const cleanRate = Math.round(((total - stolen) / total) * 100);
        setActiveRate(`${cleanRate}%`);
      } else {
        setActiveRate('100%');
      }
    }, (err) => console.warn("Stats devices listener err:", err));

    const unsubOrgs = onSnapshot(collection(db, "organizations"), (snap) => {
      setOrgCount(snap.size);
    }, (err) => console.warn("Stats orgs listener err:", err));

    return () => {
      unsubDevices();
      unsubOrgs();
    };
  }, []);

  const stats = [
    { value: deviceCount > 0 ? `${deviceCount}` : '0', label: 'Registered Devices', color: 'text-sky-600 dark:text-sky-400' },
    { value: stolenCount > 0 ? `${stolenCount}` : '0', label: 'Flagged / Stolen Alerts', color: 'text-rose-600 dark:text-rose-400' },
    { value: orgCount > 0 ? `${orgCount}` : '0', label: 'Authorized Organizations', color: 'text-indigo-600 dark:text-indigo-400' },
    { value: activeRate, label: 'Registry Integrity Rate', color: 'text-emerald-600 dark:text-emerald-400' },
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
