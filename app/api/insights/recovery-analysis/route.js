import { NextResponse } from "next/server";
import clientPromise from "../../../../lib/mongodb";
import { verifyToken } from "../../../../lib/jwt";

// GET - Advanced recovery time analysis
export async function GET(req) {
    try {
        // Get authorization header
        const authHeader = req.headers.get('authorization');
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return NextResponse.json({ error: 'No token provided' }, { status: 401 });
        }

        const token = authHeader.split(' ')[1];
        const decoded = verifyToken(token);

        if (!decoded) {
            return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
        }

        const userId = decoded.firebaseUid || decoded.userId;

        // Connect to MongoDB
        const client = await clientPromise;
        const db = client.db('tara');
        const users = db.collection('users');

        // Get user with moods, journals, and chat data
        const user = await users.findOne(
            { firebaseUid: userId },
            { projection: { moods: 1, journals: 1, chatUsers: 1 } }
        );

        if (!user) {
            return NextResponse.json({
                success: true,
                data: { recoveryTime: 0, confidence: 'low', method: 'no-data' }
            });
        }

        const analysis = analyzeRecoveryPatterns(user);

        return NextResponse.json({
            success: true,
            data: analysis
        });

    } catch (error) {
        console.error('Recovery Analysis API: Error:', error);
        return NextResponse.json({ error: 'Failed to analyze recovery patterns' }, { status: 500 });
    }
}

function analyzeRecoveryPatterns(user) {
    const moods = user.moods || [];
    const journals = user.journals || [];
    const chatUsers = user.chatUsers || [];

    // Combine all emotional data sources
    const emotionalEvents = [];

    // Add mood data
    moods.forEach(mood => {
        if (mood.date && mood.mood) {
            emotionalEvents.push({
                date: mood.date,
                type: 'mood',
                sentiment: getMoodSentiment(mood.mood),
                intensity: mood.intensity || 3,
                source: 'mood-check'
            });
        }
    });

    // Add journal sentiment
    journals.forEach(journal => {
        if (journal.date && journal.content) {
            emotionalEvents.push({
                date: journal.date,
                type: 'journal',
                sentiment: analyzeJournalSentiment(journal.content),
                intensity: 3, // Default intensity
                source: 'journal'
            });
        }
    });

    // Add chat sentiment (recent conversations)
    chatUsers.forEach(chatUser => {
        const conversations = chatUser.conversations || [];
        conversations.forEach(msg => {
            if (msg.sender === 'user' && msg.content && msg.timestamp) {
                const date = new Date(msg.timestamp).toISOString().split('T')[0];
                emotionalEvents.push({
                    date: date,
                    type: 'chat',
                    sentiment: analyzeChatSentiment(msg.content),
                    intensity: 2, // Lower weight for chat
                    source: 'chat'
                });
            }
        });
    });

    // Sort by date
    emotionalEvents.sort((a, b) => new Date(a.date) - new Date(b.date));

    if (emotionalEvents.length < 7) {
        return {
            recoveryTime: 0,
            confidence: 'low',
            method: 'insufficient-data',
            dataPoints: emotionalEvents.length
        };
    }

    // Calculate daily sentiment scores
    const dailyScores = {};
    emotionalEvents.forEach(event => {
        if (!dailyScores[event.date]) {
            dailyScores[event.date] = [];
        }
        dailyScores[event.date].push(event.sentiment * (event.intensity / 3));
    });

    // Average daily scores
    const dailyAverages = {};
    Object.keys(dailyScores).forEach(date => {
        const scores = dailyScores[date];
        dailyAverages[date] = scores.reduce((sum, score) => sum + score, 0) / scores.length;
    });

    // Find recovery periods
    const recoveryPeriods = findRecoveryPeriods(dailyAverages);

    if (recoveryPeriods.length === 0) {
        // Estimate based on overall mood stability
        const allScores = Object.values(dailyAverages);
        const variance = calculateVariance(allScores);
        const avgScore = allScores.reduce((sum, score) => sum + score, 0) / allScores.length;

        let estimatedRecovery;
        if (variance < 0.5 && avgScore > 0) {
            estimatedRecovery = 2; // Very stable, positive mood
        } else if (variance < 1 && avgScore > -0.5) {
            estimatedRecovery = 4; // Moderately stable
        } else if (avgScore < -1) {
            estimatedRecovery = 8; // Generally negative, longer recovery
        } else {
            estimatedRecovery = 5; // Default estimate
        }

        return {
            recoveryTime: estimatedRecovery,
            confidence: 'medium',
            method: 'variance-estimation',
            dataPoints: emotionalEvents.length,
            avgMood: Math.round(avgScore * 100) / 100
        };
    }

    // Calculate average recovery time
    const avgRecovery = Math.round(
        recoveryPeriods.reduce((sum, period) => sum + period, 0) / recoveryPeriods.length
    );

    return {
        recoveryTime: avgRecovery,
        confidence: recoveryPeriods.length >= 3 ? 'high' : 'medium',
        method: 'pattern-analysis',
        dataPoints: emotionalEvents.length,
        recoveryInstances: recoveryPeriods.length
    };
}

