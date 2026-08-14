'use client';

import React, { useState, useEffect, useRef } from 'react';
import { 
  Bell, 
  ShieldAlert, 
  ShieldCheck, 
  Repeat2, 
  AlertTriangle, 
  Info, 
  Check, 
  CheckCheck, 
  Trash2, 
  ExternalLink, 
  Volume2, 
  VolumeX, 
  Sparkles,
  X
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useAuth } from '@/components/auth-provider';
import { 
  collection, 
  query, 
  onSnapshot, 
  orderBy, 
  limit 
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { 
  AppNotification, 
  markNotificationAsRead, 
  markAllNotificationsAsRead, 
  deleteNotification,
  sendNotification
} from '@/lib/notifications';
import Link from 'next/link';

// Play subtle modern chime using Web Audio API
function playAlertChime(priority: 'critical' | 'high' | 'normal') {
  if (typeof window === 'undefined') return;
  try {
    const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContext) return;
    const ctx = new AudioContext();
    const now = ctx.currentTime;
    
    if (priority === 'critical') {
      // Double urgent tone
      const osc1 = ctx.createOscillator();
      const gain1 = ctx.createGain();
      osc1.type = 'triangle';
      osc1.frequency.setValueAtTime(880, now); // A5
      osc1.frequency.setValueAtTime(1174.66, now + 0.12); // D6
      gain1.gain.setValueAtTime(0.15, now);
      gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
      osc1.connect(gain1);
      gain1.connect(ctx.destination);
      osc1.start(now);
      osc1.stop(now + 0.35);
    } else {
      // Soft clean chime
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(587.33, now); // D5
      osc.frequency.exponentialRampToValueAtTime(880, now + 0.15); // A5
      gain.gain.setValueAtTime(0.12, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.3);
    }
  } catch (err) {
    // Audio policy might block until first user gesture; ignore safely
  }
}

function formatRelativeTime(isoString: string): string {
  try {
    const date = new Date(isoString);
    const now = new Date();
    const diffSec = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffSec < 60) return "Just now";
    if (diffSec < 3600) return `${Math.floor(diffSec / 60)}m ago`;
    if (diffSec < 86400) return `${Math.floor(diffSec / 3600)}h ago`;
    if (diffSec < 604800) return `${Math.floor(diffSec / 86400)}d ago`;
    return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
  } catch {
    return "Recent";
  }
}

