/**
 * Centralized language detection utility for Tara Chat
 */

export function detectLanguage(message) {
    if (!message) return 'english';

    const lowerMessage = message.toLowerCase().trim();

    // 1. Explicit Language Requests (High Priority)
    // "please hindi", "hindi me bolo", "speak in hindi", "hindi please"
    if (/(please|speak|talk|can you).*(hindi)/i.test(lowerMessage) ||
        /(hindi).*(please|me|mai|mein)/i.test(lowerMessage)) {
        return 'hindi';
    }

    // "please english", "english me bolo"
    if (/(please|speak|talk|can you).*(english)/i.test(lowerMessage) ||
        /(english).*(please|me|mai|mein)/i.test(lowerMessage)) {
        return 'english';
    }

    // 2. Script Detection
    // Hindi/Devanagari script detection
    const hindiPattern = /[\u0900-\u097F]/;
    if (hindiPattern.test(message)) {
        return 'hindi';
    }

    // 3. Common Hindi/Hinglish words used in Roman script
    // Expanded list for better detection
    const hindiWords = [
        'hai', 'hain', 'houn', 'hun', 'hu', 'h', // verbs
        'tha', 'thi', 'the', 'thaa', 'thii', 'thee', // past
        'ka', 'ki', 'ke', 'ko', 'ne', 'se', 'me', 'mein', 'par', 'pe', // prepositions
        'main', 'hum', 'tum', 'aap', 'tu', // pronouns
        'kya', 'kyun', 'kyu', 'kab', 'kahan', 'kaise', 'kaun', 'kisko', 'kisne', 'kese', 'kon', // questions
        'nahi', 'nahin', 'na', 'mat', 'nhi', // negatives
        'haan', 'ji', 'han', // affirmatives
        'acha', 'accha', 'achha', 'bura', 'kharab', // adjectives
        'bahut', 'bohot', 'jyada', 'kam', 'bht', 'bhut', // quantifiers
        'kuch', 'koi', 'sab', 'sabhi', 'kuchh', // quantifiers
        'yaar', 'bhai', 'dost', // address
        'kar', 'karo', 'karna', 'kiya', 'krrhi', 'krra', 'karunga', 'karungi', 'kr', // do verbs
        'raha', 'rahi', 'rahe', 'rha', 'rhi', 'rhe', // continuous markers
        'gaya', 'gayi', 'gaye', 'gya', 'gyi', 'gye', // past markers
        'kal', 'aaj', 'aj', 'abhi', 'jab', 'tab', // time
        'wala', 'wali', 'wale', // possession/type
        'khush', 'dukhi', 'pareshan', 'gussa', // emotions
        'mere', 'meri', 'mera', 'mre', // possessive
        'tere', 'teri', 'tera', // possessive
        'uska', 'uski', 'uske', // possessive
        'apna', 'apni', 'apne', // possessive
        'aur', 'or', 'evam', 'tatha', // conjunctions
        'lekin', 'magar', 'parantu', // conjunctions
        'bhi', 'to', 'toh', // particles
        'samajh', 'soch', 'lag', 'dekh', 'sun', 'bol', // common roots
        'theek', 'thik', 'sahi', 'galat' // status
    ];

    const words = lowerMessage.split(/[\s.,!?]+/).filter(w => w.length > 0);

    // Count exact matches
    const hindiWordCount = words.filter(word => hindiWords.includes(word)).length;

    // Calculate ratio
    const ratio = words.length > 0 ? hindiWordCount / words.length : 0;

    // 4. Strict Detection Logic

    // Usage of "Start fresh" or "reset" usually implies a command, likely English unless mixed
    if (lowerMessage.includes('start fresh') || lowerMessage.includes('reset')) {
        return ratio > 0.5 ? 'hinglish' : 'english';
    }

    // Very short messages (1-2 words)
    if (words.length <= 2) {
        // If it contains unambiguous Hindi words, it's Hinglish/Hindi
        // Exclude 'hi' which is also English
        if (hindiWordCount >= 1 && !words.includes('hi')) return 'hinglish';

        // "or bta", "kya hal" -> definitely hinglish
        if (words.includes('or') || words.includes('kya') || words.includes('bta')) return 'hinglish';

        return 'english';
    }

    // If matches > 15% (lowered from 20%), consider it Hinglish
    // Lower threshold because Hinglish often mixes a lot of English nouns
    if (ratio >= 0.15) {
        return 'hinglish';
    }

    // Check for specific Hinglish patterns that might get missed by simple word count
    // e.g. "krrhi h" (kar rahi hai)
    if (/krrhi|krra|karna|karni/.test(lowerMessage)) return 'hinglish';

    // Check for common English patterns
    const englishPattern = /^[a-z\s.,!?'"]+$/i;
    if (englishPattern.test(message) && ratio < 0.1) {
        return 'english';
    }

    // Default to English
    return 'english';
}
