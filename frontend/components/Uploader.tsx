'use client';

import { useState, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Upload, FileText, X, AlertCircle } from 'lucide-react';
import { uploadPdf } from '@/lib/api';

export default function Uploader() {
  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState('');
  const [dragging, setDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const handleFile = (f: File) => {
    if (f.type !== 'application/pdf') { setError('Only PDF files are allowed.'); return; }
    if (f.size > 50 * 1024 * 1024) { setError('File must be under 50MB.'); return; }
    setError('');
    setFile(f);
    if (!title) setTitle(f.name.replace(/\.pdf$/i, ''));
  };

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const f = e.dataTransfer.files[0];
    if (f) handleFile(f);
  }, [title]);

  const onDragOver = (e: React.DragEvent) => { e.preventDefault(); setDragging(true); };
  const onDragLeave = () => setDragging(false);

  const handleSubmit = async () => {
    if (!file) return;
    setUploading(true);
    setError('');
    try {
      const res = await uploadPdf(file, title);
      router.push(`/processing/${res.flipbook.slug}`);
    } catch (err: any) {
      setError(err.message || 'Upload failed. Please try again.');
      setUploading(false);
    }
  };

  return (
    <div style={{ maxWidth: 560, margin: '0 auto', width: '100%' }}>
      {/* Drop zone */}
      <div
        onClick={() => !file && inputRef.current?.click()}
        onDrop={onDrop}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        style={{
          border: `2px dashed ${dragging ? 'var(--accent)' : file ? 'var(--accent)' : 'var(--border-strong)'}`,
          borderRadius: 'var(--radius-lg)',
          padding: '3rem 2rem',
          textAlign: 'center',
          cursor: file ? 'default' : 'pointer',
          background: dragging ? 'var(--accent-glow)' : file ? 'var(--gradient-subtle)' : 'var(--bg-secondary)',
          transition: 'all 0.2s ease',
          marginBottom: '1.25rem',
        }}
      >
        <input ref={inputRef} type="file" accept=".pdf" style={{ display: 'none' }} onChange={e => { if (e.target.files?.[0]) handleFile(e.target.files[0]); }} />

        {file ? (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem' }}>
            <FileText size={32} color="var(--accent)" />
            <div style={{ textAlign: 'left' }}>
              <div style={{ fontWeight: 600, fontSize: '0.95rem', color: 'var(--text-primary)' }}>{file.name}</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{(file.size / 1024 / 1024).toFixed(2)} MB</div>
            </div>
            <button onClick={(e) => { e.stopPropagation(); setFile(null); setTitle(''); }} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', padding: 4 }}>
              <X size={18} />
            </button>
          </div>
        ) : (
          <>
            <div style={{ width: 52, height: 52, borderRadius: '50%', background: 'var(--gradient)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem' }}>
              <Upload size={22} color="white" />
            </div>
            <div style={{ fontWeight: 600, fontSize: '1rem', marginBottom: '0.4rem' }}>
              {dragging ? 'Drop it here!' : 'Drag & drop your PDF here'}
            </div>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>or click to browse your files</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.75rem' }}>PDF only · Max 50MB</div>
          </>
        )}
      </div>

      {/* Title */}
      <input
        type="text"
        placeholder="Custom title (optional)"
        value={title}
        onChange={e => setTitle(e.target.value)}
        style={{
          width: '100%',
          padding: '0.75rem 1rem',
          borderRadius: 'var(--radius-md)',
          border: '1px solid var(--border-strong)',
          background: 'var(--bg-secondary)',
          color: 'var(--text-primary)',
          fontSize: '0.95rem',
          outline: 'none',
          marginBottom: '1rem',
          transition: 'border-color 0.2s ease',
        }}
        onFocus={e => e.target.style.borderColor = 'var(--accent)'}
        onBlur={e => e.target.style.borderColor = 'var(--border-strong)'}
      />

      {/* Error */}
      {error && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#ef4444', fontSize: '0.875rem', marginBottom: '1rem', padding: '0.75rem', background: 'rgba(239,68,68,0.08)', borderRadius: 'var(--radius-sm)', border: '1px solid rgba(239,68,68,0.2)' }}>
          <AlertCircle size={16} />
          {error}
        </div>
      )}

      {/* Submit */}
      <button
        className="btn-primary"
        onClick={handleSubmit}
        disabled={!file || uploading}
        style={{ width: '100%', padding: '0.875rem', fontSize: '1rem', opacity: !file || uploading ? 0.6 : 1, cursor: !file || uploading ? 'not-allowed' : 'pointer' }}
      >
        {uploading ? 'Uploading...' : 'Upload & convert'}
      </button>
    </div>
  );
}