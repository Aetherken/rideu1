import pool from '../db/db.js';

export const getRoutes = async (req, res) => {
    try {
        const [rows] = await pool.query(`
      SELECT r.*, c.name as destination_city_name 
      FROM routes r 
      JOIN cities c ON r.destination_city_id = c.id 
      WHERE r.status = 'active'
    `);
        res.json(rows);
    } catch (error) {
        console.error('Error fetching routes:', error);
        res.status(500).json({ message: 'Server error fetching routes' });
    }
};

export const getRouteSlots = async (req, res) => {
    const { id } = req.params;
    try {
        const [rows] = await pool.query('SELECT * FROM time_slots WHERE route_id = ? AND status = "active" ORDER BY departure_time ASC', [id]);
        res.json(rows);
    } catch (error) {
        console.error('Error fetching route slots:', error);
        res.status(500).json({ message: 'Server error fetching route slots' });
    }
};

export const addRoute = async (req, res) => {
    const { name, destination_city_id, duration_minutes } = req.body;
    if (!name || !destination_city_id || !duration_minutes) {
        return res.status(400).json({ message: 'Missing required route fields' });
    }
    try {
        const [result] = await pool.query(
            'INSERT INTO routes (name, destination_city_id, duration_minutes) VALUES (?, ?, ?)',
            [name, destination_city_id, duration_minutes]
        );
        res.status(201).json({ id: result.insertId, message: 'Route created' });
    } catch (error) {
        console.error('Error adding route:', error);
        res.status(500).json({ message: 'Server error adding route' });
    }
};

export const deleteRoute = async (req, res) => {
    const { id } = req.params;
    try {
        await pool.query('DELETE FROM routes WHERE id = ?', [id]);
        res.json({ message: 'Route deleted' });
    } catch (error) {
        console.error('Error deleting route:', error);
        res.status(500).json({ message: 'Server error deleting route' });
    }
};
