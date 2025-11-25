import { NextResponse } from 'next/server';
import Groq from 'groq-sdk';

// Use separate key for insights/suggestions generation
const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY_INSIGHTS
});

export async function POST(request) {
    try {
        const { areas, allResults } = await request.json();

        if (!areas || areas.length === 0) {
            return NextResponse.json({
                suggestions: []
            });
        }

        // Create prompt for AI
        const areasText = areas.map(a => `${a.area} (Score: ${a.score}/100)`).join(', ');

        const prompt = `You are a life coach and wellness expert. Based on the following life area assessment scores, provide 4-5 specific, actionable suggestions for improvement.

Life Areas Needing Improvement: ${areasText}

For each suggestion, provide:
1. An emoji icon (relevant to the suggestion)
2. A short title (3-5 words)
3. A brief, actionable description (one sentence, max 15 words)

Focus on practical, achievable actions that can be implemented immediately. Be encouraging and positive.

Respond ONLY with a valid JSON array in this exact format:
[
  {
    "icon": "🎯",
    "title": "Set Clear Goals",
    "description": "Define specific objectives for the next month"
  }
]`;

        const completion = await groq.chat.completions.create({
            messages: [
                {
                    role: "system",
                    content: "You are a helpful life coach providing actionable wellness suggestions. Always respond with valid JSON only."
                },
                {
                    role: "user",
                    content: prompt
                }
            ],
            model: "llama-3.1-70b-versatile",
            temperature: 0.7,
            max_tokens: 1000,
        });

        const responseText = completion.choices[0]?.message?.content || '[]';

        // Extract JSON from response
        let suggestions = [];
        try {
            // Try to parse directly
            suggestions = JSON.parse(responseText);
        } catch (e) {
            // Try to extract JSON from markdown code blocks
            const jsonMatch = responseText.match(/```(?:json)?\s*(\[[\s\S]*?\])\s*```/);
            if (jsonMatch) {
                suggestions = JSON.parse(jsonMatch[1]);
            } else {
                // Try to find array in text
                const arrayMatch = responseText.match(/\[[\s\S]*\]/);
                if (arrayMatch) {
                    suggestions = JSON.parse(arrayMatch[0]);
                }
            }
        }

        // Validate and limit to 5 suggestions
        if (!Array.isArray(suggestions)) {
            suggestions = [];
        }
        suggestions = suggestions.slice(0, 5);

        return NextResponse.json({
            success: true,
            suggestions
        });

    } catch (error) {
        console.error('Error generating suggestions:', error);
        return NextResponse.json({
            success: false,
            suggestions: []
        }, { status: 500 });
    }
}
