"use client";
import { useState } from "react";
import Link from "next/link";
import Head from "next/head";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import BlogSchema from "../components/BlogSchema";
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

const BLOG_POSTS = [
    {
        id: 1,
        title: "5 Simple Ways to Improve Your Mental Health Daily",
        excerpt: "Discover practical strategies that you can implement today to boost your mental wellness and create lasting positive changes in your life.",
        author: "Dr. Sarah Johnson",
        authorBio: "Clinical Psychologist & Mental Health Advocate",
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
        author: "Prof. Michael Chen",
        authorBio: "Neuroscientist & Mindfulness Researcher",
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
        author: "Emma Rodriguez",
        authorBio: "Relationship Therapist & Digital Wellness Expert",
        publishDate: "2024-10-25",
        readTime: "6 min read",
        category: "Relationships",
        tags: ["relationships", "digital-wellness", "communication", "social-media"],
        likes: 256,
        comments: 41,
        views: 2180,
        featured: false,
        trending: true
    },
    {
        id: 4,
        title: "Overcoming Anxiety: A Practical Guide",
        excerpt: "Practical techniques and strategies to help you manage anxiety effectively, from breathing exercises to cognitive behavioral techniques.",
        author: "Dr. James Wilson",
        authorBio: "Licensed Therapist & Anxiety Specialist",
        publishDate: "2024-10-22",
        readTime: "7 min read",
        category: "Mental Health",
        tags: ["anxiety", "coping-strategies", "mental-health", "therapy"],
        likes: 403,
        comments: 67,
        views: 3200,
        featured: false,
        trending: true
    },
    {
        id: 5,
        title: "The Power of Gratitude: Transform Your Mindset",
        excerpt: "Discover how practicing gratitude can rewire your brain for happiness and create profound changes in your overall well-being and life satisfaction.",
        author: "Dr. Lisa Park",
        authorBio: "Positive Psychology Researcher",
        publishDate: "2024-10-20",
        readTime: "4 min read",
        category: "Wellness",
        tags: ["gratitude", "positive-psychology", "happiness", "mindset"],
        likes: 178,
        comments: 29,
        views: 1650,
        featured: false,
        trending: false
    },
    {
        id: 6,
        title: "Sleep Better: The Ultimate Guide to Restful Nights",
        excerpt: "Learn evidence-based strategies to improve your sleep quality and wake up feeling refreshed and energized every morning.",
        author: "Dr. Robert Kim",
        authorBio: "Sleep Medicine Specialist",
        publishDate: "2024-10-18",
        readTime: "9 min read",
        category: "Health",
        tags: ["sleep", "health", "wellness", "lifestyle"],
        likes: 145,
        comments: 22,
        views: 1420,
        featured: false,
        trending: false
    },
    {
        id: 7,
        title: "Stress Management for Busy Professionals",
        excerpt: "Effective stress management techniques specifically designed for working professionals who need quick, practical solutions.",
        author: "Maria Santos",
        authorBio: "Executive Coach & Stress Management Expert",
        publishDate: "2024-10-15",
        readTime: "6 min read",
        category: "Productivity",
        tags: ["stress-management", "productivity", "work-life-balance", "professionals"],
        likes: 267,
        comments: 35,
        views: 2340,
        featured: true,
        trending: false
    },
    {
        id: 8,
        title: "Understanding Depression: Signs, Symptoms, and Support",
        excerpt: "A comprehensive guide to understanding depression, recognizing the signs, and finding the right support and treatment options.",
        author: "Dr. Amanda Foster",
        authorBio: "Psychiatrist & Mental Health Advocate",
        publishDate: "2024-10-12",
        readTime: "10 min read",
        category: "Mental Health",
        tags: ["depression", "mental-health", "support", "treatment"],
        likes: 198,
        comments: 43,
        views: 1980,
        featured: false,
        trending: false
    }
];

const CATEGORIES = ["All", "Mental Health", "Science", "Relationships", "Wellness", "Health", "Productivity"];

