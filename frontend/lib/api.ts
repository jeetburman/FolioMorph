import { Flipbook, FlipbookStatusResponse, UploadResponse } from './types';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

export async function uploadPdf(file: File, title?: string): Promise<UploadResponse> {
  const formData = new FormData();
  formData.append('pdf', file);
  if (title) formData.append('title', title);

  const res = await fetch(`${API_URL}/api/flipbooks/upload`, {
    method: 'POST',
    body: formData,
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || 'Upload failed');
  }

  return res.json();
}

export async function getFlipbookStatus(slug: string): Promise<FlipbookStatusResponse> {
  const res = await fetch(`${API_URL}/api/flipbooks/${slug}/status`);
  if (!res.ok) throw new Error('Failed to fetch status');
  return res.json();
}

export async function getFlipbook(slug: string): Promise<Flipbook> {
  const res = await fetch(`${API_URL}/api/flipbooks/${slug}`);
  if (!res.ok) throw new Error('Flipbook not found');
  return res.json();
}