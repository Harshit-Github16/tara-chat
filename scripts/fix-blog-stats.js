// Script to fix blog stats (likes, views, comments) in database
const { MongoClient } = require('mongodb');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://harshit0150:harshit0150@cluster0.y5z6n.mongodb.net/tara?retryWrites=true&w=majority&appName=Cluster0';

async function fixBlogStats() {
    const client = new MongoClient(MONGODB_URI);

    try {
        await client.connect();
        console.log('Connected to MongoDB');

        const db = client.db('tara');
        const blogsCollection = db.collection('blogs');

        // Get all blogs
        const blogs = await blogsCollection.find({}).toArray();
        console.log(`Found ${blogs.length} blogs`);

        let updatedCount = 0;

        for (const blog of blogs) {
            const updates = {};

            // Ensure likes field exists and is a number
            if (typeof blog.likes !== 'number') {
                updates.likes = 0;
            }

            // Ensure likedBy array exists
            if (!Array.isArray(blog.likedBy)) {
                updates.likedBy = [];
            }

            // Ensure views field exists and is a number
            if (typeof blog.views !== 'number') {
                updates.views = 0;
            }

            // Ensure comments array exists
            if (!Array.isArray(blog.comments)) {
                updates.comments = [];
            }

            // Ensure commentCount exists
            if (typeof blog.commentCount !== 'number') {
                updates.commentCount = Array.isArray(blog.comments) ? blog.comments.length : 0;
            }

            // Update if needed
            if (Object.keys(updates).length > 0) {
                await blogsCollection.updateOne(
                    { _id: blog._id },
                    { $set: updates }
                );
                updatedCount++;
                console.log(`Updated blog: ${blog.title}`);
                console.log(`  - Updates:`, updates);
            }
        }

        console.log(`\n✅ Fixed ${updatedCount} blogs`);

        // Show current stats
        const allBlogs = await blogsCollection.find({}).toArray();
        console.log('\n📊 Current Blog Stats:');
        allBlogs.forEach(blog => {
            console.log(`\n${blog.title}:`);
            console.log(`  - Likes: ${blog.likes || 0}`);
            console.log(`  - Views: ${blog.views || 0}`);
            console.log(`  - Comments: ${blog.commentCount || 0}`);
            console.log(`  - LikedBy: ${(blog.likedBy || []).length} users`);
        });

    } catch (error) {
        console.error('Error:', error);
    } finally {
        await client.close();
        console.log('\nDisconnected from MongoDB');
    }
}

fixBlogStats();
