import { NextResponse } from "next/server";
import { verifyToken } from "../../../../lib/jwt";
import clientPromise from "../../../../lib/mongodb";

// GET - Retrieve mood history for a user from MongoDB
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

        // Use firebaseUid if available, otherwise userId
        const userId = decoded.firebaseUid || decoded.userId;
        const { searchParams } = new URL(req.url);
        const days = parseInt(searchParams.get('days')) || 30; // Default last 30 days
        const limitCount = parseInt(searchParams.get('limit')) || 100; // Default limit

        // Connect to MongoDB
        const client = await clientPromise;
        const db = client.db('tara');
        const users = db.collection('users');

        // Get user with moods
        const user = await users.findOne(
            { firebaseUid: userId },
            { projection: { moods: 1 } }
        );

        if (!user || !user.moods) {
            return NextResponse.json({
                success: true,
                data: [],
                count: 0
            });
        }

        // Filter moods by days
        const daysAgo = new Date();
        daysAgo.setDate(daysAgo.getDate() - days);

        const filteredMoods = user.moods
            .filter(mood => {
                const moodDate = new Date(mood.timestamp || mood.createdAt);
                return moodDate >= daysAgo;
            })
            .slice(0, limitCount);

        return NextResponse.json({
            success: true,
            data: filteredMoods,
            count: filteredMoods.length
        });

    } catch (error) {
        console.error('Error fetching mood history:', error);
        return NextResponse.json({ error: 'Failed to fetch mood history' }, { status: 500 });
    }
}