import { NextResponse } from 'next/server';
import clientPromise from '../../../lib/mongodb';
import { verifyToken } from '../../../lib/jwt';
import { analyzeUserPattern } from '../../utils/patternAnalysis';

/**
 * GET - Analyze user's chat and journal patterns to detect stress
 * Returns whether DASS-21 should be suggested
 */
export async function GET(request) {
    try {
        console.log('=== PATTERN ANALYSIS API CALLED ===');

        // Get authorization header
        const authHeader = request.headers.get('authorization');
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return NextResponse.json({ error: 'No token provided' }, { status: 401 });
        }

        const token = authHeader.split(' ')[1];
        const decoded = verifyToken(token);

        if (!decoded) {
            return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
        }

        const userId = decoded.firebaseUid || decoded.userId;
        console.log('Pattern Analysis: Analyzing for user:', userId);

        // Get query parameters
        const { searchParams } = new URL(request.url);
        const daysToAnalyze = parseInt(searchParams.get('days')) || 3;
        const chatUserId = searchParams.get('chatUserId') || 'tara-ai';

        console.log('Pattern Analysis: Days to analyze:', daysToAnalyze);
        console.log('Pattern Analysis: Chat user ID:', chatUserId);

        // Connect to MongoDB
        const client = await clientPromise;
        const db = client.db('tara');
        const collection = db.collection('users');

        // Get user data
        const userData = await collection.findOne({ firebaseUid: userId });

        if (!userData) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        // Get chat history for the specific chat user
        const chatUser = userData.chatUsers?.find(u => u.id === chatUserId);
        const chatHistory = chatUser?.conversations || [];

        console.log('Pattern Analysis: Chat history length:', chatHistory.length);

        // Get journals
        const journals = userData.journals || [];
        console.log('Pattern Analysis: Journals count:', journals.length);

        // Perform pattern analysis
        const analysis = analyzeUserPattern(chatHistory, journals, daysToAnalyze);

        console.log('Pattern Analysis: Should suggest DASS-21:', analysis.shouldSuggestDASS21);
        console.log('Pattern Analysis: Combined stress score:', analysis.combinedStressScore);
        console.log('Pattern Analysis: Confidence:', analysis.confidence);

        // Check if user has already taken DASS-21 recently (within last 7 days)
        const recentAssessments = userData.dass21Assessments || [];
        const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
        const hasRecentAssessment = recentAssessments.some(assessment => {
            const assessmentDate = new Date(assessment.completedAt || assessment.createdAt);
            return assessmentDate >= sevenDaysAgo;
        });

        console.log('Pattern Analysis: Has recent DASS-21:', hasRecentAssessment);

        // Don't suggest if already taken recently
        const finalSuggestion = analysis.shouldSuggestDASS21 && !hasRecentAssessment;

        return NextResponse.json({
            success: true,
            shouldSuggestDASS21: finalSuggestion,
            hasRecentAssessment,
            analysis: {
                combinedStressScore: analysis.combinedStressScore,
                confidence: analysis.confidence,
                recommendation: analysis.recommendation,
                chatAnalysis: {
                    averageStressScore: analysis.chatAnalysis.averageStressScore,
                    consecutiveStressedDays: analysis.chatAnalysis.consecutiveStressedDays,
                    totalDaysAnalyzed: analysis.chatAnalysis.totalDaysAnalyzed,
                    dailyAnalysis: analysis.chatAnalysis.dailyAnalysis
                },
                journalAnalysis: {
                    averageStressScore: analysis.journalAnalysis.averageStressScore,
                    stressedJournalCount: analysis.journalAnalysis.stressedJournalCount,
                    totalJournals: analysis.journalAnalysis.totalJournals
                }
            }
        });

    } catch (error) {
        console.error('Pattern Analysis API Error:', error);
        return NextResponse.json(
            { error: 'Failed to analyze patterns', details: error.message },
            { status: 500 }
        );
    }
}
