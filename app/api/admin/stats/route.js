import { NextResponse } from 'next/server';
import clientPromise from '../../../../lib/mongodb';

export async function GET(request) {
    try {
        const client = await clientPromise;
        const db = client.db('tara');

        // Get counts from different collections
        const usersCount = await db.collection('users').countDocuments();
        const blogsCount = await db.collection('blogs').countDocuments();

        // Count total chats across all users
        const users = await db.collection('users').find({}).toArray();
        let totalChats = 0;
        users.forEach(user => {
            if (user.chatUsers && Array.isArray(user.chatUsers)) {
                user.chatUsers.forEach(chatUser => {
                    if (chatUser.conversations && Array.isArray(chatUser.conversations)) {
                        totalChats += chatUser.conversations.length;
                    }
                });
            }
        });

        return NextResponse.json({
            success: true,
            data: {
                totalUsers: usersCount,
                totalBlogs: blogsCount,
                totalChats: totalChats
            }
        });
    } catch (error) {
        console.error('Admin stats error:', error);
        return NextResponse.json(
            { success: false, message: 'Failed to fetch stats' },
            { status: 500 }
        );
    }
}
