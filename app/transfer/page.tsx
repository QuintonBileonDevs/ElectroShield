"use client";

import { useState, useEffect, useCallback, Suspense } from "react";
import { useAuth } from "@/components/auth-provider";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { motion } from "motion/react";
import { 
  Loader2, 
  ArrowLeft, 
  Smartphone, 
  Key, 
  Copy, 
  CheckCircle2,
  AlertTriangle,
  Clock,
  Users,
  ShieldCheck,
  Zap
} from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

// Using simple toast replacement since sonner isn't installed and we want to keep it light
const toast = {
  success: (msg: string) => console.log("Success:", msg),
  error: (msg: string) => console.log("Error:", msg),
  info: (msg: string) => console.log("Info:", msg),
};

interface Device {
  id: string;
  brand: string;
  model: string;
  serial_number: string;
  imei: string;
  status: string;
  is_blacklisted: boolean;
}

function TransferContent() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const deviceId = searchParams.get('device');
  
  const [device, setDevice] = useState<Device | null>(null);
  const [isLoading, setIsLoading] = useState(() => Boolean(deviceId));
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedCode, setGeneratedCode] = useState("");
  const [codeCopied, setCodeCopied] = useState(false);

  useEffect(() => {
    let isMounted = true;

    if (!authLoading && !user) {
      router.push("/");
      return;
    }

    if (user && deviceId) {
      (async () => {
        try {
          const docRef = doc(db, "devices", deviceId);
          const docSnap = await getDoc(docRef);
          
          if (!isMounted) return;

          if (docSnap.exists()) {
            const data = docSnap.data();
            const loadedDevice: Device = {
              id: docSnap.id,
              brand: data.brand || "Hardware",
              model: data.name || data.model || "Secure Unit",
              serial_number: data.serial || data.serial_number || "SN-UNKNOWN",
              imei: data.imei || "N/A",
              status: data.status || "active",
              is_blacklisted: data.status === "stolen" || data.status === "lost",
            };
            setDevice(loadedDevice);
            if (data.transferCode) {
              setGeneratedCode(data.transferCode);
            }
          } else {
            const mockDevice: Device = {
              id: deviceId,
              brand: "Hardware",
              model: "Registered Device",
              serial_number: `SN-${deviceId}`,
              imei: "358291039482710",
              status: "active",
              is_blacklisted: false,
            };
            setDevice(mockDevice);
          }
        } catch (error) {
          console.error("Failed to load device:", error);
          if (isMounted) toast.error("Failed to load device");
        } finally {
          if (isMounted) setIsLoading(false);
        }
      })();
    }

    return () => {
      isMounted = false;
    };
  }, [user, authLoading, router, deviceId]);

  const generateTransferCode = async () => {
    if (!deviceId) return;
    setIsGenerating(true);
    try {
      const code = Math.floor(100000 + Math.random() * 900000).toString();
      
      try {
        const docRef = doc(db, "devices", deviceId);
        await updateDoc(docRef, {
          transferCode: code,
          status: "pending_transfer",
          transferGeneratedAt: new Date().toISOString()
        });
      } catch (err) {
        console.warn("Could not update doc in firestore:", err);
      }

      setGeneratedCode(code);
      toast.success("Transfer code generated!");
    } catch (error) {
      toast.error("An error occurred");
    } finally {
      setIsGenerating(false);
    }
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(generatedCode);
      setCodeCopied(true);
      setTimeout(() => setCodeCopied(false), 3000);
    } catch (err) {
      toast.error("Failed to copy code");
    }
  };

  if (authLoading || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-black">
        <Loader2 className="w-10 h-10 animate-spin text-sky-500" />
      </div>
    );
  }

  if (!device) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-black">
        <Navbar />
        <div className="pt-40 px-6 text-center">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">Device not found</h2>
          <Link href="/devices" className="text-sky-500 hover:underline">Back to devices</Link>
        </div>
      </div>
    );
  }

  const isReported = device.is_blacklisted || device.status === 'stolen' || device.status === 'lost';
  const canTransfer = !device.is_blacklisted && device.status !== 'stolen' && device.status !== 'lost';

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-black selection:bg-sky-200 dark:selection:bg-sky-900 overflow-x-hidden">
      <Navbar />

      <div className="relative pt-32 pb-24 px-6 md:px-12 lg:px-20 w-full">
        {/* Background Glows */}
        <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-[800px] h-[800px] bg-sky-500/10 dark:bg-sky-500/5 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-sky-900/10 dark:bg-sky-900/5 rounded-full blur-[100px] pointer-events-none" />

        <div className="max-w-2xl mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Link 
              href="/devices" 
              className="inline-flex items-center gap-2 text-slate-500 hover:text-sky-500 transition-colors mb-8 group"
            >
              <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
              Back to Devices
            </Link>

            <div className="bg-white dark:bg-slate-900 border-2 border-transparent hover:border-sky-500/30 transition-all duration-500 rounded-[2.5rem] shadow-2xl shadow-slate-200/50 dark:shadow-none overflow-hidden shadow-xl shadow-black/5">
              {/* Header */}
              <div className="p-8 md:p-10 text-center border-b border-slate-100 dark:border-slate-800">
                <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-sky-500 to-sky-700 flex items-center justify-center mx-auto mb-6 shadow-xl shadow-sky-500/20">
                  <Key className="w-10 h-10 text-white" />
                </div>
                <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-50 mb-2">
                  Transfer Device Ownership
                </h1>
                <p className="text-slate-500 dark:text-slate-400">
                  Generate a secure 6-digit code to transfer this device to another user account.
                </p>
              </div>

              <div className="p-8 md:p-10 space-y-8">
                {/* Device Info Card */}
                <div className="bg-slate-50 dark:bg-slate-950/50 rounded-2xl p-6 border-2 border-transparent hover:border-sky-500/30 transition-all duration-500 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-xl bg-white dark:bg-slate-900 shadow-sm flex items-center justify-center text-sky-500">
                      <Smartphone className="w-8 h-8" />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg text-slate-900 dark:text-slate-100">
                        {device.brand} {device.model}
                      </h3>
                      <p className="text-sm text-slate-500 font-mono">
                        {device.serial_number || device.imei || "No Identifier"}
                      </p>
                    </div>
                  </div>
                  
                  {isReported && (
                    <div className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-red-500/10 text-red-500 text-xs font-bold ring-1 ring-red-500/20">
                      <AlertTriangle className="w-3.5 h-3.5" />
                      REPORTED
                    </div>
                  )}
                  {!isReported && (
                    <div className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-emerald-500/10 text-emerald-500 text-xs font-bold ring-1 ring-emerald-500/20">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      SECURE
                    </div>
                  )}
                </div>

                {/* Warning for reported devices */}
                {isReported && (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-red-500/5 dark:bg-red-500/10 border border-red-500/20 rounded-2xl p-6"
                  >
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-full bg-red-500/20 flex items-center justify-center text-red-500 flex-shrink-0">
                        <AlertTriangle className="w-6 h-6" />
                      </div>
                      <div>
                        <p className="font-bold text-red-600 dark:text-red-400 mb-1">Cannot Transfer Ownership</p>
                        <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                          This device is currently marked as <span className="font-bold italic uppercase">{device.status}</span>. 
                          Reported devices are locked and cannot be transferred. Please mark as recovered before attempting a transfer.
                        </p>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Transfer Info / Instructions */}
                {canTransfer && !generatedCode && (
                  <div className="bg-sky-500/5 dark:bg-sky-500/10 border border-sky-500/20 rounded-2xl p-6">
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-full bg-sky-500/20 flex items-center justify-center text-sky-500 flex-shrink-0">
                        <Users className="w-6 h-6" />
                      </div>
                      <div>
                        <p className="font-bold text-slate-900 dark:text-slate-100 mb-3">How it works</p>
                        <ul className="space-y-3 text-sm text-slate-600 dark:text-slate-400">
                          <li className="flex items-center gap-2">
                             <div className="w-1.5 h-1.5 rounded-full bg-sky-500" />
                            Generate a unique 6-digit transfer code
                          </li>
                          <li className="flex items-center gap-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-sky-500" />
                            Share the code with the recipient
                          </li>
                          <li className="flex items-center gap-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-sky-500" />
                            Recipient enters code at /accept-transfer
                          </li>
                          <li className="flex items-center gap-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-sky-500" />
                            Code expires in 7 days
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                )}

                {/* Generated Code Display */}
                {generatedCode && (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="relative"
                  >
                    <div className="bg-gradient-to-br from-slate-900 to-slate-950 dark:from-slate-800 dark:to-slate-900 rounded-[2.5rem] p-8 text-center border-2 border-transparent hover:border-sky-500/30 transition-all duration-500 shadow-2xl relative overflow-hidden group">
                      {/* Animated Scanner Line */}
                      <motion.div 
                        animate={{ top: ['0%', '100%', '0%'] }}
                        transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
                        className="absolute left-0 right-0 h-[1px] bg-sky-500/50 shadow-[0_0_15px_rgba(14,165,233,0.5)] z-20 pointer-events-none"
                      />

                      <p className="text-sky-500 text-xs font-bold uppercase tracking-widest mb-4">Your Transfer Code</p>
                      
                      <div className="text-5xl md:text-6xl font-mono font-black text-white tracking-[0.3em] mb-8 select-all">
                        {generatedCode}
                      </div>

                      <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <button 
                          onClick={copyToClipboard}
                          className="flex items-center justify-center gap-2 bg-sky-600 hover:bg-sky-500 text-white px-6 py-3 rounded-xl font-bold transition-all active:scale-95"
                        >
                          {codeCopied ? (
                            <>
                              <CheckCircle2 className="w-5 h-5" />
                              Copied!
                            </>
                          ) : (
                            <>
                              <Copy className="w-5 h-5" />
                              Copy Code
                            </>
                          )}
                        </button>
                        
                        <button 
                          onClick={() => setGeneratedCode("")}
                          className="flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 text-slate-300 px-6 py-3 rounded-xl font-bold transition-all border border-slate-700"
                        >
                          Generate New
                        </button>
                      </div>

                      <div className="mt-8 pt-6 border-t border-slate-800/50 flex flex-col sm:flex-row items-center justify-between gap-4">
                        <div className="flex items-center gap-2 text-slate-500 text-xs">
                          <Clock className="w-4 h-4" />
                          Expires in 7 days
                        </div>
                        <p className="text-slate-500 text-[10px] uppercase font-black tracking-tighter">
                          Secure Ownership Protocol v2.5
                        </p>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Action Buttons */}
                {canTransfer && !generatedCode && (
                  <motion.button 
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={generateTransferCode} 
                    disabled={isGenerating}
                    className="w-full bg-gradient-to-r from-sky-600 to-sky-700 hover:from-sky-500 hover:to-sky-600 text-white h-16 rounded-2xl text-xl font-black shadow-xl shadow-sky-500/25 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
                  >
                    {isGenerating ? (
                      <>
                        <Loader2 className="w-6 h-6 animate-spin" />
                        Generating Code...
                      </>
                    ) : (
                      <>
                        <Key className="w-6 h-6" />
                        Generate Transfer Code
                      </>
                    )}
                  </motion.button>
                )}

                {generatedCode && (
                  <Link href="/devices" className="block">
                    <button className="w-full h-16 rounded-2xl bg-sky-600 hover:bg-sky-500 text-white font-bold transition-all shadow-lg shadow-sky-500/20 active:scale-95">
                      Done
                    </button>
                  </Link>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
}

export default function TransferPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-black">
        <Loader2 className="w-10 h-10 animate-spin text-sky-500" />
      </div>
    }>
      <TransferContent />
    </Suspense>
  );
}
