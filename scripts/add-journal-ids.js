#!/usr/bin/env node

// Script to add _id to existing journal entries that don't have one

const { MongoClient, ObjectId } = require('mongodb');

const MONGODB_URI = process.env.MONGODB_URI || 'your-mongodb-uri';

async function addIdsToJournals() {
    const client = new MongoClient(MONGODB_URI);

    try {
        await client.connect();
        console.log('✅ Connected to MongoDB');

        const db = client.db('tara');
        const collection = db.collection('users');

        // Find all users with journals
        const users = await collection.find({ journals: { $exists: true, $ne: [] } }).toArray();
        console.log(`📊 Found ${users.length} users with journals`);

        let totalUpdated = 0;

        for (const user of users) {
            let needsUpdate = false;
            const updatedJournals = user.journals.map(journal => {
                // If journal doesn't have _id, add one
                if (!journal._id) {
                    needsUpdate = true;
                    return {
                        _id: new ObjectId().toString(),
                        ...journal
                    };
                }
                return journal;
            });

            if (needsUpdate) {
                await collection.updateOne(
                    { _id: user._id },
                    { $set: { journals: updatedJournals } }
                );
                totalUpdated++;
                console.log(`✅ Updated user: ${user.firebaseUid} (${updatedJournals.length} journals)`);
            }
        }

        console.log(`\n🎉 Migration complete! Updated ${totalUpdated} users.`);

    } catch (error) {
        console.error('❌ Error:', error);
    } finally {
        await client.close();
        console.log('👋 Disconnected from MongoDB');
    }
}

// Run the migration
addIdsToJournals();
