import { NextResponse } from 'next/server';
import clientPromise from '../../../../lib/mongodb';
import { ObjectId } from 'mongodb';

// GET - Fetch conversations for a specific chat user
export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url);
        const userId = searchParams.get('userId');
        const chatUserId = searchParams.get('chatUserId');

        if (!userId || !chatUserId) {
            return NextResponse.json({ error: 'User ID and Chat User ID are required' }, { status: 400 });
        }

        const client = await clientPromise;
        const db = client.db('tara');
        const collection = db.collection('users');

        // Get user data
        const userData = await collection.findOne({ firebaseUid: userId });
        const chatUser = userData?.chatUsers?.find(u => u.id === chatUserId);

        if (!chatUser) {
            return NextResponse.json({ error: 'Chat user not found' }, { status: 404 });
        }

        return NextResponse.json({
            success: true,
            conversations: chatUser.conversations || []
        });

    } catch (error) {
        console.error('Get Conversations Error:', error);
        return NextResponse.json(
            { error: 'Failed to fetch conversations' },
            { status: 500 }
        );
    }
}

// POST - Add a new message to conversation
export async function POST(request) {
    try {
        const { userId, chatUserId, message, sender, type } = await request.json();

        if (!userId || !chatUserId || !message) {
            return NextResponse.json({ error: 'Required fields missing' }, { status: 400 });
        }

        const client = await clientPromise;
        const db = client.db('tara');
        const collection = db.collection('users');

        // Create new message
        const newMessage = {
            id: new ObjectId().toString(),
            content: message,
            sender: sender || 'user',
            type: type || 'text',
            timestamp: new Date()
        };

        // Add message to specific chat user's conversations
        await collection.updateOne(
            {
                $or: [{ firebaseUid: userId }, { userId: userId }],
                'chatUsers.id': chatUserId
            },
            {
                $push: { 'chatUsers.$.conversations': newMessage },
                $set: {
                    'chatUsers.$.lastMessageAt': new Date(),
                    lastUpdated: new Date()
                }
            }
        );

        return NextResponse.json({
            success: true,
            message: newMessage
        });

    } catch (error) {
        console.error('Add Message Error:', error);
        return NextResponse.json(
            { error: 'Failed to add message' },
            { status: 500 }
        );
    }
}

// DELETE - Clear all conversations for a chat user
export async function DELETE(request) {
    try {
        const { searchParams } = new URL(request.url);
        const userId = searchParams.get('userId');
        const chatUserId = searchParams.get('chatUserId');

        if (!userId || !chatUserId) {
            return NextResponse.json({ error: 'User ID and Chat User ID are required' }, { status: 400 });
        }

        const client = await clientPromise;
        const db = client.db('tara');
        const collection = db.collection('users');

        // Clear conversations for specific chat user
        await collection.updateOne(
            {
                $or: [{ firebaseUid: userId }, { userId: userId }],
                'chatUsers.id': chatUserId
            },
            {
                $set: {
                    'chatUsers.$.conversations': [],
                    'chatUsers.$.lastMessageAt': new Date(),
                    lastUpdated: new Date()
                }
            }
        );

        return NextResponse.json({
            success: true,
            message: 'Conversations cleared successfully'
        });

    } catch (error) {
        console.error('Clear Conversations Error:', error);
        return NextResponse.json(
            { error: 'Failed to clear conversations' },
            { status: 500 }
        );
    }
}
