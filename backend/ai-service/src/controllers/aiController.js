const Groq = require('groq-sdk');
const { analyzeUserPattern } = require('../utils/patternAnalysis');

const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY_INSIGHTS || process.env.GROQ_API_KEY
});

exports.generateQuiz = async (req, res) => {
    try {
        const { lifeArea } = req.body;

        if (!lifeArea) {
            return res.status(400).json({ error: 'Life area is required' });
        }

        const prompt = `Generate a quiz with exactly 5 questions for the life area: "\${lifeArea}".
Return ONLY a valid JSON array with this exact structure:
[
    {
        "question": "Question text here?",
        "options": [
            { "text": "Option 1", "score": 5 },
            { "text": "Option 2", "score": 4 },
            { "text": "Option 3", "score": 3 },
            { "text": "Option 4", "score": 2 },
            { "text": "Option 5", "score": 1 }
        ]
    }
]`;

        const completion = await groq.chat.completions.create({
            messages: [
                {
                    role: 'system',
                    content: 'You are a helpful assistant that generates quiz questions in JSON format.'
                },
                {
                    role: 'user',
                    content: prompt
                }
            ],
            model: 'llama-3.3-70b-versatile',
            temperature: 0.7,
            max_tokens: 2000
        });

        const responseText = completion.choices[0]?.message?.content || '';
        let quizData;
        try {
            quizData = JSON.parse(responseText.match(/\[[\s\S]*\]/)?.[0] || responseText);
        } catch (e) {
            throw new Error('Could not parse quiz data');
        }

        res.json({ quiz: quizData });
    } catch (error) {
        console.error('Error generating quiz:', error);
        res.status(500).json({ error: 'Failed to generate quiz', details: error.message });
    }
};

exports.analyzePatterns = async (req, res) => {
    try {
        const userId = req.user.firebaseUid || req.user.userId || req.user.id;
        const { days = 3, chatUserId = 'tara-ai' } = req.query;

        const { getDb } = require('../config/db'); // Use shared DB for now strictly for data retrieval
        const db = getDb();
        const userData = await db.collection('users').findOne({ $or: [{ firebaseUid: userId }, { _id: userId }] });

        if (!userData) {
            return res.status(404).json({ error: 'User not found' });
        }

        const chatUser = userData.chatUsers?.find(u => u.id === chatUserId);
        const chatHistory = chatUser?.conversations || [];
        const journals = userData.journals || [];

        const analysis = analyzeUserPattern(chatHistory, journals, parseInt(days));

        // Recent assessment check
        const recentAssessments = userData.stressCheckAssessments || [];
        const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
        const hasRecentAssessment = recentAssessments.some(assessment => {
            const date = new Date(assessment.completedAt || assessment.createdAt);
            return date >= sevenDaysAgo;
        });

        const finalSuggestion = analysis.shouldSuggestDASS21 && !hasRecentAssessment;

        res.json({
            success: true,
            shouldSuggestDASS21: finalSuggestion,
            hasRecentAssessment,
            analysis
        });
    } catch (error) {
        console.error('Pattern Analysis error:', error);
        res.status(500).json({ error: 'Failed to analyze patterns' });
    }
};

exports.generateSuggestions = async (req, res) => {
    try {
        const { areas } = req.body;

        if (!areas || areas.length === 0) {
            return res.json({ suggestions: [] });
        }

        const areasText = areas.map(a => `\${a.area} (Score: \${a.score}/100)`).join(', ');

        const prompt = `You are a life coach and wellness expert. Based on the following life area assessment scores, provide 4-5 specific, actionable suggestions for improvement.
Life Areas Needing Improvement: \${areasText}
Respond ONLY with a valid JSON array in this exact format:
[
  {
    "icon": "🎯",
    "title": "Set Clear Goals",
    "description": "Define specific objectives for the next month"
  }
]`;

        const completion = await groq.chat.completions.create({
            messages: [
                { role: "system", content: "You are a helpful life coach. Always respond with valid JSON only." },
                { role: "user", content: prompt }
            ],
            model: "llama-3.1-70b-versatile",
            temperature: 0.7,
            max_tokens: 1000,
        });

        const responseText = completion.choices[0]?.message?.content || '[]';
        let suggestions = [];
        try {
            suggestions = JSON.parse(responseText.match(/\[[\s\S]*\]/)?.[0] || responseText);
        } catch (e) {
            console.error('JSON Parse error for suggestions:', e);
        }

        res.json({ success: true, suggestions: suggestions.slice(0, 5) });
    } catch (error) {
        console.error('Error generating suggestions:', error);
        res.status(500).json({ success: false, suggestions: [] });
    }
};

