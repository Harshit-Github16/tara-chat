const { MongoClient } = require('mongodb');

// MongoDB connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017';
const DB_NAME = 'tara';

async function addSampleData() {
    const client = new MongoClient(MONGODB_URI);

    try {
        await client.connect();
        console.log('Connected to MongoDB');

        const db = client.db(DB_NAME);
        const users = db.collection('users');

        // Sample user ID (replace with actual user ID)
        const sampleUserId = 'sample-user-123';

        // Sample mood data for the last 30 days
        const sampleMoods = [];
        const today = new Date();

        for (let i = 0; i < 30; i++) {
            const date = new Date(today);
            date.setDate(date.getDate() - i);
            const dateStr = date.toISOString().split('T')[0];

            const moods = ['happy', 'sad', 'anxious', 'calm', 'stressed', 'grateful', 'lonely', 'motivated'];
            const randomMood = moods[Math.floor(Math.random() * moods.length)];

            sampleMoods.push({
                date: dateStr,
                mood: randomMood,
                intensity: Math.floor(Math.random() * 5) + 1,
                note: `Feeling ${randomMood} today. Had some interesting experiences.`,
                timestamp: date.toISOString()
            });
        }

        // Sample journal entries
        const sampleJournals = [
            {
                date: today.toISOString().split('T')[0],
                content: "Today was a challenging day at work. I felt overwhelmed with the deadlines but managed to complete most tasks. I'm grateful for my supportive team.",
                mood: "stressed",
                timestamp: today.toISOString()
            },
            {
                date: new Date(today.setDate(today.getDate() - 1)).toISOString().split('T')[0],
                content: "Had a wonderful time with family today. We went for a walk in the park and had meaningful conversations. Feeling blessed and happy.",
                mood: "happy",
                timestamp: new Date(today.setDate(today.getDate() - 1)).toISOString()
            },
            {
                date: new Date(today.setDate(today.getDate() - 2)).toISOString().split('T')[0],
                content: "Feeling anxious about upcoming presentations. Need to practice more and prepare better. Also worried about financial stability.",
                mood: "anxious",
                timestamp: new Date(today.setDate(today.getDate() - 2)).toISOString()
            }
        ];

        // Sample goals
        const sampleGoals = [
            {
                id: 'goal_1',
                title: 'Exercise 3 times a week',
                category: 'health',
                targetDays: 30,
                description: 'Improve physical fitness and mental health',
                why: 'To feel more energetic and reduce stress',
                howToAchieve: 'Schedule gym sessions and track progress',
                progress: 60,
                checkIns: ['2024-12-01', '2024-12-03', '2024-12-05', '2024-12-08'],
                completed: false,
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                id: 'goal_2',
                title: 'Read 2 books this month',
                category: 'personal',
                targetDays: 30,
                description: 'Expand knowledge and improve focus',
                why: 'Personal growth and learning',
                howToAchieve: 'Read 30 minutes daily before bed',
                progress: 100,
                checkIns: Array.from({ length: 30 }, (_, i) => {
                    const d = new Date();
                    d.setDate(d.getDate() - i);
                    return d.toISOString().split('T')[0];
                }),
                completed: true,
                completedAt: new Date(),
                createdAt: new Date(),
                updatedAt: new Date()
            }
        ];

        // Sample chat conversations
        const sampleChatUsers = [
            {
                chatId: 'chat_1',
                conversations: [
                    {
                        sender: 'user',
                        content: 'I am feeling really stressed about work lately. The deadlines are overwhelming.',
                        timestamp: new Date().toISOString()
                    },
                    {
                        sender: 'assistant',
                        content: 'I understand work stress can be overwhelming. What specific aspects of the deadlines are causing you the most anxiety?',
                        timestamp: new Date().toISOString()
                    },
                    {
                        sender: 'user',
                        content: 'I have three major projects due next week and I feel like I am behind on all of them.',
                        timestamp: new Date().toISOString()
                    }
                ]
            }
        ];

        // Update or create user with sample data
        const result = await users.updateOne(
            { firebaseUid: sampleUserId },
            {
                $set: {
                    moods: sampleMoods,
                    journals: sampleJournals,
                    goals: sampleGoals,
                    chatUsers: sampleChatUsers,
                    lastUpdated: new Date()
                }
            },
            { upsert: true }
        );

        console.log('Sample data added successfully:', result);
        console.log(`Added ${sampleMoods.length} mood entries`);
        console.log(`Added ${sampleJournals.length} journal entries`);
        console.log(`Added ${sampleGoals.length} goals`);
        console.log(`User ID: ${sampleUserId}`);

    } catch (error) {
        console.error('Error adding sample data:', error);
    } finally {
        await client.close();
    }
}

// Run the script
if (require.main === module) {
    addSampleData();
}

module.exports = { addSampleData };