import bcrypt from 'bcrypt';
import pool from '../db/db.js';
import { sendEmail } from '../utils/email.js';

export const register = async (req, res) => {
    const { name, student_id, phone, email, password } = req.body;
    if (!name || !student_id || !email || !password) {
        return res.status(400).json({ message: 'Please provide all required fields.' });
    }

    try {
        // Check if user already exists
        const [existingUsers] = await pool.query(
            'SELECT id FROM users WHERE email = ? OR student_id = ?',
            [email, student_id]
        );

        if (existingUsers.length > 0) {
            return res.status(400).json({ message: 'User with this email or student ID already exists.' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const [result] = await pool.query(
            'INSERT INTO users (name, student_id, phone, email, password) VALUES (?, ?, ?, ?, ?)',
            [name, student_id, phone, email, hashedPassword]
        );

        // Send Welcome Email
        const subject = 'Welcome to RideU! 🚌';
        const text = `Hi ${name},\n\nWelcome to RideU! Your account has been successfully created.\nStudent ID: ${student_id}\n\nYou can now book your bus passes online.\n\nBest,\nRideU Team`;
        const html = `<h3>Hi ${name},</h3><p>Welcome to <strong>RideU</strong>! Your account has been successfully created.</p><p>Student ID: <strong>${student_id}</strong></p><p>You can now book your bus passes online.</p><br><p>Best,<br>RideU Team</p>`;

        // Non-blocking email send
        sendEmail(email, subject, text, html).catch(err => console.error(err));

        res.status(201).json({ message: 'Registration successful!', userId: result.insertId });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ message: 'Server error during registration.' });
    }
};

export const login = async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ message: 'Please provide email and password.' });
    }

    try {
        const [users] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
        if (users.length === 0) {
            return res.status(401).json({ message: 'Invalid email or password.' });
        }

        const user = users[0];

        if (user.status !== 'active') {
            return res.status(403).json({ message: `Account is ${user.status}. Please contact support.` });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid email or password.' });
        }

        // Set session
        req.session.userId = user.id;
        req.session.role = user.role;
        req.session.name = user.name;

        // do not send password to client
        delete user.password;
        res.status(200).json({ message: 'Login successful.', user });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'Server error during login.' });
    }
};

export const logout = (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.error('Logout error:', err);
            return res.status(500).json({ message: 'Could not log out.' });
        }
        res.clearCookie('connect.sid'); // default cookie name for express-session
        res.status(200).json({ message: 'Logout successful.' });
    });
};

export const getMe = async (req, res) => {
    if (!req.session || !req.session.userId) {
        return res.status(401).json({ message: 'Not authenticated' });
    }

    try {
        const [users] = await pool.query('SELECT id, name, student_id, phone, email, role, status FROM users WHERE id = ?', [req.session.userId]);
        if (users.length === 0) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json({ user: users[0] });
    } catch (error) {
        console.error('Get profile error:', error);
        res.status(500).json({ message: 'Server error fetching profile.' });
    }
};
