"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLock, faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { faGoogle } from "@fortawesome/free-brands-svg-icons";
import Image from "next/image";

export default function LoginPromptOverlay({ onLoginClick }) {
    const router = useRouter();

    const handleLoginClick = () => {
        if (onLoginClick) {
            onLoginClick();
        } else {
            router.push('/');
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-md">
            <div className="relative w-full max-w-md mx-4">
                <div className="bg-white rounded-3xl shadow-2xl p-8 text-center">
                    {/* Logo */}
                    <div className="mb-6">
                        <Image
                            src="/taralogo.jpg"
                            alt="Tara Logo"
                            width={80}
                            height={80}
                            className="mx-auto rounded-full shadow-lg border-4 border-rose-100"
                        />
                    </div>

                    {/* Lock Icon */}
                    <div className="mb-6">
                        <div className="inline-flex items-center justify-center w-16 h-16 bg-rose-100 rounded-full">
                            <FontAwesomeIcon icon={faLock} className="h-8 w-8 text-rose-600" />
                        </div>
                    </div>

                    {/* Heading */}
                    <h2 className="text-2xl font-bold text-gray-900 mb-3">
                        Login Required
                    </h2>
                    <p className="text-gray-600 mb-8">
                        Please sign in to access this feature and start your emotional wellness journey
                    </p>

                    {/* Login Button */}
                    <button
                        onClick={handleLoginClick}
                        className="w-full group relative overflow-hidden rounded-2xl bg-gradient-to-r from-rose-400 to-rose-600 px-6 py-4 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                    >
                        <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        <div className="relative flex items-center justify-center gap-3">
                            <FontAwesomeIcon icon={faGoogle} className="h-5 w-5" />
                            <span>Sign in with Google</span>
                            <FontAwesomeIcon icon={faArrowRight} className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                        </div>
                    </button>

                    {/* Features List */}
                    <div className="mt-6 pt-6 border-t border-gray-200">
                        <p className="text-sm text-gray-500 mb-3">What you'll get:</p>
                        <div className="space-y-2 text-left">
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                                <div className="w-1.5 h-1.5 bg-rose-500 rounded-full"></div>
                                <span>24/7 AI emotional support</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                                <div className="w-1.5 h-1.5 bg-rose-500 rounded-full"></div>
                                <span>Track moods & journal entries</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                                <div className="w-1.5 h-1.5 bg-rose-500 rounded-full"></div>
                                <span>Set & achieve wellness goals</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                                <div className="w-1.5 h-1.5 bg-rose-500 rounded-full"></div>
                                <span>Get personalized insights</span>
                            </div>
                        </div>
                    </div>

                    {/* Free Badge */}
                    <div className="mt-6">
                        <span className="inline-block bg-green-100 text-green-700 text-xs font-semibold px-4 py-2 rounded-full">
                            100% Free to Start
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
}
