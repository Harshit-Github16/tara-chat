const Wellness = require('../models/Wellness');
const { ObjectId } = require('mongodb');

exports.createJournal = async (req, res) => {
    try {
        const userId = req.user.firebaseUid || req.user.userId || req.user.id;
        const { action } = req.query;

        if (action === 'update') {
            return exports.updateJournal(req, res);
        }

        const { journal } = req.body;

        if (!journal) return res.status(400).json({ error: 'Journal data is required' });

        let wellness = await Wellness.findOne({ userId });
        if (!wellness) wellness = new Wellness({ userId });

        const journalWithId = {
            _id: new ObjectId().toString(),
            ...journal,
            createdAt: new Date()
        };

        wellness.journals.push(journalWithId);
        await wellness.save();

        res.json({ success: true, journal: journalWithId });
    } catch (error) {
        res.status(500).json({ error: 'Failed to create journal' });
    }
};

exports.updateJournal = async (req, res) => {
    try {
        const userId = req.user.firebaseUid || req.user.userId || req.user.id;
        const { journalId, title, content, tags } = req.body;

        const wellness = await Wellness.findOne({ userId });
        if (!wellness) return res.status(404).json({ error: 'Wellness data not found' });

        const journalIndex = wellness.journals.findIndex(j => j._id === journalId);
        if (journalIndex === -1) return res.status(404).json({ error: 'Journal not found' });

        if (title !== undefined) wellness.journals[journalIndex].title = title;
        if (content !== undefined) wellness.journals[journalIndex].content = content;
        if (tags !== undefined) wellness.journals[journalIndex].tags = tags;
        wellness.journals[journalIndex].updatedAt = new Date();

        await wellness.save();
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: 'Failed to update journal' });
    }
};

exports.deleteJournal = async (req, res) => {
    try {
        const userId = req.user.firebaseUid || req.user.userId || req.user.id;
        const { journalId } = req.body;

        const wellness = await Wellness.findOne({ userId });
        if (!wellness) return res.status(404).json({ error: 'Wellness data not found' });

        wellness.journals = wellness.journals.filter(j => j._id !== journalId);
        await wellness.save();

        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete journal' });
    }
};

exports.getJournals = async (req, res) => {
    try {
        const userId = req.user.firebaseUid || req.user.userId || req.user.id;
        const wellness = await Wellness.findOne({ userId });
        res.json({ success: true, journals: wellness ? wellness.journals : [] });
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch journals' });
    }
};
