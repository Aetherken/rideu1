import express from 'express';
import { getRoutes, getRouteSlots, addRoute, deleteRoute } from '../controllers/routeController.js';
import { requireAuth, requireSuperAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', requireAuth, getRoutes);
router.get('/:id/slots', requireAuth, getRouteSlots);
router.post('/', requireSuperAdmin, addRoute);
router.delete('/:id', requireSuperAdmin, deleteRoute);

export default router;
