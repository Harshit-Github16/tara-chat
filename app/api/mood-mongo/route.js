import { NextResponse } from "next/server";
import clientPromise from "../../../lib/mongodb";
import { verifyToken } from "../../../lib/jwt";
import { ObjectId } from "mongodb";

// POST - Add new mood entry using MongoDB
export async function POST(req) {
    try {
        console.log('Mood MongoDB API: Starting POST request');

        // Get authorization header
        const authHeader = req.headers.get('authorization');
        console.log('Mood MongoDB API: Auth header:', authHeader ? 'Present' : 'Missing');

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            console.log('Mood MongoDB API: No valid authorization header');
            return NextResponse.json({ error: 'No token provided' }, { status: 401 });
        }

        const token = authHeader.split(' ')[1];
        console.log('Mood MongoDB API: Token extracted, length:', token.length);

        const decoded = verifyToken(token);
        console.log('Mood MongoDB API: Token decoded:', decoded ? 'Success' : 'Failed');

        if (!decoded) {
            console.log('Mood MongoDB API: Invalid token');
            return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
        }

        console.log('Mood MongoDB API: Decoded token:', JSON.stringify(decoded, null, 2));
        console.log('Mood MongoDB API: Token has firebaseUid:', !!decoded.firebaseUid);
        console.log('Mood MongoDB API: Token has userId:', !!decoded.userId);

        const { mood, intensity, note } = await req.json();
        console.log('Mood MongoDB API: Request body:', { mood, intensity, note });

        if (!mood) {
            console.log('Mood MongoDB API: No mood provided');
            return NextResponse.json({ error: 'Mood is required' }, { status: 400 });
        }

        // Use firebaseUid if available, otherwise userId
        const userId = decoded.firebaseUid || decoded.userId;
        console.log('Mood MongoDB API: Using userId:', userId);

        // Get current date in YYYY-MM-DD format
        const today = new Date().toISOString().split('T')[0];
        console.log('Mood MongoDB API: Today date:', today);

        // Create mood entry
        const moodEntry = {
            id: new ObjectId().toString(),
            mood,
            intensity: intensity || 5,
            note: note || '',
            date: today,
            timestamp: new Date(),
            createdAt: new Date()
        };
        console.log('Mood MongoDB API: Mood entry created:', moodEntry);

        // Connect to MongoDB
        const client = await clientPromise;
        const db = client.db('tara');
        const users = db.collection('users');

        // Store mood in user object
        console.log('Mood MongoDB API: Storing mood in user object for userId:', userId);

        // Try to find user first to debug
        const existingUser = await users.findOne({ firebaseUid: userId });
        console.log('Mood MongoDB API: User found:', existingUser ? 'Yes' : 'No');

        if (!existingUser) {
            // Try with _id if userId is ObjectId format
            const userById = await users.findOne({ _id: new ObjectId(userId) });
            console.log('Mood MongoDB API: User found by _id:', userById ? 'Yes' : 'No');

            if (!userById) {
                console.log('Mood MongoDB API: User not found with firebaseUid or _id');
                return NextResponse.json({
                    error: 'User not found',
                    debug: { userId, searchedBy: 'firebaseUid and _id' }
                }, { status: 404 });
            }
        }

        // Update user document - add mood to moods array
        const result = await users.updateOne(
            { firebaseUid: userId },
            {
                $push: {
                    moods: {
                        $each: [moodEntry],
                        $position: 0 // Add to beginning of array
                    }
                },
                $set: { lastUpdated: new Date() }
            }
        );

        console.log('Mood MongoDB API: Update result - matched:', result.matchedCount, 'modified:', result.modifiedCount);

        return NextResponse.json({
            success: true,
            message: 'Mood saved successfully',
            entry: moodEntry
        });

    } catch (error) {
        console.error('Mood MongoDB API: Error saving mood:', error);
        return NextResponse.json({ error: 'Failed to save mood' }, { status: 500 });
    }
}

// GET - Retrieve mood entries using MongoDB
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
        const date = searchParams.get('date'); // Optional: get specific date
        const limit = parseInt(searchParams.get('limit')) || 30; // Default 30 days

        // Connect to MongoDB
        const client = await clientPromise;
        const db = client.db('tara');
        const users = db.collection('users');

        // Get user with moods
        const user = await users.findOne(
            { firebaseUid: userId },
            { projection: { moods: 1 } }
        );

        if (!user) {
            return NextResponse.json({
                success: true,
                data: { entries: [] }
            });
        }

        const allMoods = user.moods || [];

        if (date) {
            // Get moods for specific date
            const dateMoods = allMoods.filter(m => m.date === date);
            return NextResponse.json({
                success: true,
                data: { entries: dateMoods }
            });
        } else {
            // Get recent moods (limited)
            const recentMoods = allMoods.slice(0, limit);
            return NextResponse.json({
                success: true,
                data: { entries: recentMoods }
            });
        }

    } catch (error) {
        console.error('Mood MongoDB API: Error fetching moods:', error);
        return NextResponse.json({ error: 'Failed to fetch moods' }, { status: 500 });
    }
}