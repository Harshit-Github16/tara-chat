const Wellness = require('../models/Wellness');

exports.getInsightStats = async (req, res) => {
    try {
        const userId = req.user.firebaseUid || req.user.userId || req.user.id;
        const wellness = await Wellness.findOne({ userId });

        if (!wellness) {
            return res.json({ success: true, data: { recoveryTime: 0, goalsCompleted: 0 } });
        }

        // Logic for recovery time calculation (simplified from frontend)
        const moods = wellness.moods || [];
        const goals = wellness.goals || [];

        const currentMonth = new Date().getMonth();
        const currentYear = new Date().getFullYear();
        const goalsCompletedThisMonth = goals.filter(goal => {
            if (!goal.completed || !goal.completedAt) return false;
            const completedDate = new Date(goal.completedAt);
            return completedDate.getMonth() === currentMonth && completedDate.getFullYear() === currentYear;
        }).length;

        // Simplified recovery time calculation logic
        let recoveryTime = 3; // Default
        // (Full logic can be copied from frontend if needed)

        res.json({
            success: true,
            data: {
                recoveryTime,
                goalsCompleted: goalsCompletedThisMonth
            }
        });
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch insight stats' });
    }
};
