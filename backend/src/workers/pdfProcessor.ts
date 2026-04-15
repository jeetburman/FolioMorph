import { Worker, Job } from 'bullmq';
import { execFile } from 'child_process';
import { promisify } from 'util';
import path from 'path';
import fs from 'fs';
import { prisma } from '../services/prisma';
import { uploadFileToStorage } from '../services/storage';

const execFileAsync = promisify(execFile);

const redisUrl = new URL(process.env.REDIS_URL!);
const connection = {
  host: redisUrl.hostname,
  port: parseInt(redisUrl.port),
  password: redisUrl.password,
  tls: { rejectUnauthorized: false },
  enableTLSForSentinelMode: false,
  maxRetriesPerRequest: null,
};

// Update this to your Ghostscript path
const GS_PATH = process.env.GS_PATH || 'gswin64c';

export interface PDFJobData {
  flipbookId: string;
  localPdfPath: string;
  pageCount: number;
}

async function convertPdfPageToPng(
  pdfPath: string,
  pageNumber: number,
  outputPath: string
): Promise<void> {
  const args = [
    '-dNOPAUSE',
    '-dBATCH',
    '-dSAFER',
    '-sDEVICE=png16m',
    '-r150',
    `-dFirstPage=${pageNumber}`,
    `-dLastPage=${pageNumber}`,
    '-dDEVICEWIDTH=1240',
    '-dDEVICEHEIGHT=1754',
    '-dFIXEDMEDIA',
    '-dPDFFitPage',
    `-sOutputFile=${outputPath}`,
    pdfPath,
  ];

  await execFileAsync(GS_PATH, args);
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
      for (let i = 1; i <= pageCount; i++) {
        await job.updateProgress(Math.floor((i / pageCount) * 100));

        const localImagePath = path.join(outputDir, `page-${i}.png`);

        console.log(`Converting page ${i}/${pageCount}...`);
        await convertPdfPageToPng(localPdfPath, i, localImagePath);

        const r2Key = `flipbooks/${flipbookId}/page-${i}.png`;
        const imageUrl = await uploadFileToStorage(localImagePath, r2Key, 'image/png');

        await prisma.page.create({
          data: {
            flipbookId,
            pageNumber: i,
            imageUrl,
          },
        });

        fs.unlinkSync(localImagePath);
        console.log(`✅ Page ${i} done: ${imageUrl}`);
      }

      await prisma.flipbook.update({
        where: { id: flipbookId },
        data: { status: 'READY', pageCount },
      });

      // Cleanup
      if (fs.existsSync(localPdfPath)) fs.unlinkSync(localPdfPath);
      if (fs.existsSync(outputDir)) fs.rmdirSync(outputDir);

      console.log(`🎉 Flipbook ${flipbookId} processed successfully!`);
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