exports.processTaraChat = async (req, res) => {
    try {
        const userId = req.user.firebaseUid || req.user.userId || req.user.id;
        const { message } = req.body;

        if (!message) return res.status(400).json({ error: 'Message is required' });

        const { getDb } = require('../config/db');
        const db = getDb();

        // Fetch user context
        const user = await db.collection('users').findOne({ $or: [{ firebaseUid: userId }, { _id: userId }] });

        // Fetch/Initialize chat history
        let chatRecord = await db.collection('tara_chats').findOne({ userId });
        const chatHistory = chatRecord?.messages || [];

        const latestMood = user?.moods?.length > 0 ? user.moods[user.moods.length - 1] : null;

        let systemPrompt = `You are TARA, a compassionate AI mental wellness companion. Provide emotional support and guidance.
CRITICAL: Keep responses VERY SHORT - maximum 1 sentence. Be conversational.`;

        if (user?.archetype && user?.supportPreference) {
            systemPrompt += `\n🎯 SUPPORT PROFILE: Archetype: \${user.archetype}, Preference: \${user.supportPreference}`;
        }

        if (latestMood && chatHistory.length === 0) {
            systemPrompt += `\n User current mood: \${latestMood.mood}. Adjust your initial greeting accordingly.`;
        }

        const groqMessages = [
            { role: 'system', content: systemPrompt },
            ...chatHistory.slice(-10).map(msg => ({
                role: msg.sender === 'user' ? 'user' : 'assistant',
                content: msg.content
            })),
            { role: 'user', content: message }
        ];

        const completion = await groq.chat.completions.create({
            messages: groqMessages,
            model: 'llama-3.3-70b-versatile',
            max_tokens: 50,
            temperature: 0.9,
        });

        const taraReply = completion.choices[0]?.message?.content?.trim() || "I'm here for you.";

        const userMessage = { id: new Date().getTime().toString(), content: message, sender: 'user', timestamp: new Date() };
        const taraMessage = { id: (new Date().getTime() + 1).toString(), content: taraReply, sender: 'tara', timestamp: new Date() };

        const updatedHistory = [...chatHistory, userMessage, taraMessage];

        await db.collection('tara_chats').updateOne(
            { userId },
            { $set: { userId, messages: updatedHistory, lastUpdated: new Date() } },
            { upsert: true }
        );

        res.json({ success: true, userMessage, taraMessage, chatHistory: updatedHistory });
    } catch (error) {
        console.error('TARA Chat error:', error);
        res.status(500).json({ error: 'Failed to process chat message' });
    }
};

exports.generateJournal = async (req, res) => {
    try {
        const userId = req.user.firebaseUid || req.user.userId || req.user.id;
        const { date } = req.body;

        const { getDb } = require('../config/db');
        const db = getDb();

        // Fetch recent chats and moods to generate a summary
        const chatRecord = await db.collection('tara_chats').findOne({ userId });
        const chats = chatRecord?.messages || [];

        const user = await db.collection('users').findOne({ $or: [{ firebaseUid: userId }, { _id: userId }] });
        const recentMoods = user?.moods?.slice(-5) || [];

        if (chats.length === 0) {
            return res.json({ success: false, message: 'No chat history found to generate a journal.' });
        }

        const prompt = `Based on the following chat history and recent moods, generate a short, insightful journal entry for today (\${date}).
CHATS: \${JSON.stringify(chats.slice(-20))}
MOODS: \${JSON.stringify(recentMoods)}

Return ONLY a valid JSON object:
{
  "title": "A short descriptive title",
  "content": "The journal content (2-3 paragraphs)",
  "tags": ["tag1", "tag2"]
}`;

        const completion = await groq.chat.completions.create({
            messages: [
                { role: 'system', content: 'You are an AI that generates reflective journal entries based on user data.' },
                { role: 'user', content: prompt }
            ],
            model: 'llama-3.3-70b-versatile',
            temperature: 0.7,
        });

        const responseText = completion.choices[0]?.message?.content || '{}';
        let journalData;
        try {
            journalData = JSON.parse(responseText.match(/\{[\s\S]*\}/)?.[0] || responseText);
        } catch (e) {
            throw new Error('Failed to parse AI journal response');
        }

        const { ObjectId } = require('mongodb');
        const finalJournal = {
            _id: new ObjectId().toString(),
            ...journalData,
            date: date || new Date().toISOString().split('T')[0],
            createdAt: new Date(),
            autoGenerated: true
        };

        // Save to Wellness database (using shared DB for now strictly for simplicity in this migration step)
        // Ideally wellness storage happens via wellness-service call, but for speed in this tool turn:
        await db.collection('wellness_data').updateOne(
            { userId },
            { $push: { journals: finalJournal } },
            { upsert: true }
        );

        res.json({ success: true, journal: finalJournal });
    } catch (error) {
        console.error('Journal Generation error:', error);
        res.status(500).json({ error: 'Failed to generate journal' });
    }
};
