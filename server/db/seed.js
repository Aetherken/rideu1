import pool from './db.js';
import bcrypt from 'bcrypt';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const seedDatabase = async () => {
    try {
        console.log('Starting database initialization...');

        // 1. Run setup.sql to build schema
        const sqlFilePath = path.join(__dirname, 'setup.sql');
        const sql = fs.readFileSync(sqlFilePath, 'utf8');

        // We split by ';' to execute multiple statements, filtering out empty ones
        const statements = sql.split(';').filter(stmt => stmt.trim().length > 0);

        for (const statement of statements) {
            await pool.query(statement);
        }
        console.log('✅ Schema created successfully.');

        // 2. Check if SuperAdmin exists
        const [adminRows] = await pool.query('SELECT * FROM users WHERE role = ?', ['superadmin']);

        if (adminRows.length === 0) {
            const adminUsername = process.env.ADMIN_USERNAME || 'admin';
            const adminPasswordRaw = process.env.ADMIN_PASSWORD || 'admin123';
            const adminName = 'Super Admin';
            const adminEmail = process.env.SMTP_USER || 'admin@rideu.com';

            const hashedPassword = await bcrypt.hash(adminPasswordRaw, 10);

            await pool.query(
                'INSERT INTO users (name, student_id, email, password, role) VALUES (?, ?, ?, ?, ?)',
                [adminName, 'ADMIN-001', adminEmail, hashedPassword, 'superadmin']
            );
            console.log('✅ Super Admin seeded.');
        } else {
            console.log('ℹ️ Super Admin already exists.');
        }

        // 3. Seed cities if empty
        const [cityRows] = await pool.query('SELECT * FROM cities');
        if (cityRows.length === 0) {
            const cities = ['Kannur', 'Thalassery', 'Iritty', 'Payyanur', 'Koothuparamba'];
            for (const city of cities) {
                await pool.query('INSERT INTO cities (name) VALUES (?)', [city]);
            }
            console.log('✅ Cities seeded.');
        } else {
            console.log('ℹ️ Cities already seeded.');
        }

        // 4. Seed routes if empty
        const [routeRows] = await pool.query('SELECT * FROM routes');
        if (routeRows.length === 0) {
            // Get city IDs
            const [cities] = await pool.query('SELECT id, name FROM cities');

            const routesData = cities.map((city, index) => ({
                name: `Vimal Jyothi to ${city.name}`,
                destination_city_id: city.id,
                duration_minutes: 45 + (index * 15) // mock duration
            }));

            for (const route of routesData) {
                await pool.query(
                    'INSERT INTO routes (name, destination_city_id, duration_minutes) VALUES (?, ?, ?)',
                    [route.name, route.destination_city_id, route.duration_minutes]
                );
            }
            console.log('✅ Routes seeded.');
        }

        // 5. Seed default fare if empty
        const [fareRows] = await pool.query('SELECT * FROM fare_config');
        if (fareRows.length === 0) {
            // Find the superadmin id
            const [admins] = await pool.query('SELECT id FROM users WHERE role = ? LIMIT 1', ['superadmin']);
            const adminId = admins.length > 0 ? admins[0].id : 1;

            await pool.query(
                'INSERT INTO fare_config (amount, updated_by) VALUES (?, ?)',
                [25.00, adminId]
            );
            console.log('✅ Base fare configured.');
        }

        console.log('🎉 Database seeding completed successfully.');
    } catch (error) {
        console.error('❌ Error seeding database:', error);
    } finally {
        process.exit();
    }
};

seedDatabase();
