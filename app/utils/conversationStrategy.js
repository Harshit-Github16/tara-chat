
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
        'samajh nahi', 'pata nahi', 'kya karu', 'uljan', 'confuse'
    ],
    boredom: [
        'ok', 'hmm', 'hmmm', 'haa', 'han', 'bas', 'nothing', 'kuch nahi', 'pata nahi'
    ]
};

const STRATEGIES = {
    VALIDATION: {
        name: 'Deep Validation',
        instruction: `STRATEGY: DEEP VALIDATION (User feels unheard/intense emotion)
    - GOAL: Make them feel truly understood.
    - Mirror their feelings naturally.
    - Avoid robotic phrases like "I hear that you are...".
    - Instead, say things like "That sounds incredibly tough" or "I can't imagine how hard that must be."
    - Be a listening ear first, advice second.`
    },
    CONTAINMENT: {
        name: 'Emotional Containment',
        instruction: `STRATEGY: EMOTIONAL CONTAINMENT (User is overwhelmed/anxious)
    - GOAL: Be a grounding force.
    - Use calm, steady, and short sentences.
    - Validate first: "It's totally okay to feel this way."
    - Gently bring them to the present: "I'm right here with you. Just take a breath."`
    },
    EMPOWERMENT: {
        name: 'Gentle Empowerment',
        instruction: `STRATEGY: GENTLE EMPOWERMENT (User is stuck/sad but calm)
    - GOAL: Remind them of their own strength.
    - Validate their struggle, then gently nudge forward.
    - Ask a small, low-pressure question: "What's one tiny thing you could do for yourself right now?"
    - Focus on small wins.`
    },
    CELEBRATION: {
        name: 'Shared Joy',
        instruction: `STRATEGY: SHARED JOY (User is happy/proud)
    - GOAL: Amplify their happiness! 
    - Match their energy with warmth and enthusiasm.
    - "That is amazing news! I'm so happy for you! 🎉"
    - Ask them to share more details.`
    },
    CLARIFICATION: {
        name: 'Gentle Clarification',
        instruction: `STRATEGY: GENTLE CLARIFICATION (Confused/Vague)
    - GOAL: Help them find clarity without pressure.
    - "It sounds like a lot is on your mind."
    - Ask one simple question to help them focus: "What's the main thing bothering you right now?"`
    },
    CRISIS: {
        name: 'Crisis Support',
        instruction: `STRATEGY: CRISIS SUPPORT (SAFETY FIRST)
    - The user seems to be in intense distress or danger.
    - Be direct, compassionate, and prioritize safety.
    - "I am hearing a lot of pain. Please know I care. Are you safe right now?"`
    },
    RE_ENGAGEMENT: {
        name: 'Gentle Re-engagement',
        instruction: `STRATEGY: GENTLE RE-ENGAGEMENT (User is giving short, unengaged responses)
    - GOAL: Gently encourage the user to share more without being intrusive.
    - Match their briefness but add a warm, open-ended question.
    - Keep it natural, not robotic.
    - Example: "I'm here if you want to talk more about that. How's everything else going?"`
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
        case 'boredom':
            return STRATEGIES.RE_ENGAGEMENT;
        default:
            // If message is very short (1-2 words) and NOT a common greeting
            const wordCount = text.trim().split(/\s+/).length;
            const greetings = ['hi', 'hey', 'hello', 'hii', 'helo', 'namaste', 'asalam'];
            const isGreeting = wordCount <= 2 && greetings.some(g => text.toLowerCase().includes(g));

            if (wordCount <= 2 && !isGreeting) {
                return STRATEGIES.RE_ENGAGEMENT;
            }
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