export function NotificationCenter() {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [filter, setFilter] = useState<'all' | 'unread' | 'critical'>('all');
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [toastAlert, setToastAlert] = useState<AppNotification | null>(null);
  
  const dropdownRef = useRef<HTMLDivElement>(null);
  const isFirstLoad = useRef(true);
  const seenIds = useRef<Set<string>>(new Set());

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Real-time Firestore Listener for notifications
  useEffect(() => {
    // Listen to notifications collection
    const notifsQuery = query(
      collection(db, "notifications"),
      orderBy("createdAt", "desc"),
      limit(50)
    );

    const unsubscribe = onSnapshot(notifsQuery, (snapshot) => {
      const items: AppNotification[] = [];
      let latestNewAlert: AppNotification | null = null;

      snapshot.docs.forEach((docSnap) => {
        const data = docSnap.data() as AppNotification;
        const notif: AppNotification = {
          ...data,
          id: docSnap.id
        };

        // Filter for this user: user id match, recipient match, or global broadcast
        const isForUser = 
          !notif.userId || 
          notif.userId === 'all' || 
          (user?.id && notif.userId === user.id) ||
          (user?.email && notif.recipient === user.email);

        if (isForUser) {
          items.push(notif);

          // Check if this is a brand new incoming unread item after initial load
          if (!isFirstLoad.current && !seenIds.current.has(docSnap.id) && !notif.read) {
            latestNewAlert = notif;
          }
          seenIds.current.add(docSnap.id);
        }
      });

      setNotifications(items);

      // Trigger live toast alert and sound chime on new notifications
      if (latestNewAlert && !isFirstLoad.current) {
        setToastAlert(latestNewAlert);
        if (soundEnabled) {
          playAlertChime((latestNewAlert as AppNotification).priority);
        }
        // Auto dismiss toast after 6 seconds
        setTimeout(() => {
          setToastAlert((curr) => (curr?.id === (latestNewAlert as AppNotification).id ? null : curr));
        }, 6000);
      }

      if (isFirstLoad.current) {
        isFirstLoad.current = false;
      }
    }, (error) => {
      console.warn("Real-time notifications listener notice:", error.message);
    });

    return () => unsubscribe();
  }, [user?.id, user?.email, soundEnabled]);

  const unreadCount = notifications.filter(n => !n.read).length;

  const filteredNotifications = notifications.filter(n => {
    if (filter === 'unread') return !n.read;
    if (filter === 'critical') return n.priority === 'critical' || n.type === 'theft_alert' || n.type === 'security';
    return true;
  });

  const handleMarkAllRead = async () => {
    const unreadIds = notifications.filter(n => !n.read && n.id).map(n => n.id!);
    if (unreadIds.length > 0) {
      await markAllNotificationsAsRead(unreadIds);
    }
  };

  const getIcon = (type: string, priority: string) => {
    if (priority === 'critical' || type === 'theft_alert') {
      return <ShieldAlert className="w-4 h-4 text-rose-500" />;
    }
    if (type === 'transfer') {
      return <Repeat2 className="w-4 h-4 text-indigo-500" />;
    }
    if (type === 'registry' || type === 'security') {
      return <ShieldCheck className="w-4 h-4 text-emerald-500" />;
    }
    if (type === 'warning') {
      return <AlertTriangle className="w-4 h-4 text-amber-500" />;
    }
    return <Info className="w-4 h-4 text-sky-500" />;
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Real-time Bell Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`relative p-2.5 rounded-xl transition-all border ${
          isOpen
            ? 'bg-sky-50 dark:bg-slate-800 border-sky-500/30 text-sky-600 dark:text-sky-400 shadow-sm'
            : 'bg-slate-100/80 dark:bg-slate-900/80 hover:bg-slate-200/80 dark:hover:bg-slate-800 border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-300'
        }`}
        title="Real-time Alerts & Notifications"
        aria-label="Real-time Notifications"
      >
        <Bell className="w-5 h-5" />
        
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-rose-500 px-1 text-[10px] font-black text-white shadow-md animate-pulse">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </button>

      {/* Floating Live Toast Popup Banner for New Incoming Notifications */}
      <AnimatePresence>
        {toastAlert && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            transition={{ duration: 0.25 }}
            className={`fixed top-20 right-4 sm:right-8 z-[100] max-w-md w-[calc(100vw-2rem)] p-4 rounded-2xl shadow-2xl backdrop-blur-xl border ${
              toastAlert.priority === 'critical'
                ? 'bg-rose-950/90 border-rose-500/40 text-rose-100'
                : 'bg-slate-900/95 border-sky-500/40 text-slate-100'
            }`}
          >
            <div className="flex items-start gap-3">
              <div className={`p-2 rounded-xl shrink-0 ${
                toastAlert.priority === 'critical' ? 'bg-rose-500/20 text-rose-400' : 'bg-sky-500/20 text-sky-400'
              }`}>
                {getIcon(toastAlert.type, toastAlert.priority)}
              </div>
              <div className="flex-1 min-w-0 pr-2">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-black tracking-wider uppercase px-2 py-0.5 rounded-md bg-white/10">
                    REAL-TIME ALERT
                  </span>
                  <span className="text-[10px] text-slate-400">Just now</span>
                </div>
                <h4 className="text-sm font-bold mt-1 text-white truncate">{toastAlert.title}</h4>
                <p className="text-xs text-slate-300 mt-0.5 line-clamp-2">{toastAlert.message}</p>
                {toastAlert.actionUrl && (
                  <div className="mt-2.5 flex items-center gap-3">
                    <Link
                      href={toastAlert.actionUrl}
                      onClick={() => {
                        if (toastAlert.id) markNotificationAsRead(toastAlert.id);
                        setToastAlert(null);
                      }}
                      className="inline-flex items-center gap-1 text-xs font-bold text-sky-400 hover:text-sky-300 underline"
                    >
                      {toastAlert.actionLabel || "View Details"}
                      <ExternalLink className="w-3 h-3" />
                    </Link>
                  </div>
                )}
              </div>
              <button
                onClick={() => setToastAlert(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/10"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Notifications Dropdown Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.98 }}
            transition={{ duration: 0.18 }}
            className="absolute right-0 top-full mt-3 w-[360px] sm:w-[420px] max-w-[calc(100vw-1.5rem)] rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-2xl z-50 overflow-hidden flex flex-col max-h-[80vh]"
          >
            {/* Header */}
            <div className="p-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/40">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-lg bg-sky-500/10 text-sky-600 dark:text-sky-400">
                    <Bell className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                      Notifications
                      {unreadCount > 0 && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20">
                          {unreadCount} unread
                        </span>
                      )}
                    </h3>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">
                      Live Firestore Event Stream
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setSoundEnabled(!soundEnabled)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                    title={soundEnabled ? "Mute alert chimes" : "Enable alert chimes"}
                  >
                    {soundEnabled ? <Volume2 className="w-4 h-4 text-sky-500" /> : <VolumeX className="w-4 h-4" />}
                  </button>
                  {unreadCount > 0 && (
                    <button
                      onClick={handleMarkAllRead}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-emerald-500 hover:bg-emerald-50 dark:hover:bg-slate-800 transition-colors"
                      title="Mark all as read"
                    >
                      <CheckCheck className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>

              {/* Filter Tabs */}
              <div className="flex items-center gap-1.5 mt-3">
                <button
                  onClick={() => setFilter('all')}
                  className={`px-3 py-1 rounded-xl text-xs font-bold transition-all ${
                    filter === 'all'
                      ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-xs'
                      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  All ({notifications.length})
                </button>
                <button
                  onClick={() => setFilter('unread')}
                  className={`px-3 py-1 rounded-xl text-xs font-bold transition-all ${
                    filter === 'unread'
                      ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-xs'
                      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  Unread ({unreadCount})
                </button>
                <button
                  onClick={() => setFilter('critical')}
                  className={`px-3 py-1 rounded-xl text-xs font-bold transition-all ${
                    filter === 'critical'
                      ? 'bg-rose-600 text-white shadow-xs'
                      : 'text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30'
                  }`}
                >
                  Critical
                </button>
              </div>
            </div>

            {/* List */}
            <div className="flex-1 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800/60 custom-scrollbar">
              {filteredNotifications.length === 0 ? (
                <div className="py-12 px-4 text-center">
                  <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-slate-800/60 text-slate-400 flex items-center justify-center mx-auto mb-3">
                    <Bell className="w-6 h-6 opacity-40" />
                  </div>
                  <p className="text-sm font-bold text-slate-700 dark:text-slate-300">No notifications</p>
                  <p className="text-xs text-slate-400 mt-1 max-w-xs mx-auto">
                    You&apos;re all caught up! Real-time alerts for device transfers, police hotlists, and status updates will stream here.
                  </p>
                </div>
              ) : (
                filteredNotifications.map((notif) => (
                  <div
                    key={notif.id || notif.createdAt}
                    className={`p-3.5 transition-colors relative group ${
                      !notif.read
                        ? 'bg-sky-50/40 dark:bg-sky-950/15'
                        : 'hover:bg-slate-50/80 dark:hover:bg-slate-800/40'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`p-2 rounded-xl shrink-0 mt-0.5 ${
                        notif.priority === 'critical' || notif.type === 'theft_alert'
                          ? 'bg-rose-500/10 text-rose-500 border border-rose-500/20'
                          : notif.type === 'transfer'
                          ? 'bg-indigo-500/10 text-indigo-500 border border-indigo-500/20'
                          : notif.type === 'registry'
                          ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20'
                          : 'bg-sky-500/10 text-sky-500 border border-sky-500/20'
                      }`}>
                        {getIcon(notif.type, notif.priority)}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-baseline justify-between gap-2">
                          <h4 className={`text-xs font-bold truncate ${
                            !notif.read ? 'text-slate-900 dark:text-white' : 'text-slate-700 dark:text-slate-300'
                          }`}>
                            {notif.title}
                          </h4>
                          <span className="text-[10px] text-slate-400 shrink-0 font-medium">
                            {formatRelativeTime(notif.createdAt)}
                          </span>
                        </div>

                        <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">
                          {notif.message}
                        </p>

                        <div className="flex items-center justify-between mt-2.5 pt-2 border-t border-slate-100 dark:border-slate-800/40">
                          {notif.actionUrl ? (
                            <Link
                              href={notif.actionUrl}
                              onClick={() => {
                                if (notif.id && !notif.read) markNotificationAsRead(notif.id);
                                setIsOpen(false);
                              }}
                              className="inline-flex items-center gap-1 text-[11px] font-bold text-sky-600 dark:text-sky-400 hover:underline"
                            >
                              {notif.actionLabel || "View Action"}
                              <ExternalLink className="w-3 h-3" />
                            </Link>
                          ) : (
                            <span />
                          )}

                          <div className="flex items-center gap-1">
                            {!notif.read && notif.id && (
                              <button
                                onClick={() => markNotificationAsRead(notif.id!)}
                                className="p-1 rounded-md text-slate-400 hover:text-emerald-500 hover:bg-emerald-50 dark:hover:bg-slate-800"
                                title="Mark as read"
                              >
                                <Check className="w-3.5 h-3.5" />
                              </button>
                            )}
                            {notif.id && (
                              <button
                                onClick={() => deleteNotification(notif.id!)}
                                className="p-1 rounded-md text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-slate-800"
                                title="Delete"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Footer */}
            {notifications.length > 0 && (
              <div className="p-2.5 bg-slate-50 dark:bg-slate-950/60 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-500">
                <span className="flex items-center gap-1.5 font-medium text-emerald-600 dark:text-emerald-400">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  Live Event Stream Connected
                </span>
                <span className="text-[10px] text-slate-400 font-mono">
                  AUTO-SYNC
                </span>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
