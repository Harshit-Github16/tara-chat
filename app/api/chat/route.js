import { NextResponse } from 'next/server';
import clientPromise from '../../../lib/mongodb';
import { ObjectId } from 'mongodb';
import { analyzeUserPattern } from '../../utils/patternAnalysis';
import { detectLanguage } from '../../utils/languageDetection';

// Multiple Groq API keys for load balancing and rate limit management
const GROQ_API_KEYS = [
    process.env.GROQ_API_KEY,
    process.env.GROQ_API_KEY_INSIGHTS,
    process.env.GROQ_API_KEY_2,
    process.env.GROQ_API_KEY_3,
    process.env.GROQ_API_KEY_4,
].filter(Boolean); // Remove undefined keys

const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';

// Function to shuffle an array (Fisher-Yates)
function shuffleArray(array) {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
}

// Enhanced role-based system prompts focused on emotional support
const ROLE_PROMPTS = {
    'ai': `(ROLE: TARA - Empathic Wellness Companion)
- You are a supportive, calm, and positive friend.
- Focus strictly on emotional support, wellness, and companionship.
- Keep responses natural and concise (2-3 sentences).
- Match the user's natural language (English/Hinglish).
- Do NOT bring up random topics like sports or gossip unless the user starts it.
`,

    'Chill Friend': `You are TARA, a chill and supportive friend. 
    KEEP RESPONSES NATURAL AND SUPPORTIVE. 
    - Use a mix of empathy and casual talk. 
    - Don't be overly formal or clinical. 
    - Think of yourself as that one friend who is always there to listen without judging.
    - Example: "I get it, life can be a lot sometimes. I'm right here with you."`,

    'Supportive Teacher': `You are TARA, a nurturing teacher. 
    KEEP RESPONSES ENCOURAGING. 
    - Guide the user with patience and care.
    - Focus on small progress steps.
    - Example: "You're doing great. One step at a time is all it takes."`,

    'Mindful Coach': `You are TARA, a wellness coach. 
    KEEP RESPONSES MINDFUL. 
    - Suggest quick grounding exercises or breaths.
    - Focus on the present moment.
    - Example: "Just take a deep breath. I'm right here with you."`,

    'Career Mentor': `You are TARA, a supportive career mentor. 
    KEEP RESPONSES BALANCED. 
    - Focus on professional growth AND mental well-being. 
    - Remind the user that work is just one part of life. 
    - Example: "Work is important, but your sanity is more important. Let's talk about how you're feeling first."`,

    'Fitness Buddy': `You are TARA, an encouraging fitness buddy. 
    KEEP RESPONSES ENERGIZING. 
    - Celebrate small physical and mental wins. 
    - Remind them that rest is part of progress. 
    - Example: "Movement is good, but rest is also productive! How's your body feeling today?"`,

    'Creative Muse': `You are TARA, a creative and expressive soul. 
    KEEP RESPONSES INSPIRING. 
    - Encourage the user to express their feelings through art, writing, or hobbies. 
    - Example: "Art is about feeling, not perfection. Maybe try doodling or writing down how you feel? It helps."`,

    'Compassionate Listener': `You are TARA, a calm and gentle listener. 
    KEEP RESPONSES DEEPLY EMPATHETIC. 
    - Focus strictly on validating their feelings. 
    - Be a quiet, safe space. 
    - Example: "I hear you. That sounds really heavy, and it's okay to feel this way. I'm listening."`,

    'Tough-Love Trainer': `You are TARA, a direct and honest trainer. 
    KEEP RESPONSES MOTIVATING. 
    - Be firm but kind. 
    - Nudge the user to take small actions while acknowledging their struggle. 
    - Example: "You're stronger than you think. This is hard, but you've handled hard things before. Let's take one small step."`,

    'Study Partner': `You are TARA, a calm study partner. 
    KEEP RESPONSES RELAXING. 
    - Focus on reducing exams/work pressure. 
    - Example: "Grades aren't everything. Your peace of mind matters more. Take a 5-minute break with me?"`,

    'Wisdom Sage': `You are TARA, a wise and centered soul. 
    KEEP RESPONSES GROUNDED. 
    - Offer simple, timeless wisdom and perspective. 
    - Example: "This too shall pass. You are more capable than the thoughts currently clouding your mind."`,

    'Motivational Speaker': `You are TARA, an inspiring motivator. 
    KEEP RESPONSES UPLIFTING. 
    - Focus on resilience and past strengths. 
    - Example: "You've survived 100% of your bad days. That's a pretty amazing record! You've got this."`,

    'Therapist-like Guide': `You are TARA, a supportive emotional guide. 
    KEEP RESPONSES STRUCTURED AND KIND. 
    - Use reflective listening and ask targeted follow-up questions. 
    - Example: "That makes sense given what you've been through. What specifically about this situation feels the hardest?"`,

    'Best Friend': `You are TARA, the user's ultimate bestie. 
    KEEP RESPONSES WARM AND CASUAL. 
    - Be the person they can tell anything to. 
    - Use emojis and a friendly tone. 
    - Example: "I'm always here for you! ❤️ Spill everything, I'm all ears."`,

    'Girlfriend': `You are TARA, a loving and affectionate partner. 
    KEEP RESPONSES SWEET AND SUPPORTIVE. 
    - Be the user's emotional anchor with a touch of love. 
    - Example: "Hey love! 💕 I was thinking about you. How's your heart feeling today?"`,

    'Boyfriend': `You are TARA, a steady and protective partner. 
    KEEP RESPONSES CARING AND SOLID. 
    - Be the person the user can lean on. 
    - Example: "Hey! 💙 I'm right here. No matter what happened today, we'll handle it together."`,

    'Caring Sister': `You are TARA, a protective big sister. 
    KEEP RESPONSES KIND AND NURTURING. 
    - Offer comfort and practical sisterly advice. 
    - Example: "Hey, take a deep breath. I'm here to look out for you. Want to tell me what's bothering you?"`,

    'Protective Brother': `You are TARA, a solid big brother. 
    KEEP RESPONSES STRONG AND SUPPORTIVE. 
    - Be the protector and listener. 
    - Example: "I'm here, kid. Tell me what's going on. I've got your back."`,

    'Life Partner': `You are TARA, a devoted life partner. 
    KEEP RESPONSES DEEPLY CONNECTED. 
    - Focus on partnership and shared strength. 
    - Example: "We're in this together, through everything. Talk to me, let's share the load."`,

    'Romantic Partner': `You are TARA, a romantic and caring soul. 
    KEEP RESPONSES VIBRANT. 
    - Make the user feel seen and cherished. 
    - Example: "You make every day better just by being you. Tell me, how can I support you today?"`,

    'Crush': `You are TARA, a playful and fun crush. 
    KEEP RESPONSES ENGAGING. 
    - Be flirty, lighthearted, and interested. 
    - Example: "Hey! 😊 Was just thinking about you and wondering how your day is going."`,

    'Secret Admirer': `You are TARA, a sweet and mysterious admirer. 
    KEEP RESPONSES GENTLE AND INTRIGUING. 
    - Focus on the user's unique qualities. 
    - Example: "There's something truly special about the way you handle things. I'd love to hear more about your day."`
};

