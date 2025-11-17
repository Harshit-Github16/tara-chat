"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faArrowLeft, faCalendarAlt, faClock, faEye } from "@fortawesome/free-solid-svg-icons";
import BottomNav from "../../components/BottomNav";

// Author data - support multiple slug variations
const AUTHOR_DATA = {
    name: "Dr. Ruchika Dave",
    title: "Founder",
    bio: "Dr. Ruchika Dave is a Ph.D. in Human Resource Management and a certified NLP practitioner with over a decade of experience in counselling, mindset transformation, and emotional wellbeing. Her work bridges the gap between psychology and everyday life — helping students handle pressure and find direction, traders and professionals manage stress and decision fatigue, and homemakers rediscover balance, purpose, and self-worth. With a background in employee, relationship, and career counselling, she brings deep insight into human emotions and practical tools for personal growth. Dr. Ruchika shares reflections and guidance on mindfulness, productivity, and emotional strength — inspiring people from all walks of life to grow with awareness, balance, and inner peace.",
    email: "ruchika.dave91@gmail.com"
};

// Function to get author by slug (handles all variations)
const getAuthorBySlug = (slug) => {
    // Normalize slug - remove trailing dashes and handle variations
    const normalizedSlug = slug.toLowerCase().replace(/\.$/, '').replace(/-+$/, '');

    // Check if slug contains "ruchika" and "dave"
    if (normalizedSlug.includes('ruchika') && normalizedSlug.includes('dave')) {
        return AUTHOR_DATA;
    }

    return null;
};

