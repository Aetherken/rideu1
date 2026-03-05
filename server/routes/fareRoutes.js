import express from 'express';
import pool from '../db/db.js';
import { requireSuperAdmin, requireAuth } from '../middleware/authMiddleware.js';

const router = express.Router();

export const getFare = async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT amount FROM fare_config ORDER BY updated_at DESC LIMIT 1');
        if (rows.length === 0) return res.status(404).json({ message: 'Fare not set' });
        res.json({ fare: rows[0].amount });
    } catch (e) {
        res.status(500).json({ message: 'Server error' });
    }
};

export const updateFare = async (req, res) => {
    const { amount } = req.body;
    if (!amount || amount <= 0) return res.status(400).json({ message: 'Invalid amount' });

    try {
        await pool.query('INSERT INTO fare_config (amount, updated_by) VALUES (?, ?)', [amount, req.session.userId]);
        res.json({ message: 'Fare updated successfully', fare: amount });
    } catch (e) {
        res.status(500).json({ message: 'Server error' });
    }
};

router.get('/', requireAuth, getFare); // All users can see the base fare
router.patch('/', requireSuperAdmin, updateFare);

export default router;
