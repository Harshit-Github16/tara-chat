// Test language detection function

function detectLanguage(message) {
    if (!message) return 'english';

    const lowerMessage = message.toLowerCase();

    // Hindi/Devanagari script detection
    const hindiPattern = /[\u0900-\u097F]/;
    if (hindiPattern.test(message)) {
        return 'hindi';
    }

    // Common Hindi/Hinglish words
    const hindiWords = [
        'hai', 'hoon', 'ho', 'hain', 'tha', 'thi', 'the', 'ka', 'ki', 'ke',
        'main', 'mein', 'aap', 'tum', 'kya', 'kaise', 'kaisa', 'kaisi',
        'nahi', 'nahin', 'haan', 'ji', 'acha', 'accha', 'theek', 'thik',
        'bahut', 'bohot', 'kuch', 'koi', 'yaar', 'bhai', 'dost',
        'kar', 'karo', 'karna', 'raha', 'rahi', 'rahe', 'gaya', 'gayi', 'gaye',
        'kal', 'aaj', 'abhi', 'phir', 'wala', 'wali', 'wale'
    ];

    const words = lowerMessage.split(/\s+/);
    const hindiWordCount = words.filter(word => hindiWords.includes(word)).length;

    // If more than 30% words are Hindi/Hinglish, consider it Hinglish
    if (hindiWordCount / words.length > 0.3) {
        return 'hinglish';
    }

    // Check for common English patterns
    const englishPattern = /^[a-z\s.,!?'"]+$/i;
    if (englishPattern.test(message)) {
        return 'english';
    }

    // Default to English if uncertain
    return 'english';
}

// Test cases
const testMessages = [
    "I am very stressed",
    "Main bahut pareshan hoon",
    "Yaar main bahut stressed hoon",
    "Hello how are you",
    "Kya haal hai",
    "I'm feeling good today",
    "Aaj main bahut khush hoon",
    "Work is stressful",
    "Kaam me bahut tension hai"
];

console.log('Language Detection Tests:\n');
testMessages.forEach(msg => {
    const lang = detectLanguage(msg);
    console.log(`"${msg}" -> ${lang}`);
});
