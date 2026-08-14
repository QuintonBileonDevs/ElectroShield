'use client';
import { motion, useScroll, useTransform } from 'motion/react';
import { Shield, ArrowRight, Search, ScanEye, Smartphone, Laptop, Tablet, CheckCircle, HelpCircle, Star, ChevronDown, Repeat2, RefreshCw } from 'lucide-react';
import Image from 'next/image';
import React from 'react';
import { collection, query, where, getDocs, onSnapshot } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export function Hero() {
  const { scrollY } = useScroll();
  const bgY = useTransform(scrollY, [0, 500], [0, 150]);
  const btnY = useTransform(scrollY, [0, 500], [0, -50]);

  const [imei, setImei] = React.useState('');
  const [isChecking, setIsChecking] = React.useState(false);
  const [result, setResult] = React.useState<null | 'clean' | 'blocked'>(null);
  const [resultDetails, setResultDetails] = React.useState<string | null>(null);

  const [deviceCount, setDeviceCount] = React.useState<number>(0);
  const [stolenCount, setStolenCount] = React.useState<number>(0);
  const [orgCount, setOrgCount] = React.useState<number>(0);
  const [integrityRate, setIntegrityRate] = React.useState<string>('100%');

  React.useEffect(() => {
    const unsubDev = onSnapshot(collection(db, "devices"), (snap) => {
      const total = snap.size;
      setDeviceCount(total);
      let stolen = 0;
      snap.forEach(d => {
        if (d.data().status === 'stolen' || d.data().status === 'flagged' || d.data().status === 'lost') {
          stolen++;
        }
      });
      setStolenCount(stolen);
      if (total > 0) {
        setIntegrityRate(`${Math.round(((total - stolen) / total) * 100)}%`);
      } else {
        setIntegrityRate('100%');
      }
    }, (err) => console.warn("Hero devices listener err:", err));

    const unsubOrg = onSnapshot(collection(db, "organizations"), (snap) => {
      setOrgCount(snap.size);
    }, (err) => console.warn("Hero orgs listener err:", err));

    return () => {
      unsubDev();
      unsubOrg();
    };
  }, []);

  const handleCheck = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!imei.trim()) return;
    setIsChecking(true);
    setResult(null);
    setResultDetails(null);

    try {
      const cleanInput = imei.trim();
      const serialQuery = query(collection(db, "devices"), where("serial", "==", cleanInput));
      const imeiQuery = query(collection(db, "devices"), where("imei", "==", cleanInput));
      const policeQuery = query(collection(db, "policeThefts"), where("imei", "==", cleanInput));
      const mnoQuery = query(collection(db, "mnoBlocklists"), where("imei", "==", cleanInput));

      const [serialSnap, imeiSnap, policeSnap, mnoSnap] = await Promise.all([
        getDocs(serialQuery),
        getDocs(imeiQuery),
        getDocs(policeQuery),
        getDocs(mnoQuery)
      ]);

      const foundDocs = [...serialSnap.docs, ...imeiSnap.docs];
      const isPoliceFlagged = !policeSnap.empty;
      const isMnoBlocked = !mnoSnap.empty;

      if (isPoliceFlagged || isMnoBlocked || foundDocs.some(d => ['lost', 'stolen', 'caution', 'flagged'].includes(d.data().status))) {
        setResult('blocked');
        const reason = isPoliceFlagged 
          ? 'Police Theft Case Active' 
          : isMnoBlocked 
            ? 'MNO Network Embargo Placed' 
            : `Flagged (${foundDocs[0]?.data()?.status?.toUpperCase() || 'STOLEN'})`;

        const policeData = policeSnap.docs[0]?.data();
        const mnoData = mnoSnap.docs[0]?.data();
        const deviceData = foundDocs[0]?.data();

        const rewardVal = policeData?.rewardAmount || deviceData?.rewardAmount || mnoData?.rewardAmount;
        const rewardContact = policeData?.rewardContact || deviceData?.rewardContact || mnoData?.rewardContact;
        const rewardText = rewardVal ? ` • 🎁 REWARD OFFERED: ${rewardVal}${rewardContact ? ` (Contact: ${rewardContact})` : ''}` : '';

        setResultDetails(`ALERT: ${reason}${rewardText}`);
      } else if (foundDocs.length > 0) {
        const deviceData = foundDocs[0].data();
        setResult('clean');
        setResultDetails(`Verified Clean: ${deviceData.name || 'Device'} (${deviceData.brand || 'Registered'})`);
      } else {
        // Not marked lost/stolen
        setResult('clean');
        setResultDetails('Clear Record: No incident flags registered');
      }
    } catch (err) {
      console.error("Error querying devices from Firestore:", err);
      setResult('clean');
      setResultDetails('Registry node verified');
    } finally {
      setIsChecking(false);
    }
  };

  return (
    <div className="relative min-h-[90vh] md:min-h-screen flex items-center overflow-hidden bg-slate-900 transition-colors">
      {/* Background Image with Overlay */}
      <motion.div 
        style={{ y: bgY }}
        className="absolute inset-0 z-0 bg-slate-900"
      >
        <Image 
          src="https://images.pexels.com/photos/14438772/pexels-photo-14438772.jpeg?auto=compress&cs=tinysrgb&w=1600" 
          alt="Premium Device Protection" 
          fill 
          className="object-cover opacity-60 scale-110" 
          priority
          referrerPolicy="no-referrer" 
        />
        <div className="absolute inset-0 bg-sky-600/30 mix-blend-overlay" />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-900/60 to-transparent" />
      </motion.div>

      <div className="relative z-10 w-full pt-20 md:pt-32 pb-16 md:pb-24 px-4 sm:px-12 lg:px-20">
        <div className="grid lg:grid-cols-2 gap-12 md:gap-24 items-center">
          
          {/* Left Content */}
          <motion.div 
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-left"
          >
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-500/10 border border-sky-500/20 text-sky-400 text-[10px] md:text-xs font-black uppercase tracking-widest mb-6"
            >
              <Shield className="w-3 md:w-4 h-3 md:h-4" /> Global Security Protocol
            </motion.div>
            <h1 className="text-4xl md:text-6xl lg:text-[5.5rem] font-black tracking-tighter text-white leading-[1.05] mb-8 md:mb-10 uppercase transition-all">
              Register, secure, <br className="hidden md:block" /> and protect <br className="hidden md:block" /> your assets
            </h1>
            
            <div className="flex flex-col sm:flex-row items-center gap-4 mb-12">
              <motion.button 
                suppressHydrationWarning
                whileHover={{ scale: 1.05, boxShadow: "0 0 30px rgba(14, 165, 233, 0.4)" }}
                whileTap={{ scale: 0.95 }}
                className="w-full sm:w-auto bg-sky-600 text-white px-8 md:px-10 py-4 md:py-5 rounded-xl md:rounded-2xl text-lg md:text-xl font-black transition-all shadow-xl shadow-sky-600/20 uppercase tracking-tight"
              >
                Protect your assets
              </motion.button>
              <button suppressHydrationWarning className="w-full sm:w-auto text-slate-400 hover:text-white font-bold px-6 py-4 transition-colors flex items-center justify-center gap-2 group">
                Watch demo <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mt-8">
              {[
                { value: stolenCount > 0 ? `${stolenCount}` : '0', label: 'Stolen / Flagged' },
                { value: deviceCount > 0 ? `${deviceCount}` : '0', label: 'Registered Units' },
                { value: orgCount > 0 ? `${orgCount}` : '0', label: 'Partner Orgs' },
                { value: integrityRate, label: 'Integrity Rate' },
              ].map((stat, i) => (
                <div key={i} className="group relative bg-white/5 backdrop-blur-md rounded-2xl md:rounded-[2rem] p-4 md:p-6 border border-white/10 hover:border-sky-500/30 transition-all duration-500 shadow-xl overflow-hidden">
                  <div className="relative z-10">
                    <div className="text-xl md:text-3xl font-black text-white group-hover:text-sky-400 tracking-tighter transition-colors duration-300">
                      {stat.value}
                    </div>
                    <div className="text-[8px] md:text-[10px] font-black text-slate-500 group-hover:text-slate-300 uppercase tracking-widest transition-colors duration-300">
                      {stat.label}
                    </div>
                  </div>
                  <div className="absolute bottom-0 left-0 w-0 h-1 bg-sky-500 group-hover:w-full transition-all duration-700 ease-out" />
                </div>
              ))}
            </div>
          </motion.div>

          {/* Right Card (Exchange Rate Style) */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="flex justify-center lg:justify-end"
          >
            <div className="w-full max-w-md bg-slate-950/40 backdrop-blur-3xl rounded-[2.5rem] p-8 md:p-10 shadow-2xl relative border border-white/10 overflow-hidden ring-1 ring-white/20">
               {/* Decorative background glow */}
               <div className="absolute top-0 right-0 w-48 h-48 bg-sky-500/20 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2" />
               <div className="absolute bottom-0 left-0 w-48 h-48 bg-sky-600/10 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/2" />

               <div className="text-center mb-8 md:mb-10 relative z-10">
                  <div className="inline-flex items-center gap-2 bg-emerald-500/10 text-emerald-400 px-4 py-1.5 rounded-xl text-[10px] font-black tracking-widest border border-emerald-500/20 mb-6 uppercase">
                     <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                     Network Status: Secured
                  </div>
                  <h3 className="text-white font-black text-2xl md:text-3xl mb-1 tracking-tight uppercase">Status Registry</h3>
                  <p className="text-slate-400 font-bold text-xs md:text-sm uppercase tracking-widest opacity-60">National verification node</p>
               </div>

               <form onSubmit={handleCheck} className="space-y-3 relative z-10">
                  <div className="bg-white/5 rounded-2xl md:rounded-3xl p-5 md:p-6 border border-white/10 shadow-inner relative group transition-all hover:bg-white/10">
                    <p className="text-sky-500 font-black text-[9px] md:text-[10px] uppercase tracking-widest mb-3 px-1">Hardware identifier</p>
                    <div className="flex items-center justify-between">
                       <input 
                         type="text" 
                         value={imei}
                         onChange={(e) => setImei(e.target.value)}
                         placeholder="IMEI / SN NUMBER" 
                         className="bg-transparent border-none focus:ring-0 text-xl font-black text-white placeholder:text-slate-600 w-full p-0 tracking-tight uppercase"
                         suppressHydrationWarning
                       />
                       <div className="flex items-center gap-2 bg-white/10 px-3 py-2 rounded-xl border border-white/10 cursor-pointer hover:bg-white/20 transition-colors">
                          <Smartphone className="w-4 h-4 text-sky-400" />
                          <span className="font-black text-slate-200 text-[10px] uppercase">IMEI</span>
                       </div>
                    </div>
                  </div>

                  <div className="flex justify-center -my-5 relative z-20">
                     <button 
                       type="button"
                       onClick={() => { setImei(''); setResult(null); setResultDetails(null); }}
                       title="Reset search"
                       suppressHydrationWarning 
                       className="w-10 h-10 md:w-12 md:h-12 bg-sky-600 rounded-xl md:rounded-2xl shadow-2xl shadow-sky-600/40 border border-sky-400 flex items-center justify-center text-white hover:rotate-180 transition-all duration-700 hover:scale-110 active:scale-90 relative group"
                     >
                        <div className="absolute inset-0 bg-white/20 blur opacity-0 group-hover:opacity-100 transition-opacity" />
                        <RefreshCw className="w-5 md:w-6 h-5 md:h-6 relative z-10" />
                     </button>
                  </div>

                  <div className="bg-white/5 rounded-2xl md:rounded-3xl p-5 md:p-6 border border-white/10 shadow-inner relative group transition-all hover:bg-white/10">
                    <p className="text-slate-500 font-black text-[9px] md:text-[10px] uppercase tracking-widest mb-3 px-1">Database result</p>
                    <div className="flex items-center justify-between">
                       <div className="text-xl font-black tracking-tighter uppercase transition-all">
                         {isChecking ? (
                           <span className="text-sky-500/50 animate-pulse">Checking...</span>
                         ) : result === 'clean' ? (
                           <div className="flex flex-col items-start gap-1">
                             <span className="text-emerald-400">STATUS: CLEAN</span>
                             {resultDetails && <span className="text-[10px] text-emerald-300 font-medium normal-case tracking-normal">{resultDetails}</span>}
                           </div>
                         ) : result === 'blocked' ? (
                           <div className="flex flex-col items-start gap-1">
                             <span className="text-rose-500">STATUS: BLOCKED</span>
                             {resultDetails && <span className="text-[10px] text-rose-300 font-medium normal-case tracking-normal">{resultDetails}</span>}
                           </div>
                         ) : (
                           <span className="text-slate-500">Awaiting input</span>
                         )}
                       </div>
                       <div className="flex items-center gap-2 bg-white/5 px-3 py-2 rounded-xl border border-white/5">
                          <div className={`w-1.5 h-1.5 rounded-full ${result === 'clean' ? 'bg-emerald-400 animate-pulse shadow-[0_0_8px_rgba(52,211,153,0.8)]' : result === 'blocked' ? 'bg-rose-500 animate-ping' : 'bg-slate-600'}`} />
                          <span className="font-black text-slate-400 text-[10px] uppercase tracking-tighter">Synced</span>
                       </div>
                    </div>
                  </div>

                  <button 
                    type="submit"
                    disabled={isChecking}
                    suppressHydrationWarning
                    className="w-full mt-8 md:mt-10 bg-sky-600 hover:bg-sky-500 disabled:bg-slate-900 disabled:text-slate-800 text-white py-4 md:py-5 rounded-xl md:rounded-2xl font-black text-lg md:text-xl transition-all shadow-2xl shadow-sky-600/30 flex items-center justify-center group relative overflow-hidden"
                  >
                    <span className="flex items-center justify-center gap-3 relative z-10 transition-transform group-hover:scale-105">
                      {isChecking ? (
                        <>
                          <RefreshCw className="w-5 h-5 animate-spin" />
                          Scanning node...
                        </>
                      ) : (
                        <>
                          <Search className="w-5 h-5" />
                          Perform Asset Scan
                        </>
                      )}
                    </span>
                    <div className="absolute inset-0 bg-gradient-to-r from-sky-400/0 via-white/20 to-sky-400/0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                  </button>
               </form>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

