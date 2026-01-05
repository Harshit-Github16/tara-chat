import { NextResponse } from 'next/server';
import clientPromise from '../../../../lib/mongodb';

export async function GET(request) {
    try {
        const client = await clientPromise;
        const db = client.db('tara');

        const { searchParams } = new URL(request.url);
        const days = parseInt(searchParams.get('days')) || 7;

        const startDate = new Date();
        startDate.setDate(startDate.getDate() - days);

        // Page views and time spent by page
        const pageStats = await db.collection('page_tracking').aggregate([
            { $match: { timestamp: { $gte: startDate } } },
            {
                $group: {
                    _id: '$page',
                    totalViews: { $sum: 1 },
                    totalTimeSpent: { $sum: '$timeSpent' },
                    uniqueUsers: { $addToSet: '$userId' },
                    avgTimeSpent: { $avg: '$timeSpent' }
                }
            },
            {
                $project: {
                    page: '$_id',
                    totalViews: 1,
                    totalTimeSpent: 1,
                    uniqueUsers: { $size: '$uniqueUsers' },
                    avgTimeSpent: { $round: ['$avgTimeSpent', 2] }
                }
            },
            { $sort: { totalViews: -1 } }
        ]).toArray();

        // Bounce rate calculation (users who left within 10 seconds)
        const bounceData = await db.collection('page_tracking').aggregate([
            { $match: { timestamp: { $gte: startDate }, action: 'exit' } },
            {
                $group: {
                    _id: '$page',
                    totalExits: { $sum: 1 },
                    quickExits: {
                        $sum: {
                            $cond: [{ $lt: ['$timeSpent', 10000] }, 1, 0]
                        }
                    }
                }
            },
            {
                $project: {
                    page: '$_id',
                    bounceRate: {
                        $round: [
                            { $multiply: [{ $divide: ['$quickExits', '$totalExits'] }, 100] },
                            2
                        ]
                    }
                }
            }
        ]).toArray();

        // User journey analysis (limited and deduplicated)
        const userJourneys = await db.collection('page_tracking').aggregate([
            { $match: { timestamp: { $gte: startDate }, action: 'enter' } },
            { $sort: { userId: 1, timestamp: 1 } },
            {
                $group: {
                    _id: '$userId',
                    journey: {
                        $push: {
                            page: '$page',
                            timestamp: '$timestamp',
                            timeSpent: '$timeSpent'
                        }
                    },
                    totalPages: { $sum: 1 },
                    sessionDuration: {
                        $sum: '$timeSpent'
                    }
                }
            },
            // Limit journey length to prevent too many entries
            {
                $project: {
                    journey: { $slice: ['$journey', 10] }, // Only show first 10 pages
                    totalPages: 1,
                    sessionDuration: 1
                }
            },
            { $limit: 20 } // Only show 20 user journeys
        ]).toArray();

        // Active sessions
        const activeSessions = await db.collection('user_sessions').aggregate([
            {
                $match: {
                    lastActivity: { $gte: new Date(Date.now() - 30 * 60 * 1000) } // Last 30 minutes
                }
            },
            {
                $lookup: {
                    from: 'users',
                    localField: 'userId',
                    foreignField: '_id',
                    as: 'user'
                }
            },
            {
                $project: {
                    sessionId: 1,
                    userId: 1,
                    lastPage: 1,
                    lastActivity: 1,
                    totalTimeSpent: 1,
                    pageViews: 1,
                    userName: { $arrayElemAt: ['$user.name', 0] },
                    userEmail: { $arrayElemAt: ['$user.email', 0] }
                }
            }
        ]).toArray();

        // Daily analytics
        const dailyStats = await db.collection('page_tracking').aggregate([
            { $match: { timestamp: { $gte: startDate } } },
            {
                $group: {
                    _id: {
                        $dateToString: { format: '%Y-%m-%d', date: '$timestamp' }
                    },
                    totalViews: { $sum: 1 },
                    uniqueUsers: { $addToSet: '$userId' },
                    totalTimeSpent: { $sum: '$timeSpent' }
                }
            },
            {
                $project: {
                    date: '$_id',
                    totalViews: 1,
                    uniqueUsers: { $size: '$uniqueUsers' },
                    totalTimeSpent: 1,
                    avgTimePerUser: {
                        $round: [
                            { $divide: ['$totalTimeSpent', { $size: '$uniqueUsers' }] },
                            2
                        ]
                    }
                }
            },
            { $sort: { date: 1 } }
        ]).toArray();

        // Top 10 Chat Users - Aggregating ALL conversations across all chatUsers
        const topChatUsers = await db.collection('users').aggregate([
            { $match: { 'chatUsers.conversations': { $exists: true, $not: { $size: 0 } } } },
            {
                $project: {
                    name: 1,
                    email: 1,
                    avatar: 1,
                    conversationCount: {
                        $reduce: {
                            input: "$chatUsers",
                            initialValue: 0,
                            in: { $add: ["$$value", { $size: { $ifNull: ["$$this.conversations", []] } }] }
                        }
                    }
                }
            },
            { $sort: { conversationCount: -1 } },
            { $limit: 10 }
        ]).toArray();

        // Geographical Analytics (Top Cities)
        const geoStats = await db.collection('user_sessions').aggregate([
            { $match: { startTime: { $gte: startDate }, location: { $exists: true } } },
            { $group: { _id: '$location.city', count: { $sum: 1 } } },
            { $project: { city: '$_id', count: 1, _id: 0 } },
            { $sort: { count: -1 } },
            { $limit: 8 }
        ]).toArray();

        // Device & Browser Analytics
        const sessionMetadata = await db.collection('user_sessions').find(
            { startTime: { $gte: startDate }, userAgent: { $exists: true, $ne: '' } },
            { projection: { userAgent: 1 } }
        ).toArray();

        const deviceStats = { Mobile: 0, Desktop: 0, Tablet: 0 };
        const browserStats = {};

        sessionMetadata.forEach(session => {
            const ua = session.userAgent.toLowerCase();

            // Basic Device Detection
            if (ua.includes('mobi')) {
                if (ua.includes('tablet') || ua.includes('ipad')) deviceStats.Tablet++;
                else deviceStats.Mobile++;
            } else {
                deviceStats.Desktop++;
            }

            // Basic Browser Detection
            let browser = 'Other';
            if (ua.includes('chrome') || ua.includes('crios')) browser = 'Chrome';
            else if (ua.includes('safari') && !ua.includes('chrome')) browser = 'Safari';
            else if (ua.includes('firefox') || ua.includes('fxios')) browser = 'Firefox';
            else if (ua.includes('edge')) browser = 'Edge';

            browserStats[browser] = (browserStats[browser] || 0) + 1;
        });

        // Merge bounce rate data with page stats
        const pageStatsWithBounce = pageStats.map(stat => {
            const bounceInfo = bounceData.find(b => b.page === stat.page);
            return {
                ...stat,
                bounceRate: bounceInfo ? bounceInfo.bounceRate : 0
            };
        });

        return NextResponse.json({
            success: true,
            data: {
                pageStats: pageStatsWithBounce,
                userJourneys,
                activeSessions,
                dailyStats,
                topChatUsers,
                geoStats,
                deviceStats: Object.entries(deviceStats).map(([label, value]) => ({ label, value })),
                browserStats: Object.entries(browserStats).map(([label, value]) => ({ label, value })),
                summary: {
                    totalPages: pageStats.length,
                    totalViews: pageStats.reduce((sum, p) => sum + p.totalViews, 0),
                    totalUsers: [...new Set(pageStats.flatMap(p => p.uniqueUsers))].length,
                    avgBounceRate: bounceData.length > 0
                        ? Math.round(bounceData.reduce((sum, b) => sum + b.bounceRate, 0) / bounceData.length)
                        : 0
                }
            }
        });
    } catch (error) {
        console.error('Analytics dashboard error:', error);
        return NextResponse.json(
            { success: false, message: 'Failed to fetch analytics' },
            { status: 500 }
        );
    }
}