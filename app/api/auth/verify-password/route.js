import { NextResponse } from 'next/server';
import clientPromise from '../../../../lib/mongodb';

export async function POST(request) {
    try {
        const { userId, password } = await request.json();

        // Verify auth token from header
        const authHeader = request.headers.get('authorization');
        const token = authHeader && authHeader.split(' ')[1];

        if (!token) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const client = await clientPromise;
        const db = client.db('tara');

        const user = await db.collection('users').findOne({ firebaseUid: userId });

        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        if (user.userPassword === password) {
            return NextResponse.json({ success: true });
        } else {
            return NextResponse.json({ success: false, error: 'Incorrect password' });
        }
    } catch (error) {
        console.error('Error verifying password:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
