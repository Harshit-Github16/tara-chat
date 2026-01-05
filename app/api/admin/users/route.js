import { NextResponse } from 'next/server';
import clientPromise from '../../../../lib/mongodb';

export async function GET() {
    try {
        const client = await clientPromise;
        const db = client.db('tara');

        // Fetch users with aggregated chat and session metrics
        const users = await db.collection('users').aggregate([
            {
                $lookup: {
                    from: 'user_sessions',
                    localField: 'uid',
                    foreignField: 'userId',
                    as: 'sessions'
                }
            },
            {
                $project: {
                    name: 1,
                    email: 1,
                    avatar: 1,
                    gender: 1,
                    ageRange: 1,
                    profession: 1,
                    source: 1,
                    provider: 1,
                    createdAt: 1,
                    chatUsers: 1,
                    totalChats: {
                        $reduce: {
                            input: { $ifNull: ["$chatUsers", []] },
                            initialValue: 0,
                            in: { $add: ["$$value", { $size: { $ifNull: ["$$this.conversations", []] } }] }
                        }
                    },
                    totalTimeSpent: { $sum: "$sessions.totalTimeSpent" },
                    sessionCount: { $size: "$sessions" }
                }
            },
            {
                $addFields: {
                    uniqueChatDays: {
                        $size: {
                            $setUnion: {
                                $reduce: {
                                    input: { $ifNull: ["$chatUsers", []] },
                                    initialValue: [],
                                    in: {
                                        $concatArrays: [
                                            "$$value",
                                            {
                                                $map: {
                                                    input: { $ifNull: ["$$this.conversations", []] },
                                                    as: "conv",
                                                    in: {
                                                        $dateToString: {
                                                            format: "%Y-%m-%d",
                                                            date: { $toDate: "$$conv.timestamp" }
                                                        }
                                                    }
                                                }
                                            }
                                        ]
                                    }
                                }
                            }
                        }
                    }
                }
            },
            {
                $project: {
                    chatUsers: 0  // Remove chatUsers from final output
                }
            },
            { $sort: { createdAt: -1 } }
        ]).toArray();

        return NextResponse.json({
            success: true,
            data: users
        });
    } catch (error) {
        console.error('Error fetching users:', error);
        return NextResponse.json({
            success: false,
            error: 'Failed to fetch users'
        }, { status: 500 });
    }
}
