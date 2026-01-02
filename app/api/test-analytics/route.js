import { NextResponse } from 'next/server';
import clientPromise from '../../../lib/mongodb';
import { verifyToken } from '../../../lib/jwt';

export async function POST(request) {
    try {
        // Verify JWT token
        const decoded = await verifyToken(request);
        if (!decoded) {
            return NextResponse.json({
                error: 'Authentication required'
            }, { status: 401 });
        }

        const userId = decoded.userId;

        // Create test analytics data
        const client = await clientPromise;
        const db = client.db('tara');
        const collection = db.collection('user_analytics');

        const testData = {
            userId,
            sessionTime: 300000, // 5 minutes
            pages: {
                '/chatlist': 180000, // 3 minutes
                '/insights': 120000  // 2 minutes
            },
            actions: [
                { action: 'page_view', timestamp: Date.now(), page: '/chatlist' },
                { action: 'click', timestamp: Date.now(), page: '/chatlist' },
                { action: 'chat_message', timestamp: Date.now(), page: '/chatlist' }
            ],
            timestamp: new Date(),
            date: new Date().toISOString().split('T')[0],
            createdAt: new Date()
        };

        await collection.insertOne(testData);

        // Also update user's total time spent
        const usersCollection = db.collection('users');
        await usersCollection.updateOne(
            { firebaseUid: userId },
            {
                $inc: {
                    'analytics.totalTimeSpent': testData.sessionTime,
                    'analytics.sessionCount': 1
                },
                $set: {
                    'analytics.lastActive': new Date(),
                    lastUpdated: new Date()
                }
            }
        );

        return NextResponse.json({
            success: true,
            message: 'Test analytics data created',
            data: testData
        });

    } catch (error) {
        console.error('Test analytics error:', error);
        return NextResponse.json({
            error: 'Failed to create test data'
        }, { status: 500 });
    }
}