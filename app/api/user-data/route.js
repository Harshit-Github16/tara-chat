import { NextResponse } from 'next/server';
import clientPromise from '../../../lib/mongodb';

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
