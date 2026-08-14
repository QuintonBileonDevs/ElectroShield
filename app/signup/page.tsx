'use client';
import { motion } from "motion/react";
import Link from "next/link";
import Image from "next/image";
import { Shield, Mail, Lock, ArrowRight, User } from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Logo } from "@/components/Logo";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { auth, db } from "@/lib/firebase";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { ErrorMessage } from "@/components/ErrorMessage";
import { formatFirebaseError } from "@/lib/utils";

export default function SignupPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      await updateProfile(user, { displayName: name });
      
      // Also create the user doc directly here to be sure it has the name
      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        email: user.email,
        displayName: name,
        role: "individual" // default
      });

      router.push("/complete-registration");
    } catch (err: any) {
      setError(formatFirebaseError(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col md:flex-row selection:bg-sky-200 dark:selection:bg-sky-900">
      {/* Top Nav (Minimal) */}
      <div className="absolute top-0 w-full p-6 flex justify-between items-center z-50">
        <Logo />
        <ThemeToggle />
      </div>

      {/* Left side covering branding (hidden on mobile) */}
      <div className="hidden md:flex flex-1 relative bg-slate-900 overflow-hidden items-center justify-center p-12">
        <div className="absolute inset-0 z-0">
          <Image 
            src="https://images.pexels.com/photos/15951300/pexels-photo-15951300.jpeg" 
            alt="Signup Background" 
            fill 
            className="object-cover opacity-40" 
            referrerPolicy="no-referrer"
          />
          <div className="absolute top-0 right-0 w-full h-full bg-sky-900/30 mix-blend-multiply" />
          <div className="absolute -top-1/2 -left-1/2 w-[200%] h-[200%] bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-20 blur-[1px] mix-blend-overlay" />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/60 to-transparent" />
        </div>
        
        <div className="relative z-10 max-w-xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-flex items-center gap-2 bg-sky-500/10 text-sky-400 px-4 py-1.5 rounded-xl text-xs font-bold border border-sky-500/20 mb-6">
              <Shield className="w-4 h-4" />
              JOIN THE NETWORK
            </div>
            <h1 className="text-5xl lg:text-6xl font-bold tracking-tight text-white mb-6 leading-tight">
              Protect your <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-sky-600">devices</span> today.
            </h1>
            <p className="text-lg text-slate-400 font-medium">
              Create a free account to register your personal electronics and secure them against loss and theft.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Right side covering form */}
      <div className="flex-1 flex items-center justify-center p-6 pt-32 md:pt-6 relative z-10">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-md bg-white dark:bg-slate-900 p-8 rounded-[2rem] shadow-xl border border-slate-100 dark:border-slate-800"
        >
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight mb-2">Create Account</h2>
            <p className="text-slate-500 dark:text-slate-400 text-sm">For Individual & Family personal asset protection.</p>
            <div className="mt-3 p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl text-xs text-amber-700 dark:text-amber-400 font-medium">
              Organization & Partner Portal accounts are created by Super Administration. Partner admins should <Link href="/login" className="underline font-bold hover:text-amber-600">Log In here</Link>.
            </div>
          </div>

          <form className="space-y-5" onSubmit={handleSignup}>
            <ErrorMessage error={error} onDismiss={() => setError("")} />
            
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Full Name</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-slate-400" />
                </div>
                <input 
                  type="text" 
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="John Doe" 
                  className="w-full pl-12 pr-4 py-3.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-sky-500/50 focus:border-sky-500 transition-all font-medium"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Email Address</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-slate-400" />
                </div>
                <input 
                  type="email" 
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com" 
                  className="w-full pl-12 pr-4 py-3.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-sky-500/50 focus:border-sky-500 transition-all font-medium"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-slate-400" />
                </div>
                <input 
                  type="password" 
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Create a strong password" 
                  className="w-full pl-12 pr-4 py-3.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-sky-500/50 focus:border-sky-500 transition-all font-medium"
                />
              </div>
            </div>

            <button disabled={loading} className="w-full disabled:opacity-50 bg-sky-600 hover:bg-sky-500 text-white py-4 rounded-xl font-bold text-lg transition-all shadow-lg shadow-sky-600/20 active:scale-95 flex items-center justify-center gap-2 group mt-6">
              {loading ? "Creating Account..." : "Create Account"}
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800 text-center">
            <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
              Already have an account?{' '}
              <Link href="/login" className="text-sky-600 dark:text-sky-400 font-bold hover:underline transition-all">
                Log in
              </Link>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
