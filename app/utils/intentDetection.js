/**
 * Intent Detection for Tara Chat
 * Step 2 of the Chat Response Strategy Pipeline
 * 
 * 3-Layer Intent Detection:
 * 1. Rule-Based Intent Cues (Fast & Safe)
 * 2. ML/LLM Intent Classifier (Primary)
 * 3. Contextual Signal Adjustment
 * 
 * Final confidence = (rule_confidence * 0.3) + (ml_confidence * 0.6) + (signal_adjustment * 0.1)
 */

// ============================================
// INTENT CATEGORIES
// ============================================
const INTENT_TYPES = {
    EMOTIONAL_EXPRESSION: 'emotional_expression',
    UNDERSTANDING_EMOTIONS: 'understanding_emotions',
    ASKING_FOR_ADVICE: 'asking_for_advice',
    HELP_SEEKING: 'help_seeking',
    VENTING: 'venting',
    CASUAL_CHAT: 'casual_chat',
    GREETING: 'greeting',
    GRATITUDE: 'gratitude',
    CRISIS: 'crisis',
    WITHDRAWAL: 'withdrawal',
    SEEKING_VALIDATION: 'seeking_validation',
    GOAL_SETTING: 'goal_setting',
    REFLECTION: 'reflection',
    FAREWELL: 'farewell'
};

