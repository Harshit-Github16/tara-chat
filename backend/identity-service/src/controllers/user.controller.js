const { getDb } = require('../config/db');
const { ObjectId } = require('mongodb');

// Note: This controller handles "Chat Users" logic from api/users/route.js.
// It seems api/users endpoint was actually for Chat Users management, not general user profile.
// But we should place it in Identity or AI? It feels like Identity (User Profile Data).

const userController = {
    // GET /api/user/chat-users
    getChatUsers: async (req, res) => {
        try {
            const { userId } = req.query;

            if (!userId) {
                return res.status(400).json({ error: 'User ID is required' });
            }

            const db = getDb();
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

                // If userData doesn't exist at all, we might need to handle it?
                // But the original code assumed updateOne with upsert=true would handle it.
                // But here we are just managing chatUsers. If User doesn't exist, we probably shouldn't create a blank one just for chatUsers?
                // The original code uses upsert=true.

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

                return res.json({
                    success: true,
                    chatUsers: [defaultTara]
                });
            }

            res.json({
                success: true,
                chatUsers: userData.chatUsers || []
            });

        } catch (error) {
            console.error('Get Chat Users Error:', error);
            res.status(500).json({ error: 'Failed to fetch chat users' });
        }
    },

    // POST /api/user/chat-users
    addChatUser: async (req, res) => {
        try {
            const { userId, name, avatar, gender, role, type } = req.body;

            if (!userId || !name) {
                return res.status(400).json({ error: 'User ID and name are required' });
            }

            const db = getDb();
            const collection = db.collection('users');

            const newChatUser = {
                id: new ObjectId().toString(),
                name,
                type: type || 'custom',
                avatar: avatar || null,
                gender: gender || 'other',
                role: role || 'Chill Friend',
                conversations: [],
                createdAt: new Date(),
                lastMessageAt: new Date()
            };

            const userDoc = await collection.findOne({ firebaseUid: userId });

            if (!userDoc) {
                return res.status(404).json({ error: 'User not found. Please log in again.' });
            }

            const existingChatUser = userDoc.chatUsers?.find(u => u.id === newChatUser.id);

            if (existingChatUser) {
                return res.json({
                    success: true,
                    chatUser: existingChatUser,
                    alreadyExists: true
                });
            }

            await collection.updateOne(
                { firebaseUid: userId },
                {
                    $push: { chatUsers: newChatUser },
                    $set: { lastUpdated: new Date() }
                }
            );

            res.json({
                success: true,
                chatUser: newChatUser
            });

        } catch (error) {
            console.error('Add Chat User Error:', error);
            res.status(500).json({ error: 'Failed to add chat user' });
        }
    },

    // DELETE /api/user/chat-users
    deleteChatUser: async (req, res) => {
        try {
            const { userId, chatUserId } = req.query;

            if (!userId || !chatUserId) {
                return res.status(400).json({ error: 'User ID and Chat User ID are required' });
            }

            if (chatUserId === 'tara-ai') {
                return res.status(400).json({ error: 'Cannot delete TARA AI' });
            }

            const db = getDb();
            const collection = db.collection('users');

            await collection.updateOne(
                { firebaseUid: userId },
                {
                    $pull: { chatUsers: { id: chatUserId } },
                    $set: { lastUpdated: new Date() }
                }
            );

            res.json({
                success: true,
                message: 'Chat user deleted successfully'
            });

        } catch (error) {
            console.error('Delete Chat User Error:', error);
            res.status(500).json({ error: 'Failed to delete chat user' });
        }
    },

    // GET /api/user/conversations
    getConversations: async (req, res) => {
        try {
            const { userId, chatUserId } = req.query;

            if (!userId || !chatUserId) {
                return res.status(400).json({ error: 'User ID and Chat User ID are required' });
            }

            const db = getDb();
            const collection = db.collection('users');

            const userData = await collection.findOne({ firebaseUid: userId });

            if (!userData) {
                return res.status(404).json({ error: 'User not found' });
            }

            const chatUser = userData.chatUsers?.find(u => u.id === chatUserId);

            if (!chatUser) {
                return res.json({ success: true, conversations: [] });
            }

            res.json({
                success: true,
                conversations: chatUser.conversations || []
            });

        } catch (error) {
            console.error('Get Conversations Error:', error);
            res.status(500).json({ error: 'Failed to fetch conversations' });
        }
    },

    // POST /api/user/conversations
    saveConversation: async (req, res) => {
        try {
            const { userId, chatUserId, message, sender, type } = req.body;

            if (!userId || !chatUserId || !message) {
                return res.status(400).json({ error: 'User ID, Chat User ID and message are required' });
            }

            const db = getDb();
            const collection = db.collection('users');

            const newMessage = {
                id: new ObjectId().toString(),
                content: message,
                sender: sender || 'user',
                type: type || 'text',
                timestamp: new Date()
            };

            await collection.updateOne(
                { firebaseUid: userId, "chatUsers.id": chatUserId },
                {
                    $push: { "chatUsers.$.conversations": newMessage },
                    $set: { "chatUsers.$.lastMessageAt": new Date() }
                }
            );

            res.json({
                success: true,
                message: newMessage
            });

        } catch (error) {
            console.error('Save Conversation Error:', error);
            res.status(500).json({ error: 'Failed to save conversation' });
        }
    }
};

module.exports = userController;
