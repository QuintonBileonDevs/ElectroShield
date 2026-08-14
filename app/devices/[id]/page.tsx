'use client';
import { motion, AnimatePresence } from "motion/react";
import { 
  Smartphone, ArrowLeft, ShieldCheck, History, 
  MapPin, Cpu, Battery, Signal, Lock, 
  Share2, AlertTriangle, Key, Copy, CheckCircle2,
  Clock, Users, Loader2, ChevronRight, Tablet, Laptop, Watch, MoreHorizontal
} from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { useAuth } from "@/components/auth-provider";
import Link from "next/link";
import React, { useState, useCallback, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

// Mock device data for dynamic detail view
const MOCK_DEVICES_DETAILS: Record<string, any> = {
  "1": {
    id: "1",
    name: "iPhone 15 Pro Max",
    brand: "Apple",
    model: "A3106 Titanium Natural",
    serial: "SN-84920491024",
    imei: "359284092840192",
    type: "Phone",
    status: "secured",
    battery: "94%",
    storage: "256 GB (142 GB Free)",
    purchased: "2024-03-15",
    value: "P 18,500.00",
    history: [
      { action: "Registered with ElectroShield Registry", date: "2024-03-15", by: "John Doe" },
      { action: "Security verification completed", date: "2024-03-16", by: "Automated Bot" },
      { action: "Ownership Token minted", date: "2024-04-01", by: "Registry Contract" }
    ]
  },
  "2": {
    id: "2",
    name: "MacBook Pro 16\"",
    brand: "Apple",
    model: "M3 Max 36GB Space Black",
    serial: "SN-93820194820",
    imei: "N/A (Wi-Fi Only)",
    type: "Laptop",
    status: "secured",
    battery: "98%",
    storage: "1 TB (620 GB Free)",
    purchased: "2024-01-10",
    value: "P 34,900.00",
    history: [
      { action: "Registered with ElectroShield Registry", date: "2024-01-10", by: "John Doe" }
    ]
  },
  "3": {
    id: "3",
    name: "Samsung Galaxy Tab S9",
    brand: "Samsung",
    model: "SM-X910 Graphite",
    serial: "SN-57392019482",
    imei: "358102938475619",
    type: "Tablet",
    status: "caution",
    battery: "82%",
    storage: "128 GB (40 GB Free)",
    purchased: "2023-11-20",
    value: "P 11,200.00",
    history: [
      { action: "Registered with ElectroShield Registry", date: "2023-11-20", by: "John Doe" },
      { action: "Reported missing", date: "2024-05-10", by: "John Doe" }
    ]
  }
};

export default function DeviceDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [device, setDevice] = useState<any>(null);
  const [isTransferring, setIsTransferring] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedCode, setGeneratedCode] = useState("");
  const [codeCopied, setCodeCopied] = useState(false);

  useEffect(() => {
    const fetchDevice = async () => {
      if (!id) return;
      const idStr = Array.isArray(id) ? id[0] : id;
      
      try {
        const docRef = doc(db, "devices", idStr);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setDevice({ id: docSnap.id, ...docSnap.data() });
          return;
        }
      } catch (err) {
        console.error("Error fetching device from firestore:", err);
      }

      // Fallback to mock dictionary or dynamically generated detail
      if (MOCK_DEVICES_DETAILS[idStr]) {
        setDevice(MOCK_DEVICES_DETAILS[idStr]);
      } else {
        setDevice({
          id: idStr,
          name: `Registered Device #${idStr}`,
          brand: "Generic Device",
          model: "Standard Model",
          serial: `SN-${idStr}-8849`,
          imei: `35${Math.floor(1000000000000 + Math.random() * 9000000000000)}`,
          type: "Phone",
          status: "secured",
          battery: "96%",
          storage: "128 GB (85 GB Free)",
          purchased: "2024-02-01",
          value: "P 8,500.00",
          history: [
            { action: "Registered with ElectroShield Registry", date: "2024-02-01", by: "Owner" },
            { action: "Defense cryptographic stamp applied", date: "2024-02-01", by: "Registry Engine" }
          ]
        });
      }
    };
    fetchDevice();
  }, [id]);

  const generateTransferCode = async () => {
    setIsGenerating(true);
    // Simulate generation delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedCode(code);
    setIsGenerating(false);
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(generatedCode);
      setCodeCopied(true);
      setTimeout(() => setCodeCopied(false), 3000);
    } catch (err) {
      console.error("Failed to copy code");
    }
  };

  if (authLoading || !device || !user) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-sky-500" />
      </div>
    );
  }

  const { text, bg, border, primary } = user.color;
  const isReported = device.status === 'stolen' || device.status === 'lost';
  const canTransfer = !isReported;

  const IconMap: Record<string, any> = {
    'Phone': Smartphone,
    'Laptop': Laptop,
    'Tablet': Tablet,
    'Watch': Watch
  };
  const DeviceIcon = IconMap[device.type] || Smartphone;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 selection:bg-sky-200 dark:selection:bg-sky-900 overflow-x-hidden">
      <Navbar />

      <section className="pt-32 pb-24 px-6 sm:px-12 lg:px-20 w-full mb-12">
        {/* Breadcrumb */}
        <Link href="/devices" className="inline-flex items-center gap-2 text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors mb-12 group">
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          <span className="text-xs font-black uppercase tracking-widest">Back to Registry</span>
        </Link>

        <div className="grid lg:grid-cols-3 gap-12 items-start">
          {/* Left Column: Device Main View */}
          <div className="lg:col-span-2 space-y-8">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white dark:bg-white/[0.02] border border-slate-100 dark:border-white/5 rounded-[3rem] p-8 md:p-14 shadow-2xl relative overflow-hidden"
            >
               {/* Background Glow */}
               <div className={`absolute top-0 right-0 w-[40%] h-[40%] bg-${primary}-500/5 blur-[100px] rounded-full`} />

               <div className="flex flex-col md:flex-row items-center md:items-start gap-12 relative z-10">
                  {/* Device Visual Representation */}
                  <div className="relative group">
                     <div className={`w-40 h-40 md:w-56 md:h-56 rounded-[3rem] bg-white dark:bg-white/5 flex items-center justify-center shadow-2xl border border-slate-100 dark:border-white/5 transition-transform duration-700 group-hover:scale-105`}>
                        <DeviceIcon className={`w-20 h-20 md:w-32 md:h-32 text-${primary}-500`} />
                     </div>
                     <div className="absolute -bottom-4 -right-4 w-12 h-12 rounded-2xl bg-emerald-500 text-white flex items-center justify-center shadow-lg border-4 border-white dark:border-slate-950">
                        <Lock className="w-6 h-6" />
                     </div>
                  </div>

                  <div className="flex-1 text-center md:text-left">
                     <div className={`inline-flex items-center gap-3 px-4 py-2 rounded-full border mb-6 ${bg} ${text} ${border} text-[10px] font-black uppercase tracking-[0.3em]`}>
                        <div className={`w-2 h-2 rounded-full bg-${primary}-500 animate-pulse`} />
                        Secured Identity
                     </div>
                     <h1 className="text-4xl md:text-6xl font-black text-slate-900 dark:text-white tracking-tighter mb-4">
                        {device.name}
                     </h1>
                     <p className="text-slate-500 dark:text-slate-400 text-xl font-medium mb-8">
                        {device.brand} • {device.model} • {device.serial}
                     </p>
                     
                     <div className="flex flex-wrap items-center justify-center md:justify-start gap-4">
                        <button 
                          onClick={() => setIsTransferring(!isTransferring)}
                          className={`px-8 py-4 bg-${primary}-600 hover:bg-${primary}-500 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-${primary}-500/20 transition-all flex items-center gap-3`}
                        >
                          <Share2 className="w-4 h-4" /> Transfer Ownership
                        </button>
                        <button className="px-8 py-4 bg-rose-500 hover:bg-rose-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-rose-500/20 transition-all flex items-center gap-3">
                          <AlertTriangle className="w-4 h-4" /> Report Issue
                        </button>
                     </div>
                  </div>
               </div>

               {/* Specs Grid */}
               <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-16 pt-16 border-t border-slate-100 dark:border-white/5 relative z-10">
                  {[
                    { label: "Battery", value: device.battery, icon: Battery, color: "emerald" },
                    { label: "Storage", value: device.storage, icon: Cpu, color: "indigo" },
                    { label: "State", value: "Locked", icon: Lock, color: "sky" },
                    { label: "Location", value: "Verified", icon: MapPin, color: "rose" },
                  ].map((spec, i) => (
                    <div key={i} className="flex flex-col gap-2 p-4 rounded-2xl bg-slate-50/50 dark:bg-white/5 border border-slate-100 dark:border-white/5">
                       <spec.icon className={`w-5 h-5 text-${spec.color}-500 mb-2`} />
                       <div className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">{spec.label}</div>
                       <div className="text-sm font-black text-slate-900 dark:text-white tracking-tight">{spec.value}</div>
                    </div>
                  ))}
               </div>
            </motion.div>

            {/* Sub-panels */}
            <div className="grid md:grid-cols-2 gap-8">
               <motion.div 
                 initial={{ opacity: 0, y: 20 }}
                 animate={{ opacity: 1, y: 0 }}
                 transition={{ delay: 0.1 }}
                 className="bg-white dark:bg-white/[0.02] border border-slate-100 dark:border-white/5 rounded-[2.5rem] p-8 shadow-xl"
               >
                  <h3 className="text-lg font-black text-slate-900 dark:text-white tracking-tight mb-6 flex items-center justify-between">
                     Security History
                     <History className="w-5 h-5 text-slate-400" />
                  </h3>
                  <div className="space-y-6">
                     {[
                       { event: "Ownership Verified", time: "2m ago", status: "success" },
                       { event: "Software Update v17.4", time: "2d ago", status: "info" },
                       { event: "Sync Completed", time: "3d ago", status: "success" },
                       { event: "New Key Generated", time: "1w ago", status: "warning" },
                     ].map((item, i) => (
                       <div key={i} className="flex items-center justify-between gap-4 group">
                          <div className="flex items-center gap-4">
                             <div className={`w-2 h-2 rounded-full ${item.status === 'success' ? 'bg-emerald-500' : item.status === 'warning' ? 'bg-amber-500' : 'bg-sky-500'}`} />
                             <div className="text-sm font-bold text-slate-700 dark:text-slate-300 group-hover:text-sky-500 transition-colors">{item.event}</div>
                          </div>
                          <div className="text-[10px] font-black uppercase tracking-widest text-slate-400">{item.time}</div>
                       </div>
                     ))}
                  </div>
               </motion.div>

               <motion.div 
                 initial={{ opacity: 0, y: 20 }}
                 animate={{ opacity: 1, y: 0 }}
                 transition={{ delay: 0.2 }}
                 className="bg-white dark:bg-white/[0.02] border border-slate-100 dark:border-white/5 rounded-[2.5rem] p-8 shadow-xl"
               >
                  <h3 className="text-lg font-black text-slate-900 dark:text-white tracking-tight mb-6 flex items-center justify-between">
                     Connection Status
                     <Signal className="w-5 h-5 text-slate-400" />
                  </h3>
                  <div className="flex items-center gap-6 mb-8 p-6 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/5">
                     <div className="relative">
                        <Signal className={`w-12 h-12 text-${primary}-500`} />
                        <div className={`absolute inset-0 bg-${primary}-500 blur-xl opacity-20 animate-pulse`} />
                     </div>
                     <div>
                        <div className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-1">Network Path</div>
                        <div className="text-lg font-black text-slate-900 dark:text-white tracking-tight">Active (Latency 4ms)</div>
                     </div>
                  </div>
                  <div className="space-y-4">
                     <div className="flex justify-between text-xs font-bold uppercase tracking-widest text-slate-500">
                        <span>Reliability Score</span>
                        <span>99.8%</span>
                     </div>
                     <div className="w-full h-1.5 bg-slate-100 dark:bg-white/5 rounded-full overflow-hidden">
                        <div className={`h-full bg-${primary}-500 w-[99.8%] rounded-full`} />
                     </div>
                  </div>
               </motion.div>
            </div>
          </div>

          {/* Right Column: Dynamic Action Area */}
          <div className="space-y-8 lg:sticky lg:top-32">
             <AnimatePresence mode="wait">
                {isTransferring ? (
                  <motion.div
                    key="transfer"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-white/5 rounded-[3rem] p-8 shadow-2xl relative overflow-hidden"
                  >
                     {/* Cybernetic Accent */}
                     <div className="absolute top-0 left-0 w-2 h-full bg-gradient-to-b from-sky-500 to-indigo-600" />
                     
                     <div className="flex items-center justify-between mb-8">
                        <div className="w-14 h-14 rounded-2xl bg-sky-500/10 flex items-center justify-center text-sky-500">
                           <Key className="w-7 h-7" />
                        </div>
                        <button 
                          onClick={() => setIsTransferring(false)}
                          className="w-10 h-10 rounded-xl hover:bg-slate-100 dark:hover:bg-white/10 flex items-center justify-center text-slate-400 transition-colors"
                        >
                           <MoreHorizontal className="w-5 h-5 rotate-45" />
                        </button>
                     </div>

                     <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tighter mb-4">
                        Transfer Protocol
                     </h2>
                     <p className="text-slate-500 dark:text-slate-400 text-sm font-medium leading-relaxed mb-8">
                        Generate a secure, single-use 6-digit code to transfer this device to another verified user.
                     </p>

                     {!generatedCode ? (
                        <div className="space-y-6">
                           <div className="p-6 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/5">
                              <div className="flex items-start gap-4">
                                 <Users className="w-5 h-5 text-sky-500 mt-1" />
                                 <div>
                                    <div className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">How it works</div>
                                    <ul className="text-xs font-bold text-slate-500 space-y-1.5 leading-relaxed">
                                       <li>• Code expires in 7 days</li>
                                       <li>• Single use authorization</li>
                                       <li>• Recipient must be verified</li>
                                    </ul>
                                 </div>
                              </div>
                           </div>
                           
                           <button 
                             onClick={generateTransferCode}
                             disabled={isGenerating}
                             className={`w-full py-5 bg-${primary}-600 hover:bg-${primary}-500 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-${primary}-500/20 transition-all flex items-center justify-center gap-3 disabled:opacity-50`}
                           >
                             {isGenerating ? (
                                <>
                                   <Loader2 className="w-5 h-5 animate-spin" /> Generating...
                                </>
                             ) : (
                                <>
                                   <Key className="w-5 h-5" /> Generate Transfer Code
                                </>
                             )}
                           </button>
                        </div>
                     ) : (
                        <div className="space-y-8">
                           <div className={`p-8 rounded-3xl bg-slate-50 dark:bg-black/20 border-2 ${border} text-center relative overflow-hidden`}>
                              <p className="text-xs font-black uppercase tracking-[0.3em] text-slate-400 mb-4">Your Transfer Code</p>
                              <div className={`text-5xl font-mono font-black tracking-widest ${text} mb-6`}>
                                 {generatedCode}
                              </div>
                              <button 
                                onClick={copyToClipboard}
                                className="flex items-center gap-2 px-6 py-3 bg-white dark:bg-white/10 rounded-xl border border-slate-200 dark:border-white/5 text-slate-600 dark:text-slate-300 font-black text-[10px] uppercase tracking-widest hover:bg-slate-50 transition-all mx-auto"
                              >
                                {codeCopied ? (
                                  <>
                                     <CheckCircle2 className="w-4 h-4 text-emerald-500" /> Copied!
                                  </>
                                ) : (
                                  <>
                                     <Copy className="w-4 h-4" /> Copy Secure Code
                                  </>
                                )}
                              </button>
                           </div>
                           
                           <div className="flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400">
                              <Clock className="w-4 h-4" />
                              Expiring in 6 days, 23 hours
                           </div>

                           <button 
                              onClick={() => { setGeneratedCode(""); setIsTransferring(false); }}
                              className="w-full py-4 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-2xl font-black text-xs uppercase tracking-widest transition-all"
                           >
                              Finish Protocol
                           </button>
                        </div>
                     )}
                  </motion.div>
                ) : (
                  <motion.div
                    key="sidebar"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-6"
                  >
                     <div className="bg-white dark:bg-white/[0.02] border border-slate-100 dark:border-white/5 rounded-[2.5rem] p-8 shadow-xl">
                        <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400 mb-8 px-1">Registry Metadata</h3>
                        <div className="space-y-6">
                           {[
                             { label: "Purchase Origin", value: "Flagship Gaborone" },
                             { label: "Warranty End", value: "Oct 2025" },
                             { label: "OS Build", value: "EB-22.1.0" },
                             { label: "Security Level", value: "Kernel Layer 4" },
                           ].map((item, i) => (
                             <div key={i} className="flex flex-col gap-1">
                                <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">{item.label}</span>
                                <span className="text-sm font-bold text-slate-900 dark:text-slate-100 tracking-tight">{item.value}</span>
                             </div>
                           ))}
                        </div>
                     </div>

                     <div className="bg-gradient-to-br from-sky-500 to-indigo-600 rounded-[2.5rem] p-8 shadow-2xl text-white relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 blur-3xl rounded-full translate-x-10 -translate-y-10 group-hover:scale-150 transition-transform duration-700" />
                        <h3 className="text-xl font-black tracking-tight mb-4 relative z-10">Protection Plan</h3>
                        <p className="text-white/80 text-sm font-medium mb-8 relative z-10 leading-relaxed">
                           Your asset is currently under Tier-1 National Guard protection.
                        </p>
                        <button className="w-full py-4 bg-white/20 backdrop-blur-md hover:bg-white/30 rounded-2xl font-black text-[10px] uppercase tracking-[0.3em] transition-all relative z-10">
                           Manage Coverage
                        </button>
                     </div>
                  </motion.div>
                )}
             </AnimatePresence>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
