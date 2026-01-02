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