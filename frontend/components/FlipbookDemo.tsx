'use client';

import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const DEMO_PAGES = [
  {
    bg: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
    content: (
      <div style={{ textAlign: 'center', padding: '2rem 1.5rem' }}>
        <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>📘</div>
        <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#a78bfa', marginBottom: '0.5rem' }}>FolioMorph</div>
        <div style={{ fontSize: '0.75rem', color: '#6b7280', lineHeight: 1.6 }}>Transform your PDFs into stunning interactive flipbooks</div>
      </div>
    ),
  },
  {
    bg: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 100%)',
    content: (
      <div style={{ padding: '1.5rem 1rem' }}>
        <div style={{ fontSize: '0.65rem', fontWeight: 600, color: '#7c3aed', marginBottom: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Features</div>
        {['3D page-flip physics', 'Flip sound effects', 'Shareable links', 'Embed anywhere'].map((f, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.5rem' }}>
            <div style={{ width: 5, height: 5, borderRadius: '50%', background: 'var(--gradient)', flexShrink: 0 }} />
            <span style={{ fontSize: '0.72rem', color: '#c4b5fd' }}>{f}</span>
          </div>
        ))}
      </div>
    ),
  },
  {
    bg: 'linear-gradient(135deg, #1a1a2e 0%, #0d1117 100%)',
    content: (
      <div style={{ padding: '1.5rem 1rem' }}>
        <div style={{ fontSize: '0.65rem', fontWeight: 600, color: '#ec4899', marginBottom: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.08em' }}>How it works</div>
        {['Upload your PDF', 'We convert pages', 'Share your link'].map((s, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem', marginBottom: '0.6rem' }}>
            <div style={{ width: 16, height: 16, borderRadius: '50%', background: 'rgba(236,72,153,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: '0.6rem', color: '#f472b6', fontWeight: 700 }}>{i+1}</div>
            <span style={{ fontSize: '0.72rem', color: '#9ca3af', lineHeight: 1.4 }}>{s}</span>
          </div>
        ))}
      </div>
    ),
  },
  {
    bg: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 100%)',
    content: (
      <div style={{ textAlign: 'center', padding: '2rem 1.5rem' }}>
        <div style={{ fontSize: '1.8rem', marginBottom: '0.5rem' }}>🚀</div>
        <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#a78bfa', marginBottom: '0.4rem' }}>Get started free</div>
        <div style={{ fontSize: '0.7rem', color: '#6b7280', lineHeight: 1.5 }}>No account needed. Upload your first PDF today.</div>
      </div>
    ),
  },
];

export default function FlipbookDemo() {
  const [page, setPage] = useState(0);
  const [flipping, setFlipping] = useState(false);
  const [direction, setDirection] = useState<'next' | 'prev'>('next');

  const go = (dir: 'next' | 'prev') => {
    if (flipping) return;
    setDirection(dir);
    setFlipping(true);
    setTimeout(() => {
      setPage(p => dir === 'next' ? Math.min(p + 1, DEMO_PAGES.length - 1) : Math.max(p - 1, 0));
      setFlipping(false);
    }, 320);
  };

  useEffect(() => {
    const t = setInterval(() => go('next'), 3500);
    return () => clearInterval(t);
  }, [flipping, page]);

  const prev = DEMO_PAGES[(page - 1 + DEMO_PAGES.length) % DEMO_PAGES.length];
  const curr = DEMO_PAGES[page];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
      <div style={{
        position: 'relative',
        width: 260,
        height: 200,
        borderRadius: 'var(--radius-lg)',
        overflow: 'hidden',
        boxShadow: 'var(--shadow-glow), var(--shadow-lg)',
        border: '1px solid var(--border)',
        perspective: '800px',
      }}>
        {/* Book spine */}
        <div style={{
          position: 'absolute',
          left: '50%',
          top: 0,
          bottom: 0,
          width: 2,
          background: 'var(--border-strong)',
          zIndex: 5,
          transform: 'translateX(-50%)',
        }} />

        {/* Left page (static) */}
        <div style={{
          position: 'absolute',
          left: 0,
          top: 0,
          width: '50%',
          height: '100%',
          background: prev.bg,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '0.7rem',
          color: 'rgba(255,255,255,0.3)',
        }}>
          <div style={{ transform: 'scale(0.75)', transformOrigin: 'center', width: '133%' }}>
            {prev.content}
          </div>
        </div>

        {/* Right page (current — animates on flip) */}
        <div style={{
          position: 'absolute',
          right: 0,
          top: 0,
          width: '50%',
          height: '100%',
          background: curr.bg,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transformOrigin: 'left center',
          transform: flipping ? 'rotateY(-25deg) scaleX(0.92)' : 'rotateY(0deg)',
          transition: 'transform 0.32s cubic-bezier(0.4, 0, 0.2, 1)',
          backfaceVisibility: 'hidden',
          boxShadow: flipping ? '-8px 0 20px rgba(0,0,0,0.4)' : 'none',
        }}>
          <div style={{ transform: 'scale(0.75)', transformOrigin: 'center', width: '133%' }}>
            {curr.content}
          </div>
        </div>
      </div>

      {/* Controls */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        <button
          onClick={() => go('prev')}
          disabled={page === 0}
          className="btn-secondary"
          style={{ padding: '0.4rem 0.7rem', borderRadius: 'var(--radius-sm)', display: 'flex', alignItems: 'center', opacity: page === 0 ? 0.4 : 1 }}
        >
          <ChevronLeft size={15} />
        </button>
        <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', minWidth: 40, textAlign: 'center' }}>
          {page + 1} / {DEMO_PAGES.length}
        </span>
        <button
          onClick={() => go('next')}
          disabled={page === DEMO_PAGES.length - 1}
          className="btn-secondary"
          style={{ padding: '0.4rem 0.7rem', borderRadius: 'var(--radius-sm)', display: 'flex', alignItems: 'center', opacity: page === DEMO_PAGES.length - 1 ? 0.4 : 1 }}
        >
          <ChevronRight size={15} />
        </button>
      </div>

      {/* Dots */}
      <div style={{ display: 'flex', gap: '0.4rem' }}>
        {DEMO_PAGES.map((_, i) => (
          <div key={i} onClick={() => setPage(i)} style={{
            width: i === page ? 20 : 6,
            height: 6,
            borderRadius: 99,
            background: i === page ? 'var(--accent)' : 'var(--border-strong)',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
          }} />
        ))}
      </div>
    </div>
  );
}