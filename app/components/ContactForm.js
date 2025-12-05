"use client";
import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPaperPlane, faCheckCircle, faExclamationCircle } from "@fortawesome/free-solid-svg-icons";

export default function ContactForm() {
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        subject: "",
        message: ""
    });
    const [status, setStatus] = useState({ type: "", message: "" });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setStatus({ type: "", message: "" });

        try {
            const response = await fetch("/api/contact", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(formData)
            });

            const data = await response.json();

            if (response.ok) {
                setStatus({
                    type: "success",
                    message: "Message sent successfully! We'll get back to you soon."
                });
                // Reset form
                setFormData({
                    firstName: "",
                    lastName: "",
                    email: "",
                    subject: "",
                    message: ""
                });
            } else {
                setStatus({
                    type: "error",
                    message: data.error || "Failed to send message. Please try again."
                });
            }
        } catch (error) {
            setStatus({
                type: "error",
                message: "Something went wrong. Please try again later."
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            {status.message && (
                <div
                    className={`p-4 rounded-lg flex items-center gap-2 ${status.type === "success"
                            ? "bg-green-50 text-green-800 border border-green-200"
                            : "bg-red-50 text-red-800 border border-red-200"
                        }`}
                >
                    <FontAwesomeIcon
                        icon={status.type === "success" ? faCheckCircle : faExclamationCircle}
                        className="h-5 w-5"
                    />
                    <span>{status.message}</span>
                </div>
            )}

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div>
                    <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">
                        First name
                    </label>
                    <input
                        type="text"
                        id="firstName"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleChange}
                        className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm focus:border-rose-500 focus:outline-none focus:ring-1 focus:ring-rose-500"
                        placeholder="John"
                        required
                    />
                </div>
                <div>
                    <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">
                        Last name
                    </label>
                    <input
                        type="text"
                        id="lastName"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleChange}
                        className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm focus:border-rose-500 focus:outline-none focus:ring-1 focus:ring-rose-500"
                        placeholder="Doe"
                    />
                </div>
            </div>

            <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                    Email
                </label>
                <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm focus:border-rose-500 focus:outline-none focus:ring-1 focus:ring-rose-500"
                    placeholder="john@example.com"
                    required
                />
            </div>

            <div>
                <label htmlFor="subject" className="block text-sm font-medium text-gray-700">
                    Subject
                </label>
                <input
                    type="text"
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm focus:border-rose-500 focus:outline-none focus:ring-1 focus:ring-rose-500"
                    placeholder="How can we help?"
                    required
                />
            </div>

            <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700">
                    Message
                </label>
                <textarea
                    id="message"
                    name="message"
                    rows={4}
                    value={formData.message}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm focus:border-rose-500 focus:outline-none focus:ring-1 focus:ring-rose-500"
                    placeholder="Tell us more about your question or feedback..."
                    required
                />
            </div>

            <button
                type="submit"
                disabled={isSubmitting}
                className="btn-shine w-full inline-flex items-center justify-center gap-2 rounded-lg bg-rose-200 px-6 py-3 text-base font-semibold text-rose-700 shadow-sm hover:bg-rose-300 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
                <FontAwesomeIcon icon={faPaperPlane} className="h-4 w-4" />
                {isSubmitting ? "Sending..." : "Send Message"}
            </button>
        </form>
    );
}
