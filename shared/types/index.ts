export type FlipbookStatus = 'PENDING' | 'PROCESSING' | 'READY' | 'FAILED';

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

export interface Page {
  id: string;
  flipbookId: string;
  pageNumber: number;
  imageUrl: string;
}