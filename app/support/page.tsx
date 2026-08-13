'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { ScrollReveal } from '@/components/ScrollReveal';
import { 
  ShieldCheck, 
  HelpCircle, 
  Mail, 
  Phone, 
  MessageCircle, 
  FileText, 
  Smartphone,
  Shield,
  Key,
  AlertTriangle,
  Users,
  Clock,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Send,
  Gift,
  BarChart3,
  Award,
  Globe,
  Lock,
  Zap,
  Loader2,
  Search,
  PlusCircle,
  ShieldAlert
} from 'lucide-react';
import Image from 'next/image';

interface FAQItem {
  id: number;
  question: string;
  answer: string;
  category: string;
}

const faqs: FAQItem[] = [
  {
    id: 1,
    category: "getting-started",
    question: "How do I register my device?",
    answer: "To register a device, click on 'Register Device' from your dashboard. You'll need to provide basic information like brand, model, serial number (optional), and IMEI for phones. You can also upload proof of purchase for warranty purposes. The process takes less than 2 minutes."
  },
  {
    id: 2,
    category: "getting-started",
    question: "What information do I need to register a device?",
    answer: "You'll need: Device brand and model, Serial number (recommended), IMEI number for phones (dial *#06# to find it), Color (optional), Purchase date and price (optional for protection score)."
  },
  {
    id: 3,
    category: "transfers",
    question: "How do I transfer a device to someone else?",
    answer: "Go to 'My Devices', find the device, click 'Generate Transfer Code'. Share the 6-digit code with the recipient. They enter the code at /accept-transfer. The transfer completes instantly. Codes expire in 7 days."
  },
  {
    id: 4,
    category: "transfers",
    question: "Can I cancel a pending transfer?",
    answer: "Yes. Go to 'My Devices', find the device with 'Pending Transfer' status, click 'Cancel Transfer' from the actions menu. The device will remain in your account."
  },
  {
    id: 5,
    category: "security",
    question: "What happens when I report a device stolen?",
    answer: "Your device is immediately added to the national blacklist. It becomes visible to law enforcement and registered second-hand dealers. You'll get a claim number for insurance purposes. If recovered, you can mark it as recovered."
  },
  {
    id: 6,
    category: "security",
    question: "How does the protection score work?",
    answer: "Your protection score (0-100%) measures how well your device is protected. It factors in: Registration completeness (serial/IMEI), Purchase documentation, Report status (stolen devices lose points), Transfer status. Higher score means better protection."
  },
  {
    id: 7,
    category: "claims",
    question: "How do I file a theft claim?",
    answer: "Click 'Report Stolen/Lost' from your device's action menu. Fill in incident details (date, location, description). Optionally provide police case number. You can also offer a reward for recovery. Submit for review."
  },
  {
    id: 8,
    category: "claims",
    question: "How long does claim review take?",
    answer: "Claims are typically reviewed within 24-48 hours. You'll receive notifications when your claim status changes. For urgent cases, contact support directly."
  },
  {
    id: 9,
    category: "account",
    question: "How do I reset my password?",
    answer: "Click 'Forgot password?' on the login page. Enter your email, answer your security questions, then set a new password. Make sure your new password is at least 6 characters."
  },
  {
    id: 10,
    category: "account",
    question: "How do I update my security questions?",
    answer: "Go to Profile → Security tab. Click 'Edit' next to Security Questions. You can change your questions and answers. Remember to save your changes."
  },
  {
    id: 11,
    category: "transfers",
    question: "What happens if a transfer code expires?",
    answer: "Transfer codes expire after 7 days. If expired, the recipient cannot claim the device. You'll need to generate a new code. The device remains in your account."
  },
  {
    id: 12,
    category: "security",
    question: "Can I transfer a reported device?",
    answer: "No. Devices reported as stolen or lost cannot be transferred until marked as recovered. This prevents fraudulent transfers of stolen property."
  },
  {
    id: 13,
    category: "getting-started",
    question: "Is ElectroShield free?",
    answer: "Basic protection is free forever, including device registration, ownership certificates, and public listing. Premium plans offer additional features like theft compensation, priority support, and unlimited devices."
  },
  {
    id: 14,
    category: "account",
    question: "How do I delete my account?",
    answer: "Contact support to request account deletion. You'll need to verify your identity. Note that device ownership history may be retained for legal purposes."
  }
];

