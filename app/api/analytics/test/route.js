import { NextResponse } from 'next/server';
import clientPromise from '../../../../lib/mongodb';

export async function GET(request) {
    try {
        const client = await clientPromise;
        const db = client.db('tara');

        // Simple test to check if we can connect to the database
        const collections = await db.listCollections().toArray();

        return NextResponse.json({
            success: true,
            message: 'Database connection successful',
            collections: collections.map(c => c.name),
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        console.error('Database test error:', error);
        return NextResponse.json(
            {
                success: false,
                message: 'Database connection failed',
                error: error.message
            },
            { status: 500 }
        );
    }
}

export async function POST(request) {
    try {
        const client = await clientPromise;
        const db = client.db('tara');

        const body = await request.json();

        // Test insert
        const result = await db.collection('test_tracking').insertOne({
            ...body,
            timestamp: new Date(),
            test: true
        });

        return NextResponse.json({
            success: true,
            message: 'Test insert successful',
            insertedId: result.insertedId
        });
    } catch (error) {
        console.error('Test insert error:', error);
        return NextResponse.json(
            {
                success: false,
                message: 'Test insert failed',
                error: error.message
            },
            { status: 500 }
        );
    }
}