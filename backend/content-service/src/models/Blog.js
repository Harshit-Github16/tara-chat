const mongoose = require('mongoose');

const blogSchema = new mongoose.Schema({
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    excerpt: { type: String, required: true },
    content: { type: String, required: true },
    author: { type: String, required: true },
    authorBio: { type: String, default: '' },
    featuredImage: { type: String, default: '' },
    publishDate: { type: String, required: true },
    readTime: { type: String },
    category: { type: String, default: 'General' },
    tags: { type: [String], default: [] },
    likes: { type: Number, default: 0 },
    likedBy: { type: [String], default: [] },
    comments: [{
        userId: String,
        userName: String,
        text: String,
        date: String
    }],
    commentCount: { type: Number, default: 0 },
    views: { type: Number, default: 0 },
    featured: { type: Boolean, default: false },
    trending: { type: Boolean, default: false },
    schemaType: { type: String, default: 'BlogPosting' },
    faqItems: { type: Array, default: [] },
    howToSteps: { type: Array, default: [] },
    createdAt: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Blog', blogSchema, 'blogs'); // explicitly use 'blogs' collection
