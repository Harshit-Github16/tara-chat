import { NextResponse } from 'next/server';
import clientPromise from '../../../lib/mongodb';

export async function POST(request) {
    try {
        const { userId, scores, answers, completedAt } = await request.json();

        if (!userId) {
            return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
        }

        const client = await clientPromise;
        const db = client.db('tara');
        const collection = db.collection('users');

        // Update user's reflection radar data
        const result = await collection.updateOne(
            { firebaseUid: userId },
            {
                $set: {
                    reflectionRadar: {
                        scores,
                        answers,
                        completedAt: new Date(completedAt),
                        updatedAt: new Date()
                    }
                }
            }
        );

        if (result.matchedCount === 0) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        return NextResponse.json({
            success: true,
            message: 'Reflection radar saved successfully',
            data: { scores, completedAt }
        });

    } catch (error) {
        console.error('Error saving reflection radar:', error);
        return NextResponse.json(
            { error: 'Failed to save reflection radar', details: error.message },
            { status: 500 }
        );
    }
}

export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url);
        const userId = searchParams.get('userId');

        if (!userId) {
            return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
        }

        const client = await clientPromise;
        const db = client.db('tara');
        const collection = db.collection('users');

        const user = await collection.findOne(
            { firebaseUid: userId },
            { projection: { reflectionRadar: 1 } }
        );

        if (!user || !user.reflectionRadar) {
            return NextResponse.json({
                success: true,
                data: null
            });
        }

        return NextResponse.json({
            success: true,
            data: user.reflectionRadar
        });

    } catch (error) {
        console.error('Error fetching reflection radar:', error);
        return NextResponse.json(
            { error: 'Failed to fetch reflection radar', details: error.message },
            { status: 500 }
        );
    }
}
