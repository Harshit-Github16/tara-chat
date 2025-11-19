"use client";
import { useEffect, useState, useRef } from "react";
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
import { ToastContainer } from "../../components/Toast";
import { useToast } from "../../hooks/useToast";

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
    const [editingBlog, setEditingBlog] = useState(null);
    const { toasts, removeToast, showSuccess, showError } = useToast();

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
            const response = await fetch('/api/admin/blogs');
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
            const response = await fetch(`/api/admin/blogs?id=${blogId}`, {
                method: 'DELETE'
            });
            const data = await response.json();
            if (data.success) {
                setBlogs(blogs.filter(b => b._id !== blogId));
                showSuccess('Blog deleted successfully!');
            } else {
                showError(data.message || 'Failed to delete blog');
            }
        } catch (error) {
            console.error('Error deleting blog:', error);
            showError('Failed to delete blog');
        }
    };

    if (!user?.email || !ADMIN_EMAILS.includes(user.email)) {
        return null;
    }

    return (
        <ProtectedRoute>
            <ToastContainer toasts={toasts} removeToast={removeToast} />
            <div className="flex min-h-screen flex-col bg-gradient-to-br from-rose-50 via-white to-rose-100">
                <header className="sticky top-0 z-10 border-b border-rose-100 bg-white/60 backdrop-blur">
                    <div className="mx-auto flex max-w-9xl items-center justify-between px-4 py-3">
                        <div className="flex items-center gap-3">
                            <Link href="/admin" className="text-rose-600 hover:text-rose-600">
                                <FontAwesomeIcon icon={faArrowLeft} className="h-5 w-5" />
                            </Link>
                            <span className="text-lg font-semibold text-rose-600">Manage Blogs</span>
                        </div>

                        <button
                            onClick={() => setShowModal(true)}
                            className="flex items-center gap-2 rounded-full bg-rose-200 px-4 py-2 text-sm font-semibold text-rose-600 hover:bg-rose-300 shadow-sm"
                        >
                            <FontAwesomeIcon icon={faPlus} /> Add Blog
                        </button>
                    </div>
                </header>

                <main className="mx-auto w-full max-w-9xl flex-1 px-4 py-6">
                    {loading ? (
                        <div className="text-center py-12 text-gray-500">Loading blogs...</div>
                    ) : blogs.length === 0 ? (
                        <div className="text-center py-12">
                            <div className="text-6xl mb-4">📝</div>
                            <h2 className="text-xl font-semibold text-gray-800 mb-2">No blogs yet</h2>
                            <p className="text-gray-600 mb-4">Create your first blog post</p>
                            <button
                                onClick={() => setShowModal(true)}
                                className="rounded-full bg-rose-200 px-5 py-3 text-sm font-semibold text-rose-600 hover:bg-rose-300 shadow-sm"
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
                                                            href={`/blog/${blog._id}`}
                                                            className="rounded-lg border border-rose-200 px-3 py-1 text-xs font-semibold text-rose-600 hover:bg-rose-50"
                                                        >
                                                            <FontAwesomeIcon icon={faEye} />
                                                        </Link>
                                                        <button
                                                            onClick={() => {
                                                                setEditingBlog(blog);
                                                                setShowModal(true);
                                                            }}
                                                            className="rounded-lg border border-blue-200 px-3 py-1 text-xs font-semibold text-blue-600 hover:bg-blue-50"
                                                        >
                                                            <FontAwesomeIcon icon={faEdit} />
                                                        </button>
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
                        editingBlog={editingBlog}
                        onClose={() => {
                            setShowModal(false);
                            setEditingBlog(null);
                        }}
                        onSuccess={(blog) => {
                            if (editingBlog) {
                                // Update existing blog
                                setBlogs(blogs.map(b => b._id === blog._id ? blog : b));
                                showSuccess('Blog updated successfully!');
                            } else {
                                // Add new blog
                                setBlogs([blog, ...blogs]);
                                showSuccess('Blog created successfully!');
                            }
                            setShowModal(false);
                            setEditingBlog(null);
                        }}
                        showSuccess={showSuccess}
                        showError={showError}
                    />
                )}
            </div>
        </ProtectedRoute>
    );
}