export default function AuthorPage({ params }) {
    const [blogs, setBlogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [authorSlug, setAuthorSlug] = useState(null);
    const [author, setAuthor] = useState(null);

    useEffect(() => {
        // Unwrap params in useEffect
        const initPage = async () => {
            const resolvedParams = await params;
            const slug = resolvedParams.name;
            console.log('Author slug:', slug);
            const foundAuthor = getAuthorBySlug(slug);
            console.log('Author found:', foundAuthor);
            setAuthorSlug(slug);
            setAuthor(foundAuthor);
        };
        initPage();
    }, [params]);

    useEffect(() => {
        if (authorSlug) {
            fetchAuthorBlogs();
        }
    }, [authorSlug]);

    const fetchAuthorBlogs = async () => {
        try {
            const response = await fetch('/api/admin/blogs');
            if (response.ok) {
                const data = await response.json();
                // Filter blogs by author name - match both with and without "Dr."
                const authorBlogs = data.data.filter(blog => {
                    const blogAuthorSlug = blog.author?.toLowerCase().replace(/\s+/g, '-');
                    return blogAuthorSlug === authorSlug ||
                        blogAuthorSlug === `dr-${authorSlug}` ||
                        `dr-${blogAuthorSlug}` === authorSlug;
                });
                setBlogs(authorBlogs);
            }
        } catch (error) {
            console.error('Error fetching blogs:', error);
        } finally {
            setLoading(false);
        }
    };

    // Show loading while params are being resolved
    if (authorSlug === null) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-rose-50 via-white to-rose-100 flex items-center justify-center">
                <div className="text-center">
                    <div className="w-12 h-12 border-4 border-rose-200 border-t-rose-500 rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading...</p>
                </div>
            </div>
        );
    }

    if (!author) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-rose-50 via-white to-rose-100 flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-gray-800 mb-4">Author Not Found</h1>
                    <p className="text-gray-600 mb-4">Slug: {authorSlug}</p>
                    <Link href="/blog" className="text-rose-500 hover:text-rose-600">
                        Back to Blogs
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-rose-50 via-white to-rose-100">
            {/* Header */}
            <header className="sticky top-0 z-10 border-b border-rose-100 bg-white/80 backdrop-blur">
                <div className="mx-auto max-w-7xl px-4 py-3 flex items-center gap-4">
                    <Link href="/blog" className="text-rose-500 hover:text-rose-600">
                        <FontAwesomeIcon icon={faArrowLeft} className="h-5 w-5" />
                    </Link>
                    <h1 className="text-lg font-semibold text-gray-800">Author Profile</h1>
                </div>
            </header>

            <div className="mx-auto max-w-4xl px-4 py-8">
                {/* Author Profile Card */}
                <div className="bg-white rounded-2xl border border-rose-100 shadow-sm p-8 mb-8">
                    <div className="flex flex-col md:flex-row gap-6 items-start">
                        {/* Author Avatar */}
                        <div className="flex-shrink-0">
                            <div className="w-32 h-32 rounded-full bg-gradient-to-br from-rose-100 to-pink-100 flex items-center justify-center">
                                <FontAwesomeIcon icon={faUser} className="h-16 w-16 text-rose-500" />
                            </div>
                        </div>

                        {/* Author Info */}
                        <div className="flex-1">
                            <h1 className="text-3xl font-bold text-gray-900 mb-2">{author.name}</h1>
                            <p className="text-rose-500 font-medium mb-4">{author.title}</p>

                            {/* Bio */}
                            <div className="prose prose-sm max-w-none">
                                <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                                    {author.bio}
                                </p>
                            </div>

                            {/* Stats */}
                            <div className="mt-6 flex gap-6">
                                <div className="text-center">
                                    <div className="text-2xl font-bold text-rose-500">{blogs.length}</div>
                                    <div className="text-sm text-gray-600">Articles</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Articles Section */}
                <div className="mb-8">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">Articles by {author.name}</h2>

                    {loading ? (
                        <div className="text-center py-12">
                            <div className="w-12 h-12 border-4 border-rose-200 border-t-rose-500 rounded-full animate-spin mx-auto mb-4"></div>
                            <p className="text-gray-600">Loading articles...</p>
                        </div>
                    ) : blogs.length === 0 ? (
                        <div className="text-center py-12 bg-white rounded-2xl border border-rose-100">
                            <p className="text-gray-600">No articles published yet</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {blogs.map((blog) => (
                                <Link
                                    key={blog._id}
                                    href={`/blog/${blog._id}`}
                                    className="group bg-white rounded-2xl border border-rose-100 overflow-hidden hover:shadow-lg transition-all"
                                >
                                    {/* Blog Image */}
                                    {blog.image && (
                                        <div className="aspect-video overflow-hidden bg-gray-100">
                                            <img
                                                src={blog.image}
                                                alt={blog.title}
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                            />
                                        </div>
                                    )}

                                    <div className="p-5">
                                        {/* Category */}
                                        {blog.category && (
                                            <span className="inline-block px-3 py-1 bg-rose-100 text-rose-600 text-xs font-medium rounded-full mb-3">
                                                {blog.category}
                                            </span>
                                        )}

                                        {/* Title */}
                                        <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-rose-500 transition-colors line-clamp-2">
                                            {blog.title}
                                        </h3>

                                        {/* Excerpt */}
                                        {blog.excerpt && (
                                            <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                                                {blog.excerpt}
                                            </p>
                                        )}

                                        {/* Meta Info */}
                                        <div className="flex items-center gap-4 text-xs text-gray-500">
                                            <div className="flex items-center gap-1">
                                                <FontAwesomeIcon icon={faCalendarAlt} className="h-3 w-3" />
                                                <span>{new Date(blog.publishedAt || blog.createdAt).toLocaleDateString()}</span>
                                            </div>
                                            {blog.readTime && (
                                                <div className="flex items-center gap-1">
                                                    <FontAwesomeIcon icon={faClock} className="h-3 w-3" />
                                                    <span>{blog.readTime} min read</span>
                                                </div>
                                            )}
                                            {blog.views > 0 && (
                                                <div className="flex items-center gap-1">
                                                    <FontAwesomeIcon icon={faEye} className="h-3 w-3" />
                                                    <span>{blog.views} views</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            <BottomNav activePage="blog" />
        </div>
    );
}
