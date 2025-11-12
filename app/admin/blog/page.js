"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faArrowLeft,
    faPlus,
    faEdit,
    faTrash,
    faEye,
    faTimes,
    faStar,
    faFire
} from "@fortawesome/free-solid-svg-icons";
import ProtectedRoute from "../../components/ProtectedRoute";
import { useAuth } from "../../contexts/AuthContext";
import BottomNav from "../../components/BottomNav";

const ADMIN_EMAILS = [
    "harshit0150@gmail.com",
    "hello.tara4u@gmail.com",
    "ruchika.dave91@gmail.com"
];

export default function ManageBlogsPage() {
    const { user } = useAuth();
    const [blogs, setBlogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        if (user?.email && !ADMIN_EMAILS.includes(user.email)) {
            window.location.href = "/journal";
        }
    }, [user]);

    useEffect(() => {
        if (user?.email && ADMIN_EMAILS.includes(user.email)) {
            fetchBlogs();
        }
    }, [user]);

    const fetchBlogs = async () => {
        try {
            setLoading(true);
            const response = await fetch('/api/admin/blog');
            const data = await response.json();
            if (data.success) {
                setBlogs(data.data);
            }
        } catch (error) {
            console.error('Error fetching blogs:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (blogId) => {
        if (!confirm('Are you sure you want to delete this blog?')) return;

        try {
            const response = await fetch(`/api/admin/blog?id=${blogId}`, {
                method: 'DELETE'
            });
            const data = await response.json();
            if (data.success) {
                setBlogs(blogs.filter(b => b._id !== blogId));
                alert('Blog deleted successfully!');
            }
        } catch (error) {
            console.error('Error deleting blog:', error);
            alert('Failed to delete blog');
        }
    };

    if (!user?.email || !ADMIN_EMAILS.includes(user.email)) {
        return null;
    }

    return (
        <ProtectedRoute>
            <div className="flex min-h-screen flex-col bg-gradient-to-br from-rose-50 via-white to-rose-100">
                <header className="sticky top-0 z-10 border-b border-rose-100 bg-white/60 backdrop-blur">
                    <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
                        <div className="flex items-center gap-3">
                            <Link href="/admin" className="text-rose-600 hover:text-rose-700">
                                <FontAwesomeIcon icon={faArrowLeft} className="h-5 w-5" />
                            </Link>
                            <span className="text-lg font-semibold text-rose-600">Manage Blogs</span>
                        </div>

                        <button
                            onClick={() => setShowModal(true)}
                            className="flex items-center gap-2 rounded-full bg-rose-200 px-4 py-2 text-sm font-semibold text-rose-700 hover:bg-rose-300 shadow-sm"
                        >
                            <FontAwesomeIcon icon={faPlus} /> Add Blog
                        </button>
                    </div>
                </header>

                <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-6">
                    {loading ? (
                        <div className="text-center py-12 text-gray-500">Loading blogs...</div>
                    ) : blogs.length === 0 ? (
                        <div className="text-center py-12">
                            <div className="text-6xl mb-4">📝</div>
                            <h2 className="text-xl font-semibold text-gray-800 mb-2">No blogs yet</h2>
                            <p className="text-gray-600 mb-4">Create your first blog post</p>
                            <button
                                onClick={() => setShowModal(true)}
                                className="rounded-full bg-rose-200 px-5 py-3 text-sm font-semibold text-rose-700 hover:bg-rose-300 shadow-sm"
                            >
                                <FontAwesomeIcon icon={faPlus} /> Add Blog
                            </button>
                        </div>
                    ) : (
                        <div className="bg-white rounded-2xl border border-rose-100 shadow-sm overflow-hidden">
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead className="bg-rose-50 border-b border-rose-100">
                                        <tr>
                                            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Title</th>
                                            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Author</th>
                                            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Category</th>
                                            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Date</th>
                                            <th className="px-4 py-3 text-center text-xs font-semibold text-gray-700 uppercase">Stats</th>
                                            <th className="px-4 py-3 text-center text-xs font-semibold text-gray-700 uppercase">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-rose-100">
                                        {blogs.map((blog) => (
                                            <tr key={blog._id} className="hover:bg-rose-50/50 transition-colors">
                                                <td className="px-4 py-4">
                                                    <div className="flex items-center gap-2">
                                                        <div>
                                                            <p className="font-semibold text-gray-800 text-sm">{blog.title}</p>
                                                            <p className="text-xs text-gray-500 line-clamp-1">{blog.excerpt}</p>
                                                        </div>
                                                        {blog.featured && (
                                                            <FontAwesomeIcon icon={faStar} className="h-3 w-3 text-yellow-500" />
                                                        )}
                                                        {blog.trending && (
                                                            <FontAwesomeIcon icon={faFire} className="h-3 w-3 text-orange-500" />
                                                        )}
                                                    </div>
                                                </td>
                                                <td className="px-4 py-4 text-sm text-gray-700">{blog.author}</td>
                                                <td className="px-4 py-4">
                                                    <span className="inline-block rounded-full bg-rose-100 px-2 py-1 text-xs font-semibold text-rose-600">
                                                        {blog.category}
                                                    </span>
                                                </td>
                                                <td className="px-4 py-4 text-sm text-gray-600">{blog.publishDate}</td>
                                                <td className="px-4 py-4">
                                                    <div className="flex items-center justify-center gap-3 text-xs text-gray-600">
                                                        <span>👁️ {blog.views}</span>
                                                        <span>❤️ {blog.likes}</span>
                                                    </div>
                                                </td>
                                                <td className="px-4 py-4">
                                                    <div className="flex items-center justify-center gap-2">
                                                        <Link
                                                            href={`/blogs/${blog._id}`}
                                                            className="rounded-lg border border-rose-200 px-3 py-1 text-xs font-semibold text-rose-600 hover:bg-rose-50"
                                                        >
                                                            <FontAwesomeIcon icon={faEye} />
                                                        </Link>
                                                        <button
                                                            onClick={() => handleDelete(blog._id)}
                                                            className="rounded-lg border border-red-200 px-3 py-1 text-xs font-semibold text-red-600 hover:bg-red-50"
                                                        >
                                                            <FontAwesomeIcon icon={faTrash} />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}
                </main>

                <BottomNav activePage="admin" />

                {showModal && (
                    <AddBlogModal
                        onClose={() => setShowModal(false)}
                        onSuccess={(newBlog) => {
                            setBlogs([newBlog, ...blogs]);
                            setShowModal(false);
                        }}
                    />
                )}
            </div>
        </ProtectedRoute>
    );
}

function AddBlogModal({ onClose, onSuccess }) {
    const [formData, setFormData] = useState({
        title: '',
        slug: '',
        excerpt: '',
        content: '',
        author: '',
        authorBio: '',
        category: 'Mental Health',
        tags: '',
        featured: false,
        trending: false
    });
    const [submitting, setSubmitting] = useState(false);

    // Generate slug from title
    const generateSlug = (title) => {
        return title
            .toLowerCase()
            .replace(/[^a-z0-9\s-]/g, '')
            .trim()
            .replace(/\s+/g, '-')
            .replace(/-+/g, '-')
            .substring(0, 60)
            .replace(/-$/, '');
    };

    // Auto-generate slug when title changes
    const handleTitleChange = (e) => {
        const newTitle = e.target.value;
        setFormData({
            ...formData,
            title: newTitle,
            slug: generateSlug(newTitle)
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.title || !formData.excerpt || !formData.content || !formData.author) {
            alert('Please fill all required fields');
            return;
        }

        try {
            setSubmitting(true);
            const response = await fetch('/api/admin/blog', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...formData,
                    tags: formData.tags.split(',').map(t => t.trim()).filter(Boolean)
                })
            });

            const data = await response.json();
            if (data.success) {
                alert('Blog created successfully!');
                onSuccess(data.data);
            } else {
                alert(data.message || 'Failed to create blog');
            }
        } catch (error) {
            console.error('Error creating blog:', error);
            alert('Failed to create blog');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
            <div className="w-full max-w-4xl max-h-[90vh] rounded-3xl border border-rose-100 bg-white shadow-xl flex flex-col">
                <div className="flex items-center justify-between p-6 border-b border-rose-100 flex-shrink-0">
                    <h2 className="text-xl font-bold text-gray-900">Add New Blog</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                        <FontAwesomeIcon icon={faTimes} className="h-5 w-5" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
                        <input
                            type="text"
                            value={formData.title}
                            onChange={handleTitleChange}
                            className="w-full rounded-xl border border-rose-200 px-4 py-2 text-sm outline-none ring-rose-100 focus:ring"
                            placeholder="Enter blog title"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            URL Slug *
                            <span className="text-xs text-gray-500 ml-2">(Auto-generated from title, max 60 chars)</span>
                        </label>
                        <div className="flex items-center gap-2">
                            <span className="text-sm text-gray-500">/blogs/</span>
                            <input
                                type="text"
                                value={formData.slug}
                                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                                className="flex-1 rounded-xl border border-rose-200 px-4 py-2 text-sm outline-none ring-rose-100 focus:ring"
                                placeholder="blog-url-slug"
                                required
                                maxLength={60}
                            />
                        </div>
                        <p className="text-xs text-gray-500 mt-1">
                            Preview: /blogs/{formData.slug || 'your-blog-url'}
                        </p>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Excerpt *</label>
                        <textarea
                            value={formData.excerpt}
                            onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                            rows={2}
                            className="w-full rounded-xl border border-rose-200 px-4 py-2 text-sm outline-none ring-rose-100 focus:ring"
                            placeholder="Short description"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Content *</label>
                        <div className="border border-rose-200 rounded-xl overflow-hidden">
                            {/* Simple Formatting Toolbar */}
                            <div className="bg-rose-50 border-b border-rose-200 p-2 flex gap-1 flex-wrap">
                                <button
                                    type="button"
                                    onClick={() => document.execCommand('bold')}
                                    className="px-3 py-1 text-xs font-bold bg-white border border-rose-200 rounded hover:bg-rose-100"
                                    title="Bold"
                                >
                                    B
                                </button>
                                <button
                                    type="button"
                                    onClick={() => document.execCommand('italic')}
                                    className="px-3 py-1 text-xs italic bg-white border border-rose-200 rounded hover:bg-rose-100"
                                    title="Italic"
                                >
                                    I
                                </button>
                                <button
                                    type="button"
                                    onClick={() => document.execCommand('underline')}
                                    className="px-3 py-1 text-xs underline bg-white border border-rose-200 rounded hover:bg-rose-100"
                                    title="Underline"
                                >
                                    U
                                </button>
                                <div className="w-px bg-rose-200 mx-1"></div>
                                <button
                                    type="button"
                                    onClick={() => document.execCommand('formatBlock', false, 'h2')}
                                    className="px-3 py-1 text-xs font-semibold bg-white border border-rose-200 rounded hover:bg-rose-100"
                                    title="Heading"
                                >
                                    H2
                                </button>
                                <button
                                    type="button"
                                    onClick={() => document.execCommand('formatBlock', false, 'h3')}
                                    className="px-3 py-1 text-xs font-semibold bg-white border border-rose-200 rounded hover:bg-rose-100"
                                    title="Subheading"
                                >
                                    H3
                                </button>
                                <button
                                    type="button"
                                    onClick={() => document.execCommand('formatBlock', false, 'p')}
                                    className="px-3 py-1 text-xs bg-white border border-rose-200 rounded hover:bg-rose-100"
                                    title="Paragraph"
                                >
                                    P
                                </button>
                                <div className="w-px bg-rose-200 mx-1"></div>
                                <button
                                    type="button"
                                    onClick={() => document.execCommand('insertUnorderedList')}
                                    className="px-3 py-1 text-xs bg-white border border-rose-200 rounded hover:bg-rose-100"
                                    title="Bullet List"
                                >
                                    • List
                                </button>
                                <button
                                    type="button"
                                    onClick={() => document.execCommand('insertOrderedList')}
                                    className="px-3 py-1 text-xs bg-white border border-rose-200 rounded hover:bg-rose-100"
                                    title="Numbered List"
                                >
                                    1. List
                                </button>
                                <div className="w-px bg-rose-200 mx-1"></div>
                                <button
                                    type="button"
                                    onClick={() => {
                                        const url = prompt('Enter URL:');
                                        if (url) document.execCommand('createLink', false, url);
                                    }}
                                    className="px-3 py-1 text-xs bg-white border border-rose-200 rounded hover:bg-rose-100"
                                    title="Insert Link"
                                >
                                    🔗 Link
                                </button>
                            </div>
                            {/* Rich Text Editor */}
                            <div
                                contentEditable
                                onInput={(e) => setFormData({ ...formData, content: e.currentTarget.innerHTML })}
                                className="min-h-[300px] max-h-[400px] overflow-y-auto px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-rose-200"
                                style={{ whiteSpace: 'pre-wrap' }}
                                dangerouslySetInnerHTML={{ __html: formData.content }}
                            />
                        </div>
                        <p className="text-xs text-gray-500 mt-1">Use the toolbar to format your content. Supports headings, lists, bold, italic, and links.</p>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Author *</label>
                            <input
                                type="text"
                                value={formData.author}
                                onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                                className="w-full rounded-xl border border-rose-200 px-4 py-2 text-sm outline-none ring-rose-100 focus:ring"
                                placeholder="Author name"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Author Bio</label>
                            <input
                                type="text"
                                value={formData.authorBio}
                                onChange={(e) => setFormData({ ...formData, authorBio: e.target.value })}
                                className="w-full rounded-xl border border-rose-200 px-4 py-2 text-sm outline-none ring-rose-100 focus:ring"
                                placeholder="Author bio"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                            <select
                                value={formData.category}
                                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                className="w-full rounded-xl border border-rose-200 px-4 py-2 text-sm outline-none ring-rose-100 focus:ring"
                            >
                                <option>Mental Health</option>
                                <option>Relationships</option>
                                <option>Science</option>
                                <option>Wellness</option>
                                <option>Self-Care</option>
                                <option>General</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Tags (comma separated)</label>
                            <input
                                type="text"
                                value={formData.tags}
                                onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                                className="w-full rounded-xl border border-rose-200 px-4 py-2 text-sm outline-none ring-rose-100 focus:ring"
                                placeholder="wellness, mental-health"
                            />
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={formData.featured}
                                onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                                className="rounded border-rose-300 text-rose-600 focus:ring-rose-200"
                            />
                            <span className="text-sm text-gray-700">Featured</span>
                        </label>

                        <label className="flex items-center gap-2 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={formData.trending}
                                onChange={(e) => setFormData({ ...formData, trending: e.target.checked })}
                                className="rounded border-rose-300 text-rose-600 focus:ring-rose-200"
                            />
                            <span className="text-sm text-gray-700">Trending</span>
                        </label>
                    </div>

                </form>

                <div className="flex justify-end gap-2 p-6 border-t border-rose-100 flex-shrink-0">
                    <button
                        type="button"
                        onClick={onClose}
                        className="rounded-full border border-rose-200 px-5 py-2 text-sm font-medium text-rose-600 hover:bg-rose-50"
                    >
                        Cancel
                    </button>
                    <button
                        type="button"
                        onClick={handleSubmit}
                        disabled={submitting}
                        className="rounded-full bg-rose-200 px-5 py-2 text-sm font-semibold text-rose-700 hover:bg-rose-300 shadow-sm disabled:opacity-50"
                    >
                        {submitting ? 'Creating...' : 'Create Blog'}
                    </button>
                </div>
            </div>
        </div>
    );
}