const categories = [
  { id: "all", label: "All Questions", icon: HelpCircle },
  { id: "getting-started", label: "Getting Started", icon: Smartphone },
  { id: "transfers", label: "Device Transfers", icon: Send },
  { id: "security", label: "Security & Protection", icon: Shield },
  { id: "claims", label: "Claims", icon: AlertTriangle },
  { id: "account", label: "Account", icon: Users },
];

const quickLinks = [
  { title: "Device Registration", href: "#", icon: PlusCircle, color: "from-blue-500 to-cyan-500" },
  { title: "Report Theft", href: "#", icon: ShieldAlert, color: "from-rose-500 to-pink-500" },
  { title: "Transfer Device", href: "#", icon: Send, color: "from-indigo-500 to-purple-500" },
  { title: "Accept Transfer", href: "#", icon: Gift, color: "from-emerald-500 to-teal-500" },
  { title: "View Claims", href: "#", icon: FileText, color: "from-amber-500 to-orange-500" },
  { title: "Transfer History", href: "#", icon: BarChart3, color: "from-purple-500 to-indigo-500" },
];

export default function SupportPage() {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [openFaqId, setOpenFaqId] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [contactForm, setContactForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });

  const filteredFaqs = faqs.filter(faq => {
    const matchesCategory = selectedCategory === "all" || faq.category === selectedCategory;
    const matchesSearch = searchQuery === "" || 
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) || 
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    alert("Message sent! Our support team will respond within 24 hours.");
    setContactForm({ name: "", email: "", subject: "", message: "" });
    setIsSubmitting(false);
  };

  return (
    <main className="min-h-screen bg-white dark:bg-[#020617] selection:bg-sky-500/30 font-sans">
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-6 overflow-hidden min-h-[60vh] flex items-center">
        <div className="absolute inset-0 z-0">
          <Image 
            src="https://images.pexels.com/photos/814499/pexels-photo-814499.jpeg"
            alt="Support Background"
            fill
            className="object-cover opacity-60 dark:opacity-30"
            priority
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-slate-900/40 dark:bg-[#020617]/80 backdrop-blur-[2px]" />
        </div>

        <div className="absolute inset-0 z-[1] pointer-events-none overflow-hidden">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
        </div>

        <div className="max-w-7xl mx-auto relative z-10 w-full text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-white/10 border border-white/20 mb-8 backdrop-blur-md"
          >
            <HelpCircle className="w-4 h-4 text-sky-400" />
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-white">Support Command Center</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tighter text-white leading-[0.85] mb-10"
          >
            HOW CAN WE <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 via-sky-200 to-white">ASSIST YOU?</span>
          </motion.h1>

          {/* Large Search Bar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="max-w-2xl mx-auto relative px-4"
          >
            <div className="relative group">
              <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-6 h-6 text-slate-400 group-focus-within:text-sky-400 transition-colors" />
              <input 
                type="text"
                placeholder="Search for answers, protocols, or device issues..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-16 pr-8 py-6 rounded-3xl bg-white/10 dark:bg-white/5 border border-white/20 dark:border-white/10 text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500/50 backdrop-blur-xl transition-all"
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Quick Actions Grid */}
      <section className="py-20 px-6 max-w-7xl mx-auto -mt-10 relative z-20">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {quickLinks.map((link, i) => (
            <ScrollReveal key={i} delay={i * 0.05}>
              <div className="group bg-white dark:bg-white/[0.02] border border-slate-200 dark:border-white/5 rounded-3xl p-6 hover:border-sky-500/50 hover:bg-slate-50 dark:hover:bg-white/[0.05] transition-all cursor-pointer h-full flex flex-col items-center text-center">
                <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${link.color} flex items-center justify-center text-white mb-4 group-hover:scale-110 transition-transform`}>
                  <link.icon className="w-6 h-6" />
                </div>
                <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-wider">{link.title}</h3>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </section>

      {/* FAQ System */}
      <section className="py-20 px-6 max-w-5xl mx-auto">
        <div className="flex flex-col items-center mb-16">
          <div className="flex items-center gap-3 mb-6">
            <div className="h-[1px] w-12 bg-sky-500" />
            <span className="text-[10px] font-black text-sky-500 uppercase tracking-[0.4em]">Knowledge Base</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white text-center tracking-tighter mb-12">
            FREQUENTLY ASKED <br /> QUESTIONS.
          </h2>

          <div className="flex flex-wrap justify-center gap-2 mb-12">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`flex items-center gap-3 px-6 py-3 rounded-full text-xs font-black uppercase tracking-widest transition-all ${
                  selectedCategory === cat.id 
                    ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-xl' 
                    : 'bg-slate-100 dark:bg-white/5 text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-white/10'
                }`}
              >
                <cat.icon className="w-4 h-4" />
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <AnimatePresence mode="popLayout">
            {filteredFaqs.length > 0 ? (
              filteredFaqs.map((faq) => (
                <motion.div
                  layout
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  key={faq.id}
                  className={`bg-white dark:bg-white/[0.02] border border-slate-200 dark:border-white/5 rounded-3xl overflow-hidden transition-all ${
                    openFaqId === faq.id ? 'ring-2 ring-sky-500/30 border-sky-500/50' : ''
                  }`}
                >
                  <button
                    onClick={() => setOpenFaqId(openFaqId === faq.id ? null : faq.id)}
                    className="w-full px-8 py-6 flex items-center justify-between text-left group"
                  >
                    <span className="text-lg font-black text-slate-900 dark:text-white tracking-tight group-hover:text-sky-500 transition-colors">
                      {faq.question}
                    </span>
                    <div className={`p-2 rounded-xl bg-slate-100 dark:bg-white/5 group-hover:bg-sky-500/10 transition-colors ${
                      openFaqId === faq.id ? 'bg-sky-500 text-white dark:text-white' : 'text-slate-400'
                    }`}>
                      {openFaqId === faq.id ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                    </div>
                  </button>
                  <AnimatePresence>
                    {openFaqId === faq.id && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                      >
                        <div className="px-8 pb-8 text-slate-600 dark:text-slate-400 font-medium leading-relaxed">
                          {faq.answer}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))
            ) : (
              <div className="text-center py-20 bg-slate-50 dark:bg-white/[0.01] rounded-[3rem] border border-dashed border-slate-200 dark:border-white/10">
                <Search className="w-12 h-12 text-slate-300 dark:text-slate-700 mx-auto mb-4" />
                <p className="text-slate-400 font-bold uppercase tracking-widest text-sm">No protocols found matching your query.</p>
              </div>
            )}
          </AnimatePresence>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-20 px-6 max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12">
          {/* Contact Details */}
          <div className="space-y-12">
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="h-[1px] w-12 bg-sky-500" />
                <span className="text-[10px] font-black text-sky-500 uppercase tracking-[0.4em]">Direct Communication</span>
              </div>
              <h2 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tighter mb-8 leading-none">
                UPLINK TO OUR <br /> SUPPORT CORE.
              </h2>
              <p className="text-slate-600 dark:text-slate-400 text-lg font-medium leading-relaxed max-w-md">
                Can&apos;t find what you need? Our neural support specialists are on standby to handle your security inquiries.
              </p>
            </div>

            <div className="space-y-6">
              <div className="flex items-center gap-6 p-6 rounded-3xl bg-slate-50 dark:bg-white/[0.02] border border-slate-200 dark:border-white/5 hover:border-sky-500/30 transition-colors group">
                <div className="w-14 h-14 rounded-2xl bg-sky-500/10 flex items-center justify-center text-sky-500 group-hover:scale-110 transition-transform">
                  <Mail className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Secure Email</h4>
                  <p className="text-slate-900 dark:text-white font-black text-lg">support@electroshield.ai</p>
                </div>
              </div>

              <div className="flex items-center gap-6 p-6 rounded-3xl bg-slate-50 dark:bg-white/[0.02] border border-slate-200 dark:border-white/5 hover:border-indigo-500/30 transition-colors group">
                <div className="w-14 h-14 rounded-2xl bg-indigo-500/10 flex items-center justify-center text-indigo-500 group-hover:scale-110 transition-transform">
                  <Phone className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Global Hotline</h4>
                  <p className="text-slate-900 dark:text-white font-black text-lg">+267 98 765 432</p>
                </div>
              </div>

              <div className="flex items-center gap-6 p-6 rounded-3xl bg-slate-50 dark:bg-white/[0.02] border border-slate-200 dark:border-white/5 hover:border-emerald-500/30 transition-colors group">
                <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-500 group-hover:scale-110 transition-transform">
                  <MessageCircle className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Live Interface</h4>
                  <p className="text-slate-900 dark:text-white font-black text-lg">Active 24/7/365</p>
                </div>
              </div>
            </div>
            
            {/* Trust Badges */}
            <div className="pt-8 flex flex-wrap gap-6 items-center border-t border-slate-200 dark:border-white/5 opacity-60">
              <div className="flex items-center gap-2">
                <Lock className="w-4 h-4 text-emerald-500" />
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">E2E Encrypted</span>
              </div>
              <div className="flex items-center gap-2">
                <Globe className="w-4 h-4 text-sky-500" />
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Global Registry</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-indigo-500" />
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Police Integrated</span>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-slate-900 p-8 md:p-12 rounded-[3.5rem] relative overflow-hidden text-white">
            {/* Background design */}
            <div className="absolute top-0 right-0 p-12 opacity-10">
               <ShieldCheck className="w-64 h-64 -mr-20 -mt-20" />
            </div>

            <h3 className="text-3xl font-black mb-8 relative z-10 tracking-tight">TRANSMIT PROTOCOL.</h3>
            
            <form onSubmit={handleContactSubmit} className="space-y-6 relative z-10">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">Operator Name</label>
                  <input 
                    type="text"
                    required
                    placeholder="Identify yourself..."
                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 focus:outline-none focus:ring-2 focus:ring-sky-500 transition-all font-medium"
                    value={contactForm.name}
                    onChange={e => setContactForm({...contactForm, name: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">Uplink Address (Email)</label>
                  <input 
                    type="email"
                    required
                    placeholder="address@secure.node"
                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 focus:outline-none focus:ring-2 focus:ring-sky-500 transition-all font-medium"
                    value={contactForm.email}
                    onChange={e => setContactForm({...contactForm, email: e.target.value})}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">Transmission Subject</label>
                <input 
                  type="text"
                  required
                  placeholder="Subject of inquiry..."
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 focus:outline-none focus:ring-2 focus:ring-sky-500 transition-all font-medium"
                  value={contactForm.subject}
                  onChange={e => setContactForm({...contactForm, subject: e.target.value})}
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">Data Payload (Message)</label>
                <textarea 
                  required
                  rows={4}
                  placeholder="Detail your request..."
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 focus:outline-none focus:ring-2 focus:ring-sky-500 transition-all font-medium resize-none"
                  value={contactForm.message}
                  onChange={e => setContactForm({...contactForm, message: e.target.value})}
                />
              </div>

              <button 
                type="submit"
                disabled={isSubmitting}
                className="w-full py-5 bg-white text-slate-950 font-black text-sm uppercase tracking-[0.3em] rounded-2xl hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:scale-100 flex items-center justify-center gap-3"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Transmitting...
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5" />
                    Execute Uplink
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
