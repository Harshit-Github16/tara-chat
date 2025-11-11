"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import BottomNav from "../../components/BottomNav";
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

export default function BlogPostPage() {
    const params = useParams();
    const [post, setPost] = useState(null);
    const [isLiked, setIsLiked] = useState(false);
    const [likeCount, setLikeCount] = useState(0);
    const [newComment, setNewComment] = useState("");
    const [comments, setComments] = useState([]);
    const [showShareMenu, setShowShareMenu] = useState(false);
    const [relatedBlogs, setRelatedBlogs] = useState([]);

    useEffect(() => {
        fetchBlog();
    }, [params.id]);

    const fetchBlog = async () => {
        try {
            const response = await fetch('/api/admin/blogs');
            const data = await response.json();
            if (data.success) {
                // Find by slug or _id
                const foundPost = data.data.find(p =>
                    p.slug === params.id ||
                    p._id === params.id ||
                    p.id === parseInt(params.id)
                );

                if (foundPost) {
                    // Use slug as primary identifier
                    const blogId = foundPost.slug || foundPost._id;
                    setPost({ ...foundPost, id: blogId });
                    setLikeCount(foundPost.likes || 0);

                    // Increment view count
                    incrementView(blogId);
                    // Load comments
                    loadComments(blogId);

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
        }
    };

    const incrementView = async (blogId) => {
        try {
            await fetch(`/api/blogs/${blogId}/view`, { method: 'POST' });
        } catch (error) {
            console.error('Error incrementing view:', error);
        }
    };

    const loadComments = async (blogId) => {
        try {
            const response = await fetch(`/api/blogs/${blogId}/comment`);
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
        if (!post?.id) return;

        try {
            const response = await fetch(`/api/blogs/${post.id}/like`, {
                method: 'POST'
            });
            const data = await response.json();
            if (data.success) {
                setLikeCount(data.likes);
                setIsLiked(true);
            }
        } catch (error) {
            console.error('Error liking blog:', error);
        }
    };

    const handleCommentSubmit = async (e) => {
        e.preventDefault();
        if (!newComment.trim() || !post?.id) return;

        try {
            const response = await fetch(`/api/blogs/${post.id}/comment`, {
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

    if (!post) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-rose-50 via-white to-rose-100">
                <div className="text-center">
                    <FontAwesomeIcon icon={faNewspaper} className="h-16 w-16 text-gray-300 mb-4" />
                    <h2 className="text-xl font-semibold text-gray-600 mb-2">Blog post not found</h2>
                    <p className="text-gray-500 mb-4">The article you're looking for doesn't exist or has been moved.</p>
                    <Link href="/blogs" className="inline-flex items-center gap-2 text-rose-600 hover:text-rose-700 font-medium">
                        <FontAwesomeIcon icon={faArrowLeft} className="h-4 w-4" />
                        Back to Blogs
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="flex min-h-screen flex-col bg-gradient-to-br from-rose-50 via-white to-rose-100">
            {/* Header */}
            <header className="sticky top-0 z-10 border-b border-rose-100 bg-white/60 backdrop-blur">
                <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
                    <div className="flex items-center gap-3">
                        <img
                            src="/taralogo.jpg"
                            alt="Tara Logo"
                            className="h-8 w-8 rounded-full object-cover"
                        />
                        <span className="text-lg font-semibold text-rose-600">Tara</span>
                    </div>
                    <Link href="/profile" className="rounded-full p-2 text-rose-600 hover:bg-rose-100 transition-colors">
                        <FontAwesomeIcon icon={faUser} className="h-5 w-5" />
                    </Link>
                </div>
            </header>

            {/* Main Content */}
            <main className="mx-auto w-full max-w-4xl flex-1 px-4 py-6">
                {/* Back Button */}
                <Link
                    href="/blogs"
                    className="inline-flex items-center gap-2 text-rose-600 hover:text-rose-700 mb-6 transition-colors font-medium"
                >
                    <FontAwesomeIcon icon={faArrowLeft} className="h-4 w-4" />
                    Back to Blogs
                </Link>

                {/* Article */}
                <article className="rounded-2xl border border-rose-100 bg-white shadow-sm overflow-hidden mb-8">
                    {/* Hero Image */}
                    <div className="aspect-video bg-gradient-to-br from-rose-100 to-rose-200 flex items-center justify-center relative overflow-hidden">
                        <img
                            src="/blog1.png"
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
                    <div className="p-8">
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
                                {post.views.toLocaleString()} views
                            </span>
                        </div>

                        {/* Title */}
                        <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6 leading-tight">{post.title}</h1>

                        {/* Author Info */}
                        <div className="flex items-center gap-4 mb-8 pb-6 border-b border-rose-100">
                            <div className="w-16 h-16 bg-rose-100 rounded-full flex items-center justify-center">
                                <FontAwesomeIcon icon={faUser} className="h-8 w-8 text-rose-500" />
                            </div>
                            <div className="flex-1">
                                <p className="font-semibold text-gray-800 text-lg">{post.author}</p>
                                <p className="text-gray-600 text-sm">{post.authorBio}</p>
                                <p className="text-sm text-gray-500 mt-1">Published on {new Date(post.publishDate).toLocaleDateString()}</p>
                            </div>
                        </div>

                        {/* Article Content */}
                        <div className="prose prose-rose prose-lg max-w-none mb-8">
                            {post.content.split('\n\n').map((paragraph, index) => {
                                if (paragraph.startsWith('## ')) {
                                    return (
                                        <h2 key={index} className="text-2xl font-bold text-gray-800 mt-8 mb-4 border-l-4 border-rose-400 pl-4">
                                            {paragraph.replace('## ', '')}
                                        </h2>
                                    );
                                } else if (paragraph.startsWith('### ')) {
                                    return (
                                        <h3 key={index} className="text-xl font-bold text-gray-800 mt-6 mb-3">
                                            {paragraph.replace('### ', '')}
                                        </h3>
                                    );
                                } else if (paragraph.startsWith('**') && paragraph.endsWith('**')) {
                                    return (
                                        <div key={index} className="bg-rose-50 border-l-4 border-rose-300 p-4 my-4 rounded-r-lg">
                                            <p className="font-medium text-gray-800 mb-2">{paragraph.replace(/\*\*/g, '')}</p>
                                        </div>
                                    );
                                } else {
                                    return (
                                        <p key={index} className="text-gray-700 leading-relaxed mb-4 text-lg">
                                            {paragraph}
                                        </p>
                                    );
                                }
                            })}
                        </div>

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
                            <div className="flex items-center gap-3">
                                <button
                                    onClick={handleLike}
                                    className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all ${isLiked
                                        ? 'bg-rose-100 text-rose-600 scale-105'
                                        : 'bg-gray-100 text-gray-600 hover:bg-rose-50 hover:text-rose-600'
                                        }`}
                                >
                                    <FontAwesomeIcon icon={faHeart} className="h-4 w-4" />
                                    <span className="font-medium">{likeCount}</span>
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
                                        <div className="absolute top-full left-0 mt-2 bg-white border border-rose-100 rounded-xl shadow-lg p-2 z-50 min-w-[150px]">
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
                                            <button
                                                onClick={() => handleShare('linkedin')}
                                                className="flex items-center gap-2 w-full px-3 py-2 text-sm text-gray-700 hover:bg-rose-50 rounded-lg"
                                            >
                                                <FontAwesomeIcon icon={faShare} className="h-4 w-4" />
                                                LinkedIn
                                            </button>
                                        </div>
                                    )}
                                </div>
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
                        <div className="flex justify-between items-center mt-3">
                            <p className="text-xs text-gray-500">Be respectful and constructive in your comments</p>
                            <button
                                type="submit"
                                disabled={!newComment.trim()}
                                className="px-6 py-2 bg-rose-600 text-white rounded-full font-medium hover:bg-rose-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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

                {/* Related Posts */}
                {relatedBlogs.length > 0 && (
                    <div className="rounded-2xl border border-rose-100 bg-white shadow-sm p-6">
                        <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                            <FontAwesomeIcon icon={faTags} className="h-5 w-5 text-rose-500" />
                            You Might Also Like
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {relatedBlogs.map((suggestedPost) => (
                                <Link
                                    key={suggestedPost.id}
                                    href={`/blogs/${suggestedPost.id}`}
                                    className="group block"
                                >
                                    <div className="p-4 bg-rose-50 rounded-xl hover:bg-rose-100 transition-colors border border-rose-100">
                                        <div className="aspect-video bg-gradient-to-br from-rose-100 to-rose-200 rounded-lg flex items-center justify-center mb-3">
                                            <FontAwesomeIcon icon={faNewspaper} className="h-6 w-6 text-rose-400" />
                                        </div>
                                        <span className="text-xs text-rose-600 font-medium">{suggestedPost.category}</span>
                                        <h4 className="text-sm font-semibold text-gray-800 mt-1 mb-2 group-hover:text-rose-600 transition-colors line-clamp-2">
                                            {suggestedPost.title}
                                        </h4>
                                        <span className="text-xs text-gray-500">{suggestedPost.readTime}</span>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                )}
            </main>

            <BottomNav activePage="blogs" />
        </div>
    );
}