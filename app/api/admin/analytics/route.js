import { NextResponse } from 'next/server';
import clientPromise from '../../../../lib/mongodb';
import { verifyToken } from '../../../../lib/jwt';

export async function GET(request) {
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

        const url = new URL(request.url);
        const days = parseInt(url.searchParams.get('days')) || 30;

        // Calculate date range
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - days);

        const analyticsCollection = db.collection('user_analytics');

        // Get all analytics data for the time period
        const analyticsData = await analyticsCollection.find({
            timestamp: { $gte: startDate }
        }).toArray();

        console.log(`Admin Analytics: Found ${analyticsData.length} analytics entries in last ${days} days`);
        console.log('Start date:', startDate);
        console.log('Sample entries:', analyticsData.slice(0, 2));

        // Get user data for names and emails
        const userIds = [...new Set(analyticsData.map(entry => entry.userId))];
        const users = await usersCollection.find({
            firebaseUid: { $in: userIds }
        }).toArray();

        const userMap = {};
        users.forEach(user => {
            userMap[user.firebaseUid] = {
                name: user.name,
                email: user.email,
                joinedDate: user.createdAt
            };
        });

        // Calculate overview statistics
        const overview = {
            totalUsers: userIds.length,
            totalSessions: analyticsData.length,
            totalTimeSpent: analyticsData.reduce((sum, entry) => sum + (entry.sessionTime || 0), 0),
            averageSessionTime: 0
        };

        if (overview.totalSessions > 0) {
            overview.averageSessionTime = Math.round(overview.totalTimeSpent / overview.totalSessions);
        }

        // Calculate per-user statistics
        const userStats = {};
        analyticsData.forEach(entry => {
            const userId = entry.userId;
            if (!userStats[userId]) {
                userStats[userId] = {
                    userId,
                    sessionCount: 0,
                    totalTimeSpent: 0,
                    pages: {},
                    actions: {},
                    lastActive: null
                };
            }

            userStats[userId].sessionCount += 1;
            userStats[userId].totalTimeSpent += entry.sessionTime || 0;
            userStats[userId].lastActive = entry.timestamp;

            // Aggregate page time
            if (entry.pages) {
                Object.entries(entry.pages).forEach(([page, time]) => {
                    if (!userStats[userId].pages[page]) {
                        userStats[userId].pages[page] = 0;
                    }
                    userStats[userId].pages[page] += time;
                });
            }

            // Count actions
            if (entry.actions) {
                entry.actions.forEach(action => {
                    const actionType = action.action;
                    if (!userStats[userId].actions[actionType]) {
                        userStats[userId].actions[actionType] = 0;
                    }
                    userStats[userId].actions[actionType] += 1;
                });
            }
        });

        // Create top users list with user details
        const topUsers = Object.values(userStats)
            .map(stats => ({
                ...stats,
                ...userMap[stats.userId],
                averageSessionTime: Math.round(stats.totalTimeSpent / stats.sessionCount)
            }))
            .sort((a, b) => b.totalTimeSpent - a.totalTimeSpent);

        // Calculate daily statistics
        const dailyStats = {};
        analyticsData.forEach(entry => {
            const date = entry.date;
            if (!dailyStats[date]) {
                dailyStats[date] = {
                    sessions: 0,
                    timeSpent: 0,
                    uniqueUsers: new Set(),
                    actions: 0
                };
            }

            dailyStats[date].sessions += 1;
            dailyStats[date].timeSpent += entry.sessionTime || 0;
            dailyStats[date].uniqueUsers.add(entry.userId);
            dailyStats[date].actions += entry.actions?.length || 0;
        });

        // Convert sets to counts
        Object.keys(dailyStats).forEach(date => {
            dailyStats[date].uniqueUsers = dailyStats[date].uniqueUsers.size;
        });

        // Calculate page statistics
        const pageStats = {};
        analyticsData.forEach(entry => {
            if (entry.pages) {
                Object.entries(entry.pages).forEach(([page, time]) => {
                    if (!pageStats[page]) {
                        pageStats[page] = {
                            visits: 0,
                            totalTime: 0,
                            uniqueUsers: new Set()
                        };
                    }
                    pageStats[page].visits += 1;
                    pageStats[page].totalTime += time;
                    pageStats[page].uniqueUsers.add(entry.userId);
                });
            }
        });

        // Convert sets to counts and sort by total time
        const sortedPageStats = {};
        Object.entries(pageStats)
            .sort(([, a], [, b]) => b.totalTime - a.totalTime)
            .forEach(([page, stats]) => {
                sortedPageStats[page] = {
                    visits: stats.visits,
                    totalTime: stats.totalTime,
                    uniqueUsers: stats.uniqueUsers.size
                };
            });

        // Calculate action statistics
        const actionStats = {};
        analyticsData.forEach(entry => {
            if (entry.actions) {
                entry.actions.forEach(action => {
                    const actionType = action.action;
                    actionStats[actionType] = (actionStats[actionType] || 0) + 1;
                });
            }
        });

        return NextResponse.json({
            success: true,
            data: {
                overview,
                topUsers,
                dailyStats,
                pageStats: sortedPageStats,
                actionStats
            }
        });

    } catch (error) {
        console.error('Admin analytics error:', error);
        return NextResponse.json({
            error: 'Failed to fetch analytics data'
        }, { status: 500 });
    }
}