const { getDb } = require('../config/db');
const { verifyToken } = require('../utils/jwt');

const goalsController = {
    // POST /api/goals
    createGoal: async (req, res) => {
        try {
            const { title, category, targetDays, description, why, howToAchieve, source, dassScores } = req.body;

            const authHeader = req.headers.authorization;
            let userId = req.body.userId;

            if (authHeader && authHeader.startsWith('Bearer ')) {
                const token = authHeader.split(' ')[1];
                const decoded = verifyToken(token);
                if (!decoded) {
                    return res.status(401).json({ error: 'Invalid token' });
                }
                userId = decoded.firebaseUid || decoded.userId;
            }

            if (!userId) {
                return res.status(400).json({ error: 'User ID is required' });
            }

            if (!title) {
                return res.status(400).json({ error: 'Missing required field: title' });
            }

            if (source !== 'stress-check' && source !== 'dass21' && (!why || !howToAchieve)) {
                return res.status(400).json({ error: 'Missing required fields: why, howToAchieve' });
            }

            const db = getDb();
            const collection = db.collection('users');

            const newGoal = {
                id: `goal_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
                title,
                category: category || 'mental',
                targetDays: targetDays || 30,
                description: description || '',
                why,
                howToAchieve,
                progress: 0,
                checkIns: [],
                completed: false,
                createdAt: new Date(),
                updatedAt: new Date(),
                source: source || 'manual',
                dassScores: dassScores || null,
                dassHistory: dassScores ? [{ scores: dassScores, date: new Date() }] : []
            };

            const result = await collection.updateOne(
                { firebaseUid: userId },
                {
                    $push: { goals: newGoal },
                    $set: { lastUpdated: new Date() }
                }
            );

            if (result.modifiedCount === 0) {
                return res.status(404).json({ error: 'User not found' });
            }

            res.json({
                success: true,
                goal: newGoal
            });

        } catch (error) {
            console.error('Create Goal Error:', error);
            res.status(500).json({ error: 'Failed to create goal' });
        }
    },

    // GET /api/goals
    getGoals: async (req, res) => {
        try {
            const authHeader = req.headers.authorization;
            let userId;

            if (authHeader && authHeader.startsWith('Bearer ')) {
                const token = authHeader.split(' ')[1];
                const decoded = verifyToken(token);
                if (!decoded) return res.status(401).json({ error: 'Invalid token' });
                userId = decoded.firebaseUid || decoded.userId;
            } else {
                userId = req.query.userId;
            }

            if (!userId) {
                return res.status(400).json({ error: 'User ID is required' });
            }

            const db = getDb();
            const collection = db.collection('users');

            const userData = await collection.findOne({ firebaseUid: userId });

            if (!userData) {
                return res.status(404).json({ error: 'User not found' });
            }

            const goals = userData.goals || [];

            const goalsWithProgress = goals.map(goal => {
                const checkIns = goal.checkIns || [];
                const targetDays = goal.targetDays || 30;
                const calculatedProgress = Math.min(Math.round((checkIns.length / targetDays) * 100), 100);
                const completed = goal.completed !== undefined ? goal.completed : (calculatedProgress >= 100);
                const progress = goal.progress !== undefined ? goal.progress : calculatedProgress;

                let streak = 0;
                if (checkIns.length > 0) {
                    const sortedCheckIns = [...checkIns].sort((a, b) => new Date(b) - new Date(a));
                    const today = new Date().toISOString().split('T')[0];
                    const yesterday = new Date();
                    yesterday.setDate(yesterday.getDate() - 1);
                    const yesterdayStr = yesterday.toISOString().split('T')[0];

                    if (sortedCheckIns[0] === today || sortedCheckIns[0] === yesterdayStr) {
                        streak = 1;
                        for (let i = 1; i < sortedCheckIns.length; i++) {
                            const currentDate = new Date(sortedCheckIns[i - 1]);
                            const previousDate = new Date(sortedCheckIns[i]);
                            const diffTime = currentDate - previousDate;
                            const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

                            if (diffDays === 1) streak++;
                            else break;
                        }
                    }
                }

                return {
                    ...goal,
                    progress,
                    completed,
                    streak,
                    totalCheckIns: checkIns.length
                };
            });

            res.json({
                success: true,
                userId: userId,
                totalGoals: goalsWithProgress.length,
                goals: goalsWithProgress
            });

        } catch (error) {
            console.error('Goals API Error:', error);
            res.status(500).json({ error: 'Failed to fetch goals' });
        }
    }
};

module.exports = goalsController;
