import pool from '../db/db.js';

export const getBuses = async (req, res) => {
    try {
        const [rows] = await pool.query(`
      SELECT b.*, c.name as city_name 
      FROM buses b 
      JOIN cities c ON b.city_id = c.id
    `);
        res.json(rows);
    } catch (error) {
        console.error('Error fetching buses:', error);
        res.status(500).json({ message: 'Server error fetching buses' });
    }
};

export const addBus = async (req, res) => {
    // Assuming multer handles the image upload and puts path in req.file
    const { name, number, city_id, capacity } = req.body;
    const image_url = req.file ? `/uploads/${req.file.filename}` : null;

    if (!number || !city_id || !capacity) {
        return res.status(400).json({ message: 'Missing required bus fields' });
    }

    try {
        const [result] = await pool.query(
            'INSERT INTO buses (name, number, city_id, capacity, image_url) VALUES (?, ?, ?, ?, ?)',
            [name, number, city_id, capacity, image_url]
        );
        res.status(201).json({ id: result.insertId, message: 'Bus added successfully', image_url });
    } catch (error) {
        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(400).json({ message: 'Bus number already exists' });
        }
        console.error('Error adding bus:', error);
        res.status(500).json({ message: 'Server error adding bus' });
    }
};

export const deleteBus = async (req, res) => {
    const { id } = req.params;
    try {
        await pool.query('DELETE FROM buses WHERE id = ?', [id]);
        res.json({ message: 'Bus deleted' });
    } catch (error) {
        console.error('Error deleting bus:', error);
        res.status(500).json({ message: 'Server error deleting bus' });
    }
};
