import { NextResponse } from 'next/server';
import clientPromise from '../../../lib/mongodb';
import { ObjectId } from 'mongodb';

// POST - Create or Update journal (check for action in query params)
export async function POST(request) {
    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action');

    // If action is update, handle update
    if (action === 'update') {
        return await updateJournal(request);
    }

    // Otherwise, create new journal
    return await createJournal(request);
}

// Helper function to create journal
async function createJournal(request) {
    try {
        const { userId, journal } = await request.json();

        if (!userId || !journal) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        const client = await clientPromise;
        const db = client.db('tara');
        const collection = db.collection('users');

        // Add unique _id to journal entry
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

        return NextResponse.json({ success: true, journal: journalWithId });

    } catch (error) {
        console.error('Create journal error:', error);
        return NextResponse.json({ error: 'Failed to create journal' }, { status: 500 });
    }
}

// Helper function to update journal
async function updateJournal(request) {
    try {
        const { userId, journalId, title, content, tags } = await request.json();

        if (!userId || !journalId) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        const client = await clientPromise;
        const db = client.db('tara');
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

        return NextResponse.json({ success: true });

    } catch (error) {
        console.error('Update journal error:', error);
        return NextResponse.json({ error: 'Failed to update journal' }, { status: 500 });
    }
}

// DELETE - Delete journal
export async function DELETE(request) {
    try {
        const { userId, journalId } = await request.json();

        if (!userId || !journalId) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        const client = await clientPromise;
        const db = client.db('tara');
        const collection = db.collection('users');

        // First, get the user to find and remove the journal manually
        const user = await collection.findOne({ firebaseUid: userId });

        if (!user || !user.journals) {
            return NextResponse.json({ error: 'User or journals not found' }, { status: 404 });
        }

        // Filter out the journal with matching _id or id
        const updatedJournals = user.journals.filter(
            journal => journal._id !== journalId && journal.id !== journalId
        );

        console.log('Before delete:', user.journals.length, 'After delete:', updatedJournals.length);

        // Update with filtered journals
        const result = await collection.updateOne(
            { firebaseUid: userId },
            {
                $set: {
                    journals: updatedJournals,
                    lastUpdated: new Date()
                }
            }
        );

        console.log('Delete result:', result.modifiedCount, 'documents modified');

        return NextResponse.json({ success: true });

    } catch (error) {
        console.error('Delete journal error:', error);
        return NextResponse.json({ error: 'Failed to delete journal' }, { status: 500 });
    }
}
