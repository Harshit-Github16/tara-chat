
// Logic extracted from app/api/chat/route.js

function detectLanguage(message) {
    if (!message) return 'english';

    const lowerMessage = message.toLowerCase();

    // Hindi/Devanagari script detection
    const hindiPattern = /[\u0900-\u097F]/;
    if (hindiPattern.test(message)) {
        return 'hindi';
    }

    // Common Hindi/Hinglish words
    // NOTE: This list matches the one in app/api/chat/route.js EXACTLY
    const hindiWords = [
        'hai', 'hoon', 'ho', 'hain', 'tha', 'thi', 'the', 'ka', 'ki', 'ke',
        'main', 'mein', 'aap', 'tum', 'kya', 'kaise', 'kaisa', 'kaisi',
        'nahi', 'nahin', 'haan', 'ji', 'acha', 'accha', 'theek', 'thik',
        'bahut', 'bohot', 'bht', 'bhut', 'kuch', 'koi', 'yaar', 'bhai', 'dost',
        'kar', 'karo', 'karna', 'raha', 'rahi', 'rahe', 'gaya', 'gayi', 'gaye',
        'kal', 'aaj', 'aj', 'abhi', 'phir', 'wala', 'wali', 'wale',
        'hu', 'hoon', 'khush', 'khus', 'mere', 'mre', 'mera', 'meri',
        'tera', 'tere', 'teri', 'uska', 'uske', 'uski', 'apna', 'apne', 'apni',
        'kya', 'kyu', 'kyun', 'kaise', 'kese', 'kaun', 'kon', 'kab', 'kaha', 'kha',
        'se', 'ko', 'ne', 'me', 'pe', 'par', 'or', 'aur', 'ya', 'lekin', 'magar',
        'toh', 'to', 'bhi', 'na', 'mat', 'kya', 'kuch', 'sab', 'sabhi'
    ];

    const words = lowerMessage.split(/\s+/).filter(w => w.length > 0);

    // Count exact matches only
    const hindiWordCount = words.filter(word => hindiWords.includes(word)).length;
    const ratio = hindiWordCount / words.length;

    console.log(`Message: "${message}"`);
    console.log(`Words: ${JSON.stringify(words)}`);
    console.log(`Hindi Matches: ${hindiWordCount}`);
    console.log(`Ratio: ${ratio}`);

    // Strict detection logic
    if (words.length <= 2) {
        if (hindiWordCount >= 1 && !words.includes('hi')) return 'hinglish';
        return 'english';
    }

    // If more than 20% words are Hindi/Hinglish, consider it Hinglish
    if (ratio > 0.2) {
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

const messages = [
    "or bta kya krrhi h",
    "bro please hindi",
    "kya hal hai",
    "tu kaisa hai"
];

messages.forEach(msg => {
    console.log(`Result: ${detectLanguage(msg)}`);
    console.log('---');
});
