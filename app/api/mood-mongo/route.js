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

        console.log('Mood MongoDB API: User ID from token:', decoded.userId);

        const { mood, intensity, note } = await req.json();
        console.log('Mood MongoDB API: Request body:', { mood, intensity, note });

        if (!mood) {
            console.log('Mood MongoDB API: No mood provided');
            return NextResponse.json({ error: 'Mood is required' }, { status: 400 });
        }

        const userId = decoded.userId;

        // Get current date in YYYY-MM-DD format
        const today = new Date().toISOString().split('T')[0];
        console.log('Mood MongoDB API: Today date:', today);

        // Create mood entry
        const moodEntry = {
            mood,
            intensity: intensity || 5,
            note: note || '',
            timestamp: new Date(),
            createdAt: new Date()
        };
        console.log('Mood MongoDB API: Mood entry created:', moodEntry);

        // Connect to MongoDB
        const client = await clientPromise;
        const db = client.db('tara');
        const moods = db.collection('moods');

        // Document ID format: userId_date
        const docId = `${userId}_${today}`;
        console.log('Mood MongoDB API: Document ID:', docId);

        // Check if document exists for today
        console.log('Mood MongoDB API: Checking if document exists...');
        const existingDoc = await moods.findOne({ _id: docId });
        console.log('Mood MongoDB API: Document exists:', !!existingDoc);

        if (existingDoc) {
            // Add to existing array
            console.log('Mood MongoDB API: Updating existing document...');
            await moods.updateOne(
                { _id: docId },
                {
                    $push: { entries: moodEntry },
                    $set: { updatedAt: new Date() }
                }
            );
            console.log('Mood MongoDB API: Document updated successfully');
        } else {
            // Create new document for today
            console.log('Mood MongoDB API: Creating new document...');
            await moods.insertOne({
                _id: docId,
                userId: new ObjectId(userId),
                date: today,
                entries: [moodEntry],
                createdAt: new Date(),
                updatedAt: new Date()
            });
            console.log('Mood MongoDB API: New document created successfully');
        }

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

        const userId = decoded.userId;
        const { searchParams } = new URL(req.url);
        const date = searchParams.get('date'); // Optional: get specific date

        // Connect to MongoDB
        const client = await clientPromise;
        const db = client.db('tara');
        const moods = db.collection('moods');

        if (date) {
            // Get moods for specific date
            const docId = `${userId}_${date}`;
            const moodDoc = await moods.findOne({ _id: docId });

            return NextResponse.json({
                success: true,
                data: moodDoc || { entries: [] }
            });
        } else {
            // Get today's moods by default
            const today = new Date().toISOString().split('T')[0];
            const docId = `${userId}_${today}`;
            const moodDoc = await moods.findOne({ _id: docId });

            return NextResponse.json({
                success: true,
                data: moodDoc || { entries: [] }
            });
        }

    } catch (error) {
        console.error('Mood MongoDB API: Error fetching moods:', error);
        return NextResponse.json({ error: 'Failed to fetch moods' }, { status: 500 });
    }
}