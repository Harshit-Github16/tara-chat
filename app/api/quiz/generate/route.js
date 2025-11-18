import { NextResponse } from 'next/server';
import Groq from 'groq-sdk';

const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY
});

export async function POST(request) {
    try {
        const { lifeArea } = await request.json();

        if (!lifeArea) {
            return NextResponse.json(
                { error: 'Life area is required' },
                { status: 400 }
            );
        }

        // Generate quiz using AI
        const prompt = `Generate a quiz with exactly 5 questions for the life area: "${lifeArea}".

Each question should assess satisfaction, progress, or well-being in this area.

Return ONLY a valid JSON array with this exact structure:
[
    {
        "question": "Question text here?",
        "options": [
            { "text": "Option 1", "score": 5 },
            { "text": "Option 2", "score": 4 },
            { "text": "Option 3", "score": 3 },
            { "text": "Option 4", "score": 2 },
            { "text": "Option 5", "score": 1 }
        ]
    }
]

Rules:
- Exactly 5 questions
- Each question has exactly 5 options
- Scores must be 5, 4, 3, 2, 1 (highest to lowest satisfaction)
- Questions should be relevant to "${lifeArea}"
- Return ONLY the JSON array, no other text`;

        const completion = await groq.chat.completions.create({
            messages: [
                {
                    role: 'system',
                    content: 'You are a helpful assistant that generates quiz questions in JSON format. Always return valid JSON only.'
                },
                {
                    role: 'user',
                    content: prompt
                }
            ],
            model: 'llama-3.3-70b-versatile',
            temperature: 0.7,
            max_tokens: 2000
        });

        const responseText = completion.choices[0]?.message?.content || '';

        // Extract JSON from response
        let quizData;
        try {
            // Try to parse directly
            quizData = JSON.parse(responseText);
        } catch (e) {
            // Try to extract JSON from markdown code blocks
            const jsonMatch = responseText.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
            if (jsonMatch) {
                quizData = JSON.parse(jsonMatch[1]);
            } else {
                // Try to find array in text
                const arrayMatch = responseText.match(/\[[\s\S]*\]/);
                if (arrayMatch) {
                    quizData = JSON.parse(arrayMatch[0]);
                } else {
                    throw new Error('Could not parse quiz data');
                }
            }
        }

        // Validate quiz structure
        if (!Array.isArray(quizData) || quizData.length !== 5) {
            throw new Error('Invalid quiz structure');
        }

        return NextResponse.json({ quiz: quizData });

    } catch (error) {
        console.error('Error generating quiz:', error);
        return NextResponse.json(
            { error: 'Failed to generate quiz', details: error.message },
            { status: 500 }
        );
    }
}
