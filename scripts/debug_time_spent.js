const { MongoClient } = require('mongodb');

async function checkData() {
    const client = new MongoClient('mongodb://localhost:27017');
    try {
        await client.connect();
        const db = client.db('tara');

        const user = await db.collection('users').findOne({ email: 'harshit0150@gmail.com' });
        console.log('User UID:', user?.uid);
        console.log('User _id:', user?._id);

        const sessions = await db.collection('user_sessions').find({ userId: user?.uid }).toArray();
        console.log('Sessions count for UID:', sessions.length);
        console.log('Total Time Spent in sessions:', sessions.reduce((acc, s) => acc + (s.totalTimeSpent || 0), 0));

        const sessionsById = await db.collection('user_sessions').find({ userId: user?._id.toString() }).toArray();
        console.log('Sessions count for _id string:', sessionsById.length);

    } finally {
        await client.close();
    }
}

checkData();
