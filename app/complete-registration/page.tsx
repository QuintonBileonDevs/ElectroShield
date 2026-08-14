'use client';
import { motion, AnimatePresence } from "motion/react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Shield, ArrowRight, ArrowLeft, ChevronDown, Check, Loader2 } from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Logo } from "@/components/Logo";
import { useState, useRef, useEffect } from "react";
import { ACCOUNT_TYPES, PUBLIC_ACCOUNT_TYPES, ACCOUNT_FIELDS } from "@/lib/account-types";
import { useAuth } from "@/components/auth-provider";
import { doc, setDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

export default function CompleteRegistrationPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [selectedType, setSelectedType] = useState<string | null>('individual');
  const [step, setStep] = useState<number>(1);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<Record<string, string>>({});
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleNext = () => {
    if (selectedType) {
      setStep(2);
    }
  };

  const handleBack = () => {
    setStep(1);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedType) return;
    setIsSubmitting(true);

    try {
      if (user?.id) {
        await setDoc(doc(db, "users", user.id), {
          role: selectedType,
          accountType: selectedType,
          profileCompleted: true,
          updatedAt: new Date().toISOString(),
          displayName: formData.full_name || user.name,
          email: formData.email || user.email,
          ...formData
        }, { merge: true });
      }
      localStorage.setItem("mock_account_type", selectedType);
    } catch (err) {
      console.warn("Could not save to firestore:", err);
    } finally {
      setIsSubmitting(false);
      router.push('/dashboard');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col selection:bg-sky-200 dark:selection:bg-sky-900 overflow-hidden relative">
      {/* Decorative Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Grid pattern */}
        <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.07]" 
             style={{ backgroundImage: 'radial-gradient(circle, currentColor 1px, transparent 1px)', backgroundSize: '32px 32px' }} />
        
        {/* Large ambient glows */}
        <div className="absolute -top-[20%] -right-[10%] w-[60%] h-[60%] bg-sky-500/10 dark:bg-sky-500/20 blur-[120px] rounded-full" />
        <div className="absolute -bottom-[20%] -left-[10%] w-[60%] h-[60%] bg-blue-600/10 dark:bg-blue-600/20 blur-[120px] rounded-full" />
        
        {/* Decorative scanline or subtle moving element */}
        <motion.div 
          animate={{ y: [0, 1000] }}
          transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
          className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-sky-500/20 to-transparent z-0"
        />
      </div>

      {/* Top Nav (Minimal) */}
      <div className="absolute top-0 w-full p-6 flex justify-between items-center z-50">
        <Logo />
        <ThemeToggle />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center justify-start p-6 pt-24 md:pt-32 relative z-10 w-full max-w-3xl mx-auto mb-12">
        
        {/* Progress Tracker */}
        <div className="w-full max-w-md mb-12 flex items-center justify-between relative">
           <div className="absolute top-1/2 left-0 w-full h-[2px] bg-slate-200 dark:bg-white/5 -translate-y-1/2 -z-10" />
           <div 
             className="absolute top-1/2 left-0 h-[2px] bg-gradient-to-r from-sky-600 to-sky-400 -translate-y-1/2 -z-10 transition-all duration-700 ease-out" 
             style={{ width: step === 1 ? '5%' : '100%' }}
           />
           
           {[1, 2].map((i) => (
             <div key={i} className="relative">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black font-mono transition-all duration-500 relative z-10
                  ${step >= i 
                    ? 'bg-sky-600 text-white shadow-[0_0_20px_rgba(2,132,199,0.3)] scale-110' 
                    : 'bg-white dark:bg-slate-900 text-slate-400 border-2 border-slate-200 dark:border-white/5'}
                `}>
                  {step > i ? <Check className="w-6 h-6 stroke-[3]" /> : i.toString().padStart(2, '0')}
                </div>
                {step >= i && (
                  <motion.div 
                    layoutId="pulse"
                    className="absolute inset-0 rounded-2xl bg-sky-500/20 animate-ping -z-0"
                  />
                )}
             </div>
           ))}
        </div>

        <motion.div 
          className="w-full bg-white/80 dark:bg-slate-900/60 backdrop-blur-2xl p-8 md:p-14 rounded-[3rem] shadow-2xl border border-white dark:border-white/10 relative z-20 min-h-[500px] flex flex-col group overflow-hidden"
          layout
        >
           {/* Cybernetic Accent Lines */}
           <div className="absolute top-0 left-0 w-24 h-24 pointer-events-none">
             <div className="absolute top-8 left-8 w-12 h-[2px] bg-sky-500/30" />
             <div className="absolute top-8 left-8 w-[2px] h-12 bg-sky-500/30" />
           </div>
           <div className="absolute bottom-0 right-0 w-24 h-24 pointer-events-none">
             <div className="absolute bottom-8 right-8 w-12 h-[2px] bg-sky-500/30" />
             <div className="absolute bottom-8 right-8 w-[2px] h-12 bg-sky-500/30" />
           </div>

           <AnimatePresence mode="wait">
             {step === 1 && (
               <motion.div
                 key="step1"
                 initial={{ opacity: 0, scale: 0.98, filter: "blur(10px)" }}
                 animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                 exit={{ opacity: 0, scale: 1.02, filter: "blur(10px)" }}
                 transition={{ duration: 0.5, ease: "easeOut" }}
                 className="flex flex-col flex-1"
               >
                  <div className="text-center mb-12">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-xl bg-sky-500/10 text-sky-600 dark:text-sky-400 text-xs font-black uppercase tracking-[0.2em] mb-6">
                      <Shield className="w-3.5 h-3.5" /> Identity Setup
                    </div>
                    <h2 className="text-4xl font-black text-slate-900 dark:text-white tracking-tighter mb-4">Initialize Account</h2>
                    <p className="text-slate-500 dark:text-slate-400 text-lg font-medium max-w-lg mx-auto leading-relaxed">
                      Select your operational identity to begin Secure Device Management protocol.
                    </p>
                  </div>

                  <div className="relative mb-8 z-50 px-4" ref={dropdownRef}>
                    <button
                      type="button"
                      onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                      className={`w-full text-left p-6 rounded-[2rem] border-2 transition-all duration-500 flex items-center justify-between group/btn relative overflow-hidden backdrop-blur-sm
                        ${selectedType 
                          ? 'border-sky-500 bg-sky-500/5 shadow-[0_0_40px_-12px_rgba(14,165,233,0.3)] text-slate-900 dark:text-white' 
                          : 'border-slate-200 dark:border-white/5 hover:border-sky-500/30 bg-slate-50 dark:bg-white/5 text-slate-700 dark:text-slate-300'}
                      `}
                    >
                      {/* Button scanning light effect */}
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover/btn:translate-x-full transition-transform duration-1000 ease-in-out" />
                      
                      {selectedType ? (
                        <div className="flex items-center gap-5 relative z-10">
                          {(() => {
                            const type = ACCOUNT_TYPES.find(t => t.id === selectedType);
                            const Icon = type?.icon || Shield;
                            return (
                              <>
                                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center border-2 shadow-inner group-hover/btn:scale-110 transition-transform duration-500 ${type?.color}`}>
                                  <Icon className="w-7 h-7" />
                                </div>
                                <div className="min-w-0">
                                  <div className="font-black text-xl tracking-tight truncate">{type?.title}</div>
                                  <div className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest truncate opacity-70">{type?.description}</div>
                                </div>
                              </>
                            );
                          })()}
                        </div>
                      ) : (
                        <div className="flex items-center gap-4 relative z-10">
                          <div className="w-12 h-12 rounded-2xl bg-slate-200 dark:bg-white/5 flex items-center justify-center">
                            <Shield className="w-6 h-6 text-slate-400" />
                          </div>
                          <span className="text-lg font-black tracking-tight text-slate-400">Select Operational Role</span>
                        </div>
                      )}
                      
                      <div className={`p-2 rounded-xl bg-slate-100 dark:bg-white/5 transition-all duration-300 ${isDropdownOpen ? 'rotate-180 bg-sky-500/20 text-sky-500' : ''}`}>
                        <ChevronDown className="w-6 h-6" />
                      </div>
                    </button>

                    <AnimatePresence>
                      {isDropdownOpen && (
                        <motion.div
                          initial={{ opacity: 0, y: 10, scale: 0.95 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 10, scale: 0.95 }}
                          className="absolute top-[calc(100%+12px)] left-0 w-full bg-white/90 dark:bg-slate-900/90 backdrop-blur-3xl border border-slate-200 dark:border-white/10 rounded-[2.5rem] shadow-[0_25px_50px_-12px_rgba(0,0,0,0.5)] z-50 overflow-hidden"
                        >
                          <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[420px] overflow-y-auto custom-scrollbar">
                            {PUBLIC_ACCOUNT_TYPES.map((type) => {
                              const Icon = type.icon;
                              const isSelected = selectedType === type.id;
                              return (
                                <button
                                  key={type.id}
                                  onClick={() => {
                                    setSelectedType(type.id);
                                    setIsDropdownOpen(false);
                                  }}
                                  className={`flex items-center gap-4 p-5 rounded-2xl transition-all duration-300 text-left relative group/item
                                    ${isSelected 
                                      ? 'bg-sky-600 text-white shadow-xl shadow-sky-600/20' 
                                      : 'hover:bg-slate-50 dark:hover:bg-white/5 border border-transparent hover:border-sky-500/20'}
                                  `}
                                >
                                  <div className={`w-12 h-12 rounded-xl flex-shrink-0 flex items-center justify-center border-2 transition-transform duration-500 group-hover/item:rotate-6
                                    ${isSelected ? 'bg-white/20 border-white/30 text-white' : type.color}
                                  `}>
                                    <Icon className="w-6 h-6" />
                                  </div>
                                  <div className="flex-1 min-w-0 pr-6">
                                    <div className={`font-black text-base tracking-tight truncate ${isSelected ? 'text-white' : 'text-slate-900 dark:text-white'}`}>
                                      {type.title}
                                    </div>
                                    <div className={`text-[10px] uppercase font-bold tracking-widest truncate ${isSelected ? 'text-white/70' : 'text-slate-500 dark:text-slate-400'}`}>
                                      {type.description}
                                    </div>
                                  </div>
                                  {isSelected && <Check className="absolute right-5 top-1/2 -translate-y-1/2 w-5 h-5 text-white flex-shrink-0" />}
                                </button>
                              );
                            })}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Informational notice for Government, Businesses and Service Providers */}
                  <div className="mx-4 p-4 rounded-2xl bg-slate-100/80 dark:bg-slate-800/40 border border-slate-200/60 dark:border-white/5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-xl bg-sky-500/10 text-sky-600 dark:text-sky-400 flex items-center justify-center shrink-0">
                        <Shield className="w-4 h-4" />
                      </div>
                      <p className="text-slate-600 dark:text-slate-350 leading-relaxed font-medium">
                        <strong className="text-slate-900 dark:text-white font-bold">Looking for Org Accounts?</strong> Government, Businesses &amp; Service Providers must be registered by a System Administrator.
                      </p>
                    </div>
                    <Link href="/admin" className="px-3.5 py-1.5 bg-sky-600/10 hover:bg-sky-600 hover:text-white text-sky-600 dark:text-sky-400 rounded-xl font-bold uppercase tracking-wider text-[11px] transition-all whitespace-nowrap shrink-0">
                      Admin Console &rarr;
                    </Link>
                  </div>

                  <div className="flex justify-end mt-auto pt-12">
                    <motion.button 
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={handleNext}
                      disabled={!selectedType}
                      className="bg-sky-600 hover:bg-sky-500 disabled:bg-slate-200 dark:disabled:bg-white/5 disabled:text-slate-400 text-white px-10 py-5 rounded-2xl font-black text-lg tracking-tight transition-all flex items-center gap-3 group relative overflow-hidden"
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out" />
                      Establish Identity
                      <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
                    </motion.button>
                  </div>
               </motion.div>
             )}

             {step === 2 && (
               <motion.div
                 key="step2"
                 initial={{ opacity: 0, x: 50, filter: "blur(10px)" }}
                 animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
                 exit={{ opacity: 0, x: -50, filter: "blur(10px)" }}
                 transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                 className="flex-1 flex flex-col"
               >
                  <div className="mb-12 flex items-center justify-between">
                    <div>
                      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-black uppercase tracking-[0.2em] mb-6">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" /> Data Entry Mode
                      </div>
                      <h2 className="text-4xl font-black text-slate-900 dark:text-white tracking-tighter mb-4">Complete Profile</h2>
                      <p className="text-slate-500 dark:text-slate-400 text-lg font-medium leading-relaxed">
                        Input details for {selectedType === 'individual' ? 'personal authorization' : 'organizational oversight'}.
                      </p>
                    </div>
                    <button 
                      onClick={handleBack} 
                      className="w-14 h-14 rounded-2xl bg-slate-100 dark:bg-white/5 flex items-center justify-center text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-white/10 transition-all group"
                    >
                      <ArrowLeft className="w-7 h-7 group-hover:-translate-x-1 transition-transform" />
                    </button>
                  </div>

                  <form className="space-y-8 flex-1 flex flex-col" onSubmit={handleSubmit}>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                      {selectedType && ACCOUNT_FIELDS[selectedType]?.fields.map((field: any) => {
                        const Icon = field.icon;
                        const isFullWidth = field.type === "text" && field.name.includes("address");
                        const val = formData[field.name] || (field.name === 'full_name' ? user?.name : field.name === 'email' ? user?.email : '') || '';
                        const isAutoFilled = (field.name === 'full_name' || field.name === 'email') && Boolean(val);
                        
                        return (
                          <div key={field.name} className={`space-y-3 ${isFullWidth ? 'md:col-span-2' : ''}`}>
                             <label className="text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] flex items-center justify-between px-1">
                               <span>{field.label}</span>
                               {isAutoFilled ? (
                                 <span className="text-[10px] font-bold text-sky-500 dark:text-sky-400 tracking-normal flex items-center gap-1">
                                   <Check className="w-3 h-3 stroke-[3]" /> Auto-filled
                                 </span>
                               ) : !field.required ? (
                                 <span className="text-[10px] font-bold text-slate-300 dark:text-white/20 tracking-normal">(OPTIONAL)</span>
                               ) : null}
                             </label>
                             <div className="relative group/input">
                               <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none transition-colors group-focus-within/input:text-sky-500">
                                 <Icon className="h-5 w-5 text-slate-400 dark:text-slate-600" />
                               </div>
                               
                               {field.type === "select" ? (
                                 <div className="relative">
                                   <select 
                                     required={field.required}
                                     value={val}
                                     onChange={(e) => setFormData(prev => ({ ...prev, [field.name]: e.target.value }))}
                                     className="w-full pl-14 pr-12 py-5 bg-slate-50 dark:bg-black/20 border-2 border-slate-200 dark:border-white/5 rounded-2xl text-slate-900 dark:text-white focus:outline-none focus:ring-4 focus:ring-sky-500/10 focus:border-sky-500 transition-all font-bold tracking-tight appearance-none cursor-pointer"
                                   >
                                     <option value="" disabled>Select Parameter</option>
                                     {field.options.map((opt: any) => (
                                       <option key={opt.value} value={opt.value}>{opt.label}</option>
                                     ))}
                                   </select>
                                   <div className="absolute inset-y-0 right-0 pr-5 flex items-center pointer-events-none">
                                     <ChevronDown className="h-6 h-6 text-slate-400" />
                                   </div>
                                 </div>
                               ) : (
                                 <input 
                                   type={field.type} 
                                   placeholder={field.placeholder} 
                                   required={field.required}
                                   value={val}
                                   onChange={(e) => setFormData(prev => ({ ...prev, [field.name]: e.target.value }))}
                                   className="w-full pl-14 pr-5 py-5 bg-slate-50 dark:bg-black/20 border-2 border-slate-200 dark:border-white/5 rounded-2xl text-slate-900 dark:text-white focus:outline-none focus:ring-4 focus:ring-sky-500/10 focus:border-sky-500 transition-all font-bold tracking-tight placeholder:text-slate-300 dark:placeholder:text-slate-700"
                                 />
                               )}

                               {/* Bottom reveal line */}
                               <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-[2px] bg-sky-500 group-focus-within/input:w-[80%] transition-all duration-500 rounded-full" />
                             </div>
                          </div>
                        );
                      })}
                    </div>

                    <div className="pt-12 mt-auto flex flex-col sm:flex-row gap-6">
                      <button 
                        type="button"
                        onClick={handleBack}
                        className="flex-1 bg-slate-100 hover:bg-slate-200 dark:bg-white/5 dark:hover:bg-white/10 text-slate-700 dark:text-slate-300 py-5 rounded-2xl font-black text-lg tracking-tight transition-all flex items-center justify-center border border-transparent dark:border-white/5"
                      >
                        Adjust Identity
                      </button>
                      <motion.button 
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        type="submit"
                        className="flex-[2] bg-sky-600 hover:bg-sky-500 text-white py-5 rounded-3xl font-black text-xl tracking-tight transition-all shadow-[0_20px_40px_-10px_rgba(14,165,233,0.4)] relative overflow-hidden group"
                      >
                        <div className="absolute inset-0 bg-white/10 translate-x-full group-hover:-translate-x-full transition-transform duration-1000 ease-in-out" />
                        <span className="relative z-10 flex items-center justify-center gap-3">
                          Verify & Finalize
                          <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center">
                            <Check className="w-4 h-4 stroke-[4]" />
                          </div>
                        </span>
                      </motion.button>
                    </div>
                  </form>
               </motion.div>
             )}
           </AnimatePresence>
        </motion.div>

        {/* Security Notice Footer */}
        <div className="mt-12 flex flex-col items-center gap-4 text-center">
          <div className="flex items-center gap-6 px-6 py-3 rounded-[2rem] bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/5">
            <div className="flex -space-x-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-800 border-2 border-white dark:border-slate-950 flex items-center justify-center overflow-hidden">
                  <Image src={`https://picsum.photos/seed/${i + 40}/100/100`} width={32} height={32} alt="Verified user" className="opacity-80" />
                </div>
              ))}
            </div>
            <p className="text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest">
              Join <span className="text-sky-600 dark:text-sky-400">850K+</span> verified agents on the secure network
            </p>
          </div>
          <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400">
             <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
             ENCRYPTED DATA TRANSMISSION ACTIVE (AES-256)
          </div>
        </div>
      </div>
    </div>
  );
}
