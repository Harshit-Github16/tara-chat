const { getDb } = require('../config/db');
const { verifyToken } = require('../utils/jwt');
const { ObjectId } = require('mongodb');

const moodController = {
    // POST /api/mood
    addMood: async (req, res) => {
        try {
            console.log('Mood Controller: Starting POST request');

            const authHeader = req.headers.authorization;
            if (!authHeader || !authHeader.startsWith('Bearer ')) {
                return res.status(401).json({ error: 'No token provided' });
            }

            const token = authHeader.split(' ')[1];
            const decoded = verifyToken(token);

            if (!decoded) {
                return res.status(401).json({ error: 'Invalid token' });
            }

            console.log('Mood Controller: User ID from token:', decoded.userId);

            const { mood, intensity, note } = req.body;

            if (!mood) {
                return res.status(400).json({ error: 'Mood is required' });
            }

            const userId = decoded.firebaseUid || decoded.userId;

            // Validate mood value
            const validMoods = ['calm', 'happy', 'grateful', 'motivated', 'healing', 'lost', 'lonely', 'sad', 'stressed', 'anxious', 'overwhelmed', 'angry'];
            if (!validMoods.includes(mood.toLowerCase())) {
                return res.status(400).json({ error: 'Invalid mood value' });
            }

            const today = new Date().toISOString().split('T')[0];

            const moodEntry = {
                id: new ObjectId().toString(),
                mood: mood.toLowerCase(),
                intensity: intensity || 5,
                note: note || '',
                date: today,
                timestamp: new Date(),
                createdAt: new Date()
            };

            const db = getDb();
            const collection = db.collection('users');

            // We are using MongoDB logic here (like mood-mongo), ignoring Firebase for now 
            // as we are migrating to centralized Mongo services.

            const existingUser = await collection.findOne({ firebaseUid: userId });

            if (!existingUser) {
                // Fallback check
                const userById = await collection.findOne({ _id: new ObjectId(userId) });
                if (!userById) {
                    return res.status(404).json({ error: 'User not found' });
                }
            }

            await collection.updateOne(
                { firebaseUid: userId },
                {
                    $push: {
                        moods: {
                            $each: [moodEntry],
                            $position: 0
                        }
                    },
                    $set: { lastUpdated: new Date() }
                }
            );

            res.json({
                success: true,
                message: 'Mood saved successfully',
                entry: moodEntry
            });

        } catch (error) {
            console.error('Error saving mood:', error);
            res.status(500).json({ error: 'Failed to save mood' });
        }
    },

    // GET /api/mood
    getMoods: async (req, res) => {
        try {
            const authHeader = req.headers.authorization;
            if (!authHeader || !authHeader.startsWith('Bearer ')) {
                return res.status(401).json({ error: 'No token provided' });
            }

            const token = authHeader.split(' ')[1];
            const decoded = verifyToken(token);

            if (!decoded) {
                return res.status(401).json({ error: 'Invalid token' });
            }

            const userId = decoded.firebaseUid || decoded.userId;
            const { date, limit } = req.query;
            const limitVal = parseInt(limit) || 30;

            const db = getDb();
            const collection = db.collection('users');

            const user = await collection.findOne(
                { firebaseUid: userId },
                { projection: { moods: 1 } }
            );

            if (!user) {
                return res.json({
                    success: true,
                    data: { entries: [] }
                });
            }

            const allMoods = user.moods || [];

            if (date) {
                const dateMoods = allMoods.filter(m => m.date === date);
                res.json({
                    success: true,
                    data: { entries: dateMoods }
                });
            } else {
                const recentMoods = allMoods.slice(0, limitVal);
                res.json({
                    success: true,
                    data: { entries: recentMoods }
                });
            }

        } catch (error) {
            console.error('Error fetching moods:', error);
            res.status(500).json({ error: 'Failed to fetch moods' });
        }
    }
};

module.exports = moodController;