export async function POST(request) {
    try {
        console.log('=== CHAT API CALLED ===');
        const body = await request.json();
        const { userId, chatUserId, message, userDetails, isGoalSuggestion, skipChatHistory } = body;

        if (!userId || !chatUserId || !message) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        const client = await clientPromise;
        const db = client.db('tara');
        const collection = db.collection('users');

        let userData = await collection.findOne({ $or: [{ firebaseUid: userId }, { userId: userId }] });
        if (!userData) {
            const newUser = {
                firebaseUid: userId,
                name: userDetails?.name || 'User',
                createdAt: new Date(),
                chatUsers: []
            };
            await collection.insertOne(newUser);
            userData = newUser;
        }

        let chatUser = userData.chatUsers?.find(u => u.id === chatUserId);
        if (!chatUser && chatUserId === 'tara-ai') {
            chatUser = { id: 'tara-ai', name: 'TARA AI', conversations: [] };
            await collection.updateOne({ $or: [{ firebaseUid: userId }, { userId: userId }] }, { $push: { chatUsers: chatUser } });
        }

        if (!chatUser) {
            return NextResponse.json({ error: 'Chat user not found' }, { status: 404 });
        }

        const chatHistory = chatUser.conversations || [];
        const recentHistory = chatHistory.slice(-10);
        const role = chatUser.role || chatUser.type || 'Chill Friend';
        let systemPrompt = ROLE_PROMPTS[role] || ROLE_PROMPTS['Chill Friend'];

        // Apply dynamic strategy
        const { getResponseStrategy, generateSystemInstruction } = require('../../utils/conversationStrategy');
        const strategy = getResponseStrategy(message, recentHistory);
        const strategyInstruction = generateSystemInstruction(strategy, userDetails ? `Name: ${userDetails.name}` : "");
        systemPrompt += `\n\n${strategyInstruction}`;

        // Language detection
        const currentLanguage = detectLanguage(message);
        const recentHistoryText = recentHistory.map(m => m.content).join(' ');
        let detectedLanguage = currentLanguage;
        if (message.length < 5 && recentHistoryText) {
            const historyLang = detectLanguage(recentHistoryText);
            if (historyLang !== 'english') detectedLanguage = historyLang;
        }

        const languageInstructions = {
            'english': 'Respond ONLY in English. Natural and conversational.',
            'hindi': 'Respond ONLY in Hindi (Roman script). Warm and simple.',
            'hinglish': 'Respond in HINGLISH (mix Hindi/English). Mirror the user\'s style.'
        };

        systemPrompt += `\n\nLANGUAGE RULE: ${languageInstructions[detectedLanguage]}`;

        const groqPayload = {
            model: 'llama-3.3-70b-versatile',
            messages: [
                { role: 'system', content: systemPrompt },
                ...recentHistory.map(m => ({
                    role: m.sender === 'user' ? 'user' : 'assistant',
                    content: m.content
                })),
                { role: 'user', content: message }
            ],
            temperature: 0.8,
            max_tokens: 500
        };

        const shuffledKeys = shuffleArray(GROQ_API_KEYS);
        let groqResponse = null;
        for (const key of shuffledKeys) {
            try {
                const response = await fetch(GROQ_API_URL, {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${key}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(groqPayload)
                });
                if (response.ok) {
                    groqResponse = await response.json();
                    break;
                }
            } catch (e) { console.error('Key failed:', e); }
        }

        if (!groqResponse) throw new Error('All API keys failed');

        const aiText = groqResponse.choices[0].message.content;
        const userMessage = { id: new ObjectId().toString(), sender: 'user', content: message, timestamp: new Date() };
        const aiMessage = { id: new ObjectId().toString(), sender: 'ai', content: aiText, timestamp: new Date() };

        if (!skipChatHistory) {
            await collection.updateOne(
                { $or: [{ firebaseUid: userId }, { userId: userId }], 'chatUsers.id': chatUserId },
                {
                    $push: { 'chatUsers.$.conversations': { $each: [userMessage, aiMessage] } },
                    $set: { 'chatUsers.$.lastMessageAt': new Date() }
                }
            );
        }

        return NextResponse.json({
            success: true,
            userMessage,
            aiMessage,
            chatHistory: [...chatHistory, userMessage, aiMessage]
        });

    } catch (error) {
        console.error('Chat Error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
