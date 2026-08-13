"use client";

import { useState, useEffect, Suspense } from "react";
import { useAuth } from "@/components/auth-provider";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { motion } from "motion/react";
import { 
  Loader2, 
  Gift, 
  CheckCircle2, 
  AlertCircle, 
  ArrowLeft, 
  Key,
  ShieldCheck,
  Smartphone,
  ChevronRight
} from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

// Simple toast mock
const toast = {
  success: (msg: string) => console.log("Success:", msg),
  error: (msg: string) => console.log("Error:", msg),
  info: (msg: string) => console.log("Info:", msg),
};

function AcceptTransferContent() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [transferCode, setTransferCode] = useState(() => {
    if (typeof window !== "undefined") {
      const fromUrl = searchParams.get('code');
      if (fromUrl) return fromUrl;
      const fromSession = sessionStorage.getItem('pending_transfer_code');
      if (fromSession) {
        sessionStorage.removeItem('pending_transfer_code');
        return fromSession;
      }
    }
    return "";
  });
  const [loading, setLoading] = useState(false);
  const [acceptedDevice, setAcceptedDevice] = useState<{ brand: string; model: string; id: string } | null>(null);

  // No longer needs the effect for initial code check

  const handleAccept = async () => {
    if (!transferCode || transferCode.length !== 6) {
      toast.error("Please enter a valid 6-digit transfer code");
      return;
    }

    setLoading(true);
    try {
      // Mocking API call logic as per OCR target
      const token = localStorage.getItem('auth_token');
      // In real use: const response = await fetch("/api/transfers/accept-code", { ... });
      
      await new Promise(resolve => setTimeout(resolve, 2000));

      const mockResult = {
        message: "Transfer successful!",
        device: {
          id: "123",
          brand: "iPhone",
          model: "15 Pro Max"
        }
      };

      setAcceptedDevice(mockResult.device);
      toast.success(mockResult.message);
    } catch (error) {
      toast.error("Invalid or expired transfer code");
    } finally {
      setLoading(false);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-black">
        <Loader2 className="w-10 h-10 animate-spin text-sky-500" />
      </div>
    );
  }

  if (acceptedDevice) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-black selection:bg-sky-200 dark:selection:bg-sky-900">
        <Navbar />
        <div className="pt-32 pb-24 px-6 flex items-center justify-center min-h-[80vh]">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-emerald-500/10 rounded-full blur-[120px] pointer-events-none" />
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-md w-full bg-white dark:bg-slate-900 border-2 border-transparent hover:border-sky-500/30 transition-all duration-500 rounded-[2.5rem] shadow-2xl p-10 text-center relative z-10 shadow-xl shadow-black/5"
          >
            <div className="w-20 h-20 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-8 ring-1 ring-emerald-500/50">
              <CheckCircle2 className="w-10 h-10 text-emerald-500" />
            </div>
            
            <h2 className="text-3xl font-black text-slate-900 dark:text-white mb-4 tracking-tight">
              Transfer Complete!
            </h2>
            
            <div className="bg-slate-50 dark:bg-slate-950/50 rounded-2xl p-6 border-2 border-transparent hover:border-sky-500/30 transition-all duration-500 mb-8 flex items-center gap-4 text-left">
              <div className="w-12 h-12 rounded-xl bg-white dark:bg-slate-900 shadow-sm flex items-center justify-center text-emerald-500">
                <Smartphone className="w-7 h-7" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-0.5">Device Added</p>
                <p className="font-bold text-slate-900 dark:text-slate-100">
                  {acceptedDevice.brand} {acceptedDevice.model}
                </p>
              </div>
            </div>

            <p className="text-slate-500 dark:text-slate-400 mb-10 leading-relaxed">
              Ownership has been successfully transferred to your account. This device is now protected by our Secure Ownership Protocol.
            </p>

            <button 
              onClick={() => router.push("/devices")}
              className="w-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 h-14 rounded-xl font-bold flex items-center justify-center gap-2 group transition-all"
            >
              View My Devices
              <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </motion.div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-black selection:bg-sky-200 dark:selection:bg-sky-900">
      <Navbar />

      <div className="relative pt-32 pb-24 px-6 flex items-center justify-center min-h-[85vh]">
        {/* Background Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-sky-500/10 rounded-full blur-[120px] pointer-events-none" />

        <div className="max-w-md w-full relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Link 
              href="/dashboard" 
              className="inline-flex items-center gap-2 text-slate-500 hover:text-sky-500 transition-colors mb-8 group font-medium"
            >
              <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
              Back to Dashboard
            </Link>

            <div className="bg-white dark:bg-slate-900 border-2 border-transparent hover:border-sky-500/30 transition-all duration-500 rounded-[2.5rem] shadow-2xl p-8 md:p-10 shadow-xl shadow-black/5">
              <div className="text-center mb-10">
                <div className="w-16 h-16 bg-sky-500/20 rounded-2xl flex items-center justify-center mx-auto mb-6 ring-1 ring-sky-500/30">
                  <Gift className="w-8 h-8 text-sky-500" />
                </div>
                <h1 className="text-3xl font-black text-slate-900 dark:text-white mb-3 tracking-tight">
                  Accept Device Transfer
                </h1>
                <p className="text-slate-500 dark:text-slate-400">
                  Enter the 6-digit code shared with you by the device owner.
                </p>
              </div>

              <div className="space-y-6">
                <div className="space-y-3">
                  <input
                    type="text"
                    placeholder="000000"
                    value={transferCode}
                    onChange={(e) => setTransferCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                    className="w-full text-center text-4xl lg:text-5xl font-mono font-black tracking-[0.2em] h-24 bg-slate-50 dark:bg-slate-950 border-2 border-transparent focus:border-sky-500/30 rounded-2xl transition-all outline-none"
                    maxLength={6}
                    autoFocus
                    disabled={loading}
                  />
                  <p className="text-[10px] uppercase font-black text-center text-slate-400 tracking-widest leading-none">
                    Enter the 6-digit code you received
                  </p>
                </div>

                <motion.button 
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleAccept} 
                  disabled={loading || transferCode.length !== 6}
                  className="w-full bg-gradient-to-r from-sky-600 to-sky-700 hover:from-sky-500 hover:to-sky-600 text-white h-16 rounded-2xl font-black shadow-xl shadow-sky-500/25 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-6 h-6 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <Key className="w-5 h-5 mr-1" />
                      Accept Transfer
                    </>
                  )}
                </motion.button>

                {!user && (
                  <div className="p-4 bg-amber-500/10 border border-amber-500/20 rounded-2xl">
                    <div className="flex items-start gap-3">
                      <AlertCircle className="w-5 h-5 text-amber-500 mt-0.5 flex-shrink-0" />
                      <p className="text-xs text-amber-700 dark:text-amber-400 leading-relaxed">
                        <span className="font-bold">Account Required:</span> You&apos;ll be prompted to sign in or create an account after verifying the transfer code.
                      </p>
                    </div>
                  </div>
                )}

                <div className="text-center pt-8 border-t border-slate-100 dark:border-slate-800">
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">
                    Tokens are valid for single use and expire after 7 days
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default function AcceptTransferPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-black">
        <Loader2 className="w-10 h-10 animate-spin text-sky-500" />
      </div>
    }>
      <AcceptTransferContent />
    </Suspense>
  );
}
