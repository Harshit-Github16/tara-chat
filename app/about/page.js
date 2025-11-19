"use client";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart, faBrain, faUsers, faShieldAlt, faLightbulb, faHandHoldingHeart } from "@fortawesome/free-solid-svg-icons";

export default function AboutPage() {
    return (
        <div className="flex min-h-screen flex-col bg-gradient-to-br from-rose-50 via-white to-rose-100">
            {/* Header */}
            <header className="sticky top-0 z-10 border-b border-rose-100 bg-white/60 backdrop-blur">
                <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
                    <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
                        <img src="/taralogo.jpg" alt="Tara Logo" className="h-8 w-8 rounded-full object-cover" />
                        <span className="text-lg font-semibold text-rose-600">Tara4U</span>
                    </Link>
                </div>
            </header>

            {/* Main Content */}
            <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-12">
                {/* Hero Section */}
                <div className="text-center mb-16">
                    <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">About Tara</h1>
                    <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                        Your AI-powered companion for mental health and emotional wellness
                    </p>
                </div>

                {/* Mission Section */}
                <div className="rounded-2xl border border-rose-100 bg-white shadow-sm p-8 mb-8">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-12 h-12 rounded-full bg-rose-100 flex items-center justify-center">
                            <FontAwesomeIcon icon={faHeart} className="h-6 w-6 text-rose-600" />
                        </div>
                        <h2 className="text-3xl font-bold text-gray-800">Our Mission</h2>
                    </div>
                    <p className="text-lg text-gray-700 leading-relaxed mb-4">
                        At Tara, we believe that mental health support should be accessible to everyone, anytime, anywhere.
                        We're on a mission to break down barriers to mental wellness by providing AI-powered emotional support
                        that's available 24/7.
                    </p>
                    <p className="text-lg text-gray-700 leading-relaxed">
                        Our platform combines cutting-edge AI technology with evidence-based mental health practices to create
                        a safe, judgment-free space where you can express yourself, track your emotions, and receive personalized
                        guidance on your wellness journey.
                    </p>
                </div>

                {/* Features Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                    <div className="rounded-2xl border border-rose-100 bg-white shadow-sm p-6">
                        <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mb-4">
                            <FontAwesomeIcon icon={faBrain} className="h-6 w-6 text-blue-600" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-800 mb-3">AI-Powered Support</h3>
                        <p className="text-gray-600">
                            Advanced AI technology that understands your emotions and provides personalized support tailored to your needs.
                        </p>
                    </div>

                    <div className="rounded-2xl border border-rose-100 bg-white shadow-sm p-6">
                        <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center mb-4">
                            <FontAwesomeIcon icon={faUsers} className="h-6 w-6 text-purple-600" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-800 mb-3">100+ AI Characters</h3>
                        <p className="text-gray-600">
                            Chat with diverse AI personalities and celebrities for motivation, guidance, and emotional support.
                        </p>
                    </div>

                    <div className="rounded-2xl border border-rose-100 bg-white shadow-sm p-6">
                        <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center mb-4">
                            <FontAwesomeIcon icon={faShieldAlt} className="h-6 w-6 text-green-600" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-800 mb-3">Private & Secure</h3>
                        <p className="text-gray-600">
                            Your conversations and data are completely private and secure. We prioritize your confidentiality.
                        </p>
                    </div>

                    <div className="rounded-2xl border border-rose-100 bg-white shadow-sm p-6">
                        <div className="w-12 h-12 rounded-full bg-rose-100 flex items-center justify-center mb-4">
                            <FontAwesomeIcon icon={faLightbulb} className="h-6 w-6 text-rose-600" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-800 mb-3">Smart Insights</h3>
                        <p className="text-gray-600">
                            Track your mood patterns and receive personalized insights to better understand your emotional wellness.
                        </p>
                    </div>

                    <div className="rounded-2xl border border-rose-100 bg-white shadow-sm p-6">
                        <div className="w-12 h-12 rounded-full bg-yellow-100 flex items-center justify-center mb-4">
                            <FontAwesomeIcon icon={faHandHoldingHeart} className="h-6 w-6 text-yellow-600" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-800 mb-3">Guided Journaling</h3>
                        <p className="text-gray-600">
                            Express your thoughts with AI-guided prompts and build healthy mental wellness habits.
                        </p>
                    </div>

                    <div className="rounded-2xl border border-rose-100 bg-white shadow-sm p-6">
                        <div className="w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center mb-4">
                            <FontAwesomeIcon icon={faHeart} className="h-6 w-6 text-indigo-600" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-800 mb-3">24/7 Availability</h3>
                        <p className="text-gray-600">
                            Get support whenever you need it. Tara is always here for you, day or night.
                        </p>
                    </div>
                </div>

                {/* Values Section */}
                <div className="rounded-2xl border border-rose-100 bg-gradient-to-br from-rose-50 to-rose-100 p-8 mb-8">
                    <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">Our Values</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="text-center">
                            <h3 className="text-xl font-bold text-gray-800 mb-2">Empathy</h3>
                            <p className="text-gray-700">
                                We approach every interaction with compassion and understanding.
                            </p>
                        </div>
                        <div className="text-center">
                            <h3 className="text-xl font-bold text-gray-800 mb-2">Accessibility</h3>
                            <p className="text-gray-700">
                                Mental health support should be available to everyone, everywhere.
                            </p>
                        </div>
                        <div className="text-center">
                            <h3 className="text-xl font-bold text-gray-800 mb-2">Innovation</h3>
                            <p className="text-gray-700">
                                We continuously improve our AI to better serve your wellness needs.
                            </p>
                        </div>
                    </div>
                </div>

                {/* CTA Section */}
                <div className="text-center rounded-2xl border border-rose-100 bg-white shadow-sm p-8">
                    <h2 className="text-3xl font-bold text-gray-800 mb-4">Start Your Wellness Journey Today</h2>
                    <p className="text-lg text-gray-600 mb-6">
                        Join thousands of users who trust Tara for their mental health and emotional wellness.
                    </p>
                    <Link
                        href="/"
                        className="inline-flex items-center gap-2 rounded-full bg-rose-200 px-8 py-3 text-lg font-bold text-rose-600 hover:bg-rose-300 transition-colors"
                    >
                        Get Started Free
                    </Link>
                </div>
            </main>
        </div>
    );
}
