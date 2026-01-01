const Wellness = require('../models/Wellness');
const { ObjectId } = require('mongodb');

exports.saveMood = async (req, res) => {
    try {
        const userId = req.user.firebaseUid || req.user.userId || req.user.id;
        const { mood, intensity, note } = req.body;

        if (!mood) return res.status(400).json({ error: 'Mood is required' });

        let wellness = await Wellness.findOne({ userId });
        if (!wellness) wellness = new Wellness({ userId });

        const moodEntry = {
            id: new ObjectId().toString(),
            mood: mood.toLowerCase(),
            intensity: intensity || 5,
            note: note || '',
            date: new Date().toISOString().split('T')[0],
            timestamp: new Date(),
            createdAt: new Date()
        };

        wellness.moods.unshift(moodEntry);
        await wellness.save();

        res.json({ success: true, message: 'Mood saved successfully', entry: moodEntry });
    } catch (error) {
        console.error('Save mood error:', error);
        res.status(500).json({ error: 'Failed to save mood' });
    }
};

exports.getMoods = async (req, res) => {
    try {
        const userId = req.user.firebaseUid || req.user.userId || req.user.id;
        const { date, limit = 30 } = req.query;

        const wellness = await Wellness.findOne({ userId });
        if (!wellness) return res.json({ success: true, data: { entries: [] } });

        let moods = wellness.moods || [];
        if (date) moods = moods.filter(m => m.date === date);
        else moods = moods.slice(0, parseInt(limit));

        res.json({ success: true, data: { entries: moods } });
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch moods' });
    }
};

exports.getMoodInsights = async (req, res) => {
    try {
        const userId = req.user.firebaseUid || req.user.userId || req.user.id;
        const wellness = await Wellness.findOne({ userId });

        if (!wellness || !wellness.moods || wellness.moods.length === 0) {
            return res.json({ success: true, data: { entries: [], moodByDate: {}, weeklyAverage: 0, streakCount: 0 } });
        }

        const moods = wellness.moods;
        const moodByDate = {};
        let totalScore = 0;
        let recentCount = 0;
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

        // Map mood text to scores (-3 to 3 or 1 to 10)
        const moodToScore = {
            'happy': 3, 'joyful': 3, 'excited': 3, 'great': 3,
            'good': 1.5, 'relaxed': 1, 'peaceful': 1, 'content': 1,
            'neutral': 0, 'okay': 0, 'fine': 0,
            'sad': -1.5, 'low': -1, 'unhappy': -2,
            'angry': -2, 'stressed': -2, 'anxious': -2, 'worried': -1.5,
            'depressed': -3, 'miserable': -3
        };

        moods.forEach(entry => {
            const date = entry.date; // YYYY-MM-DD
            if (!moodByDate[date]) moodByDate[date] = [];
            moodByDate[date].push(entry);

            const entryDate = new Date(entry.timestamp || entry.createdAt);
            if (entryDate >= sevenDaysAgo) {
                const score = moodToScore[entry.mood.toLowerCase()] || 0;
                totalScore += score;
                recentCount++;
            }
        });

        const weeklyAverage = recentCount > 0 ? totalScore / recentCount : 0;

        // Calculate streak
        let streakCount = 0;
        let checkDate = new Date();
        checkDate.setHours(0, 0, 0, 0);

        while (true) {
            const dateStr = checkDate.toISOString().split('T')[0];
            if (moodByDate[dateStr]) {
                streakCount++;
                checkDate.setDate(checkDate.getDate() - 1);
            } else {
                // If checking today and no entry, it's okay, check yesterday
                const todayStr = new Date().toISOString().split('T')[0];
                if (dateStr === todayStr && streakCount === 0) {
                    checkDate.setDate(checkDate.getDate() - 1);
                    continue;
                }
                break;
            }
        }

        res.json({
            success: true,
            data: {
                entries: moods.slice(0, 50),
                moodByDate,
                weeklyAverage,
                streakCount
            }
        });

    } catch (error) {
        console.error('Mood Insights Error:', error);
        res.status(500).json({ error: 'Failed to fetch mood insights' });
    }
};
