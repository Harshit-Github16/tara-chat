"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import Head from "next/head";
import Image from "next/image";
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
    const [showFeaturesDropdown, setShowFeaturesDropdown] = useState(false);
    const [showMobileMenu, setShowMobileMenu] = useState(false);
    const [showMobileFeaturesDropdown, setShowMobileFeaturesDropdown] = useState(false);
    const [dropdownTimeout, setDropdownTimeout] = useState(null);

    const isAdmin = user?.email && ADMIN_EMAILS.includes(user.email);

    // Cleanup dropdown timeout on unmount
    useEffect(() => {
        return () => {
            if (dropdownTimeout) clearTimeout(dropdownTimeout);
        };
    }, [dropdownTimeout]);

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
                <link rel="canonical" href="https://www.tara4u.com/blog" />
                <meta property="og:title" content="Mental Health & Wellness Blog - Tara" />
                <meta property="og:description" content="Expert insights and tips for better emotional wellness. Read articles from leading professionals in psychology and mental health." />
                <meta property="og:type" content="website" />
                <meta property="og:url" content="https://www.tara4u.com/blog" />
                <meta property="og:image" content="https://www.tara4u.com/og-image.jpg" />
                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:title" content="Mental Health & Wellness Blog - Tara" />
                <meta name="twitter:description" content="Expert insights and tips for better emotional wellness" />
                <meta name="twitter:image" content="https://www.tara4u.com/og-image.jpg" />

                {/* Main Blog Schema */}
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{
                        __html: JSON.stringify({
                            "@context": "https://schema.org",
                            "@type": "Blog",
                            "name": "Tara Wellness Blog",
                            "description": "Expert insights and tips for mental health and emotional wellness",
                            "url": "https://www.tara4u.com/blog",
                            "publisher": {
                                "@type": "Organization",
                                "name": "Tara",
                                "logo": {
                                    "@type": "ImageObject",
                                    "url": "https://www.tara4u.com/taralogo.jpg"
                                }
                            }
                        })
                    }}
                />

                {/* Individual Blog Post Schemas */}
                {blogs.map((post) => (
                    <script
                        key={post.id}
                        type="application/ld+json"
                        dangerouslySetInnerHTML={{
                            __html: JSON.stringify({
                                "@context": "https://schema.org",
                                "@type": "BlogPosting",
                                "headline": post.title,
                                "description": post.excerpt,
                                "image": post.featuredImage || "https://www.tara4u.com/og-image.jpg",
                                "author": {
                                    "@type": "Person",
                                    "name": post.author
                                },
                                "publisher": {
                                    "@type": "Organization",
                                    "name": "Tara",
                                    "logo": {
                                        "@type": "ImageObject",
                                        "url": "https://www.tara4u.com/taralogo.jpg"
                                    }
                                },
                                "datePublished": post.publishDate,
                                "dateModified": post.updatedAt || post.publishDate,
                                "mainEntityOfPage": {
                                    "@type": "WebPage",
                                    "@id": `https://www.tara4u.com/blog/${post.id}`
                                },
                                "url": `https://www.tara4u.com/blog/${post.id}`,
                                "articleSection": post.category,
                                "keywords": post.tags?.join(', ') || '',
                                "wordCount": post.content?.split(' ').length || 0,
                                "timeRequired": post.readTime || "5 min read"
                            })
                        }}
                    />
                ))}
            </Head>
            <div className="flex min-h-screen flex-col bg-gradient-to-br from-rose-50 via-white to-rose-100">
                {/* Header - Show home page navbar if not logged in, simple header if logged in */}
                {user ? (
                    // Logged in - Simple header with profile
                    <header className="sticky top-0 z-10 border-b border-rose-100 bg-white/60 backdrop-blur">
                        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
                            <Link href="/chatlist" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
                                <img
                                    src="/taralogo.jpg"
                                    alt="Tara Logo"
                                    className="h-8 w-8 rounded-full object-cover"
                                />
                                <span className="text-lg font-semibold text-rose-600">Tara4u</span>
                            </Link>

                            {/* Profile Icon */}
                            <Link href="/profile" className="rounded-full p-2 text-rose-600 hover:bg-rose-100 transition-colors">
                                <FontAwesomeIcon icon={faUser} className="h-5 w-5" />
                            </Link>
                        </div>
                    </header>
                ) : (
                    // Not logged in - Home page navbar
                    <header className="sticky top-0 z-50 border-b border-rose-100 bg-white/95 backdrop-blur-sm">
                        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
                            {/* Logo - Left */}
                            <Link href="/" className="flex items-center gap-2">
                                <Image
                                    src="/taralogo.jpg"
                                    alt="Tara Logo"
                                    width={32}
                                    height={32}
                                    className="h-8 w-8 rounded-full object-cover"
                                    priority
                                />
                                <span className="text-xl font-bold text-rose-500">Tara4u</span>
                            </Link>

                            {/* Navigation Menu - Center */}
                            <nav className="hidden lg:flex items-center gap-6 absolute left-1/2 transform -translate-x-1/2">
                                {/* Features Dropdown */}
                                <div
                                    className="relative"
                                    onMouseEnter={() => {
                                        if (dropdownTimeout) clearTimeout(dropdownTimeout);
                                        setShowFeaturesDropdown(true);
                                    }}
                                    onMouseLeave={() => {
                                        const timeout = setTimeout(() => {
                                            setShowFeaturesDropdown(false);
                                        }, 200);
                                        setDropdownTimeout(timeout);
                                    }}
                                >
                                    <button
                                        className="text-sm font-medium text-gray-700 hover:text-rose-600 transition-all duration-300 flex items-center gap-1"
                                    >
                                        Features
                                        <svg
                                            className={`w-4 h-4 transition-transform duration-200 ${showFeaturesDropdown ? 'rotate-180' : ''}`}
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                        </svg>
                                    </button>

                                    {/* Dropdown Menu */}
                                    {showFeaturesDropdown && (
                                        <div
                                            className="absolute top-full left-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-rose-100 py-2 z-50"
                                            onMouseEnter={() => {
                                                if (dropdownTimeout) clearTimeout(dropdownTimeout);
                                            }}
                                            onMouseLeave={() => {
                                                const timeout = setTimeout(() => {
                                                    setShowFeaturesDropdown(false);
                                                }, 200);
                                                setDropdownTimeout(timeout);
                                            }}
                                        >
                                            <Link
                                                href="/chatlist"
                                                className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-rose-50 hover:text-rose-600 transition-colors"
                                            >
                                                <FontAwesomeIcon icon={faComments} className="h-4 w-4" />
                                                Chat List
                                            </Link>
                                            <Link
                                                href="/journal"
                                                className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-rose-50 hover:text-rose-600 transition-colors"
                                            >
                                                <FontAwesomeIcon icon={faBookOpen} className="h-4 w-4" />
                                                Journals
                                            </Link>
                                            <Link
                                                href="/goals"
                                                className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-rose-50 hover:text-rose-600 transition-colors"
                                            >
                                                <FontAwesomeIcon icon={faBullseye} className="h-4 w-4" />
                                                Goals
                                            </Link>
                                            <Link
                                                href="/insights"
                                                className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-rose-50 hover:text-rose-600 transition-colors"
                                            >
                                                <FontAwesomeIcon icon={faChartLine} className="h-4 w-4" />
                                                Insights
                                            </Link>
                                        </div>
                                    )}
                                </div>

                                <Link
                                    href="/about"
                                    className="text-sm font-medium text-gray-700 hover:text-rose-600 transition-all duration-300"
                                >
                                    About Us
                                </Link>

                                <Link
                                    href="/blog"
                                    className="text-sm font-medium text-rose-600 transition-all duration-300"
                                >
                                    Blogs
                                </Link>

                                <Link
                                    href="/contact"
                                    className="text-sm font-medium text-gray-700 hover:text-rose-600 transition-colors"
                                >
                                    Contact
                                </Link>
                            </nav>

                            {/* Right Side Buttons */}
                            <div className="flex items-center gap-3">
                                {/* Mobile Menu Button */}
                                <button
                                    onClick={() => setShowMobileMenu(!showMobileMenu)}
                                    className="lg:hidden p-2 text-gray-700 hover:text-rose-600 transition-colors"
                                >
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        {showMobileMenu ? (
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                        ) : (
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                        )}
                                    </svg>
                                </button>

                                <Link
                                    href="/?openLogin=true"
                                    className="btn-shine rounded-full bg-rose-200 px-5 py-2 text-sm font-semibold text-rose-700 shadow-sm hover:bg-rose-300 transition-all"
                                >
                                    Start Talking
                                </Link>
                            </div>
                        </div>

                        {/* Mobile Menu */}
                        {showMobileMenu && (
                            <div className="lg:hidden border-t border-rose-100 bg-white">
                                <div className="px-6 py-4 space-y-3">
                                    {/* Features Dropdown */}
                                    <div>
                                        <button
                                            onClick={() => setShowMobileFeaturesDropdown(!showMobileFeaturesDropdown)}
                                            className="w-full flex items-center justify-between text-sm font-medium text-gray-700 hover:text-rose-600 transition-colors py-2"
                                        >
                                            Features
                                            <svg
                                                className={`w-4 h-4 transition-transform duration-200 ${showMobileFeaturesDropdown ? 'rotate-180' : ''}`}
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                            >
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                            </svg>
                                        </button>

                                        {showMobileFeaturesDropdown && (
                                            <div className="pl-4 mt-2 space-y-2">
                                                <Link
                                                    href="/chatlist"
                                                    className="flex items-center gap-3 py-2 text-sm text-gray-600 hover:text-rose-600 transition-colors"
                                                    onClick={() => setShowMobileMenu(false)}
                                                >
                                                    <FontAwesomeIcon icon={faComments} className="h-4 w-4" />
                                                    Chat List
                                                </Link>
                                                <Link
                                                    href="/journal"
                                                    className="flex items-center gap-3 py-2 text-sm text-gray-600 hover:text-rose-600 transition-colors"
                                                    onClick={() => setShowMobileMenu(false)}
                                                >
                                                    <FontAwesomeIcon icon={faBookOpen} className="h-4 w-4" />
                                                    Journals
                                                </Link>
                                                <Link
                                                    href="/goals"
                                                    className="flex items-center gap-3 py-2 text-sm text-gray-600 hover:text-rose-600 transition-colors"
                                                    onClick={() => setShowMobileMenu(false)}
                                                >
                                                    <FontAwesomeIcon icon={faBullseye} className="h-4 w-4" />
                                                    Goals
                                                </Link>
                                                <Link
                                                    href="/insights"
                                                    className="flex items-center gap-3 py-2 text-sm text-gray-600 hover:text-rose-600 transition-colors"
                                                    onClick={() => setShowMobileMenu(false)}
                                                >
                                                    <FontAwesomeIcon icon={faChartLine} className="h-4 w-4" />
                                                    Insights
                                                </Link>
                                            </div>
                                        )}
                                    </div>

                                    <Link
                                        href="/about"
                                        className="block text-sm font-medium text-gray-700 hover:text-rose-600 transition-colors py-2"
                                        onClick={() => setShowMobileMenu(false)}
                                    >
                                        About Us
                                    </Link>

                                    <Link
                                        href="/blog"
                                        className="block text-sm font-medium text-rose-600 transition-colors py-2"
                                        onClick={() => setShowMobileMenu(false)}
                                    >
                                        Blogs
                                    </Link>

                                    <Link
                                        href="/contact"
                                        className="block text-sm font-medium text-gray-700 hover:text-rose-600 transition-colors py-2"
                                        onClick={() => setShowMobileMenu(false)}
                                    >
                                        Contact
                                    </Link>

                                    <Link
                                        href="/?openLogin=true"
                                        className="block w-full mt-4 rounded-full bg-rose-200 px-5 py-3 text-sm font-semibold text-rose-700 shadow-sm hover:bg-rose-300 transition-all text-center"
                                        onClick={() => setShowMobileMenu(false)}
                                    >
                                        Start Talking
                                    </Link>
                                </div>
                            </div>
                        )}
                    </header>
                )}

                {/* Main Content */}
                <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-6">
                    {/* Hero Section */}
                    <div className="mb-8 text-center">
                        <div className="flex items-center justify-center gap-3 mb-4">
                            <FontAwesomeIcon icon={faNewspaper} className="h-8 w-8 text-rose-500" />
                            <h1 className="text-4xl font-bold text-gray-800">Wellness Blog</h1>
                        </div>
                        <p className="text-gray-600 text-lg max-w-7xl mx-auto">
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
                                        ? 'bg-rose-200 text-rose-600'
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
                                                href={`/blog/${post.id}`}
                                                className="group block"
                                            >
                                                <div className="rounded-2xl border border-rose-100 bg-white shadow-sm overflow-hidden hover:shadow-lg transition-all duration-300 group-hover:-translate-y-1">
                                                    <div className="aspect-video bg-gradient-to-br from-rose-100 to-rose-200 flex items-center justify-center relative overflow-hidden">
                                                        <img
                                                            src={post.featuredImage || "/blogs-img/blogs1.jpeg"}
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
                                                                    {post.likes || 0}
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
                                                href={`/blog/${post.id}`}
                                                className="group block"
                                            >
                                                <div className="rounded-2xl border border-rose-100 bg-white shadow-sm overflow-hidden hover:shadow-md transition-all duration-300 group-hover:border-rose-200">
                                                    <div className="md:flex">
                                                        <div className="w-full md:w-[40%]     flex items-center justify-center relative  flex-shrink-0">
                                                            <img
                                                                src={post.featuredImage || "/blogs-img/blogs1.jpeg"}
                                                                alt={post.title}
                                                                className="w-full h-full object-contain"
                                                            />
                                                            {post.trending && (
                                                                <div className="absolute top-3 right-3 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                                                                    <FontAwesomeIcon icon={faFire} className="h-3 w-3" />
                                                                    Trending
                                                                </div>
                                                            )}
                                                        </div>
                                                        <div className="md:w-[60%] ">
                                                            <div className="p-4">
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
                                                                            {post.likes || 0}
                                                                        </span>
                                                                        <span className="flex items-center gap-1">
                                                                            <FontAwesomeIcon icon={faComment} className="h-3 w-3" />
                                                                            {post.commentCount || (Array.isArray(post.comments) ? post.comments.length : 0)}
                                                                        </span>
                                                                        <span className="flex items-center gap-1">
                                                                            <FontAwesomeIcon icon={faEye} className="h-3 w-3" />
                                                                            {post.views || 0}
                                                                        </span>
                                                                    </div>
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
                                            className="inline-flex items-center gap-2 rounded-full bg-rose-200 px-5 py-3 text-sm font-semibold text-rose-600 hover:bg-rose-300 shadow-sm"
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
                                                            {post.likes || 0}
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


                        </div>
                    </div>
                </main>

                {/* Only show BottomNav if user is logged in */}
                {user && <BottomNav activePage="blog" />}
            </div>
        </>
    );
}