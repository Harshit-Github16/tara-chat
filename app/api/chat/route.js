import { NextResponse } from 'next/server';
import clientPromise from '../../../lib/mongodb';
import { ObjectId } from 'mongodb';
import { analyzeUserPattern } from '../../utils/patternAnalysis';

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

// Function to detect language from message
function detectLanguage(message) {
    if (!message) return 'english';

    const lowerMessage = message.toLowerCase();

    // Hindi/Devanagari script detection
    const hindiPattern = /[\u0900-\u097F]/;
    if (hindiPattern.test(message)) {
        return 'hindi';
    }

    // Common Hindi/Hinglish words (including common misspellings and short forms)
    // REMOVED 'hi' because it conflicts with English greeting
    const hindiWords = [
        'hai', 'hoon', 'ho', 'hain', 'tha', 'thi', 'the', 'ka', 'ki', 'ke',
        'main', 'mein', 'aap', 'tum', 'kya', 'kaise', 'kaisa', 'kaisi',
        'nahi', 'nahin', 'haan', 'ji', 'acha', 'accha', 'theek', 'thik',
        'bahut', 'bohot', 'bht', 'bhut', 'kuch', 'koi', 'yaar', 'bhai', 'dost',
        'kar', 'karo', 'karna', 'raha', 'rahi', 'rahe', 'gaya', 'gayi', 'gaye',
        'kal', 'aaj', 'aj', 'abhi', 'phir', 'wala', 'wali', 'wale',
        'hu', 'hoon', 'khush', 'khus', 'mere', 'mre', 'mera', 'meri',
        'tera', 'tere', 'teri', 'uska', 'uske', 'uski', 'apna', 'apne', 'apni',
        'kya', 'kyu', 'kyun', 'kaise', 'kese', 'kaun', 'kon', 'kab', 'kaha', 'kha',
        'se', 'ko', 'ne', 'me', 'pe', 'par', 'or', 'aur', 'ya', 'lekin', 'magar',
        'toh', 'to', 'bhi', 'na', 'mat', 'kya', 'kuch', 'sab', 'sabhi'
    ];

    const words = lowerMessage.split(/\s+/).filter(w => w.length > 0);

    // Count exact matches only
    const hindiWordCount = words.filter(word => hindiWords.includes(word)).length;

    // Strict detection logic
    // If message is very short (1-2 words), rely on explicit hindi words ONLY if they are unambiguous
    if (words.length <= 2) {
        if (hindiWordCount >= 1 && !words.includes('hi')) return 'hinglish';
        return 'english';
    }

    // If more than 20% words are Hindi/Hinglish, consider it Hinglish
    if (hindiWordCount / words.length > 0.2) {
        return 'hinglish';
    }

    // Check for common English patterns
    const englishPattern = /^[a-z\s.,!?'"]+$/i;
    if (englishPattern.test(message)) {
        return 'english';
    }

    // Default to English if uncertain
    return 'english';
}

// Enhanced role-based system prompts focused on emotional support
const ROLE_PROMPTS = {
    'ai': `(ROLE: TARA - Friendly & Empathetic Companion)
- You are strictly a friend, not a therapist.
- Keep responses SHORT and CONVERSATIONAL (1-2 sentences).
- Use natural language (English/Hinglish) matching the user.
- Allow the injected CONVERSATION STRATEGY to guide your tone utterly.
- If the strategy says "Validate", focus ONLY on validation.
- If the strategy says "Celebrate", be high energy.
`,

    'Chill Friend': `You are a supportive, chill friend. 
    KEEP IT SHORT. 1-2 sentences max. 
    Be warm, casual, and genuine. No long lectures.`,

    'Supportive Teacher': `You are a nurturing teacher. 
    KEEP IT SHORT. Focus on encouragement. 
    "You're doing great. One step at a time."`,

    'Mindful Coach': `You are a wellness coach. 
    KEEP IT SHORT. Suggest quick, simple breaths or grounding. 
    "Just take a deep breath. I'm here."`,

    'Career Mentor': `You are a career mentor. 
    KEEP IT SHORT. Focus on balance. 
    "Work is important, but your sanity is more important."`,

    'Fitness Buddy': `You are a fitness buddy. 
    KEEP IT SHORT. Celebrate small wins. 
    "Movement is good, but rest is also productive!"`,

    'Creative Muse': `You are a creative soul. 
    KEEP IT SHORT. Encourage expression. 
    "Art is about feeling, not perfection."`,

    'Compassionate Listener': `You are a calm listener. 
    KEEP IT SHORT. Validate feelings simply. 
    "I hear you. That sounds really heavy."`,

    'Tough-Love Trainer': `You are a direct trainer. 
    KEEP IT SHORT. Push gently. 
    "You're stronger than you think. Keep going."`,

    'Study Partner': `You are a study buddy. 
    KEEP IT SHORT. Reduce pressure. 
    "Grades aren't everything. Take a break."`,

    'Wisdom Sage': `You are a wise soul. 
    KEEP IT SHORT. Offer simple wisdom. 
    "This too shall pass. You are capable."`,

    'Motivational Speaker': `You are an inspirer. 
    KEEP IT SHORT. Boost confidence. 
    "You've survived 100% of your bad days. You got this."`,

    'Therapist-like Guide': `You are a supportive guide. 
    KEEP IT SHORT. Validate and ask specific questions. 
    "That makes sense. What specifically is bothering you?"`,

    'Best Friend': `You are a bestie. 
    KEEP IT SHORT. Be casual and fun. 
    "I'm always here for you! Tell me everything."`,

    'Girlfriend': `You are a loving partner. 
    KEEP IT SHORT. Be affectionate but simple. 
    "Hey love! 💕 How was your day?"`,

    'Boyfriend': `You are a supportive partner. 
    KEEP IT SHORT. Be steady and caring. 
    "Hey love! 💙 I'm here for you."`,

    'Caring Sister': `You are a big sis. 
    KEEP IT SHORT. Be protective and kind. 
    "Hey! I've got your back. What's wrong?"`,

    'Protective Brother': `You are a big bro. 
    KEEP IT SHORT. Be solid. 
    "I'm here. Tell me what's going on."`,

    'Life Partner': `You are a life partner. 
    KEEP IT SHORT. Be deeply supportive. 
    "We're in this together. Talk to me."`,

    'Romantic Partner': `You are a romantic soul. 
    KEEP IT SHORT. Make them feel special. 
    "You make my day better. What's up?"`,

    'Crush': `You are a crush. 
    KEEP IT SHORT. Be flirty and fun. 
    "Hey! 😊 Was just thinking about you."`,

    'Secret Admirer': `You are an admirer. 
    KEEP IT SHORT. Be sweet and mysterious. 
    "There's something special about you. Tell me more?"`
};

export async function POST(request) {
    try {
        console.log('=== CHAT API CALLED ===');

        // Import JWT verification
        const { verifyToken } = await import('../../../lib/jwt');

        // Verify JWT token
        const decoded = await verifyToken(request);
        if (!decoded) {
            return NextResponse.json({
                error: 'Authentication required'
            }, { status: 401 });
        }

        const body = await request.json();
        console.log('Request body:', JSON.stringify(body, null, 2));

        const { chatUserId, message, userDetails, isGoalSuggestion, skipChatHistory } = body;

        // Use userId from JWT token instead of request body
        const userId = decoded.userId;

        if (!userId || !chatUserId || !message) {
            console.error('Missing required fields:', { userId, chatUserId, message });
            return NextResponse.json({
                error: 'Chat User ID and message are required'
            }, { status: 400 });
        }

        if (GROQ_API_KEYS.length === 0) {
            console.error('No GROQ API keys configured');
            return NextResponse.json({
                error: 'GROQ API keys not configured'
            }, { status: 500 });
        }

        console.log('All validations passed, proceeding with chat...');

        const client = await clientPromise;
        const db = client.db('tara');
        const collection = db.collection('users');

        // Get user document and find the specific chat user
        let userData = await collection.findOne({ firebaseUid: userId });

        // User should exist since they're authenticated - if not, it's an error
        if (!userData) {
            console.error('Authenticated user not found in database:', userId);
            return NextResponse.json({
                error: 'User not found. Please complete registration.'
            }, { status: 404 });
        }

        let chatUser = userData.chatUsers?.find(u => u.id === chatUserId);

        // Auto-initialize TARA AI if not found
        if (!chatUser && chatUserId === 'tara-ai') {
            console.log('Auto-initializing TARA AI for user:', userId);

            const taraAI = {
                id: 'tara-ai',
                name: 'TARA AI',
                avatar: '/taralogo.jpg',
                type: 'ai',
                role: 'ai',
                conversations: [],
                createdAt: new Date(),
                lastMessageAt: new Date()
            };

            await collection.updateOne(
                { firebaseUid: userId },
                {
                    $push: { chatUsers: taraAI },
                    $set: { lastUpdated: new Date() }
                }
            );

            chatUser = taraAI;
        }

        if (!chatUser) {
            return NextResponse.json({
                error: 'Chat user not found'
            }, { status: 404 });
        }

        // Get chat history (last 10 messages for context)
        const chatHistory = chatUser.conversations || [];
        const recentHistory = chatHistory.slice(-10);

        // Get user's latest mood for first message context
        const latestMood = userData.moods && userData.moods.length > 0
            ? userData.moods[0]
            : null;

        // Determine the role and get appropriate system prompt
        const role = chatUser.role || chatUser.type || 'Chill Friend';
        let systemPrompt = ROLE_PROMPTS[role] || ROLE_PROMPTS['Chill Friend'];

        console.log('Chat User Role:', role);
        console.log('Chat User Type:', chatUser.type);

        // --- NEW: CONVERSATION STRATEGY ANALYSIS ---
        try {
            const { getResponseStrategy, generateSystemInstruction } = require('../../utils/conversationStrategy');
            const strategy = getResponseStrategy(message);
            const strategyInstruction = generateSystemInstruction(strategy, "");

            console.log('Selected Strategy:', strategy.name);
            systemPrompt += `\n\n${strategyInstruction}`;
        } catch (e) {
            console.error("Error applying conversation strategy:", e);
        }
        // -------------------------------------------

        // Add archetype-based support orientation
        if (userData.archetype && userData.supportPreference) {
            const archetypeSupport = {
                'empathic_explorer': {
                    tone: 'gentle, reflective, and deeply validating',
                    approach: 'Create a safe space for emotional exploration. Use reflective listening and validate feelings deeply. Help them understand the "why" behind their emotions.',
                    style: 'Be patient, nurturing, and encourage self-reflection. Avoid rushing to solutions.'
                },
                'thoughtful_thinker': {
                    tone: 'logical, structured, and clear',
                    approach: 'Provide practical frameworks and step-by-step solutions. Use CBT techniques and logical reasoning. Help them organize their thoughts.',
                    style: 'Be analytical but warm. Offer structured approaches and actionable insights.'
                },
                'energetic_driver': {
                    tone: 'motivating, action-oriented, and encouraging',
                    approach: 'Focus on goals, progress, and achievements. Celebrate wins and help them push through challenges with energy and momentum.',
                    style: 'Be enthusiastic and solution-focused. Emphasize action steps and forward movement.'
                },
                'calm_stabilizer': {
                    tone: 'peaceful, grounding, and consistent',
                    approach: 'Provide stability and balance. Use calming techniques and maintain a steady, reassuring presence. Help them find inner peace.',
                    style: 'Be calm and reliable. Offer grounding exercises and maintain emotional equilibrium.'
                },
                'caring_supporter': {
                    tone: 'warm, nurturing, and compassionate',
                    approach: 'Remind them to care for themselves. Validate their caring nature while encouraging healthy boundaries and self-care.',
                    style: 'Be empathetic and supportive. Gently guide them toward self-compassion.'
                }
            };

            const supportStyle = {
                'calming_voice': 'Use soothing, peaceful language. Speak slowly and gently. Focus on creating tranquility.',
                'problem_solving': 'Provide clear, practical solutions. Break down problems into manageable steps. Be solution-focused.',
                'express_feelings': 'Create maximum space for emotional expression. Ask open-ended questions. Listen more than advise.',
                'quick_motivation': 'Be energizing and uplifting. Use motivational language. Keep responses punchy and inspiring.',
                'deep_insights': 'Explore the deeper meaning behind emotions. Ask thought-provoking questions. Help them understand patterns.'
            };

            const archetypeInfo = archetypeSupport[userData.archetype];
            const preferenceInfo = supportStyle[userData.supportPreference];

            if (archetypeInfo && preferenceInfo) {
                systemPrompt += `\n\n🎯 PERSONALIZED SUPPORT PROFILE:
User's Emotional Archetype: ${userData.archetype.replace(/_/g, ' ').toUpperCase()}
    - Tone: ${archetypeInfo.tone}
- Approach: ${archetypeInfo.approach}
- Style: ${archetypeInfo.style}

User's Preferred Support: ${userData.supportPreference.replace(/_/g, ' ').toUpperCase()}
    - ${preferenceInfo}

CRITICAL: Always maintain this support - oriented approach in EVERY response.This is how the user needs to be supported based on their emotional profile.`;
            }
        }
        // Celebrity feature temporarily disabled

        // Add mood context if this is the first message and mood exists
        if (chatHistory.length === 0 && latestMood && chatUserId === 'tara-ai') {
            const moodGreetings = {
                'happy': `The user just selected "happy" as their current mood.Start with a warm, uplifting greeting that acknowledges their positive energy.Example: "Hey! I can feel your positive energy! 😊 What's making you feel so good today?"`,
                'sad': `The user just selected "sad" as their current mood.Start with a gentle, empathetic greeting that creates a safe space.Example: "Hi there. I can sense you're going through something difficult right now. I'm here to listen, no judgment. Want to talk about it? 💙"`,
                'anxious': `The user just selected "anxious" as their current mood.Start with a calming, reassuring greeting.Example: "Hey, I'm here with you. I know anxiety can feel overwhelming. Take a deep breath with me. You're safe here. What's on your mind? 🌸"`,
                'angry': `The user just selected "angry" as their current mood.Start with a validating greeting that acknowledges their feelings.Example: "I hear you. Your anger is valid, and it's okay to feel this way. I'm here to help you process these feelings. What's got you fired up? 🔥"`,
                'stressed': `The user just selected "stressed" as their current mood.Start with a supportive, understanding greeting.Example: "I can tell you're carrying a lot right now. Stress is tough, but you don't have to handle it alone. Let's work through this together. What's weighing on you? 🌿"`,
                'calm': `The user just selected "calm" as their current mood.Start with a peaceful greeting that honors their tranquility.Example: "Hey there! I love that you're feeling calm right now. That's a beautiful space to be in. What's on your mind today? ☮️"`,
                'excited': `The user just selected "excited" as their current mood.Start with an enthusiastic greeting that matches their energy.Example: "Woohoo! I can feel your excitement! 🎉 That's amazing! What's got you so pumped up? Tell me everything!"`,
                'tired': `The user just selected "tired" as their current mood.Start with a gentle, understanding greeting.Example: "Hey, I can tell you're feeling drained. That's completely okay. Sometimes we all need to slow down. How can I support you right now? 💤"`,
                'confused': `The user just selected "confused" as their current mood.Start with a clear, supportive greeting.Example: "Hi! I can sense you're feeling a bit lost right now. That's totally normal. Let's work through this confusion together. What's on your mind? 🧭"`,
                'grateful': `The user just selected "grateful" as their current mood.Start with a warm greeting that celebrates their gratitude.Example: "Hey! I love that you're feeling grateful! 🙏 Gratitude is such a beautiful emotion. What are you thankful for today?"`
            };

            const moodGreeting = moodGreetings[latestMood.mood] || moodGreetings['calm'];
            systemPrompt += `\n\nIMPORTANT - FIRST MESSAGE: ${moodGreeting} Keep it brief, warm, and inviting(2 - 3 sentences max).Match the emotional tone of their mood.`;
        }

        // Detect if conversation is getting boring (short, unengaged responses)
        const lastUserMessages = recentHistory.filter(msg => msg.sender === 'user').slice(-3);
        const boringPatterns = ['haa', 'nhi', 'kya', 'ok', 'hmm', 'bas', 'nothing', 'kuch nhi', 'pata nhi', 'nahi', 'ha', 'na', 'theek hai', 'sab theek', 'bas bdiya'];

        // STRICTER BORING CHECK:
        // 1. Must have at least 2 recent messages
        // 2. ALL recent messages must be short/boring
        // 3. Current message MUST ALSO be short/boring (CRITICAL FIX)
        const isHistoryBoring = lastUserMessages.length >= 2 &&
            lastUserMessages.every(msg =>
                msg.content.trim().split(' ').length <= 3 ||
                boringPatterns.some(pattern => msg.content.toLowerCase().includes(pattern))
            );

        // If current message is long (>5 words), conversation is NOT boring
        const isCurrentMessageEngaging = message.trim().split(' ').length > 5;

        const isConversationBoring = isHistoryBoring && !isCurrentMessageEngaging;

        // Detect user's language from current message and recent history
        const recentUserMessages = recentHistory
            .filter(msg => msg.sender === 'user')
            .slice(-3)
            .map(msg => msg.content)
            .join(' ');

        const combinedText = `${recentUserMessages} ${message} `;
        const detectedLanguage = detectLanguage(combinedText);
        console.log('Detected language:', detectedLanguage, 'from message:', message);

        // Language instruction based on detection
        const languageInstruction = {
            'english': `🌍 CRITICAL LANGUAGE INSTRUCTION: 
The user is speaking in ENGLISH.You MUST respond ONLY in ENGLISH.
- Do NOT use Hindi or Hinglish words
    - Use proper English grammar and vocabulary
        - Keep responses natural and conversational
            - Do NOT overuse the user's name (use it sparingly, once every 4-5 messages)`,

            'hindi': `🌍 CRITICAL LANGUAGE INSTRUCTION:
The user is speaking in HINDI. You MUST respond ONLY in HINDI (Devanagari or Roman script).
- Do NOT use English words except technical terms
- Keep responses natural and conversational in Hindi
- Do NOT overuse the user's name (naam baar-baar mat lo, kabhi-kabhi use karo)
Example: "Main samajh sakti hoon. Aaj ka din kaisa raha?"`,

            'hinglish': `🌍 CRITICAL LANGUAGE INSTRUCTION - READ THIS CAREFULLY:
The user is speaking in HINGLISH (mix of Hindi and English). You MUST respond in HINGLISH ONLY.
- Mix Hindi and English naturally like they do
- Match their vocabulary and mixing style exactly
- If they use Roman Hindi (like "mre bht khush hu"), you MUST respond in Roman Hindi
- Do NOT respond in pure English - this is MANDATORY
- Do NOT overuse the user's name (naam baar-baar mat lo)

Examples:
User: "mre bht khush hu aj"
You: "Wah! Yeh sunke bahut achha laga! Kya special hua aaj jo aap itne khush ho? 😊"

User: "hii tara"
You: "Hii! Kaise ho? Aaj ka din kaisa chal raha hai?"

REMEMBER: User is speaking Hinglish, so you MUST respond in Hinglish. Pure English responses are NOT acceptable.`
        };

        // Build context about the user
        let userContext = userDetails ? `
User you're talking to:
- Name: ${userDetails.name || 'User'}
- Gender: ${userDetails.gender || 'Not specified'}
- Age: ${userDetails.ageRange || 'Not specified'}
- Profession: ${userDetails.profession || 'Not specified'}
- Interests: ${userDetails.interests?.join(', ') || 'Not specified'}
- Personality: ${userDetails.personalityTraits?.join(', ') || 'Not specified'}

IMPORTANT PERSONALIZATION RULES:
- Use this information to personalize responses
- DO NOT use their name in EVERY response (sounds robotic)
- Use name only occasionally: when starting conversation, showing empathy, or celebrating wins
- Natural conversation doesn't require constant name repetition
- Focus on emotional connection, not name repetition

${languageInstruction[detectedLanguage]}
` : languageInstruction[detectedLanguage];

        // Check if message is a simple greeting
        const isGreeting = /^(hi|hello|hey|hii|helo|namaste|hola|yo|sup)\b/i.test(message.trim());

        // If conversation is boring and user has interests, prompt TARA to bring up an interest
        // BUT NOT if the user just sent a greeting or if it's the very start
        if (!isGreeting && isConversationBoring && userDetails?.interests && userDetails.interests.length > 0 && chatUserId === 'tara-ai') {
            const randomInterest = userDetails.interests[Math.floor(Math.random() * userDetails.interests.length)];
            userContext += `\n\n🎯 IMPORTANT - ENGAGEMENT BOOST: The conversation seems flat. Bring up their interest in "${randomInterest}" naturally! Ask them something engaging about it to spark their interest. Examples:
- "Btw yaar, you mentioned you like ${randomInterest}. What's been catching your attention lately?"
- "Random question - since you're into ${randomInterest}, what's your take on [something related]?"
- "Hey, I'm curious - with your interest in ${randomInterest}, have you tried/seen/done [something specific]?"

Make it feel natural and conversational, not forced. The goal is to get them excited and talking!`;
        }

        // Build conversation history text (like old code)
        let historyText = "";
        if (recentHistory.length > 0) {
            recentHistory.forEach((msg) => {
                const speaker = msg.sender === 'user' ? (userDetails?.name || 'User') : 'TARA';
                historyText += `${speaker}: ${msg.content}\n`;
            });
        }

        // Prepare messages for Groq API (single user message with full context - like old code)
        const responseLabel = 'TARA';
        const fullPrompt = `${languageInstruction[detectedLanguage]}

${systemPrompt}

${userContext}

${historyText ? `Previous conversation:\n${historyText}` : ''}

User: ${message}
${responseLabel}:`;

        const groqMessages = [
            {
                role: 'user',
                content: fullPrompt
            }
        ];

        console.log('Calling Groq API for chat:', chatUserId, 'Role:', role);
        console.log('Message:', message);
        console.log('Recent history length:', recentHistory.length);

        // Call Groq API with better model (matching old code settings)
        const groqPayload = {
            model: 'llama-3.3-70b-versatile', // Using latest model
            messages: groqMessages,
            temperature: isGoalSuggestion ? 0.7 : 0.9, // More natural and varied
            max_tokens: isGoalSuggestion ? 500 : 60, // Balanced responses - complete sentences
            top_p: 0.95,
            stop: ['\n\n', 'User:', 'TARA:', chatUser.name + ':'], // Max 4 items for Groq API
        };

        console.log('Calling Groq API with model:', groqPayload.model);
        console.log('Groq API payload:', JSON.stringify(groqPayload, null, 2));

        console.log('Sending request to Groq API with retry mechanism...');

        // Shuffle API keys to distribute load, then try them one by one
        const shuffledKeys = shuffleArray(GROQ_API_KEYS);
        let groqResponse = null;
        let selectedApiKey = null;
        let lastError = null;

        for (let i = 0; i < shuffledKeys.length; i++) {
            selectedApiKey = shuffledKeys[i];
            const originalIndex = GROQ_API_KEYS.indexOf(selectedApiKey);
            console.log(`Attempt ${i + 1}/${shuffledKeys.length}: Using Groq API key original index #${originalIndex + 1}`);

            try {
                groqResponse = await fetch(GROQ_API_URL, {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${selectedApiKey}`,
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(groqPayload),
                });

                console.log(`Groq API response status (Key #${originalIndex + 1}):`, groqResponse.status);

                if (groqResponse.ok) {
                    console.log(`Success with Key #${originalIndex + 1}`);
                    break;
                } else {
                    const errorText = await groqResponse.text();
                    lastError = { status: groqResponse.status, text: errorText };
                    console.error(`Key #${originalIndex + 1} failed:`, errorText);

                    // If it's a 401 (Unauthorized) or 429 (Too Many Requests), definitely try next key
                    // If it's 5xx, also worth trying next key
                    if (groqResponse.status === 401 || groqResponse.status === 429 || groqResponse.status >= 500) {
                        continue;
                    } else {
                        // For other client errors (400, 404, etc.), it might be a payload issue, but we still try next key just in case
                        continue;
                    }
                }
            } catch (error) {
                console.error(`Fetch error with Key #${originalIndex + 1}:`, error.message);
                lastError = { status: 'FETCH_ERROR', text: error.message };
                continue;
            }
        }

        if (!groqResponse || !groqResponse.ok) {
            console.error('All GROQ API keys failed. Last error:', lastError);

            // Return a fallback response instead of throwing error
            console.log('Using fallback response due to all Groq API keys failure');
            const aiReply = "I'm here to listen. Tell me more about what's on your mind. 💛";

            const userMessage = {
                id: new ObjectId().toString(),
                content: message,
                sender: 'user',
                type: 'text',
                timestamp: new Date()
            };

            const aiMessage = {
                id: new ObjectId().toString(),
                content: aiReply,
                sender: 'them',
                type: 'text',
                timestamp: new Date()
            };

            if (!skipChatHistory) {
                await collection.updateOne(
                    {
                        firebaseUid: userId,
                        'chatUsers.id': chatUserId
                    },
                    {
                        $push: {
                            'chatUsers.$.conversations': {
                                $each: [userMessage, aiMessage]
                            }
                        },
                        $set: {
                            'chatUsers.$.lastMessageAt': new Date(),
                            lastUpdated: new Date()
                        }
                    }
                );
            }

            return NextResponse.json({
                success: true,
                userMessage,
                aiMessage,
                chatHistory: skipChatHistory ? chatHistory : [...chatHistory, userMessage, aiMessage],
                warning: 'Using fallback response'
            });
        }

        const groqData = await groqResponse.json();
        console.log('Groq API response data:', JSON.stringify(groqData, null, 2));

        let aiReply = groqData.choices[0]?.message?.content || "Main yahin hoon, sun rahi hoon 💛";

        // Clean up the response (like old code)
        aiReply = aiReply.trim();

        // Ensure response ends at a complete sentence
        // Check if response was cut off mid-sentence
        const lastChar = aiReply[aiReply.length - 1];
        const sentenceEnders = ['.', '!', '?', '।', '॥']; // Including Hindi sentence enders

        if (!sentenceEnders.includes(lastChar)) {
            // Find the last complete sentence
            let lastSentenceEnd = -1;
            for (let i = aiReply.length - 1; i >= 0; i--) {
                if (sentenceEnders.includes(aiReply[i])) {
                    lastSentenceEnd = i;
                    break;
                }
            }

            // If we found a sentence ending, cut there
            if (lastSentenceEnd > 0) {
                aiReply = aiReply.substring(0, lastSentenceEnd + 1).trim();
            }
        }

        // Remove any character name prefix if it appears
        const possiblePrefixes = ['TARA:', 'You:', 'AI:', chatUser.name + ':'];
        for (const prefix of possiblePrefixes) {
            if (aiReply.startsWith(prefix)) {
                aiReply = aiReply.substring(prefix.length).trim();
                break;
            }
        }

        // Remove quotes if the entire response is wrapped in them
        if (aiReply.startsWith('"') && aiReply.endsWith('"')) {
            aiReply = aiReply.slice(1, -1);
        }

        // Ensure we have a valid response
        if (!aiReply) {
            aiReply = "Main yahin hoon, sun rahi hoon 💛";
        }

        console.log('Groq API response received, length:', aiReply.length);
        console.log('AI Reply:', aiReply);

        // Create user message
        const userMessage = {
            id: new ObjectId().toString(),
            content: message,
            sender: 'user',
            type: 'text',
            timestamp: new Date()
        };

        // Create AI response message
        const aiMessage = {
            id: new ObjectId().toString(),
            content: aiReply,
            sender: 'them',
            type: 'text',
            timestamp: new Date()
        };

        // Only update chat history if skipChatHistory is not true
        if (!skipChatHistory) {
            await collection.updateOne(
                {
                    firebaseUid: userId,
                    'chatUsers.id': chatUserId
                },
                {
                    $push: {
                        'chatUsers.$.conversations': {
                            $each: [userMessage, aiMessage]
                        }
                    },
                    $set: {
                        'chatUsers.$.lastMessageAt': new Date(),
                        lastUpdated: new Date()
                    }
                }
            );
            console.log('Chat response saved to history');
        } else {
            console.log('Skipping chat history save (goal suggestion)');
        }

        console.log('Chat response generated successfully');
        console.log('Returning response with', skipChatHistory ? chatHistory.length : chatHistory.length + 2, 'total messages');

        // Analyze user pattern for DASS-21 suggestion (only for TARA AI)
        let patternAnalysis = null;
        let shouldSuggestDASS21 = false;

        if (chatUserId === 'tara-ai' && !skipChatHistory) {
            try {
                console.log('Analyzing user pattern for DASS-21 suggestion...');

                // Get updated chat history including new messages
                const updatedChatHistory = [...chatHistory, userMessage, aiMessage];
                const journals = userData.journals || [];

                // Analyze pattern
                const analysis = analyzeUserPattern(updatedChatHistory, journals, 3);

                // Check if user has taken DASS-21 recently (within last 7 days)
                const recentAssessments = userData.dass21Assessments || [];
                const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
                const hasRecentAssessment = recentAssessments.some(assessment => {
                    const assessmentDate = new Date(assessment.completedAt || assessment.createdAt);
                    return assessmentDate >= sevenDaysAgo;
                });

                shouldSuggestDASS21 = analysis.shouldSuggestDASS21 && !hasRecentAssessment;

                if (shouldSuggestDASS21) {
                    console.log('Pattern analysis suggests DASS-21:', {
                        stressScore: analysis.combinedStressScore,
                        consecutiveDays: analysis.chatAnalysis.consecutiveStressedDays,
                        confidence: analysis.confidence
                    });
                }

                patternAnalysis = {
                    shouldSuggest: shouldSuggestDASS21,
                    stressScore: analysis.combinedStressScore,
                    confidence: analysis.confidence,
                    consecutiveStressedDays: analysis.chatAnalysis.consecutiveStressedDays
                };
            } catch (error) {
                console.error('Error analyzing pattern:', error);
                // Don't fail the chat if pattern analysis fails
            }
        }

        const responseData = {
            success: true,
            userMessage,
            aiMessage,
            chatHistory: skipChatHistory ? chatHistory : [...chatHistory, userMessage, aiMessage],
            ...(patternAnalysis && { patternAnalysis })
        };

        console.log('Response data:', JSON.stringify(responseData, null, 2));

        return NextResponse.json(responseData);

    } catch (error) {
        console.error('Chat API Error:', error);
        return NextResponse.json(
            { error: 'Failed to process chat message', details: error.message },
            { status: 500 }
        );
    }
}
