"use client";
import { useState } from "react";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelope, faPhone, faMapMarkerAlt, faPaperPlane } from "@fortawesome/free-solid-svg-icons";

export default function ContactPage() {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        subject: "",
        message: ""
    });
    const [submitted, setSubmitted] = useState(false);

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
            {/* Header */}
            <header className="sticky top-0 z-10 border-b border-rose-100 bg-white/60 backdrop-blur">
                <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
                    <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
                        <img src="/taralogo.jpg" alt="Tara Logo" className="h-8 w-8 rounded-full object-cover" />
                        <span className="text-lg font-semibold text-rose-600">Tara</span>
                    </Link>
                </div>
            </header>

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
                                        <h3 className="font-semibold text-gray-800 mb-1">Email</h3>
                                        <a href="mailto:support@tara4u.com" className="text-rose-600 hover:text-rose-700">
                                            support@tara4u.com
                                        </a>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 rounded-full bg-rose-100 flex items-center justify-center flex-shrink-0">
                                        <FontAwesomeIcon icon={faPhone} className="h-5 w-5 text-rose-600" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-gray-800 mb-1">Phone</h3>
                                        <a href="tel:+911234567890" className="text-rose-600 hover:text-rose-700">
                                            +91 123 456 7890
                                        </a>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 rounded-full bg-rose-100 flex items-center justify-center flex-shrink-0">
                                        <FontAwesomeIcon icon={faMapMarkerAlt} className="h-5 w-5 text-rose-600" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-gray-800 mb-1">Address</h3>
                                        <p className="text-gray-600">
                                            Bangalore, Karnataka<br />
                                            India
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="rounded-2xl border border-rose-100 bg-gradient-to-br from-rose-50 to-rose-100 p-6">
                            <h3 className="text-xl font-bold text-gray-800 mb-3">Need Immediate Help?</h3>
                            <p className="text-gray-700 mb-4">
                                If you're experiencing a mental health crisis, please reach out to professional help immediately.
                            </p>
                            <div className="space-y-2 text-sm">
                                <p className="font-semibold text-gray-800">Crisis Helplines:</p>
                                <p className="text-gray-700">AASRA: 91-22-27546669</p>
                                <p className="text-gray-700">Vandrevala Foundation: 1860-2662-345</p>
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
                                    className="w-full rounded-full bg-rose-200 px-6 py-3 text-sm font-bold text-rose-700 hover:bg-rose-300 transition-colors flex items-center justify-center gap-2"
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
