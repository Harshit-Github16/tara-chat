import { NextResponse } from 'next/server';
import clientPromise from '../../../../lib/mongodb';

// GET - Fetch all blogs
export async function GET(request) {
    try {
        const client = await clientPromise;
        const db = client.db('tara');

        const blogs = await db.collection('blogs')
            .find({})
            .sort({ publishDate: -1 })
            .toArray();

        return NextResponse.json({
            success: true,
            data: blogs
        });
    } catch (error) {
        console.error('Fetch blogs error:', error);
        return NextResponse.json(
            { success: false, message: 'Failed to fetch blogs' },
            { status: 500 }
        );
    }
}

// POST - Create or Update blog (check for id in query params)
export async function POST(request) {
    try {
        const { searchParams } = new URL(request.url);
        const blogId = searchParams.get('id');
        const body = await request.json();

        // If blogId exists, update existing blog
        if (blogId) {
            return await updateBlog(blogId, body);
        }

        // Otherwise, create new blog
        return await createBlog(body);
    } catch (error) {
        console.error('Blog API error:', error);
        return NextResponse.json(
            { success: false, message: 'Failed to process request' },
            { status: 500 }
        );
    }
}

// Helper function to create blog
async function createBlog(body) {
    try {
        const {
            title,
            slug: userSlug,
            excerpt,
            content,
            author,
            authorBio,
            category,
            tags,
            featuredImage,
            featured,
            trending,
            schemaType,
            faqItems,
            howToSteps,
            initialLikes,
            initialViews
        } = body;

        console.log('Received featuredImage URL:', featuredImage);

        if (!title || !excerpt || !content || !author) {
            return NextResponse.json(
                { success: false, message: 'Missing required fields' },
                { status: 400 }
            );
        }

        const client = await clientPromise;
        const db = client.db('tara');

        // Use user-provided slug or generate from title
        let baseSlug = userSlug ? userSlug.toLowerCase().replace(/[^a-z0-9-]/g, '').substring(0, 30) : generateSlug(title);
        let slug = baseSlug;
        let counter = 1;

        // Check if slug already exists
        while (await db.collection('blogs').findOne({ slug })) {
            slug = `${baseSlug}-${counter}`;
            counter++;
        }

        const newBlog = {
            title,
            slug,
            excerpt,
            content,
            author,
            authorBio: authorBio || '',
            featuredImage: featuredImage || '',
            publishDate: new Date().toISOString().split('T')[0],
            readTime: calculateReadTime(content),
            category: category || 'General',
            tags: tags || [],
            likes: initialLikes || 0,
            likedBy: [],
            comments: [],
            commentCount: 0,
            views: initialViews || 0,
            featured: featured || false,
            trending: trending || false,
            schemaType: schemaType || 'BlogPosting',
            faqItems: faqItems || [],
            howToSteps: howToSteps || [],
            createdAt: new Date().toISOString()
        };

        console.log('Creating blog with slug:', slug);

        const result = await db.collection('blogs').insertOne(newBlog);
        newBlog._id = result.insertedId;

        console.log('Blog created successfully with _id:', result.insertedId, 'and slug:', slug);

        return NextResponse.json({
            success: true,
            data: newBlog,
            message: 'Blog created successfully'
        });
    } catch (error) {
        console.error('Create blog error:', error);
        return NextResponse.json(
            { success: false, message: 'Failed to create blog' },
            { status: 500 }
        );
    }
}

// Helper function to update blog
async function updateBlog(blogId, body) {
    try {
        const {
            title,
            slug: userSlug,
            excerpt,
            content,
            author,
            authorBio,
            category,
            tags,
            featuredImage,
            featured,
            trending,
            schemaType,
            faqItems,
            howToSteps
        } = body;

        if (!title || !excerpt || !content || !author) {
            return NextResponse.json(
                { success: false, message: 'Missing required fields' },
                { status: 400 }
            );
        }

        const client = await clientPromise;
        const db = client.db('tara');
        const { ObjectId } = require('mongodb');

        // Check if slug needs to be updated and is unique
        let slug = userSlug || generateSlug(title);
        const existingBlog = await db.collection('blogs').findOne({
            slug,
            _id: { $ne: new ObjectId(blogId) }
        });

        if (existingBlog) {
            // Slug exists for another blog, append counter
            let counter = 1;
            let baseSlug = slug;
            while (await db.collection('blogs').findOne({
                slug,
                _id: { $ne: new ObjectId(blogId) }
            })) {
                slug = `${baseSlug}-${counter}`;
                counter++;
            }
        }

        // Get existing blog to preserve stats
        const existingBlogData = await db.collection('blogs').findOne({ _id: new ObjectId(blogId) });

        if (!existingBlogData) {
            return NextResponse.json(
                { success: false, message: 'Blog not found' },
                { status: 404 }
            );
        }

        const updatedBlog = {
            title,
            slug,
            excerpt,
            content,
            author,
            authorBio: authorBio || '',
            featuredImage: featuredImage || '',
            readTime: calculateReadTime(content),
            category: category || 'General',
            tags: tags || [],
            featured: featured || false,
            trending: trending || false,
            schemaType: schemaType || 'BlogPosting',
            faqItems: faqItems || [],
            howToSteps: howToSteps || [],
            updatedAt: new Date().toISOString(),
            // Preserve existing stats - CRITICAL!
            likes: existingBlogData.likes || 0,
            likedBy: existingBlogData.likedBy || [],
            views: existingBlogData.views || 0,
            comments: existingBlogData.comments || [],
            commentCount: existingBlogData.commentCount || 0
        };

        const result = await db.collection('blogs').findOneAndUpdate(
            { _id: new ObjectId(blogId) },
            { $set: updatedBlog },
            { returnDocument: 'after' }
        );

        if (!result) {
            return NextResponse.json(
                { success: false, message: 'Blog not found' },
                { status: 404 }
            );
        }

        return NextResponse.json({
            success: true,
            data: result,
            message: 'Blog updated successfully'
        });
    } catch (error) {
        console.error('Update blog error:', error);
        return NextResponse.json(
            { success: false, message: 'Failed to update blog' },
            { status: 500 }
        );
    }
}

// DELETE - Delete a blog
export async function DELETE(request) {
    try {
        const { searchParams } = new URL(request.url);
        const blogId = searchParams.get('id');

        if (!blogId) {
            return NextResponse.json(
                { success: false, message: 'Blog ID required' },
                { status: 400 }
            );
        }

        const client = await clientPromise;
        const db = client.db('tara');
        const { ObjectId } = require('mongodb');

        const result = await db.collection('blogs').deleteOne({
            _id: new ObjectId(blogId)
        });

        if (result.deletedCount === 0) {
            return NextResponse.json(
                { success: false, message: 'Blog not found' },
                { status: 404 }
            );
        }

        return NextResponse.json({
            success: true,
            message: 'Blog deleted successfully'
        });
    } catch (error) {
        console.error('Delete blog error:', error);
        return NextResponse.json(
            { success: false, message: 'Failed to delete blog' },
            { status: 500 }
        );
    }
}

// Helper function to generate slug from title
function generateSlug(title) {
    return title
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
        .trim()
        .replace(/\s+/g, '-') // Replace spaces with hyphens
        .replace(/-+/g, '-') // Replace multiple hyphens with single
        .substring(0, 30) // Max 30 characters
        .replace(/-$/, ''); // Remove trailing hyphen
}

// Helper function to calculate read time
function calculateReadTime(content) {
    const wordsPerMinute = 200;
    const words = content.trim().split(/\s+/).length;
    const minutes = Math.ceil(words / wordsPerMinute);
    return `${minutes} min read`;
}
