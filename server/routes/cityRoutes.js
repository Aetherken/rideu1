import express from 'express';
import { getCities, addCity, deleteCity } from '../controllers/cityController.js';
import { requireAuth, requireSuperAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', requireAuth, getCities);
router.post('/', requireSuperAdmin, addCity);
router.delete('/:id', requireSuperAdmin, deleteCity);

export default router;
