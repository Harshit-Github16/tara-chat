"use client";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";

export default function TermsOfServicePage() {
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
                        Terms of Service
                    </h1>
                    <p className="text-sm text-gray-500 mb-8">
                        Last updated: November 7, 2025
                    </p>

                    <div className="space-y-8 text-gray-700">
                        {/* Introduction */}
                        <section>
                            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                                Agreement to Terms
                            </h2>
                            <p className="leading-relaxed">
                                By accessing and using Tara, you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.
                            </p>
                        </section>

                        {/* Service Description */}
                        <section>
                            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                                Service Description
                            </h2>
                            <p className="leading-relaxed mb-3">
                                Tara is a mental wellness application that provides:
                            </p>
                            <ul className="list-disc list-inside space-y-2 ml-4">
                                <li>AI-powered emotional support and companionship</li>
                                <li>Mood tracking and journaling features</li>
                                <li>Personalized wellness insights and recommendations</li>
                                <li>Goal setting and progress tracking tools</li>
                                <li>Mental health resources and educational content</li>
                            </ul>
                        </section>

                        {/* User Responsibilities */}
                        <section>
                            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                                User Responsibilities
                            </h2>
                            <div className="space-y-4">
                                <div>
                                    <h3 className="text-lg font-medium text-gray-800 mb-2">
                                        Account Security
                                    </h3>
                                    <p className="leading-relaxed">
                                        You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account.
                                    </p>
                                </div>

                                <div>
                                    <h3 className="text-lg font-medium text-gray-800 mb-2">
                                        Appropriate Use
                                    </h3>
                                    <p className="leading-relaxed mb-2">
                                        You agree to use Tara only for lawful purposes and in accordance with these Terms. You agree NOT to:
                                    </p>
                                    <ul className="list-disc list-inside space-y-1 ml-4">
                                        <li>Use the service for any illegal or unauthorized purpose</li>
                                        <li>Attempt to gain unauthorized access to our systems</li>
                                        <li>Share harmful, offensive, or inappropriate content</li>
                                        <li>Impersonate others or provide false information</li>
                                        <li>Interfere with or disrupt the service</li>
                                    </ul>
                                </div>
                            </div>
                        </section>

                        {/* Medical Disclaimer */}
                        <section>
                            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                                Medical Disclaimer
                            </h2>
                            <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mb-4">
                                <p className="font-medium text-yellow-800 mb-2">Important Notice:</p>
                                <p className="text-yellow-700 leading-relaxed">
                                    Tara is NOT a substitute for professional medical advice, diagnosis, or treatment. Always seek the advice of qualified health providers with any questions you may have regarding a medical condition.
                                </p>
                            </div>
                            <p className="leading-relaxed">
                                Our AI companions and wellness tools are designed to provide emotional support and general wellness guidance only. In case of mental health emergencies, please contact emergency services or a mental health crisis hotline immediately.
                            </p>
                        </section>

                        {/* Intellectual Property */}
                        <section>
                            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                                Intellectual Property Rights
                            </h2>
                            <p className="leading-relaxed mb-3">
                                The service and its original content, features, and functionality are and will remain the exclusive property of Tara and its licensors. The service is protected by copyright, trademark, and other laws.
                            </p>
                            <p className="leading-relaxed">
                                You retain ownership of any content you create or share through the service, but you grant us a license to use, store, and process this content to provide our services.
                            </p>
                        </section>

                        {/* Privacy and Data */}
                        <section>
                            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                                Privacy and Data Protection
                            </h2>
                            <p className="leading-relaxed mb-3">
                                Your privacy is important to us. Our collection and use of personal information is governed by our Privacy Policy, which is incorporated into these Terms by reference.
                            </p>
                            <div className="bg-rose-50 border border-rose-200 rounded-xl p-4">
                                <p className="text-rose-700">
                                    <Link href="/privacy-policy" className="font-medium underline hover:no-underline">
                                        Read our Privacy Policy
                                    </Link> to understand how we collect, use, and protect your information.
                                </p>
                            </div>
                        </section>

                        {/* Service Availability */}
                        <section>
                            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                                Service Availability
                            </h2>
                            <p className="leading-relaxed">
                                We strive to provide reliable service, but we cannot guarantee that Tara will be available at all times. We may experience hardware, software, or other problems or need to perform maintenance related to the service, resulting in interruptions, delays, or errors.
                            </p>
                        </section>

                        {/* Limitation of Liability */}
                        <section>
                            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                                Limitation of Liability
                            </h2>
                            <p className="leading-relaxed">
                                To the maximum extent permitted by applicable law, Tara shall not be liable for any indirect, incidental, special, consequential, or punitive damages, or any loss of profits or revenues, whether incurred directly or indirectly, or any loss of data, use, goodwill, or other intangible losses.
                            </p>
                        </section>

                        {/* Termination */}
                        <section>
                            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                                Termination
                            </h2>
                            <p className="leading-relaxed mb-3">
                                We may terminate or suspend your account and bar access to the service immediately, without prior notice or liability, under our sole discretion, for any reason whatsoever, including but not limited to a breach of the Terms.
                            </p>
                            <p className="leading-relaxed">
                                You may terminate your account at any time by contacting us or deleting your account through the app settings.
                            </p>
                        </section>

                        {/* Changes to Terms */}
                        <section>
                            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                                Changes to Terms
                            </h2>
                            <p className="leading-relaxed">
                                We reserve the right to modify or replace these Terms at any time. If a revision is material, we will provide at least 30 days notice prior to any new terms taking effect. What constitutes a material change will be determined at our sole discretion.
                            </p>
                        </section>

                        {/* Governing Law */}
                        <section>
                            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                                Governing Law
                            </h2>
                            <p className="leading-relaxed">
                                These Terms shall be interpreted and governed by the laws of the jurisdiction in which our company is established, without regard to its conflict of law provisions.
                            </p>
                        </section>

                        {/* Contact Information */}
                        <section>
                            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                                Contact Us
                            </h2>
                            <p className="leading-relaxed mb-4">
                                If you have any questions about these Terms of Service, please contact us:
                            </p>
                            <div className="rounded-xl bg-rose-50 p-4 border border-rose-100">
                                <p className="font-medium text-gray-900">Email: legal@tara.app</p>
                                <p className="text-gray-700 mt-1">Support: support@tara.app</p>
                                <p className="text-gray-700 mt-1">General: hello@tara.app</p>
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
