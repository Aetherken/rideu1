import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import session from 'express-session';
import authRoutes from './routes/authRoutes.js';
import cityRoutes from './routes/cityRoutes.js';
import routeRoutes from './routes/routeRoutes.js';
import busRoutes from './routes/busRoutes.js';
import bookingRoutes from './routes/bookingRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import notificationRoutes from './routes/notificationRoutes.js';
import fareRoutes from './routes/fareRoutes.js';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(session({
    secret: process.env.SESSION_SECRET || 'fallback-secret',
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: process.env.NODE_ENV === 'production',
        httpOnly: true,
        maxAge: 1000 * 60 * 60 * 24 // 1 day
    }
}));

// Static uploads folder for images
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/cities', cityRoutes);
app.use('/api/routes', routeRoutes);
app.use('/api/buses', busRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/fare', fareRoutes);

app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', message: 'RideU API is running' });
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
