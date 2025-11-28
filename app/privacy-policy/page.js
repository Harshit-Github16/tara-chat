"use client";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faShieldAlt, faComments, faBookOpen, faChartLine, faBullseye } from "@fortawesome/free-solid-svg-icons";
import BottomNav from "../components/BottomNav";
import ProfileCompletionCircle from "../components/ProfileCompletionCircle";
import { useAuth } from "../contexts/AuthContext";

export default function PrivacyPolicyPage() {
    const { user } = useAuth();
    const [showFeaturesDropdown, setShowFeaturesDropdown] = useState(false);
    const [showMobileMenu, setShowMobileMenu] = useState(false);
    const [showMobileFeaturesDropdown, setShowMobileFeaturesDropdown] = useState(false);
    const [dropdownTimeout, setDropdownTimeout] = useState(null);

    return (
        <div className="flex min-h-screen flex-col bg-gradient-to-br from-rose-50 via-white to-rose-100">
            {/* Header - Show home page navbar if not logged in, simple header if logged in */}
            {user ? (
                // Logged in - Simple header with profile
                <header className="sticky top-0 z-10 border-b border-rose-100 bg-white/60 backdrop-blur">
                    <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
                        <Link href="/chatlist" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
                            <img src="/taralogo.jpg" alt="Tara Logo" className="h-8 w-8 rounded-full object-cover" />
                            <span className="text-lg font-semibold text-rose-600">Tara4u</span>
                        </Link>
                        <Link href="/profile" className="relative">
                            <ProfileCompletionCircle />
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
                                    className="block text-sm font-medium text-gray-700 hover:text-rose-600 transition-colors py-2"
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

            <main className="mx-auto w-full max-w-4xl flex-1 px-4 py-8">
                <div className="mb-6 flex items-center gap-3">
                    <FontAwesomeIcon icon={faShieldAlt} className="h-8 w-8 text-rose-600" />
                    <h1 className="text-3xl font-bold text-gray-800">Privacy Policy</h1>
                </div>

                <div className="rounded-2xl border border-rose-100 bg-white p-8 shadow-sm">
                    <p className="text-sm text-gray-500 mb-6">Last updated: November 11, 2024</p>

                    <div className="prose prose-rose max-w-none">
                        <h2 className="text-2xl font-bold text-gray-800 mb-4">1. Information We Collect</h2>
                        <p className="text-gray-700 mb-4">
                            At Tara, we collect information that you provide directly to us, including:
                        </p>
                        <ul className="list-disc pl-6 mb-6 text-gray-700">
                            <li>Account information (name, email, profile picture)</li>
                            <li>Journal entries and mood check-ins</li>
                            <li>Chat conversations with AI companions</li>
                            <li>Goals and insights data</li>
                            <li>Usage data and analytics</li>
                        </ul>

                        <h2 className="text-2xl font-bold text-gray-800 mb-4">2. How We Use Your Information</h2>
                        <p className="text-gray-700 mb-4">We use the information we collect to:</p>
                        <ul className="list-disc pl-6 mb-6 text-gray-700">
                            <li>Provide and improve our mental wellness services</li>
                            <li>Personalize your experience with AI companions</li>
                            <li>Generate insights and recommendations</li>
                            <li>Communicate with you about updates and features</li>
                            <li>Ensure the security of our platform</li>
                        </ul>

                        <h2 className="text-2xl font-bold text-gray-800 mb-4">3. Data Security</h2>
                        <p className="text-gray-700 mb-6">
                            We implement industry-standard security measures to protect your personal information.
                            Your data is encrypted in transit and at rest. We regularly review and update our security practices.
                        </p>

                        <h2 className="text-2xl font-bold text-gray-800 mb-4">4. Data Sharing</h2>
                        <p className="text-gray-700 mb-6">
                            We do not sell your personal information. We may share your data only with:
                        </p>
                        <ul className="list-disc pl-6 mb-6 text-gray-700">
                            <li>Service providers who assist in operating our platform</li>
                            <li>Legal authorities when required by law</li>
                            <li>With your explicit consent</li>
                        </ul>

                        <h2 className="text-2xl font-bold text-gray-800 mb-4">5. Your Rights</h2>
                        <p className="text-gray-700 mb-4">You have the right to:</p>
                        <ul className="list-disc pl-6 mb-6 text-gray-700">
                            <li>Access your personal data</li>
                            <li>Correct inaccurate data</li>
                            <li>Delete your account and data</li>
                            <li>Export your data</li>
                            <li>Opt-out of marketing communications</li>
                        </ul>

                        <h2 className="text-2xl font-bold text-gray-800 mb-4">6. Cookies</h2>
                        <p className="text-gray-700 mb-6">
                            We use cookies and similar technologies to enhance your experience, analyze usage,
                            and remember your preferences.
                        </p>

                        <h2 className="text-2xl font-bold text-gray-800 mb-4">7. Contact Us</h2>
                        <p className="text-gray-700 mb-4">
                            If you have questions about this Privacy Policy, please contact us at:
                        </p>
                        <p className="text-gray-700">
                            Email: <a href="mailto:privacy@tara4u.com" className="text-rose-600 hover:underline">privacy@tara4u.com</a>
                        </p>
                    </div>
                </div>
            </main>

            {/* Only show BottomNav if user is logged in */}
            {user && <BottomNav />}
        </div>
    );
}
