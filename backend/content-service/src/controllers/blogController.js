const Blog = require('../models/Blog');

// GET blog by slug or ID
exports.getBlogDetail = async (req, res) => {
    try {
        const { id } = req.params;
        let blog = await Blog.findOne({ $or: [{ slug: id }, { _id: id }] });

        if (!blog) {
            // Try numeric ID if it matches a specific format or logic (legacy support)
            return res.status(404).json({ success: false, message: 'Blog not found' });
        }
        res.json({ success: true, data: blog });
    } catch (error) {
        console.error('Fetch blog detail error:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch blog' });
    }
};

// POST - Increment View
exports.incrementView = async (req, res) => {
    try {
        const { id } = req.params;
        const blog = await Blog.findOneAndUpdate(
            { $or: [{ slug: id }, { _id: id }] },
            { $inc: { views: 1 } },
            { new: true }
        );
        if (!blog) return res.status(404).json({ success: false, message: 'Blog not found' });
        res.json({ success: true, views: blog.views });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to increment view' });
    }
};

// POST - Like Blog
exports.likeBlog = async (req, res) => {
    try {
        const { id } = req.params;
        const { userId } = req.body;

        const blog = await Blog.findOne({ $or: [{ slug: id }, { _id: id }] });
        if (!blog) return res.status(404).json({ success: false, message: 'Blog not found' });

        const hasLiked = blog.likedBy.includes(userId);
        if (hasLiked) {
            blog.likedBy = blog.likedBy.filter(uid => uid !== userId);
            blog.likes = Math.max(0, blog.likes - 1);
        } else {
            blog.likedBy.push(userId);
            blog.likes += 1;
        }

        await blog.save();
        res.json({ success: true, likes: blog.likes, hasLiked: !hasLiked });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to process like' });
    }
};

// POST - Comment
exports.addComment = async (req, res) => {
    try {
        const { id } = req.params;
        const { userId, userName, text } = req.body;

        const newComment = {
            userId,
            userName,
            text,
            date: new Date().toISOString()
        };

        const blog = await Blog.findOneAndUpdate(
            { $or: [{ slug: id }, { _id: id }] },
            {
                $push: { comments: newComment },
                $inc: { commentCount: 1 }
            },
            { new: true }
        );

        if (!blog) return res.status(404).json({ success: false, message: 'Blog not found' });
        res.json({ success: true, comments: blog.comments });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to add comment' });
    }
};
