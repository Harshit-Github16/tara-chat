const Wellness = require('../models/Wellness');

// GET Quiz Results
exports.getQuizResults = async (req, res) => {
    try {
        const userId = req.user.userId || req.user.uid || req.user.id;
        let wellness = await Wellness.findOne({ userId });

        if (!wellness) {
            // Return empty structure instead of error for new users
            return res.json({ quizResults: {}, lifeAreas: [] });
        }

        res.json({
            quizResults: wellness.quizResults || {},
            lifeAreas: wellness.lifeAreas || []
        });
    } catch (error) {
        console.error('Fetch wellness results error:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch wellness data' });
    }
};

// POST Quiz Results
exports.saveQuizResult = async (req, res) => {
    try {
        const userId = req.user.userId || req.user.uid || req.user.id;
        const { lifeArea, answers, score } = req.body;

        if (!lifeArea || !answers || score === undefined) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        let wellness = await Wellness.findOne({ userId });
        if (!wellness) {
            wellness = new Wellness({ userId });
        }

        // Save result
        const result = {
            score,
            answers,
            completedAt: new Date(),
            updatedAt: new Date()
        };

        wellness.quizResults.set(lifeArea, result);

        // Add life area if not exists
        if (!wellness.lifeAreas.includes(lifeArea)) {
            wellness.lifeAreas.push(lifeArea);
        }

        await wellness.save();
        res.json({ message: 'Quiz results saved successfully', quizResults: wellness.quizResults });
    } catch (error) {
        console.error('Save wellness results error:', error);
        res.status(500).json({ success: false, message: 'Failed to save quiz results' });
    }
};

// POST Stress Check
exports.saveStressCheck = async (req, res) => {
    try {
        const userId = req.user.userId || req.user.uid || req.user.id;
        const { score, level, answers } = req.body;

        let wellness = await Wellness.findOne({ userId });
        if (!wellness) {
            wellness = new Wellness({ userId });
        }

        wellness.stressCheckResults.push({
            score,
            level,
            answers,
            completedAt: new Date()
        });

        await wellness.save();
        res.json({ success: true, message: 'Stress check saved successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to save stress check' });
    }
};

// GET Emotional Wheel
exports.getEmotionalWheel = async (req, res) => {
    try {
        const userId = req.user.userId || req.user.uid || req.user.id;
        const wellness = await Wellness.findOne({ userId });

        if (!wellness) {
            return res.json({ lifeAreas: [], emotionalWheelData: null });
        }

        res.json({
            lifeAreas: wellness.lifeAreas || [],
            emotionalWheelData: wellness.emotionalWheelData || null,
            lastEmotionalWheelUpdate: wellness.updatedAt
        });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to get emotional wheel data' });
    }
};

// POST Emotional Wheel
exports.saveEmotionalWheel = async (req, res) => {
    try {
        const userId = req.user.userId || req.user.uid || req.user.id;
        const { emotionalWheelData } = req.body;

        let wellness = await Wellness.findOne({ userId });
        if (!wellness) {
            wellness = new Wellness({ userId });
        }

        wellness.emotionalWheelData = emotionalWheelData;
        await wellness.save();

        res.json({ success: true, message: 'Emotional wheel data saved successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to save emotional wheel data' });
    }
};

// GET Reflection Radar
exports.getReflectionRadar = async (req, res) => {
    try {
        const userId = req.user.firebaseUid || req.user.userId || req.user.id;
        const wellness = await Wellness.findOne({ userId });

        if (!wellness || !wellness.reflectionRadar) {
            return res.json({ success: true, data: null });
        }

        res.json({ success: true, data: wellness.reflectionRadar });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to fetch reflection radar' });
    }
};

// POST Reflection Radar
exports.saveReflectionRadar = async (req, res) => {
    try {
        const userId = req.user.firebaseUid || req.user.userId || req.user.id;
        const { scores, answers, completedAt } = req.body;

        let wellness = await Wellness.findOne({ userId });
        if (!wellness) {
            wellness = new Wellness({ userId });
        }

        wellness.reflectionRadar = {
            scores,
            answers,
            completedAt: new Date(completedAt),
            updatedAt: new Date()
        };

        await wellness.save();
        res.json({ success: true, message: 'Reflection radar saved successfully', data: { scores, completedAt } });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to save reflection radar' });
    }
};

// GET Comprehensive User Data
exports.getUserData = async (req, res) => {
    try {
        const userId = req.user.firebaseUid || req.user.userId || req.user.id;
        const wellness = await Wellness.findOne({ userId });

        if (!wellness) {
            return res.json({ success: true, data: { moods: [], journals: [], goals: [], quizResults: {}, reflectionRadar: null } });
        }

        res.json({ success: true, data: wellness });
    } catch (error) {
        console.error('Fetch user data error:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch user data' });
    }
};
