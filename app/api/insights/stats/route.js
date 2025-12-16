import { NextResponse } from "next/server";
import clientPromise from "../../../../lib/mongodb";
import { verifyToken } from "../../../../lib/jwt";

// GET - Get additional insights stats (Recovery Time & Goals Completed)
export async function GET(req) {
    try {
        // Get authorization header
        const authHeader = req.headers.get('authorization');
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return NextResponse.json({ error: 'No token provided' }, { status: 401 });
        }

        const token = authHeader.split(' ')[1];
        const decoded = verifyToken(token);

        if (!decoded) {
            return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
        }

        const userId = decoded.firebaseUid || decoded.userId;

        // Connect to MongoDB
        const client = await clientPromise;
        const db = client.db('tara');
        const users = db.collection('users');

        // Get user with moods and goals
        const user = await users.findOne(
            { firebaseUid: userId },
            { projection: { moods: 1, goals: 1 } }
        );

        if (!user) {
            return NextResponse.json({
                success: true,
                data: {
                    recoveryTime: 0,
                    goalsCompleted: 0
                }
            });
        }

        // Calculate Goals Completed (this month)
        const goals = user.goals || [];
        const currentMonth = new Date().getMonth();
        const currentYear = new Date().getFullYear();

        const goalsCompletedThisMonth = goals.filter(goal => {
            if (!goal.completed || !goal.completedAt) return false;

            const completedDate = new Date(goal.completedAt);
            return completedDate.getMonth() === currentMonth &&
                completedDate.getFullYear() === currentYear;
        }).length;

        // Calculate Recovery Time (simplified and more meaningful approach)
        const moods = user.moods || [];
        let recoveryTime = 0;

        if (moods.length >= 3) {
            // Simple mood categorization
            const moodCategories = {
                // Negative moods
                'sad': 'negative',
                'lonely': 'negative',
                'stressed': 'negative',
                'anxious': 'negative',
                'overwhelmed': 'negative',
                'angry': 'negative',
                'lost': 'negative',
                // Positive moods
                'happy': 'positive',
                'grateful': 'positive',
                'motivated': 'positive',
                'calm': 'positive',
                'healing': 'neutral'
            };

            // Get last 30 days of mood data
            const thirtyDaysAgo = new Date();
            thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

            const recentMoods = moods
                .filter(mood => mood.date && mood.mood && new Date(mood.date) >= thirtyDaysAgo)
                .sort((a, b) => new Date(a.date) - new Date(b.date));

            if (recentMoods.length >= 3) {
                // Find patterns: negative mood followed by positive mood
                const recoveryInstances = [];

                for (let i = 0; i < recentMoods.length - 1; i++) {
                    const currentMood = recentMoods[i];
                    const currentCategory = moodCategories[currentMood.mood.toLowerCase()];

                    if (currentCategory === 'negative') {
                        // Look for next positive mood within reasonable time
                        for (let j = i + 1; j < recentMoods.length && j <= i + 10; j++) {
                            const futureMood = recentMoods[j];
                            const futureCategory = moodCategories[futureMood.mood.toLowerCase()];

                            if (futureCategory === 'positive') {
                                const startDate = new Date(currentMood.date);
                                const endDate = new Date(futureMood.date);
                                const daysDiff = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24));

                                if (daysDiff >= 1 && daysDiff <= 14) {
                                    recoveryInstances.push(daysDiff);
                                    break; // Found recovery for this negative mood
                                }
                            }
                        }
                    }
                }

                if (recoveryInstances.length > 0) {
                    // Calculate average recovery time
                    recoveryTime = Math.round(
                        recoveryInstances.reduce((sum, days) => sum + days, 0) / recoveryInstances.length
                    );
                } else {
                    // No clear recovery patterns found, estimate based on mood frequency
                    const negativeCount = recentMoods.filter(m =>
                        moodCategories[m.mood.toLowerCase()] === 'negative'
                    ).length;
                    const positiveCount = recentMoods.filter(m =>
                        moodCategories[m.mood.toLowerCase()] === 'positive'
                    ).length;

                    if (negativeCount === 0) {
                        recoveryTime = 1; // Very resilient
                    } else if (positiveCount > negativeCount * 2) {
                        recoveryTime = 2; // Generally positive
                    } else if (positiveCount > negativeCount) {
                        recoveryTime = 3; // Moderately resilient
                    } else if (negativeCount > positiveCount * 2) {
                        recoveryTime = 7; // Needs more support
                    } else {
                        recoveryTime = 4; // Average resilience
                    }
                }
            }
        }

        // Add some context for debugging
        const recentMoodsCount = moods.filter(mood => {
            const thirtyDaysAgo = new Date();
            thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
            return mood.date && new Date(mood.date) >= thirtyDaysAgo;
        }).length;

        const debugInfo = {
            totalMoods: moods.length,
            recentMoods: recentMoodsCount,
            hasEnoughData: recentMoodsCount >= 3,
            recoveryTime,
            goalsCompleted: goalsCompletedThisMonth
        };

        console.log('Recovery Time Calculation:', debugInfo);

        return NextResponse.json({
            success: true,
            data: {
                recoveryTime,
                goalsCompleted: goalsCompletedThisMonth,
                // Include debug info in development
                ...(process.env.NODE_ENV === 'development' && { debug: debugInfo })
            }
        });

    } catch (error) {
        console.error('Insights Stats API: Error:', error);
        return NextResponse.json({ error: 'Failed to fetch insights stats' }, { status: 500 });
    }
}