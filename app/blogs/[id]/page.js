"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
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

const BLOG_POSTS = [
    {
        id: 1,
        title: "5 Simple Ways to Improve Your Mental Health Daily",
        excerpt: "Discover practical strategies that you can implement today to boost your mental wellness and create lasting positive changes in your life.",
        content: `Mental health is just as important as physical health, yet it's often overlooked in our daily routines. Here are five simple but effective ways to improve your mental health every day.

## 1. Start Your Day with Mindfulness

Beginning your day with just 5-10 minutes of mindfulness can set a positive tone for everything that follows. This doesn't have to be complicated meditation - it can be as simple as taking deep breaths while focusing on the present moment.

**Try this:** Set your alarm 10 minutes earlier and spend that time in quiet reflection, deep breathing, or gentle stretching. Notice how your body feels, what thoughts arise, and simply observe without judgment.

## 2. Move Your Body

Physical activity releases endorphins, which are natural mood boosters. You don't need an intense workout - a 15-minute walk, some stretching, or dancing to your favorite song can make a significant difference.

**The science:** Exercise increases the production of neurotransmitters like serotonin and dopamine, which help regulate mood and reduce symptoms of anxiety and depression.

## 3. Connect with Others

Human connection is vital for mental wellness. Make an effort to have meaningful conversations, whether it's calling a friend, having lunch with a colleague, or simply smiling at a stranger.

**Research shows:** People with strong social connections have a 50% increased likelihood of longevity and significantly lower rates of anxiety and depression.

## 4. Practice Gratitude

Take a moment each day to acknowledge what you're grateful for. This simple practice can shift your focus from what's lacking to what's abundant in your life.

**How to start:** Keep a gratitude journal and write down three things you're thankful for each day. They can be as simple as a good cup of coffee or as significant as a loving relationship.

## 5. Set Boundaries

Learning to say no and setting healthy boundaries is crucial for mental health. Protect your energy by being selective about commitments and relationships that drain you.

**Remember:** Boundaries aren't walls - they're gates with you as the gatekeeper. You decide what and who gets access to your time and energy.

## Conclusion

Remember, small consistent actions compound over time. Start with one of these practices and gradually incorporate others as they become habits. Your mental health is an investment that pays dividends in every area of your life.

If you're struggling with persistent mental health challenges, don't hesitate to reach out to a mental health professional. These daily practices are supplements to, not replacements for, professional care when needed.`,
        author: "Dr. Sarah Johnson",
        authorBio: "Clinical Psychologist & Mental Health Advocate with over 15 years of experience helping individuals achieve better mental wellness.",
        publishDate: "2024-11-01",
        readTime: "5 min read",
        category: "Mental Health",
        tags: ["wellness", "mental-health", "daily-habits", "self-care"],
        likes: 324,
        comments: 48,
        views: 2850,
        featured: true,
        trending: true
    },
    {
        id: 2,
        title: "The Science Behind Mindfulness and Meditation",
        excerpt: "Explore the fascinating research that shows how mindfulness practices can literally rewire your brain for better emotional regulation and stress management.",
        content: `Recent neuroscience research has revealed incredible insights about how mindfulness and meditation affect our brains. Studies using fMRI scans show that regular meditation practice can actually change brain structure.

## The Neuroplasticity Connection

Our brains are remarkably plastic, meaning they can reorganize and form new neural connections throughout our lives. Meditation takes advantage of this neuroplasticity to create positive changes in brain structure and function.

## Key Research Findings

### Increased Gray Matter
Studies have shown that just 8 weeks of mindfulness practice can increase gray matter density in areas associated with learning, memory, and emotional regulation.

### Reduced Amygdala Activity
The amygdala, our brain's alarm system, becomes less reactive with regular meditation practice, leading to reduced stress and anxiety responses.

### Enhanced Prefrontal Cortex Function
The prefrontal cortex, responsible for executive functions like decision-making and emotional regulation, shows increased activity and connectivity in regular meditators.

## Practical Applications

Understanding the science behind meditation can motivate us to maintain a consistent practice. Even short sessions of 10-15 minutes daily can produce measurable changes in brain structure within weeks.

The research is clear: meditation isn't just relaxation - it's a powerful tool for literally reshaping our brains for better mental health and emotional well-being.`,
        author: "Prof. Michael Chen",
        authorBio: "Neuroscientist & Mindfulness Researcher at Stanford University, specializing in contemplative neuroscience.",
        publishDate: "2024-10-28",
        readTime: "8 min read",
        category: "Science",
        tags: ["mindfulness", "meditation", "neuroscience", "research"],
        likes: 189,
        comments: 32,
        views: 1890,
        featured: true,
        trending: false
    },
    {
        id: 3,
        title: "Building Healthy Relationships in the Digital Age",
        excerpt: "Learn how to maintain meaningful connections and build stronger relationships while navigating the challenges of our increasingly digital world.",
        content: `In our hyperconnected yet often isolating digital world, building and maintaining healthy relationships has become both easier and more challenging than ever before.

## The Digital Paradox

While technology allows us to connect with people across the globe instantly, it can also create barriers to deep, meaningful relationships. Understanding this paradox is the first step to navigating it successfully.

## Strategies for Digital-Age Relationships

### 1. Quality Over Quantity
Focus on nurturing a smaller number of meaningful relationships rather than trying to maintain superficial connections with hundreds of people online.

### 2. Set Digital Boundaries
Establish phone-free times and spaces to ensure you're fully present with the people who matter most to you.

### 3. Use Technology Intentionally
Instead of mindless scrolling, use technology purposefully to strengthen existing relationships - schedule video calls, share meaningful content, or plan in-person meetups.

### 4. Practice Digital Empathy
Remember that there's a real person behind every screen. Approach online interactions with the same kindness and consideration you'd show in person.

## The Importance of Face-to-Face Connection

While digital communication is valuable, research shows that in-person interactions release oxytocin and other bonding hormones that strengthen relationships in ways that digital communication cannot replicate.

## Moving Forward

The key is finding balance - leveraging technology's benefits while preserving the irreplaceable value of genuine human connection. By being intentional about how we use digital tools, we can build stronger, more fulfilling relationships in the modern world.`,
        author: "Emma Rodriguez",
        authorBio: "Relationship Therapist & Digital Wellness Expert, helping couples and individuals navigate modern relationship challenges.",
        publishDate: "2024-10-25",
        readTime: "6 min read",
        category: "Relationships",
        tags: ["relationships", "digital-wellness", "communication", "social-media"],
        likes: 256,
        comments: 41,
        views: 2180,
        featured: false,
        trending: true
    }
];

