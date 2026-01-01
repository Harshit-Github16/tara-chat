// Pattern Analysis Utility for detecting user stress patterns from chat and journals

// Stress indicators in different languages
const STRESS_KEYWORDS = {
    english: [
        'stress', 'stressed', 'anxiety', 'anxious', 'worried', 'worry', 'tension',
        'pressure', 'overwhelmed', 'exhausted', 'tired', 'depressed', 'sad',
        'angry', 'frustrated', 'upset', 'crying', 'cry', 'help', 'difficult',
        'hard', 'can\'t', 'unable', 'fail', 'failed', 'problem', 'issue',
        'scared', 'fear', 'panic', 'nervous', 'restless', 'sleepless'
    ],
    hindi: [
        'pareshan', 'pareshani', 'tension', 'chinta', 'dar', 'dukh', 'dukhi',
        'thak', 'thaka', 'gussa', 'naraz', 'rona', 'ro', 'mushkil', 'problem',
        'takleef', 'pareshanी', 'ghabra', 'ghabrahat', 'neend nahi', 'sone me dikkat'
    ],
    hinglish: [
        'pareshan', 'tension', 'stress', 'thak gaya', 'thak gayi', 'gussa',
        'dukhi', 'sad', 'ro raha', 'ro rahi', 'mushkil', 'problem hai',
        'nahi ho raha', 'nahi ho paa raha', 'dar lag raha', 'ghabra raha'
    ]
};

// Positive indicators (to balance the analysis)
const POSITIVE_KEYWORDS = {
    english: ['happy', 'good', 'great', 'excellent', 'better', 'fine', 'okay', 'nice', 'wonderful', 'amazing', 'calm', 'peaceful', 'relaxed'],
    hindi: ['khush', 'accha', 'badhiya', 'theek', 'mast', 'shant', 'sukoon'],
    hinglish: ['khush', 'accha', 'badhiya', 'theek hai', 'mast', 'chill', 'relax']
};

/**
 * Analyze a single message for stress indicators
 * @param {string} message - The message to analyze
 * @returns {Object} - Analysis result with stress score and indicators
 */
export function analyzeMessage(message) {
    if (!message || typeof message !== 'string') {
        return { stressScore: 0, indicators: [], sentiment: 'neutral' };
    }

    const lowerMessage = message.toLowerCase();
    const indicators = [];
    let stressScore = 0;
    let positiveScore = 0;

    // Check for stress keywords
    Object.values(STRESS_KEYWORDS).flat().forEach(keyword => {
        if (lowerMessage.includes(keyword)) {
            indicators.push(keyword);
            stressScore += 1;
        }
    });

    // Check for positive keywords
    Object.values(POSITIVE_KEYWORDS).flat().forEach(keyword => {
        if (lowerMessage.includes(keyword)) {
            positiveScore += 1;
        }
    });

    // Check message length (very short messages might indicate disengagement)
    const wordCount = message.trim().split(/\s+/).length;
    if (wordCount <= 2 && !positiveScore) {
        stressScore += 0.5; // Slight increase for very short messages
    }

    // Check for excessive punctuation (!!!, ???)
    const exclamationCount = (message.match(/!/g) || []).length;
    const questionCount = (message.match(/\?/g) || []).length;
    if (exclamationCount > 2 || questionCount > 2) {
        stressScore += 0.5;
    }

    // Determine sentiment
    let sentiment = 'neutral';
    if (stressScore > positiveScore + 1) {
        sentiment = 'negative';
    } else if (positiveScore > stressScore + 1) {
        sentiment = 'positive';
    }

    return {
        stressScore: Math.min(stressScore, 10), // Cap at 10
        positiveScore,
        indicators,
        sentiment,
        wordCount
    };
}

/**
 * Analyze chat history for patterns over multiple days
 * @param {Array} chatHistory - Array of chat messages with timestamps
 * @param {number} daysToAnalyze - Number of days to look back (default 3)
 * @returns {Object} - Pattern analysis result
 */
export function analyzeChatPattern(chatHistory, daysToAnalyze = 3) {
    if (!chatHistory || chatHistory.length === 0) {
        return {
            shouldSuggestDASS21: false,
            averageStressScore: 0,
            consecutiveStressedDays: 0,
            dailyAnalysis: [],
            reason: 'No chat history available'
        };
    }

    // Group messages by day
    const messagesByDay = {};
    const now = new Date();
    const cutoffDate = new Date(now.getTime() - (daysToAnalyze * 24 * 60 * 60 * 1000));

    chatHistory.forEach(msg => {
        if (msg.sender !== 'user') return; // Only analyze user messages

        const msgDate = new Date(msg.timestamp);
        if (msgDate < cutoffDate) return; // Skip old messages

        const dayKey = msgDate.toISOString().split('T')[0]; // YYYY-MM-DD
        if (!messagesByDay[dayKey]) {
            messagesByDay[dayKey] = [];
        }
        messagesByDay[dayKey].push(msg);
    });

    // Analyze each day
    const dailyAnalysis = [];
    Object.keys(messagesByDay).sort().forEach(day => {
        const dayMessages = messagesByDay[day];
        let totalStressScore = 0;
        let totalPositiveScore = 0;
        const allIndicators = [];

        dayMessages.forEach(msg => {
            const analysis = analyzeMessage(msg.content);
            totalStressScore += analysis.stressScore;
            totalPositiveScore += analysis.positiveScore;
            allIndicators.push(...analysis.indicators);
        });

        const avgStressScore = totalStressScore / dayMessages.length;
        const avgPositiveScore = totalPositiveScore / dayMessages.length;

        dailyAnalysis.push({
            date: day,
            messageCount: dayMessages.length,
            avgStressScore,
            avgPositiveScore,
            isStressed: avgStressScore > 2 && avgStressScore > avgPositiveScore,
            indicators: [...new Set(allIndicators)] // Unique indicators
        });
    });

    // Calculate consecutive stressed days
    let consecutiveStressedDays = 0;
    for (let i = dailyAnalysis.length - 1; i >= 0; i--) {
        if (dailyAnalysis[i].isStressed) {
            consecutiveStressedDays++;
        } else {
            break; // Stop at first non-stressed day
        }
    }

    // Calculate overall average stress score
    const totalStress = dailyAnalysis.reduce((sum, day) => sum + day.avgStressScore, 0);
    const averageStressScore = dailyAnalysis.length > 0 ? totalStress / dailyAnalysis.length : 0;

    // Determine if DASS-21 should be suggested
    const shouldSuggestDASS21 = consecutiveStressedDays >= 2 && averageStressScore >= 2.5;

    return {
        shouldSuggestDASS21,
        averageStressScore: parseFloat(averageStressScore.toFixed(2)),
        consecutiveStressedDays,
        dailyAnalysis,
        totalDaysAnalyzed: dailyAnalysis.length,
        reason: shouldSuggestDASS21
            ? `User shows consistent stress pattern for ${consecutiveStressedDays} consecutive days`
            : 'No consistent stress pattern detected'
    };
}

