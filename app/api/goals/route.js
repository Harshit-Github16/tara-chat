import { NextResponse } from 'next/server';
import clientPromise from '../../../lib/mongodb';

export async function POST(request) {
    try {
        const { userId, title, category, targetDays, description, why, howToAchieve } = await request.json();

        if (!userId || !title || !why || !howToAchieve) {
            return NextResponse.json({
                error: 'Missing required fields'
            }, { status: 400 });
        }

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
            updatedAt: new Date()
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
        console.error('Goals API Error:', error);
        return NextResponse.json(
            { error: 'Failed to create goal', details: error.message },
            { status: 500 }
        );
    }
}

export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url);
        const userId = searchParams.get('userId');

        if (!userId) {
            return NextResponse.json({
                error: 'User ID is required'
            }, { status: 400 });
        }

        const client = await clientPromise;
        const db = client.db('tara');
        const collection = db.collection('users');

        const userData = await collection.findOne({ firebaseUid: userId });

        if (!userData) {
            return NextResponse.json({
                error: 'User not found'
            }, { status: 404 });
        }

        return NextResponse.json({
            success: true,
            goals: userData.goals || []
        });

    } catch (error) {
        console.error('Goals API Error:', error);
        return NextResponse.json(
            { error: 'Failed to fetch goals', details: error.message },
            { status: 500 }
        );
    }
}

export async function POST(request) {
    try {
        const { userId, goals } = await request.json();

        if (!userId || !goals) {
            return NextResponse.json({
                error: 'User ID and goals are required'
            }, { status: 400 });
        }

        const client = await clientPromise;
        const db = client.db('tara');
        const collection = db.collection('users');

        // Update all goals
        const result = await collection.updateOne(
            { firebaseUid: userId },
            {
                $set: {
                    goals: goals,
                    lastUpdated: new Date()
                }
            }
        );

        if (result.modifiedCount === 0) {
            return NextResponse.json({
                error: 'User not found or no changes made'
            }, { status: 404 });
        }

        return NextResponse.json({
            success: true,
            goals: goals
        });

    } catch (error) {
        console.error('Goals API Error:', error);
        return NextResponse.json(
            { error: 'Failed to update goals', details: error.message },
            { status: 500 }
        );
    }
}

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
        const result = await collection.updateOne(
            { firebaseUid: userId },
            {
                $pull: { goals: { id: goalId } },
                $set: { lastUpdated: new Date() }
            }
        );

        if (result.modifiedCount === 0) {
            return NextResponse.json({
                error: 'User or goal not found'
            }, { status: 404 });
        }

        return NextResponse.json({
            success: true
        });

    } catch (error) {
        console.error('Goals API Error:', error);
        return NextResponse.json(
            { error: 'Failed to delete goal', details: error.message },
            { status: 500 }
        );
    }
}
