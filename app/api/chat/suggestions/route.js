import { NextResponse } from 'next/server';

const GROQ_API_KEYS = [
    process.env.GROQ_API_KEY,
    process.env.GROQ_API_KEY_INSIGHTS,
    process.env.GROQ_API_KEY_2,
    process.env.GROQ_API_KEY_3,
    process.env.GROQ_API_KEY_4,
].filter(Boolean);

const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';

function getRandomGroqApiKey() {
    if (GROQ_API_KEYS.length === 0) {
        throw new Error('No Groq API keys configured');
    }
    const randomIndex = Math.floor(Math.random() * GROQ_API_KEYS.length);
    return GROQ_API_KEYS[randomIndex];
}

export async function POST(request) {
    try {
        const body = await request.json();
        const { messages, userDetails } = body;

        if (!messages || !Array.isArray(messages) || messages.length === 0) {
            return NextResponse.json({ suggestions: [] });
        }

        // Get the last few messages for context
        const recentMessages = messages.slice(-5).map(m =>
            `${m.sender === 'user' ? (userDetails?.name || 'User') : 'TARA'}: ${m.content}`
        ).join('\n');

        const systemPrompt = `You are a helpful AI assistant suggesting replies for the user. 
        Based on the conversation history, suggest 3 short, natural, and relevant replies that the user might want to send next.
        - Keep them short (1-5 words).
        - Make them conversational.
        - Vary the tone (one neutral/agreement, one question, one expressive).
        - If the language is Hindi/Hinglish, suggest in Hinglish.
        - Return ONLY the 3 suggestions separated by pipes (|), nothing else.
        Example: "Yeah totally|What about you?|That sounds fun"
        `;

        const groqPayload = {
            model: 'llama-3.3-70b-versatile',
            messages: [
                { role: 'system', content: systemPrompt },
                { role: 'user', content: `Previous conversation:\n${recentMessages}\n\nSuggest 3 replies for the User:` }
            ],
            temperature: 0.7,
            max_tokens: 50,
        };

        const apiKey = getRandomGroqApiKey();
        const response = await fetch(GROQ_API_URL, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(groqPayload),
        });

        if (!response.ok) {
            throw new Error('Groq API failed');
        }

        const data = await response.json();
        const suggestionText = data.choices[0]?.message?.content || "";

        // Split by pipe and clean up
        const suggestions = suggestionText.split('|')
            .map(s => s.trim().replace(/^["']|["']$/g, '')) // Remove quotes
            .filter(s => s.length > 0 && s.length < 50) // Basic validation
            .slice(0, 3);

        return NextResponse.json({ suggestions });

    } catch (error) {
        console.error('Error generating suggestions:', error);
        // Fallback suggestions
        return NextResponse.json({
            suggestions: ["Tell me more", "I understand", "What do you think?"]
        });
    }
}
