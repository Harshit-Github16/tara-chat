const { getDb } = require('../config/db');
const { ObjectId } = require('mongodb');

const journalController = {
    // POST /api/journal (Create or Update)
    handleJournal: async (req, res) => {
        const { action } = req.query;

        if (action === 'update') {
            return await updateJournal(req, res);
        }
        return await createJournal(req, res);
    },

    // DELETE /api/journal
    deleteJournal: async (req, res) => {
        try {
            const { userId, journalId } = req.body;

            if (!userId || !journalId) {
                return res.status(400).json({ error: 'Missing required fields' });
            }

            const db = getDb();
            const collection = db.collection('users');

            const user = await collection.findOne({ firebaseUid: userId });

            if (!user || !user.journals) {
                return res.status(404).json({ error: 'User or journals not found' });
            }

            const updatedJournals = user.journals.filter(
                journal => journal._id !== journalId && journal.id !== journalId
            );

            const result = await collection.updateOne(
                { firebaseUid: userId },
                {
                    $set: {
                        journals: updatedJournals,
                        lastUpdated: new Date()
                    }
                }
            );

            res.json({ success: true });

        } catch (error) {
            console.error('Delete journal error:', error);
            res.status(500).json({ error: 'Failed to delete journal' });
        }
    }
};

// Helper functions
async function createJournal(req, res) {
    try {
        const { userId, journal } = req.body;

        if (!userId || !journal) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        const db = getDb();
        const collection = db.collection('users');

        const journalWithId = {
            _id: new ObjectId().toString(),
            ...journal
        };

        await collection.updateOne(
            { firebaseUid: userId },
            {
                $push: { journals: journalWithId },
                $set: { lastUpdated: new Date() }
            }
        );

        return res.json({ success: true, journal: journalWithId });

    } catch (error) {
        console.error('Create journal error:', error);
        return res.status(500).json({ error: 'Failed to create journal' });
    }
}

async function updateJournal(req, res) {
    try {
        const { userId, journalId, title, content, tags } = req.body;

        if (!userId || !journalId) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        const db = getDb();
        const collection = db.collection('users');

        const updateFields = {};
        if (title !== undefined) updateFields['journals.$.title'] = title;
        if (content !== undefined) updateFields['journals.$.content'] = content;
        if (tags !== undefined) updateFields['journals.$.tags'] = tags;

        await collection.updateOne(
            { firebaseUid: userId, 'journals._id': journalId },
            {
                $set: {
                    ...updateFields,
                    lastUpdated: new Date()
                }
            }
        );

        return res.json({ success: true });

    } catch (error) {
        console.error('Update journal error:', error);
        return res.status(500).json({ error: 'Failed to update journal' });
    }
}

module.exports = journalController;