/**
 * Analyze journal entries for stress patterns
 * @param {Array} journals - Array of journal entries
 * @param {number} daysToAnalyze - Number of days to look back
 * @returns {Object} - Journal analysis result
 */
export function analyzeJournalPattern(journals, daysToAnalyze = 3) {
    if (!journals || journals.length === 0) {
        return {
            averageStressScore: 0,
            stressedJournalCount: 0,
            totalJournals: 0,
            reason: 'No journals available'
        };
    }

    const now = new Date();
    const cutoffDate = new Date(now.getTime() - (daysToAnalyze * 24 * 60 * 60 * 1000));

    const recentJournals = journals.filter(journal => {
        const journalDate = new Date(journal.createdAt || journal.timestamp);
        return journalDate >= cutoffDate;
    });

    let totalStressScore = 0;
    let stressedJournalCount = 0;

    recentJournals.forEach(journal => {
        const content = journal.content || journal.text || '';
        const title = journal.title || '';
        const fullText = `${title} ${content}`;

        const analysis = analyzeMessage(fullText);
        totalStressScore += analysis.stressScore;

        if (analysis.stressScore > 2) {
            stressedJournalCount++;
        }
    });

    const averageStressScore = recentJournals.length > 0
        ? totalStressScore / recentJournals.length
        : 0;

    return {
        averageStressScore: parseFloat(averageStressScore.toFixed(2)),
        stressedJournalCount,
        totalJournals: recentJournals.length,
        reason: stressedJournalCount > 0
            ? `${stressedJournalCount} out of ${recentJournals.length} recent journals show stress`
            : 'No stress detected in recent journals'
    };
}

/**
 * Combined analysis of chat and journal patterns
 * @param {Array} chatHistory - Chat messages
 * @param {Array} journals - Journal entries
 * @param {number} daysToAnalyze - Days to look back
 * @returns {Object} - Complete pattern analysis
 */
export function analyzeUserPattern(chatHistory, journals, daysToAnalyze = 3) {
    const chatAnalysis = analyzeChatPattern(chatHistory, daysToAnalyze);
    const journalAnalysis = analyzeJournalPattern(journals, daysToAnalyze);

    // Combined stress score (weighted: 70% chat, 30% journal)
    const combinedStressScore = (chatAnalysis.averageStressScore * 0.7) +
        (journalAnalysis.averageStressScore * 0.3);

    // Should suggest DASS-21 if:
    // 1. Chat shows consistent stress pattern, OR
    // 2. Combined stress score is high (>3) and user has been active
    const shouldSuggestDASS21 = chatAnalysis.shouldSuggestDASS21 ||
        (combinedStressScore >= 3 && chatAnalysis.totalDaysAnalyzed >= 2);

    return {
        shouldSuggestDASS21,
        combinedStressScore: parseFloat(combinedStressScore.toFixed(2)),
        chatAnalysis,
        journalAnalysis,
        recommendation: shouldSuggestDASS21
            ? 'Suggest DASS-21 assessment to better understand mental health status'
            : 'Continue monitoring, no immediate assessment needed',
        confidence: calculateConfidence(chatAnalysis, journalAnalysis)
    };
}

/**
 * Calculate confidence level of the analysis
 */
function calculateConfidence(chatAnalysis, journalAnalysis) {
    let confidence = 0;

    // More data = higher confidence
    if (chatAnalysis.totalDaysAnalyzed >= 3) confidence += 30;
    else if (chatAnalysis.totalDaysAnalyzed >= 2) confidence += 20;
    else confidence += 10;

    // Consistent pattern = higher confidence
    if (chatAnalysis.consecutiveStressedDays >= 3) confidence += 40;
    else if (chatAnalysis.consecutiveStressedDays >= 2) confidence += 25;

    // Journal data adds confidence
    if (journalAnalysis.totalJournals >= 2) confidence += 20;
    else if (journalAnalysis.totalJournals >= 1) confidence += 10;

    // High stress score = higher confidence
    if (chatAnalysis.averageStressScore >= 4) confidence += 10;

    return Math.min(confidence, 100);
}
