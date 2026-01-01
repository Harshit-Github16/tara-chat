
// Utility for analyzing conversation tone and determining response strategies
// Focused on emotional intelligence and therapeutic alignment

const EMOTION_KEYWORDS = {
    anger: [
        'angry', 'mad', 'furious', 'hate', 'annoyed', 'irritated', 'pissed', 'stupid',
        'idiot', 'rage', 'resent', 'unfair', 'gussa', 'paagal', 'bekaar', 'dimag kharab',
        'bhad me', 'bakwas', 'irritate', 'frus'
    ],
    sadness: [
        'sad', 'unhappy', 'depressed', 'crying', 'cry', 'tears', 'lonely', 'alone',
        'hurt', 'pain', 'grief', 'miss', 'hopeless', 'empty', 'dukh', 'rona', 'udas',
        'akela', 'dard', 'bura lag', 'mood off', 'low'
    ],
    anxiety: [
        'anxious', 'worried', 'worry', 'scared', 'afraid', 'panic', 'nervous', 'stress',
        'stressed', 'tense', 'overwhelmed', 'ghabra', 'tension', 'dar', 'fata', 'fat',
        'dhak dhak', 'bechen'
    ],
    joy: [
        'happy', 'excited', 'glad', 'great', 'awesome', 'good', 'love', 'amazing',
        'wonderful', 'proud', 'khush', 'badhiya', 'mast', 'mazza', 'achha'
    ],
    confusion: [
        'confused', 'lost', 'unsure', 'dont know', 'idk', 'maybe', 'help', 'stuck',
        'samajh nahi', 'pata nahi', 'kya karu', 'uljan'
    ]
};

const STRATEGIES = {
    VALIDATION: {
        name: 'Deep Validation',
        instruction: `STRATEGY: DEEP VALIDATION (The user feels unheard or intense emotion)
    - Your PRIMARY GOAL is to make them feel understood.
    - Do NOT offer solutions yet.
    - Mirror their specific emotion (e.g., "It makes sense that you're angry because...").
    - Use "It sounds like..." or "I hear how painful this is."`,
    },
    CONTAINMENT: {
        name: 'Emotional Containment',
        instruction: `STRATEGY: EMOTIONAL CONTAINMENT (The user is overwhelmed/anxious)
    - Your PRIMARY GOAL is to help them feel safe and grounded.
    - Use shorter, calmer sentences.
    - Validate the feeling ("It's okay to feel scared").
    - Gently guide them to the present moment ("Right now, you are safe").`,
    },
    EMPOWERMENT: {
        name: 'Gentle Empowerment',
        instruction: `STRATEGY: GENTLE EMPOWERMENT (The user is stuck/sad but calm)
    - Your PRIMARY GOAL is to remind them of their strength.
    - Validate first, then look for a small win.
    - Ask a tiny open-ended question like "What is one small thing you could do for yourself today?"`
    },
    CELEBRATION: {
        name: 'Shared Joy',
        instruction: `STRATEGY: SHARED JOY (The user is happy/proud)
    - MATCH their energy! (Use slightly more enthusiastic punctuation).
    - Ask a follow-up question to let them savor the moment ("That's amazing! How did you celebrate?").`
    },
    CLARIFICATION: {
        name: 'Gentle Clarification',
        instruction: `STRATEGY: GENTLE CLARIFICATION (The user is confused/vague)
    - Help them organize their thoughts.
    - Ask one simple specific question.
    - "It sounds like a lot is going on. What is the one thing bothering you the most?"`
    },
    CRISIS: {
        name: 'Crisis Support',
        instruction: `STRATEGY: CRISIS SUPPORT (SAFETY FIRST)
    - The user seems to be in intense distress or danger.
    - Be direct, compassionate, and prioritize safety.
    - "I am hearing a lot of pain. Please know I care. Are you safe right now?"`
    }
};

/**
 * analyzing the user's latest message to detect dominant emotion.
 */
export function analyzeEmotion(text) {
    if (!text) return 'neutral';

    const lowerText = text.toLowerCase();
    let maxScore = 0;
    let dominantEmotion = 'neutral';

    for (const [emotion, keywords] of Object.entries(EMOTION_KEYWORDS)) {
        let score = 0;
        keywords.forEach(word => {
            if (lowerText.includes(word)) score++;
        });

        // Weight earlier words slightly more (topic usually comes first)
        if (score > maxScore) {
            maxScore = score;
            dominantEmotion = emotion;
        }
    }

    return dominantEmotion;
}

/**
 * Determines the best response strategy based on emotion and context.
 */
export function getResponseStrategy(text, history = []) {
    const emotion = analyzeEmotion(text);

    // Detect crisis keywords (Basic check)
    const crisisKeywords = ['die', 'kill myself', 'suicide', 'end it all', 'mar jau'];
    if (crisisKeywords.some(w => text.toLowerCase().includes(w))) {
        return STRATEGIES.CRISIS;
    }

    switch (emotion) {
        case 'anger':
            return STRATEGIES.VALIDATION;
        case 'anxiety':
            return STRATEGIES.CONTAINMENT;
        case 'sadness':
            // Check if it's the first time they mentioned it or deep in conversation
            return STRATEGIES.VALIDATION;
        case 'joy':
            return STRATEGIES.CELEBRATION;
        case 'confusion':
            return STRATEGIES.CLARIFICATION;
        default:
            // If neutral, check if asking a question (Advice) or just chatting (Casual)
            if (text.includes('?')) return STRATEGIES.CLARIFICATION;
            return {
                name: 'Conversational Flow',
                instruction: `STRATEGY: CASUAL FLOW
        - Match the user's conversational tone.
        - Keep it light and engaging.
        - Use humor if appropriate.`
            };
    }
}

export function generateSystemInstruction(strategy, userContext) {
    return `
=== DYNAMIC RESPONSE STRATEGY: ${strategy.name} ===
${strategy.instruction}

USER CONTEXT:
${userContext}

Follow this strategy STRICTLY for the next response.
`;
}
