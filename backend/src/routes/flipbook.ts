import { Router, Request, Response } from 'express';
import { Queue } from 'bullmq';
import { v4 as uuidv4 } from 'uuid';
import { upload } from '../middleware/upload';
import { prisma } from '../services/prisma';
import { uploadFileToStorage } from '../services/storage';
import { PDFJobData } from '../workers/pdfProcessor';
import { fromPath } from 'pdf2pic';
import path from 'path';

const router = Router();

const connection = {
  host: process.env.REDIS_URL?.replace('redis://', '').split(':')[0] || 'localhost',
  port: parseInt(process.env.REDIS_URL?.split(':').pop() || '6379'),
};

const pdfQueue = new Queue<PDFJobData>('pdf-processing', { connection });

// Generate unique slug
function generateSlug(title: string): string {
  return (
    title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '') +
    '-' +
    uuidv4().slice(0, 6)
  );
}

// Get page count from PDF
async function getPdfPageCount(filePath: string): Promise<number> {
  const convert = fromPath(filePath, {
    density: 72,
    saveFilename: 'temp',
    savePath: path.dirname(filePath),
    format: 'png',
  });
  const info = await convert.bulk(-1, { responseType: 'buffer' });
  return Array.isArray(info) ? info.length : 1;
}

// POST /api/flipbooks/upload
router.post('/upload', upload.single('pdf'), async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.file) {
      res.status(400).json({ error: 'No PDF file uploaded' });
      return;
    }

    const title = (req.body.title as string) || req.file.originalname.replace('.pdf', '');
    const slug = generateSlug(title);
    const flipbookId = uuidv4();

    // Get page count
    const pageCount = await getPdfPageCount(req.file.path);

    // Upload original PDF to R2
    const pdfR2Key = `flipbooks/${flipbookId}/original.pdf`;
    const originalPdfUrl = await uploadFileToStorage(req.file.path, pdfR2Key, 'application/pdf');

    // Create flipbook record
    const flipbook = await prisma.flipbook.create({
      data: {
        id: flipbookId,
        slug,
        title,
        originalPdfUrl,
        pageCount,
        status: 'PENDING',
      },
    });

    // Queue the processing job
    await pdfQueue.add('process-pdf', {
      flipbookId,
      localPdfPath: req.file.path,
      pageCount,
    });

    res.status(201).json({
      message: 'Upload successful, processing started',
      flipbook: {
        id: flipbook.id,
        slug: flipbook.slug,
        title: flipbook.title,
        status: flipbook.status,
        pageCount: flipbook.pageCount,
      },
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ error: 'Upload failed' });
  }
});

// GET /api/flipbooks/:slug — Get flipbook with pages
router.get('/:slug', async (req: Request, res: Response): Promise<void> => {
  try {
    const flipbook = await prisma.flipbook.findUnique({
      where: { slug: req.params.slug },
      include: {
        pages: {
          orderBy: { pageNumber: 'asc' },
        },
      },
    });

    if (!flipbook) {
      res.status(404).json({ error: 'Flipbook not found' });
      return;
    }

    res.json(flipbook);
  } catch (error) {
    console.error('Fetch error:', error);
    res.status(500).json({ error: 'Failed to fetch flipbook' });
  }
});

// GET /api/flipbooks/:slug/status — Poll processing status
router.get('/:slug/status', async (req: Request, res: Response): Promise<void> => {
  try {
    const flipbook = await prisma.flipbook.findUnique({
      where: { slug: req.params.slug },
      select: {
        status: true,
        pageCount: true,
        slug: true,
      },
    });

    if (!flipbook) {
      res.status(404).json({ error: 'Flipbook not found' });
      return;
    }

    res.json(flipbook);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch status' });
  }
});

export default router;