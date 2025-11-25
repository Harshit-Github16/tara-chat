import { NextResponse } from 'next/server';
import clientPromise from '../../../../lib/mongodb';
import { verifyToken } from '../../../../lib/jwt';

/**
 * POST - Update goal status (complete or delete)
 * 
 * Payload:
 * {
 *   goalId: string,
 *   isComplete: boolean,  // true to mark as complete
 *   isDelete: boolean     // true to delete
 * }
 * 
 * Note: Only one should be true at a time
 */
export async function POST(request) {
    try {
        const body = await request.json();
        const { goalId, isComplete = false, isDelete = false } = body;

        // Validate payload
        if (!goalId) {
            return NextResponse.json({
                error: 'goalId is required'
            }, { status: 400 });
        }

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

        // Handle DELETE
        if (isDelete) {
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
                action: 'deleted',
                message: 'Goal deleted successfully'
            });
        }

        // Handle COMPLETE
        if (isComplete) {
            console.log('Goal Status API - Marking goal as complete:', { userId, goalId });

            // Get user to find the goal
            const user = await users.findOne({ firebaseUid: userId });
            if (!user) {
                console.error('Goal Status API - User not found:', userId);
                return NextResponse.json({ error: 'User not found' }, { status: 404 });
            }

            const goalIndex = user.goals?.findIndex(g => g.id === goalId);
            if (goalIndex === -1 || goalIndex === undefined) {
                console.error('Goal Status API - Goal not found:', { goalId, availableGoals: user.goals?.map(g => g.id) });
                return NextResponse.json({ error: 'Goal not found' }, { status: 404 });
            }

            console.log('Goal Status API - Found goal at index:', goalIndex);

            // Update goal to completed
            const result = await users.updateOne(
                { firebaseUid: userId, 'goals.id': goalId },
                {
                    $set: {
                        'goals.$.completed': true,
                        'goals.$.progress': 100,
                        'goals.$.completedAt': new Date(),
                        'goals.$.updatedAt': new Date(),
                        lastUpdated: new Date()
                    }
                }
            );

            console.log('Goal Status API - Update result:', {
                matchedCount: result.matchedCount,
                modifiedCount: result.modifiedCount
            });

            if (result.modifiedCount === 0) {
                console.error('Goal Status API - Failed to update goal in database');
                return NextResponse.json({
                    error: 'Failed to update goal'
                }, { status: 500 });
            }

            console.log('Goal Status API - Goal marked as complete successfully');
            return NextResponse.json({
                success: true,
                action: 'completed',
                message: 'Goal marked as complete'
            });
        }

        // If neither isComplete nor isDelete is true
        return NextResponse.json({
            error: 'Either isComplete or isDelete must be true'
        }, { status: 400 });

    } catch (error) {
        console.error('Goal Status Update Error:', error);
        return NextResponse.json(
            { error: 'Failed to update goal status', details: error.message },
            { status: 500 }
        );
    }
}
