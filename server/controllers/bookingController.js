import pool from '../db/db.js';
import { sendEmail } from '../utils/email.js';
import crypto from 'crypto';

export const getMyBookings = async (req, res) => {
    try {
        const [rows] = await pool.query(`
      SELECT b.*, r.name as route_name, c.name as city_name, bus.number as bus_number,
             t.departure_time, t.arrival_time
      FROM bookings b
      JOIN routes r ON b.route_id = r.id
      JOIN cities c ON r.destination_city_id = c.id
      JOIN buses bus ON b.bus_id = bus.id
      JOIN time_slots t ON b.time_slot_id = t.id
      WHERE b.user_id = ?
      ORDER BY b.created_at DESC
    `, [req.session.userId]);
        res.json(rows);
    } catch (error) {
        console.error('Error fetching bookings:', error);
        res.status(500).json({ message: 'Server error fetching bookings' });
    }
};

export const createBooking = async (req, res) => {
    const { route_id, bus_id, time_slot_id, fare } = req.body;
    if (!route_id || !bus_id || !time_slot_id || !fare) {
        return res.status(400).json({ message: 'Missing booking details' });
    }

    const connection = await pool.getConnection();

    try {
        await connection.beginTransaction();

        // Check seat availability
        const [slots] = await connection.query('SELECT seats_available FROM time_slots WHERE id = ? FOR UPDATE', [time_slot_id]);
        if (slots.length === 0 || slots[0].seats_available <= 0) {
            await connection.rollback();
            return res.status(400).json({ message: 'No seats available for this slot' });
        }

        // Generate unique pass ID
        const pass_id = `RU-${crypto.randomBytes(4).toString('hex').toUpperCase()}`;

        // Create booking
        const [result] = await connection.query(
            'INSERT INTO bookings (user_id, route_id, bus_id, time_slot_id, fare, pass_id) VALUES (?, ?, ?, ?, ?, ?)',
            [req.session.userId, route_id, bus_id, time_slot_id, fare, pass_id]
        );

        // Decrement seats
        await connection.query('UPDATE time_slots SET seats_available = seats_available - 1 WHERE id = ?', [time_slot_id]);

        await connection.commit();

        // Send Confirmation Email
        const userEmail = req.session.email || (await pool.query('SELECT email FROM users WHERE id = ?', [req.session.userId]))[0][0].email;
        const userName = req.session.name;

        // Fetch route details to render email nicely
        const [routeDetails] = await pool.query(`
      SELECT r.name as route_name, c.name as city_name, bus.number as bus_number, t.departure_time
      FROM routes r
      JOIN cities c ON r.destination_city_id = c.id
      JOIN buses bus ON bus.id = ?
      JOIN time_slots t ON t.id = ?
      WHERE r.id = ?
    `, [bus_id, time_slot_id, route_id]);

        if (routeDetails.length > 0) {
            const rd = routeDetails[0];
            const subject = `Your RideU Pass Confirmed - ${pass_id}`;
            const text = `Hi ${userName},\n\nYour pass is confirmed.\nRoute: ${rd.route_name}\nBus: ${rd.bus_number}\nDeparture: ${rd.departure_time}\nPass ID: ${pass_id}\n\nHave a safe trip!`;
            const html = `<h3>Hi ${userName},</h3><p>Your pass is <strong>confirmed</strong>!</p><ul><li>Route: ${rd.route_name}</li><li>Bus: ${rd.bus_number}</li><li>Departure: ${rd.departure_time}</li><li>Pass ID: <strong>${pass_id}</strong></li></ul><p>Have a safe trip!</p>`;

            sendEmail(userEmail, subject, text, html).catch(err => console.error(err));
        }

        res.status(201).json({ message: 'Booking successful', pass_id });
    } catch (error) {
        await connection.rollback();
        console.error('Error creating booking:', error);
        res.status(500).json({ message: 'Server error creating booking' });
    } finally {
        connection.release();
    }
};

export const verifyPass = async (req, res) => {
    const { id } = req.params; // booking id or pass_id
    try {
        const [result] = await pool.query('UPDATE bookings SET status = "used" WHERE id = ? OR pass_id = ?', [id, id]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Booking not found' });
        }
        res.json({ message: 'Pass verified and marked as used' });
    } catch (error) {
        console.error('Error verifying pass:', error);
        res.status(500).json({ message: 'Server error verifying pass' });
    }
};
