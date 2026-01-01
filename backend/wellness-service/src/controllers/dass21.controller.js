const { getDb } = require('../config/db');
const { verifyToken } = require('../utils/jwt');
const { ObjectId } = require('mongodb');

const dass21Controller = {
    // POST /api/dass21
    saveAssessment: async (req, res) => {
        try {
            console.log('DASS-21 API: Starting POST request');

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
            const { answers, scores, completedAt } = req.body;

            if (!answers || !scores) {
                return res.status(400).json({ error: 'Answers and scores are required' });
            }

            const assessment = {
                id: new ObjectId().toString(),
                answers,
                scores: {
                    depression: scores.depression,
                    anxiety: scores.anxiety,
                    stress: scores.stress
                },
                completedAt: completedAt || new Date().toISOString(),
                createdAt: new Date()
            };

            const db = getDb();
            const collection = db.collection('users');

            const existingUser = await collection.findOne({ firebaseUid: userId });

            if (!existingUser) {
                return res.status(404).json({ error: 'User not found' });
            }

            await collection.updateOne(
                { firebaseUid: userId },
                {
                    $push: {
                        dass21Assessments: {
                            $each: [assessment],
                            $position: 0
                        }
                    },
                    $set: { lastUpdated: new Date() }
                }
            );

            res.json({
                success: true,
                message: 'Assessment saved successfully',
                assessment
            });

        } catch (error) {
            console.error('DASS-21 API: Error saving assessment:', error);
            res.status(500).json({ error: 'Failed to save assessment' });
        }
    },

    // GET /api/dass21
    getAssessments: async (req, res) => {
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
            const { limit } = req.query;
            const limitVal = parseInt(limit) || 10;

            const db = getDb();
            const collection = db.collection('users');

            const user = await collection.findOne(
                { firebaseUid: userId },
                { projection: { dass21Assessments: 1 } }
            );

            if (!user) {
                return res.json({
                    success: true,
                    data: { assessments: [] }
                });
            }

            const allAssessments = user.dass21Assessments || [];
            const recentAssessments = allAssessments.slice(0, limitVal);

            res.json({
                success: true,
                data: { assessments: recentAssessments }
            });

        } catch (error) {
            console.error('DASS-21 API: Error fetching assessments:', error);
            res.status(500).json({ error: 'Failed to fetch assessments' });
        }
    }
};

module.exports = dass21Controller;