function getMoodSentiment(mood) {
    const sentimentMap = {
        'happy': 2,
        'grateful': 2,
        'motivated': 1.5,
        'calm': 1,
        'healing': 0.5,
        'lost': -0.5,
        'lonely': -1.5,
        'sad': -1.5,
        'stressed': -1,
        'anxious': -2,
        'overwhelmed': -2,
        'angry': -2
    };
    return sentimentMap[mood.toLowerCase()] || 0;
}

function analyzeJournalSentiment(content) {
    const text = content.toLowerCase();

    // Positive keywords
    const positiveWords = ['happy', 'good', 'great', 'wonderful', 'amazing', 'love', 'grateful', 'blessed', 'excited', 'joy', 'peaceful', 'calm', 'better', 'improved', 'success', 'achievement'];
    const negativeWords = ['sad', 'bad', 'terrible', 'awful', 'hate', 'angry', 'frustrated', 'worried', 'anxious', 'stressed', 'overwhelmed', 'depressed', 'lonely', 'hurt', 'pain', 'difficult'];

    let positiveCount = 0;
    let negativeCount = 0;

    positiveWords.forEach(word => {
        if (text.includes(word)) positiveCount++;
    });

    negativeWords.forEach(word => {
        if (text.includes(word)) negativeCount++;
    });

    // Calculate sentiment score (-2 to +2)
    const netSentiment = positiveCount - negativeCount;
    return Math.max(-2, Math.min(2, netSentiment * 0.5));
}

function analyzeChatSentiment(content) {
    // Simplified chat sentiment analysis
    const text = content.toLowerCase();

    if (text.includes('feel') && (text.includes('bad') || text.includes('sad') || text.includes('anxious'))) {
        return -1;
    }
    if (text.includes('feel') && (text.includes('good') || text.includes('better') || text.includes('happy'))) {
        return 1;
    }
    if (text.includes('stressed') || text.includes('overwhelmed') || text.includes('worried')) {
        return -1;
    }
    if (text.includes('grateful') || text.includes('thankful') || text.includes('blessed')) {
        return 1;
    }

    return 0; // Neutral
}

function findRecoveryPeriods(dailyAverages) {
    const dates = Object.keys(dailyAverages).sort();
    const recoveryPeriods = [];

    let negativeStart = null;

    for (let i = 0; i < dates.length; i++) {
        const date = dates[i];
        const score = dailyAverages[date];

        // Start tracking negative period
        if (score <= -1 && negativeStart === null) {
            negativeStart = date;
        }

        // End tracking when mood becomes positive
        if (score >= 0.5 && negativeStart !== null) {
            const startDate = new Date(negativeStart);
            const endDate = new Date(date);
            const daysDiff = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24));

            if (daysDiff >= 1 && daysDiff <= 14) { // Reasonable recovery period
                recoveryPeriods.push(daysDiff);
            }

            negativeStart = null;
        }
    }

    return recoveryPeriods;
}

function calculateVariance(numbers) {
    const mean = numbers.reduce((sum, num) => sum + num, 0) / numbers.length;
    const squaredDiffs = numbers.map(num => Math.pow(num - mean, 2));
    return squaredDiffs.reduce((sum, diff) => sum + diff, 0) / numbers.length;
}