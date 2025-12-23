import { NextResponse } from 'next/server';
import clientPromise from '../../../../lib/mongodb';

export async function GET() {
    try {
        const client = await clientPromise;
        const db = client.db('tara');

        // Fetch users sorted by creation date (newest first)
        const users = await db.collection('users')
            .find({})
            .sort({ createdAt: -1 })
            .toArray();

        return NextResponse.json({
            success: true,
            data: users
        });
    } catch (error) {
        console.error('Error fetching users:', error);
        return NextResponse.json({
            success: false,
            error: 'Failed to fetch users'
        }, { status: 500 });
    }
}
