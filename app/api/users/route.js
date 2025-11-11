import { NextResponse } from 'next/server';
import clientPromise from '../../../lib/mongodb';
import { ObjectId } from 'mongodb';

// GET - Fetch all chat users for a logged-in user
export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url);
        const userId = searchParams.get('userId');

        if (!userId) {
            return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
        }

        const client = await clientPromise;
        const db = client.db('tara'); // Same database as User model
        const collection = db.collection('users');

        // Get user's chat users (userId is firebaseUid)
        let userData = await collection.findOne({ firebaseUid: userId });

        // Fallback: check old userId field for backward compatibility
        if (!userData) {
            userData = await collection.findOne({ userId: userId });
        }

        // If user doesn't exist or no chatUsers, initialize with TARA
        if (!userData || !userData.chatUsers || userData.chatUsers.length === 0) {
            const defaultTara = {
                id: "tara-ai",
                name: "TARA AI",
                type: "ai",
                avatar: "/taralogo.jpg",
                conversations: [],
                createdAt: new Date()
            };

            await collection.updateOne(
                { $or: [{ firebaseUid: userId }, { userId: userId }] },
                {
                    $set: {
                        firebaseUid: userId,
                        userId: userId, // Keep for backward compatibility
                        chatUsers: [defaultTara],
                        lastUpdated: new Date()
                    }
                },
                { upsert: true }
            );

            return NextResponse.json({
                success: true,
                chatUsers: [defaultTara]
            });
        }

        return NextResponse.json({
            success: true,
            chatUsers: userData.chatUsers || []
        });

    } catch (error) {
        console.error('Get Chat Users Error:', error);
        return NextResponse.json(
            { error: 'Failed to fetch chat users' },
            { status: 500 }
        );
    }
}

// POST - Add a new chat user (custom or celebrity)
export async function POST(request) {
    try {
        const { userId, name, avatar, gender, role, type, celebrityId, celebrityRole } = await request.json();

        console.log('POST /api/users - Request:', { userId, name, avatar, gender, role, type, celebrityId, celebrityRole });

        if (!userId || !name) {
            return NextResponse.json({ error: 'User ID and name are required' }, { status: 400 });
        }

        const client = await clientPromise;
        const db = client.db('tara'); // Same database as User model
        const collection = db.collection('users');

        // Create new chat user
        const newChatUser = {
            id: celebrityId || new ObjectId().toString(),
            name,
            type: type || 'custom', // 'custom', 'celebrity', or 'ai'
            avatar: avatar || null,
            gender: gender || 'other',
            role: role || 'Chill Friend',
            conversations: [],
            createdAt: new Date(),
            lastMessageAt: new Date()
        };

        // Add celebrityRole if provided (for celebrities)
        if (celebrityRole) {
            newChatUser.celebrityRole = celebrityRole;
        }

        // First, check if user document exists
        const userDoc = await collection.findOne({ firebaseUid: userId });

        console.log('User document found:', userDoc ? 'Yes' : 'No');
        console.log('Current chatUsers count:', userDoc?.chatUsers?.length || 0);

        if (!userDoc) {
            console.error('User not found with firebaseUid:', userId);
            return NextResponse.json({
                error: 'User not found. Please log in again.'
            }, { status: 404 });
        }

        // Check if chat user already exists
        const existingChatUser = userDoc.chatUsers?.find(u => u.id === newChatUser.id);

        if (existingChatUser) {
            return NextResponse.json({
                success: true,
                chatUser: existingChatUser,
                alreadyExists: true
            });
        }

        // Add new chat user to existing user's chatUsers array
        console.log('Adding new chat user:', newChatUser);

        const result = await collection.updateOne(
            { firebaseUid: userId },
            {
                $push: { chatUsers: newChatUser },
                $set: { lastUpdated: new Date() }
            }
        );

        console.log('Update result:', {
            matchedCount: result.matchedCount,
            modifiedCount: result.modifiedCount
        });

        if (result.matchedCount === 0) {
            console.error('No document matched for update');
            return NextResponse.json({
                error: 'Failed to add chat user'
            }, { status: 500 });
        }

        console.log('Chat user added successfully!');

        return NextResponse.json({
            success: true,
            chatUser: newChatUser
        });

    } catch (error) {
        console.error('Add Chat User Error:', error);
        return NextResponse.json(
            { error: 'Failed to add chat user' },
            { status: 500 }
        );
    }
}

// DELETE - Remove a chat user
export async function DELETE(request) {
    try {
        const { searchParams } = new URL(request.url);
        const userId = searchParams.get('userId');
        const chatUserId = searchParams.get('chatUserId');

        if (!userId || !chatUserId) {
            return NextResponse.json({ error: 'User ID and Chat User ID are required' }, { status: 400 });
        }

        // Don't allow deleting TARA
        if (chatUserId === 'tara-ai') {
            return NextResponse.json({ error: 'Cannot delete TARA AI' }, { status: 400 });
        }

        const client = await clientPromise;
        const db = client.db('tara'); // Same database as User model
        const collection = db.collection('users');

        // Remove user from chatUsers array
        await collection.updateOne(
            { firebaseUid: userId },
            {
                $pull: { chatUsers: { id: chatUserId } },
                $set: { lastUpdated: new Date() }
            }
        );

        return NextResponse.json({
            success: true,
            message: 'Chat user deleted successfully'
        });

    } catch (error) {
        console.error('Delete Chat User Error:', error);
        return NextResponse.json(
            { error: 'Failed to delete chat user' },
            { status: 500 }
        );
    }
}
