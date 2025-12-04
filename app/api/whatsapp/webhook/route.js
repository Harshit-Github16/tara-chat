import { NextResponse } from 'next/server';
import clientPromise from '../../../../lib/mongodb';
import { sendWhatsAppMessage } from '../../../../lib/twilio';

// Helper function to get or create user from WhatsApp number
async function getOrCreateWhatsAppUser(whatsappNumber, userName) {
    const client = await clientPromise;
    const db = client.db('tara');
    const collection = db.collection('users');

    // Clean WhatsApp number (remove 'whatsapp:' prefix)
    const cleanNumber = whatsappNumber.replace('whatsapp:', '');

    // Try to find existing user by WhatsApp number
    let user = await collection.findOne({ whatsappNumber: cleanNumber });

    if (!user) {
        // Create new user for WhatsApp
        const newUser = {
            whatsappNumber: cleanNumber,
            name: userName || 'WhatsApp User',
            createdAt: new Date(),
            lastUpdated: new Date(),
            chatUsers: [
                {
                    id: 'tara-ai',
                    name: 'TARA AI',
                    avatar: '/taralogo.jpg',
                    type: 'ai',
                    role: 'ai',
                    conversations: [],
                    createdAt: new Date(),
                    lastMessageAt: new Date()
                }
            ],
            moods: [],
            journals: []
        };

        const result = await collection.insertOne(newUser);
        user = { ...newUser, _id: result.insertedId, firebaseUid: result.insertedId.toString() };
    }

    return user;
}

// POST handler for incoming WhatsApp messages
export async function POST(request) {
    try {
        console.log('=== WhatsApp Webhook Called ===');

        // Parse form data from Twilio
        const formData = await request.formData();
        const body = Object.fromEntries(formData);

        console.log('Webhook body:', body);

        const {
            From: from,
            To: to,
            Body: messageBody,
            ProfileName: profileName
        } = body;

        if (!from || !messageBody) {
            console.error('Missing required fields');
            return new NextResponse('Missing required fields', { status: 400 });
        }

        console.log(`Message from ${from} (${profileName}): ${messageBody}`);

        // Get or create user
        const user = await getOrCreateWhatsAppUser(from, profileName);
        console.log('User found/created:', user.whatsappNumber);

        // Call your existing chat API
        const chatResponse = await fetch(`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/chat`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                userId: user.firebaseUid || user._id.toString(),
                chatUserId: 'tara-ai',
                message: messageBody,
                userDetails: {
                    name: user.name || profileName,
                    gender: user.gender,
                    ageRange: user.ageRange,
                    profession: user.profession,
                    interests: user.interests,
                    personalityTraits: user.personalityTraits
                }
            })
        });

        if (!chatResponse.ok) {
            throw new Error('Chat API failed');
        }

        const chatData = await chatResponse.json();
        const taraReply = chatData.aiMessage.content;

        console.log('TARA Reply:', taraReply);

        // Send reply via Twilio WhatsApp
        await sendWhatsAppMessage(from, taraReply);

        console.log('Reply sent successfully');

        // Return TwiML response (required by Twilio)
        return new NextResponse(
            '<?xml version="1.0" encoding="UTF-8"?><Response></Response>',
            {
                status: 200,
                headers: {
                    'Content-Type': 'text/xml'
                }
            }
        );

    } catch (error) {
        console.error('WhatsApp Webhook Error:', error);
        return new NextResponse(
            '<?xml version="1.0" encoding="UTF-8"?><Response></Response>',
            {
                status: 200,
                headers: {
                    'Content-Type': 'text/xml'
                }
            }
        );
    }
}

// GET handler for webhook verification
export async function GET(request) {
    return NextResponse.json({
        status: 'WhatsApp webhook is active',
        timestamp: new Date().toISOString()
    });
}
