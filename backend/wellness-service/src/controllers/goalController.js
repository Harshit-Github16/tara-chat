const Wellness = require('../models/Wellness');

exports.getGoals = async (req, res) => {
    try {
        const userId = req.user.firebaseUid || req.user.userId || req.user.id;
        const wellness = await Wellness.findOne({ userId });

        if (!wellness || !wellness.goals) {
            return res.json({ success: true, userId, totalGoals: 0, goals: [] });
        }

        // Add calculated fields like streak and progress if needed (similar to frontend route)
        const goalsWithProgress = wellness.goals.map(goal => {
            const checkIns = goal.checkIns || [];
            const targetDays = goal.targetDays || 30;
            const progress = goal.progress !== undefined ? goal.progress : Math.min(Math.round((checkIns.length / targetDays) * 100), 100);
            return { ...goal.toObject(), progress, totalCheckIns: checkIns.length };
        });

        res.json({ success: true, userId, totalGoals: goalsWithProgress.length, goals: goalsWithProgress });
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch goals' });
    }
};

exports.createGoal = async (req, res) => {
    try {
        const userId = req.user.firebaseUid || req.user.userId || req.user.id;
        const { title, category, targetDays, description, why, howToAchieve, source, dassScores } = req.body;

        if (!title) return res.status(400).json({ error: 'Title is required' });

        let wellness = await Wellness.findOne({ userId });
        if (!wellness) wellness = new Wellness({ userId });

        const newGoal = {
            id: `goal_\${Date.now()}_\${Math.random().toString(36).substr(2, 9)}`,
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
            dassScores: dassScores || null
        };

        wellness.goals.push(newGoal);
        await wellness.save();

        res.json({ success: true, goal: newGoal });
    } catch (error) {
        res.status(500).json({ error: 'Failed to create goal' });
    }
};

exports.updateGoalStatus = async (req, res) => {
    try {
        const userId = req.user.firebaseUid || req.user.userId || req.user.id;
        const { goalId, isComplete, isDelete } = req.body;

        const wellness = await Wellness.findOne({ userId });
        if (!wellness) return res.status(404).json({ error: 'Wellness data not found' });

        if (isDelete) {
            wellness.goals = wellness.goals.filter(g => g.id !== goalId);
        } else if (isComplete !== undefined) {
            const goal = wellness.goals.find(g => g.id === goalId);
            if (goal) {
                goal.completed = isComplete;
                if (isComplete) goal.progress = 100;
                goal.updatedAt = new Date();
            }
        }

        await wellness.save();
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: 'Failed to update goal status' });
    }
};

exports.checkInGoal = async (req, res) => {
    try {
        const userId = req.user.firebaseUid || req.user.userId || req.user.id;
        const { goalId } = req.params;

        const wellness = await Wellness.findOne({ userId });
        if (!wellness) return res.status(404).json({ error: 'Wellness data not found' });

        const goal = wellness.goals.find(g => g.id === goalId);
        if (!goal) return res.status(404).json({ error: 'Goal not found' });

        const today = new Date().toISOString().split('T')[0];
        if (!goal.checkIns.includes(today)) {
            goal.checkIns.push(today);
            goal.progress = Math.min(Math.round((goal.checkIns.length / goal.targetDays) * 100), 100);
            if (goal.progress >= 100) goal.completed = true;
            goal.updatedAt = new Date();
            await wellness.save();
        }

        res.json({ success: true, goal });
    } catch (error) {
        res.status(500).json({ error: 'Failed to check in goal' });
    }
};
