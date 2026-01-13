/**
 * Message Pre-Processor for Tara Chat
 * Step 1 of the Chat Response Strategy Pipeline
 * 
 * Pipeline Flow:
 * User Message → Pre-Processing → Intent Detection → Conversation Memory Fetch
 * → Response Strategy Selector → LLM Prompt Builder → LLM Response
 * → Safety Filter + Tone Check → Final Response
 */

// Use require for Next.js API route compatibility
const { detectLanguage } = require('./languageDetection');

// ============================================
// EMOJI TO EMOTION SIGNAL MAPPING
// ============================================
const EMOJI_EMOTION_MAP = {
    // Distress / Sadness
    '😭': 'distress',
    '😢': 'sadness',
    '😿': 'sadness',
    '💔': 'heartbreak',
    '🥺': 'vulnerability',
    '😞': 'disappointment',
    '😔': 'sadness',
    '😥': 'sadness',
    '😰': 'anxiety',
    '😨': 'fear',
    '😱': 'extreme_fear',
    '🫠': 'overwhelm',

    // Anger
    '😡': 'anger',
    '😠': 'anger',
    '🤬': 'rage',
    '💢': 'anger',
    '👿': 'anger',

    // Anxiety / Worry
    '😟': 'worry',
    '😬': 'nervousness',
    '🫣': 'anxiety',
    '😵': 'overwhelm',
    '😵‍💫': 'confusion',

    // Numbness / Emptiness
    '😶': 'numbness',
    '😐': 'neutral',
    '😑': 'numbness',
    '🫥': 'emptiness',
    '💭': 'contemplation',

    // Joy / Happiness
    '😊': 'happiness',
    '😁': 'joy',
    '😄': 'joy',
    '🥰': 'love',
    '😍': 'love',
    '🤗': 'warmth',
    '💕': 'love',
    '❤️': 'love',
    '💛': 'care',
    '✨': 'excitement',
    '🎉': 'celebration',
    '🥳': 'celebration',

    // Gratitude
    '🙏': 'gratitude',
    '💖': 'gratitude',
    '🫶': 'gratitude',

    // Tiredness
    '😴': 'tiredness',
    '🥱': 'tiredness',
    '😪': 'tiredness',
    '😩': 'exhaustion',
    '🫡': 'resignation',

    // Hope / Positive
    '🌈': 'hope',
    '☀️': 'optimism',
    '🌻': 'positivity',
    '💪': 'determination',
    '🔥': 'motivation'
};

// ============================================
// CRISIS KEYWORDS (MULTI-LEVEL)
// ============================================
const CRISIS_KEYWORDS = {
    immediate: [
        'i will hurt myself',
        'i will kill myself',
        'going to end it',
        'goodbye forever',
        'this is the end',
        'mujhe mar jana hai',
        'suicide kar lunga',
        'suicide kar lungi',
        'ab nahi reh sakta',
        'ab nahi reh sakti',
        'planning to end'
    ],
    likely: [
        'want to die',
        'dont want to live',
        "don't want to live",
        'wish i was dead',
        'better off dead',
        'no reason to live',
        'nothing to live for',
        'want to end it all',
        'marna chahta hun',
        'marna chahti hun',
        'jeena nahi chahta',
        'jeena nahi chahti',
        'life khatam karna'
    ],
    possible: [
        'whats the point',
        "what's the point",
        'feel like giving up',
        'cant go on',
        "can't go on",
        'hopeless',
        'worthless',
        'nobody cares',
        'koi fayda nahi',
        'koi matlab nahi',
        'har gaya',
        'har gayi',
        'thak gaya',
        'thak gayi',
        'akela hun',
        'akeli hun'
    ]
};

// ============================================
// PROFANITY DETECTION (OPTIONAL BUT HELPFUL)
// ============================================
const PROFANITY_WORDS = {
    mild: ['damn', 'hell', 'crap', 'sucks', 'bakwas', 'bewakoof'],
    medium: ['shit', 'ass', 'pissed', 'saala', 'kamina', 'harami'],
    severe: ['fuck', 'bitch', 'bastard', 'madarchod', 'behenchod', 'chutiya']
};

