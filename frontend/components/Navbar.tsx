'use client';

import Link from 'next/link';
import ThemeToggle from './ThemeToggle';
import { Layers } from 'lucide-react';

export default function Navbar() {
  return (
    <nav style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      zIndex: 50,
      padding: '0 1.5rem',
      height: '60px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      background: 'var(--bg-primary)',
      borderBottom: '1px solid var(--border)',
      backdropFilter: 'blur(12px)',
    }}>
      <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', textDecoration: 'none' }}>
        <div style={{
          width: 28,
          height: 28,
          borderRadius: 8,
          background: 'var(--gradient)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          <Layers size={15} color="white" />
        </div>
        <span style={{ fontWeight: 700, fontSize: '1.05rem', color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
          FolioMorph
        </span>
        <span className="badge badge-accent" style={{ fontSize: '0.7rem', padding: '0.15rem 0.5rem' }}>beta</span>
      </Link>

      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        <ThemeToggle />
        <Link href="/upload">
          <button className="btn-primary" style={{ padding: '0.5rem 1.1rem', fontSize: '0.875rem' }}>
            Upload PDF
          </button>
        </Link>
      </div>
    </nav>
  );
}