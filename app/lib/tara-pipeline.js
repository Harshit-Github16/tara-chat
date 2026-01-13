
import { ObjectId } from 'mongodb';

// --- Constants & Config ---

const EMOTION_KEYWORDS = {
    anxiety: ['anxious', 'worried', 'uneasy', 'nervous', 'panic', 'scared', 'fear', 'dread'],
    sadness: ['sad', 'low', 'heavy', 'heartbroken', 'depressed', 'crying', 'tear', 'unhappy', 'grief'],
    anger: ['angry', 'irritated', 'mad', 'furious', 'rage', 'annoyed', 'resentful'],
    overwhelm: ['too much', 'cant handle', 'overwhelmed', 'drowning', 'suffocating', 'busy', 'pressure'],
    loneliness: ['alone', 'lonely', 'no one', 'isolated', 'abandoned'],
    numbness: ['numb', 'blank', 'nothing', 'empty', 'hollow'],
    neutral: []
};

const CRISIS_KEYWORDS = {
    immediate: ['die', 'kill myself', 'suicide', 'hurt myself', 'end it all', 'hang myself', 'cut myself'],
    likely: ['dont want to live', 'wish i could disappear', 'better off dead', 'no reason to live', 'hopeless'],
    possible: ['whats the point', 'tired of everything', 'give up', 'cant go on', 'done with this']
};

const INTENT_PATTERNS = [
    { intent: 'emotional_expression', pattern: /^(i\s+feel|i\s+am\s+feeling|feeling)/i, confidence: 0.7 },
    { intent: 'understanding_emotions', pattern: /^(why\s+do\s+i|what\s+causes|why\s+am\s+i)/i, confidence: 0.75 },
    { intent: 'help_seeking', pattern: /^(help\s+me|what\s+should\s+i\s+do|give\s+me\s+advice|suggest)/i, confidence: 0.9 },
    { intent: 'crisis', pattern: /^(i\s+want\s+to\s+die|kill\s+me)/i, confidence: 1.0 }
];

const EMOJI_MAP = {
    '😭': 'distress', '😔': 'sadness', '😢': 'sadness',
    '😡': 'anger', '😠': 'anger', '🤬': 'anger',
    '😰': 'anxiety', '😨': 'anxiety', '😟': 'anxiety',
    '😶': 'numbness', '😐': 'numbness'
};

// --- Step 1: Pre-processing ---

export function preprocessMessage(rawText) {
    const normalizedText = rawText.toLowerCase().replace(/\s+/g, ' ').trim();

    // Emoji extraction
    const emojis = (rawText.match(/[\p{Emoji_Presentation}\p{Extended_Pictographic}]/gu) || []);
    const emojiEmotionHint = emojis.map(e => EMOJI_MAP[e]).find(e => e) || null;

    // Language Detection (Simple Heuristic for now, ideally use a library or LLM)
    // Checking for common Hinglish words if not fully English? For now default to 'english'
    // or 'hinglish' if specific markers found.
    const language = 'english'; // Placeholder logic

    // Crisis Keyword Scan
    let crisisFlag = 'none';
    for (const [level, keywords] of Object.entries(CRISIS_KEYWORDS)) {
        if (keywords.some(k => normalizedText.includes(k))) {
            // Prioritize highest severity
            if (level === 'immediate') { crisisFlag = 'immediate'; break; }
            if (level === 'likely' && crisisFlag !== 'immediate') crisisFlag = 'likely';
            if (level === 'possible' && crisisFlag === 'none') crisisFlag = 'possible';
        }
    }

    // Message Length & Structure
    const wordCount = normalizedText.split(' ').length;
    let messageLength = 'medium';
    if (wordCount <= 2) messageLength = 'very_short';
    else if (wordCount <= 10) messageLength = 'short';
    else if (wordCount > 80) messageLength = 'very_long';
    else if (wordCount > 30) messageLength = 'long';

    const structure = (normalizedText.includes('...') || (wordCount < 5 && normalizedText.includes(' ')))
        ? 'fragmented'
        : 'simple'; // Simplified logic

    return {
        raw_text: rawText,
        normalized_text: normalizedText,
        language,
        emojis,
        emoji_emotion_hint: emojiEmotionHint,
        crisis_flag: crisisFlag,
        message_length: messageLength,
        structure
    };
}

