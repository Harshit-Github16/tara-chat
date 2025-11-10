// Migration script to move moods from separate collection to user objects
// Run this once if you have existing mood data in the moods collection

const { MongoClient, ObjectId } = require('mongodb');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://harshit0150:harshit0150@cluster0.y5z6n.mongodb.net/Cluster0?retryWrites=true&w=majority&appName=Cluster0';

async function migrateMoods() {
    const client = new MongoClient(MONGODB_URI);

    try {
        await client.connect();
        console.log('Connected to MongoDB');

        const db = client.db('tara');
        const moodsCollection = db.collection('moods');
        const usersCollection = db.collection('users');

        // Get all mood documents
        const moodDocs = await moodsCollection.find({}).toArray();
        console.log(`Found ${moodDocs.length} mood documents to migrate`);

        let migratedCount = 0;
        let errorCount = 0;

        for (const moodDoc of moodDocs) {
            try {
                const userId = moodDoc.userId;
                const entries = moodDoc.entries || [];

                if (!userId || entries.length === 0) {
                    console.log(`Skipping document ${moodDoc._id} - no userId or entries`);
                    continue;
                }

                // Convert entries to proper format
                const formattedEntries = entries.map(entry => ({
                    id: new ObjectId().toString(),
                    mood: entry.mood,
                    intensity: entry.intensity || 5,
                    note: entry.note || '',
                    date: moodDoc.date,
                    timestamp: entry.timestamp || entry.createdAt || new Date(),
                    createdAt: entry.createdAt || new Date()
                }));

                // Find user by ObjectId or firebaseUid
                let user;
                if (ObjectId.isValid(userId)) {
                    user = await usersCollection.findOne({ _id: new ObjectId(userId) });
                }

                if (!user) {
                    user = await usersCollection.findOne({ firebaseUid: userId.toString() });
                }

                if (!user) {
                    console.log(`User not found for mood document ${moodDoc._id}`);
                    errorCount++;
                    continue;
                }

                // Add moods to user object
                await usersCollection.updateOne(
                    { _id: user._id },
                    {
                        $push: {
                            moods: {
                                $each: formattedEntries,
                                $position: 0
                            }
                        },
                        $set: { lastUpdated: new Date() }
                    }
                );

                migratedCount += formattedEntries.length;
                console.log(`Migrated ${formattedEntries.length} moods for user ${user.name || user._id}`);

            } catch (error) {
                console.error(`Error migrating mood document ${moodDoc._id}:`, error);
                errorCount++;
            }
        }

        console.log('\n=== Migration Complete ===');
        console.log(`Total mood entries migrated: ${migratedCount}`);
        console.log(`Errors: ${errorCount}`);
        console.log('\nYou can now safely delete the moods collection if migration was successful.');

    } catch (error) {
        console.error('Migration failed:', error);
    } finally {
        await client.close();
        console.log('MongoDB connection closed');
    }
}

// Run migration
migrateMoods();
