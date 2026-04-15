import Link from 'next/link';
import { BookOpen, Share2, Download, Zap } from 'lucide-react';
import FlipbookDemo from '@/components/FlipbookDemo';

export default function HomePage() {
  return (
    <div style={{ minHeight: '100vh', paddingTop: 60 }}>

      {/* Hero */}
      <section style={{ position: 'relative', minHeight: 'calc(100vh - 60px)', display: 'flex', alignItems: 'center', overflow: 'hidden' }}>
        <div className="mesh-bg" />
        <div style={{ maxWidth: 1100, margin: '0 auto', padding: '4rem 1.5rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '4rem', alignItems: 'center', width: '100%', position: 'relative', zIndex: 1 }}>

          {/* Left */}
          <div className="animate-fade-up">
            <div className="badge badge-accent animate-fade-up" style={{ marginBottom: '1.5rem' }}>
              <Zap size={12} />
              PDF to flipbook in seconds
            </div>
            <h1 style={{ fontSize: 'clamp(2.4rem, 5vw, 3.6rem)', fontWeight: 800, lineHeight: 1.1, letterSpacing: '-0.03em', marginBottom: '1.25rem' }}>
              Transform any PDF into a{' '}
              <span className="gradient-text">stunning flipbook</span>
            </h1>
            <p style={{ fontSize: '1.1rem', color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: '2rem', maxWidth: 480 }}>
              Upload your PDF and get a beautiful, shareable animated flipbook with real 3D page-turn physics — in under a minute.
            </p>

            <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', marginBottom: '3rem' }}>
              <Link href="/upload">
                <button className="btn-primary" style={{ fontSize: '1rem', padding: '0.875rem 2rem' }}>
                  Upload your PDF
                </button>
              </Link>
              <button className="btn-secondary" style={{ fontSize: '1rem', padding: '0.875rem 1.75rem' }}>
                See how it works
              </button>
            </div>

            {/* Stats */}
            <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
              {[
                { value: '50MB', label: 'max PDF size' },
                { value: '<60s', label: 'processing time' },
                { value: 'Free', label: 'to get started' },
              ].map((stat) => (
                <div key={stat.label}>
                  <div style={{ fontSize: '1.4rem', fontWeight: 700, background: 'var(--gradient)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>{stat.value}</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{stat.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Right — Demo */}
          <div className="animate-fade-up delay-200" style={{ display: 'flex', justifyContent: 'center' }}>
            <div className="card" style={{ padding: '1.5rem', maxWidth: 340, width: '100%' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '1rem', textAlign: 'center', letterSpacing: '0.05em', textTransform: 'uppercase' }}>Live demo</div>
              <FlipbookDemo />
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section style={{ padding: '5rem 1.5rem', background: 'var(--bg-secondary)' }}>
        <div style={{ maxWidth: 1000, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
            <h2 style={{ fontSize: 'clamp(1.8rem, 3vw, 2.5rem)', fontWeight: 700, letterSpacing: '-0.02em', marginBottom: '0.75rem' }}>
              Everything you need
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '1.05rem' }}>
              Beautiful flipbooks with no setup required
            </p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem' }}>
            {[
              { icon: <BookOpen size={22} />, title: '3D page-flip animations', desc: 'Real book physics with natural curl, shadow and perspective.' },
              { icon: <Zap size={22} />, title: 'Flip sound effects', desc: 'Authentic paper flip sounds that make every turn feel tactile.' },
              { icon: <Share2 size={22} />, title: 'Shareable link', desc: 'One link to share your flipbook with anyone, anywhere.' },
              { icon: <Download size={22} />, title: 'Embed anywhere', desc: 'Drop an iframe into any website, app or blog post.' },
            ].map((f, i) => (
              <div key={i} className="card animate-fade-up" style={{ padding: '1.5rem', animationDelay: `${i * 0.1}s` }}>
                <div style={{ width: 44, height: 44, borderRadius: 'var(--radius-md)', background: 'var(--accent-glow)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem', color: 'var(--accent-light)' }}>
                  {f.icon}
                </div>
                <h3 style={{ fontWeight: 600, fontSize: '0.95rem', marginBottom: '0.5rem' }}>{f.title}</h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: '5rem 1.5rem', textAlign: 'center' }}>
        <div style={{ maxWidth: 560, margin: '0 auto' }}>
          <h2 style={{ fontSize: 'clamp(1.8rem, 3vw, 2.4rem)', fontWeight: 700, letterSpacing: '-0.02em', marginBottom: '1rem' }}>
            Ready to create your flipbook?
          </h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem', fontSize: '1.05rem' }}>
            No account required. Just upload and share.
          </p>
          <Link href="/upload">
            <button className="btn-primary" style={{ fontSize: '1rem', padding: '0.875rem 2.5rem' }}>
              Get started free
            </button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ borderTop: '1px solid var(--border)', padding: '1.5rem', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.8rem' }}>
        © 2026 FolioMorph · Built with Next.js
      </footer>
    </div>
  );
}