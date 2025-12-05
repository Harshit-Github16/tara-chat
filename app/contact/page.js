"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelope, faPaperPlane, faComments, faBookOpen, faBullseye, faChartLine, faUser } from "@fortawesome/free-solid-svg-icons";
import { useAuth } from "../contexts/AuthContext";

export default function ContactPage() {
    const { user } = useAuth();
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        subject: "",
        message: ""
    });
    const [submitted, setSubmitted] = useState(false);
    const [showFeaturesDropdown, setShowFeaturesDropdown] = useState(false);
    const [showMobileMenu, setShowMobileMenu] = useState(false);
    const [showMobileFeaturesDropdown, setShowMobileFeaturesDropdown] = useState(false);
    const [dropdownTimeout, setDropdownTimeout] = useState(null);

    // Cleanup dropdown timeout on unmount
    useEffect(() => {
        return () => {
            if (dropdownTimeout) clearTimeout(dropdownTimeout);
        };
    }, [dropdownTimeout]);

    const handleSubmit = (e) => {
        e.preventDefault();
        // Here you can add API call to send email
        console.log("Form submitted:", formData);
        setSubmitted(true);
        setTimeout(() => {
            setSubmitted(false);
            setFormData({ name: "", email: "", subject: "", message: "" });
        }, 3000);
    };

    return (
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
                                className="text-sm font-medium text-gray-700 hover:text-rose-600 transition-all duration-300"
                            >
                                Blogs
                            </Link>

                            <Link
                                href="/contact"
                                className="text-sm font-medium text-rose-600 transition-colors"
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
                                    className="block text-sm font-medium text-gray-700 hover:text-rose-600 transition-colors py-2"
                                    onClick={() => setShowMobileMenu(false)}
                                >
                                    Blogs
                                </Link>

                                <Link
                                    href="/contact"
                                    className="block text-sm font-medium text-rose-600 transition-colors py-2"
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
            <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-12">
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold text-gray-800 mb-4">Get in Touch</h1>
                    <p className="text-lg text-gray-600">We'd love to hear from you. Send us a message and we'll respond as soon as possible.</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Contact Info */}
                    <div className="space-y-6">
                        <div className="rounded-2xl border border-rose-100 bg-white shadow-sm p-6">
                            <h2 className="text-2xl font-bold text-gray-800 mb-6">Contact Information</h2>

                            <div className="space-y-4">
                                <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 rounded-full bg-rose-100 flex items-center justify-center flex-shrink-0">
                                        <FontAwesomeIcon icon={faEnvelope} className="h-5 w-5 text-rose-600" />
                                    </div>
                                    <div>
                                        {/* <h3 className="font-semibold text-gray-800 mb-1">Email</h3> */}
                                        <a href="mailto:hello@tara4u.com" className="text-rose-600 hover:text-rose-600">
                                            hello@tara4u.com
                                        </a>
                                        <p className="text-sm text-gray-500 mt-1">We'll get back to you within 24 hours</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Social Media Section */}
                        <div className="rounded-2xl border border-rose-100 bg-gradient-to-br from-rose-50 to-rose-100 p-6">
                            <h3 className="text-xl font-bold text-gray-800 mb-4">Connect with Us</h3>
                            <p className="text-gray-700 mb-4 text-sm">
                                Follow us on social media for mental wellness tips, updates, and community support.
                            </p>
                            <div className="flex flex-wrap gap-3">
                                <a
                                    href="https://x.com/HelloTara4u"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center justify-center w-12 h-12 rounded-xl bg-white text-rose-600 hover:bg-rose-200 transition-all shadow-sm"
                                    aria-label="Twitter/X"
                                >
                                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                                    </svg>
                                </a>


                                <a
                                    href="https://www.instagram.com/hello.tara4u/"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center justify-center w-12 h-12 rounded-xl bg-white text-rose-600 hover:bg-rose-200 transition-all shadow-sm"
                                    aria-label="Instagram"
                                >
                                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                                    </svg>
                                </a>

                                <a
                                    href="https://www.facebook.com/profile.php?id=61584786025622"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center justify-center w-12 h-12 rounded-xl bg-white text-rose-600 hover:bg-rose-200 transition-all shadow-sm"
                                    aria-label="Facebook"
                                >
                                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                                    </svg>
                                </a>

                                <a
                                    href="https://www.youtube.com/@Tara4uu"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center justify-center w-12 h-12 rounded-xl bg-white text-rose-600 hover:bg-rose-200 transition-all shadow-sm"
                                    aria-label="YouTube"
                                >
                                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                                    </svg>
                                </a>

                                <a
                                    href="https://whatsapp.com/channel/0029Vb6njfE72WTr5KGZbu3F"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center justify-center w-12 h-12 rounded-xl bg-white text-rose-600 hover:bg-rose-200 transition-all shadow-sm"
                                    aria-label="WhatsApp"
                                >
                                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                                    </svg>
                                </a>
                            </div>
                        </div>
                    </div>

                    {/* Contact Form */}
                    <div className="rounded-2xl border border-rose-100 bg-white shadow-sm p-6">
                        <h2 className="text-2xl font-bold text-gray-800 mb-6">Send us a Message</h2>

                        {submitted ? (
                            <div className="bg-green-50 border border-green-200 rounded-xl p-6 text-center">
                                <div className="text-4xl mb-3">✓</div>
                                <h3 className="text-xl font-bold text-green-800 mb-2">Message Sent!</h3>
                                <p className="text-green-700">Thank you for contacting us. We'll get back to you soon.</p>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                                    <input
                                        type="text"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        className="w-full rounded-xl border border-rose-200 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-rose-200"
                                        placeholder="Your name"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                                    <input
                                        type="email"
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        className="w-full rounded-xl border border-rose-200 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-rose-200"
                                        placeholder="your.email@example.com"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Subject</label>
                                    <input
                                        type="text"
                                        value={formData.subject}
                                        onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                                        className="w-full rounded-xl border border-rose-200 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-rose-200"
                                        placeholder="What is this about?"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Message</label>
                                    <textarea
                                        value={formData.message}
                                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                        rows="5"
                                        className="w-full rounded-xl border border-rose-200 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-rose-200"
                                        placeholder="Tell us more..."
                                        required
                                    />
                                </div>

                                <button
                                    type="submit"
                                    className="w-full rounded-full bg-rose-200 px-6 py-3 text-sm font-bold text-rose-600 hover:bg-rose-300 transition-colors flex items-center justify-center gap-2"
                                >
                                    <FontAwesomeIcon icon={faPaperPlane} className="h-4 w-4" />
                                    Send Message
                                </button>
                            </form>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
}
