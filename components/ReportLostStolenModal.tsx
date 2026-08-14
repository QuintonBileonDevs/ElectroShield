'use client';

import React, { useState, useEffect, useSyncExternalStore } from 'react';
import { createPortal } from 'react-dom';

const emptySubscribe = () => () => {};
const useIsMounted = () =>
  useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );
import { motion, AnimatePresence } from 'motion/react';
import { ShieldAlert, AlertTriangle, X, Lock, CheckCircle2, Smartphone, FileText, MapPin, Radio, ShieldX, Coins, Gift, Phone, Tag } from 'lucide-react';
import { useAuth } from '@/components/auth-provider';
import { collection, query, where, getDocs, updateDoc, doc, addDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

interface ReportLostStolenModalProps {
  isOpen: boolean;
  onClose: () => void;
  preSelectedDeviceId?: string;
  onSuccess?: () => void;
}

export function ReportLostStolenModal({ isOpen, onClose, preSelectedDeviceId, onSuccess }: ReportLostStolenModalProps) {
  const { user } = useAuth();
  const [userDevices, setUserDevices] = useState<any[]>([]);
  const [selectedDeviceId, setSelectedDeviceId] = useState<string>('');
  
  // Form fields
  const [incidentType, setIncidentType] = useState<'stolen' | 'lost'>('stolen');
  const [customName, setCustomName] = useState('');
  const [serialImei, setSerialImei] = useState('');
  const [policeCase, setPoliceCase] = useState('');
  const [location, setLocation] = useState('');
  const [notes, setNotes] = useState('');

  // Reward Incentive state
  const [hasReward, setHasReward] = useState(false);
  const [rewardAmount, setRewardAmount] = useState('500');
  const [rewardContact, setRewardContact] = useState('');
  const [rewardNotes, setRewardNotes] = useState('Payable upon physical return to nearest police station or owner contact.');

  const [submitting, setSubmitting] = useState(false);
  const [submittedCaseCode, setSubmittedCaseCode] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState('');

  const mounted = useIsMounted();

  // Prefill contact if available
  useEffect(() => {
    if (isOpen && user) {
      if (user.email && !rewardContact) {
        setRewardContact(user.email);
      }
    }
  }, [isOpen, user]);

  // Fetch user devices on open
  useEffect(() => {
    if (isOpen && user?.id) {
      const fetchDevices = async () => {
        try {
          const q = query(collection(db, "devices"), where("ownerId", "==", user.id));
          const snap = await getDocs(q);
          const list: any[] = snap.docs.map(d => ({ id: d.id, ...(d.data() as object) }));
          setUserDevices(list);
          if (preSelectedDeviceId) {
            setSelectedDeviceId(preSelectedDeviceId);
            const found = list.find((d: any) => d.id === preSelectedDeviceId);
            if (found) {
              setCustomName(found.name || '');
              setSerialImei(found.serial || '');
            }
          } else if (list.length > 0) {
            setSelectedDeviceId(list[0].id);
            setCustomName(list[0].name || '');
            setSerialImei(list[0].serial || '');
          }
        } catch (err) {
          console.warn("Error fetching user devices for report modal:", err);
        }
      };
      fetchDevices();
    }
  }, [isOpen, user?.id, preSelectedDeviceId]);

  // When selected device changes
  const handleDeviceChange = (devId: string) => {
    setSelectedDeviceId(devId);
    if (devId === 'manual') {
      setCustomName('');
      setSerialImei('');
    } else {
      const found = userDevices.find(d => d.id === devId);
      if (found) {
        setCustomName(found.name || '');
        setSerialImei(found.serial || '');
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!serialImei.trim()) {
      setErrorMessage('Please provide a valid IMEI or Serial Number.');
      return;
    }

    setSubmitting(true);
    setErrorMessage('');

    try {
      const caseCode = `BP-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
      const cleanSerial = serialImei.trim();

      // Format reward string
      const formattedReward = hasReward
        ? (rewardAmount.trim().toUpperCase().startsWith('P') || rewardAmount.trim().toUpperCase().startsWith('BWP')
            ? rewardAmount.trim()
            : `P ${rewardAmount.trim() || '500'}`)
        : null;

      // 1. UPDATE/MARK ENTIRE REGISTRY DEVICES
      // Search devices by selected ID, serial, or imei
      const targetDocIds = new Set<string>();
      if (selectedDeviceId && selectedDeviceId !== 'manual') {
        targetDocIds.add(selectedDeviceId);
      }

      const qSerial = query(collection(db, "devices"), where("serial", "==", cleanSerial));
      const qImei = query(collection(db, "devices"), where("imei", "==", cleanSerial));
      const [snapSerial, snapImei] = await Promise.all([getDocs(qSerial), getDocs(qImei)]);

      snapSerial.docs.forEach(d => targetDocIds.add(d.id));
      snapImei.docs.forEach(d => targetDocIds.add(d.id));

      if (targetDocIds.size > 0) {
        // Update all matched devices in registry
        for (const devId of targetDocIds) {
          await updateDoc(doc(db, "devices", devId), {
            status: incidentType, // 'stolen' or 'lost'
            is_blacklisted: true,
            lastSync: "Just now",
            lockReason: incidentType === 'stolen' ? `Police Theft Alert - Case ${caseCode}` : 'Reported Lost by Owner',
            reportedAt: new Date().toISOString(),
            hasReward: hasReward,
            rewardAmount: formattedReward,
            rewardContact: rewardContact.trim() || user?.email || '',
            rewardNotes: rewardNotes.trim()
          });
        }
      } else {
        // Create new device entry in registry marked lost/stolen
        await addDoc(collection(db, "devices"), {
          name: customName.trim() || "Reported Mobile Asset",
          brand: "Registered Asset",
          serial: cleanSerial,
          imei: cleanSerial,
          status: incidentType,
          is_blacklisted: true,
          ownerId: user?.id || "external_reporter",
          ownerName: user?.name || user?.email || "Citizen Reporter",
          value: "P 2,500",
          type: "Phone",
          lastSync: "Just now",
          lockReason: incidentType === 'stolen' ? `Police Theft Alert - Case ${caseCode}` : 'Reported Lost by Owner',
          reportedAt: new Date().toISOString(),
          hasReward: hasReward,
          rewardAmount: formattedReward,
          rewardContact: rewardContact.trim() || user?.email || '',
          rewardNotes: rewardNotes.trim()
        });
      }

      // 2. LOG IN NATIONAL POLICE THEFT REGISTRY (policeThefts)
      await addDoc(collection(db, "policeThefts"), {
        case: caseCode,
        model: customName.trim() || "Registered Mobile Asset",
        imei: cleanSerial,
        serial: cleanSerial,
        reporter: user?.name || user?.email || "Citizen Report",
        reporterContact: rewardContact.trim() || user?.email || "",
        date: new Date().toLocaleDateString('en-GB'),
        policeCaseId: policeCase.trim() || caseCode,
        location: location.trim() || "Unspecified",
        status: incidentType,
        hasReward: hasReward,
        rewardAmount: formattedReward,
        rewardContact: rewardContact.trim() || user?.email || "",
        rewardNotes: rewardNotes.trim(),
        notes: notes.trim(),
        timestamp: new Date().toISOString()
      });

      // 3. LOG IN TELECOM MNO BLOCKLIST REGISTRY (mnoBlocklists)
      await addDoc(collection(db, "mnoBlocklists"), {
        imei: cleanSerial,
        serial: cleanSerial,
        device: customName.trim() || "Mobile Device",
        status: incidentType,
        operator: "All National MNOs (Bomanet, Mascom, Orange)",
        hasReward: hasReward,
        rewardAmount: formattedReward,
        rewardContact: rewardContact.trim() || user?.email || "",
        reason: incidentType === 'stolen' ? `Police Theft Case ${caseCode}` : 'Reported Lost by Owner',
        timestamp: new Date().toISOString()
      });

      setSubmittedCaseCode(caseCode);
      if (onSuccess) onSuccess();
    } catch (err: any) {
      console.error("Error submitting theft report:", err);
      setErrorMessage(err?.message || "Failed to submit theft report. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleResetAndClose = () => {
    setSubmittedCaseCode(null);
    setErrorMessage('');
    onClose();
  };

  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleResetAndClose}
            className="fixed inset-0 bg-slate-950/80 backdrop-blur-md"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl overflow-hidden z-10 my-auto"
          >
          {/* Header Banner */}
          <div className="p-6 border-b border-slate-100 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-900/50 flex items-start justify-between">
            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-500 flex items-center justify-center shrink-0">
                <ShieldAlert className="w-5 h-5" />
              </div>
              <div>
                <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-rose-500/10 text-rose-600 dark:text-rose-400 text-[10px] font-extrabold uppercase tracking-wider mb-0.5">
                  <Radio className="w-3 h-3 text-rose-500" /> Emergency Lockdown System
                </div>
                <h2 className="text-lg font-bold text-slate-900 dark:text-white tracking-tight">Report Lost or Stolen Asset</h2>
              </div>
            </div>

            <button
              onClick={handleResetAndClose}
              className="w-8 h-8 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 flex items-center justify-center text-slate-500 dark:text-slate-400 transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Modal Body */}
          <div className="p-6 sm:p-8 space-y-6">
            {submittedCaseCode ? (
              /* Success View */
              <div className="text-center py-4 space-y-5">
                <div className="w-16 h-16 bg-rose-500/10 text-rose-500 rounded-3xl flex items-center justify-center mx-auto border border-rose-500/20 shadow-lg">
                  <CheckCircle2 className="w-10 h-10" />
                </div>
                <div>
                  <h3 className="text-xl font-black uppercase text-slate-900 dark:text-white">
                    Emergency Alert Broadcasted
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto mt-1">
                    Your device status has been set to <strong className="text-rose-500 uppercase">{incidentType}</strong> across national carrier towers, law enforcement registries, and second-hand merchant databases.
                  </p>
                </div>

                <div className="p-4 bg-slate-100 dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-slate-700/60 text-left space-y-2.5">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-400 font-bold uppercase">Case Reference ID</span>
                    <span className="font-mono font-black text-rose-500">{submittedCaseCode}</span>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-400 font-bold uppercase">Device Serial/IMEI</span>
                    <span className="font-mono font-bold text-slate-800 dark:text-white">{serialImei}</span>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-400 font-bold uppercase">Global Registry Status</span>
                    <span className="text-rose-500 font-extrabold uppercase flex items-center gap-1">
                      <Lock className="w-3 h-3" /> Marked {incidentType.toUpperCase()}
                    </span>
                  </div>

                  {hasReward ? (
                    <div className="pt-2 border-t border-slate-200 dark:border-slate-700/80 flex justify-between items-center text-xs">
                      <span className="text-amber-600 dark:text-amber-400 font-black uppercase flex items-center gap-1">
                        <Coins className="w-3.5 h-3.5" /> Recovery Reward Offered
                      </span>
                      <span className="font-mono font-black text-amber-600 dark:text-amber-400 px-2 py-0.5 rounded bg-amber-500/10 border border-amber-500/20">
                        {rewardAmount ? (rewardAmount.toUpperCase().startsWith('P') || rewardAmount.toUpperCase().startsWith('BWP') ? rewardAmount : `P ${rewardAmount}`) : 'P 500'}
                      </span>
                    </div>
                  ) : (
                    <div className="pt-2 border-t border-slate-200 dark:border-slate-700/80 flex justify-between items-center text-xs text-slate-400">
                      <span>Recovery Reward:</span>
                      <span>None Attached</span>
                    </div>
                  )}
                </div>

                <button
                  onClick={handleResetAndClose}
                  className="w-full py-4 bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-100 text-white dark:text-slate-900 font-black uppercase text-xs tracking-widest rounded-2xl transition-all shadow-xl cursor-pointer"
                >
                  Return to Dashboard
                </button>
              </div>
            ) : (
              /* Report Form */
              <form onSubmit={handleSubmit} className="space-y-5">
                {errorMessage && (
                  <div className="p-3.5 bg-rose-500/10 border border-rose-500/20 text-rose-500 text-xs font-bold rounded-xl flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 shrink-0" />
                    <span>{errorMessage}</span>
                  </div>
                )}

                {/* Incident Type Toggle */}
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-wider text-slate-400 mb-2">
                    Incident Classification
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setIncidentType('stolen')}
                      className={`p-3.5 rounded-2xl border-2 font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer ${
                        incidentType === 'stolen'
                          ? 'bg-rose-500/10 border-rose-500 text-rose-600 dark:text-rose-400 shadow-md shadow-rose-500/10'
                          : 'bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400'
                      }`}
                    >
                      <ShieldX className="w-4 h-4" /> Stolen (Theft Alert)
                    </button>
                    <button
                      type="button"
                      onClick={() => setIncidentType('lost')}
                      className={`p-3.5 rounded-2xl border-2 font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer ${
                        incidentType === 'lost'
                          ? 'bg-amber-500/10 border-amber-500 text-amber-600 dark:text-amber-400 shadow-md shadow-amber-500/10'
                          : 'bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400'
                      }`}
                    >
                      <AlertTriangle className="w-4 h-4" /> Lost (Caution Flag)
                    </button>
                  </div>
                </div>

                {/* Device Selection */}
                {userDevices.length > 0 && (
                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-wider text-slate-400 mb-1.5">
                      Select Registered Device
                    </label>
                    <select
                      value={selectedDeviceId}
                      onChange={(e) => handleDeviceChange(e.target.value)}
                      className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-900 dark:text-white outline-none focus:border-rose-500"
                    >
                      {userDevices.map((d) => (
                        <option key={d.id} value={d.id}>
                          {d.name} ({d.serial}) - {d.status || 'Secured'}
                        </option>
                      ))}
                      <option value="manual">+ Enter Serial/IMEI Manually</option>
                    </select>
                  </div>
                )}

                {/* Manual Device Name & IMEI */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-wider text-slate-400 mb-1.5 flex items-center gap-1">
                      <Smartphone className="w-3.5 h-3.5 text-slate-400" /> Device Name / Model
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. iPhone 15 Pro Max"
                      value={customName}
                      onChange={(e) => setCustomName(e.target.value)}
                      className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-900 dark:text-white outline-none focus:border-rose-500"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-wider text-slate-400 mb-1.5 flex items-center gap-1">
                      <FileText className="w-3.5 h-3.5 text-slate-400" /> Serial or IMEI Number *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. 358941018902830"
                      value={serialImei}
                      onChange={(e) => setSerialImei(e.target.value)}
                      className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-mono font-bold text-slate-900 dark:text-white outline-none focus:border-rose-500"
                    />
                  </div>
                </div>

                {/* RECOVERY REWARD OPTION SECTION */}
                <div className="p-4 bg-amber-500/10 border border-amber-500/20 rounded-2xl space-y-3">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
                        <Coins className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="text-xs font-black uppercase tracking-wide text-slate-900 dark:text-white">
                          Offer Recovery Reward (Finder&apos;s Fee)
                        </h4>
                        <p className="text-[10px] text-slate-500 dark:text-slate-400">
                          Incentivize finders, police, and pawn shops to return device safely.
                        </p>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => setHasReward(!hasReward)}
                      className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors cursor-pointer ${
                        hasReward ? 'bg-amber-500' : 'bg-slate-300 dark:bg-slate-700'
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          hasReward ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>

                  {hasReward && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="pt-3 space-y-3 border-t border-amber-500/20"
                    >
                      <div>
                        <label className="block text-[10px] font-black uppercase tracking-wider text-amber-700 dark:text-amber-400 mb-1 flex items-center gap-1">
                          <Coins className="w-3 h-3" /> Reward Amount (BWP / Pula) *
                        </label>
                        <div className="relative">
                          <span className="absolute left-3.5 top-1/2 -translate-y-1/2 font-black text-xs text-amber-600 dark:text-amber-400">P</span>
                          <input
                            type="number"
                            min="50"
                            step="50"
                            required={hasReward}
                            placeholder="500"
                            value={rewardAmount}
                            onChange={(e) => setRewardAmount(e.target.value)}
                            className="w-full pl-8 pr-4 py-2.5 bg-white dark:bg-slate-900 border border-amber-500/30 rounded-xl text-xs font-mono font-bold text-slate-900 dark:text-white outline-none focus:border-amber-500"
                          />
                        </div>
                        {/* Presets */}
                        <div className="flex flex-wrap items-center gap-1.5 mt-2">
                          <span className="text-[9px] font-bold uppercase text-slate-400">Presets:</span>
                          {['250', '500', '1000', '2500', '5000'].map((preset) => (
                            <button
                              key={preset}
                              type="button"
                              onClick={() => setRewardAmount(preset)}
                              className={`px-2.5 py-1 rounded-lg text-[10px] font-mono font-bold transition-all cursor-pointer ${
                                rewardAmount === preset
                                  ? 'bg-amber-500 text-white shadow-xs'
                                  : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:border-amber-500'
                              }`}
                            >
                              P {preset}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-[10px] font-black uppercase tracking-wider text-slate-400 mb-1 flex items-center gap-1">
                            <Phone className="w-3 h-3 text-slate-400" /> Recovery Contact Phone / Email *
                          </label>
                          <input
                            type="text"
                            required={hasReward}
                            placeholder="e.g. +267 71 234 567"
                            value={rewardContact}
                            onChange={(e) => setRewardContact(e.target.value)}
                            className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-900 dark:text-white outline-none focus:border-amber-500"
                          />
                        </div>

                        <div>
                          <label className="block text-[10px] font-black uppercase tracking-wider text-slate-400 mb-1 flex items-center gap-1">
                            <Gift className="w-3 h-3 text-slate-400" /> Claim Terms (Optional)
                          </label>
                          <input
                            type="text"
                            placeholder="e.g. Return to nearest police station"
                            value={rewardNotes}
                            onChange={(e) => setRewardNotes(e.target.value)}
                            className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white outline-none focus:border-amber-500"
                          />
                        </div>
                      </div>
                    </motion.div>
                  )}
                </div>

                {/* Police Case & Incident Location */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-wider text-slate-400 mb-1.5 flex items-center gap-1">
                      <FileText className="w-3.5 h-3.5 text-slate-400" /> Police Case ID (Optional)
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. GAB-2026-9811"
                      value={policeCase}
                      onChange={(e) => setPoliceCase(e.target.value)}
                      className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-mono text-slate-900 dark:text-white outline-none focus:border-rose-500"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-wider text-slate-400 mb-1.5 flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" /> Incident Location
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Gaborone Station Mall"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-900 dark:text-white outline-none focus:border-rose-500"
                    />
                  </div>
                </div>

                {/* Additional Notes */}
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-wider text-slate-400 mb-1.5">
                    Incident Details / Circumstances
                  </label>
                  <textarea
                    rows={2}
                    placeholder="Provide additional details regarding the loss or theft to assist recovery..."
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white outline-none focus:border-rose-500"
                  />
                </div>

                {/* Submit Action */}
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-3.5 bg-rose-600 hover:bg-rose-500 text-white font-bold uppercase text-xs tracking-wider rounded-xl transition-all shadow-md shadow-rose-600/20 flex items-center justify-center gap-2 active:scale-[0.98] disabled:opacity-50 cursor-pointer"
                >
                  {submitting ? (
                    <span>Broadcasting Lockdown Alert...</span>
                  ) : (
                    <>
                      <ShieldAlert className="w-4 h-4" />
                      <span>
                        Broadcast Lockdown {hasReward ? `& Active P ${rewardAmount} Reward` : ''}
                      </span>
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </motion.div>
      </div>
    )}
    </AnimatePresence>,
    document.body
  );
}

