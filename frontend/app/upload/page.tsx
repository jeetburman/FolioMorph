import Uploader from '@/components/Uploader';

export default function UploadPage() {
  return (
    <div style={{ minHeight: '100vh', paddingTop: 60, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '5rem 1.5rem 2rem' }}>
      <div style={{ width: '100%', maxWidth: 600 }}>
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <h1 style={{ fontSize: 'clamp(1.8rem, 3vw, 2.5rem)', fontWeight: 700, letterSpacing: '-0.02em', marginBottom: '0.5rem' }}>
            Create a new flipbook
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1rem' }}>
            Upload a PDF file to get started. Max size 50MB.
          </p>
        </div>
        <div className="card" style={{ padding: '2rem' }}>
          <Uploader />
        </div>
      </div>
    </div>
  );
}