export default function BlogsPage() {
    const [selectedCategory, setSelectedCategory] = useState("All");
    const [searchTerm, setSearchTerm] = useState("");
    const [sortBy, setSortBy] = useState("latest");

    const filteredPosts = BLOG_POSTS.filter(post => {
        const matchesCategory = selectedCategory === "All" || post.category === selectedCategory;
        const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            post.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
            post.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
        return matchesCategory && matchesSearch;
    }).sort((a, b) => {
        switch (sortBy) {
            case "popular":
                return b.likes - a.likes;
            case "views":
                return b.views - a.views;
            case "comments":
                return b.comments - a.comments;
            default:
                return new Date(b.publishDate) - new Date(a.publishDate);
        }
    });

    const featuredPosts = BLOG_POSTS.filter(post => post.featured);
    const trendingPosts = BLOG_POSTS.filter(post => post.trending).slice(0, 3);



    return (
        <>
            <Head>
                <title>Mental Health & Wellness Blog | Expert Tips & Insights - Tara</title>
                <meta name="description" content="Discover expert insights, tips, and stories to support your mental wellness journey. Read articles from leading professionals in psychology, neuroscience, and wellness." />
                <meta name="keywords" content="mental health blog, wellness articles, psychology tips, mindfulness guides, emotional wellness, mental health resources, therapy insights, self-care tips" />
                <link rel="canonical" href="https://yourdomain.com/blogs" />
                <meta property="og:title" content="Mental Health & Wellness Blog - Tara" />
                <meta property="og:description" content="Expert insights and tips for better emotional wellness. Read articles from leading professionals in psychology and mental health." />
                <meta property="og:type" content="website" />
                <meta property="og:url" content="https://yourdomain.com/blogs" />
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{
                        __html: JSON.stringify({
                            "@context": "https://schema.org",
                            "@type": "Blog",
                            "name": "Tara Wellness Blog",
                            "description": "Expert insights and tips for mental health and emotional wellness",
                            "url": "https://yourdomain.com/blogs",
                            "publisher": {
                                "@type": "Organization",
                                "name": "Tara",
                                "logo": "https://yourdomain.com/taralogo.jpg"
                            },
                            "blogPost": BLOG_POSTS.map(post => ({
                                "@type": "BlogPosting",
                                "headline": post.title,
                                "description": post.excerpt,
                                "author": {
                                    "@type": "Person",
                                    "name": post.author
                                },
                                "datePublished": post.publishDate,
                                "url": `https://yourdomain.com/blogs/${post.id}`
                            }))
                        })
                    }}
                />
            </Head>
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
                                                                    {post.comments}
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
                                                                    {post.comments}
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
                            </div>

                            {filteredPosts.length === 0 && (
                                <div className="text-center py-12">
                                    <FontAwesomeIcon icon={faNewspaper} className="h-16 w-16 text-gray-300 mb-4" />
                                    <h3 className="text-xl font-semibold text-gray-600 mb-2">No articles found</h3>
                                    <p className="text-gray-500">Try adjusting your search or filter criteria.</p>
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
                                    {Array.from(new Set(BLOG_POSTS.flatMap(post => post.tags))).slice(0, 12).map((tag) => (
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

                {/* Bottom Navbar */}
                <nav className="sticky bottom-0 z-10 border-t border-rose-100 bg-white/90 backdrop-blur">
                    <div className="mx-auto grid max-w-7xl grid-cols-5 px-2 py-2 text-xs text-gray-600 sm:text-sm">
                        <MobileNavLink href="/journal" icon={faBookOpen} label="Journal" />
                        <MobileNavLink href="/chatlist" icon={faComments} label="Chats" />
                        <MobileNavLink href="/blogs" icon={faNewspaper} label="Blogs" active />
                        <MobileNavLink href="/insights" icon={faChartLine} label="Insights" />
                        <MobileNavLink href="#" icon={faBullseye} label="Goals" disabled />
                    </div>
                </nav>
            </div>
        </>
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