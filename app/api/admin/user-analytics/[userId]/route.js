import { NextResponse } from 'next/server';
import clientPromise from '../../../../../lib/mongodb';
import { verifyToken } from '../../../../../lib/jwt';

export async function GET(request, { params }) {
    try {
        // Verify JWT token and admin access
        const decoded = await verifyToken(request);
        if (!decoded) {
            return NextResponse.json({
                error: 'Authentication required'
            }, { status: 401 });
        }

        // Check if user is admin
        const client = await clientPromise;
        const db = client.db('tara');
        const usersCollection = db.collection('users');

        const adminUser = await usersCollection.findOne({
            firebaseUid: decoded.userId,
            isAdmin: true
        });

        if (!adminUser) {
            return NextResponse.json({
                error: 'Admin access required'
            }, { status: 403 });
        }

        const { userId } = params;

        // Get analytics data for the specific user
        const analyticsCollection = db.collection('user_analytics');

        // Get last 30 days of data
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - 30);

        const userAnalytics = await analyticsCollection.find({
            userId,
            timestamp: { $gte: startDate }
        }).sort({ timestamp: -1 }).toArray();

        console.log(`Found ${userAnalytics.length} analytics entries for user ${userId}`);
        if (userAnalytics.length > 0) {
            console.log('Sample entry:', userAnalytics[0]);
        }

        // Calculate summary statistics
        const summary = {
            totalTimeSpent: 0,
            sessionCount: userAnalytics.length,
            lastActive: null,
            averageSessionTime: 0,
            totalActions: 0,
            mostUsedPages: {},
            recentSessions: []
        };

        if (userAnalytics.length > 0) {
            summary.lastActive = userAnalytics[0].timestamp;
            summary.totalTimeSpent = userAnalytics.reduce((sum, entry) => sum + (entry.sessionTime || 0), 0);
            summary.averageSessionTime = Math.round(summary.totalTimeSpent / summary.sessionCount);

            // Count total actions
            summary.totalActions = userAnalytics.reduce((sum, entry) => sum + (entry.actions?.length || 0), 0);

            // Get most used pages
            userAnalytics.forEach(entry => {
                if (entry.pages) {
                    Object.entries(entry.pages).forEach(([page, time]) => {
                        if (!summary.mostUsedPages[page]) {
                            summary.mostUsedPages[page] = 0;
                        }
                        summary.mostUsedPages[page] += time;
                    });
                }
            });

            // Sort pages by time spent
            summary.mostUsedPages = Object.fromEntries(
                Object.entries(summary.mostUsedPages)
                    .sort(([, a], [, b]) => b - a)
                    .slice(0, 5)
            );

            // Get recent sessions (last 10)
            summary.recentSessions = userAnalytics.slice(0, 10).map(entry => ({
                date: entry.date,
                sessionTime: entry.sessionTime,
                actions: entry.actions?.length || 0,
                timestamp: entry.timestamp
            }));
        }

        return NextResponse.json({
            success: true,
            data: summary
        });

    } catch (error) {
        console.error('User analytics error:', error);
        return NextResponse.json({
            error: 'Failed to fetch user analytics'
        }, { status: 500 });
    }
}