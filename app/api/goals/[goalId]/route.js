import { NextResponse } from 'next/server';
import clientPromise from '../../../../lib/mongodb';
import { verifyToken } from '../../../../lib/jwt';

// DELETE - Delete a specific goal by ID
export async function DELETE(request, { params }) {
    try {
        const resolvedParams = await params;
        const { goalId } = resolvedParams;

        // Get authorization header
        const authHeader = request.headers.get('authorization');
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return NextResponse.json({ error: 'No token provided' }, { status: 401 });
        }

        const token = authHeader.split(' ')[1];
        const decoded = verifyToken(token);

        if (!decoded) {
            return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
        }

        const userId = decoded.firebaseUid || decoded.userId;

        const client = await clientPromise;
        const db = client.db('tara');
        const users = db.collection('users');

        // Remove goal from user's goals array
        const result = await users.updateOne(
            { firebaseUid: userId },
            {
                $pull: { goals: { id: goalId } },
                $set: { lastUpdated: new Date() }
            }
        );

        if (result.modifiedCount === 0) {
            return NextResponse.json({
                error: 'Goal not found'
            }, { status: 404 });
        }

        return NextResponse.json({
            success: true,
            message: 'Goal deleted successfully'
        });

    } catch (error) {
        console.error('Delete Goal Error:', error);
        return NextResponse.json(
            { error: 'Failed to delete goal', details: error.message },
            { status: 500 }
        );
    }
}

// PATCH - Update a specific goal (for check-ins)
export async function PATCH(request, { params }) {
    try {
        const resolvedParams = await params;
        const { goalId } = resolvedParams;

        // Get authorization header
        const authHeader = request.headers.get('authorization');
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return NextResponse.json({ error: 'No token provided' }, { status: 401 });
        }

        const token = authHeader.split(' ')[1];
        const decoded = verifyToken(token);

        if (!decoded) {
            return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
        }

        const userId = decoded.firebaseUid || decoded.userId;

        const client = await clientPromise;
        const db = client.db('tara');
        const users = db.collection('users');

        // Get user to find the goal
        const user = await users.findOne({ firebaseUid: userId });
        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        const goalIndex = user.goals?.findIndex(g => g.id === goalId);
        if (goalIndex === -1 || goalIndex === undefined) {
            return NextResponse.json({ error: 'Goal not found' }, { status: 404 });
        }

        const goal = user.goals[goalIndex];

        // Add check-in
        const today = new Date().toISOString().split('T')[0];
        const checkIns = goal.checkIns || [];

        // Check if already checked in today
        if (checkIns.includes(today)) {
            return NextResponse.json({
                error: 'Already checked in today'
            }, { status: 400 });
        }

        checkIns.push(today);

        // Calculate progress percentage
        const targetDays = goal.targetDays || 30;
        const progress = Math.min(Math.round((checkIns.length / targetDays) * 100), 100);
        const completed = progress >= 100;

        // Update goal in database
        const result = await users.updateOne(
            { firebaseUid: userId, 'goals.id': goalId },
            {
                $set: {
                    'goals.$.checkIns': checkIns,
                    'goals.$.progress': progress,
                    'goals.$.completed': completed,
                    'goals.$.updatedAt': new Date(),
                    lastUpdated: new Date()
                }
            }
        );

        if (result.modifiedCount === 0) {
            return NextResponse.json({
                error: 'Failed to update goal'
            }, { status: 500 });
        }

        return NextResponse.json({
            success: true,
            goal: {
                ...goal,
                checkIns,
                progress,
                completed
            }
        });

    } catch (error) {
        console.error('Update Goal Error:', error);
        return NextResponse.json(
            { error: 'Failed to update goal', details: error.message },
            { status: 500 }
        );
    }
}
