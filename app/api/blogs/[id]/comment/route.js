import { NextResponse } from 'next/server';
import clientPromise from '../../../../../lib/mongodb';
import { ObjectId } from 'mongodb';

export async function POST(request, context) {
    try {
        const { id } = await context.params;
        const { userId, userName, comment } = await request.json();

        if (!id) {
            return NextResponse.json(
                { success: false, message: 'Blog ID is required' },
                { status: 400 }
            );
        }

        if (!comment || !comment.trim()) {
            return NextResponse.json(
                { success: false, message: 'Comment cannot be empty' },
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

        const newComment = {
            id: new ObjectId().toString(),
            userId: userId || 'anonymous',
            userName: userName || 'Anonymous',
            comment: comment.trim(),
            timestamp: new Date().toISOString(),
            likes: 0
        };

        // Add comment to blog and increment comment count
        const result = await db.collection('blogs').updateOne(
            query,
            {
                $push: { comments: newComment },
                $inc: { commentCount: 1 }
            }
        );

        if (result.matchedCount === 0) {
            return NextResponse.json(
                { success: false, message: 'Blog not found' },
                { status: 404 }
            );
        }

        return NextResponse.json({
            success: true,
            comment: newComment
        });
    } catch (error) {
        console.error('Comment blog error:', error);
        return NextResponse.json(
            { success: false, message: 'Failed to add comment' },
            { status: 500 }
        );
    }
}

export async function GET(request, context) {
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

        const blog = await db.collection('blogs').findOne(
            query,
            { projection: { comments: 1 } }
        );

        if (!blog) {
            return NextResponse.json(
                { success: false, message: 'Blog not found' },
                { status: 404 }
            );
        }

        return NextResponse.json({
            success: true,
            comments: blog.comments || []
        });
    } catch (error) {
        console.error('Get comments error:', error);
        return NextResponse.json(
            { success: false, message: 'Failed to get comments' },
            { status: 500 }
        );
    }
}
