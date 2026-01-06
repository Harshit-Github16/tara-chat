import { NextResponse } from 'next/server';
import { detectLanguage } from '../../../utils/languageDetection';

const GROQ_API_KEYS = [
    process.env.GROQ_API_KEY,
    process.env.GROQ_API_KEY_INSIGHTS,
    process.env.GROQ_API_KEY_2,
    process.env.GROQ_API_KEY_3,
    process.env.GROQ_API_KEY_4,
].filter(Boolean);

const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';


export async function POST(request) {
    try {
        console.log('Suggestions API - Available Keys:', GROQ_API_KEYS.length);

        const body = await request.json();
        const { messages, userDetails } = body;

        // If no messages or very few, we are in the starting phase
        // FIXED: Only consider it starting phase if there are 0 or 1 message (User start or User+AI greeting)
        // User requested: "start chat ki to greetings hi honi chahiye"
        const isStartingPhase = !messages || !Array.isArray(messages) || messages.length <= 1;

        if (isStartingPhase) {
            // Contextual, wellness-focused starting suggestions
            const suggestionCategories = [
                // Greetings & Openers
                ["Hi Tara! 😊", "Kaise ho?", "Need to talk"],
                ["Hey! 👋", "Aaj ka din kaisa hai?", "Feeling a bit low"],
                ["Hii Tara!", "Kuch share karna hai", "How are you?"]
            ];

            // Pick a random category and return 3 suggestions
            const randomCategory = suggestionCategories[Math.floor(Math.random() * suggestionCategories.length)];
            return NextResponse.json({ suggestions: randomCategory });
        }

        // Get the last few messages for context
        // FIXED: User requested "suggestions last 2-3 msg ke according genrate hone chahiye"
        const recentMessages = messages.slice(-3).map(m =>
            `${m.sender === 'user' ? (userDetails?.name || 'User') : 'TARA'}: ${m.content}`
        ).join('\n');

        const detectedLanguage = detectLanguage(recentMessages);
        console.log('Detected language for suggestions:', detectedLanguage);

        // Language-specific instructions with more idiomatic examples
        const languageInstructions = {
            'english': `- Style: Casual, friendly English.
        - Tone: Support friend.
        - Examples: "How are you doing?|I'm here for you.|Tell me more!"`,

            'hinglish': `- Style: Natural Hinglish (mixing Hindi/English like friends do).
        - IMPORTANT: Avoid literal translations of English idioms. Use common urban Hinglish.
        - Examples: "Aap kaise ho?|Sab badhiya, aap batao|Dil halka ho gaya|Maza nahi aa raha"`,

            'hindi': `- Style: Conversational Hindi (Roman script).
        - IMPORTANT: Must sound like a real person, not a translator.
        - Examples: "Kaise ho yaar?|Theek hoon, tum batao|Kya chal raha hai?|Pareshan mat ho"`
        };

        const systemPrompt = `You are TARA's intelligent assistant helping the user reply.
        
        Based on the conversation history (last 3 messages), suggest 3 short, natural, and highly relevant replies.
        
        CRITICAL RULES:
        1. NATURAL FLOW: Suggestions must sound like something a real friend would say. No robotic or weirdly translated phrases.
        2. LANGUAGE MATCH: ${languageInstructions[detectedLanguage]}
        3. VOCABULARY MIRRORING: If user uses "bro", "yaar", etc., use them in suggestions.
        4. VARIETY: One casual update/acknowledgment, one follow-up question, one emotional reaction.
        5. DO NOT use: "Tumhare saath raha main" or "Dukh mat manna" - these are robotic.
        
        Return ONLY the 3 suggestions separated by pipes (|), nothing else.
        `;

        const groqPayload = {
            model: 'llama-3.1-70b-versatile', // Upgraded model for better nuance
            messages: [
                { role: 'system', content: systemPrompt },
                { role: 'user', content: `Conversation Context:\n${recentMessages}\n\nSuggest 3 Best Replies for User:` }
            ],
            temperature: 0.85, // Slightly higher for more natural variety
            max_tokens: 100,
        };

        // Retry mechanism with multiple keys
        const shuffledKeys = [...GROQ_API_KEYS].sort(() => Math.random() - 0.5);
        let lastError = null;
        let suggestionText = "";

        if (shuffledKeys.length === 0) {
            console.error('No Groq API keys found in environment variables');
        }

        for (const apiKey of shuffledKeys) {
            try {
                const response = await fetch(GROQ_API_URL, {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${apiKey}`,
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(groqPayload),
                });

                if (response.ok) {
                    const data = await response.json();
                    suggestionText = data.choices[0]?.message?.content || "";
                    if (suggestionText) {
                        console.log('Suggestions generated successfully');
                        break;
                    }
                } else {
                    lastError = await response.text();
                    console.error('Groq key failed:', apiKey.substring(0, 5) + '...', lastError);
                }
            } catch (error) {
                lastError = error.message;
                console.error('Fetch error with key:', error.message);
            }
        }

        if (!suggestionText) {
            throw new Error(`All Groq keys failed or returned empty. Last error: ${lastError}`);
        }

        // Split by pipe and clean up
        const suggestions = suggestionText.split('|')
            .map(s => s.trim().replace(/^["']|["']$/g, '')) // Remove quotes
            .filter(s => s.length > 0 && s.length < 50) // Basic validation
            .slice(0, 3);

        return NextResponse.json({ suggestions });

    } catch (error) {
        console.error('Suggestions API error:', error);
        // Fallback suggests based on Tara's vibe - using unique labels to confirm deployment
        return NextResponse.json({
            suggestions: ["Tell me more! 😊", "I understand", "What's next?"]
        }, {
            headers: { 'Cache-Control': 'no-store, max-age=0' }
        });
    }
}
