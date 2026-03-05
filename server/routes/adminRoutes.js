import express from 'express';
import { getStudents, updateStudentStatus, flagStudent, getBookingsReport } from '../controllers/adminController.js';
import { requireAdmin, requireSuperAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

// Students
router.get('/students', requireAdmin, getStudents);
router.patch('/students/:id/status', requireSuperAdmin, updateStudentStatus);
router.post('/students/:id/flag', requireSuperAdmin, flagStudent);

// Reports
router.get('/reports/bookings', requireAdmin, getBookingsReport);

export default router;
