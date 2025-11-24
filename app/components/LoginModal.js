"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGoogle } from "@fortawesome/free-brands-svg-icons";
import { faHeart, faShield, faUserFriends, faTimes } from "@fortawesome/free-solid-svg-icons";
import ClientOnly from "./ClientOnly";
import { signInWithGoogle } from "../../lib/firebase";
import { useAuth } from "../contexts/AuthContext";

export default function LoginModal({ isOpen, onClose, onLoginSuccess, showCloseButton = true }) {
    const router = useRouter();
    const { user, loading: authLoading, checkAuth } = useAuth();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    // Close modal if user is authenticated
    useEffect(() => {
        if (!authLoading && user) {
            onClose();
        }
    }, [user, authLoading, onClose]);

    async function handleGoogle() {
        setLoading(true);
        setError("");

        try {
            console.log('Starting Google login...');
            const { user, isNewUser } = await signInWithGoogle();
            console.log('Login successful, user:', user, 'isNewUser:', isNewUser);

            const token = localStorage.getItem('authToken');
            console.log('Token stored in localStorage:', token ? 'Yes' : 'No');

            console.log('Refreshing AuthContext...');
            await checkAuth();

            // Check if there's a redirect URL stored
            const redirectUrl = localStorage.getItem('redirectAfterLogin');

            // Call success callback
            if (onLoginSuccess) {
                onLoginSuccess(isNewUser, user);
            } else if (redirectUrl && redirectUrl !== '/') {
                // If there's a stored redirect URL and no custom callback, redirect there
                localStorage.removeItem('redirectAfterLogin');
                router.push(redirectUrl);
            }

            // Close modal
            onClose();
        } catch (error) {
            console.error('Login error:', error);
            setError(error.message || "Failed to sign in. Please try again.");
        } finally {
            setLoading(false);
        }
    }

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl max-h-[90vh] overflow-y-auto">
                {/* Close Button - Only show on home page */}
                {showCloseButton && (
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 z-10 w-10 h-10 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
                    >
                        <FontAwesomeIcon icon={faTimes} className="h-5 w-5 text-gray-600" />
                    </button>
                )}

                <div className="p-8">
                    {/* Header */}
                    <div className="text-center mb-8">
                        <div className="mb-6">
                            <Image
                                src="/taralogo.jpg"
                                alt="Tara Logo"
                                width={80}
                                height={80}
                                className="mx-auto rounded-full shadow-2xl border-4 border-white"
                            />
                        </div>
                        <h1 className="text-4xl font-bold text-gray-900 mb-3">
                            Welcome to Tara
                        </h1>
                        <p className="text-lg text-gray-600">
                            Your AI companion for emotional wellness
                        </p>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-3 gap-4 mb-6 p-4 bg-gradient-to-r from-rose-50 to-pink-50 rounded-2xl">
                        <div className="text-center">
                            <div className="text-2xl font-bold text-rose-600">10K+</div>
                            <div className="text-xs text-gray-600">Users</div>
                        </div>
                        <div className="text-center">
                            <div className="text-2xl font-bold text-rose-600">100+</div>
                            <div className="text-xs text-gray-600">AI Friends</div>
                        </div>
                        <div className="text-center">
                            <div className="text-2xl font-bold text-rose-600">4.9★</div>
                            <div className="text-xs text-gray-600">Rating</div>
                        </div>
                    </div>

                    <ClientOnly>
                        {error && (
                            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl">
                                <p className="text-sm text-red-600 text-center">Something went wrong</p>
                            </div>
                        )}
                    </ClientOnly>

                    {/* Login Button */}
                    <button
                        onClick={handleGoogle}
                        disabled={loading}
                        className="w-full group relative overflow-hidden rounded-2xl bg-gradient-to-r from-rose-400 to-rose-600 border-2 border-rose-300 px-6 py-4 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        <div className="relative flex items-center justify-center gap-3">
                            {loading ? (
                                <>
                                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                    <span>Signing you in...</span>
                                </>
                            ) : (
                                <>
                                    <FontAwesomeIcon icon={faGoogle} className="h-5 w-5 text-white" />
                                    <span>Continue with Google</span>
                                    <div className="ml-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                        →
                                    </div>
                                </>
                            )}
                        </div>
                    </button>

                    {/* Features */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 my-6">
                        <div className="flex flex-col items-center gap-2 p-4 bg-rose-50 rounded-xl text-center hover:bg-rose-100 transition-colors">
                            <FontAwesomeIcon icon={faHeart} className="h-6 w-6 text-rose-500" />
                            <span className="text-xs sm:text-sm font-medium text-gray-700 leading-tight">24/7 Emotional Support</span>
                        </div>
                        <div className="flex flex-col items-center gap-2 p-4 bg-rose-50 rounded-xl text-center hover:bg-rose-100 transition-colors">
                            <FontAwesomeIcon icon={faUserFriends} className="h-6 w-6 text-rose-500" />
                            <span className="text-xs sm:text-sm font-medium text-gray-700 leading-tight">Chat with AI Characters</span>
                        </div>
                        <div className="flex flex-col items-center gap-2 p-4 bg-rose-50 rounded-xl text-center hover:bg-rose-100 transition-colors">
                            <FontAwesomeIcon icon={faShield} className="h-6 w-6 text-rose-500" />
                            <span className="text-xs sm:text-sm font-medium text-gray-700 leading-tight">Complete Privacy & Security</span>
                        </div>
                    </div>

                    {/* Security Cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-6">
                        <div className="p-4 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl border border-green-200 hover:shadow-md transition-shadow">
                            <div className="flex items-center gap-2 text-green-700 mb-2">
                                <FontAwesomeIcon icon={faShield} className="h-4 w-4" />
                                <span className="text-sm font-semibold">Secure Authentication</span>
                            </div>
                            <p className="text-xs text-green-600 leading-relaxed">
                                Powered by Firebase with enterprise-grade security and privacy protection.
                            </p>
                        </div>

                        <div className="p-4 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl border border-green-200 hover:shadow-md transition-shadow">
                            <div className="flex items-center gap-2 text-green-700 mb-2">
                                <FontAwesomeIcon icon={faShield} className="h-4 w-4" />
                                <span className="text-sm font-semibold">Secure & Private</span>
                            </div>
                            <p className="text-xs text-green-600 leading-relaxed">
                                Your data is encrypted and never shared with third parties.
                            </p>
                        </div>
                    </div>

                    {/* Terms */}
                    <p className="text-xs text-gray-500 text-center mt-6">
                        By continuing, you agree to our{" "}
                        <Link href="/terms-of-service" className="text-rose-600 hover:underline font-medium">
                            Terms
                        </Link>
                        {" "}and{" "}
                        <Link href="/privacy-policy" className="text-rose-600 hover:underline font-medium">
                            Privacy Policy
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
