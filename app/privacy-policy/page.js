"use client";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";

export default function PrivacyPolicyPage() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-rose-50 via-white to-rose-100">
            {/* Header */}
            <header className="sticky top-0 z-10 border-b border-rose-100 bg-white/60 backdrop-blur">
                <div className="mx-auto flex max-w-4xl items-center justify-between px-4 py-4">
                    <Link
                        href="/"
                        className="flex items-center gap-2 text-rose-600 hover:text-rose-700 transition-colors"
                    >
                        <FontAwesomeIcon icon={faArrowLeft} className="h-4 w-4" />
                        <span className="font-medium">Back to Home</span>
                    </Link>
                    <img
                        src="/taralogo.jpg"
                        alt="Tara Logo"
                        className="h-8 w-8 rounded-full object-cover"
                    />
                </div>
            </header>

            {/* Content */}
            <main className="mx-auto max-w-4xl px-4 py-8 sm:py-12">
                <div className="rounded-3xl border border-rose-100 bg-white p-6 sm:p-10 shadow-sm">
                    <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
                        Privacy Policy
                    </h1>
                    <p className="text-sm text-gray-500 mb-8">
                        Last updated: November 7, 2025
                    </p>

                    <div className="space-y-8 text-gray-700">
                        {/* Introduction */}
                        <section>
                            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                                Introduction
                            </h2>
                            <p className="leading-relaxed">
                                Welcome to Tara. We are committed to protecting your personal information and your right to privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our mental wellness application.
                            </p>
                        </section>

                        {/* Information We Collect */}
                        <section>
                            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                                Information We Collect
                            </h2>
                            <div className="space-y-4">
                                <div>
                                    <h3 className="text-lg font-medium text-gray-800 mb-2">
                                        Personal Information
                                    </h3>
                                    <p className="leading-relaxed">
                                        We collect information that you provide directly to us, including:
                                    </p>
                                    <ul className="list-disc list-inside mt-2 space-y-1 ml-4">
                                        <li>Name and email address</li>
                                        <li>Profile information (age, gender, interests)</li>
                                        <li>Account credentials</li>
                                    </ul>
                                </div>

                                <div>
                                    <h3 className="text-lg font-medium text-gray-800 mb-2">
                                        Usage Information
                                    </h3>
                                    <p className="leading-relaxed">
                                        We automatically collect certain information when you use our app:
                                    </p>
                                    <ul className="list-disc list-inside mt-2 space-y-1 ml-4">
                                        <li>Mood tracking data and journal entries</li>
                                        <li>Chat conversations with AI companions</li>
                                        <li>App usage patterns and preferences</li>
                                        <li>Device information and IP address</li>
                                    </ul>
                                </div>
                            </div>
                        </section>

                        {/* How We Use Your Information */}
                        <section>
                            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                                How We Use Your Information
                            </h2>
                            <p className="leading-relaxed mb-3">
                                We use the information we collect to:
                            </p>
                            <ul className="list-disc list-inside space-y-2 ml-4">
                                <li>Provide and maintain our mental wellness services</li>
                                <li>Personalize your experience with AI companions</li>
                                <li>Track your mood patterns and provide insights</li>
                                <li>Improve our app features and user experience</li>
                                <li>Send you important updates and notifications</li>
                                <li>Ensure the security of your account</li>
                            </ul>
                        </section>

                        {/* Data Security */}
                        <section>
                            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                                Data Security
                            </h2>
                            <p className="leading-relaxed">
                                We implement appropriate technical and organizational security measures to protect your personal information. Your data is encrypted in transit and at rest. However, no method of transmission over the internet is 100% secure, and we cannot guarantee absolute security.
                            </p>
                        </section>

                        {/* Data Sharing */}
                        <section>
                            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                                Data Sharing and Disclosure
                            </h2>
                            <p className="leading-relaxed mb-3">
                                We do not sell your personal information. We may share your information only in the following circumstances:
                            </p>
                            <ul className="list-disc list-inside space-y-2 ml-4">
                                <li>With your explicit consent</li>
                                <li>To comply with legal obligations</li>
                                <li>To protect our rights and prevent fraud</li>
                                <li>With service providers who assist in app operations (under strict confidentiality agreements)</li>
                            </ul>
                        </section>

                        {/* Your Rights */}
                        <section>
                            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                                Your Privacy Rights
                            </h2>
                            <p className="leading-relaxed mb-3">
                                You have the right to:
                            </p>
                            <ul className="list-disc list-inside space-y-2 ml-4">
                                <li>Access your personal information</li>
                                <li>Correct inaccurate data</li>
                                <li>Request deletion of your data</li>
                                <li>Export your data</li>
                                <li>Opt-out of certain data collection</li>
                                <li>Withdraw consent at any time</li>
                            </ul>
                        </section>

                        {/* Children's Privacy */}
                        <section>
                            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                                Children's Privacy
                            </h2>
                            <p className="leading-relaxed">
                                Our service is not intended for children under 13 years of age. We do not knowingly collect personal information from children under 13. If you are a parent or guardian and believe your child has provided us with personal information, please contact us.
                            </p>
                        </section>

                        {/* Changes to Privacy Policy */}
                        <section>
                            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                                Changes to This Privacy Policy
                            </h2>
                            <p className="leading-relaxed">
                                We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last updated" date. We encourage you to review this Privacy Policy periodically.
                            </p>
                        </section>

                        {/* Contact Us */}
                        <section>
                            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                                Contact Us
                            </h2>
                            <p className="leading-relaxed">
                                If you have any questions about this Privacy Policy or our data practices, please contact us at:
                            </p>
                            <div className="mt-4 rounded-xl bg-rose-50 p-4 border border-rose-100">
                                <p className="font-medium text-gray-900">Email: privacy@tara.app</p>
                                <p className="text-gray-700 mt-1">Support: support@tara.app</p>
                            </div>
                        </section>
                    </div>

                    {/* Back Button */}
                    <div className="mt-10 pt-8 border-t border-rose-100">
                        <Link
                            href="/"
                            className="inline-flex items-center gap-2 rounded-full bg-rose-200 px-6 py-3 text-sm font-semibold text-rose-700 hover:bg-rose-300 transition-colors"
                        >
                            <FontAwesomeIcon icon={faArrowLeft} className="h-4 w-4" />
                            Back to Home
                        </Link>
                    </div>
                </div>
            </main>

            {/* Footer */}
            <footer className="border-t border-rose-100 bg-white/60 backdrop-blur py-6 mt-12">
                <div className="mx-auto max-w-4xl px-4 text-center text-sm text-gray-600">
                    <p>© 2025 Tara. All rights reserved.</p>
                </div>
            </footer>
        </div>
    );
}
