import { NextResponse } from 'next/server';
import clientPromise from '../../../lib/mongodb';
import { ObjectId } from 'mongodb';
import {
    preprocessMessage,
    detectIntentAndEmotion,
    selectStrategy,
    buildPrompt,
    safetyFilter,
    toneChecker,
    getCrisisResponse
} from '../../lib/tara-pipeline';

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
        // Users collection might be used for fetching user name or deeper profile later
        // const usersCollection = db.collection('users');

        // 1. Fetch Context (Memory)
        const userChat = await collection.findOne({ userId: userId });
        const chatHistory = userChat?.messages || [];

        // Simple Memory Object (STM) - Last few turns
        const stm = {
            recentAttempts: chatHistory.slice(-3),
            lastIntent: chatHistory.length > 0 ? chatHistory[chatHistory.length - 1].intent : null
        };

        // 2. Pre-processing
        const preprocessed = preprocessMessage(message);
        console.log("Preprocessed:", preprocessed);

        // 3. Intent & Emotion Detection
        // Using chatHistory for context could be added to the prompt inside detectIntentAndEmotion if needed
        const intentData = await detectIntentAndEmotion(preprocessed, GROQ_API_KEY, chatHistory);
        console.log("Intent Data:", intentData);

        // 4. Crisis Override Check (Immediate)
        if (intentData.intent === 'crisis' || preprocessed.crisis_flag !== 'none') {
            const crisisLevel = preprocessed.crisis_flag === 'immediate' ? 'immediate' : 'likely';
            const crisisResponseText = getCrisisResponse(crisisLevel);

            // Save and Return immediately
            const taraMessage = {
                id: new ObjectId().toString(),
                content: crisisResponseText,
                sender: 'tara',
                timestamp: new Date(),
                intent: 'crisis',
                emotion: intentData.primary_emotion || 'anxiety'
            };
            const userMessageObj = {
                id: new ObjectId().toString(),
                content: message,
                sender: 'user',
                timestamp: new Date()
            };

            await collection.updateOne(
                { userId: userId },
                { $set: { messages: [...chatHistory, userMessageObj, taraMessage], lastUpdated: new Date() } },
                { upsert: true }
            );

            return NextResponse.json({
                success: true,
                userMessage: userMessageObj,
                taraMessage: taraMessage,
                chatHistory: [...chatHistory, userMessageObj, taraMessage]
            });
        }

        // 5. Strategy Selection
        const strategyData = selectStrategy(intentData, stm, preprocessed);
        console.log("Strategy:", strategyData);

        // 6. Prompt Builder
        const prompt = buildPrompt(strategyData, intentData, preprocessed, stm);

        // 7. LLM Response Generation
        const groqMessages = [
            { role: 'system', content: prompt }
            // Note: detailed chat history is not passed in the prompt builder as per "Safe Memory" rule
            // The prompt builder relied on specialized Context block. 
        ];

        const groqResponse = await fetch(GROQ_API_URL, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${GROQ_API_KEY}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                model: 'llama-3.3-70b-versatile',
                messages: groqMessages,
                max_tokens: 150,
                temperature: 0.7, // Warmer
            }),
        });

        if (!groqResponse.ok) throw new Error(`Groq API error: ${groqResponse.status}`);
        const groqData = await groqResponse.json();
        let rawResponse = groqData.choices[0]?.message?.content || "I'm here with you.";

        // 8. Safety Filter
        let safeResponse = safetyFilter(rawResponse, strategyData, preprocessed);

        // 9. Tone Checker
        // Ensure intentData has primary_emotion, fallback to 'neutral' if missing
        if (!intentData.primary_emotion) intentData.primary_emotion = 'neutral';
        let finalResponse = toneChecker(safeResponse, intentData);

        // 10. Save to DB
        const userMessageObj = {
            id: new ObjectId().toString(),
            content: message,
            sender: 'user',
            timestamp: new Date()
        };

        const taraMessage = {
            id: new ObjectId().toString(),
            content: finalResponse,
            sender: 'tara',
            timestamp: new Date(),
            intent: intentData.intent,
            emotion: intentData.primary_emotion
        };

        const updatedMessages = [...chatHistory, userMessageObj, taraMessage];

        await collection.updateOne(
            { userId: userId },
            {
                $set: {
                    messages: updatedMessages,
                    lastUpdated: new Date()
                }
            },
            { upsert: true }
        );

        return NextResponse.json({
            success: true,
            userMessage: userMessageObj,
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