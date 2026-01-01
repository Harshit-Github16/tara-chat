const User = require('../models/User');

exports.completeOnboarding = async (req, res) => {
    try {
        const userId = req.user.userId || req.user.id;
        const body = req.body;

        const updateData = {
            ...body,
            isOnboardingComplete: true,
            updatedAt: new Date()
        };

        // Remove sensitive fields if any were passed
        delete updateData.password;
        delete updateData._id;

        await User.updateById(userId, updateData);
        const updatedUser = await User.findById(userId);

        if (!updatedUser) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.json({
            success: true,
            message: 'Onboarding completed successfully',
            user: {
                id: updatedUser._id.toString(),
                email: updatedUser.email,
                name: updatedUser.name,
                nickname: updatedUser.nickname,
                isOnboardingComplete: updatedUser.isOnboardingComplete,
                gender: updatedUser.gender,
                ageRange: updatedUser.ageRange,
                profession: updatedUser.profession,
                interests: updatedUser.interests,
                personalityTraits: updatedUser.personalityTraits,
                lifeAreas: updatedUser.lifeAreas,
                currentMood: updatedUser.currentMood,
                personalityAnswers: updatedUser.personalityAnswers,
                supportPreference: updatedUser.supportPreference,
                archetype: updatedUser.archetype,
                updatedAt: updatedUser.updatedAt
            }
        });
    } catch (error) {
        console.error('Onboarding update error:', error);
        res.status(500).json({ error: 'Failed to update onboarding data' });
    }
};

exports.getOnboardingData = async (req, res) => {
    try {
        const userId = req.user.userId || req.user.id;
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.json({
            user: {
                id: user._id.toString(),
                email: user.email,
                name: user.name,
                nickname: user.nickname,
                isOnboardingComplete: user.isOnboardingComplete,
                gender: user.gender,
                ageRange: user.ageRange,
                profession: user.profession,
                interests: user.interests,
                personalityTraits: user.personalityTraits,
                lifeAreas: user.lifeAreas,
                currentMood: user.currentMood,
                personalityAnswers: user.personalityAnswers,
                supportPreference: user.supportPreference,
                archetype: user.archetype,
                updatedAt: user.updatedAt
            },
            // For emotional onboarding status specifically
            onboardingCompleted: user.isOnboardingComplete || false,
            archetype: user.archetype || null,
            lifeAreas: user.lifeAreas || [],
            supportPreference: user.supportPreference || null
        });
    } catch (error) {
        console.error('Get onboarding data error:', error);
        res.status(500).json({ error: 'Failed to get onboarding data' });
    }
};
