import express from 'express';
import { pool } from './db.js';
import { requestLogger } from './middleware/requestLogger.js';
import { biodataRouter } from './routes/biodata.js';
import { errorResponse, successResponse } from './utils/responses.js';

export const app = express();

app.use(requestLogger);
app.use(express.json({ limit: '32kb' }));

app.get('/health', async (req, res, next) => {
  try {
    await pool.query('SELECT 1');
    return successResponse(res, 'API dan database tersedia', { status: 'ok' });
  } catch (error) {
    return next(error);
  }
});

app.use('/biodata', biodataRouter);
app.get('/', async (req, res, next) => {
  try {
    const { rows } = await pool.query('SELECT * FROM biodata ORDER BY id');
    return successResponse(res, 'Data berhasil diambil', rows);
  } catch (error) {
    return next(error);
  }
});

app.use((req, res) => errorResponse(res, 'Endpoint tidak ditemukan', 404));

app.use((error, req, res, next) => {
  if (res.headersSent) return next(error);

  if (error instanceof SyntaxError && error.status === 400 && 'body' in error) {
    return errorResponse(res, 'JSON tidak valid', 400);
  }

  console.error('Request failed:', error.message);
  return errorResponse(res, 'Terjadi kesalahan pada server', 500);
});
