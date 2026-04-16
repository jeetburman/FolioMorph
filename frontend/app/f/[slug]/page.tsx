import { getFlipbook } from '@/lib/api';
import FlipbookViewer from '@/components/FlipbookViewer';
import { notFound } from 'next/navigation';

export default async function FlipbookPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  let flipbook;
  try {
    flipbook = await getFlipbook(slug);
  } catch {
    notFound();
  }

  if (flipbook.status !== 'READY') {
    return (
      <div style={{ minHeight: '100vh', paddingTop: 60, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <h2 style={{ fontWeight: 700, marginBottom: '0.5rem' }}>Still processing...</h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '1rem' }}>Your flipbook isn&apos;t ready yet.</p>
          <a href={`/processing/${slug}`}><button className="btn-primary">Check status</button></a>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', paddingTop: 60, padding: '5rem 1.5rem 3rem' }}>
      <div style={{ maxWidth: 960, margin: '0 auto' }}>
        <FlipbookViewer flipbook={flipbook} />
      </div>
    </div>
  );
}