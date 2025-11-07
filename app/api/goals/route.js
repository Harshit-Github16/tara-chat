import { NextResponse } from 'next/server';
import clientPromise from '../../../lib/mongodb';
import { ObjectId } from 'mongodb';

// GET - Fetch all goals for a user
export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url);
        const userId = searchParams.get('userId');

        if (!userId) {
            return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
        }

        const client = await clientPromise;
        const db = client.db('tara');
        const collection = db.collection('users');

        // Get user's goals
        const userData = await collection.findOne({ firebaseUid: userId });
        const goals = userData?.goals || [];

        return NextResponse.json({
            success: true,
            goals
        });

    } catch (error) {
        console.error('Get Goals Error:', error);
        return NextResponse.json(
            { error: 'Failed to fetch goals' },
            { status: 500 }
        );
    }
}

// POST - Create a new goal
export async function POST(request) {
    try {
        const { userId, title, category, targetDays, description, why, howToAchieve } = await request.json();

        if (!userId || !title) {
            return NextResponse.json({ error: 'User ID and title are required' }, { status: 400 });
        }

        const client = await clientPromise;
        const db = client.db('tara');
        const collection = db.collection('users');

        // Create new goal
        const newGoal = {
            id: new ObjectId().toString(),
            title,
            category: category || 'mental',
            targetDays: targetDays || 30,
            description: description || '',
            why: why || '', // Why this goal is important
            howToAchieve: howToAchieve || '', // How to achieve it
            createdAt: new Date(),
            progress: 0,
            completed: false,
            checkIns: []
        };

        // Add goal to user's goals array
        await collection.updateOne(
            { firebaseUid: userId },
            {
                $push: { goals: newGoal },
                $set: { lastUpdated: new Date() }
            },
            { upsert: true }
        );

        return NextResponse.json({
            success: true,
            goal: newGoal
        });

    } catch (error) {
        console.error('Create Goal Error:', error);
        return NextResponse.json(
            { error: 'Failed to create goal' },
            { status: 500 }
        );
    }
}

// PUT - Update a goal (check-in, complete, etc.)
export async function PUT(request) {
    try {
        const { userId, goalId, action, data } = await request.json();

        if (!userId || !goalId || !action) {
            return NextResponse.json({
                error: 'User ID, Goal ID, and action are required'
            }, { status: 400 });
        }

        const client = await clientPromise;
        const db = client.db('tara');
        const collection = db.collection('users');

        // Get user data
        const userData = await collection.findOne({ firebaseUid: userId });
        if (!userData) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        // Find and update the goal
        const goals = userData.goals || [];
        const goalIndex = goals.findIndex(g => g.id === goalId);

        if (goalIndex === -1) {
            return NextResponse.json({ error: 'Goal not found' }, { status: 404 });
        }

        let updatedGoal = { ...goals[goalIndex] };

        // Handle different actions
        switch (action) {
            case 'checkIn':
                // Add today's check-in
                const today = new Date().toISOString().split('T')[0];
                const checkIns = updatedGoal.checkIns || [];

                // Check if already checked in today
                const alreadyCheckedIn = checkIns.some(date =>
                    new Date(date).toISOString().split('T')[0] === today
                );

                if (!alreadyCheckedIn) {
                    checkIns.push(new Date().toISOString());
                    updatedGoal.checkIns = checkIns;
                    updatedGoal.progress = Math.min(100, (checkIns.length / updatedGoal.targetDays) * 100);
                }
                break;

            case 'toggleComplete':
                updatedGoal.completed = !updatedGoal.completed;
                if (updatedGoal.completed) {
                    updatedGoal.completedAt = new Date();
                }
                break;

            case 'update':
                // Update goal details
                if (data) {
                    updatedGoal = { ...updatedGoal, ...data };
                }
                break;

            default:
                return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
        }

        // Update the goal in the array
        goals[goalIndex] = updatedGoal;

        // Save to database
        await collection.updateOne(
            { firebaseUid: userId },
            {
                $set: {
                    goals: goals,
                    lastUpdated: new Date()
                }
            }
        );

        return NextResponse.json({
            success: true,
            goal: updatedGoal
        });

    } catch (error) {
        console.error('Update Goal Error:', error);
        return NextResponse.json(
            { error: 'Failed to update goal' },
            { status: 500 }
        );
    }
}

// DELETE - Delete a goal
export async function DELETE(request) {
    try {
        const { searchParams } = new URL(request.url);
        const userId = searchParams.get('userId');
        const goalId = searchParams.get('goalId');

        if (!userId || !goalId) {
            return NextResponse.json({
                error: 'User ID and Goal ID are required'
            }, { status: 400 });
        }

        const client = await clientPromise;
        const db = client.db('tara');
        const collection = db.collection('users');

        // Remove goal from user's goals array
        await collection.updateOne(
            { firebaseUid: userId },
            {
                $pull: { goals: { id: goalId } },
                $set: { lastUpdated: new Date() }
            }
        );

        return NextResponse.json({
            success: true,
            message: 'Goal deleted successfully'
        });

    } catch (error) {
        console.error('Delete Goal Error:', error);
        return NextResponse.json(
            { error: 'Failed to delete goal' },
            { status: 500 }
        );
    }
}
