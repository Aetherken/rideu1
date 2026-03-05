import express from 'express';
import { getMyBookings, createBooking, verifyPass } from '../controllers/bookingController.js';
import { requireAuth, requireAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/my', requireAuth, getMyBookings);
router.post('/', requireAuth, createBooking);
router.patch('/:id/verify', requireAdmin, verifyPass); // Admin/Driver can verify

export default router;
