import { NextResponse } from 'next/server';
import clientPromise from '../../../lib/mongodb';

export async function GET() {
    try {
        const client = await clientPromise;
        const db = client.db('tara');

        // Test the connection
        await db.admin().ping();

        return NextResponse.json({
            success: true,
            message: 'MongoDB connection successful',
            database: 'tara'
        });
    } catch (error) {
        console.error('MongoDB connection error:', error);
        return NextResponse.json(
            {
                success: false,
                error: 'MongoDB connection failed',
                details: error.message
            },
            { status: 500 }
        );
    }
}