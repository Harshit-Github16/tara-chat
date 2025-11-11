"use client";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faShieldAlt } from "@fortawesome/free-solid-svg-icons";
import BottomNav from "../components/BottomNav";

export default function PrivacyPolicyPage() {
    return (
        <div className="flex min-h-screen flex-col bg-gradient-to-br from-rose-50 via-white to-rose-100">
            <header className="sticky top-0 z-10 border-b border-rose-100 bg-white/60 backdrop-blur">
                <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
                    <Link href="/chatlist" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
                        <img src="/taralogo.jpg" alt="Tara Logo" className="h-8 w-8 rounded-full object-cover" />
                        <span className="text-lg font-semibold text-rose-600">Tara</span>
                    </Link>
                    <Link href="/profile" className="text-rose-600 hover:text-rose-700">
                        <FontAwesomeIcon icon={faArrowLeft} className="h-5 w-5" />
                    </Link>
                </div>
            </header>

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

            <BottomNav />
        </div>
    );
}
