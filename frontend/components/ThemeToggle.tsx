'use client';

import { useTheme } from 'next-themes';
import { Sun, Moon } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);
  if (!mounted) return <div style={{ width: 36, height: 36 }} />;

  return (
    <button
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
      className="btn-ghost"
      style={{ padding: '0.5rem', borderRadius: 'var(--radius-sm)', display: 'flex', alignItems: 'center' }}
      aria-label="Toggle theme"
    >
      {theme === 'dark'
        ? <Sun size={18} color="var(--text-secondary)" />
        : <Moon size={18} color="var(--text-secondary)" />
      }
    </button>
  );
}