import { NextResponse } from "next/server";
import clientPromise from "../../../lib/mongodb";
import { verifyToken } from "../../../lib/jwt";

const GROQ_API_KEY = process.env.GROQ_API_KEY;
const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';

// GET - Analyze journals and extract mood triggers
export async function GET(req) {
    try {
        // Get authorization header
        const authHeader = req.headers.get('authorization');
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return NextResponse.json({ error: 'No token provided' }, { status: 401 });
        }

        const token = authHeader.split(' ')[1];
        const decoded = verifyToken(token);

        if (!decoded) {
            return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
        }

        const userId = decoded.firebaseUid || decoded.userId;

        // Connect to MongoDB
        const client = await clientPromise;
        const db = client.db('tara');
        const users = db.collection('users');

        // Get user with journals and moods
        const user = await users.findOne(
            { firebaseUid: userId },
            { projection: { journals: 1, moods: 1, chatUsers: 1 } }
        );

        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        // Check if user has enough data (at least 7 days of journals or chats)
        const journals = user.journals || [];
        const moods = user.moods || [];
        const chatUsers = user.chatUsers || [];

        // Count unique days with activity
        const uniqueDays = new Set();

        journals.forEach(j => {
            if (j.date) uniqueDays.add(j.date);
        });

        moods.forEach(m => {
            if (m.date) uniqueDays.add(m.date);
        });

        chatUsers.forEach(chatUser => {
            const conversations = chatUser.conversations || [];
            conversations.forEach(msg => {
                const msgDate = new Date(msg.timestamp).toISOString().split('T')[0];
                uniqueDays.add(msgDate);
            });
        });

        const daysCount = uniqueDays.size;

        if (daysCount < 7) {
            return NextResponse.json({
                success: true,
                hasEnoughData: false,
                daysCount,
                triggers: []
            });
        }

        // Analyze journals and moods to extract triggers
        const triggers = await analyzeMoodTriggers(journals, moods, chatUsers);

        return NextResponse.json({
            success: true,
            hasEnoughData: true,
            daysCount,
            triggers
        });

    } catch (error) {
        console.error('Mood Triggers API: Error:', error);
        return NextResponse.json({ error: 'Failed to fetch mood triggers' }, { status: 500 });
    }
}

async function analyzeMoodTriggers(journals, moods, chatUsers) {
    try {
        // Prepare data for AI analysis
        const journalTexts = journals
            .filter(j => j.content)
            .slice(-30) // Last 30 journals
            .map(j => `Date: ${j.date}\nContent: ${j.content}`)
            .join('\n\n');

        const moodPatterns = moods
            .slice(-30) // Last 30 moods
            .map(m => `Date: ${m.date}, Mood: ${m.mood}, Intensity: ${m.intensity || 3}`)
            .join('\n');

        // Extract recent chat topics
        const recentTopics = [];
        chatUsers.forEach(chatUser => {
            const conversations = chatUser.conversations || [];
            conversations.slice(-20).forEach(msg => {
                if (msg.sender === 'user' && msg.content) {
                    recentTopics.push(msg.content);
                }
            });
        });

        const chatContext = recentTopics.slice(-30).join('\n');

        if (!journalTexts && !moodPatterns && !chatContext) {
            return getDefaultTriggers();
        }

        const prompt = `You are an AI psychologist analyzing a user's emotional patterns.

Based on the following data, identify the TOP 5 mood triggers that most impact this person's emotional state.

JOURNAL ENTRIES:
${journalTexts || 'No journal data'}

MOOD PATTERNS:
${moodPatterns || 'No mood data'}

RECENT CHAT TOPICS:
${chatContext || 'No chat data'}

Analyze and return EXACTLY 5 mood triggers in this JSON format:
[
  {
    "name": "Trigger name (2-3 words)",
    "description": "Brief description (5-8 words)",
    "impact": 85,
    "emoji": "😰"
  }
]

Rules:
- Impact should be 0-100 (higher = stronger trigger)
- Use relevant emojis (😰 for stress, 😔 for loneliness, 💼 for work, 👥 for social, 😴 for sleep, etc.)
- Focus on REAL patterns from the data
- Be specific and actionable
- Order by impact (highest first)

Return ONLY the JSON array, no other text.`;

        const groqResponse = await fetch(GROQ_API_URL, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${GROQ_API_KEY}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                model: 'llama-3.3-70b-versatile',
                messages: [{ role: 'user', content: prompt }],
                temperature: 0.3,
                max_tokens: 500
            }),
        });

        if (!groqResponse.ok) {
            console.error('Groq API failed');
            return getDefaultTriggers();
        }

        const groqData = await groqResponse.json();
        let responseText = groqData.choices[0]?.message?.content || '';

        // Clean and parse JSON
        responseText = responseText.trim();

        // Remove markdown code blocks if present
        if (responseText.startsWith('```')) {
            responseText = responseText.replace(/```json\n?/g, '').replace(/```\n?/g, '');
        }

        const triggers = JSON.parse(responseText);

        // Validate and ensure we have 5 triggers
        if (Array.isArray(triggers) && triggers.length > 0) {
            return triggers.slice(0, 5).map(t => ({
                name: t.name || 'Unknown Trigger',
                description: t.description || 'Affects your mood',
                impact: Math.min(100, Math.max(0, t.impact || 50)),
                emoji: t.emoji || '💭'
            }));
        }

        return getDefaultTriggers();

    } catch (error) {
        console.error('Error analyzing mood triggers:', error);
        return getDefaultTriggers();
    }
}

function getDefaultTriggers() {
    return [
        {
            name: "Work Stress",
            description: "Job pressure and deadlines",
            impact: 75,
            emoji: "💼"
        },
        {
            name: "Sleep Quality",
            description: "Rest and sleep patterns",
            impact: 65,
            emoji: "😴"
        },
        {
            name: "Social Connection",
            description: "Time with friends and family",
            impact: 60,
            emoji: "👥"
        },
        {
            name: "Physical Activity",
            description: "Exercise and movement",
            impact: 50,
            emoji: "🏃"
        },
        {
            name: "Self-Care",
            description: "Personal time and relaxation",
            impact: 45,
            emoji: "🧘"
        }
    ];
}
