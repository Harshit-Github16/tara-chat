"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import Head from "next/head";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import BlogSchema from "../components/BlogSchema";
import BottomNav from "../components/BottomNav";
import { useAuth } from "../contexts/AuthContext";
import {
    faChartLine,
    faBookOpen,
    faComments,
    faUser,

    faHeart,
    faComment,
    faShare,
    faEye,
    faClock,
    faCalendarAlt,
    faNewspaper,
    faSearch,
    faBullseye,
    faFilter,
    faTags,
    faFire,
    faStar,
    faArrowUp
} from "@fortawesome/free-solid-svg-icons";

// Removed static BLOG_POSTS - now fetching from API only

const CATEGORIES = ["All", "Mental Health", "Science", "Relationships", "Wellness", "Health", "Productivity"];

const ADMIN_EMAILS = [
    "harshit0150@gmail.com",
    "hello.tara4u@gmail.com",
    "ruchika.dave91@gmail.com"
];

export default function BlogsPage() {
    const { user } = useAuth();
    const [selectedCategory, setSelectedCategory] = useState("All");
    const [searchTerm, setSearchTerm] = useState("");
    const [sortBy, setSortBy] = useState("latest");
    const [blogs, setBlogs] = useState([]);
    const [loading, setLoading] = useState(true);

    const isAdmin = user?.email && ADMIN_EMAILS.includes(user.email);

    useEffect(() => {
        fetchBlogs();
    }, []);

    const fetchBlogs = async () => {
        try {
            setLoading(true);
            const response = await fetch('/api/admin/blogs');
            const data = await response.json();
            if (data.success && data.data.length > 0) {
                const blogsWithId = data.data.map(blog => ({
                    ...blog,
                    id: blog.slug || blog._id // Use slug as primary ID
                }));
                setBlogs(blogsWithId);
            } else {
                setBlogs([]);
            }
        } catch (error) {
            console.error('Error fetching blogs:', error);
            setBlogs([]);
        } finally {
            setLoading(false);
        }
    };

    const filteredPosts = blogs.filter(post => {
        const matchesCategory = selectedCategory === "All" || post.category === selectedCategory;
        const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            post.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (post.tags && post.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase())));
        return matchesCategory && matchesSearch;
    }).sort((a, b) => {
        switch (sortBy) {
            case "popular":
                return (b.likes || 0) - (a.likes || 0);
            case "views":
                return (b.views || 0) - (a.views || 0);
            case "comments":
                return (b.comments || 0) - (a.comments || 0);
            default:
                return new Date(b.publishDate) - new Date(a.publishDate);
        }
    });

    const featuredPosts = blogs.filter(post => post.featured);
    const trendingPosts = blogs.filter(post => post.trending).slice(0, 3);



    return (
        <>
            <Head>
                <title>Mental Health & Wellness Blog | Expert Tips & Insights - Tara</title>
                <meta name="description" content="Discover expert insights, tips, and stories to support your mental wellness journey. Read articles from leading professionals in psychology, neuroscience, and wellness." />
                <meta name="keywords" content="mental health blog, wellness articles, psychology tips, mindfulness guides, emotional wellness, mental health resources, therapy insights, self-care tips, tara4u" />
                <link rel="canonical" href="https://tara4u.com/blogs" />
                <meta property="og:title" content="Mental Health & Wellness Blog - Tara" />
                <meta property="og:description" content="Expert insights and tips for better emotional wellness. Read articles from leading professionals in psychology and mental health." />
                <meta property="og:type" content="website" />
                <meta property="og:url" content="https://tara4u.com/blogs" />
                <meta property="og:image" content="https://tara4u.com/og-image.jpg" />
                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:title" content="Mental Health & Wellness Blog - Tara" />
                <meta name="twitter:description" content="Expert insights and tips for better emotional wellness" />
                <meta name="twitter:image" content="https://tara4u.com/og-image.jpg" />
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{
                        __html: JSON.stringify({
                            "@context": "https://schema.org",
                            "@type": "Blog",
                            "name": "Tara Wellness Blog",
                            "description": "Expert insights and tips for mental health and emotional wellness",
                            "url": "https://tara4u.com/blogs",
                            "publisher": {
                                "@type": "Organization",
                                "name": "Tara",
                                "logo": "https://yourdomain.com/taralogo.jpg"
                            },
                            "blogPost": blogs.map(post => ({
                                "@type": "BlogPosting",
                                "headline": post.title,
                                "description": post.excerpt,
                                "author": {
                                    "@type": "Person",
                                    "name": post.author
                                },
                                "datePublished": post.publishDate,
                                "url": `https://tara4u.com/blogs/${post.id}`
                            }))
                        })
                    }}
                />
            </Head>
            <div className="flex min-h-screen flex-col bg-gradient-to-br from-rose-50 via-white to-rose-100">
                {/* Header */}
                <header className="sticky top-0 z-10 border-b border-rose-100 bg-white/60 backdrop-blur">
                    <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
                        <Link href="/chatlist" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
                            <img
                                src="/taralogo.jpg"
                                alt="Tara Logo"
                                className="h-8 w-8 rounded-full object-cover"
                            />
                            <span className="text-lg font-semibold text-rose-600">Tara</span>
                        </Link>

                        {/* Profile Icon */}
                        <Link href="/profile" className="rounded-full p-2 text-rose-600 hover:bg-rose-100 transition-colors">
                            <FontAwesomeIcon icon={faUser} className="h-5 w-5" />
                        </Link>

                    </div>
                </header>

                {/* Main Content */}
                <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-6">
                    {/* Hero Section */}
                    <div className="mb-8 text-center">
                        <div className="flex items-center justify-center gap-3 mb-4">
                            <FontAwesomeIcon icon={faNewspaper} className="h-8 w-8 text-rose-500" />
                            <h1 className="text-4xl font-bold text-gray-800">Wellness Blog</h1>
                        </div>
                        <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                            Discover insights, tips, and stories to support your mental wellness journey.
                            Expert advice from leading professionals in psychology, neuroscience, and wellness.
                        </p>
                    </div>



                    {/* Search and Filter */}
                    <div className="mb-8 bg-white rounded-2xl border border-rose-100 p-6 shadow-sm">
                        <div className="flex flex-col lg:flex-row gap-4">
                            {/* Search */}
                            <div className="flex-1 relative">
                                <FontAwesomeIcon icon={faSearch} className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Search articles, topics, or tags..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-rose-200 focus:border-rose-400 outline-none"
                                />
                            </div>

                            {/* Sort */}
                            <select
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value)}
                                className="px-4 py-3 rounded-xl border border-rose-200 focus:border-rose-400 outline-none bg-white"
                            >
                                <option value="latest">Latest</option>
                                <option value="popular">Most Popular</option>
                                <option value="views">Most Viewed</option>
                                <option value="comments">Most Discussed</option>
                            </select>
                        </div>

                        {/* Categories */}
                        <div className="flex gap-2 mt-4 overflow-x-auto pb-2">
                            {CATEGORIES.map((category) => (
                                <button
                                    key={category}
                                    onClick={() => setSelectedCategory(category)}
                                    className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${selectedCategory === category
                                        ? 'bg-rose-200 text-rose-700'
                                        : 'bg-rose-50 text-gray-600 border border-rose-200 hover:bg-rose-100'
                                        }`}
                                >
                                    {category}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                        {/* Main Content */}
                        <div className="lg:col-span-3">
                            {/* Featured Posts */}
                            {selectedCategory === "All" && (
                                <div className="mb-8">
                                    <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                                        <FontAwesomeIcon icon={faStar} className="h-5 w-5 text-yellow-500" />
                                        Featured Articles
                                    </h2>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        {featuredPosts.slice(0, 2).map((post) => (
                                            <Link
                                                key={post.id}
                                                href={`/blogs/${post.id}`}
                                                className="group block"
                                            >
                                                <div className="rounded-2xl border border-rose-100 bg-white shadow-sm overflow-hidden hover:shadow-lg transition-all duration-300 group-hover:-translate-y-1">
                                                    <div className="aspect-video bg-gradient-to-br from-rose-100 to-rose-200 flex items-center justify-center relative overflow-hidden">
                                                        <img
                                                            src="/blog1.png"
                                                            alt={post.title}
                                                            className="w-full h-full object-cover"
                                                        />
                                                        {post.trending && (
                                                            <div className="absolute top-3 right-3 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                                                                <FontAwesomeIcon icon={faFire} className="h-3 w-3" />
                                                                Trending
                                                            </div>
                                                        )}
                                                    </div>
                                                    <div className="p-6">
                                                        <div className="flex items-center gap-2 mb-3">
                                                            <span className="px-3 py-1 bg-rose-100 text-rose-600 rounded-full text-xs font-medium">
                                                                {post.category}
                                                            </span>
                                                            <span className="text-xs text-gray-500">{post.readTime}</span>
                                                        </div>
                                                        <h3 className="text-xl font-bold text-gray-800 mb-3 group-hover:text-rose-600 transition-colors">
                                                            {post.title}
                                                        </h3>
                                                        <p className="text-gray-600 mb-4 line-clamp-2">{post.excerpt}</p>
                                                        <div className="flex items-center justify-between">
                                                            <div className="flex items-center gap-2">
                                                                <div className="w-8 h-8 bg-rose-100 rounded-full flex items-center justify-center">
                                                                    <FontAwesomeIcon icon={faUser} className="h-4 w-4 text-rose-500" />
                                                                </div>
                                                                <div>
                                                                    <p className="text-sm font-medium text-gray-800">{post.author}</p>
                                                                    <p className="text-xs text-gray-500">{new Date(post.publishDate).toLocaleDateString()}</p>
                                                                </div>
                                                            </div>
                                                            <div className="flex items-center gap-4 text-sm text-gray-500">
                                                                <span className="flex items-center gap-1">
                                                                    <FontAwesomeIcon icon={faHeart} className="h-3 w-3" />
                                                                    {post.likes}
                                                                </span>
                                                                <span className="flex items-center gap-1">
                                                                    <FontAwesomeIcon icon={faComment} className="h-3 w-3" />
                                                                    {post.commentCount || (Array.isArray(post.comments) ? post.comments.length : 0)}
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </Link>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* All Posts */}
                            <div>
                                <h2 className="text-2xl font-bold text-gray-800 mb-6">
                                    {selectedCategory === "All" ? "Latest Articles" : `${selectedCategory} Articles`}
                                    <span className="text-sm font-normal text-gray-500 ml-2">({filteredPosts.length} articles)</span>
                                </h2>
                                {loading ? (
                                    <div className="text-center py-12 text-gray-500">Loading blogs...</div>
                                ) : (
                                    <div className="space-y-6">
                                        {filteredPosts.map((post) => (
                                            <Link
                                                key={post.id}
                                                href={`/blogs/${post.id}`}
                                                className="group block"
                                            >
                                                <div className="rounded-2xl border border-rose-100 bg-white shadow-sm overflow-hidden hover:shadow-md transition-all duration-300 group-hover:border-rose-200">
                                                    <div className="md:flex">
                                                        <div className="md:w-1/3 aspect-video md:aspect-square bg-gradient-to-br from-rose-100 to-rose-200 flex items-center justify-center relative overflow-hidden">
                                                            <img
                                                                src="/blog1.png"
                                                                alt={post.title}
                                                                className="w-full h-full object-cover"
                                                            />
                                                            {post.trending && (
                                                                <div className="absolute top-3 right-3 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                                                                    <FontAwesomeIcon icon={faFire} className="h-3 w-3" />
                                                                    Trending
                                                                </div>
                                                            )}
                                                        </div>
                                                        <div className="md:w-2/3 p-6">
                                                            <div className="flex items-center gap-2 mb-3">
                                                                <span className="px-3 py-1 bg-rose-100 text-rose-600 rounded-full text-xs font-medium">
                                                                    {post.category}
                                                                </span>
                                                                <span className="text-xs text-gray-500">{post.readTime}</span>
                                                                <span className="text-xs text-gray-500">•</span>
                                                                <span className="text-xs text-gray-500">{new Date(post.publishDate).toLocaleDateString()}</span>
                                                            </div>
                                                            <h3 className="text-xl font-bold text-gray-800 mb-2 group-hover:text-rose-600 transition-colors">
                                                                {post.title}
                                                            </h3>
                                                            <p className="text-gray-600 mb-4 line-clamp-2">{post.excerpt}</p>
                                                            <div className="flex items-center justify-between">
                                                                <div className="flex items-center gap-2">
                                                                    <div className="w-8 h-8 bg-rose-100 rounded-full flex items-center justify-center">
                                                                        <FontAwesomeIcon icon={faUser} className="h-4 w-4 text-rose-500" />
                                                                    </div>
                                                                    <div>
                                                                        <p className="text-sm font-medium text-gray-800">{post.author}</p>
                                                                        <p className="text-xs text-gray-500">{post.authorBio}</p>
                                                                    </div>
                                                                </div>
                                                                <div className="flex items-center gap-4 text-sm text-gray-500">
                                                                    <span className="flex items-center gap-1">
                                                                        <FontAwesomeIcon icon={faHeart} className="h-3 w-3" />
                                                                        {post.likes}
                                                                    </span>
                                                                    <span className="flex items-center gap-1">
                                                                        <FontAwesomeIcon icon={faComment} className="h-3 w-3" />
                                                                        {post.commentCount || (Array.isArray(post.comments) ? post.comments.length : 0)}
                                                                    </span>
                                                                    <span className="flex items-center gap-1">
                                                                        <FontAwesomeIcon icon={faEye} className="h-3 w-3" />
                                                                        {post.views}
                                                                    </span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </Link>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {!loading && filteredPosts.length === 0 && (
                                <div className="text-center py-12">
                                    <FontAwesomeIcon icon={faNewspaper} className="h-16 w-16 text-gray-300 mb-4" />
                                    <h3 className="text-xl font-semibold text-gray-600 mb-2">
                                        {blogs.length === 0 ? 'No blogs yet' : 'No articles found'}
                                    </h3>
                                    <p className="text-gray-500 mb-4">
                                        {blogs.length === 0
                                            ? 'Be the first to create a blog post!'
                                            : 'Try adjusting your search or filter criteria.'}
                                    </p>
                                    {isAdmin && blogs.length === 0 && (
                                        <Link
                                            href="/admin/blogs"
                                            className="inline-flex items-center gap-2 rounded-full bg-rose-200 px-5 py-3 text-sm font-semibold text-rose-700 hover:bg-rose-300 shadow-sm"
                                        >
                                            <FontAwesomeIcon icon={faNewspaper} /> Create First Blog
                                        </Link>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* Sidebar */}
                        <div className="space-y-6">
                            {/* Trending Posts */}
                            <div className="bg-white rounded-2xl border border-rose-100 p-6 shadow-sm">
                                <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                                    <FontAwesomeIcon icon={faArrowUp} className="h-4 w-4 text-red-500" />
                                    Trending Now
                                </h3>
                                <div className="space-y-4">
                                    {trendingPosts.map((post, index) => (
                                        <Link
                                            key={post.id}
                                            href={`/blogs/${post.id}`}
                                            className="group block"
                                        >
                                            <div className="flex gap-3">
                                                <div className="w-12 h-12 bg-gradient-to-br from-rose-100 to-rose-200 rounded-lg flex items-center justify-center flex-shrink-0">
                                                    <span className="text-lg font-bold text-rose-600">{index + 1}</span>
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <h4 className="text-sm font-medium text-gray-800 group-hover:text-rose-600 transition-colors line-clamp-2">
                                                        {post.title}
                                                    </h4>
                                                    <div className="flex items-center gap-2 mt-1 text-xs text-gray-500">
                                                        <span>{post.readTime}</span>
                                                        <span>•</span>
                                                        <span className="flex items-center gap-1">
                                                            <FontAwesomeIcon icon={faHeart} className="h-3 w-3" />
                                                            {post.likes}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            </div>

                            {/* Popular Tags */}
                            <div className="bg-white rounded-2xl border border-rose-100 p-6 shadow-sm">
                                <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                                    <FontAwesomeIcon icon={faTags} className="h-4 w-4 text-rose-500" />
                                    Popular Tags
                                </h3>
                                <div className="flex flex-wrap gap-2">
                                    {Array.from(new Set(blogs.flatMap(post => post.tags || []))).slice(0, 12).map((tag) => (
                                        <button
                                            key={tag}
                                            onClick={() => setSearchTerm(tag)}
                                            className="px-3 py-1 bg-rose-50 text-rose-600 rounded-full text-sm hover:bg-rose-100 transition-colors"
                                        >
                                            #{tag}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Newsletter Signup */}
                            <div className="bg-gradient-to-br from-rose-100 to-rose-200 rounded-2xl p-6">
                                <h3 className="text-lg font-bold text-gray-800 mb-2">Stay Updated</h3>
                                <p className="text-sm text-gray-600 mb-4">Get the latest wellness articles delivered to your inbox.</p>
                                <div className="space-y-3">
                                    <input
                                        type="email"
                                        placeholder="Enter your email"
                                        className="w-full px-4 py-2 rounded-lg border border-rose-200 focus:border-rose-400 outline-none text-sm"
                                    />
                                    <button className="w-full bg-rose-600 text-white py-2 rounded-lg font-medium hover:bg-rose-700 transition-colors text-sm">
                                        Subscribe
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </main>

                <BottomNav activePage="blogs" />
            </div>
        </>
    );
}