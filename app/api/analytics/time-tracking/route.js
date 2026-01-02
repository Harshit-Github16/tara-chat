import { NextResponse } from 'next/server';
import clientPromise from '../../../../lib/mongodb';
import { verifyToken } from '../../../../lib/jwt';

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
        const body = await request.json();
        const { sessionTime, pages, actions, timestamp } = body;

        const client = await clientPromise;
        const db = client.db('tara');
        const collection = db.collection('user_analytics');

        // Create analytics entry
        const analyticsEntry = {
            userId,
            sessionTime,
            pages,
            actions,
            timestamp: new Date(timestamp),
            date: new Date().toISOString().split('T')[0], // YYYY-MM-DD format
            createdAt: new Date()
        };

        await collection.insertOne(analyticsEntry);

        // Also update user's total time spent
        const usersCollection = db.collection('users');
        await usersCollection.updateOne(
            { firebaseUid: userId },
            {
                $inc: {
                    'analytics.totalTimeSpent': sessionTime,
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
            message: 'Analytics data saved successfully'
        });

    } catch (error) {
        console.error('Time tracking error:', error);
        return NextResponse.json({
            error: 'Failed to save analytics data'
        }, { status: 500 });
    }
}

export async function GET(request) {
    try {
        // Verify JWT token
        const decoded = await verifyToken(request);
        if (!decoded) {
            return NextResponse.json({
                error: 'Authentication required'
            }, { status: 401 });
        }

        const userId = decoded.userId;
        const url = new URL(request.url);
        const days = parseInt(url.searchParams.get('days')) || 30;

        const client = await clientPromise;
        const db = client.db('tara');
        const collection = db.collection('user_analytics');

        // Get analytics data for the last N days
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - days);

        const analyticsData = await collection.find({
            userId,
            timestamp: { $gte: startDate }
        }).sort({ timestamp: -1 }).toArray();

        // Aggregate data
        const summary = {
            totalSessions: analyticsData.length,
            totalTimeSpent: analyticsData.reduce((sum, entry) => sum + (entry.sessionTime || 0), 0),
            averageSessionTime: 0,
            mostVisitedPages: {},
            dailyActivity: {},
            actionCounts: {}
        };

        if (summary.totalSessions > 0) {
            summary.averageSessionTime = Math.round(summary.totalTimeSpent / summary.totalSessions);
        }

        // Process page visits and daily activity
        analyticsData.forEach(entry => {
            const date = entry.date;

            // Daily activity
            if (!summary.dailyActivity[date]) {
                summary.dailyActivity[date] = {
                    sessions: 0,
                    timeSpent: 0,
                    actions: 0
                };
            }
            summary.dailyActivity[date].sessions += 1;
            summary.dailyActivity[date].timeSpent += entry.sessionTime || 0;
            summary.dailyActivity[date].actions += entry.actions?.length || 0;

            // Page visits
            if (entry.pages) {
                Object.entries(entry.pages).forEach(([page, time]) => {
                    if (!summary.mostVisitedPages[page]) {
                        summary.mostVisitedPages[page] = { visits: 0, totalTime: 0 };
                    }
                    summary.mostVisitedPages[page].visits += 1;
                    summary.mostVisitedPages[page].totalTime += time;
                });
            }

            // Action counts
            if (entry.actions) {
                entry.actions.forEach(action => {
                    const actionType = action.action;
                    summary.actionCounts[actionType] = (summary.actionCounts[actionType] || 0) + 1;
                });
            }
        });

        // Sort most visited pages
        const sortedPages = Object.entries(summary.mostVisitedPages)
            .sort(([, a], [, b]) => b.totalTime - a.totalTime)
            .slice(0, 10);

        summary.mostVisitedPages = Object.fromEntries(sortedPages);

        return NextResponse.json({
            success: true,
            data: {
                summary,
                rawData: analyticsData.slice(0, 100) // Limit raw data
            }
        });

    } catch (error) {
        console.error('Get analytics error:', error);
        return NextResponse.json({
            error: 'Failed to get analytics data'
        }, { status: 500 });
    }
}