// ============================================
// RULE-BASED PATTERNS (Layer 1)
// ============================================
const INTENT_PATTERNS = {
    [INTENT_TYPES.EMOTIONAL_EXPRESSION]: {
        patterns: [
            /^i\s*(feel|am feeling|am|'m)/i,
            /^(feeling|felt)\s/i,
            /^mujhe\s*(lag|feel)/i,
            /^main\s*(khush|sad|anxious|stressed)/i,
            /^(so|very|really|bahut)\s*(sad|happy|angry|stressed|anxious)/i
        ],
        confidence: 0.70
    },
    [INTENT_TYPES.UNDERSTANDING_EMOTIONS]: {
        patterns: [
            /^why\s*(do|does|did|am|is)/i,
            /^what\s*(causes?|makes?|is)\s*(me|this)/i,
            /^how\s*(come|does)/i,
            /^kyu(n)?\s*(aisa|ye)/i,
            /ye\s*(kyu|kaisa)\s*(hota|ho)/i
        ],
        confidence: 0.75
    },
    [INTENT_TYPES.ASKING_FOR_ADVICE]: {
        patterns: [
            /^what\s*should\s*i/i,
            /^how\s*(can|do|should)\s*i/i,
            /^can\s*you\s*(help|suggest|tell)/i,
            /^(kya|kaise)\s*karu/i,
            /^mujhe\s*bata/i,
            /advice\s*(de|do|chahiye)/i
        ],
        confidence: 0.85
    },
    [INTENT_TYPES.HELP_SEEKING]: {
        patterns: [
            /^help\s*me/i,
            /^i\s*need\s*help/i,
            /^please\s*help/i,
            /^(meri|mujhe)\s*help/i,
            /^madad\s*(karo|chahiye)/i
        ],
        confidence: 0.90
    },
    [INTENT_TYPES.CRISIS]: {
        patterns: [
            /^i\s*(want|need)\s*to\s*(die|end)/i,
            /^(can't|cant)\s*go\s*on/i,
            /^no\s*(reason|point)\s*to\s*live/i,
            /^(marna|mar\s*jana)\s*(chahta|chahti)/i,
            /^(nahi|nhi)\s*reh\s*sakta/i
        ],
        confidence: 1.0
    },
    [INTENT_TYPES.VENTING]: {
        patterns: [
            /^(ugh|argh|fuck|shit|damn)/i,
            /^i\s*(hate|can't stand|despise)/i,
            /^(so|this is)\s*(frustrating|annoying)/i,
            /^(yaar|bhai)\s*(kya|bahut)/i,
            /^(bakwas|bekaar|saala)/i
        ],
        confidence: 0.75
    },
    [INTENT_TYPES.GREETING]: {
        patterns: [
            /^(hi|hey|hello|hii+|helo|heya)/i,
            /^(good\s*(morning|afternoon|evening|night))/i,
            /^(namaste|namaskar|assalamualaikum)/i,
            /^(kaise|kaisi)\s*ho/i,
            /^(how\s*are\s*you|wassup|sup|what's up)/i
        ],
        confidence: 0.95
    },
    [INTENT_TYPES.GRATITUDE]: {
        patterns: [
            /^(thanks?|thank\s*you|thx)/i,
            /^(shukriya|dhanyawad)/i,
            /^(that|this)\s*(helped|was\s*helpful)/i,
            /^(bahut|bohot)\s*(acha|achha)/i
        ],
        confidence: 0.90
    },
    [INTENT_TYPES.FAREWELL]: {
        patterns: [
            /^(bye|goodbye|see\s*you|later)/i,
            /^(alvida|phir\s*milte|chalta|chalti)/i,
            /^(good\s*night|gn|night)/i,
            /^(talk|catch)\s*(you\s*)?later/i
        ],
        confidence: 0.90
    },
    [INTENT_TYPES.SEEKING_VALIDATION]: {
        patterns: [
            /^(am\s*i|is\s*it)\s*(normal|okay|ok|wrong)/i,
            /^(do\s*you\s*think|is\s*this)\s*(right|correct)/i,
            /^(ye|yeh)\s*(sahi|theek|galat)/i
        ],
        confidence: 0.80
    },
    [INTENT_TYPES.WITHDRAWAL]: {
        patterns: [
            /^(ok|okay|k|fine|hmm+|hm+|alright|acha|theek)$/i,
            /^(nothing|nevermind|nvm|kuch\s*nahi|bas)$/i,
            /^(i\s*don't\s*know|idk|pata\s*nahi)$/i
        ],
        confidence: 0.65
    },
    [INTENT_TYPES.GOAL_SETTING]: {
        patterns: [
            /^i\s*want\s*to\s*(start|stop|change|improve)/i,
            /^(mujhe|main)\s*(karna|start|stop)/i,
            /^(my\s*)?goal\s*(is|hai)/i,
            /^i('m|am)\s*(trying|planning)\s*to/i
        ],
        confidence: 0.75
    },
    [INTENT_TYPES.REFLECTION]: {
        patterns: [
            /^(i\s*realized|i\s*think)\s/i,
            /^(looking\s*back|thinking\s*about)/i,
            /^(mujhe|maine)\s*(samajh|realize)/i
        ],
        confidence: 0.70
    }
};

// ============================================
// SECONDARY INTENT MAPPING
// ============================================
const SECONDARY_INTENTS = {
    anxiety: {
        keywords: ['anxious', 'worried', 'panic', 'nervous', 'tension', 'ghabra', 'dar'],
        label: 'Anxiety Sharing'
    },
    sadness: {
        keywords: ['sad', 'depressed', 'crying', 'lonely', 'empty', 'dukh', 'udas', 'akela'],
        label: 'Sadness Sharing'
    },
    anger: {
        keywords: ['angry', 'mad', 'furious', 'hate', 'gussa', 'naraz'],
        label: 'Anger Expression'
    },
    stress: {
        keywords: ['stressed', 'overwhelmed', 'pressure', 'tension', 'bahut kaam'],
        label: 'Stress Sharing'
    },
    joy: {
        keywords: ['happy', 'excited', 'great', 'amazing', 'khush', 'mast'],
        label: 'Joy Sharing'
    },
    confusion: {
        keywords: ['confused', 'lost', 'unsure', 'dont know', 'samajh nahi', 'pata nahi'],
        label: 'Confusion Expression'
    },
    fear: {
        keywords: ['scared', 'afraid', 'fear', 'terrified', 'dar', 'darr'],
        label: 'Fear Sharing'
    },
    relationship: {
        keywords: ['friend', 'family', 'partner', 'boyfriend', 'girlfriend', 'dost', 'ghar'],
        label: 'Relationship Concern'
    },
    work: {
        keywords: ['work', 'job', 'boss', 'office', 'career', 'kaam', 'naukri'],
        label: 'Work-Related'
    },
    health: {
        keywords: ['health', 'sick', 'pain', 'sleep', 'tired', 'tabiyat', 'neend'],
        label: 'Health Concern'
    }
};

// ============================================
// LAYER 1: RULE-BASED INTENT DETECTION
// ============================================

/**
 * Rule-based intent detection - fast and reliable
 * @param {string} normalizedText - Pre-processed normalized text
 * @returns {Object} { intent, confidence }
 */
function detectRuleBasedIntent(normalizedText) {
    if (!normalizedText) {
        return { intent: null, confidence: 0 };
    }

    for (const [intent, config] of Object.entries(INTENT_PATTERNS)) {
        for (const pattern of config.patterns) {
            if (pattern.test(normalizedText)) {
                return {
                    intent,
                    confidence: config.confidence
                };
            }
        }
    }

    return { intent: null, confidence: 0 };
}

/**
 * Detect secondary intent based on emotion/topic keywords
 */
function detectSecondaryIntent(normalizedText) {
    if (!normalizedText) return null;

    const text = normalizedText.toLowerCase();

    for (const [category, config] of Object.entries(SECONDARY_INTENTS)) {
        for (const keyword of config.keywords) {
            if (text.includes(keyword)) {
                return config.label;
            }
        }
    }

    return null;
}

// ============================================
// LAYER 2: ML/LLM-LIKE SCORING (Heuristic)
// ============================================

/**
 * Simulate ML classifier using weighted keyword analysis
 * In production, this could be replaced with actual ML model calls
 */
function simulateMLIntentClassifier(normalizedText, rawText) {
    if (!normalizedText) {
        return { intent: INTENT_TYPES.CASUAL_CHAT, confidence: 0.5 };
    }

    const text = normalizedText.toLowerCase();
    const scores = {};

    // Initialize scores
    Object.values(INTENT_TYPES).forEach(intent => {
        scores[intent] = 0;
    });

    // Emotional expression signals
    if (/feel|feeling|felt|lag|mehsoos/.test(text)) scores[INTENT_TYPES.EMOTIONAL_EXPRESSION] += 0.4;
    if (/i am|i'm|main hun|mujhe/.test(text)) scores[INTENT_TYPES.EMOTIONAL_EXPRESSION] += 0.2;

    // Question patterns
    if (/\?$/.test(rawText)) {
        scores[INTENT_TYPES.ASKING_FOR_ADVICE] += 0.3;
        scores[INTENT_TYPES.UNDERSTANDING_EMOTIONS] += 0.2;
    }
    if (/why|how|what|when|kyu|kaise|kya/.test(text)) {
        scores[INTENT_TYPES.UNDERSTANDING_EMOTIONS] += 0.3;
    }

    // Help seeking signals
    if (/help|need|want|support|madad|chahiye/.test(text)) {
        scores[INTENT_TYPES.HELP_SEEKING] += 0.4;
    }

    // Venting signals
    if (/fuck|shit|damn|hate|can't stand|ugh|argh|bakwas|bekaar/.test(text)) {
        scores[INTENT_TYPES.VENTING] += 0.5;
    }

    // Greeting signals
    if (/^(hi|hey|hello|namaste|good morning|good evening)/.test(text)) {
        scores[INTENT_TYPES.GREETING] += 0.6;
    }

    // Gratitude signals
    if (/thank|thanks|shukriya|dhanyawad|helpful/.test(text)) {
        scores[INTENT_TYPES.GRATITUDE] += 0.5;
    }

    // Withdrawal signals (short, disengaged responses)
    const wordCount = text.split(/\s+/).length;
    if (wordCount <= 2 && /^(ok|okay|fine|hmm|hm|acha|theek|k)$/i.test(text.trim())) {
        scores[INTENT_TYPES.WITHDRAWAL] += 0.6;
    }

    // Find highest scoring intent
    let maxIntent = INTENT_TYPES.CASUAL_CHAT;
    let maxScore = 0;

    Object.entries(scores).forEach(([intent, score]) => {
        if (score > maxScore) {
            maxScore = score;
            maxIntent = intent;
        }
    });

    // Normalize confidence (0-1 range)
    const confidence = Math.min(0.95, maxScore + 0.3);

    return {
        intent: maxIntent,
        confidence: confidence
    };
}

// ============================================
// LAYER 3: CONTEXTUAL SIGNAL ADJUSTMENT
// ============================================

/**
 * Adjust intent confidence based on pre-processing signals
 */
function adjustConfidenceWithSignals(baseIntent, baseConfidence, preprocessedData) {
    let adjustment = 0;

    // Emoji emotion hint boost
    if (preprocessedData.emoji_emotion_hint) {
        const emotionalHints = ['distress', 'sadness', 'anxiety', 'fear', 'anger'];
        if (emotionalHints.includes(preprocessedData.emoji_emotion_hint)) {
            // Boost emotional intents
            if (baseIntent === INTENT_TYPES.EMOTIONAL_EXPRESSION ||
                baseIntent === INTENT_TYPES.VENTING ||
                baseIntent === INTENT_TYPES.HELP_SEEKING) {
                adjustment += 0.05;
            }
        }
    }

    // Fragmented structure = emotional distress
    if (preprocessedData.structure === 'fragmented') {
        if (baseIntent === INTENT_TYPES.EMOTIONAL_EXPRESSION ||
            baseIntent === INTENT_TYPES.CRISIS) {
            adjustment += 0.05;
        }
    }

    // Very short messages with no specific intent = withdrawal
    if (preprocessedData.message_length === 'very_short') {
        if (baseIntent === INTENT_TYPES.CASUAL_CHAT) {
            // Probably withdrawal
            return {
                intent: INTENT_TYPES.WITHDRAWAL,
                adjustment: -0.10
            };
        }
    }

    // Profanity boosts venting intent
    if (preprocessedData.profanity_level !== 'none') {
        if (baseIntent === INTENT_TYPES.VENTING ||
            baseIntent === INTENT_TYPES.EMOTIONAL_EXPRESSION) {
            adjustment += 0.05;
        }
    }

    // Long rambling messages suggest overwhelm
    if (preprocessedData.message_length === 'very_long' &&
        preprocessedData.structure === 'rambling') {
        adjustment += 0.03;
    }

    return { intent: baseIntent, adjustment };
}

// ============================================
// MAIN INTENT DETECTION FUNCTION
// ============================================

/**
 * Main intent detection function using 3-layer fusion
 * 
 * @param {Object} preprocessedData - Output from messagePreprocessor
 * @param {Array} chatHistory - Recent chat history for context (optional)
 * @returns {Object} Intent detection result
 */
function detectIntent(preprocessedData, chatHistory = []) {
    const { normalized_text, raw_text, crisis_flag } = preprocessedData;

    // CRITICAL: Crisis override - no model opinion allowed
    if (crisis_flag === 'immediate' || crisis_flag === 'likely') {
        return {
            primary_intent: INTENT_TYPES.CRISIS,
            secondary_intent: null,
            confidence: 1.0,
            crisis_override: true,
            action: 'escalate',
            rule_based: { intent: INTENT_TYPES.CRISIS, confidence: 1.0 },
            ml_based: { intent: INTENT_TYPES.CRISIS, confidence: 1.0 },
            signal_adjustment: 0
        };
    }

    // Layer 1: Rule-based detection
    const ruleResult = detectRuleBasedIntent(normalized_text);

    // Layer 2: ML/heuristic classifier
    const mlResult = simulateMLIntentClassifier(normalized_text, raw_text);

    // Layer 3: Contextual signal adjustment
    const primaryIntent = ruleResult.intent || mlResult.intent || INTENT_TYPES.CASUAL_CHAT;
    const signalResult = adjustConfidenceWithSignals(
        primaryIntent,
        Math.max(ruleResult.confidence, mlResult.confidence),
        preprocessedData
    );

    // Final confidence fusion:
    // final_confidence = (rule_confidence * 0.3) + (ml_confidence * 0.6) + (signal_adjustment * 0.1)
    const ruleWeight = 0.3;
    const mlWeight = 0.6;
    const signalWeight = 0.1;

    const finalConfidence = Math.min(1.0, Math.max(0,
        (ruleResult.confidence * ruleWeight) +
        (mlResult.confidence * mlWeight) +
        ((signalResult.adjustment + 0.5) * signalWeight) // Normalize adjustment to 0-1 range
    ));

    // Detect secondary intent
    const secondaryIntent = detectSecondaryIntent(normalized_text);

    // Determine action based on confidence
    let action = 'proceed';
    if (finalConfidence < 0.5) {
        action = 'clarify'; // Ask open-ended question
    } else if (finalConfidence < 0.75) {
        action = 'soft_clarify'; // Respond + soft clarification
    }

    // Crisis flag check for "possible" level
    if (crisis_flag === 'possible') {
        action = 'monitor'; // Increase sensitivity
    }

    return {
        primary_intent: signalResult.intent || primaryIntent,
        secondary_intent: secondaryIntent,
        confidence: parseFloat(finalConfidence.toFixed(2)),
        action,

        // Detailed breakdown for debugging
        rule_based: {
            intent: ruleResult.intent,
            confidence: parseFloat(ruleResult.confidence.toFixed(2))
        },
        ml_based: {
            intent: mlResult.intent,
            confidence: parseFloat(mlResult.confidence.toFixed(2))
        },
        signal_adjustment: parseFloat(signalResult.adjustment.toFixed(2)),

        // Pre-processing signals used
        signals_used: {
            emoji_emotion: preprocessedData.emoji_emotion_hint,
            structure: preprocessedData.structure,
            message_length: preprocessedData.message_length,
            crisis_flag: preprocessedData.crisis_flag,
            profanity: preprocessedData.profanity_level
        }
    };
}

/**
 * Get confidence level label
 */
function getConfidenceLevel(confidence) {
    if (confidence >= 0.75) return 'high';
    if (confidence >= 0.5) return 'medium';
    return 'low';
}

/**
 * Get recommended action based on intent and confidence
 */
function getIntentAction(intentResult) {
    const { primary_intent, confidence, action } = intentResult;

    const actions = {
        'proceed': {
            description: 'High confidence, proceed normally',
            response_modifier: null
        },
        'soft_clarify': {
            description: 'Medium confidence, respond with soft clarification',
            response_modifier: 'Add a gentle follow-up question to better understand'
        },
        'clarify': {
            description: 'Low confidence, ask for clarification',
            response_modifier: 'Ask an open-ended question to understand better'
        },
        'monitor': {
            description: 'Possible crisis flag, increase sensitivity',
            response_modifier: 'Be extra gentle and check on their wellbeing'
        },
        'escalate': {
            description: 'Crisis detected, activate crisis protocol',
            response_modifier: 'Crisis response required - prioritize safety'
        }
    };

    return {
        action,
        ...actions[action] || actions['proceed']
    };
}

// CommonJS exports for Next.js API route compatibility
module.exports = {
    detectIntent,
    getConfidenceLevel,
    getIntentAction,
    INTENT_TYPES,
    SECONDARY_INTENTS
};
