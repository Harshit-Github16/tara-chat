import { NextResponse } from 'next/server';
import clientPromise from '../../../lib/mongodb';

// POST - Create new journal
export async function POST(request) {
    try {
        const { userId, journal } = await request.json();

        if (!userId || !journal) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        const client = await clientPromise;
        const db = client.db('tara');
        const collection = db.collection('users');

        await collection.updateOne(
            { firebaseUid: userId },
            {
                $push: { journals: journal },
                $set: { lastUpdated: new Date() }
            }
        );

        return NextResponse.json({ success: true, journal });

    } catch (error) {
        console.error('Create journal error:', error);
        return NextResponse.json({ error: 'Failed to create journal' }, { status: 500 });
    }
}

// PUT - Update existing journal
export async function PUT(request) {
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
            { firebaseUid: userId, 'journals.id': journalId },
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

        await collection.updateOne(
            { firebaseUid: userId },
            {
                $pull: { journals: { id: journalId } },
                $set: { lastUpdated: new Date() }
            }
        );

        return NextResponse.json({ success: true });

    } catch (error) {
        console.error('Delete journal error:', error);
        return NextResponse.json({ error: 'Failed to delete journal' }, { status: 500 });
    }
}
