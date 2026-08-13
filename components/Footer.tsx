import Link from 'next/link';
import { Facebook, Twitter, Instagram, Linkedin, Shield } from 'lucide-react';

import { Logo } from './Logo';

export function Footer() {
  return (
    <footer className="bg-slate-50/50 dark:bg-slate-950 border-t border-slate-200 dark:border-slate-900 pt-16 md:pt-20 pb-8 md:pb-12 transition-colors">
      <div className="w-full px-4 sm:px-12 lg:px-20">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 md:gap-12 mb-16 md:mb-20">
          <div className="col-span-2 lg:col-span-2">
            <Logo className="mb-8" />
            <p className="text-slate-600 dark:text-slate-400 mb-8 max-w-sm text-sm md:text-base font-medium leading-relaxed">
              The national decentralized asset registry platform. Connect, protect, and recover your valuable devices with defense-grade security.
            </p>
            <div className="flex gap-4">
              {[Twitter, Facebook, Instagram, Linkedin].map((Icon, idx) => (
                <a key={idx} href="#" className="w-10 h-10 md:w-12 md:h-12 rounded-xl md:rounded-2xl bg-white dark:bg-slate-900 flex items-center justify-center text-slate-500 dark:text-slate-500 hover:bg-sky-600 hover:text-white transition-all duration-300 shadow-sm border border-slate-200 dark:border-white/5">
                  <Icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>
          
          <div>
            <h4 className="text-sm font-black uppercase tracking-widest text-slate-900 dark:text-slate-50 mb-6">Ecosystem</h4>
            <ul className="space-y-4">
              {['Public', 'Business', 'Government', 'Services'].map((item) => (
                <li key={item}><Link href="#" className="text-[13px] font-black uppercase tracking-widest text-slate-600 dark:text-slate-400 hover:text-sky-600 dark:hover:text-sky-400 transition-colors">{item}</Link></li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-black uppercase tracking-widest text-slate-900 dark:text-slate-50 mb-6">Company</h4>
            <ul className="space-y-4">
              <li><Link href="/about" className="text-[13px] font-black uppercase tracking-widest text-slate-600 dark:text-slate-400 hover:text-sky-600 dark:hover:text-sky-400 transition-colors">About Us</Link></li>
              <li><Link href="#" className="text-[13px] font-black uppercase tracking-widest text-slate-600 dark:text-slate-400 hover:text-sky-600 dark:hover:text-sky-400 transition-colors">Careers</Link></li>
              <li><Link href="#" className="text-[13px] font-black uppercase tracking-widest text-slate-600 dark:text-slate-400 hover:text-sky-600 dark:hover:text-sky-400 transition-colors">Blog</Link></li>
              <li><Link href="#" className="text-[13px] font-black uppercase tracking-widest text-slate-600 dark:text-slate-400 hover:text-sky-600 dark:hover:text-sky-400 transition-colors">Press</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-black uppercase tracking-widest text-slate-900 dark:text-slate-50 mb-6">Support</h4>
            <ul className="space-y-4">
              <li><Link href="/support" className="text-[13px] font-black uppercase tracking-widest text-slate-600 dark:text-slate-400 hover:text-sky-600 dark:hover:text-sky-400 transition-colors">Help Center</Link></li>
              <li><Link href="/support" className="text-[13px] font-black uppercase tracking-widest text-slate-600 dark:text-slate-400 hover:text-sky-600 dark:hover:text-sky-400 transition-colors">Contact Us</Link></li>
              <li><Link href="#" className="text-[13px] font-black uppercase tracking-widest text-slate-600 dark:text-slate-400 hover:text-sky-600 dark:hover:text-sky-400 transition-colors">Security</Link></li>
              <li><Link href="#" className="text-[13px] font-black uppercase tracking-widest text-slate-600 dark:text-slate-400 hover:text-sky-600 dark:hover:text-sky-400 transition-colors">System Status</Link></li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-slate-200 dark:border-slate-800 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-xs md:text-sm font-bold text-slate-500 dark:text-slate-500 text-center md:text-left">
            © {new Date().getFullYear()} ElectroShield. Proudly securing Botswana.
          </p>
          <div className="flex flex-wrap justify-center gap-6 md:gap-8">
            <Link href="#" className="text-[11px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors">Privacy Policy</Link>
            <Link href="#" className="text-[11px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors">Terms of Service</Link>
            <Link href="#" className="text-[11px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors">Cookie Policy</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
