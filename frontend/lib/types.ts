export type FlipbookStatus = 'PENDING' | 'PROCESSING' | 'READY' | 'FAILED';

export interface Page {
  id: string;
  flipbookId: string;
  pageNumber: number;
  imageUrl: string;
}

export interface Flipbook {
  id: string;
  slug: string;
  title: string;
  originalPdfUrl: string;
  pageCount: number;
  status: FlipbookStatus;
  createdAt: string;
  pages: Page[];
}

export interface FlipbookStatusResponse {
  slug: string;
  status: FlipbookStatus;
  pageCount: number;
}

export interface UploadResponse {
  message: string;
  flipbook: {
    id: string;
    slug: string;
    title: string;
    status: FlipbookStatus;
    pageCount: number;
  };
}