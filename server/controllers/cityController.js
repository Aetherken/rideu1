import pool from '../db/db.js';

export const getCities = async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM cities ORDER BY name ASC');
        res.json(rows);
    } catch (error) {
        console.error('Error fetching cities:', error);
        res.status(500).json({ message: 'Server error fetching cities' });
    }
};

export const addCity = async (req, res) => {
    const { name } = req.body;
    if (!name) return res.status(400).json({ message: 'City name required' });

    try {
        const [result] = await pool.query('INSERT INTO cities (name) VALUES (?)', [name]);
        res.status(201).json({ id: result.insertId, name });
    } catch (error) {
        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(400).json({ message: 'City already exists' });
        }
        console.error('Error adding city:', error);
        res.status(500).json({ message: 'Server error adding city' });
    }
};

export const deleteCity = async (req, res) => {
    const { id } = req.params;
    try {
        await pool.query('DELETE FROM cities WHERE id = ?', [id]);
        res.json({ message: 'City deleted' });
    } catch (error) {
        if (error.code === 'ER_ROW_IS_REFERENCED_2') {
            return res.status(400).json({ message: 'Cannot delete city. It is referenced by routes or buses.' });
        }
        console.error('Error deleting city:', error);
        res.status(500).json({ message: 'Server error deleting city' });
    }
};
