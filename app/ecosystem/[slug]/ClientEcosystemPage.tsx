"use client";
import { useParams } from "next/navigation";
import { 
  User, Users, Store, Building, Landmark, FileText, 
  GraduationCap, Recycle, Wrench, Smartphone, Code, Scale,
  CheckCircle2, ArrowRight, Mail, ShieldCheck, Trophy, Coins,
  LogIn, UserPlus
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import Link from "next/link";
import Image from "next/image";
import { Navbar } from "@/components/Navbar";

// We'll reuse the footer from layout or place it at bottom
import { Footer } from "@/components/Footer";

const ecosystemData: Record<string, any> = {
  individuals: {
    title: "Individual Protection",
    icon: User,
    color: "text-[#99C24D]",
    bg: "bg-[#99C24D]/10",
    btn: "bg-[#99C24D]",
    btnHover: "hover:bg-[#99C24D]/90",
    shadow: "shadow-[#99C24D]/20",
    borderHover: "hover:border-[#99C24D]/50 dark:hover:border-[#99C24D]/50",
    dashBtn: "bg-indigo-600 hover:bg-indigo-700 shadow-indigo-600/20",
    desc: "Secure your personal devices with the national registry. Get ownership certificates and priority recovery assistance.",
    heroImage: "https://images.pexels.com/photos/15951300/pexels-photo-15951300.jpeg",
    features: [
      "Digital Ownership Certificates",
      "Instant Theft Flagging",
      "Global Status Verification",
      "Community Recovery Network"
    ],
    pricing: [
      { name: "Basic", price: "P0", features: ["1 Device", "Public Registry", "Loss Reporting"] },
      { name: "Pro", price: "P29/mo", features: ["3 Devices", "Secret Engraving", "Theft Coverage"] }
    ]
  },
  families: {
    title: "Family Security",
    icon: Users,
    color: "text-[#77966D]",
    bg: "bg-[#77966D]/10",
    btn: "bg-[#77966D]",
    btnHover: "hover:bg-[#77966D]/90",
    shadow: "shadow-[#77966D]/20",
    borderHover: "hover:border-[#77966D]/50 dark:hover:border-[#77966D]/50",
    dashBtn: "bg-rose-600 hover:bg-rose-700 shadow-rose-600/20",
    desc: "One dashboard for the whole household. Protect your children's devices and shared family assets.",
    heroImage: "https://images.pexels.com/photos/16564512/pexels-photo-16564512.jpeg",
    features: [
      "Multi-device Management",
      "Family Safety Alerts",
      "Shared Ownership Trails",
      "Priority Support"
    ],
    pricing: [
      { name: "Family Standard", price: "P49/mo", features: ["5 Devices", "Full Protection", "Family Dashboard"] },
      { name: "Family Plus", price: "P89/mo", features: ["10 Devices", "Premium Recovery", "GPS Tracking"] }
    ]
  },
  retailers: {
    title: "Retail Partner Portal",
    icon: Store,
    color: "text-[#EE6C4D]",
    bg: "bg-[#EE6C4D]/10",
    btn: "bg-[#EE6C4D]",
    btnHover: "hover:bg-[#EE6C4D]/90",
    shadow: "shadow-[#EE6C4D]/20",
    borderHover: "hover:border-[#EE6C4D]/50 dark:hover:border-[#EE6C4D]/50",
    dashBtn: "bg-teal-600 hover:bg-teal-700 shadow-teal-600/20",
    desc: "Pre-register stock and provide instant protection to your customers at the point of sale.",
    heroImage: "https://images.pexels.com/photos/11297769/pexels-photo-11297769.jpeg",
    features: [
      "Bulk IMEI/Serial Upload",
      "Instant Ownership Transfer",
      "Supply Chain Verification",
      "Customer Trust Badges"
    ],
    pricing: [
      { name: "Retail Starter", price: "P199/mo", features: ["Up to 100 units/mo", "Basic API", "Store Dashboard"] },
      { name: "Retail Pro", price: "P499/mo", features: ["Unlimited units", "Full API Access", "Priority Support"] }
    ]
  },
  enterprises: {
    title: "Corporate Asset Management",
    icon: Building,
    color: "text-[#FFBA49]",
    bg: "bg-[#FFBA49]/10",
    btn: "bg-[#FFBA49]",
    btnHover: "hover:bg-[#FFBA49]/90",
    shadow: "shadow-[#FFBA49]/20",
    borderHover: "hover:border-[#FFBA49]/50 dark:hover:border-[#FFBA49]/50",
    dashBtn: "bg-blue-600 hover:bg-blue-700 shadow-blue-600/20",
    desc: "Comprehensive fleet management for corporate laptops, phones, and high-value equipment.",
    heroImage: "https://images.pexels.com/photos/4678286/pexels-photo-4678286.jpeg",
    features: [
      "Asset Lifecycle Tracking",
      "Employee Assignment Logs",
      "Insurance Integration",
      "Audit-ready Reports"
    ],
    pricing: [
      { name: "Business", price: "P299/mo", features: ["Up to 50 Assets", "Standard Reports", "Email Support"] },
      { name: "Enterprise", price: "Custom", features: ["Unlimited Assets", "Custom Integrations", "Dedicated Manager"] }
    ]
  },
  burs: {
    title: "BURS Portal",
    icon: Landmark,
    color: "text-[#561D25] dark:text-[#993341]",
    bg: "bg-[#561D25]/10 dark:bg-[#993341]/20",
    btn: "bg-[#561D25] dark:bg-[#993341]",
    btnHover: "hover:bg-[#561D25]/90 dark:hover:bg-[#993341]/90",
    shadow: "shadow-[#561D25]/20 dark:shadow-[#993341]/20",
    borderHover: "hover:border-[#561D25]/50 dark:hover:border-[#993341]/50",
    dashBtn: "bg-amber-600 hover:bg-amber-700 shadow-amber-600/20",
    desc: "Monitor device movements across Botswana's borders to prevent illegal trade and verify tax compliance.",
    heroImage: "https://images.pexels.com/photos/1036623/pexels-photo-1036623.jpeg",
    features: [
      "Border Crossing Verification",
      "Import/Export Audit Trails",
      "Real-time Status Checks",
      "Anti-smuggling Tools"
    ],
    pricing: [
      { name: "Agency Access", price: "Gov Tier", features: ["Full Border Access", "National Registry Sync", "Secure API"] }
    ]
  },
  insurance: {
    title: "Insurance Verification",
    icon: FileText,
    color: "text-[#461220] dark:text-[#82213B]",
    bg: "bg-[#461220]/10 dark:bg-[#82213B]/20",
    btn: "bg-[#461220] dark:bg-[#82213B]",
    btnHover: "hover:bg-[#461220]/90 dark:hover:bg-[#82213B]/90",
    shadow: "shadow-[#461220]/20 dark:shadow-[#82213B]/20",
    borderHover: "hover:border-[#461220]/50 dark:hover:border-[#82213B]/50",
    dashBtn: "bg-emerald-600 hover:bg-emerald-700 shadow-emerald-600/20",
    desc: "Streamline claims processing and eliminate fraud with verified ownership and status data.",
    heroImage: "https://images.pexels.com/photos/11391947/pexels-photo-11391947.jpeg",
    features: [
      "Claim Status Verification",
      "Fraud Detection Engine",
      "Settlement Confirmation",
      "Risk Assessment Data"
    ],
    pricing: [
      { name: "Insure Basic", price: "P999/mo", features: ["100 Verifications", "Standard Dashboard", "Fraud Alerts"] },
      { name: "Insure Enterprise", price: "Custom", features: ["Unlimited Access", "Direct API Sync", "Custom Risk Models"] }
    ]
  },
  "academic-institutions": {
    title: "Academic Institutions",
    icon: GraduationCap,
    color: "text-[#FFBC42]",
    bg: "bg-[#FFBC42]/10",
    btn: "bg-[#FFBC42]",
    btnHover: "hover:bg-[#FFBC42]/90",
    shadow: "shadow-[#FFBC42]/20",
    borderHover: "hover:border-[#FFBC42]/50 dark:hover:border-[#FFBC42]/50",
    dashBtn: "bg-violet-600 hover:bg-violet-700 shadow-violet-600/20",
    desc: "Protect tablets, laptops, and lab equipment across your campus. Track student assignments and returns.",
    heroImage: "https://images.pexels.com/photos/5212320/pexels-photo-5212320.jpeg",
    features: [
      "Student Device Tracking",
      "Inventory Management",
      "Loss Prevention Alerts",
      "Parent Notification System"
    ],
    pricing: [
      { name: "Institution Basic", price: "P149/mo", features: ["Up to 100 Devices", "Inventory Tools", "Basic Support"] },
      { name: "Campus Elite", price: "P399/mo", features: ["Unlimited Devices", "Full Tracking", "Priority Recovery"] }
    ]
  },
  ewaste: {
    title: "E-Waste Lifecycle Tracking",
    icon: Recycle,
    color: "text-[#77966D]",
    bg: "bg-[#77966D]/10",
    btn: "bg-[#77966D]",
    btnHover: "hover:bg-[#77966D]/90",
    shadow: "shadow-[#77966D]/20",
    borderHover: "hover:border-[#77966D]/50 dark:hover:border-[#77966D]/50",
    dashBtn: "bg-amber-600 hover:bg-amber-700 shadow-amber-600/20",
    desc: "Ensure devices are recycled responsibly. Track end-of-life disposal and data destruction certificates.",
    heroImage: "https://images.pexels.com/photos/10103289/pexels-photo-10103289.jpeg",
    features: [
      "Disposal Certification",
      "Lifecycle Audit Trails",
      "Environmental Compliance",
      "Data Destruction Logs"
    ],
    pricing: [
      { name: "Collector", price: "P99/mo", features: ["Standard Logging", "Compliance Reports", "Public Profile"] }
    ]
  },
  "repair-centers": {
    title: "Repair Centers",
    icon: Wrench,
    color: "text-[#EE6C4D]",
    bg: "bg-[#EE6C4D]/10",
    btn: "bg-[#EE6C4D]",
    btnHover: "hover:bg-[#EE6C4D]/90",
    shadow: "shadow-[#EE6C4D]/20",
    borderHover: "hover:border-[#EE6C4D]/50 dark:hover:border-[#EE6C4D]/50",
    dashBtn: "bg-blue-600 hover:bg-blue-700 shadow-blue-600/20",
    desc: "Verify ownership before performing repairs. Log service history to increase device resale value.",
    heroImage: "https://images.pexels.com/photos/2582937/pexels-photo-2582937.jpeg",
    features: [
      "Ownership Verification",
      "Service History Logging",
      "Stolen Device Alerts",
      "Trust Certification"
    ],
    pricing: [
      { name: "Shop Basic", price: "P79/mo", features: ["Verification Tool", "Basic Logs", "Trust Badge"] },
      { name: "Service Pro", price: "P199/mo", features: ["Unlimited Logs", "Full History Access", "Marketing Tools"] }
    ]
  },
  mno: {
    title: "MNO Portal",
    icon: Smartphone,
    color: "text-[#99C24D]",
    bg: "bg-[#99C24D]/10",
    btn: "bg-[#99C24D]",
    btnHover: "hover:bg-[#99C24D]/90",
    shadow: "shadow-[#99C24D]/20",
    borderHover: "hover:border-[#99C24D]/50 dark:hover:border-[#99C24D]/50",
    dashBtn: "bg-violet-600 hover:bg-violet-700 shadow-violet-600/20",
    desc: "Direct integration for network-level IMEI blocking and unblocking. Sync with national stolen device lists.",
    heroImage: "https://images.pexels.com/photos/5849577/pexels-photo-5849577.jpeg",
    features: [
      "Network Blacklisting",
      "IMEI Status Sync",
      "Customer Verification",
      "Regulatory Compliance"
    ],
    pricing: [
      { name: "Operator Tier", price: "Custom", features: ["Full Network Sync", "High-speed API", "Compliance Reports"] }
    ]
  },
  "pawn-shops": {
    title: "Pawn Shop Portal",
    icon: Coins,
    color: "text-[#FFBA49]",
    bg: "bg-[#FFBA49]/10",
    btn: "bg-[#FFBA49]",
    btnHover: "hover:bg-[#FFBA49]",
    shadow: "shadow-[#FFBA49]/20",
    borderHover: "hover:border-[#FFBA49]/50 dark:hover:border-[#FFBA49]/50",
    dashBtn: "bg-emerald-600 hover:bg-emerald-700 shadow-emerald-600/20",
    desc: "Verify device ownership instantly before accepting items. Prevent trade in stolen goods and build trust.",
    heroImage: "https://images.pexels.com/photos/5632386/pexels-photo-5632386.jpeg",
    features: [
      "Ownership Verification",
      "Stolen Device Alerts",
      "Transaction Logging",
      "Trust Certification"
    ],
    pricing: [
      { name: "Shop Basic", price: "P99/mo", features: ["Verification Tool", "Basic Logs", "Trust Badge"] },
      { name: "Shop Pro", price: "P199/mo", features: ["Unlimited Logs", "Full History Access", "Marketing Tools"] }
    ]
  },
  developers: {
    title: "Developer API & Webhooks",
    icon: Code,
    color: "text-[#1F271B] dark:text-[#303636]",
    bg: "bg-[#1F271B]/10 dark:bg-[#303636]/20",
    btn: "bg-[#1F271B] dark:bg-[#303636]",
    btnHover: "hover:bg-[#1F271B]/90 dark:hover:bg-[#303636]/90",
    shadow: "shadow-[#1F271B]/20 dark:shadow-[#303636]/20",
    borderHover: "hover:border-[#1F271B]/50 dark:hover:border-[#303636]/50",
    dashBtn: "bg-sky-600 hover:bg-sky-700 shadow-sky-600/20",
    desc: "Build custom asset management solutions using our robust, secure, and well-documented API.",
    heroImage: "https://images.pexels.com/photos/37085305/pexels-photo-37085305.jpeg",
    features: [
      "RESTful API Access",
      "Real-time Webhooks",
      "Sandbox Environment",
      "Technical Support"
    ],
    pricing: [
      { name: "Dev Sandbox", price: "Free", features: ["100 Requests/mo", "Basic Support", "Public API"] },
      { name: "Dev Production", price: "P299/mo", features: ["10k Requests/mo", "Priority Support", "Full Webhooks"] }
    ]
  },
  police: {
    title: "Police Portal",
    icon: Scale,
    color: "text-[#373D20] dark:text-[#555E31]",
    bg: "bg-[#373D20]/10 dark:bg-[#555E31]/20",
    btn: "bg-[#373D20] dark:bg-[#555E31]",
    btnHover: "hover:bg-[#373D20]/90 dark:hover:bg-[#555E31]/90",
    shadow: "shadow-[#373D20]/20 dark:shadow-[#555E31]/20",
    borderHover: "hover:border-[#373D20]/50 dark:hover:border-[#555E31]/50",
    dashBtn: "bg-rose-600 hover:bg-rose-700 shadow-rose-600/20",
    desc: "Specialized tools for police agencies to search, identify, and recover stolen assets efficiently.",
    heroImage: "https://images.pexels.com/photos/4505166/pexels-photo-4505166.jpeg",
    features: [
      "Advanced Search Tools",
      "Recovery Case Management",
      "Agency Audit Logs",
      "Secure Badge 2FA"
    ],
    pricing: [
      { name: "Agency Access", price: "Gov Tier", features: ["Full National Search", "Case Management", "Secure Portal"] }
    ]
  }
};

export function ClientEcosystemPage({ slug }: { slug: string }) {
  const data = ecosystemData[slug];
  const isSelfRegister = slug === "individuals" || slug === "families";

  if (!data) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col">
        <Navbar />
        <div className="flex-1 flex flex-col items-center justify-center p-6">
          <h1 className="text-4xl font-bold tracking-tight text-slate-900 dark:text-white mb-4">Service Not Found</h1>
          <p className="text-slate-500 dark:text-slate-400 mb-8 max-w-md text-center">
            The ecosystem portal you are looking for does not exist or has been moved.
          </p>
          <Link href="/" className="bg-sky-600 hover:bg-sky-700 text-white px-8 py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all">
            Back to Home
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  const Icon = data.icon;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-200 selection:bg-sky-200 dark:selection:bg-sky-900 font-sans flex flex-col overflow-hidden">
      <Navbar />

      <main className="flex-1">
        {/* Hero */}
        <section className="relative pt-32 pb-24 px-4 sm:px-6 lg:px-8 overflow-hidden bg-white dark:bg-slate-950 border-b border-slate-100 dark:border-white/5">
          {data.heroImage && (
            <div className="absolute inset-0 z-0">
              <Image 
                src={data.heroImage} 
                alt={data.title} 
                fill 
                className="object-cover opacity-70 dark:opacity-50"
                priority
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-white dark:from-slate-950 via-white/80 dark:via-slate-950/80 to-transparent" />
              <div className="absolute inset-0 bg-gradient-to-b from-white dark:from-slate-950 via-transparent to-white dark:to-slate-950" />
            </div>
          )}
          <div className="absolute top-0 right-0 -translate-y-12 translate-x-1/3">
            <div className="w-[800px] h-[800px] rounded-full bg-slate-50 dark:bg-slate-900/50 blur-3xl opacity-50 pointer-events-none" />
          </div>
          
          <div className="max-w-7xl mx-auto relative z-10">
            <div className="flex flex-col md:flex-row items-center gap-12 py-12 md:py-24">
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex-1 text-center md:text-left"
              >
                <div className={`w-20 h-20 ${data.bg} rounded-3xl flex items-center justify-center mb-8 mx-auto md:mx-0 border border-slate-200 dark:border-white/10 shadow-2xl`}>
                  <Icon className={`w-10 h-10 ${data.color}`} />
                </div>
                <h1 className="text-4xl lg:text-5xl xl:text-6xl font-black text-slate-900 dark:text-white mb-6 tracking-tight leading-[1.1]">
                  {data.title.split(' ')[0]} <span className={data.color}>{data.title.split(' ').slice(1).join(' ')}</span>
                </h1>
                <p className="text-lg lg:text-xl text-slate-600 dark:text-slate-300 mb-10 leading-relaxed max-w-2xl px-4 md:px-0">
                  {data.desc}
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                  {isSelfRegister ? (
                    <Link href="/signup" className={`${data.btn} ${data.btnHover} text-white font-bold px-8 py-5 rounded-2xl flex items-center justify-center gap-2 transition-transform hover:scale-105 active:scale-95 shadow-xl ${data.shadow}`}>
                      <UserPlus className="w-5 h-5" /> Register Now
                    </Link>
                  ) : (
                    <Link href="/login" className={`${data.btn} ${data.btnHover} text-white font-bold px-8 py-5 rounded-2xl flex items-center justify-center gap-2 transition-transform hover:scale-105 active:scale-95 shadow-xl ${data.shadow}`}>
                      <LogIn className="w-5 h-5" /> Login to Portal
                    </Link>
                  )}
                </div>
                {!isSelfRegister && (
                  <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-3 flex items-center justify-center md:justify-start gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-sky-500 shrink-0" />
                    Organizational accounts are provisioned by System Administration. Self-registration is disabled for partner entities.
                  </p>
                )}
              </motion.div>
              
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex-1 w-full max-w-lg md:max-w-none mt-12 md:mt-0"
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {data.features.map((feature: string, i: number) => (
                    <div key={i} className="bg-white/80 dark:bg-slate-900/60 backdrop-blur-sm border border-slate-200 dark:border-white/5 p-6 rounded-2xl flex items-start gap-4 shadow-sm hover:shadow-md transition-all hover:scale-[1.02]">
                      <CheckCircle2 className={`w-6 h-6 ${data.color} shrink-0`} />
                      <span className="text-sm font-bold text-slate-700 dark:text-slate-200 mt-0.5">{feature}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Pricing Packages */}
        <section className="py-24 px-4 sm:px-6 lg:px-8 bg-slate-50 dark:bg-slate-900">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-xl ${data.bg} ${data.color} text-sm font-bold mb-6`}>
                <Trophy className="w-4 h-4" /> Pricing & Plans
              </div>
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-slate-900 dark:text-white mb-4">Pricing Packages</h2>
              <p className="text-slate-600 dark:text-slate-400 text-lg max-w-2xl mx-auto">Choose the plan that fits your needs.</p>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 justify-center max-w-6xl mx-auto">
              {data.pricing.map((plan: any, i: number) => (
                <div key={i} className={`bg-white dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 rounded-3xl p-8 flex flex-col ${data.borderHover} hover:shadow-2xl transition-all h-full relative overflow-hidden group`}>
                  <div className={`absolute top-0 right-0 w-32 h-32 ${data.bg} rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity -translate-y-1/2 translate-x-1/2`} />
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2 relative z-10">{plan.name}</h3>
                  <div className="flex items-baseline gap-1 mb-8 relative z-10">
                    <span className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tighter">{plan.price}</span>
                    {plan.price !== "Custom" && plan.price !== "Gov Tier" && plan.price !== "Free" && plan.price !== "P0" && <span className="text-slate-500 font-bold">/mo</span>}
                  </div>
                  <ul className="space-y-4 mb-10 flex-1 relative z-10">
                    {plan.features.map((f: string, j: number) => (
                      <li key={j} className="flex items-center gap-3 text-sm font-medium text-slate-600 dark:text-slate-300">
                        <div className={`w-2 h-2 rounded-full ${data.bg.replace('/10', '')} shadow-sm shrink-0`} />
                        {f}
                      </li>
                    ))}
                  </ul>
                  {isSelfRegister ? (
                    <Link href="/signup" className={`w-full ${data.btn} ${data.btnHover} text-white py-4 rounded-xl font-bold flex items-center justify-center transition-transform hover:scale-105 active:scale-95 shadow-xl ${data.shadow} relative z-10`}>
                      Select Plan
                    </Link>
                  ) : (
                    <Link href="/login" className={`w-full ${data.btn} ${data.btnHover} text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-transform hover:scale-105 active:scale-95 shadow-xl ${data.shadow} relative z-10`}>
                      <LogIn className="w-4 h-4" /> Login to Access
                    </Link>
                  )}
                </div>
              ))}

              {/* Custom Package Card */}
              <div className="bg-slate-900 dark:bg-slate-950 border border-slate-800 rounded-3xl p-8 flex flex-col relative overflow-hidden h-full shadow-2xl">
                <div className={`absolute top-0 right-0 w-48 h-48 ${data.bg} rounded-full blur-3xl opacity-20 -translate-y-1/2 translate-x-1/2`} />
                <h3 className="text-xl font-bold text-white mb-2 relative z-10">Custom Package</h3>
                <p className="text-sm font-medium text-slate-400 mb-8 relative z-10">Need something tailored specifically for your organization?</p>
                <div className="flex-1 space-y-5 mb-10 relative z-10">
                  <div className="flex items-center gap-3 text-sm font-bold text-slate-300">
                    <ShieldCheck className={`w-5 h-5 ${data.color}`} />
                    Custom SLA Agreements
                  </div>
                  <div className="flex items-center gap-3 text-sm font-bold text-slate-300">
                    <Trophy className={`w-5 h-5 ${data.color}`} />
                    Dedicated Account Manager
                  </div>
                  <div className="flex items-center gap-3 text-sm font-bold text-slate-300">
                    <Coins className={`w-5 h-5 ${data.color}`} />
                    Volume-based Discounts
                  </div>
                </div>
                <button className={`w-full border-2 border-slate-700 ${data.btnHover} hover:border-transparent text-white py-4 rounded-xl font-bold flex items-center justify-center transition-all relative z-10 hover:shadow-xl ${data.shadow}`}>
                  Talk to Sales
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-24 px-4 sm:px-6 lg:px-8 bg-white dark:bg-slate-950">
          <div className="max-w-5xl mx-auto bg-slate-50 dark:bg-slate-900 border-2 border-slate-100 dark:border-slate-800 rounded-[2.5rem] p-12 text-center shadow-sm">
            <h2 className="text-3xl lg:text-4xl font-bold tracking-tight text-slate-900 dark:text-white mb-4">Still have questions?</h2>
            <p className="text-lg text-slate-600 dark:text-slate-400 mb-10 font-medium">Our team is here to help you integrate with the national asset registry.</p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <button className="border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 px-8 py-4 rounded-xl font-bold hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors shadow-sm">
                View Documentation
              </button>
              <button className={`${data.btn} ${data.btnHover} text-white px-8 py-4 rounded-xl font-bold transition-all shadow-xl ${data.shadow}`}>
                Contact Support
              </button>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
