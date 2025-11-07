import { NextResponse } from 'next/server';
import clientPromise from '../../../lib/mongodb';
import { ObjectId } from 'mongodb';

const GROQ_API_KEY = process.env.GROQ_API_KEY;
const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';

export async function POST(request) {
    try {
        const { userId, message } = await request.json();

        if (!userId || !message) {
            return NextResponse.json({ error: 'User ID and message are required' }, { status: 400 });
        }

        if (!GROQ_API_KEY) {
            return NextResponse.json({ error: 'GROQ API key not configured' }, { status: 500 });
        }

        const client = await clientPromise;
        const db = client.db('Cluster0');
        const collection = db.collection('tara_chats');

        // Get user's chat history with TARA
        const userChat = await collection.findOne({ userId: userId });
        const chatHistory = userChat?.messages || [];

        // Add user's new message to history
        const userMessage = {
            id: new ObjectId().toString(),
            content: message,
            sender: 'user',
            timestamp: new Date()
        };

        // Prepare messages for Grok API (include chat history for context)
        const groqMessages = [
            {
                role: 'system',
                content: `You are TARA, a compassionate AI mental wellness companion. You provide emotional support, mindfulness guidance, and mental health resources. Keep responses warm, empathetic, and helpful. Remember the conversation context and provide personalized responses based on the user's previous messages.`
            },
            // Include recent chat history for context (last 10 messages)
            ...chatHistory.slice(-10).map(msg => ({
                role: msg.sender === 'user' ? 'user' : 'assistant',
                content: msg.content
            })),
            {
                role: 'user',
                content: message
            }
        ];

        // Call Grok API
        const groqResponse = await fetch(GROQ_API_URL, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${GROQ_API_KEY}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                model: 'llama3-8b-8192',
                messages: groqMessages,
                max_tokens: 500,
                temperature: 0.7,
            }),
        });

        if (!groqResponse.ok) {
            throw new Error(`Grok API error: ${groqResponse.status}`);
        }

        const groqData = await groqResponse.json();
        const taraReply = groqData.choices[0]?.message?.content || "I'm here to help. Could you tell me more about how you're feeling?";

        // Create TARA's response message
        const taraMessage = {
            id: new ObjectId().toString(),
            content: taraReply,
            sender: 'tara',
            timestamp: new Date()
        };

        // Update chat history in database
        const updatedMessages = [...chatHistory, userMessage, taraMessage];

        await collection.updateOne(
            { userId: userId },
            {
                $set: {
                    userId: userId,
                    messages: updatedMessages,
                    lastUpdated: new Date()
                }
            },
            { upsert: true }
        );

        return NextResponse.json({
            success: true,
            userMessage,
            taraMessage,
            chatHistory: updatedMessages
        });

    } catch (error) {
        console.error('TARA Chat API Error:', error);
        return NextResponse.json(
            { error: 'Failed to process chat message' },
            { status: 500 }
        );
    }
}

export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url);
        const userId = searchParams.get('userId');

        if (!userId) {
            return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
        }

        const client = await clientPromise;
        const db = client.db('Cluster0');
        const collection = db.collection('tara_chats');

        // Get user's chat history with TARA
        const userChat = await collection.findOne({ userId: userId });
        const messages = userChat?.messages || [];

        return NextResponse.json({
            success: true,
            messages
        });

    } catch (error) {
        console.error('Get TARA Chat Error:', error);
        return NextResponse.json(
            { error: 'Failed to fetch chat history' },
            { status: 500 }
        );
    }
}