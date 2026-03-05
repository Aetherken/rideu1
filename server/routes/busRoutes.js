import express from 'express';
import multer from 'multer';
import path from 'path';
import { getBuses, addBus, deleteBus } from '../controllers/busController.js';
import { requireAuth, requireAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});
const upload = multer({ storage });

router.get('/', requireAuth, getBuses);
router.post('/', requireAdmin, upload.single('image'), addBus);
router.delete('/:id', requireAdmin, deleteBus);

export default router;
