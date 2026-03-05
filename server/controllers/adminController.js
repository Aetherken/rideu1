import pool from '../db/db.js';
import { sendEmail } from '../utils/email.js';

export const getStudents = async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT id, name, student_id, phone, email, status, created_at FROM users WHERE role = "student"');
        res.json(rows);
    } catch (error) {
        console.error('Error fetching students:', error);
        res.status(500).json({ message: 'Server error fetching students' });
    }
};

export const updateStudentStatus = async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;
    if (!['active', 'deactivated', 'banned'].includes(status)) {
        return res.status(400).json({ message: 'Invalid status' });
    }

    try {
        await pool.query('UPDATE users SET status = ? WHERE id = ? AND role = "student"', [status, id]);
        res.json({ message: `Student status updated to ${status}` });
    } catch (error) {
        console.error('Error updating status:', error);
        res.status(500).json({ message: 'Server error updating status' });
    }
};

export const flagStudent = async (req, res) => {
    const { id } = req.params;
    const { reason, action } = req.body; // action: 'flag' or 'ban'

    if (!reason || !action) {
        return res.status(400).json({ message: 'Reason and action required' });
    }

    const connection = await pool.getConnection();
    try {
        await connection.beginTransaction();

        await connection.query(
            'INSERT INTO flagged_users (user_id, reason, flagged_by) VALUES (?, ?, ?)',
            [id, reason, req.session.userId]
        );

        if (action === 'ban') {
            await connection.query('UPDATE users SET status = "banned" WHERE id = ?', [id]);
        }

        await connection.commit();

        // Send email
        const [user] = await pool.query('SELECT email, name FROM users WHERE id = ?', [id]);
        if (user.length > 0) {
            const subject = action === 'ban' ? 'Account Banned - RideU' : 'Account Flagged Warning - RideU';
            const text = `Hi ${user[0].name},\n\nYour account has been ${action === 'ban' ? 'banned' : 'flagged'} for the following reason:\n${reason}\n\nContact support.`;
            const html = `<p>Hi ${user[0].name},</p><p>Your account has been <strong>${action === 'ban' ? 'banned' : 'flagged'}</strong> for the following reason:</p><blockquote>${reason}</blockquote><p>Contact support.</p>`;

            sendEmail(user[0].email, subject, text, html).catch(err => console.error(err));
        }

        res.json({ message: `Student ${action} applied successfully` });
    } catch (error) {
        await connection.rollback();
        console.error('Error flagging student:', error);
        res.status(500).json({ message: 'Server error flagging student' });
    } finally {
        connection.release();
    }
};

// CSV generation basic helpers (in-controller for simplicity)
export const getBookingsReport = async (req, res) => {
    const { date } = req.query; // optional start date filter
    let query = `
    SELECT b.pass_id, u.name as student_name, u.student_id, r.name as route_name, c.name as city, 
           b.fare, b.status, b.created_at
    FROM bookings b
    JOIN users u ON b.user_id = u.id
    JOIN routes r ON b.route_id = r.id
    JOIN cities c ON r.destination_city_id = c.id
  `;
    const params = [];

    if (date) {
        query += ' WHERE DATE(b.created_at) = ?';
        params.push(date);
    }

    try {
        const [rows] = await pool.query(query, params);
        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', `attachment; filename=bookings_report_${date || 'all'}.csv`);

        let csv = 'Pass ID,Student Name,Student ID,Route,City,Fare,Status,Date\n';
        rows.forEach(r => {
            csv += `${r.pass_id},${r.student_name},${r.student_id},${r.route_name},${r.city},${r.fare},${r.status},${r.created_at}\n`;
        });

        res.send(csv);
    } catch (error) {
        res.status(500).json({ message: 'Error generating report' });
    }
};
