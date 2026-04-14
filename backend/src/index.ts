import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import flipbookRoutes from './routes/flipbook';
import './workers/pdfProcessor';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.use('/api/flipbooks', flipbookRoutes);

app.listen(PORT, () => {
  console.log(`FolioMorph backend running on http://localhost:${PORT}`);
});

export default app;