// ============================================
// UTILITY FUNCTIONS
// ============================================

/**
 * Extract emojis from text
 */
function extractEmojis(text) {
    if (!text) return [];

    // Unicode emoji regex pattern
    const emojiRegex = /[\u{1F600}-\u{1F64F}]|[\u{1F300}-\u{1F5FF}]|[\u{1F680}-\u{1F6FF}]|[\u{1F1E0}-\u{1F1FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]|[\u{FE00}-\u{FE0F}]|[\u{1F900}-\u{1F9FF}]|[\u{1FA00}-\u{1FA6F}]|[\u{1FA70}-\u{1FAFF}]|[\u{231A}-\u{231B}]|[\u{23E9}-\u{23F3}]|[\u{23F8}-\u{23FA}]|[\u{25AA}-\u{25AB}]|[\u{25B6}]|[\u{25C0}]|[\u{25FB}-\u{25FE}]|[\u{2614}-\u{2615}]|[\u{2648}-\u{2653}]|[\u{267F}]|[\u{2693}]|[\u{26A1}]|[\u{26AA}-\u{26AB}]|[\u{26BD}-\u{26BE}]|[\u{26C4}-\u{26C5}]|[\u{26CE}]|[\u{26D4}]|[\u{26EA}]|[\u{26F2}-\u{26F3}]|[\u{26F5}]|[\u{26FA}]|[\u{26FD}]|[\u{2702}]|[\u{2705}]|[\u{2708}-\u{270D}]|[\u{270F}]|[\u{2712}]|[\u{2714}]|[\u{2716}]|[\u{271D}]|[\u{2721}]|[\u{2728}]|[\u{2733}-\u{2734}]|[\u{2744}]|[\u{2747}]|[\u{274C}]|[\u{274E}]|[\u{2753}-\u{2755}]|[\u{2757}]|[\u{2763}-\u{2764}]|[\u{2795}-\u{2797}]|[\u{27A1}]|[\u{27B0}]|[\u{27BF}]|[\u{2934}-\u{2935}]|[\u{2B05}-\u{2B07}]|[\u{2B1B}-\u{2B1C}]|[\u{2B50}]|[\u{2B55}]|[\u{3030}]|[\u{303D}]|[\u{3297}]|[\u{3299}]|❤️|💕|💔|💖|💗|💙|💚|💛|💜|🖤|🤍|🤎|💯|💢|💥|💫|💦|💨|🕳️|💬|👁️‍🗨️|🗨️|🗯️|💭|💤/gu;

    const matches = text.match(emojiRegex);
    return matches ? [...new Set(matches)] : [];
}

/**
 * Get primary emotion signal from emojis
 */
function getEmojiEmotionHint(emojis) {
    if (!emojis || emojis.length === 0) return null;

    // Priority: distress > sadness > anxiety > anger > joy
    const priorities = ['distress', 'extreme_fear', 'rage', 'heartbreak', 'anxiety',
        'fear', 'anger', 'sadness', 'overwhelm', 'exhaustion',
        'vulnerability', 'disappointment', 'worry', 'numbness',
        'tiredness', 'joy', 'happiness', 'love', 'celebration'];

    const signals = emojis.map(e => EMOJI_EMOTION_MAP[e]).filter(Boolean);

    for (const priority of priorities) {
        if (signals.includes(priority)) return priority;
    }

    return signals[0] || null;
}

/**
 * Normalize text for processing
 * - Convert to lowercase
 * - Remove extra spaces
 * - Normalize repeated characters (sooo → so)
 */
function normalizeText(text) {
    if (!text) return '';

    let normalized = text
        .toLowerCase()
        .trim()
        // Remove extra whitespace
        .replace(/\s+/g, ' ')
        // Normalize repeated vowels (sooo → so, hiii → hi)
        .replace(/(.)\1{2,}/g, '$1$1')
        // Normalize repeated punctuation
        .replace(/([!?.])\1+/g, '$1');

    return normalized;
}

/**
 * Check for crisis keywords
 * Returns: 'none' | 'possible' | 'likely' | 'immediate'
 */
function detectCrisisFlag(normalizedText) {
    if (!normalizedText) return 'none';

    const text = normalizedText.toLowerCase();

    // Check immediate first (highest priority)
    for (const keyword of CRISIS_KEYWORDS.immediate) {
        if (text.includes(keyword)) return 'immediate';
    }

    // Check likely
    for (const keyword of CRISIS_KEYWORDS.likely) {
        if (text.includes(keyword)) return 'likely';
    }

    // Check possible
    for (const keyword of CRISIS_KEYWORDS.possible) {
        if (text.includes(keyword)) return 'possible';
    }

    return 'none';
}

/**
 * Detect profanity level
 * Returns: 'none' | 'mild' | 'medium' | 'severe'
 */
function detectProfanity(normalizedText) {
    if (!normalizedText) return 'none';

    const text = normalizedText.toLowerCase();

    // Check severe first
    for (const word of PROFANITY_WORDS.severe) {
        if (text.includes(word)) return 'severe';
    }

    // Check medium
    for (const word of PROFANITY_WORDS.medium) {
        if (text.includes(word)) return 'medium';
    }

    // Check mild
    for (const word of PROFANITY_WORDS.mild) {
        if (text.includes(word)) return 'mild';
    }

    return 'none';
}

/**
 * Analyze message length
 * Returns: 'very_short' | 'short' | 'medium' | 'long' | 'very_long'
 */
function analyzeMessageLength(text) {
    if (!text) return 'very_short';

    const wordCount = text.trim().split(/\s+/).filter(w => w.length > 0).length;

    if (wordCount <= 2) return 'very_short';
    if (wordCount <= 10) return 'short';
    if (wordCount <= 30) return 'medium';
    if (wordCount <= 80) return 'long';
    return 'very_long';
}

/**
 * Analyze message structure
 * Returns: 'simple' | 'fragmented' | 'rambling' | 'abrupt' | 'confused'
 */
function analyzeMessageStructure(text) {
    if (!text) return 'simple';

    const trimmed = text.trim();

    // Check for fragmented (broken phrases with ellipsis or incomplete sentences)
    if (trimmed.includes('...') ||
        trimmed.includes('…') ||
        /[^.!?]\s*$/.test(trimmed) && trimmed.split(/\s+/).length < 5) {
        return 'fragmented';
    }

    // Check for abrupt (short, sudden stop)
    if (trimmed.split(/\s+/).length <= 5 &&
        (trimmed.includes("can't") ||
            trimmed.includes("won't") ||
            trimmed.includes("don't") ||
            trimmed.includes('nahi') ||
            trimmed.includes('bas'))) {
        return 'abrupt';
    }

    // Check for confused (contradictory statements)
    const confusedPatterns = [
        /i('m| am) (fine|ok|okay).*(but|yet)/i,
        /happy.*(but|yet).*sad/i,
        /sad.*(but|yet).*happy/i,
        /don't know.*but/i,
        /pata nahi.*lekin/i
    ];
    for (const pattern of confusedPatterns) {
        if (pattern.test(trimmed)) return 'confused';
    }

    // Check for rambling (long, repetitive)
    const wordCount = trimmed.split(/\s+/).length;
    const sentences = trimmed.split(/[.!?]+/).filter(s => s.trim());
    if (wordCount > 40 && sentences.length > 3) {
        return 'rambling';
    }

    return 'simple';
}

/**
 * Get length signal for response strategy
 */
function getLengthSignal(lengthValue) {
    const signals = {
        'very_short': 'withdrawal',
        'short': 'guarded',
        'medium': 'normal',
        'long': 'overwhelm',
        'very_long': 'high_load'
    };
    return signals[lengthValue] || 'normal';
}

/**
 * Get structure signal for response strategy
 */
function getStructureSignal(structureValue) {
    const signals = {
        'simple': 'stable',
        'fragmented': 'distress',
        'rambling': 'overwhelm',
        'abrupt': 'risk',
        'confused': 'emotional_confusion'
    };
    return signals[structureValue] || 'stable';
}

// ============================================
// MAIN PRE-PROCESSOR FUNCTION
// ============================================

/**
 * Main pre-processing function
 * Takes raw user message and returns structured pre-processed output
 * 
 * @param {string} rawText - Original user message (NEVER modify this)
 * @returns {Object} Pre-processed message data
 */
function preprocessMessage(rawText) {
    // 1. Capture raw input (never modify)
    const raw_text = rawText || '';

    // 2. Normalize text
    const normalized_text = normalizeText(raw_text);

    // 3. Extract emojis
    const emojis = extractEmojis(raw_text);

    // 4. Get emoji emotion hint
    const emoji_emotion_hint = getEmojiEmotionHint(emojis);

    // 5. Detect language
    const language = detectLanguage(raw_text);

    // 6. Check for profanity
    const profanity_level = detectProfanity(normalized_text);

    // 7. Crisis keyword scan (soft check)
    const crisis_flag = detectCrisisFlag(normalized_text);

    // 8. Analyze message length
    const message_length = analyzeMessageLength(raw_text);

    // 9. Analyze message structure
    const structure = analyzeMessageStructure(raw_text);

    // 10. Get behavioral signals
    const length_signal = getLengthSignal(message_length);
    const structure_signal = getStructureSignal(structure);

    // Return complete pre-processed output
    return {
        // Core data
        raw_text,
        normalized_text,

        // Language
        language,

        // Emoji analysis
        emojis,
        emoji_emotion_hint,

        // Safety signals
        profanity_level,
        crisis_flag,

        // Structure analysis
        message_length,
        structure,

        // Behavioral signals (for downstream)
        length_signal,
        structure_signal,

        // Metadata
        timestamp: new Date().toISOString(),
        word_count: raw_text.trim().split(/\s+/).filter(w => w.length > 0).length
    };
}

/**
 * Quick check for crisis - use this before full preprocessing
 * when you need to fast-track crisis detection
 */
function quickCrisisCheck(text) {
    if (!text) return false;
    const normalized = normalizeText(text);
    const flag = detectCrisisFlag(normalized);
    return flag === 'immediate' || flag === 'likely';
}

/**
 * Get crisis response message based on flag level
 */
function getCrisisResponse(crisisFlag, language = 'english') {
    const responses = {
        immediate: {
            english: "I hear you, and I'm here for you. Please know that you matter. If you're in danger, please reach out to a crisis helpline immediately. In India: iCall (9152987821) or Vandrevala Foundation (1860-2662-345). I care about you. 💙",
            hindi: "Main yahan hoon tumhare liye. Tum bahut important ho. Agar tum danger mein ho, please crisis helpline ko call karo. India: iCall (9152987821) ya Vandrevala Foundation (1860-2662-345). Main tumhare baare mein care karti hoon. 💙",
            hinglish: "Main yahan hoon tumhare liye. Tum matter karte ho. Agar danger mein ho, please crisis helpline call karo. India: iCall (9152987821) ya Vandrevala Foundation (1860-2662-345). 💙"
        },
        likely: {
            english: "I'm really concerned about you. It sounds like you're going through something incredibly painful. Please know that help is available. Would you be open to talking to someone who can support you? iCall: 9152987821 💙",
            hindi: "Mujhe tumhari bahut chinta ho rahi hai. Lagta hai tum bahut mushkil waqt se guzar rahe ho. Please kisi se baat karo jo madad kar sake. iCall: 9152987821 💙",
            hinglish: "Mujhe tumhari bahut chinta ho rahi hai. Bahut tough time hai. Kisi se baat karoge jo help kar sake? iCall: 9152987821 💙"
        },
        possible: {
            english: "It sounds like things are really heavy right now. I'm here to listen. Would you like to share more about what's going on?",
            hindi: "Lagta hai bahut mushkil waqt chal raha hai. Main yahan hoon sunne ke liye. Aur batana chahoge kya ho raha hai?",
            hinglish: "Bahut heavy lag raha hai abhi. Main yahan hoon. Aur batao kya chal raha hai?"
        }
    };

    return responses[crisisFlag]?.[language] || responses[crisisFlag]?.english || null;
}

// CommonJS exports for Next.js API route compatibility
module.exports = {
    preprocessMessage,
    quickCrisisCheck,
    getCrisisResponse,
    EMOJI_EMOTION_MAP,
    CRISIS_KEYWORDS
};