// --- Step 2 & 3: Intent & Emotion Detection (Classify) ---
// Using a lightweight LLM call here would be best, but for now we implement the robust Rule-Based logic
// and simulated ML logic as requested.

export async function detectIntentAndEmotion(preprocessed, groqApiKey, chatHistory = []) {
    // 1. Rule-Based Intent
    let ruleIntent = null;
    let ruleConfidence = 0;

    for (const { intent, pattern, confidence } of INTENT_PATTERNS) {
        if (pattern.test(preprocessed.normalized_text)) {
            ruleIntent = intent;
            ruleConfidence = confidence;
            break;
        }
    }

    // 2. ML/LLM Classifier (Simulated via a fast Groq call for classification)
    let mlResult = { intent: 'emotional_expression', confidence: 0.5, emotion: 'neutral', intensity: 'medium' };

    try {
        const classificationPrompt = `
      Analyze this user message for a mental health chatbot.
      Message: "${preprocessed.raw_text}"
      
      Return ONLY a JSON object with:
      - intent: (emotional_expression, understanding_emotions, help_seeking, asking_for_advice, crisis, withdrawal)
      - confidence: (0.0 to 1.0)
      - primary_emotion: (anxiety, sadness, anger, overwhelm, loneliness, fear, numbness, neutral)
      - intensity: (low, medium, high)
    `;

        const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${groqApiKey}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                model: 'llama-3.3-70b-versatile', // Reliable model
                messages: [{ role: 'user', content: classificationPrompt }],
                response_format: { type: "json_object" },
                max_tokens: 150,
                temperature: 0.1
            }),
        });

        if (response.ok) {
            const data = await response.json();
            mlResult = JSON.parse(data.choices[0].message.content);
        }
    } catch (e) {
        console.warn("Classification failed, using defaults", e);
    }

    // 3. Fusion Logic
    // Check triggers
    const signalAdjustment = (preprocessed.emoji_emotion_hint ? 0.05 : 0) +
        (preprocessed.structure === 'fragmented' ? 0.05 : 0);

    let finalConfidence = (ruleConfidence * 0.3) + (mlResult.confidence * 0.6) + signalAdjustment;
    let finalIntent = (ruleConfidence > mlResult.confidence && ruleConfidence > 0.6) ? ruleIntent : mlResult.intent;

    // Crisis Override
    if (['likely', 'immediate'].includes(preprocessed.crisis_flag)) {
        finalIntent = 'crisis';
        finalConfidence = 1.0;
    }

    return {
        intent: finalIntent,
        confidence: finalConfidence,
        primary_emotion: mlResult.primary_emotion || 'neutral',
        intensity: mlResult.intensity || 'medium', // Could refine with rule based intensity
        ml_result: mlResult
    };
}


// --- Step 4: Memory (Stub for now, to be integrated with DB) ---
// We assume we get STM/LTM passed in or fetch it. 

// --- Step 5: Response Strategy ---

export function selectStrategy(intentData, memory, preprocessed) {
    const { intent, confidence, primary_emotion, intensity } = intentData;
    const { crisis_flag } = preprocessed;

    // Base Strategy
    let strategy = 'pure_empathy';
    let modifiers = [];

    if (crisis_flag === 'likely' || crisis_flag === 'immediate' || intent === 'crisis') {
        return { strategy: 'crisis_support', modifiers: [], allow_advice: false, allow_tool: false };
    }

    if (intent === 'emotional_expression') {
        if (intensity === 'high') strategy = 'pure_empathy';
        else strategy = 'empathy_reflection';
    } else if (intent === 'help_seeking') {
        strategy = 'empathy_permission'; // empathy + permission to advice
    } else if (intent === 'withdrawal') {
        strategy = 'gentle_presence';
    }

    // Modifiers
    if (intensity === 'high') modifiers.push('high_intensity');
    if (confidence < 0.6) modifiers.push('low_confidence');

    // Check memory for recurring (Stub logic)
    // if (memory.recurring_emotions.includes(primary_emotion)) modifiers.push('pattern_aware');

    return {
        strategy,
        modifiers,
        allow_advice: false, // Default false until requested
        allow_tool: false,
        max_questions: 1
    };
}

// --- Step 6: Prompt Builder ---

