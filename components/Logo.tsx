'use client';
import Link from 'next/link';
import { Shield } from 'lucide-react';

interface LogoProps {
  className?: string;
  showText?: boolean;
}

export function Logo({ className = "", showText = true }: LogoProps) {
  return (
    <Link href="/" className={`flex items-center gap-2.5 group ${className}`}>
      <div className="relative w-10 h-10 rounded-xl bg-sky-600 dark:bg-sky-500 flex items-center justify-center transition-all duration-500 group-hover:rotate-[360deg] shadow-lg shadow-sky-600/20">
        <Shield className="w-6 h-6 text-white fill-current" />
        <div className="absolute -top-1 -right-1 w-3 h-3 bg-white dark:bg-sky-400 rounded-full border-2 border-sky-600 dark:border-sky-900 animate-pulse" />
      </div>
      {showText && (
        <div className="flex flex-col">
          <span className="text-xl font-black tracking-tight text-slate-900 dark:text-white leading-tight transition-colors">
            ELECTRO<span className="text-sky-600 dark:text-sky-500">SHIELD</span>
          </span>
          <span className="text-[10px] font-bold text-slate-500 dark:text-white/40 tracking-[0.2em] uppercase leading-tight">
            National Registry
          </span>
        </div>
      )}
    </Link>
  );
}
