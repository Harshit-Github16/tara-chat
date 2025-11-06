import { NextResponse } from "next/server";
import { db } from "../../../lib/firebase";
import { doc, getDoc, setDoc, updateDoc, arrayUnion, serverTimestamp } from "firebase/firestore";
import { verifyToken } from "../../../lib/jwt";

// POST - Add new mood entry
export async function POST(req) {
  try {
    console.log('Mood API: Starting POST request');

    // Get authorization header
    const authHeader = req.headers.get('authorization');
    console.log('Mood API: Auth header:', authHeader ? 'Present' : 'Missing');

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      console.log('Mood API: No valid authorization header');
      return NextResponse.json({ error: 'No token provided' }, { status: 401 });
    }

    const token = authHeader.split(' ')[1];
    console.log('Mood API: Token extracted, length:', token.length);

    const decoded = verifyToken(token);
    console.log('Mood API: Token decoded:', decoded ? 'Success' : 'Failed');

    if (!decoded) {
      console.log('Mood API: Invalid token');
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    console.log('Mood API: User ID from token:', decoded.userId);
    console.log('Mood API: Firebase UID from token:', decoded.firebaseUid);

    const { mood, intensity, note } = await req.json();
    console.log('Mood API: Request body:', { mood, intensity, note });

    if (!mood) {
      console.log('Mood API: No mood provided');
      return NextResponse.json({ error: 'Mood is required' }, { status: 400 });
    }

    // Use Firebase UID instead of MongoDB ObjectId for Firestore
    const userId = decoded.firebaseUid || decoded.userId;

    // Get current date in YYYY-MM-DD format
    const today = new Date().toISOString().split('T')[0];
    console.log('Mood API: Today date:', today);

    // Create mood entry
    const moodEntry = {
      mood,
      intensity: intensity || 5, // Default intensity 1-10
      note: note || '',
      timestamp: new Date().toISOString(),
      createdAt: serverTimestamp()
    };
    console.log('Mood API: Mood entry created:', moodEntry);

    // Reference to user's mood document for today
    const docId = `${userId}_${today}`;
    console.log('Mood API: Document ID:', docId);
    const moodDocRef = doc(db, 'moods', docId);

    // Check if document exists for today
    console.log('Mood API: Checking if document exists...');
    const moodDoc = await getDoc(moodDocRef);
    console.log('Mood API: Document exists:', moodDoc.exists());

    if (moodDoc.exists()) {
      // Add to existing array
      console.log('Mood API: Updating existing document...');
      await updateDoc(moodDocRef, {
        entries: arrayUnion(moodEntry),
        updatedAt: serverTimestamp()
      });
      console.log('Mood API: Document updated successfully');
    } else {
      // Create new document for today
      console.log('Mood API: Creating new document...');
      await setDoc(moodDocRef, {
        userId,
        date: today,
        entries: [moodEntry],
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      console.log('Mood API: New document created successfully');
    }

    return NextResponse.json({
      success: true,
      message: 'Mood saved successfully',
      entry: moodEntry
    });

  } catch (error) {
    console.error('Error saving mood:', error);
    return NextResponse.json({ error: 'Failed to save mood' }, { status: 500 });
  }
}

// GET - Retrieve mood entries
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
    const date = searchParams.get('date'); // Optional: get specific date

    if (date) {
      // Get moods for specific date
      const moodDocRef = doc(db, 'moods', `${userId}_${date}`);
      const moodDoc = await getDoc(moodDocRef);

      if (moodDoc.exists()) {
        return NextResponse.json({
          success: true,
          data: moodDoc.data()
        });
      } else {
        return NextResponse.json({
          success: true,
          data: { entries: [] }
        });
      }
    } else {
      // Get today's moods by default
      const today = new Date().toISOString().split('T')[0];
      const moodDocRef = doc(db, 'moods', `${userId}_${today}`);
      const moodDoc = await getDoc(moodDocRef);

      if (moodDoc.exists()) {
        return NextResponse.json({
          success: true,
          data: moodDoc.data()
        });
      } else {
        return NextResponse.json({
          success: true,
          data: { entries: [] }
        });
      }
    }

  } catch (error) {
    console.error('Error fetching moods:', error);
    return NextResponse.json({ error: 'Failed to fetch moods' }, { status: 500 });
  }
}


