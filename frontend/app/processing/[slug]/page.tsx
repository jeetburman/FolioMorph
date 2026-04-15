import ProcessingStatus from '@/components/ProcessingStatus';

export default function ProcessingPage({ params }: { params: { slug: string } }) {
  return (
    <div style={{ minHeight: '100vh', paddingTop: 60, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '5rem 1.5rem 2rem' }}>
      <div style={{ width: '100%', maxWidth: 600 }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 700, letterSpacing: '-0.02em', marginBottom: '0.5rem' }}>
            Your flipbook is being created
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
            This usually takes 20–60 seconds. You&apos;ll be redirected automatically.
          </p>
        </div>
        <ProcessingStatus slug={params.slug} />
      </div>
    </div>
  );
}