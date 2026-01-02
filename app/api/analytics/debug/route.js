import { NextResponse } from 'next/server';
import clientPromise from '../../../../lib/mongodb';

export async function GET(request) {
    try {
        const client = await clientPromise;
        const db = client.db('tara');

        // Get all tracking data from last 24 hours
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);

        const trackingData = await db.collection('page_tracking')
            .find({ timestamp: { $gte: yesterday } })
            .sort({ timestamp: -1 })
            .limit(50)
            .toArray();

        // Get unique pages
        const uniquePages = [...new Set(trackingData.map(d => d.page))];

        // Get unique users
        const uniqueUsers = [...new Set(trackingData.map(d => d.userId))];

        return NextResponse.json({
            success: true,
            data: {
                totalRecords: trackingData.length,
                uniquePages,
                uniqueUsers,
                recentData: trackingData.slice(0, 10),
                summary: {
                    pages: uniquePages.length,
                    users: uniqueUsers.length,
                    actions: {
                        enter: trackingData.filter(d => d.action === 'enter').length,
                        exit: trackingData.filter(d => d.action === 'exit').length,
                        heartbeat: trackingData.filter(d => d.action === 'heartbeat').length
                    }
                }
            }
        });
    } catch (error) {
        console.error('Debug API error:', error);
        return NextResponse.json(
            { success: false, error: error.message },
            { status: 500 }
        );
    }
}