const Blog = require('../models/Blog');

// GET all blogs
exports.getAllBlogs = async (req, res) => {
    try {
        const blogs = await Blog.find().sort({ publishDate: -1 });
        res.json({ success: true, data: blogs });
    } catch (error) {
        console.error('Fetch blogs error:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch blogs' });
    }
};

// POST - Create or Update
exports.processBlog = async (req, res) => {
    try {
        const blogId = req.query.id;
        const body = req.body;

        if (blogId) {
            return await updateBlog(blogId, body, res);
        }
        return await createBlog(body, res);
    } catch (error) {
        console.error('Blog API error:', error);
        res.status(500).json({ success: false, message: 'Failed to process request' });
    }
};

// DELETE blog
exports.deleteBlog = async (req, res) => {
    try {
        const blogId = req.query.id;
        if (!blogId) {
            return res.status(400).json({ success: false, message: 'Blog ID required' });
        }

        const result = await Blog.findByIdAndDelete(blogId);
        if (!result) {
            return res.status(404).json({ success: false, message: 'Blog not found' });
        }

        res.json({ success: true, message: 'Blog deleted successfully' });
    } catch (error) {
        console.error('Delete blog error:', error);
        res.status(500).json({ success: false, message: 'Failed to delete blog' });
    }
};

// Helper: Create
async function createBlog(body, res) {
    const { title, slug: userSlug, content, author } = body;

    if (!title || !content || !author) {
        return res.status(400).json({ success: false, message: 'Missing required fields' });
    }

    let slug = userSlug || generateSlug(title);
    // Unique slug check
    let uniqueSlug = slug;
    let counter = 1;
    while (await Blog.findOne({ slug: uniqueSlug })) {
        uniqueSlug = `${slug}-${counter}`;
        counter++;
    }

    const newBlog = new Blog({
        ...body,
        slug: uniqueSlug,
        publishDate: new Date().toISOString().split('T')[0],
        readTime: calculateReadTime(content),
        createdAt: new Date().toISOString()
    });

    await newBlog.save();
    res.json({ success: true, data: newBlog, message: 'Blog created successfully' });
}

// Helper: Update
async function updateBlog(blogId, body, res) {
    const { title, content, author } = body;

    if (!title || !content || !author) {
        return res.status(400).json({ success: false, message: 'Missing required fields' });
    }

    const updatedBlog = await Blog.findByIdAndUpdate(
        blogId,
        { ...body, updatedAt: new Date().toISOString() },
        { new: true }
    );

    if (!updatedBlog) {
        return res.status(404).json({ success: false, message: 'Blog not found' });
    }

    res.json({ success: true, data: updatedBlog, message: 'Blog updated successfully' });
}

// Utils
function generateSlug(title) {
    return title.toLowerCase().replace(/[^a-z0-9\s-]/g, '').trim().replace(/\s+/g, '-').substring(0, 30).replace(/-$/, '');
}

function calculateReadTime(content) {
    const wordsPerMinute = 200;
    const words = content.trim().split(/\s+/).length;
    const minutes = Math.ceil(words / wordsPerMinute);
    return `${minutes} min read`;
}
