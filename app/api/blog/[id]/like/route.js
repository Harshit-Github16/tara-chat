import { NextResponse } from 'next/server';
import clientPromise from '../../../../../lib/mongodb';
import { ObjectId } from 'mongodb';

export async function POST(request, context) {
    try {
        const { id } = await context.params;
        const body = await request.json();
        const userId = body.userId;

        if (!id) {
            return NextResponse.json(
                { success: false, message: 'Blog ID is required' },
                { status: 400 }
            );
        }

        if (!userId) {
            return NextResponse.json(
                { success: false, message: 'User ID is required' },
                { status: 400 }
            );
        }

        const client = await clientPromise;
        const db = client.db('tara');

        // Try to find by slug first, then by ObjectId
        let query;
        console.log('Like API - Received id:', id, 'Length:', id.length, 'Type:', typeof id);
        console.log('Like API - ObjectId.isValid:', ObjectId.isValid(id));
        console.log('Like API - Hex test:', /^[0-9a-fA-F]{24}$/.test(id));

        // Check if it's a valid 24-character hex string (MongoDB ObjectId)
        if (ObjectId.isValid(id) && id.length === 24 && /^[0-9a-fA-F]{24}$/.test(id)) {
            query = { $or: [{ slug: id }, { _id: new ObjectId(id) }] };
            console.log('Like API - Using ObjectId query');
        } else {
            query = { slug: id };
            console.log('Like API - Using slug query');
        }

        console.log('Like API - Final query:', JSON.stringify(query));

        // First check if blog exists
        const existingBlog = await db.collection('blogs').findOne(query);
        console.log('Like API - Found blog:', existingBlog ? 'Yes' : 'No');
        if (existingBlog) {
            console.log('Like API - Blog details:', { _id: existingBlog._id, slug: existingBlog.slug, title: existingBlog.title });
        }

        if (!existingBlog) {
            return NextResponse.json(
                { success: false, message: 'Blog not found' },
                { status: 404 }
            );
        }

        // Allow unlimited likes - just increment the count
        const result = await db.collection('blogs').updateOne(
            query,
            {
                $inc: { likes: 1 },
                $push: { likedBy: userId } // Push instead of addToSet to allow duplicates
            }
        );

        const blog = await db.collection('blogs').findOne(query);

        return NextResponse.json({
            success: true,
            likes: blog.likes,
            isLiked: true,
            message: 'Blog liked'
        });
    } catch (error) {
        console.error('Like blog error:', error);
        return NextResponse.json(
            { success: false, message: 'Failed to like blog', error: error.message },
            { status: 500 }
        );
    }
}
