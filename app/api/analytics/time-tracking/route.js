import { NextResponse } from 'next/server';
import clientPromise from '../../../../lib/mongodb';

export async function POST(request) {
    try {
        const client = await clientPromise;
        const db = client.db('tara');

        const body = await request.json();
        const {
            userId,
            sessionId,
            page,
            action, // 'enter', 'exit', 'heartbeat'
            timestamp,
            userAgent,
            referrer,
            timeSpent // for exit events
        } = body;

        if (!userId || !sessionId || !page || !action) {
            return NextResponse.json(
                { success: false, message: 'Missing required fields' },
                { status: 400 }
            );
        }

        // Get IP address
        const ip = request.headers.get('x-forwarded-for')?.split(',')[0] || '127.0.0.1';

        const trackingData = {
            userId,
            sessionId,
            page,
            action,
            timestamp: new Date(timestamp || Date.now()),
            userAgent: userAgent || '',
            referrer: referrer || '',
            timeSpent: timeSpent || 0,
            ip,
            createdAt: new Date()
        };

        // Insert tracking data
        await db.collection('page_tracking').insertOne(trackingData);

        // Update session data with location if not already present
        if (action === 'enter') {
            const session = await db.collection('user_sessions').findOne({ sessionId });
            let locationData = {};

            // Only fetch location if it's a new session or location is missing
            if (!session || !session.location) {
                try {
                    const geoResponse = await fetch(`https://ipapi.co/${ip}/json/`);
                    const geoData = await geoResponse.json();
                    if (!geoData.error) {
                        locationData = {
                            city: geoData.city,
                            region: geoData.region,
                            country: geoData.country_name,
                            lat: geoData.latitude,
                            lon: geoData.longitude
                        };
                    }
                } catch (err) {
                    console.error('GeoIP fetch error:', err);
                }
            }

            await db.collection('user_sessions').updateOne(
                { sessionId, userId },
                {
                    $set: {
                        lastPage: page,
                        lastActivity: new Date(),
                        userAgent: userAgent || '',
                        referrer: referrer || '',
                        ip,
                        ...(Object.keys(locationData).length > 0 && { location: locationData })
                    },
                    $inc: { pageViews: 1 },
                    $setOnInsert: {
                        sessionId,
                        userId,
                        startTime: new Date(),
                        totalTimeSpent: 0
                    }
                },
                { upsert: true }
            );
        } else if ((action === 'exit' || action === 'heartbeat') && timeSpent) {
            await db.collection('user_sessions').updateOne(
                { sessionId, userId },
                {
                    $inc: { totalTimeSpent: timeSpent },
                    $set: { lastActivity: new Date() }
                }
            );
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Time tracking error:', error);
        return NextResponse.json(
            { success: false, message: 'Failed to track time' },
            { status: 500 }
        );
    }
}

export async function GET(request) {
    try {
        const client = await clientPromise;
        const db = client.db('tara');

        const { searchParams } = new URL(request.url);
        const userId = searchParams.get('userId');
        const days = parseInt(searchParams.get('days')) || 7;

        const startDate = new Date();
        startDate.setDate(startDate.getDate() - days);

        let query = { timestamp: { $gte: startDate } };
        if (userId) {
            query.userId = userId;
        }

        const trackingData = await db.collection('page_tracking')
            .find(query)
            .sort({ timestamp: -1 })
            .limit(1000)
            .toArray();

        return NextResponse.json({ success: true, data: trackingData });
    } catch (error) {
        console.error('Get tracking data error:', error);
        return NextResponse.json(
            { success: false, message: 'Failed to get tracking data' },
            { status: 500 }
        );
    }
}