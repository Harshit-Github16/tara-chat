import { NextResponse } from 'next/server';
import clientPromise from '../../../../lib/mongodb';

export async function GET() {
    try {
        const client = await clientPromise;
        const db = client.db('tara');

        const blogs = await db.collection('blogs')
            .find({})
            .toArray();

        // Check slug field types
        const slugInfo = blogs.map(b => ({
            _id: b._id,
            title: b.title,
            slug: b.slug,
            slugType: typeof b.slug,
            hasSlug: !!b.slug
        }));

        return NextResponse.json({
            success: true,
            count: blogs.length,
            blogs: slugInfo,
            sample: blogs[0] // Full first blog for inspection
        });
    } catch (error) {
        console.error('Test API error:', error);
        return NextResponse.json(
            { success: false, message: error.message },
            { status: 500 }
        );
    }
}
