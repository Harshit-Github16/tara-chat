// Script to set up MongoDB indexes for analytics collections
// Run this script once to optimize query performance

const { MongoClient } = require('mongodb');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017';
const DB_NAME = 'tara';

async function setupIndexes() {
    const client = new MongoClient(MONGODB_URI);

    try {
        await client.connect();
        console.log('Connected to MongoDB');

        const db = client.db(DB_NAME);

        // Indexes for page_tracking collection
        const pageTrackingCollection = db.collection('page_tracking');

        await pageTrackingCollection.createIndex({ userId: 1, timestamp: -1 });
        console.log('Created index: userId + timestamp (desc)');

        await pageTrackingCollection.createIndex({ page: 1, timestamp: -1 });
        console.log('Created index: page + timestamp (desc)');

        await pageTrackingCollection.createIndex({ sessionId: 1, timestamp: 1 });
        console.log('Created index: sessionId + timestamp (asc)');

        await pageTrackingCollection.createIndex({ timestamp: -1 });
        console.log('Created index: timestamp (desc)');

        await pageTrackingCollection.createIndex({ action: 1, timestamp: -1 });
        console.log('Created index: action + timestamp (desc)');

        // Compound index for analytics queries
        await pageTrackingCollection.createIndex({
            timestamp: -1,
            userId: 1,
            page: 1
        });
        console.log('Created compound index: timestamp + userId + page');

        // Indexes for user_sessions collection
        const userSessionsCollection = db.collection('user_sessions');

        await userSessionsCollection.createIndex({ userId: 1, sessionId: 1 }, { unique: true });
        console.log('Created unique index: userId + sessionId');

        await userSessionsCollection.createIndex({ lastActivity: -1 });
        console.log('Created index: lastActivity (desc)');

        await userSessionsCollection.createIndex({ startTime: -1 });
        console.log('Created index: startTime (desc)');

        // TTL index to automatically delete old tracking data (optional - 90 days)
        await pageTrackingCollection.createIndex(
            { timestamp: 1 },
            { expireAfterSeconds: 90 * 24 * 60 * 60 } // 90 days
        );
        console.log('Created TTL index: auto-delete after 90 days');

        console.log('All indexes created successfully!');

    } catch (error) {
        console.error('Error setting up indexes:', error);
    } finally {
        await client.close();
    }
}

// Run the setup
setupIndexes().catch(console.error);