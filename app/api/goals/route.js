import { NextResponse } from 'next/server';
import clientPromise from '../../../lib/mongodb';

// OPTIONS - Handle CORS preflight
export async function OPTIONS(request) {
    return new NextResponse(null, {
        status: 200,
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        },
    });
}

// POST - Create new goal
export async function POST(request) {
    try {
        let body;
        try {
            body = await request.json();
        } catch (parseError) {
            return NextResponse.json({
                error: 'Invalid JSON in request body'
            }, { status: 400 });
        }

        const { title, category, targetDays, description, why, howToAchieve, source, dassScores } = body;

        // Get authorization header
        const authHeader = request.headers.get('authorization');

        let userId;

        if (authHeader && authHeader.startsWith('Bearer ')) {
            const token = authHeader.split(' ')[1];
            const { verifyToken } = await import('../../../lib/jwt');
            const decoded = verifyToken(token);

            if (!decoded) {
                return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
            }

            userId = decoded.firebaseUid || decoded.userId;
        } else {
            // Fallback to body userId
            userId = body.userId;
        }

        if (!userId) {
            return NextResponse.json({
                error: 'User ID is required'
            }, { status: 400 });
        }

        // Create a new goal
        // For DASS-21 goals, validation is more flexible
        if (!title) {
            return NextResponse.json({
                error: 'Missing required field: title',
                received: { title: !!title }
            }, { status: 400 });
        }

        // For manual goals (not from DASS-21), require why and howToAchieve
        if (source !== 'dass21' && (!why || !howToAchieve)) {
            return NextResponse.json({
                error: 'Missing required fields: why, howToAchieve',
                received: { why: !!why, howToAchieve: !!howToAchieve }
            }, { status: 400 });
        }

        return await createGoal(userId, { title, category, targetDays, description, why, howToAchieve, source, dassScores });

    } catch (error) {
        console.error('Goals API POST Error:', error);
        return NextResponse.json(
            { error: 'Failed to process request', details: error.message },
            { status: 500 }
        );
    }
}

// Helper function to create a new goal
async function createGoal(userId, goalData) {
    try {
        const { title, category, targetDays, description, why, howToAchieve, source, dassScores } = goalData;

        const client = await clientPromise;
        const db = client.db('tara');
        const collection = db.collection('users');

        // Create new goal
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
            // DASS-21 specific fields
            source: source || 'manual', // 'dass21' or 'manual'
            dassScores: dassScores || null, // Initial DASS-21 scores if created from assessment
            dassHistory: dassScores ? [{ scores: dassScores, date: new Date() }] : [] // Track score changes over time
        };

        // Add goal to user's goals array
        const result = await collection.updateOne(
            { firebaseUid: userId },
            {
                $push: { goals: newGoal },
                $set: { lastUpdated: new Date() }
            }
        );

        if (result.modifiedCount === 0) {
            return NextResponse.json({
                error: 'User not found'
            }, { status: 404 });
        }

        return NextResponse.json({
            success: true,
            goal: newGoal
        });

    } catch (error) {
        console.error('Create Goal Error:', error);
        return NextResponse.json(
            { error: 'Failed to create goal', details: error.message },
            { status: 500 }
        );
    }
}



export async function GET(request) {
    try {
        // Get authorization header
        const authHeader = request.headers.get('authorization');

        // Support both token-based and query param based auth (for backward compatibility)
        let userId;

        if (authHeader && authHeader.startsWith('Bearer ')) {
            const token = authHeader.split(' ')[1];
            const { verifyToken } = await import('../../../lib/jwt');
            const decoded = verifyToken(token);

            if (!decoded) {
                return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
            }

            userId = decoded.firebaseUid || decoded.userId;
        } else {
            // Fallback to query param
            const { searchParams } = new URL(request.url);
            userId = searchParams.get('userId');
        }

        if (!userId) {
            return NextResponse.json({
                error: 'User ID is required. Use ?userId=YOUR_USER_ID or provide Authorization header'
            }, { status: 400 });
        }

        const client = await clientPromise;
        const db = client.db('tara');
        const collection = db.collection('users');

        const userData = await collection.findOne({ firebaseUid: userId });

        if (!userData) {
            return NextResponse.json({
                error: 'User not found',
                userId: userId
            }, { status: 404 });
        }

        const goals = userData.goals || [];

        // Calculate progress for each goal
        const goalsWithProgress = goals.map(goal => {
            const checkIns = goal.checkIns || [];
            const targetDays = goal.targetDays || 30;
            const calculatedProgress = Math.min(Math.round((checkIns.length / targetDays) * 100), 100);

            // IMPORTANT: Respect manually set completed status from database
            // If goal.completed is explicitly set (true or false), use it
            // Otherwise, calculate based on progress
            const completed = goal.completed !== undefined ? goal.completed : (calculatedProgress >= 100);

            // Use stored progress if available, otherwise use calculated
            const progress = goal.progress !== undefined ? goal.progress : calculatedProgress;

            // Calculate streak (consecutive days)
            let streak = 0;
            if (checkIns.length > 0) {
                const sortedCheckIns = [...checkIns].sort((a, b) => new Date(b) - new Date(a));
                const today = new Date().toISOString().split('T')[0];
                const yesterday = new Date();
                yesterday.setDate(yesterday.getDate() - 1);
                const yesterdayStr = yesterday.toISOString().split('T')[0];

                // Check if checked in today or yesterday
                if (sortedCheckIns[0] === today || sortedCheckIns[0] === yesterdayStr) {
                    streak = 1;

                    // Count consecutive days
                    for (let i = 1; i < sortedCheckIns.length; i++) {
                        const currentDate = new Date(sortedCheckIns[i - 1]);
                        const previousDate = new Date(sortedCheckIns[i]);

                        const diffTime = currentDate - previousDate;
                        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

                        if (diffDays === 1) {
                            streak++;
                        } else {
                            break;
                        }
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

        return NextResponse.json({
            success: true,
            userId: userId,
            totalGoals: goalsWithProgress.length,
            goals: goalsWithProgress
        });

    } catch (error) {
        console.error('Goals API Error:', error);
        return NextResponse.json(
            { error: 'Failed to fetch goals', details: error.message },
            { status: 500 }
        );
    }
}




