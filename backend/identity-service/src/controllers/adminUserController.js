const User = require('../models/User');

exports.getAllUsers = async (req, res) => {
    try {
        const { getDb } = require('../config/db');
        const db = getDb();
        const users = await db.collection('users').find({}).sort({ createdAt: -1 }).toArray();

        res.json({
            success: true,
            data: users
        });
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch users'
        });
    }
};
