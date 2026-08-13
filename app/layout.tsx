import type {Metadata} from 'next';
import { Montserrat, JetBrains_Mono } from 'next/font/google';
import './globals.css'; // Global styles
import { ThemeProvider } from '@/components/ThemeProvider';
import { AuthProvider } from '@/components/auth-provider';

const montserrat = Montserrat({
  subsets: ['latin'],
  variable: '--font-sans',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
});

export const metadata: Metadata = {
  title: 'ElectroShield - National Device Registry & Protection',
  description: 'Secure your assets in our national decentralized registry with defense-grade security.',
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="en" className={`${montserrat.variable} ${jetbrainsMono.variable}`} suppressHydrationWarning>
      <body suppressHydrationWarning className="font-sans antialiased text-slate-900 bg-slate-50/50 dark:text-slate-100 dark:bg-slate-950 transition-colors">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <AuthProvider>
            {children}
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
