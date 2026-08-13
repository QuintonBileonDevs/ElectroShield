'use client';

import * as React from 'react';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <button suppressHydrationWarning className="w-10 h-10 rounded-xl flex items-center justify-center text-slate-600 dark:text-slate-400">
        <div className="w-5 h-5" />
      </button>
    );
  }

  return (
    <button
      suppressHydrationWarning
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
      className="p-2 w-10 h-10 rounded-xl flex items-center justify-center text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
      aria-label="Toggle theme"
    >
      {theme === 'dark' ? (
        <Sun className="w-5 h-5" />
      ) : (
        <Moon className="w-5 h-5" />
      )}
    </button>
  );
}
