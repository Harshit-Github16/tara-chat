"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import BottomNav from "../../components/BottomNav";
import BlogSchema from "../../components/BlogSchema";
import { useAuth } from "../../contexts/AuthContext";
import {
    faChartLine,
    faBookOpen,
    faComments,
    faUser,
    faSignOutAlt,
    faHeart,
    faComment,
    faShare,
    faEye,
    faClock,
    faCalendarAlt,
    faNewspaper,
    faArrowLeft,
    faTags,
    faThumbsUp,
    faBullseye,
    faReply,
    faLink,

} from "@fortawesome/free-solid-svg-icons";
import { useParams } from "next/navigation";



// Function to generate random masked names
const generateMaskedName = () => {
    const letters = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
    const randomLetter = letters[Math.floor(Math.random() * letters.length)];
    return `${randomLetter}***`;
};

export default function BlogPostClient() {
    const params = useParams();
    const { user, loading: authLoading } = useAuth();
    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isLiked, setIsLiked] = useState(false);
    const [isLiking, setIsLiking] = useState(false);
    const [likeCount, setLikeCount] = useState(0);
    const [newComment, setNewComment] = useState("");
    const [comments, setComments] = useState([]);
    const [showShareMenu, setShowShareMenu] = useState(false);
    const [relatedBlogs, setRelatedBlogs] = useState([]);
    const [blogId, setBlogId] = useState(null);

    useEffect(() => {
        if (params?.id) {
            setBlogId(params.id);
        }
    }, [params]);

    useEffect(() => {
        if (blogId) {
            fetchBlog();
        }
    }, [blogId]);

    const fetchBlog = async () => {
        try {
            setLoading(true);
            const response = await fetch('/api/admin/blogs');
            const data = await response.json();
            if (data.success) {
                // Find by slug or _id
                const foundPost = data.data.find(p =>
                    p.slug === blogId ||
                    p._id === blogId ||
                    p.id === parseInt(blogId)
                );

                if (foundPost) {
                    // Use slug as primary identifier
                    const blogIdToUse = foundPost.slug || foundPost._id;
                    setPost({ ...foundPost, id: blogIdToUse });
                    setLikeCount(foundPost.likes || 0);

                    // No need to check if user has liked - they can like multiple times
                    setIsLiked(false); // Reset like state

                    // Increment view count
                    incrementView(blogIdToUse);
                    // Load comments
                    loadComments(blogIdToUse);

                    // Get related blogs (same category, exclude current)
                    const related = data.data
                        .filter(p => p._id !== foundPost._id && p.category === foundPost.category)
                        .slice(0, 3)
                        .map(blog => ({ ...blog, id: blog.slug || blog._id }));
                    setRelatedBlogs(related);
                } else {
                    setPost(null);
                }
            } else {
                setPost(null);
            }
        } catch (error) {
            console.error('Error fetching blog:', error);
            setPost(null);
        } finally {
            setLoading(false);
        }
    };

    const incrementView = async (blogId) => {
        try {
            const response = await fetch(`/api/blog/${blogId}/view`, { method: 'POST' });
            const data = await response.json();
            if (data.success) {
                // Update local state to reflect new view count
                setPost(prev => prev ? { ...prev, views: (prev.views || 0) + 1 } : null);
            } else {
                console.error('Failed to increment view:', data.message);
            }
        } catch (error) {
            console.error('Error incrementing view:', error);
        }
    };

    const loadComments = async (blogId) => {
        try {
            const response = await fetch(`/api/blog/${blogId}/comment`);
            const data = await response.json();
            if (data.success && data.comments.length > 0) {
                setComments(data.comments);
            }
        } catch (error) {
            console.error('Error loading comments:', error);
        }
    };

    // Close share menu when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (showShareMenu && !event.target.closest('.share-menu-container')) {
                setShowShareMenu(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [showShareMenu]);

    const handleLike = async () => {
        if (!post?.id || isLiking) return;

        try {
            setIsLiking(true);

            // Use user ID if logged in, otherwise use a session-based ID
            let userId;
            if (user?.uid) {
                userId = user.firebaseUid || user.uid;
            } else {
                // For anonymous users, use a browser-based ID
                userId = localStorage.getItem('anonymousUserId');
                if (!userId) {
                    userId = `anon_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
                    localStorage.setItem('anonymousUserId', userId);
                }
            }

            const response = await fetch(`/api/blog/${post.id}/like`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId })
            });
            const data = await response.json();

            if (data.success) {
                setLikeCount(data.likes);
                // Show temporary animation
                setIsLiked(true);
                setTimeout(() => setIsLiked(false), 300);
            } else {
                console.error('Like failed:', data.message);
            }
        } catch (error) {
            console.error('Error liking blog:', error);
        } finally {
            setIsLiking(false);
        }
    };

    const handleCommentSubmit = async (e) => {
        e.preventDefault();
        if (!newComment.trim() || !post?.id) return;

        try {
            const response = await fetch(`/api/blog/${post.id}/comment`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    userId: 'anonymous',
                    userName: generateMaskedName(),
                    comment: newComment.trim()
                })
            });

            const data = await response.json();
            if (data.success) {
                setComments([data.comment, ...comments]);
                setNewComment("");
            }
        } catch (error) {
            console.error('Error posting comment:', error);
            // Fallback to local state
            const comment = {
                id: Date.now(),
                author: generateMaskedName(),
                avatar: "/avatars/default.jpg",
                content: newComment,
                timestamp: "Just now",
                likes: 0,
                replies: []
            };
            setComments([comment, ...comments]);
            setNewComment("");
        }
    };

    const handleCommentLike = (commentId) => {
        setComments(comments.map(comment =>
            comment.id === commentId
                ? { ...comment, likes: comment.likes + 1 }
                : comment
        ));
    };

    const handleShare = (platform) => {
        const url = window.location.href;
        const title = post?.title || 'Check out this blog';

        switch (platform) {
            case 'copy':
                navigator.clipboard.writeText(url);
                alert('Link copied to clipboard!');
                break;
            case 'facebook':
                window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank');
                break;
            case 'twitter':
                window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`, '_blank');
                break;
            case 'whatsapp':
                window.open(`https://wa.me/?text=${encodeURIComponent(title + ' ' + url)}`, '_blank');
                break;
        }
        setShowShareMenu(false);
    };

    const handleLogout = () => {
        localStorage.removeItem('userProfile');
        localStorage.removeItem('isNewUser');
        window.location.href = '/login';
    };

    if (loading) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-rose-50 via-white to-rose-100">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-rose-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading blog post...</p>
                </div>
            </div>
        );
    }

    if (!post) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-rose-50 via-white to-rose-100">
                <div className="text-center">
                    <FontAwesomeIcon icon={faNewspaper} className="h-16 w-16 text-gray-300 mb-4" />
                    <h2 className="text-xl font-semibold text-gray-600 mb-2">Blog post not found</h2>
                    <p className="text-gray-500 mb-4">The article you're looking for doesn't exist or has been moved.</p>
                    <Link href="/blog" className="inline-flex items-center gap-2 text-rose-600 hover:text-rose-600 font-medium">
                        <FontAwesomeIcon icon={faArrowLeft} className="h-4 w-4" />
                        Back to Blogs
                    </Link>
                </div>
            </div>
        );
    }

    // Get the canonical URL using slug
    const canonicalUrl = `https://www.tara4u.com/blog/${post.slug || post.id}`;

    return (
        <>
            <BlogSchema
                title={post.title}
                description={post.excerpt}
                author={post.author}
                datePublished={post.publishDate}
                dateModified={post.updatedAt || post.publishDate}
                image={post.featuredImage || "https://www.tara4u.com/og-image.jpg"}
                url={canonicalUrl}
                category={post.category}
                tags={post.tags || []}
                schemaType={post.schemaType || "BlogPosting"}
                faqItems={post.faqItems || []}
                howToSteps={post.howToSteps || []}
            />

            <div className="flex min-h-screen flex-col bg-gradient-to-br from-rose-50 via-white to-rose-100">
                {/* Header */}
                <header className="sticky top-0 z-10 border-b border-rose-100 bg-white/60 backdrop-blur">
                    <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
                        <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
                            <img
                                src="/taralogo.jpg"
                                alt="Tara Logo"
                                className="h-8 w-8 rounded-full object-cover"
                            />
                            <span className="text-lg font-semibold text-rose-600">Tara4u</span>
                        </Link>

                        {/* Only show profile icon if user is logged in */}
                        {authLoading ? (
                            <div className="w-9 h-9 bg-rose-100 rounded-full animate-pulse"></div>
                        ) : user ? (
                            <Link href="/profile" className="rounded-full p-2 text-rose-600 hover:bg-rose-100 transition-colors">
                                <FontAwesomeIcon icon={faUser} className="h-5 w-5" />
                            </Link>
                        ) : (
                            <Link
                                href="/?openLogin=true"
                                className="btn-shine rounded-full bg-rose-200 px-4 py-2 text-sm font-semibold text-rose-700 shadow-sm hover:bg-rose-300 transition-all"
                            >
                                Login
                            </Link>
                        )}
                    </div>
                </header>

                {/* Main Content */}
                <main className="mx-auto w-full max-w-4xl flex-1 px-4 py-6">
                    {/* Back Button */}
                    <Link
                        href="/blog"
                        className="inline-flex items-center gap-2 text-rose-600 hover:text-rose-600 mb-6 transition-colors font-medium"
                    >
                        <FontAwesomeIcon icon={faArrowLeft} className="h-4 w-4" />
                        Back to Blogs
                    </Link>

                    {/* Article */}
                    <article className="rounded-2xl border border-rose-100 bg-white shadow-sm overflow-hidden mb-8">
                        {/* Hero Image */}
                        <div className="aspect-video bg-gradient-to-br from-rose-100 to-rose-200 flex items-center justify-center relative overflow-hidden">
                            <img
                                src={post.featuredImage || "/blogs-img/blogs1.jpeg"}
                                alt={post.title}
                                className="w-full h-full object-cover"
                            />
                            {post.trending && (
                                <div className="absolute top-4 right-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold flex items-center gap-1">
                                    🔥 Trending
                                </div>
                            )}
                        </div>

                        {/* Article Content */}
                        <div className="p-4">
                            {/* Meta Info */}
                            <div className="flex flex-wrap items-center gap-4 mb-6">
                                <span className="px-3 py-1 bg-rose-100 text-rose-600 rounded-full text-sm font-medium">
                                    {post.category}
                                </span>
                                <span className="flex items-center gap-1 text-sm text-gray-500">
                                    <FontAwesomeIcon icon={faClock} className="h-3 w-3" />
                                    {post.readTime}
                                </span>
                                <span className="flex items-center gap-1 text-sm text-gray-500">
                                    <FontAwesomeIcon icon={faCalendarAlt} className="h-3 w-3" />
                                    {new Date(post.publishDate).toLocaleDateString()}
                                </span>
                                <span className="flex items-center gap-1 text-sm text-gray-500">
                                    <FontAwesomeIcon icon={faEye} className="h-3 w-3" />
                                    {(post.views || 0).toLocaleString()} views
                                </span>
                            </div>

                            {/* Title */}
                            <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6 leading-tight">{post.title}</h1>

                            {/* Author Info */}
                            <div className="flex items-center gap-4 mb-8 pb-6 border-b border-rose-100">
                                <Link
                                    href={`/author/${post.author.toLowerCase().replace(/\s+/g, '-')}`}
                                    className="w-16 h-16 bg-rose-100 rounded-full flex items-center justify-center hover:bg-rose-200 transition-colors overflow-hidden"
                                >
                                    <img
                                        src="https://ik.imagekit.io/exerovn5q/author1.jpeg"
                                        alt={post.author}
                                        className="w-full h-full object-cover"
                                    />
                                </Link>
                                <div className="flex-1">
                                    <Link
                                        href={`/author/${post.author.toLowerCase().replace(/\s+/g, '-')}`}
                                        className="font-semibold text-gray-800 text-lg hover:text-rose-500 transition-colors"
                                    >
                                        {post.author}
                                    </Link>
                                    <p className="text-gray-600 text-sm">{post.authorBio}</p>
                                    <p className="text-sm text-gray-500 mt-1">Published on {new Date(post.publishDate).toLocaleDateString()}</p>
                                </div>
                            </div>

                            {/* Article Content */}
                            <div
                                className="prose prose-rose prose-lg max-w-none mb-8 blog-content"
                                dangerouslySetInnerHTML={{ __html: post.content }}
                            />

                            <style jsx global>{`
                            .blog-content {
                                line-height: 1.8;
                            }
                            .blog-content h1 {
                                font-size: 2rem;
                                font-weight: 700;
                                color: #1f2937;
                                margin-top: 2rem;
                                margin-bottom: 1rem;
                                border-left: 4px solid #fb7185;
                                padding-left: 1rem;
                            }
                            .blog-content h2 {
                                font-size: 1.75rem;
                                font-weight: 700;
                                color: #1f2937;
                                margin-top: 2rem;
                                margin-bottom: 1rem;
                                border-left: 4px solid #fb7185;
                                padding-left: 1rem;
                            }
                            .blog-content h3 {
                                font-size: 1.5rem;
                                font-weight: 600;
                                color: #374151;
                                margin-top: 1.5rem;
                                margin-bottom: 0.75rem;
                            }
                            .blog-content p {
                                color: #4b5563;
                                margin-bottom: 1rem;
                                font-size: 1.125rem;
                                line-height: 1.75;
                            }
                            .blog-content ul, .blog-content ol {
                                margin-left: 1.5rem;
                                margin-bottom: 1rem;
                                color: #4b5563;
                            }
                            .blog-content li {
                                margin-bottom: 0.5rem;
                                line-height: 1.75;
                            }
                            .blog-content strong, .blog-content b {
                                font-weight: 600;
                                color: #1f2937;
                            }
                            .blog-content em, .blog-content i {
                                font-style: italic;
                            }
                            .blog-content a {
                                color: #fb7185;
                                text-decoration: underline;
                            }
                            .blog-content a:hover {
                                color: #f43f5e;
                            }
                            .blog-content blockquote {
                                border-left: 4px solid #fda4af;
                                background-color: #fff1f2;
                                padding: 1rem;
                                margin: 1.5rem 0;
                                border-radius: 0 0.5rem 0.5rem 0;
                            }
                            .blog-content code {
                                background-color: #f3f4f6;
                                padding: 0.125rem 0.25rem;
                                border-radius: 0.25rem;
                                font-size: 0.875rem;
                                font-family: monospace;
                            }
                            .blog-content pre {
                                background-color: #1f2937;
                                color: #f3f4f6;
                                padding: 1rem;
                                border-radius: 0.5rem;
                                overflow-x: auto;
                                margin: 1rem 0;
                            }
                            .blog-content pre code {
                                background-color: transparent;
                                padding: 0;
                                color: inherit;
                            }
                            .blog-content img {
                                max-width: 100%;
                                height: auto;
                                border-radius: 0.5rem;
                                margin: 1.5rem 0;
                            }
                            .blog-content hr {
                                border: none;
                                border-top: 2px solid #fecdd3;
                                margin: 2rem 0;
                            }
                        `}</style>

                            {/* Tags */}
                            <div className="flex flex-wrap gap-2 mb-8">
                                {post.tags.map((tag) => (
                                    <span
                                        key={tag}
                                        className="px-3 py-1 bg-rose-50 text-rose-600 rounded-full text-sm border border-rose-100 hover:bg-rose-100 transition-colors cursor-pointer"
                                    >
                                        #{tag}
                                    </span>
                                ))}
                            </div>

                            {/* Action Buttons */}
                            <div className="flex items-center justify-between pt-6 border-t border-rose-100">
                                <div className="flex flex-col gap-2">
                                    <div className="flex items-center gap-3">
                                        <button
                                            onClick={handleLike}
                                            disabled={isLiking}
                                            className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all transform hover:scale-105 ${isLiked
                                                ? 'bg-rose-500 text-white scale-110 animate-pulse'
                                                : isLiking
                                                    ? 'bg-rose-200 text-rose-600 scale-105'
                                                    : 'bg-gray-100 text-gray-600 hover:bg-rose-50 hover:text-rose-600'
                                                } ${isLiking ? 'cursor-not-allowed' : 'cursor-pointer'}`}
                                            title=""
                                        >
                                            <FontAwesomeIcon
                                                icon={faHeart}
                                                className={`h-4 w-4 transition-all ${isLiked ? 'animate-bounce' : ''}`}
                                            />
                                            <span className="font-medium">{likeCount}</span>
                                            {isLiking && <span className="text-xs">+1</span>}
                                        </button>

                                        <div className="relative share-menu-container">
                                            <button
                                                onClick={() => setShowShareMenu(!showShareMenu)}
                                                className="flex items-center gap-2 px-4 py-2 rounded-full bg-gray-100 text-gray-600 hover:bg-green-50 hover:text-green-600 transition-colors"
                                            >
                                                <FontAwesomeIcon icon={faShare} className="h-4 w-4" />
                                                <span className="font-medium">Share</span>
                                            </button>

                                            {showShareMenu && (
                                                <div className="absolute top-[-80px] left-[110px] mt-2 bg-white border border-rose-100 rounded-xl shadow-lg p-2 z-50 min-w-[150px]">
                                                    <button
                                                        onClick={() => handleShare('copy')}
                                                        className="flex items-center gap-2 w-full px-3 py-2 text-sm text-gray-700 hover:bg-rose-50 rounded-lg"
                                                    >
                                                        <FontAwesomeIcon icon={faLink} className="h-4 w-4" />
                                                        Copy Link
                                                    </button>
                                                    <button
                                                        onClick={() => handleShare('facebook')}
                                                        className="flex items-center gap-2 w-full px-3 py-2 text-sm text-gray-700 hover:bg-rose-50 rounded-lg"
                                                    >
                                                        <FontAwesomeIcon icon={faShare} className="h-4 w-4" />
                                                        Facebook
                                                    </button>
                                                    <button
                                                        onClick={() => handleShare('twitter')}
                                                        className="flex items-center gap-2 w-full px-3 py-2 text-sm text-gray-700 hover:bg-rose-50 rounded-lg"
                                                    >
                                                        <FontAwesomeIcon icon={faShare} className="h-4 w-4" />
                                                        Twitter
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    {/* <p className="text-xs text-gray-500 ml-1">💡 You can like multiple times!</p> */}
                                </div>

                                <span className="flex items-center gap-2 text-gray-500">
                                    <FontAwesomeIcon icon={faComment} className="h-4 w-4" />
                                    <span className="font-medium">{comments.length} comments</span>
                                </span>
                            </div>
                        </div>
                    </article>

                    {/* Comments Section */}
                    <div className="rounded-2xl border border-rose-100 bg-white shadow-sm p-6 mb-8">
                        <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                            <FontAwesomeIcon icon={faComment} className="h-5 w-5 text-rose-500" />
                            Comments ({comments.length})
                        </h3>

                        {/* Add Comment Form */}
                        <form onSubmit={handleCommentSubmit} className="mb-8 bg-rose-50 rounded-xl p-4">
                            <textarea
                                value={newComment}
                                onChange={(e) => setNewComment(e.target.value)}
                                placeholder="Share your thoughts on this article..."
                                className="w-full rounded-xl border border-rose-200 px-4 py-3 text-sm outline-none ring-rose-100 focus:ring resize-none"
                                rows="4"
                            />
                            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mt-3">
                                <p className="text-xs text-gray-500">Be respectful and constructive in your comments</p>
                                <button
                                    type="submit"
                                    disabled={!newComment.trim()}
                                    className="w-full sm:w-auto px-4 sm:px-6 py-2 bg-rose-600 text-white rounded-xl hover:bg-rose-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                                >
                                    Post Comment
                                </button>
                            </div>
                        </form>

                        {/* Comments List */}
                        <div className="space-y-6">
                            {comments.length === 0 ? (
                                <div className="text-center py-8 text-gray-500">
                                    <FontAwesomeIcon icon={faComment} className="h-12 w-12 text-gray-300 mb-3" />
                                    <p>No comments yet. Be the first to share your thoughts!</p>
                                </div>
                            ) : (
                                comments.map((comment) => (
                                    <div key={comment.id} className="border-b border-rose-50 pb-6 last:border-b-0">
                                        <div className="flex items-start gap-4">
                                            <div className="w-12 h-12 bg-rose-100 rounded-full flex items-center justify-center flex-shrink-0">
                                                <FontAwesomeIcon icon={faUser} className="h-5 w-5 text-rose-500" />
                                            </div>
                                            <div className="flex-1">
                                                <div className="flex items-center gap-2 mb-2">
                                                    <span className="font-semibold text-gray-800">{comment.userName || comment.author}</span>
                                                    <span className="text-sm text-gray-500">{new Date(comment.timestamp).toLocaleString()}</span>
                                                </div>
                                                <p className="text-gray-700 mb-3 leading-relaxed">{comment.comment || comment.content}</p>
                                                <div className="flex items-center gap-4">
                                                    <button
                                                        onClick={() => handleCommentLike(comment.id)}
                                                        className="flex items-center gap-1 text-sm text-gray-500 hover:text-rose-600 transition-colors"
                                                    >
                                                        <FontAwesomeIcon icon={faThumbsUp} className="h-3 w-3" />
                                                        <span>{comment.likes}</span>
                                                    </button>
                                                    <button className="text-sm text-gray-500 hover:text-rose-600 transition-colors">
                                                        <FontAwesomeIcon icon={faReply} className="h-3 w-3 mr-1" />
                                                        Reply
                                                    </button>
                                                </div>

                                                {/* Replies */}
                                                {comment.replies && comment.replies.length > 0 && (
                                                    <div className="mt-4 ml-6 space-y-4 border-l-2 border-rose-100 pl-4">
                                                        {comment.replies.map((reply) => (
                                                            <div key={reply.id} className="flex items-start gap-3">
                                                                <div className="w-10 h-10 bg-rose-100 rounded-full flex items-center justify-center flex-shrink-0">
                                                                    <FontAwesomeIcon icon={faUser} className="h-4 w-4 text-rose-500" />
                                                                </div>
                                                                <div className="flex-1">
                                                                    <div className="flex items-center gap-2 mb-1">
                                                                        <span className="font-semibold text-gray-800 text-sm">{reply.author}</span>
                                                                        <span className="text-xs text-gray-500">{reply.timestamp}</span>
                                                                    </div>
                                                                    <p className="text-gray-700 text-sm mb-2 leading-relaxed">{reply.content}</p>
                                                                    <button className="flex items-center gap-1 text-xs text-gray-500 hover:text-rose-600 transition-colors">
                                                                        <FontAwesomeIcon icon={faThumbsUp} className="h-3 w-3" />
                                                                        <span>{reply.likes}</span>
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>

                    {/* FAQ Section */}
                    {post.faqItems && post.faqItems.length > 0 && (
                        <div className="rounded-2xl border border-rose-100 bg-white shadow-sm p-6 mb-8">
                            <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                                <FontAwesomeIcon icon={faBullseye} className="h-5 w-5 text-rose-500" />
                                Frequently Asked Questions
                            </h3>
                            <div className="space-y-4">
                                {post.faqItems.map((faq, index) => (
                                    <details
                                        key={index}
                                        className="group border border-rose-100 rounded-xl overflow-hidden"
                                    >
                                        <summary className="flex items-center justify-between cursor-pointer px-6 py-4 bg-rose-50 hover:bg-rose-100 transition-colors">
                                            <h4 className="font-semibold text-gray-800 pr-4">{faq.question}</h4>
                                            <svg
                                                className="w-5 h-5 text-rose-500 transition-transform group-open:rotate-180"
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                            >
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                            </svg>
                                        </summary>
                                        <div className="px-6 py-4 bg-white">
                                            <p className="text-gray-700 leading-relaxed">{faq.answer}</p>
                                        </div>
                                    </details>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Related Blogs */}
                    {relatedBlogs.length > 0 && (
                        <div className="mb-8">
                            <h3 className="text-2xl font-bold text-gray-800 mb-6">Related Articles</h3>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                {relatedBlogs.map((blog) => (
                                    <Link
                                        key={blog.id}
                                        href={`/blog/${blog.id}`}
                                        className="rounded-xl border border-rose-100 bg-white shadow-sm overflow-hidden hover:shadow-md transition-shadow"
                                    >
                                        <div className="aspect-video bg-gradient-to-br from-rose-100 to-rose-200 flex items-center justify-center">
                                            <img
                                                src={blog.featuredImage || "/blogs-img/blogs1.jpeg"}
                                                alt={blog.title}
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                        <div className="p-4">
                                            <span className="text-xs text-rose-600 font-medium">{blog.category}</span>
                                            <h4 className="font-semibold text-gray-800 mt-1 line-clamp-2">{blog.title}</h4>
                                            <p className="text-sm text-gray-600 mt-2 line-clamp-2">{blog.excerpt}</p>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    )}

                </main>

                <BottomNav activePage="blogs" />
            </div>
        </>
    );
}