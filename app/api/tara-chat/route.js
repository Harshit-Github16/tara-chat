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
        const usersCollection = db.collection('users');

        // Get user's chat history with TARA
        const userChat = await collection.findOne({ userId: userId });
        const chatHistory = userChat?.messages || [];

        // Get user's latest mood from users collection
        const user = await usersCollection.findOne({ _id: new ObjectId(userId) });
        const latestMood = user?.moods && user.moods.length > 0
            ? user.moods[user.moods.length - 1]
            : null;

        // Add user's new message to history
        const userMessage = {
            id: new ObjectId().toString(),
            content: message,
            sender: 'user',
            timestamp: new Date()
        };

        // Create mood-aware system prompt
        let systemPrompt = `You are TARA (Talk, Align, Reflect, Act), a compassionate AI mental wellness companion. You provide emotional support, mindfulness guidance, and mental health resources. 

CRITICAL: Keep responses VERY SHORT - maximum 1 sentence or 10-15 words. Be conversational, not explanatory.

Examples:
User: "hii"
You: "Hey! How's it going? 😊"

User: "I'm stressed"
You: "I hear you. What's up? 🥺"

User: "I'm happy"
You: "That's great! What happened? 💛"

Remember the conversation context and provide personalized responses based on the user's previous messages.`;

        // Add mood context if available and this is the first message
        if (latestMood && chatHistory.length === 0) {
            const moodContext = {
                'happy': `The user is feeling happy and positive. Start with an uplifting greeting that acknowledges their good mood and encourages them to share what's making them feel great.`,
                'sad': `The user is feeling sad. Start with a gentle, empathetic greeting that shows you understand they're going through a difficult time and you're here to listen without judgment.`,
                'anxious': `The user is feeling anxious. Start with a calming, reassuring greeting that acknowledges their anxiety and offers support. Let them know it's okay to feel this way.`,
                'angry': `The user is feeling angry. Start with a validating greeting that acknowledges their feelings are valid and you're here to help them process these emotions constructively.`,
                'stressed': `The user is feeling stressed. Start with a supportive greeting that recognizes their stress and offers to help them find ways to manage it.`,
                'calm': `The user is feeling calm. Start with a peaceful greeting that honors their state of tranquility and encourages them to share what's on their mind.`,
                'excited': `The user is feeling excited. Start with an enthusiastic greeting that matches their energy and invites them to share what's exciting them.`,
                'tired': `The user is feeling tired. Start with a gentle, understanding greeting that acknowledges their fatigue and offers support.`,
                'confused': `The user is feeling confused. Start with a clear, supportive greeting that offers to help them work through their confusion.`,
                'grateful': `The user is feeling grateful. Start with a warm greeting that celebrates their gratitude and invites them to share what they're thankful for.`
            };

            const moodPrompt = moodContext[latestMood.mood] || moodContext['calm'];
            systemPrompt += ` IMPORTANT: This is the user's first message. ${moodPrompt} Keep your greeting brief, warm, and inviting (2-3 sentences max).`;
        }

        // Prepare messages for Grok API (include chat history for context)
        const groqMessages = [
            {
                role: 'system',
                content: systemPrompt
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
                model: 'llama-3.3-70b-versatile',
                messages: groqMessages,
                max_tokens: 50, // Very short responses
                temperature: 0.9,
                top_p: 0.95,
                stop: ['\n\n', '\n', 'User:', 'TARA:', '।।'], // Stop at line breaks
            }),
        });

        if (!groqResponse.ok) {
            throw new Error(`Grok API error: ${groqResponse.status}`);
        }

        const groqData = await groqResponse.json();
        let taraReply = groqData.choices[0]?.message?.content || "I'm here to help. Could you tell me more about how you're feeling?";

        // Ensure response ends at a complete sentence
        taraReply = taraReply.trim();
        const lastChar = taraReply[taraReply.length - 1];
        const sentenceEnders = ['.', '!', '?', '।', '॥']; // Including Hindi sentence enders

        if (!sentenceEnders.includes(lastChar)) {
            // Find the last complete sentence
            let lastSentenceEnd = -1;
            for (let i = taraReply.length - 1; i >= 0; i--) {
                if (sentenceEnders.includes(taraReply[i])) {
                    lastSentenceEnd = i;
                    break;
                }
            }

            // If we found a sentence ending, cut there
            if (lastSentenceEnd > 0) {
                taraReply = taraReply.substring(0, lastSentenceEnd + 1).trim();
            }
        }

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