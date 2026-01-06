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
        const body = await request.json();
        const { messages, userDetails } = body;

        // Get context from last 3-5 messages
        const recentHistory = messages && Array.isArray(messages) ? messages.slice(-5) : [];
        const contextText = recentHistory.map(m =>
            `${m.sender === 'user' ? (userDetails?.name || 'User') : 'TARA'}: ${m.content}`
        ).join('\n');

        // Detect language from context or fallback to English
        const detectedLanguage = detectLanguage(contextText || "");

        // Language-specific style rules
        const languageInstructions = {
            'english': `Respond in natural, casual English.`,
            'hindi': `Respond in conversational Hindi (Roman script).`,
            'hinglish': `Respond in natural Hinglish (mixing Hindi/English). Mirror the user's style.`
        };

        const systemPrompt = `You are TARA's intelligent reply assistant. 
Your job is to suggest 3 natural, short, and highly relevant replies for the User to send to TARA.

VIBE: "Chill Friend" - supportive, casual, and empathetic. 
STYLE: Short (1-4 words mostly), natural, and varied.

CRITICAL RULES:
1. NO ROBOTIC TALK: Avoid phrases like "I am sad" or "Help me".
2. LANGUAGE: ${languageInstructions[detectedLanguage]}
3. CONTEXT: 
   - If history is empty, suggest 3 different high-quality openers (e.g., "Hi Tara! 😊", "Need to talk", "Kaise ho?").
   - If history exists, suggest replies that follow the current flow.
4. VARIETY: Provide 3 distinct options (e.g., one update, one question, one emotion).
5. NO NUMBERING: Just provide the suggestions separated by pipes (|).

Examples:
- "Hi Tara! 😊 | Kaise ho? | Need to talk"
- "Sab badhiya! | Aap batao | Mood thora off hai"
- "Thanks yaar | I understand | Phir kya hua?"

Return ONLY the 3 suggestions separated by pipes (|).`;

        const groqPayload = {
            model: 'llama-3.3-70b-versatile',
            messages: [
                { role: 'system', content: systemPrompt },
                { role: 'user', content: contextText ? `Conversation History:\n${contextText}\n\nSuggest 3 replies:` : "Start of conversation. Suggest 3 openers:" }
            ],
            temperature: 0.8,
            max_tokens: 100
        };

        const shuffledKeys = [...GROQ_API_KEYS].sort(() => Math.random() - 0.5);
        let suggestionText = "";

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
                    if (suggestionText) break;
                }
            } catch (error) {
                console.error('Groq key failed in suggestions:', error.message);
            }
        }

        if (!suggestionText) throw new Error("All Groq keys failed");

        // Clean and parse suggestions
        const suggestions = suggestionText.split('|')
            .map(s => s.trim()
                .replace(/^["']|["']$/g, '')
                .replace(/^\d+[\.\)]\s*/, '') // Remove numbers
                .replace(/^[-•*]\s*/, '') // Remove bullets
                .trim()
            )
            .filter(s => s.length > 0 && s.length < 50)
            .slice(0, 3);

        // Final fallback if parsing fails
        if (suggestions.length === 0) {
            return NextResponse.json({
                suggestions: ["Hi Tara! 😊", "Kaise ho?", "Need to talk"]
            });
        }

        return NextResponse.json({ suggestions });

    } catch (error) {
        console.error('Suggestions API error:', error);
        return NextResponse.json({
            suggestions: ["Hi Tara! 😊", "How are you?", "Need to talk"]
        });
    }
}
