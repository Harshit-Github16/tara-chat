// In a real microservice, ai-service would request data from wellness-service via internal API
// For now, I'll use the same DB connection logic to fetch user data for analysis

const { getDb } = require('../config/db');
const Groq = require('groq-sdk');

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY_INSIGHTS });

exports.analyzeMoodTriggers = async (req, res) => {
    try {
        const userId = req.user.firebaseUid || req.user.userId || req.user.id;
        const db = getDb();
        const userData = await db.collection('users').findOne({ $or: [{ firebaseUid: userId }, { _id: userId }] });

        if (!userData) return res.status(404).json({ error: 'User not found' });

        const journals = userData.journals || [];
        const moods = userData.moods || [];
        const chatUsers = userData.chatUsers || [];

        // Count unique days
        const uniqueDays = new Set();
        journals.forEach(j => j.date && uniqueDays.add(j.date));
        moods.forEach(m => m.date && uniqueDays.add(m.date));
        chatUsers.forEach(u => u.conversations?.forEach(msg => uniqueDays.add(new Date(msg.timestamp).toISOString().split('T')[0])));

        if (uniqueDays.size < 7) {
            return res.json({ success: true, hasEnoughData: false, daysCount: uniqueDays.size, triggers: [] });
        }

        // Prepare context for LLM
        const journalContext = journals.slice(-30).map(j => `Date: \${j.date}\nContent: \${j.content}`).join('\n\n');
        const moodContext = moods.slice(-30).map(m => `Date: \${m.date}, Mood: \${m.mood}`).join('\n');

        const prompt = `Identify EXACTLY 5 mood triggers based on:
JOURNALS: \${journalContext}
MOODS: \${moodContext}

Return JSON array: [{"name": "...", "description": "...", "impact": 0-100, "emoji": "..."}]`;

        const completion = await groq.chat.completions.create({
            messages: [{ role: 'user', content: prompt }],
            model: 'llama-3.3-70b-versatile',
            temperature: 0.3,
        });

        const responseText = completion.choices[0]?.message?.content || '[]';
        let triggers = [];
        try {
            triggers = JSON.parse(responseText.match(/\[[\s\S]*\]/)?.[0] || responseText);
        } catch (e) {
            console.error('Triggers parse error');
        }

        res.json({ success: true, hasEnoughData: true, daysCount: uniqueDays.size, triggers: triggers.slice(0, 5) });
    } catch (error) {
        console.error('Mood Trigger Analysis error:', error);
        res.status(500).json({ error: 'Failed to analyze triggers' });
    }
};
