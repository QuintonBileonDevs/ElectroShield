'use client';
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { 
  Menu, 
  X, 
  Shield, 
  ChevronDown,
  User,
  Users,
  UserPlus,
  Store,
  Building2,
  ShieldCheck,
  Code,
  Landmark,
  ShieldAlert,
  GraduationCap,
  Recycle,
  Wrench,
  SignalHigh,
  Globe,
  Radio,
  School,
  Coins,
  Sun,
  Moon,
  HelpCircle,
  MessageSquare,
  LifeBuoy,
  LayoutDashboard,
  LogOut,
  Activity
} from "lucide-react";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useTheme } from 'next-themes';
import { useAuth } from "@/components/auth-provider";

import { Logo } from "./Logo";

const platformCategories = [
  {
    title: 'Public',
    items: [
      { name: 'Individuals', href: '/ecosystem/individuals', icon: User, gradient: 'from-indigo-500 to-indigo-600' },
      { name: 'Families', href: '/ecosystem/families', icon: Users, gradient: 'from-violet-500 to-violet-600' }
    ]
  },
  {
    title: 'Business',
    items: [
      { name: 'Retailers', href: '/ecosystem/retailers', icon: Store, gradient: 'from-emerald-500 to-emerald-600' },
      { name: 'Enterprises', href: '/ecosystem/enterprises', icon: Building2, gradient: 'from-blue-500 to-blue-600' },
      { name: 'Insurance', href: '/ecosystem/insurance', icon: ShieldCheck, gradient: 'from-sky-500 to-sky-600' },
      { name: 'Developers', href: '/ecosystem/developers', icon: Code, gradient: 'from-purple-500 to-purple-600' }
    ]
  },
  {
    title: 'Government',
    items: [
      { name: 'BURS', href: '/ecosystem/burs', icon: Landmark, gradient: 'from-orange-500 to-orange-600' },
      { name: 'Police', href: '/ecosystem/police', icon: ShieldAlert, gradient: 'from-rose-500 to-rose-600' }
    ]
  },
  {
    title: 'Services',
    items: [
      { name: 'Academic Institutions', href: '/ecosystem/academic-institutions', icon: School, gradient: 'from-yellow-400 to-yellow-500' },
      { name: 'Repair Centers', href: '/ecosystem/repair-centers', icon: Wrench, gradient: 'from-amber-500 to-amber-600' },
      { name: 'MNOs', href: '/ecosystem/mno', icon: Radio, gradient: 'from-cyan-500 to-cyan-600' },
      { name: 'Pawn Shops', href: '/ecosystem/pawn-shops', icon: Coins, gradient: 'from-teal-500 to-teal-600' },
      { name: 'E-Waste Partners', href: '/ecosystem/ewaste', icon: Recycle, gradient: 'from-green-500 to-green-600' }
    ]
  }
];

const mainNavItems = [
  { title: 'Platform', hasDropdown: true, categories: platformCategories },
  { title: 'About', href: '/about' },
  { title: 'Support', href: '/support', icon: LifeBuoy },
];

