import { NextResponse } from 'next/server';

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
        const isStartingPhase = !messages || !Array.isArray(messages) || messages.length <= 3;

        if (isStartingPhase) {
            // Contextual, wellness-focused starting suggestions
            const suggestionCategories = [
                // Wellness & Self-Care
                ["How can I feel better today?", "I need some motivation", "Help me relax"],
                ["I'm feeling stressed", "Tips for better sleep?", "How to stay positive?"],

                // Emotional Support
                ["I'm feeling anxious", "Need someone to talk to", "Feeling overwhelmed"],
                ["I'm feeling lonely", "How to handle emotions?", "I need encouragement"],

                // Practical Help
                ["Breathing exercises please", "Meditation tips?", "Self-care ideas"],
                ["How to manage stress?", "Improve my mood", "Daily wellness tips"],

                // Relationship & Social
                ["Relationship advice needed", "How to communicate better?", "Dealing with conflicts"],

                // Personal Growth
                ["Build better habits", "Boost my confidence", "Set healthy boundaries"]
            ];

            // Pick a random category and return 3 suggestions
            const randomCategory = suggestionCategories[Math.floor(Math.random() * suggestionCategories.length)];
            return NextResponse.json({ suggestions: randomCategory });
        }

        // Get the last few messages for context
        const recentMessages = messages.slice(-5).map(m =>
            `${m.sender === 'user' ? (userDetails?.name || 'User') : 'TARA'}: ${m.content}`
        ).join('\n');

        const systemPrompt = `You are TARA's intelligent assistant helping the user reply.
        Current Phase: ${messages.length < 3 ? 'Starting/Greeting' : 'Ongoing Conversation'}
        
        Based on the conversation history, suggest 3 short, natural, and highly relevant replies.
        Guidelines:
        - Keep them 1-4 words.
        - Style: Hinglish (Hindi + English) - mixed naturally.
        - Context: If the user is just saying hi, suggest warm greetings.
        - Variety: One acknowledgment, one question, one emotional expression.
        - Avoid: Generic "I understand" or "Tell me more" unless perfectly fitting.
        
        Return ONLY the 3 suggestions separated by pipes (|), nothing else.
        Example: "Theek hoon aap?|Maza nahi aa rha|Help kardo"
        `;

        const groqPayload = {
            model: 'llama-3.1-8b-instant',
            messages: [
                { role: 'system', content: systemPrompt },
                { role: 'user', content: `Conversation Context:\n${recentMessages}\n\nSuggest 3 Best Replies for User:` }
            ],
            temperature: 0.8,
            max_tokens: 60,
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
