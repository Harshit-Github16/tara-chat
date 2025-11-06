import { NextResponse } from "next/server";
import { db } from "../../../../lib/firebase";
import { collection, query, where, orderBy, limit, getDocs } from "firebase/firestore";
import { verifyToken } from "../../../../lib/jwt";

// GET - Retrieve mood history for a user
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

        // Use Firebase UID instead of MongoDB ObjectId for Firestore
        const userId = decoded.firebaseUid || decoded.userId;
        const { searchParams } = new URL(req.url);
        const days = parseInt(searchParams.get('days')) || 30; // Default last 30 days
        const limitCount = parseInt(searchParams.get('limit')) || 100; // Default limit

        // Query moods collection for user's entries
        const moodsRef = collection(db, 'moods');
        const q = query(
            moodsRef,
            where('userId', '==', userId),
            orderBy('date', 'desc'),
            limit(limitCount)
        );

        const querySnapshot = await getDocs(q);
        const moodHistory = [];

        querySnapshot.forEach((doc) => {
            const data = doc.data();
            // Filter by days if specified
            const entryDate = new Date(data.date);
            const daysAgo = new Date();
            daysAgo.setDate(daysAgo.getDate() - days);

            if (entryDate >= daysAgo) {
                moodHistory.push({
                    id: doc.id,
                    ...data
                });
            }
        });

        return NextResponse.json({
            success: true,
            data: moodHistory,
            count: moodHistory.length
        });

    } catch (error) {
        console.error('Error fetching mood history:', error);
        return NextResponse.json({ error: 'Failed to fetch mood history' }, { status: 500 });
    }
}