export function buildPrompt(strategyData, intentData, preprocessed, memorySummary) {
    // If crisis, we might skip this or use a specific system prompt, but here we build the standard one
    // which the LLM will use to generate the initial draft.

    const { strategy, modifiers } = strategyData;
    const { primary_emotion, intensity } = intentData;

    return `
SYSTEM:
You are Tara, a calm, emotionally intelligent mental health companion.
You help users feel understood before offering guidance.
You speak in simple, warm, non-clinical language.
You never judge, rush, diagnose, or overwhelm.
You are "Tara", not an AI assistant.

CONTEXT:
User intent: ${intentData.intent}
Primary emotion: ${primary_emotion} (${intensity})
Crisis Risk: ${preprocessed.crisis_flag}

RESPONSE STRATEGY:
Strategy: ${strategy}
Modifiers: ${modifiers.join(', ')}
- Lead with emotional validation.
- Reflect the feeling back gently.
- Do NOT give advice unless explicitly asked.
- Do NOT suggest tools unless strategy says so.
- Ask at most one gentle, optional question.

VOICE RULES:
- Use simple, everyday English (or Hinglish if appropriate based on input).
- Keep response under 100-120 words.
- Use 1-3 short paragraphs.
- No clinical or diagnostic language.
- No "should", "just", "always", "never".
- Tone must be calm, warm, and human.

USER MESSAGE:
"${preprocessed.raw_text}"
`;
}

// --- Step 7 & 8: LLM Generation & Validation (to be called in route) ---

// --- Step 9: Safety Filter ---

export function safetyFilter(response, strategyData, preprocessed) {
    let safeResponse = response;

    // 1. Crisis Safety
    const crisisTriggers = [...CRISIS_KEYWORDS.immediate, ...CRISIS_KEYWORDS.likely];
    const hasCrisisTrigger = crisisTriggers.some(t => response.toLowerCase().includes(t));
    if (hasCrisisTrigger && strategyData.strategy !== 'crisis_support') {
        // Fallback or rewrite
        return "I hear how much pain you're in. I'm here listening.";
    }

    if (strategyData.strategy === 'crisis_support') {
        // Enforce specific templates
        // We probably handle this by completely overriding the LLM response in the route
        // if the Intent was crisis. But if LLM hallucinated crisis advice, we clean it.
        return response; // Assume LLM followed crisis instructions or we override later
    }

    // 2. Medical Safety
    if (response.match(/diagnos(is|e)|disorder|medication|prescription/i)) {
        safeResponse = "It sounds like things are really tough right now. I'm here to support you through these feelings.";
    }

    // 3. Strategy Constraints
    if (!strategyData.allow_advice && (response.toLowerCase().includes('you should') || response.toLowerCase().includes('try to'))) {
        // Simple rewrite heuristic
        safeResponse = safeResponse.replace(/you should/gi, 'perhaps you could').replace(/try to/gi, 'we could');
    }

    // 4. Toxic Positivity
    safeResponse = safeResponse.replace(/don't worry/gi, 'it’s okay to feel this way');
    safeResponse = safeResponse.replace(/everything will be fine/gi, 'we can take this one step at a time');

    return safeResponse;
}

// --- Step 10: Tone Checker ---

export function toneChecker(response, intentData) {
    let polished = response;

    // 1. Emotional Validation Injection
    // Check if starts with validation
    const validationPhrases = ["sounds like", "hear you", "sense that", "makes sense", "understand"];
    const hasValidation = validationPhrases.some(p => polished.toLowerCase().slice(0, 50).includes(p));

    if (!hasValidation && intentData.intent === 'emotional_expression') {
        polished = `It sounds like things are heavy right now. ${polished}`;
    }

    // 3. Softening
    polished = polished.replace(/\bshould\b/gi, 'might').replace(/\bjust\b/gi, '');

    return polished;
}

// --- Crisis Template Helper ---
export function getCrisisResponse(level) {
    const resources = `If you're in India, you can call Kiran (1800-599-0019) or AASRA (91-9820466726).`;

    if (level === 'immediate' || level === 'likely') {
        return `I’m really sorry you’re feeling this much pain. It sounds unbearable right now, but you don’t have to carry it alone. ${resources} Are you safe right now?`;
    }
    return `I hear how hard things are for you. When it feels this heavy, it's okay to reach out for more support. ${resources} I'm here with you too.`;
}
