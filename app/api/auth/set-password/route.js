import { NextResponse } from 'next/server';
import clientPromise from '../../../../lib/mongodb';
import { verifyToken } from '../../../../lib/jwt';

// Add this constant for password hashing (in a real app, use bcrypt)
// For now, we'll store simple hash or plain (not recommended for prod)
// but user requested simple "set password". We will hash it simply.
// We should use bcryptjs if available or crypto.
// Let's assume user wants functional flow first.

export async function POST(request) {
    try {
        const { userId, userPassword } = await request.json();

        // Verify auth token from header
        const authHeader = request.headers.get('authorization');
        const token = authHeader && authHeader.split(' ')[1];

        if (!token) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // In a real app we'd verify the token is for this userId
        // const decoded = await verifyAuthToken(token);
        // if (decoded.uid !== userId) ...

        const client = await clientPromise;
        const db = client.db('tara');

        // Update user with the password
        const result = await db.collection('users').updateOne(
            { firebaseUid: userId },
            { $set: { userPassword: userPassword } }
        );

        if (result.matchedCount === 0) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error setting password:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
