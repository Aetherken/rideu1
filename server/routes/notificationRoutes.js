import express from 'express';
import pool from '../db/db.js';
import { sendEmail } from '../utils/email.js';
import { requireAdmin } from '../middleware/authMiddleware.js';

export const sendNotification = async (req, res) => {
    const { type, title, message, route_id } = req.body; // type: announcement, delay, maintenance

    if (!type || !title || !message) {
        return res.status(400).json({ message: 'Missing notification payload' });
    }

    try {
        await pool.query(
            'INSERT INTO notifications (type, title, message, route_id, sent_by) VALUES (?, ?, ?, ?, ?)',
            [type, title, message, route_id || null, req.session.userId]
        );

        // Fetch target emails
        let emailQuery = 'SELECT email FROM users WHERE role = "student" AND status = "active"';
        let emailParams = [];

        if (type === 'delay' && route_id) {
            // Find students who booked this route today/future
            emailQuery = `
        SELECT DISTINCT u.email 
        FROM users u 
        JOIN bookings b ON u.id = b.user_id 
        WHERE b.route_id = ? AND b.status = "active"
      `;
            emailParams.push(route_id);
        }

        const [users] = await pool.query(emailQuery, emailParams);
        const emails = users.map(u => u.email);

        if (emails.length > 0) {
            // Bcc all users for privacy, or loop
            const bcc = emails.join(',');
            sendEmail(
                bcc,
                title,
                message,
                `<p>${message}</p>`
            ).catch(e => console.error(e));
        }

        res.status(201).json({ message: 'Notification sent successfully' });
    } catch (error) {
        console.error('Notification error:', error);
        res.status(500).json({ message: 'Server error sending notification' });
    }
};

export const getNotifications = async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM notifications ORDER BY created_at DESC');
        res.json(rows);
    } catch (e) {
        res.status(500).json({ message: 'Server error fetching notifications' });
    }
};

const router = express.Router();

router.post('/', requireAdmin, sendNotification);
router.get('/', requireAdmin, getNotifications);

export default router;
