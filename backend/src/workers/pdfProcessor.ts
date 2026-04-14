import { Worker, Job } from 'bullmq';
import { fromPath } from 'pdf2pic';
import path from 'path';
import fs from 'fs';
import { prisma } from '../services/prisma';
import { uploadFileToStorage } from '../services/storage';

const connection = {
  host: process.env.REDIS_URL?.replace('redis://', '').split(':')[0] || 'localhost',
  port: parseInt(process.env.REDIS_URL?.split(':').pop() || '6379'),
};

export interface PDFJobData {
  flipbookId: string;
  localPdfPath: string;
  pageCount: number;
}

export const pdfWorker = new Worker(
  'pdf-processing',
  async (job: Job<PDFJobData>) => {
    const { flipbookId, localPdfPath, pageCount } = job.data;

    console.log(`Processing flipbook ${flipbookId}...`);

    await prisma.flipbook.update({
      where: { id: flipbookId },
      data: { status: 'PROCESSING' },
    });

    const outputDir = path.join(process.cwd(), 'uploads', `pages-${flipbookId}`);
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    try {
      const convert = fromPath(localPdfPath, {
        density: 150,
        saveFilename: 'page',
        savePath: outputDir,
        format: 'png',
        width: 1240,
        height: 1754,
      });

      const pageUrls: string[] = [];

      for (let i = 1; i <= pageCount; i++) {
        await job.updateProgress(Math.floor((i / pageCount) * 100));

        const result = await convert(i, { responseType: 'image' });
        const localImagePath = result.path!;

        const r2Key = `flipbooks/${flipbookId}/page-${i}.png`;
        const imageUrl = await uploadFileToStorage(localImagePath, r2Key, 'image/png');
        pageUrls.push(imageUrl);

        await prisma.page.create({
          data: {
            flipbookId,
            pageNumber: i,
            imageUrl,
          },
        });

        fs.unlinkSync(localImagePath);
      }

      await prisma.flipbook.update({
        where: { id: flipbookId },
        data: {
          status: 'READY',
          pageCount,
        },
      });

      // Cleanup local PDF
      fs.unlinkSync(localPdfPath);
      fs.rmdirSync(outputDir);

      console.log(`Flipbook ${flipbookId} processed successfully!`);
    } catch (error) {
      console.error(`Failed to process flipbook ${flipbookId}:`, error);

      await prisma.flipbook.update({
        where: { id: flipbookId },
        data: { status: 'FAILED' },
      });

      throw error;
    }
  },
  { connection }
);

pdfWorker.on('completed', (job) => {
  console.log(`Job ${job.id} completed`);
});

pdfWorker.on('failed', (job, err) => {
  console.error(`Job ${job?.id} failed:`, err.message);
});