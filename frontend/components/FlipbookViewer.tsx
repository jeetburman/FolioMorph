'use client';

import { useEffect, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight, Volume2, VolumeX, Share2, Download, Copy, Check } from 'lucide-react';
import { Flipbook } from '@/lib/types';
import { Howl } from 'howler';

export default function FlipbookViewer({ flipbook }: { flipbook: Flipbook }) {
  const bookRef = useRef<any>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages] = useState(flipbook.pages.length);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [showShare, setShowShare] = useState(false);
  const [copied, setCopied] = useState<'link' | 'embed' | null>(null);
  const soundRef = useRef<Howl | null>(null);
  const [dimensions, setDimensions] = useState({ width: 800, height: 560 });

  const shareUrl = typeof window !== 'undefined' ? window.location.href : '';
  const embedCode = `<iframe src="${shareUrl}" width="800" height="600" frameborder="0"></iframe>`;

  useEffect(() => {
    soundRef.current = new Howl({ src: ['/flip.mp3'], volume: 0.5 });
  }, []);

  useEffect(() => {
    const calc = () => {
      const w = Math.min(window.innerWidth - 48, 900);
      const h = Math.round(w * 0.6);
      setDimensions({ width: w, height: h });
    };
    calc();
    window.addEventListener('resize', calc);
    return () => window.removeEventListener('resize', calc);
  }, []);

  useEffect(() => {
    if (!containerRef.current) return;

    const load = async () => {
      const { PageFlip } = await import('page-flip');

      const pageWidth = Math.floor(dimensions.width / 2);
      const pageHeight = dimensions.height;

      if (bookRef.current) {
        bookRef.current.destroy();
        bookRef.current = null;
      }

      const pf = new PageFlip(containerRef.current!, {
        width: pageWidth,
        height: pageHeight,
        size: 'fixed',
        minWidth: 160,
        maxWidth: 560,
        minHeight: 240,
        maxHeight: 760,
        showCover: true,
        mobileScrollSupport: true,
        drawShadow: true,
        flippingTime: 700,
        usePortrait: dimensions.width < 600,
        startZIndex: 0,
        autoSize: true,
        maxShadowOpacity: 0.5,
        showPageCorners: true,
        disableFlipByClick: false,
      });

      const pages = flipbook.pages.sort((a, b) => a.pageNumber - b.pageNumber);

      pf.loadFromImages(pages.map(p => p.imageUrl));

      pf.on('flip', (e: any) => {
        setCurrentPage(e.data);
        if (soundEnabled && soundRef.current) soundRef.current.play();
      });

      bookRef.current = pf;
    };

    load();

    return () => {
      if (bookRef.current) { bookRef.current.destroy(); bookRef.current = null; }
    };
  }, [dimensions, flipbook.pages]);

  const goNext = () => bookRef.current?.flipNext();
  const goPrev = () => bookRef.current?.flipPrev();

  const copyText = (text: string, type: 'link' | 'embed') => {
    navigator.clipboard.writeText(text);
    setCopied(type);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.5rem' }}>

      {/* Top bar */}
      <div style={{ width: '100%', maxWidth: dimensions.width, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap' }}>
        <h1 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--text-primary)' }}>{flipbook.title}</h1>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button className="btn-secondary" style={{ padding: '0.5rem 0.9rem', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <Download size={15} /> Download
          </button>
          <button onClick={() => setShowShare(s => !s)} className="btn-secondary" style={{ padding: '0.5rem 0.9rem', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <Share2 size={15} /> Share
          </button>
          <button onClick={() => setSoundEnabled(s => !s)} className="btn-ghost" style={{ padding: '0.5rem 0.7rem', display: 'flex', alignItems: 'center' }}>
            {soundEnabled ? <Volume2 size={18} /> : <VolumeX size={18} />}
          </button>
        </div>
      </div>

      {/* Flipbook */}
      <div style={{
        background: 'var(--bg-secondary)',
        borderRadius: 'var(--radius-xl)',
        padding: '2rem 1rem',
        width: '100%',
        maxWidth: dimensions.width + 32,
        display: 'flex',
        justifyContent: 'center',
        boxShadow: 'var(--shadow-glow), var(--shadow-lg)',
        border: '1px solid var(--border)',
        minHeight: dimensions.height + 80,
        alignItems: 'center',
      }}>
        <div ref={containerRef} />
      </div>

      {/* Page controls */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <button onClick={goPrev} className="btn-secondary" disabled={currentPage === 0} style={{ padding: '0.5rem 1rem', display: 'flex', alignItems: 'center', gap: '0.4rem', opacity: currentPage === 0 ? 0.4 : 1 }}>
          <ChevronLeft size={18} /> Prev
        </button>
        <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', minWidth: 80, textAlign: 'center' }}>
          {currentPage + 1} – {Math.min(currentPage + 2, totalPages)} / {totalPages}
        </span>
        <button onClick={goNext} className="btn-secondary" disabled={currentPage >= totalPages - 2} style={{ padding: '0.5rem 1rem', display: 'flex', alignItems: 'center', gap: '0.4rem', opacity: currentPage >= totalPages - 2 ? 0.4 : 1 }}>
          Next <ChevronRight size={18} />
        </button>
      </div>

      {/* Share panel */}
      {showShare && (
        <div className="card animate-fade-up" style={{ width: '100%', maxWidth: dimensions.width, padding: '1.5rem' }}>
          <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
            <button className="btn-primary" style={{ padding: '0.4rem 1rem', fontSize: '0.85rem' }}>Share link</button>
            <button className="btn-ghost" style={{ padding: '0.4rem 1rem', fontSize: '0.85rem' }}>Embed code</button>
          </div>

          <div style={{ marginBottom: '0.75rem' }}>
            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
              <input readOnly value={shareUrl} style={{ flex: 1, padding: '0.6rem 0.875rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-strong)', background: 'var(--bg-secondary)', color: 'var(--text-primary)', fontSize: '0.85rem', outline: 'none' }} />
              <button onClick={() => copyText(shareUrl, 'link')} className="btn-primary" style={{ padding: '0.6rem 0.875rem', display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.85rem' }}>
                {copied === 'link' ? <><Check size={14} /> Copied</> : <><Copy size={14} /> Copy</>}
              </button>
            </div>
          </div>

          <div>
            <textarea readOnly value={embedCode} rows={2} style={{ width: '100%', padding: '0.6rem 0.875rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-strong)', background: 'var(--bg-secondary)', color: 'var(--text-secondary)', fontSize: '0.8rem', outline: 'none', resize: 'none', fontFamily: 'monospace' }} />
            <button onClick={() => copyText(embedCode, 'embed')} className="btn-secondary" style={{ marginTop: '0.4rem', padding: '0.4rem 0.875rem', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
              {copied === 'embed' ? <><Check size={13} /> Copied</> : <><Copy size={13} /> Copy embed code</>}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}