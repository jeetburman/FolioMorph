'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getFlipbookStatus } from '@/lib/api';
import { FlipbookStatus } from '@/lib/types';
import { CheckCircle, XCircle, FileText } from 'lucide-react';

export default function ProcessingStatus({ slug }: { slug: string }) {
  const [status, setStatus] = useState<FlipbookStatus>('PENDING');
  const [pageCount, setPageCount] = useState(0);
  const [pagesProcessed, setPagesProcessed] = useState(0);
  const [elapsed, setElapsed] = useState(0);
  const router = useRouter();

  useEffect(() => {
    const timer = setInterval(() => setElapsed(e => e + 1), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    let tries = 0;
    const poll = async () => {
      try {
        const data = await getFlipbookStatus(slug);
        setStatus(data.status);
        if (data.pageCount) setPageCount(data.pageCount);

        if (data.status === 'PROCESSING' && data.pageCount > 0) {
          setPagesProcessed(p => Math.min(p + 1, data.pageCount - 1));
        }

        if (data.status === 'READY') {
          setTimeout(() => router.push(`/f/${slug}`), 800);
          return;
        }
        if (data.status === 'FAILED') return;

        tries++;
        setTimeout(poll, 2000);
      } catch {
        if (tries < 30) { tries++; setTimeout(poll, 2000); }
      }
    };
    poll();
  }, [slug, router]);

  const progress = pageCount > 0 ? Math.round((pagesProcessed / pageCount) * 100) : (status === 'PENDING' ? 5 : 50);
  const remaining = pageCount > 0 ? Math.max(0, Math.round((pageCount - pagesProcessed) * 2)) : null;

  return (
    <div style={{ maxWidth: 520, margin: '0 auto', width: '100%' }}>

      {status === 'FAILED' ? (
        <div className="card" style={{ padding: '2rem', textAlign: 'center' }}>
          <XCircle size={48} color="#ef4444" style={{ marginBottom: '1rem' }} />
          <h2 style={{ fontWeight: 700, marginBottom: '0.5rem' }}>Processing failed</h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>Something went wrong. Please try uploading again.</p>
          <a href="/upload"><button className="btn-primary">Try again</button></a>
        </div>
      ) : status === 'READY' ? (
        <div className="card" style={{ padding: '2rem', textAlign: 'center' }}>
          <CheckCircle size={48} color="#22c55e" style={{ marginBottom: '1rem' }} />
          <h2 style={{ fontWeight: 700, marginBottom: '0.5rem' }}>Ready! Redirecting...</h2>
        </div>
      ) : (
        <div className="card" style={{ padding: '2rem' }}>
          {/* File info */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
            <div style={{ width: 42, height: 42, borderRadius: 'var(--radius-sm)', background: 'var(--accent-glow)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <FileText size={20} color="var(--accent)" />
            </div>
            <div>
              <div style={{ fontWeight: 600, fontSize: '0.95rem' }}>Processing your flipbook</div>
              {pageCount > 0 && <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{pageCount} pages detected</div>}
            </div>
            <div className="badge badge-processing" style={{ marginLeft: 'auto' }}>
              {status === 'PENDING' ? 'Pending' : 'Processing'}
            </div>
          </div>

          {/* Progress bar */}
          <div className="progress-bar" style={{ marginBottom: '0.6rem' }}>
            <div className="progress-fill" style={{ width: `${progress}%` }} />
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
            <span>{status === 'PENDING' ? 'Queued...' : `Converting page ${pagesProcessed} of ${pageCount}`}</span>
            <span>{progress}%</span>
          </div>

          {/* Stats */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.75rem', marginBottom: '1.25rem' }}>
            {[
              { value: `${pagesProcessed}/${pageCount || '?'}`, label: 'pages done' },
              { value: `${progress}%`, label: 'complete', accent: true },
              { value: remaining !== null ? `~${remaining}s` : `${elapsed}s`, label: remaining !== null ? 'remaining' : 'elapsed' },
            ].map((s, i) => (
              <div key={i} style={{ background: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)', padding: '0.875rem', textAlign: 'center' }}>
                <div style={{ fontSize: '1.2rem', fontWeight: 700, color: s.accent ? 'var(--accent)' : 'var(--text-primary)' }}>{s.value}</div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{s.label}</div>
              </div>
            ))}
          </div>

          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textAlign: 'center' }}>
            You&apos;ll be redirected automatically when ready
          </p>
        </div>
      )}
    </div>
  );
}