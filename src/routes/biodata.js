import { Router } from 'express';
import Joi from 'joi';
import { pool } from '../db.js';
import { validateBody, validateId } from '../middleware/validate.js';
import { errorResponse, successResponse } from '../utils/responses.js';

export const biodataRouter = Router();

const biodataSchema = Joi.object({
  nama: Joi.string().trim().min(2).max(100).required(),
  nim: Joi.string().trim().min(5).max(20).required(),
  kelas: Joi.string().trim().min(1).max(20).required(),
});

biodataRouter.get('/', async (req, res, next) => {
  try {
    const { rows } = await pool.query('SELECT * FROM biodata ORDER BY id');
    return successResponse(res, 'Data berhasil diambil', rows);
  } catch (error) {
    return next(error);
  }
});

biodataRouter.post('/', validateBody(biodataSchema), async (req, res, next) => {
  try {
    const { nama, nim, kelas } = req.body;
    const { rows } = await pool.query(
      'INSERT INTO biodata (nama, nim, kelas) VALUES ($1, $2, $3) RETURNING *',
      [nama, nim, kelas],
    );
    return successResponse(res, 'Data berhasil ditambahkan', rows[0], 201);
  } catch (error) {
    return next(error);
  }
});

biodataRouter.put(
  '/:id',
  validateId,
  validateBody(biodataSchema),
  async (req, res, next) => {
    try {
      const { nama, nim, kelas } = req.body;
      const { rows, rowCount } = await pool.query(
        'UPDATE biodata SET nama = $1, nim = $2, kelas = $3 WHERE id = $4 RETURNING *',
        [nama, nim, kelas, req.params.id],
      );
      if (rowCount === 0) return errorResponse(res, 'Data tidak ditemukan', 404);
      return successResponse(res, 'Data berhasil diupdate', rows[0]);
    } catch (error) {
      return next(error);
    }
  },
);

biodataRouter.delete('/:id', validateId, async (req, res, next) => {
  try {
    const { rows, rowCount } = await pool.query(
      'DELETE FROM biodata WHERE id = $1 RETURNING *',
      [req.params.id],
    );
    if (rowCount === 0) return errorResponse(res, 'Data tidak ditemukan', 404);
    return successResponse(res, 'Data berhasil dihapus', rows[0]);
  } catch (error) {
    return next(error);
  }
});
