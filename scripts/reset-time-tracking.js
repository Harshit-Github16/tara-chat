// Run this script to reset time tracking data
// Usage: node scripts/reset-time-tracking.js

const { MongoClient } = require('mongodb');

const MONGODB_URI = process.env.MONGODB_URI || 'your-mongodb-uri';

async function resetTimeTracking() {
    const client = await MongoClient.connect(MONGODB_URI);
    const db = client.db('tara');

    try {
        console.log('🔄 Resetting time tracking data...');

        // Option 1: Reset all totalTimeSpent to 0
        const result1 = await db.collection('user_sessions').updateMany(
            {},
            { $set: { totalTimeSpent: 0 } }
        );
        console.log(`✅ Reset ${result1.modifiedCount} user sessions`);

        // Option 2: Delete all sessions (fresh start)
        // const result2 = await db.collection('user_sessions').deleteMany({});
        // console.log(`✅ Deleted ${result2.deletedCount} sessions`);

        // Option 3: Delete old page tracking data
        // const result3 = await db.collection('page_tracking').deleteMany({});
        // console.log(`✅ Deleted ${result3.deletedCount} tracking records`);

        console.log('✨ Time tracking reset complete!');
    } catch (error) {
        console.error('❌ Error resetting time tracking:', error);
    } finally {
        await client.close();
    }
}

resetTimeTracking();
