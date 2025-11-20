import { NextResponse } from "next/server";
import clientPromise from "../../../../lib/mongodb";
import { verifyToken } from "../../../../lib/jwt";

// GET - Get mood insights with all calculations done on backend
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

        // Get user with moods
        const user = await users.findOne(
            { firebaseUid: userId },
            { projection: { moods: 1 } }
        );

        if (!user || !user.moods || user.moods.length === 0) {
            return NextResponse.json({
                success: true,
                data: {
                    moodByDate: {},
                    weeklyAverage: 0,
                    streakCount: 0,
                    totalEntries: 0
                }
            });
        }

        const allMoods = user.moods;

        // Mood intensity mapping
        const moodIntensityMap = {
            'calm': 3,
            'happy': 3,
            'grateful': 3,
            'motivated': 3,
            'healing': 1,
            'lost': -1,
            'lonely': -2,
            'sad': -2,
            'stressed': -2,
            'anxious': -3,
            'overwhelmed': -3,
            'angry': -3
        };

        // 1. Calculate mood by date (format: {'18-11-2025': -3, '19-11-2025': -2})
        const moodByDate = {};
        const dateSet = new Set();

        allMoods.forEach(entry => {
            if (entry.date) {
                // Convert YYYY-MM-DD to DD-MM-YYYY
                const [year, month, day] = entry.date.split('-');
                const formattedDate = `${day}-${month}-${year}`;

                const moodValue = moodIntensityMap[entry.mood.toLowerCase()] || 0;

                // If multiple moods on same day, take average
                if (moodByDate[formattedDate]) {
                    const existing = moodByDate[formattedDate];
                    moodByDate[formattedDate] = Math.round((existing + moodValue) / 2);
                } else {
                    moodByDate[formattedDate] = moodValue;
                }

                dateSet.add(entry.date); // Keep original format for streak calculation
            }
        });

        // 2. Calculate weekly average mood (last 7 days)
        const today = new Date();
        const sevenDaysAgo = new Date(today);
        sevenDaysAgo.setDate(today.getDate() - 7);

        const weeklyMoods = allMoods.filter(entry => {
            if (!entry.date) return false;
            const entryDate = new Date(entry.date);
            return entryDate >= sevenDaysAgo && entryDate <= today;
        });

        let weeklyAverage = 0;
        if (weeklyMoods.length > 0) {
            const weeklySum = weeklyMoods.reduce((sum, entry) => {
                return sum + (moodIntensityMap[entry.mood.toLowerCase()] || 0);
            }, 0);
            weeklyAverage = parseFloat((weeklySum / weeklyMoods.length).toFixed(1));
        }

        // 3. Calculate streak count (consecutive days with mood entries)
        const sortedDates = Array.from(dateSet).sort((a, b) => new Date(b) - new Date(a));

        let streakCount = 0;
        if (sortedDates.length > 0) {
            const todayStr = today.toISOString().split('T')[0];
            const yesterdayStr = new Date(today.setDate(today.getDate() - 1)).toISOString().split('T')[0];

            // Check if user logged today or yesterday to start streak
            if (sortedDates[0] === todayStr || sortedDates[0] === yesterdayStr) {
                streakCount = 1;

                // Count consecutive days
                for (let i = 1; i < sortedDates.length; i++) {
                    const currentDate = new Date(sortedDates[i - 1]);
                    const previousDate = new Date(sortedDates[i]);

                    const diffTime = currentDate - previousDate;
                    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

                    if (diffDays === 1) {
                        streakCount++;
                    } else {
                        break;
                    }
                }
            }
        }

        return NextResponse.json({
            success: true,
            data: {
                moodByDate,
                weeklyAverage,
                streakCount,
                totalEntries: allMoods.length,
                // Include raw entries for charts that need them
                entries: allMoods.slice(0, 30) // Last 30 entries
            }
        });

    } catch (error) {
        console.error('Mood Insights API: Error:', error);
        return NextResponse.json({ error: 'Failed to fetch mood insights' }, { status: 500 });
    }
}
