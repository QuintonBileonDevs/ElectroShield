const fs = require('fs');
let content = fs.readFileSync('components/Navbar.tsx', 'utf8');

// Add usePathname up top
if (!content.includes('usePathname')) {
  content = content.replace('import Link from "next/link";', 'import Link from "next/link";\nimport { usePathname } from "next/navigation";');
}

// Add the hook inside Navbar
if (!content.includes('usePathname()')) {
  content = content.replace('const [mobileExpanded, setMobileExpanded] = useState<string | null>(null);', 
    'const [mobileExpanded, setMobileExpanded] = useState<string | null>(null);\n  const pathname = usePathname();\n  const isHome = pathname === "/";');
}

// Replace top color classes
content = content.replace(
  "scrolled ? 'bg-sky-600' : 'bg-white'",
  "scrolled || !isHome ? 'bg-sky-600' : 'bg-white'"
);
content = content.replace(
  "scrolled ? 'text-white' : 'text-sky-600'",
  "scrolled || !isHome ? 'text-white' : 'text-sky-600'"
);
content = content.replace(
  "scrolled ? 'text-slate-900 dark:text-white' : 'text-white'",
  "scrolled || !isHome ? 'text-slate-900 dark:text-white' : 'text-white'"
);
content = content.replace(
  "scrolled ? 'text-slate-600 dark:text-slate-300 hover:text-sky-600' : 'text-white/80 hover:text-white'",
  "scrolled || !isHome ? 'text-slate-600 dark:text-slate-300 hover:text-sky-600' : 'text-white/80 hover:text-white'"
);
content = content.replace(
  "scrolled ? 'text-slate-900 dark:text-white hover:text-sky-600' : 'text-white hover:text-sky-600'",
  "scrolled || !isHome ? 'text-slate-900 dark:text-white hover:text-sky-600' : 'text-white hover:text-sky-600'"
);

fs.writeFileSync('components/Navbar.tsx', content);
