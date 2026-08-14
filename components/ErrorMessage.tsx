'use client';

import React from 'react';
import { AlertCircle, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { formatFirebaseError } from '@/lib/utils';

interface ErrorMessageProps {
  error: any;
  onDismiss?: () => void;
  className?: string;
  title?: string;
}

export function ErrorMessage({ error, onDismiss, className = "", title }: ErrorMessageProps) {
  if (!error) return null;

  const formattedMsg = typeof error === 'string' && !error.toLowerCase().includes('firebase') && !error.includes('auth/')
    ? error
    : formatFirebaseError(error);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -6, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -6, scale: 0.98 }}
        transition={{ duration: 0.2 }}
        className={`p-4 bg-rose-500/10 dark:bg-rose-500/15 border border-rose-500/20 dark:border-rose-500/30 rounded-2xl flex items-start gap-3.5 text-rose-700 dark:text-rose-300 text-xs md:text-sm font-medium shadow-sm relative overflow-hidden backdrop-blur-sm ${className}`}
      >
        <div className="p-1.5 bg-rose-500/20 dark:bg-rose-500/30 rounded-xl text-rose-600 dark:text-rose-400 shrink-0 mt-0.5 shadow-inner">
          <AlertCircle className="w-4 h-4 stroke-[2.5]" />
        </div>
        
        <div className="flex-1 leading-relaxed min-w-0 pr-1">
          {title && (
            <div className="font-bold text-rose-800 dark:text-rose-200 text-xs uppercase tracking-wider mb-0.5">
              {title}
            </div>
          )}
          <p className="text-rose-700 dark:text-rose-300 font-semibold tracking-tight text-xs md:text-sm">
            {formattedMsg}
          </p>
        </div>

        {onDismiss && (
          <button
            type="button"
            onClick={onDismiss}
            className="text-rose-400 hover:text-rose-700 dark:hover:text-rose-200 transition-colors p-1 rounded-lg hover:bg-rose-500/10 shrink-0"
            aria-label="Dismiss error message"
          >
            <X className="w-4 h-4 stroke-[2.5]" />
          </button>
        )}
      </motion.div>
    </AnimatePresence>
  );
}