const SUGGESTED_POSTS = [
    { id: 2, title: "The Science Behind Mindfulness and Meditation", category: "Science", readTime: "8 min read" },
    { id: 3, title: "Building Healthy Relationships in the Digital Age", category: "Relationships", readTime: "6 min read" },
    { id: 4, title: "Overcoming Anxiety: A Practical Guide", category: "Mental Health", readTime: "7 min read" }
];

const SAMPLE_COMMENTS = [
    {
        id: 1,
        author: "S***",
        avatar: "/avatars/default.jpg",
        content: "This article really helped me understand the importance of daily mental health practices. I've started implementing the gratitude practice and already feel more positive! The boundary setting tip is especially relevant for me as a working mom.",
        timestamp: "2 hours ago",
        likes: 12,
        replies: [
            {
                id: 11,
                author: "Dr. Sarah Johnson",
                avatar: "/authors/sarah.jpg",
                content: "So glad to hear that! Gratitude practice is such a simple yet powerful tool. As a working mom, boundaries are especially important - you're modeling healthy behavior for your children too. Keep it up!",
                timestamp: "1 hour ago",
                likes: 5
            }
        ]
    },
    {
        id: 2,
        author: "M***",
        avatar: "/avatars/default.jpg",
        content: "The mindfulness tip is spot on. I've been doing 10 minutes every morning for the past month and it's made such a difference in how I handle stress throughout the day. My colleagues have even noticed I'm more calm during meetings.",
        timestamp: "5 hours ago",
        likes: 8,
        replies: []
    },
    {
        id: 3,
        author: "L***",
        avatar: "/avatars/default.jpg",
        content: "Thank you for sharing these practical tips! The boundary setting one really resonates with me. It's something I struggle with but know I need to work on. Do you have any specific strategies for saying no without feeling guilty?",
        timestamp: "1 day ago",
        likes: 15,
        replies: [
            {
                id: 31,
                author: "Emma Rodriguez",
                avatar: "/authors/emma.jpg",
                content: "Great question! Try reframing 'no' as 'yes' to something else. When you say no to one thing, you're saying yes to your priorities, health, or family time. Also, practice phrases like 'Let me check my calendar and get back to you' to buy yourself time to consider.",
                timestamp: "18 hours ago",
                likes: 7
            }
        ]
    },
    {
        id: 4,
        author: "J***",
        avatar: "/avatars/default.jpg",
        content: "As someone who's struggled with anxiety, the connection between physical movement and mental health is so real. Even a 15-minute walk can completely shift my mood and perspective. Thanks for the reminder!",
        timestamp: "2 days ago",
        likes: 9,
        replies: []
    }
];

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
    const [comments, setComments] = useState(SAMPLE_COMMENTS);
    const [showShareMenu, setShowShareMenu] = useState(false);

    useEffect(() => {
        const postId = parseInt(params.id);
        const foundPost = BLOG_POSTS.find(p => p.id === postId);
        if (foundPost) {
            setPost(foundPost);
            setLikeCount(foundPost.likes);
        }
    }, [params.id]);

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

    const handleLike = () => {
        setIsLiked(!isLiked);
        setLikeCount(prev => isLiked ? prev - 1 : prev + 1);
    };

    const handleShare = (platform) => {
        const url = window.location.href;
        const title = post?.title || 'Blog Post';
        const text = post?.excerpt || 'Check out this article';

        switch (platform) {
            case 'native':
                if (navigator.share) {
                    navigator.share({ title, text, url });
                } else {
                    navigator.clipboard.writeText(url);
                    alert('Link copied to clipboard!');
                }
                break;
            case 'facebook':
                window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank');
                break;
            case 'twitter':
                window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`, '_blank');
                break;
            case 'linkedin':
                window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`, '_blank');
                break;
            case 'copy':
                navigator.clipboard.writeText(url);
                alert('Link copied to clipboard!');
                break;
        }
        setShowShareMenu(false);
    };

    const handleCommentSubmit = (e) => {
        e.preventDefault();
        if (newComment.trim()) {
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
                        {comments.map((comment) => (
                            <div key={comment.id} className="border-b border-rose-50 pb-6 last:border-b-0">
                                <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 bg-rose-100 rounded-full flex items-center justify-center flex-shrink-0">
                                        <FontAwesomeIcon icon={faUser} className="h-5 w-5 text-rose-500" />
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-2">
                                            <span className="font-semibold text-gray-800">{comment.author}</span>
                                            <span className="text-sm text-gray-500">{comment.timestamp}</span>
                                        </div>
                                        <p className="text-gray-700 mb-3 leading-relaxed">{comment.content}</p>
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
                        ))}
                    </div>
                </div>

                {/* Suggested Posts */}
                <div className="rounded-2xl border border-rose-100 bg-white shadow-sm p-6">
                    <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                        <FontAwesomeIcon icon={faTags} className="h-5 w-5 text-rose-500" />
                        You Might Also Like
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {SUGGESTED_POSTS.filter(p => p.id !== post.id).slice(0, 3).map((suggestedPost) => (
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
            </main>

            {/* Bottom Navbar */}
            <nav className="sticky bottom-0 z-10 border-t border-rose-100 bg-white/90 backdrop-blur">
                <div className="mx-auto grid max-w-7xl grid-cols-5 px-2 py-2 text-xs text-gray-600 sm:text-sm">
                    <MobileNavLink href="/journal" icon={faBookOpen} label="Journal" />
                    <MobileNavLink href="/chatlist" icon={faComments} label="Chats" />
                    <MobileNavLink href="/blogs" icon={faNewspaper} label="Blogs" active />
                    <MobileNavLink href="/insights" icon={faChartLine} label="Insights" />
                    <MobileNavLink href="/goals" icon={faBullseye} label="Goals" />
                </div>
            </nav>
        </div>
    );
}

function MobileNavLink({ href, icon, label, active, disabled }) {
    if (disabled) {
        return (
            <div className="flex flex-col items-center gap-1 rounded-xl px-2 py-2 text-gray-400 opacity-50 cursor-not-allowed">
                <FontAwesomeIcon icon={icon} className="h-5 w-5" />
                {label}
            </div>
        );
    }

    return (
        <Link
            href={href}
            className={`flex flex-col items-center gap-1 rounded-xl px-2 py-2 ${active ? "text-rose-600" : "text-gray-600"
                }`}
        >
            <FontAwesomeIcon icon={icon} className="h-5 w-5" />
            {label}
        </Link>
    );
}