require('dotenv').config({ path: '.env.local' });
const { MongoClient } = require('mongodb');

async function debugTimeSpentData() {
    const uri = process.env.MONGODB_URI;
    console.log('MongoDB URI:', uri ? 'Found' : 'Not found');
    const client = await MongoClient.connect(uri);

    try {
        const db = client.db('tara');

        console.log('\n=== Checking user_sessions collection ===');
        const sessions = await db.collection('user_sessions').find({}).limit(5).toArray();
        console.log('Sample sessions:', JSON.stringify(sessions, null, 2));

        console.log('\n=== Checking page_tracking collection ===');
        const tracking = await db.collection('page_tracking').find({}).limit(5).toArray();
        console.log('Sample tracking:', JSON.stringify(tracking, null, 2));

        console.log('\n=== Testing aggregation query ===');
        const users = await db.collection('users').aggregate([
            {
                $lookup: {
                    from: 'user_sessions',
                    localField: 'uid',
                    foreignField: 'userId',
                    as: 'sessions'
                }
            },
            {
                $project: {
                    name: 1,
                    email: 1,
                    uid: 1,
                    sessions: 1,
                    sessionCount: { $size: "$sessions" },
                    totalTimeSpent: { $sum: "$sessions.totalTimeSpent" }
                }
            },
            { $limit: 3 }
        ]).toArray();

        console.log('Aggregation result:', JSON.stringify(users, null, 2));

    } finally {
        await client.close();
    }
}

debugTimeSpentData().catch(console.error);
