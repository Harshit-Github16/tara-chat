import { NextResponse } from 'next/server';
import clientPromise from '../../../../../lib/mongodb';
import { ObjectId } from 'mongodb';

export async function POST(request, context) {
    try {
        const { id } = await context.params;

        if (!id) {
            return NextResponse.json(
                { success: false, message: 'Blog ID is required' },
                { status: 400 }
            );
        }

        const client = await clientPromise;
        const db = client.db('tara');

        // Try to find by slug first, then by ObjectId
        let query;
        // Check if it's a valid 24-character hex string (MongoDB ObjectId)
        if (ObjectId.isValid(id) && id.length === 24 && /^[0-9a-fA-F]{24}$/.test(id)) {
            query = { $or: [{ slug: id }, { _id: new ObjectId(id) }] };
        } else {
            query = { slug: id };
        }

        // Increment views count
        const result = await db.collection('blogs').updateOne(
            query,
            { $inc: { views: 1 } }
        );

        if (result.matchedCount === 0) {
            return NextResponse.json(
                { success: false, message: 'Blog not found' },
                { status: 404 }
            );
        }

        return NextResponse.json({
            success: true
        });
    } catch (error) {
        console.error('View blog error:', error);
        return NextResponse.json(
            { success: false, message: 'Failed to increment view' },
            { status: 500 }
        );
    }
}
