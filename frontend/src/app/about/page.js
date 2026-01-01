"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faHeart,
    faBrain,
    faShieldAlt,
    faComments,
    faBookOpen,
    faBullseye,
    faChartLine,
    faUser,
    faClock,
    faUserFriends
} from "@fortawesome/free-solid-svg-icons";
import { useAuth } from "../contexts/AuthContext";

export default function AboutPage() {
    const { user } = useAuth();
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
                                className="text-sm font-medium text-rose-600 transition-all duration-300"
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
                                    className="block text-sm font-medium text-rose-600 transition-colors py-2"
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

            {/* Main Content */}
            <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-12">
                {/* Hero Section */}
                <div className="text-center mb-16">
                    <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">About Tara</h1>
                    <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                        Your AI-powered companion for mental health and emotional wellness
                    </p>
                </div>

                {/* About Section */}
                <div className="bg-white rounded-2xl border border-rose-100 shadow-sm p-8 mb-12">
                    <div className="max-w-4xl mx-auto">
                        <div className="space-y-6 text-lg text-gray-700 leading-relaxed">
                            <p>
                                At Tara, we believe emotional wellbeing is a basic human need—something that should be within reach for everyone, no matter where they are or what they're going through.
                            </p>
                            <p>
                                Our purpose is simple: to make mental health support accessible, compassionate, and always available.
                            </p>
                            <p>
                                We're building an AI-powered emotional companion that listens without judgment, responds with empathy, and supports you through life's highs and lows—24/7, instantly, and privately.
                            </p>
                            <p>
                                By combining advanced AI with evidence-based mental health principles, Tara creates a safe space where you can open up freely, understand your feelings better, and navigate stress, anxiety, and daily challenges with more clarity.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Features Section */}
                <div className="mb-12">
                    <h2 className="text-3xl font-bold text-gray-800 text-center mb-12">What Tara Offers</h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <div className="bg-white rounded-xl border border-gray-200 p-6">
                            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                                <FontAwesomeIcon icon={faComments} className="h-6 w-6 text-blue-600" />
                            </div>
                            <h3 className="text-xl font-semibold text-gray-800 mb-3">AI Chat Support</h3>
                            <p className="text-gray-600">
                                Have meaningful conversations with our AI that understands your emotions and provides personalized guidance.
                            </p>
                        </div>

                        <div className="bg-white rounded-xl border border-gray-200 p-6">
                            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                                <FontAwesomeIcon icon={faBookOpen} className="h-6 w-6 text-green-600" />
                            </div>
                            <h3 className="text-xl font-semibold text-gray-800 mb-3">Smart Journaling</h3>
                            <p className="text-gray-600">
                                Express your thoughts through AI-guided prompts that help you process emotions and build self-awareness.
                            </p>
                        </div>

                        <div className="bg-white rounded-xl border border-gray-200 p-6">
                            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                                <FontAwesomeIcon icon={faBullseye} className="h-6 w-6 text-purple-600" />
                            </div>
                            <h3 className="text-xl font-semibold text-gray-800 mb-3">Goal Setting</h3>
                            <p className="text-gray-600">
                                Set and track mental health goals with AI-powered recommendations and progress monitoring.
                            </p>
                        </div>

                        <div className="bg-white rounded-xl border border-gray-200 p-6">
                            <div className="w-12 h-12 bg-rose-100 rounded-lg flex items-center justify-center mb-4">
                                <FontAwesomeIcon icon={faChartLine} className="h-6 w-6 text-rose-600" />
                            </div>
                            <h3 className="text-xl font-semibold text-gray-800 mb-3">Mood Analytics</h3>
                            <p className="text-gray-600">
                                Track your emotional patterns with insights that help you understand triggers and progress.
                            </p>
                        </div>

                        <div className="bg-white rounded-xl border border-gray-200 p-6">
                            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                                <FontAwesomeIcon icon={faShieldAlt} className="h-6 w-6 text-green-600" />
                            </div>
                            <h3 className="text-xl font-semibold text-gray-800 mb-3">Private & Secure</h3>
                            <p className="text-gray-600">
                                Your conversations are completely private and secure. We prioritize your confidentiality.
                            </p>
                        </div>

                        <div className="bg-white rounded-xl border border-gray-200 p-6">
                            <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-4">
                                <FontAwesomeIcon icon={faClock} className="h-6 w-6 text-indigo-600" />
                            </div>
                            <h3 className="text-xl font-semibold text-gray-800 mb-3">24/7 Available</h3>
                            <p className="text-gray-600">
                                Get support whenever you need it. Tara is always here for you, day or night.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Values Section */}
                <div className="bg-gray-50 rounded-2xl p-8 mb-12">
                    <h2 className="text-3xl font-bold text-gray-800 text-center mb-8">Our Values</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="text-center">
                            <div className="w-16 h-16 bg-rose-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <FontAwesomeIcon icon={faHeart} className="h-8 w-8 text-rose-500" />
                            </div>
                            <h3 className="text-xl font-semibold text-gray-800 mb-3">Empathy</h3>
                            <p className="text-gray-600">
                                We approach every interaction with compassion and understanding.
                            </p>
                        </div>
                        <div className="text-center">
                            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <FontAwesomeIcon icon={faUserFriends} className="h-8 w-8 text-blue-500" />
                            </div>
                            <h3 className="text-xl font-semibold text-gray-800 mb-3">Accessibility</h3>
                            <p className="text-gray-600">
                                Mental health support should be available to everyone, everywhere.
                            </p>
                        </div>
                        <div className="text-center">
                            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <FontAwesomeIcon icon={faBrain} className="h-8 w-8 text-green-500" />
                            </div>
                            <h3 className="text-xl font-semibold text-gray-800 mb-3">Innovation</h3>
                            <p className="text-gray-600">
                                We continuously improve our AI to better serve your wellness needs.
                            </p>
                        </div>
                    </div>
                </div>

                {/* CTA Section */}
                <div className="text-center bg-white rounded-2xl border border-rose-100 shadow-sm p-8">
                    <h2 className="text-3xl font-bold text-gray-800 mb-4">Start Your Wellness Journey</h2>
                    <p className="text-lg text-gray-600 mb-6 max-w-2xl mx-auto">
                        Join thousands of users who trust Tara for their mental health and emotional wellness.
                    </p>
                    <Link
                        href="/"
                        className="inline-flex items-center gap-2 bg-rose-500 text-white px-8 py-3 rounded-full text-lg font-semibold hover:bg-rose-600 transition-colors"
                    >
                        Get Started Free
                    </Link>
                </div>
            </main>
        </div>
    );
}
