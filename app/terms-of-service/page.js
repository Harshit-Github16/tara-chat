"use client";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faFileContract } from "@fortawesome/free-solid-svg-icons";
import BottomNav from "../components/BottomNav";

export default function TermsOfServicePage() {
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
                    <FontAwesomeIcon icon={faFileContract} className="h-8 w-8 text-rose-600" />
                    <h1 className="text-3xl font-bold text-gray-800">Terms of Service</h1>
                </div>

                <div className="rounded-2xl border border-rose-100 bg-white p-8 shadow-sm">
                    <p className="text-sm text-gray-500 mb-6">Last updated: November 11, 2024</p>

                    <div className="prose prose-rose max-w-none">
                        <h2 className="text-2xl font-bold text-gray-800 mb-4">1. Acceptance of Terms</h2>
                        <p className="text-gray-700 mb-6">
                            By accessing and using Tara (tara4u.com), you accept and agree to be bound by these Terms of Service.
                            If you do not agree to these terms, please do not use our services.
                        </p>

                        <h2 className="text-2xl font-bold text-gray-800 mb-4">2. Description of Service</h2>
                        <p className="text-gray-700 mb-6">
                            Tara is an AI-powered mental health and wellness companion that provides:
                        </p>
                        <ul className="list-disc pl-6 mb-6 text-gray-700">
                            <li>AI chat conversations for emotional support</li>
                            <li>Mood tracking and insights</li>
                            <li>Journal and goal management</li>
                            <li>Wellness content and resources</li>
                        </ul>

                        <h2 className="text-2xl font-bold text-gray-800 mb-4">3. User Responsibilities</h2>
                        <p className="text-gray-700 mb-4">You agree to:</p>
                        <ul className="list-disc pl-6 mb-6 text-gray-700">
                            <li>Provide accurate and complete information</li>
                            <li>Maintain the security of your account</li>
                            <li>Use the service in compliance with applicable laws</li>
                            <li>Not misuse or abuse the platform</li>
                            <li>Not share harmful or inappropriate content</li>
                        </ul>

                        <h2 className="text-2xl font-bold text-gray-800 mb-4">4. Medical Disclaimer</h2>
                        <p className="text-gray-700 mb-6">
                            <strong>Important:</strong> Tara is not a substitute for professional medical advice, diagnosis, or treatment.
                            Always seek the advice of qualified health providers with questions regarding medical conditions.
                            In case of emergency, contact emergency services immediately.
                        </p>

                        <h2 className="text-2xl font-bold text-gray-800 mb-4">5. Intellectual Property</h2>
                        <p className="text-gray-700 mb-6">
                            All content, features, and functionality of Tara are owned by us and protected by copyright,
                            trademark, and other intellectual property laws.
                        </p>

                        <h2 className="text-2xl font-bold text-gray-800 mb-4">6. Limitation of Liability</h2>
                        <p className="text-gray-700 mb-6">
                            Tara is provided "as is" without warranties of any kind. We are not liable for any damages
                            arising from your use of the service.
                        </p>

                        <h2 className="text-2xl font-bold text-gray-800 mb-4">7. Changes to Terms</h2>
                        <p className="text-gray-700 mb-6">
                            We reserve the right to modify these terms at any time. Continued use of the service
                            constitutes acceptance of modified terms.
                        </p>

                        <h2 className="text-2xl font-bold text-gray-800 mb-4">8. Contact</h2>
                        <p className="text-gray-700">
                            For questions about these Terms, contact us at:
                            <a href="mailto:support@tara4u.com" className="text-rose-600 hover:underline ml-1">support@tara4u.com</a>
                        </p>
                    </div>
                </div>
            </main>

            <BottomNav />
        </div>
    );
}
