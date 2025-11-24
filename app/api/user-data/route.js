import { NextResponse } from 'next/server';
import clientPromise from '../../../lib/mongodb';
import { verifyToken } from '../../../lib/jwt';

export async function GET(request) {
    try {
        // Get authorization header
        const authHeader = request.headers.get('authorization');

        // Support both token-based and query param based auth
        let userId;

        if (authHeader && authHeader.startsWith('Bearer ')) {
            // Token-based authentication
            const token = authHeader.split(' ')[1];
            const decoded = verifyToken(token);

            if (!decoded) {
                return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
            }

            userId = decoded.firebaseUid || decoded.userId;
        } else {
            // Fallback to query param (for backward compatibility)
            const { searchParams } = new URL(request.url);
            userId = searchParams.get('userId');
        }

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
            data: {
                journals: userData.journals || [],
                goals: userData.goals || [],
                moods: userData.moods || []
            }
        });

    } catch (error) {
        console.error('User Data API Error:', error);
        return NextResponse.json(
            { error: 'Failed to fetch user data', details: error.message },
            { status: 500 }
        );
    }
}
