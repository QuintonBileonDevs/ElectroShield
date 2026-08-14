'use client';

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "motion/react";
import { 
  ShieldCheck, 
  Home, 
  Smartphone,
  AlertTriangle,
  Shield,
  Lock,
  Zap,
  Sparkles,
  Rocket,
  Compass,
  MapPin,
  Globe,
  LayoutDashboard,
  HelpCircle,
  ShieldAlert,
  Search,
  Cpu,
  ArrowRight,
  Send
} from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

export default function GlobalNotFound() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [nodes, setNodes] = useState<any[]>([]);
  const [bgCircles, setBgCircles] = useState<any[]>([]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setNodes([...Array(8)].map(() => ({
        x: [0, Math.random() * 200 - 100],
        y: [0, Math.random() * 200 - 100],
        duration: 3 + Math.random() * 4,
        delay: Math.random() * 5,
        left: `${Math.random() * 100}%`,
        top: `${Math.random() * 100}%`,
      })));

      setBgCircles([...Array(6)].map(() => ({
        x: [Math.random() * 1000, Math.random() * 1000],
        y: [Math.random() * 1000, Math.random() * 1000],
        duration: 20 + Math.random() * 20,
        left: `${Math.random() * 100}%`,
        top: `${Math.random() * 100}%`,
      })));
    }, 0);

    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      clearTimeout(timer);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <main className="min-h-screen bg-white dark:bg-[#020617] selection:bg-sky-500/30 font-sans overflow-x-hidden">
      <Navbar />

      <section className="relative min-h-[90vh] flex flex-col items-center justify-center pt-40 pb-12 px-6 overflow-hidden">
        {/* Animated Background Matrix */}
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-40 dark:opacity-20" />
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-sky-500/5 via-transparent to-indigo-500/5 pointer-events-none" />
        </div>

        {/* Animated Background Nodes */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-20">
          {bgCircles.map((circle, i) => (
            <motion.div
              key={i}
              className="absolute w-64 h-64 bg-sky-500/10 rounded-full blur-[100px]"
              animate={{
                x: circle.x,
                y: circle.y,
                scale: [1, 1.5, 1],
              }}
              transition={{
                duration: circle.duration,
                repeat: Infinity,
                ease: "linear",
              }}
              style={{
                left: circle.left,
                top: circle.top,
              }}
            />
          ))}
        </div>

        {/* Floating Data Nodes */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-30">
          {nodes.map((node, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-sky-500 rounded-full"
              animate={{
                x: node.x,
                y: node.y,
                opacity: [0, 1, 0],
                scale: [0, 3, 0]
              }}
              transition={{
                duration: node.duration,
                repeat: Infinity,
                delay: node.delay
              }}
              style={{
                left: node.left,
                top: node.top,
              }}
            />
          ))}
        </div>

        {/* Dynamic Glow Cursor */}
        <div 
          className="pointer-events-none fixed inset-0 z-[1] transition-opacity duration-700 hidden md:block"
          style={{
            background: `radial-gradient(600px circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(56,189,248,0.06) 0%, transparent 100%)`
          }}
        />

        <div className="max-w-5xl mx-auto relative z-10 w-full text-center">
          {/* 404 Visualization */}
          <div className="relative mb-12 flex flex-col md:flex-row items-center justify-center gap-2 md:gap-12">
            <motion.div
              initial={{ x: -100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 80 }}
              className="text-[140px] md:text-[280px] font-black tracking-tighter leading-none text-slate-900 dark:text-white select-none"
            >
              4
            </motion.div>

            <motion.div
              initial={{ scale: 0, rotate: -270 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: 0.5, type: "spring", damping: 15 }}
              className="relative py-4"
            >
              {/* Outer Rings */}
              <motion.div 
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="absolute inset-0 border-[1px] border-sky-500/20 rounded-full scale-[1.6]"
              />
              <motion.div 
                animate={{ rotate: -360 }}
                transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                className="absolute inset-0 border-[1px] border-indigo-500/20 rounded-full scale-[1.3] border-dashed"
              />

              <div className="absolute inset-0 bg-sky-500/40 blur-[80px] rounded-full animate-pulse" />
              <div className="relative w-28 h-28 md:w-56 md:h-56 rounded-[2.5rem] md:rounded-[5rem] bg-slate-900 dark:bg-white flex items-center justify-center shadow-[0_0_50px_rgba(56,189,248,0.3)] group overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-sky-500 to-indigo-600 opacity-0 group-hover:opacity-10 transition-opacity" />
                <ShieldCheck className="w-14 h-14 md:w-28 md:h-28 text-white dark:text-slate-900 z-10" />
                
                {/* Scanning Effect */}
                <motion.div 
                   animate={{ y: [-100, 200] }}
                   transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                   className="absolute top-0 left-0 w-full h-1 bg-sky-400/50 blur-sm shadow-[0_0_15px_#38bdf8]"
                />
              </div>
            </motion.div>

            <motion.div
              initial={{ x: 100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 80 }}
              className="text-[140px] md:text-[280px] font-black tracking-tighter leading-none text-slate-900 dark:text-white select-none"
            >
              4
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="space-y-8"
          >
            <div className="space-y-4">
              <h1 className="text-4xl md:text-7xl font-black text-slate-900 dark:text-white tracking-tighter leading-[0.85] uppercase">
                LOST IN <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-500 via-indigo-500 to-sky-400">DIGITAL SPACE?</span>
              </h1>
              <p className="text-slate-600 dark:text-slate-400 text-lg md:text-xl font-medium leading-relaxed max-w-xl mx-auto">
                The network path you specified returned a <code className="bg-slate-100 dark:bg-white/5 px-2 py-0.5 rounded text-sky-500">404 NOT_FOUND</code> error. 
                But don&apos;t worry, your devices are still safe with us.
              </p>
            </div>

            <div className="flex flex-wrap gap-5 justify-center">
              <Link href="/">
                <button className="group relative px-10 py-5 rounded-2xl bg-slate-900 dark:bg-white text-white dark:text-slate-950 font-black text-xs uppercase tracking-[0.3em] overflow-hidden transition-all hover:scale-105 active:scale-95 shadow-2xl shadow-sky-500/20">
                  <span className="relative z-10 flex items-center gap-3">
                    <Home className="w-5 h-5" />
                    BACK TO HOME
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-sky-400 to-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity" />
                </button>
              </Link>
              
              <Link href="/support">
                <button className="px-10 py-5 rounded-2xl bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white font-black text-xs uppercase tracking-[0.3em] transition-all hover:bg-slate-50 dark:hover:bg-white/10 backdrop-blur-md flex items-center gap-3 group">
                  Support
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
              </Link>
            </div>
          </motion.div>

          {/* Quick Access Grid Heading */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.1 }}
            className="mt-24 mb-6"
          >
           
          </motion.div>
 <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400 dark:text-slate-500">
              You might want to try these links:
            </p>
          {/* Quick Access Grid */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto border-t border-slate-200 dark:border-white/5 pt-16"
          >
            {[
              { href: "/dashboard", label: "My Devices", icon: Smartphone, sub: "Device Registry", color: "sky" },
              { href: "/dashboard", label: "Transfers", icon: Send, sub: "Secure Transfer", color: "indigo" },
              { href: "/support", label: "Report", icon: AlertTriangle, sub: "Report Theft", color: "rose" },
              { href: "/login", label: "Login", icon: Lock, sub: "Core Access", color: "emerald" },
            ].map((link, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.2 + (i * 0.1) }}
                whileHover={{ y: -8 }}
                className="group relative"
              >
                <Link href={link.href}>
                  <div className="flex flex-col items-center justify-center gap-5 p-8 rounded-[2.5rem] bg-white dark:bg-white/[0.01] border border-slate-100 dark:border-white/5 hover:border-sky-500/30 dark:hover:bg-white/[0.04] transition-all duration-500 h-full relative overflow-hidden group/card shadow-sm hover:shadow-2xl hover:shadow-sky-500/10">
                    {/* Background Glow */}
                    <div className="absolute inset-0 bg-gradient-to-br from-sky-500/0 via-transparent to-indigo-500/0 group-hover/card:from-sky-500/[0.03] group-hover/card:to-indigo-500/[0.03] transition-all duration-500" />
                    
                    {/* Decoration Orbit */}
                    <motion.div 
                      className="absolute -top-10 -right-10 w-24 h-24 rounded-full bg-sky-500/5 blur-2xl group-hover/card:scale-150 transition-transform duration-700"
                    />

                    <div className="relative">
                      <div className="w-16 h-16 rounded-2xl bg-slate-50 dark:bg-white/5 flex items-center justify-center text-slate-400 group-hover/card:text-sky-500 group-hover/card:scale-110 transition-all duration-500 border border-slate-100 dark:border-white/5 group-hover/card:bg-white dark:group-hover/card:bg-white/10 group-hover/card:shadow-lg group-hover/card:shadow-sky-500/10">
                        <link.icon className="w-7 h-7" />
                      </div>
                      {/* Interactive pulse for certain states */}
                      {link.color === "rose" && (
                        <div className="absolute -top-1 -right-1 w-3 h-3 bg-rose-500 rounded-full animate-pulse border-2 border-white dark:border-[#020617]" />
                      )}
                    </div>

                    <div className="text-center relative z-10">
                      <h4 className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-900 dark:text-white mb-1.5 group-hover/card:text-sky-500 transition-colors">
                        {link.label}
                      </h4>
                      <p className="text-[9px] font-bold uppercase tracking-widest text-slate-400 group-hover/card:text-slate-500 transition-colors leading-tight">
                        {link.sub}
                      </p>
                    </div>

                    {/* Animated bottom bar */}
                    <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-1 bg-sky-500 rounded-full group-hover/card:w-12 transition-all duration-500 opacity-0 group-hover/card:opacity-100" />
                  </div>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Global Security Ticker removed as requested */}
      </section>

      <Footer />
    </main>
  );
}