function AddBlogModal({ editingBlog, onClose, onSuccess, showSuccess, showError }) {
    const [currentStep, setCurrentStep] = useState(1); // Step 1: Basic, Step 2: Content, Step 3: Schema
    const [formData, setFormData] = useState({
        title: '',
        slug: '',
        excerpt: '',
        content: '',
        author: '',
        authorBio: '',
        category: 'Mental Health',
        tags: '',
        featuredImage: '',
        featured: false,
        trending: false,
        schemaType: 'BlogPosting',
        faqItems: [],
        howToSteps: [],
        initialLikes: 0,
        initialViews: 0
    });
    const [submitting, setSubmitting] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const editorRef = useRef(null);

    // Load editing blog data
    useEffect(() => {
        if (editingBlog) {
            setFormData({
                title: editingBlog.title || '',
                slug: editingBlog.slug || '',
                excerpt: editingBlog.excerpt || '',
                content: editingBlog.content || '',
                author: editingBlog.author || '',
                authorBio: editingBlog.authorBio || '',
                category: editingBlog.category || 'Mental Health',
                tags: Array.isArray(editingBlog.tags) ? editingBlog.tags.join(', ') : '',
                featuredImage: editingBlog.featuredImage || '',
                featured: editingBlog.featured || false,
                trending: editingBlog.trending || false,
                schemaType: editingBlog.schemaType || 'BlogPosting',
                faqItems: editingBlog.faqItems || [],
                howToSteps: editingBlog.howToSteps || [],
                initialLikes: editingBlog.likes || 0,
                initialViews: editingBlog.views || 0
            });
            setCurrentStep(1); // Reset to step 1 when editing
        }
    }, [editingBlog]);



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

    // Handle image upload to ImageKit
    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        // Check file size (2MB = 2 * 1024 * 1024 bytes)
        const maxSize = 2 * 1024 * 1024;
        if (file.size > maxSize) {
            showError('Image size must be less than 2MB');
            e.target.value = '';
            return;
        }

        // Check file type
        if (!file.type.startsWith('image/')) {
            showError('Please upload an image file');
            e.target.value = '';
            return;
        }

        try {
            setUploading(true);
            setUploadProgress(0);

            // Get authentication parameters from backend
            const authResponse = await fetch('/api/imagekit-auth');
            const authData = await authResponse.json();

            // Create FormData for upload
            const formDataUpload = new FormData();
            formDataUpload.append('file', file);
            formDataUpload.append('fileName', `blog-${Date.now()}-${file.name}`);
            formDataUpload.append('publicKey', 'public_F70JirliQ9BXD/kr2nflQG7h8xw=');
            formDataUpload.append('signature', authData.signature);
            formDataUpload.append('expire', authData.expire);
            formDataUpload.append('token', authData.token);
            formDataUpload.append('folder', '/blogs');

            // Upload to ImageKit
            const xhr = new XMLHttpRequest();

            xhr.upload.addEventListener('progress', (e) => {
                if (e.lengthComputable) {
                    const percentComplete = (e.loaded / e.total) * 100;
                    setUploadProgress(Math.round(percentComplete));
                }
            });

            xhr.addEventListener('load', () => {
                if (xhr.status === 200) {
                    const response = JSON.parse(xhr.responseText);
                    // Use functional update to ensure we get the latest state
                    setFormData(prevData => ({ ...prevData, featuredImage: response.url }));
                    showSuccess('Image uploaded successfully!');
                } else {
                    showError('Failed to upload image');
                }
                setUploading(false);
                setUploadProgress(0);
            });

            xhr.addEventListener('error', () => {
                showError('Failed to upload image');
                setUploading(false);
                setUploadProgress(0);
            });

            xhr.open('POST', 'https://upload.imagekit.io/api/v1/files/upload');
            xhr.send(formDataUpload);

        } catch (error) {
            console.error('Image upload error:', error);
            showError('Failed to upload image');
            setUploading(false);
            setUploadProgress(0);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.title || !formData.excerpt || !formData.content || !formData.author) {
            showError('Please fill all required fields');
            return;
        }

        if (!formData.featuredImage) {
            showError('Please upload a featured image');
            return;
        }

        try {
            setSubmitting(true);

            const blogData = {
                ...formData,
                tags: formData.tags.split(',').map(t => t.trim()).filter(Boolean)
            };

            console.log('Sending blog data with image URL:', blogData.featuredImage);

            const url = editingBlog
                ? `/api/admin/blogs?id=${editingBlog._id}`
                : '/api/admin/blogs';

            const response = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(blogData)
            });

            const data = await response.json();
            if (data.success) {
                onSuccess(data.data);
            } else {
                showError(data.message || `Failed to ${editingBlog ? 'update' : 'create'} blog`);
            }
        } catch (error) {
            console.error(`Error ${editingBlog ? 'updating' : 'creating'} blog:`, error);
            showError(`Failed to ${editingBlog ? 'update' : 'create'} blog`);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
            <div className="w-full max-w-5xl max-h-[90vh] rounded-3xl border border-rose-100 bg-white shadow-xl flex flex-col">
                {/* Header with Steps */}
                <div className="p-6 border-b border-rose-100 flex-shrink-0">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-xl font-bold text-gray-900">{editingBlog ? 'Edit Blog' : 'Add New Blog'}</h2>
                        <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                            <FontAwesomeIcon icon={faTimes} className="h-5 w-5" />
                        </button>
                    </div>

                    {/* Step Indicator */}
                    <div className="flex items-center gap-2">
                        <button
                            type="button"
                            onClick={() => setCurrentStep(1)}
                            className={`flex-1 py-2 px-3 rounded-lg text-xs font-medium transition-colors ${currentStep === 1
                                ? 'bg-rose-200 text-rose-600'
                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                }`}
                        >
                            1. Basic Info
                        </button>
                        <button
                            type="button"
                            onClick={() => setCurrentStep(2)}
                            className={`flex-1 py-2 px-3 rounded-lg text-xs font-medium transition-colors ${currentStep === 2
                                ? 'bg-rose-200 text-rose-600'
                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                }`}
                        >
                            2. Content & Details
                        </button>
                        <button
                            type="button"
                            onClick={() => setCurrentStep(3)}
                            className={`flex-1 py-2 px-3 rounded-lg text-xs font-medium transition-colors ${currentStep === 3
                                ? 'bg-rose-200 text-rose-600'
                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                }`}
                        >
                            3. SEO Schema
                        </button>
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto p-6">
                    {/* Step 1: Basic Info (Title, Slug, Excerpt, Image) */}
                    {currentStep === 1 && (
                        <div className="space-y-4">
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
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Featured Image *
                                    <span className="text-xs text-gray-500 ml-2">(Max 2MB)</span>
                                </label>
                                <div className="space-y-2">
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleImageUpload}
                                        disabled={uploading}
                                        className="w-full rounded-xl border border-rose-200 px-4 py-2 text-sm outline-none ring-rose-100 focus:ring file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-rose-50 file:text-rose-600 hover:file:bg-rose-100"
                                    />
                                    {uploading && (
                                        <div className="space-y-1">
                                            <div className="flex items-center justify-between text-xs text-gray-600">
                                                <span>Uploading...</span>
                                                <span>{uploadProgress}%</span>
                                            </div>
                                            <div className="w-full bg-rose-100 rounded-full h-2">
                                                <div
                                                    className="bg-rose-500 h-2 rounded-full transition-all duration-300"
                                                    style={{ width: `${uploadProgress}%` }}
                                                />
                                            </div>
                                        </div>
                                    )}
                                    {formData.featuredImage && !uploading && (
                                        <div className="relative rounded-xl overflow-hidden border border-rose-200">
                                            <img
                                                src={formData.featuredImage}
                                                alt="Featured"
                                                className="w-full h-48 object-cover"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setFormData({ ...formData, featuredImage: '' })}
                                                className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-2 hover:bg-red-600"
                                            >
                                                <FontAwesomeIcon icon={faTimes} className="h-3 w-3" />
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Step 2: Content & Details */}
                    {currentStep === 2 && (
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Content *</label>
                                <div className="border border-rose-200 rounded-xl overflow-hidden">
                                    {/* Simple Formatting Toolbar */}
                                    <div className="bg-rose-50 border-b border-rose-200 p-2 flex gap-1 flex-wrap">
                                        <button
                                            type="button"
                                            onClick={() => {
                                                editorRef.current?.focus();
                                                document.execCommand('bold');
                                            }}
                                            className="px-3 py-1 text-xs font-bold bg-white border border-rose-200 rounded hover:bg-rose-100"
                                            title="Bold"
                                        >
                                            B
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => {
                                                editorRef.current?.focus();
                                                document.execCommand('italic');
                                            }}
                                            className="px-3 py-1 text-xs italic bg-white border border-rose-200 rounded hover:bg-rose-100"
                                            title="Italic"
                                        >
                                            I
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => {
                                                editorRef.current?.focus();
                                                document.execCommand('underline');
                                            }}
                                            className="px-3 py-1 text-xs underline bg-white border border-rose-200 rounded hover:bg-rose-100"
                                            title="Underline"
                                        >
                                            U
                                        </button>
                                        <div className="w-px bg-rose-200 mx-1"></div>
                                        <button
                                            type="button"
                                            onClick={() => {
                                                editorRef.current?.focus();
                                                document.execCommand('formatBlock', false, 'h2');
                                            }}
                                            className="px-3 py-1 text-xs font-semibold bg-white border border-rose-200 rounded hover:bg-rose-100"
                                            title="Heading"
                                        >
                                            H2
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => {
                                                editorRef.current?.focus();
                                                document.execCommand('formatBlock', false, 'h3');
                                            }}
                                            className="px-3 py-1 text-xs font-semibold bg-white border border-rose-200 rounded hover:bg-rose-100"
                                            title="Subheading"
                                        >
                                            H3
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => {
                                                editorRef.current?.focus();
                                                document.execCommand('formatBlock', false, 'p');
                                            }}
                                            className="px-3 py-1 text-xs bg-white border border-rose-200 rounded hover:bg-rose-100"
                                            title="Paragraph"
                                        >
                                            P
                                        </button>
                                        <div className="w-px bg-rose-200 mx-1"></div>
                                        <button
                                            type="button"
                                            onClick={() => {
                                                editorRef.current?.focus();
                                                document.execCommand('insertUnorderedList');
                                            }}
                                            className="px-3 py-1 text-xs bg-white border border-rose-200 rounded hover:bg-rose-100"
                                            title="Bullet List"
                                        >
                                            • List
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => {
                                                editorRef.current?.focus();
                                                document.execCommand('insertOrderedList');
                                            }}
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
                                                if (url) {
                                                    editorRef.current?.focus();
                                                    document.execCommand('createLink', false, url);
                                                }
                                            }}
                                            className="px-3 py-1 text-xs bg-white border border-rose-200 rounded hover:bg-rose-100"
                                            title="Insert Link"
                                        >
                                            🔗 Link
                                        </button>
                                    </div>
                                    {/* Rich Text Editor */}
                                    <div
                                        key={`editor-${currentStep}`}
                                        ref={editorRef}
                                        contentEditable
                                        suppressContentEditableWarning
                                        onInput={(e) => {
                                            if (e && e.currentTarget) {
                                                const content = e.currentTarget.innerHTML || '';
                                                setFormData(prev => ({ ...prev, content }));
                                            }
                                        }}
                                        dangerouslySetInnerHTML={{ __html: formData.content || '' }}
                                        className="min-h-[300px] max-h-[400px] overflow-y-auto px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-rose-200"
                                        style={{ whiteSpace: 'pre-wrap' }}
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

                            {/* Initial Stats */}
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Initial Likes</label>
                                    <input
                                        type="number"
                                        min="0"
                                        value={formData.initialLikes}
                                        onChange={(e) => setFormData({ ...formData, initialLikes: parseInt(e.target.value) || 0 })}
                                        className="w-full rounded-xl border border-rose-200 px-4 py-2 text-sm outline-none ring-rose-100 focus:ring"
                                        placeholder="0"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Initial Views</label>
                                    <input
                                        type="number"
                                        min="0"
                                        value={formData.initialViews}
                                        onChange={(e) => setFormData({ ...formData, initialViews: parseInt(e.target.value) || 0 })}
                                        className="w-full rounded-xl border border-rose-200 px-4 py-2 text-sm outline-none ring-rose-100 focus:ring"
                                        placeholder="0"
                                    />
                                </div>
                            </div>

                            {/* Featured & Trending */}
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
                        </div>
                    )}

                    {/* Step 3: SEO Schema */}
                    {currentStep === 3 && (
                        <div className="space-y-6">
                            <div>
                                <h3 className="text-lg font-semibold text-gray-800 mb-3">Choose Schema Type</h3>
                                <p className="text-sm text-gray-600 mb-4">Select the schema type that best describes your content for better SEO</p>

                                <div className="grid grid-cols-2 gap-4">
                                    {/* BlogPosting Card */}
                                    <button
                                        type="button"
                                        onClick={() => setFormData({ ...formData, schemaType: 'BlogPosting' })}
                                        className={`p-4 rounded-xl border-2 text-left transition-all ${formData.schemaType === 'BlogPosting'
                                            ? 'border-rose-500 bg-rose-50'
                                            : 'border-gray-200 hover:border-rose-300'
                                            }`}
                                    >
                                        <div className="flex items-center gap-2 mb-2">
                                            <span className="text-2xl">📝</span>
                                            <h4 className="font-semibold text-gray-800">Blog Posting</h4>
                                        </div>
                                        <p className="text-xs text-gray-600">Standard blog posts, news, updates</p>
                                    </button>

                                    {/* Article Card */}
                                    <button
                                        type="button"
                                        onClick={() => setFormData({ ...formData, schemaType: 'Article' })}
                                        className={`p-4 rounded-xl border-2 text-left transition-all ${formData.schemaType === 'Article'
                                            ? 'border-rose-500 bg-rose-50'
                                            : 'border-gray-200 hover:border-rose-300'
                                            }`}
                                    >
                                        <div className="flex items-center gap-2 mb-2">
                                            <span className="text-2xl">📰</span>
                                            <h4 className="font-semibold text-gray-800">Article</h4>
                                        </div>
                                        <p className="text-xs text-gray-600">Long-form content, in-depth articles</p>
                                    </button>

                                    {/* FAQPage Card */}
                                    <button
                                        type="button"
                                        onClick={() => setFormData({ ...formData, schemaType: 'FAQPage' })}
                                        className={`p-4 rounded-xl border-2 text-left transition-all ${formData.schemaType === 'FAQPage'
                                            ? 'border-rose-500 bg-rose-50'
                                            : 'border-gray-200 hover:border-rose-300'
                                            }`}
                                    >
                                        <div className="flex items-center gap-2 mb-2">
                                            <span className="text-2xl">❓</span>
                                            <h4 className="font-semibold text-gray-800">FAQ Page</h4>
                                        </div>
                                        <p className="text-xs text-gray-600">Q&A format, FAQ sections</p>
                                    </button>

                                    {/* HowTo Card */}
                                    <button
                                        type="button"
                                        onClick={() => setFormData({ ...formData, schemaType: 'HowTo' })}
                                        className={`p-4 rounded-xl border-2 text-left transition-all ${formData.schemaType === 'HowTo'
                                            ? 'border-rose-500 bg-rose-50'
                                            : 'border-gray-200 hover:border-rose-300'
                                            }`}
                                    >
                                        <div className="flex items-center gap-2 mb-2">
                                            <span className="text-2xl">📋</span>
                                            <h4 className="font-semibold text-gray-800">How-To Guide</h4>
                                        </div>
                                        <p className="text-xs text-gray-600">Step-by-step tutorials, guides</p>
                                    </button>
                                </div>
                            </div>

                            {/* Info Message for BlogPosting/Article */}
                            {(formData.schemaType === 'BlogPosting' || formData.schemaType === 'Article') && (
                                <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                                    <div className="flex items-start gap-3">
                                        <span className="text-2xl">✅</span>
                                        <div>
                                            <h4 className="font-semibold text-blue-900 mb-1">Schema Ready!</h4>
                                            <p className="text-sm text-blue-700">
                                                {formData.schemaType === 'BlogPosting'
                                                    ? 'Your blog will automatically include BlogPosting schema with all the content from Step 1 (title, author, date, image, etc.)'
                                                    : 'Your article will automatically include Article schema with all the content from Step 1 (title, author, date, image, etc.)'}
                                            </p>
                                            <p className="text-xs text-blue-600 mt-2">
                                                No additional fields needed - just click "Create Blog" to publish!
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* FAQ Editor - Show only if FAQPage selected */}
                            {formData.schemaType === 'FAQPage' && (
                                <FAQEditor
                                    faqItems={formData.faqItems}
                                    onChange={(items) => setFormData({ ...formData, faqItems: items })}
                                />
                            )}

                            {/* HowTo Editor - Show only if HowTo selected */}
                            {formData.schemaType === 'HowTo' && (
                                <HowToEditor
                                    steps={formData.howToSteps}
                                    onChange={(steps) => setFormData({ ...formData, howToSteps: steps })}
                                />
                            )}
                        </div>
                    )}
                </div>

                {/* Footer with Navigation */}
                <div className="flex justify-between items-center gap-3 p-6 border-t border-rose-100 flex-shrink-0">
                    <button
                        type="button"
                        onClick={onClose}
                        className="rounded-full border border-rose-200 px-5 py-2 text-sm font-medium text-rose-600 hover:bg-rose-50"
                    >
                        Cancel
                    </button>

                    <div className="flex gap-2">
                        {(currentStep === 2 || currentStep === 3) && (
                            <button
                                type="button"
                                onClick={() => setCurrentStep(currentStep - 1)}
                                className="rounded-full border border-rose-200 px-5 py-2 text-sm font-medium text-rose-600 hover:bg-rose-50"
                            >
                                ← Back
                            </button>
                        )}

                        {currentStep === 1 && (
                            <button
                                type="button"
                                onClick={() => setCurrentStep(2)}
                                className="rounded-full bg-rose-200 px-5 py-2 text-sm font-semibold text-rose-600 hover:bg-rose-300 shadow-sm"
                            >
                                Next: Content & Details →
                            </button>
                        )}

                        {currentStep === 2 && (
                            <button
                                type="button"
                                onClick={() => setCurrentStep(3)}
                                className="rounded-full bg-rose-200 px-5 py-2 text-sm font-semibold text-rose-600 hover:bg-rose-300 shadow-sm"
                            >
                                Next: SEO Schema →
                            </button>
                        )}

                        {currentStep === 3 && (
                            <button
                                type="button"
                                onClick={handleSubmit}
                                disabled={submitting}
                                className="rounded-full bg-rose-200 px-5 py-2 text-sm font-semibold text-rose-600 hover:bg-rose-300 shadow-sm disabled:opacity-50"
                            >
                                {submitting ? (editingBlog ? 'Updating...' : 'Creating...') : (editingBlog ? 'Update Blog' : 'Create Blog')}
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>

    );
}

// FAQ Editor Component
function FAQEditor({ faqItems, onChange }) {
    const addFAQ = () => {
        onChange([...faqItems, { question: '', answer: '' }]);
    };

    const removeFAQ = (index) => {
        onChange(faqItems.filter((_, i) => i !== index));
    };

    const updateFAQ = (index, field, value) => {
        const updated = [...faqItems];
        updated[index][field] = value;
        onChange(updated);
    };

    return (
        <div className="border border-rose-200 rounded-xl p-4 bg-rose-50">
            <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-semibold text-gray-800">FAQ Items</h3>
                <button
                    type="button"
                    onClick={addFAQ}
                    className="px-3 py-1 bg-rose-200 text-rose-600 rounded-lg text-xs font-medium hover:bg-rose-300"
                >
                    + Add FAQ
                </button>
            </div>
            <div className="space-y-3">
                {faqItems.length === 0 ? (
                    <p className="text-xs text-gray-500 text-center py-4">No FAQ items yet. Click "Add FAQ" to get started.</p>
                ) : (
                    faqItems.map((item, index) => (
                        <div key={index} className="bg-white rounded-lg p-3 border border-rose-200">
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-xs font-semibold text-gray-600">FAQ #{index + 1}</span>
                                <button
                                    type="button"
                                    onClick={() => removeFAQ(index)}
                                    className="text-red-500 hover:text-red-700 text-xs"
                                >
                                    <FontAwesomeIcon icon={faTrash} />
                                </button>
                            </div>
                            <input
                                type="text"
                                placeholder="Question"
                                value={item.question}
                                onChange={(e) => updateFAQ(index, 'question', e.target.value)}
                                className="w-full rounded-lg border border-rose-200 px-3 py-2 text-sm mb-2 outline-none focus:ring-2 focus:ring-rose-200"
                            />
                            <textarea
                                placeholder="Answer"
                                value={item.answer}
                                onChange={(e) => updateFAQ(index, 'answer', e.target.value)}
                                rows={3}
                                className="w-full rounded-lg border border-rose-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-rose-200"
                            />
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}

// HowTo Editor Component
function HowToEditor({ steps, onChange }) {
    const addStep = () => {
        onChange([...steps, { name: '', text: '' }]);
    };

    const removeStep = (index) => {
        onChange(steps.filter((_, i) => i !== index));
    };

    const updateStep = (index, field, value) => {
        const updated = [...steps];
        updated[index][field] = value;
        onChange(updated);
    };

    return (
        <div className="border border-rose-200 rounded-xl p-4 bg-rose-50">
            <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-semibold text-gray-800">How-To Steps</h3>
                <button
                    type="button"
                    onClick={addStep}
                    className="px-3 py-1 bg-rose-200 text-rose-600 rounded-lg text-xs font-medium hover:bg-rose-300"
                >
                    + Add Step
                </button>
            </div>
            <div className="space-y-3">
                {steps.length === 0 ? (
                    <p className="text-xs text-gray-500 text-center py-4">No steps yet. Click "Add Step" to get started.</p>
                ) : (
                    steps.map((step, index) => (
                        <div key={index} className="bg-white rounded-lg p-3 border border-rose-200">
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-xs font-semibold text-gray-600">Step {index + 1}</span>
                                <button
                                    type="button"
                                    onClick={() => removeStep(index)}
                                    className="text-red-500 hover:text-red-700 text-xs"
                                >
                                    <FontAwesomeIcon icon={faTrash} />
                                </button>
                            </div>
                            <input
                                type="text"
                                placeholder="Step name/title"
                                value={step.name}
                                onChange={(e) => updateStep(index, 'name', e.target.value)}
                                className="w-full rounded-lg border border-rose-200 px-3 py-2 text-sm mb-2 outline-none focus:ring-2 focus:ring-rose-200"
                            />
                            <textarea
                                placeholder="Step description"
                                value={step.text}
                                onChange={(e) => updateStep(index, 'text', e.target.value)}
                                rows={3}
                                className="w-full rounded-lg border border-rose-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-rose-200"
                            />
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