export function Navbar() {
  const { user, loading, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [mobileExpanded, setMobileExpanded] = useState<string | null>(null);
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  const [isSuperAdmin, setIsSuperAdmin] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 0);
    
    const checkSuperAdmin = () => {
      if (typeof window !== 'undefined') {
        setIsSuperAdmin(sessionStorage.getItem('super_admin_authenticated') === 'true');
      }
    };

    checkSuperAdmin();

    window.addEventListener('super_admin_auth_changed', checkSuperAdmin);
    window.addEventListener('storage', checkSuperAdmin);

    return () => {
      clearTimeout(timer);
      window.removeEventListener('super_admin_auth_changed', checkSuperAdmin);
      window.removeEventListener('storage', checkSuperAdmin);
    };
  }, [pathname]);

  const toggleMobileNav = (title: string) => {
    setMobileExpanded(mobileExpanded === title ? null : title);
  };

  const handleSuperAdminNav = (tab: string) => {
    setIsOpen(false);
    if (pathname === '/admin') {
      window.dispatchEvent(new CustomEvent('super_admin_tab_change', { detail: tab }));
    } else {
      router.push(`/admin?tab=${tab}`);
    }
  };

  const handleSuperAdminLogout = () => {
    if (typeof window !== 'undefined') {
      sessionStorage.removeItem('super_admin_authenticated');
      window.dispatchEvent(new Event('super_admin_auth_changed'));
    }
    setIsSuperAdmin(false);
    if (pathname === '/admin') {
      router.refresh();
    } else {
      router.push('/admin');
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 transition-all duration-300 bg-slate-50/80 dark:bg-slate-950/80 backdrop-blur-md border-b border-slate-200 dark:border-white/5 shadow-sm py-2 md:py-3">
      <div className="w-full px-4 md:px-12">
        {isSuperAdmin ? (
          /* ================= SUPER ADMIN CLEAN NAVBAR ================= */
          <div className="flex justify-between items-center h-14 md:h-16">
            <div className="flex items-center gap-3 sm:gap-6">
              <Logo />
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20 text-[10px] font-extrabold uppercase tracking-[0.18em] shadow-xs shrink-0">
                <ShieldAlert className="w-3.5 h-3.5 shrink-0" />
                <span className="hidden sm:inline">SUPER ADMIN</span>
                <span className="sm:hidden">ADMIN</span>
              </div>
            </div>

            {/* Desktop Navigation Links */}
            <div className="hidden lg:flex items-center space-x-1 border border-slate-200/80 dark:border-slate-800 bg-slate-100/60 dark:bg-slate-900/60 p-1 rounded-2xl shadow-xs">
              <button
                onClick={() => handleSuperAdminNav('overview')}
                className="flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-extrabold uppercase tracking-wider text-slate-700 dark:text-slate-200 hover:text-sky-600 dark:hover:text-sky-400 hover:bg-white dark:hover:bg-slate-800 transition-all"
              >
                <LayoutDashboard className="w-3.5 h-3.5 text-sky-500" />
                <span>Console</span>
              </button>
              <button
                onClick={() => handleSuperAdminNav('register_org')}
                className="flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-extrabold uppercase tracking-wider text-slate-700 dark:text-slate-200 hover:text-sky-600 dark:hover:text-sky-400 hover:bg-white dark:hover:bg-slate-800 transition-all"
              >
                <UserPlus className="w-3.5 h-3.5 text-sky-500" />
                <span>Register Org</span>
              </button>
              <button
                onClick={() => handleSuperAdminNav('org_list')}
                className="flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-extrabold uppercase tracking-wider text-slate-700 dark:text-slate-200 hover:text-sky-600 dark:hover:text-sky-400 hover:bg-white dark:hover:bg-slate-800 transition-all"
              >
                <Building2 className="w-3.5 h-3.5 text-blue-500" />
                <span>Organizations</span>
              </button>
              <button
                onClick={() => handleSuperAdminNav('sub_users')}
                className="flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-extrabold uppercase tracking-wider text-slate-700 dark:text-slate-200 hover:text-sky-600 dark:hover:text-sky-400 hover:bg-white dark:hover:bg-slate-800 transition-all"
              >
                <Users className="w-3.5 h-3.5 text-emerald-500" />
                <span>Org Staff</span>
              </button>
              <button
                onClick={() => handleSuperAdminNav('audit')}
                className="flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-extrabold uppercase tracking-wider text-slate-700 dark:text-slate-200 hover:text-sky-600 dark:hover:text-sky-400 hover:bg-white dark:hover:bg-slate-800 transition-all"
              >
                <Activity className="w-3.5 h-3.5 text-amber-500" />
                <span>Audit Logs</span>
              </button>
            </div>

            {/* Desktop Actions: Theme Toggle + Logout */}
            <div className="hidden lg:flex items-center gap-3">
              {mounted && (
                <button
                  onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                  className="w-10 h-10 rounded-xl flex items-center justify-center text-slate-600 dark:text-white/70 hover:text-sky-600 dark:hover:text-white hover:bg-white dark:hover:bg-slate-800 transition-all border border-slate-200 dark:border-white/10 shadow-sm"
                  title="Toggle Light/Dark Theme"
                >
                  {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                </button>
              )}
              <button
                onClick={handleSuperAdminLogout}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-rose-500/10 hover:bg-rose-600 hover:text-white text-rose-600 dark:text-rose-400 border border-rose-500/20 text-xs font-extrabold uppercase tracking-wider transition-all shadow-xs active:scale-95"
                title="Log Out Super Admin"
              >
                <LogOut className="w-4 h-4" />
                <span>Log Out</span>
              </button>
            </div>

            {/* Mobile Actions */}
            <div className="lg:hidden flex items-center gap-2">
              {mounted && (
                <button
                  onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                  className="w-9 h-9 rounded-xl flex items-center justify-center text-slate-600 dark:text-white hover:bg-slate-100 dark:hover:bg-white/10 transition-all"
                >
                  {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                </button>
              )}
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="p-2 transition-colors text-slate-900 dark:text-white"
              >
                {isOpen ? <X className="w-7 h-7" /> : <Menu className="w-7 h-7" />}
              </button>
            </div>
          </div>
        ) : (
          /* ================= STANDARD PUBLIC NAVBAR ================= */
          <div className="flex justify-between items-center h-14 md:h-16">
            <div className="flex items-center gap-10">
              <Logo />
              <div className="hidden lg:flex items-center space-x-8">
                {mainNavItems.map((item) => (
                  <div key={item.title} className="relative group">
                    {item.hasDropdown ? (
                      <>
                        <button suppressHydrationWarning className="flex items-center gap-1 text-sm font-black uppercase tracking-widest transition-all py-2 text-slate-700 dark:text-slate-200 hover:text-sky-600 dark:hover:text-white">
                          {item.title}
                          <ChevronDown className="w-3.5 h-3.5 transition-transform group-hover:rotate-180 opacity-60" />
                        </button>
                        <div className="absolute top-full left-0 pt-3 w-[680px] max-w-[90vw] opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50 transform translate-y-2 group-hover:translate-y-0">
                          <div className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-2xl border border-slate-200/80 dark:border-white/10 rounded-3xl shadow-2xl p-6 max-h-[calc(100vh-100px)] overflow-y-auto custom-scrollbar">
                            <div className="grid grid-cols-2 gap-6">
                              {item.categories?.map((category) => (
                                <div key={category.title} className="space-y-3">
                                  <h4 className="text-[10px] font-black uppercase tracking-[0.25em] text-slate-400 dark:text-slate-500 px-3">{category.title}</h4>
                                  <div className="space-y-1">
                                    {category.items.map((subItem) => (
                                      <Link 
                                        key={subItem.name} 
                                        href={subItem.href} 
                                        className="flex items-center gap-3.5 px-3 py-2 rounded-xl text-[12px] font-black uppercase tracking-wider text-slate-700 dark:text-slate-200 hover:bg-slate-100/80 dark:hover:bg-white/5 hover:text-sky-600 dark:hover:text-sky-400 transition-all group/item"
                                      >
                                        <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${subItem.gradient} flex items-center justify-center shadow-md transform group-hover/item:scale-105 transition-all duration-200 shrink-0`}>
                                          <subItem.icon className="w-4 h-4 text-white" />
                                        </div>
                                        <span className="tracking-tight truncate">{subItem.name}</span>
                                      </Link>
                                    ))}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </>
                    ) : (
                      <Link href={item.href || '#'} className="flex items-center gap-2 text-sm font-black uppercase tracking-widest transition-all py-2 text-slate-700 dark:text-slate-200 hover:text-sky-600 dark:hover:text-white">
                        {item.title}
                      </Link>
                    )}
                  </div>
                ))}
              </div>
            </div>
            
            <div className="hidden lg:flex items-center gap-6">
              <div className="flex items-center gap-2 cursor-pointer group text-slate-700 dark:text-slate-300 hover:text-sky-600 dark:hover:text-white transition-colors">
                <Globe className="w-4 h-4 opacity-70 group-hover:opacity-100 transition-opacity" />
                <span className="text-xs font-black tracking-widest uppercase transition-colors">EN</span>
              </div>

              <Link
                href="/admin"
                title="Super Admin Console"
                className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-100/90 dark:bg-slate-800/80 border border-slate-200/80 dark:border-white/10 hover:border-sky-500/50 text-slate-700 dark:text-slate-200 hover:text-sky-600 dark:hover:text-sky-400 transition-all shadow-sm group"
              >
                <LayoutDashboard className="w-4 h-4 text-sky-500 group-hover:scale-110 transition-transform" />
                <span className="text-[11px] font-black tracking-wider uppercase">Console</span>
              </Link>
              
              {mounted && (
                <button
                  onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                  className="w-10 h-10 rounded-xl flex items-center justify-center text-slate-600 dark:text-white/50 hover:text-sky-600 dark:hover:text-white hover:bg-white dark:hover:bg-white/10 transition-all border border-slate-200 dark:border-white/10 shadow-sm"
                >
                  {theme === 'dark' ? (
                    <Sun className="w-5 h-5" />
                  ) : (
                    <Moon className="w-5 h-5" />
                  )}
                </button>
              )}

              {!loading && (
                <>
                  {user ? (
                    <div className="flex items-center gap-8">
                      <button 
                        onClick={logout} 
                        className="text-xs font-black uppercase tracking-widest text-slate-400 hover:text-rose-500 transition-colors"
                      >
                        Exit
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-8">
                      <Link href="/login" className="text-xs font-black uppercase tracking-widest transition-colors text-slate-700 dark:text-slate-200 hover:text-sky-600 dark:hover:text-white">Log in</Link>
                      <Link href="/signup" suppressHydrationWarning className="bg-sky-600 text-white hover:bg-sky-700 px-7 py-3 rounded-xl text-xs font-black uppercase tracking-[0.1em] transition-all hover:scale-105 active:scale-95 shadow-xl shadow-sky-600/20 inline-flex items-center justify-center">
                        Get started
                      </Link>
                    </div>
                  )}
                </>
              )}
            </div>

            <div className="lg:hidden flex items-center gap-2">
              <Link
                href="/admin"
                title="Super Admin Console"
                className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-sky-600 dark:text-sky-400"
              >
                <LayoutDashboard className="w-5 h-5" />
              </Link>
              {mounted && (
                <button
                  onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                  className="w-9 h-9 rounded-xl flex items-center justify-center text-slate-600 dark:text-white hover:bg-slate-100 dark:hover:bg-white/10 transition-all"
                >
                  {theme === 'dark' ? (
                    <Sun className="w-5 h-5" />
                  ) : (
                    <Moon className="w-5 h-5" />
                  )}
                </button>
              )}
              <button suppressHydrationWarning
                onClick={() => setIsOpen(!isOpen)}
                className="p-2 transition-colors text-slate-900 dark:text-white"
              >
                {isOpen ? <X className="w-7 h-7" /> : <Menu className="w-7 h-7" />}
              </button>
            </div>
          </div>
        )}
      </div>
      
      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="lg:hidden fixed inset-x-4 top-20 z-50 bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-100 dark:border-slate-800 overflow-hidden"
          >
            {isSuperAdmin ? (
              /* Mobile Menu for Super Admin */
              <div className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                  <span className="px-3 py-1 rounded-full bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20 text-[10px] font-extrabold uppercase tracking-widest flex items-center gap-1.5">
                    <ShieldAlert className="w-3.5 h-3.5" /> SUPER ADMIN
                  </span>
                </div>

                <div className="space-y-2">
                  <button
                    onClick={() => handleSuperAdminNav('overview')}
                    className="flex items-center gap-3 w-full p-3.5 rounded-2xl bg-slate-50 dark:bg-white/5 text-sm font-bold text-slate-900 dark:text-white hover:text-sky-600 transition-colors"
                  >
                    <LayoutDashboard className="w-4 h-4 text-sky-500" />
                    <span>Console Dashboard</span>
                  </button>
                  <button
                    onClick={() => handleSuperAdminNav('register_org')}
                    className="flex items-center gap-3 w-full p-3.5 rounded-2xl bg-slate-50 dark:bg-white/5 text-sm font-bold text-slate-900 dark:text-white hover:text-sky-600 transition-colors"
                  >
                    <UserPlus className="w-4 h-4 text-sky-500" />
                    <span>Register Org Admin</span>
                  </button>
                  <button
                    onClick={() => handleSuperAdminNav('org_list')}
                    className="flex items-center gap-3 w-full p-3.5 rounded-2xl bg-slate-50 dark:bg-white/5 text-sm font-bold text-slate-900 dark:text-white hover:text-sky-600 transition-colors"
                  >
                    <Building2 className="w-4 h-4 text-blue-500" />
                    <span>Organizations</span>
                  </button>
                  <button
                    onClick={() => handleSuperAdminNav('sub_users')}
                    className="flex items-center gap-3 w-full p-3.5 rounded-2xl bg-slate-50 dark:bg-white/5 text-sm font-bold text-slate-900 dark:text-white hover:text-sky-600 transition-colors"
                  >
                    <Users className="w-4 h-4 text-emerald-500" />
                    <span>Org Staff / Sub-Users</span>
                  </button>
                  <button
                    onClick={() => handleSuperAdminNav('audit')}
                    className="flex items-center gap-3 w-full p-3.5 rounded-2xl bg-slate-50 dark:bg-white/5 text-sm font-bold text-slate-900 dark:text-white hover:text-sky-600 transition-colors"
                  >
                    <Activity className="w-4 h-4 text-amber-500" />
                    <span>Audit Logs</span>
                  </button>
                </div>

                <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-3">
                  <button
                    onClick={handleSuperAdminLogout}
                    className="w-full py-3.5 bg-rose-500/10 hover:bg-rose-500 hover:text-white text-rose-600 dark:text-rose-400 rounded-2xl text-xs font-black uppercase tracking-wider transition-all border border-rose-500/20 flex items-center justify-center gap-2"
                  >
                    <LogOut className="w-4 h-4" /> Log Out Super Admin
                  </button>
                </div>
              </div>
            ) : (
              /* Mobile Menu for Public Users */
              <div className="p-6 space-y-2 max-h-[80vh] overflow-y-auto">
                {mainNavItems.map((item) => (
                  <div key={item.title}>
                    {item.hasDropdown ? (
                      <>
                        <button suppressHydrationWarning 
                          onClick={() => toggleMobileNav(item.title)}
                          className="flex justify-between items-center w-full py-4 text-lg font-bold text-slate-900 dark:text-white border-b border-slate-100 dark:border-white/5"
                        >
                          {item.title}
                          <ChevronDown className={`w-5 h-5 opacity-50 transition-transform ${mobileExpanded === item.title ? 'rotate-180' : ''}`} />
                        </button>
                        <AnimatePresence>
                          {mobileExpanded === item.title && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: "auto" }}
                              exit={{ opacity: 0, height: 0 }}
                              className="overflow-hidden"
                            >
                              <div className="py-4 space-y-6">
                                {item.categories?.map((category) => (
                                  <div key={category.title} className="space-y-3">
                                    <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500 px-2">{category.title}</h4>
                                    <div className="grid grid-cols-1 gap-2">
                                      {category.items.map((subItem) => (
                                        <Link 
                                          key={subItem.name} 
                                          href={subItem.href} 
                                          className="flex items-center gap-4 p-3 rounded-2xl bg-slate-50 dark:bg-white/5 text-base font-bold text-slate-900 dark:text-white"
                                          onClick={() => setIsOpen(false)}
                                        >
                                          <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${subItem.gradient} flex items-center justify-center shadow-md`}>
                                            <subItem.icon className="w-5 h-5 text-white" />
                                          </div>
                                          <span className="tracking-tight">{subItem.name}</span>
                                        </Link>
                                      ))}
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </>
                    ) : (
                      <Link 
                        href={item.href || '#'} 
                        className="flex items-center gap-3 w-full py-4 text-lg font-bold text-slate-900 dark:text-white border-b border-slate-100 dark:border-white/5"
                        onClick={() => setIsOpen(false)}
                      >
                        {item.icon && <item.icon className="w-5 h-5 text-sky-500" />}
                        {item.title}
                      </Link>
                    )}
                  </div>
                ))}
                
                <div className="pt-6 flex flex-col gap-4">
                  {!loading && (
                    <>
                      {user ? (
                        <>
                          <button onClick={() => { logout(); setIsOpen(false); }} className="w-full text-center py-4 text-slate-500 font-bold">
                            Log out
                          </button>
                        </>
                      ) : (
                        <>
                          <Link href="/signup" suppressHydrationWarning className="w-full text-center bg-sky-600 text-white py-4 rounded-2xl font-bold text-lg shadow-xl shadow-sky-600/20" onClick={() => setIsOpen(false)}>
                            Get started
                          </Link>
                          <div className="flex justify-center">
                            <Link href="/login" className="text-slate-500 font-bold" onClick={() => setIsOpen(false)}>Log in</Link>
                          </div>
                        </>
                      )}
                    </>
                  )}
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
