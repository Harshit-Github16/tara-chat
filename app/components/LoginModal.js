"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGoogle } from "@fortawesome/free-brands-svg-icons";
import { faHeart, faShield, faUserFriends, faTimes } from "@fortawesome/free-solid-svg-icons";
import { signInWithGoogle } from "../../lib/firebase";
import { useAuth } from "../contexts/AuthContext";
import Toast from "./Toast";

export default function LoginModal({ isOpen, onClose, onLoginSuccess, showCloseButton = true }) {
    const router = useRouter();
    const { user, loading: authLoading, checkAuth } = useAuth();
    const [toast, setToast] = useState(null);

    // Close modal if user is authenticated
    useEffect(() => {
        if (!authLoading && user) {
            onClose();
        }
    }, [user, authLoading, onClose]);

    async function handleGoogle() {
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

            // Handle specific Firebase errors
            let errorMessage = 'Login failed. Please try again.';

            if (error.code === 'auth/cancelled-popup-request') {
                errorMessage = 'Login cancelled. Please try again.';
            } else if (error.code === 'auth/popup-closed-by-user') {
                errorMessage = 'Login popup was closed. Please try again.';
            } else if (error.code === 'auth/popup-blocked') {
                errorMessage = 'Popup was blocked. Please allow popups and try again.';
            } else if (error.code === 'auth/network-request-failed') {
                errorMessage = 'Network error. Please check your connection.';
            } else if (error.message) {
                errorMessage = error.message;
            }

            // Show toast notification
            setToast({ message: errorMessage, type: 'error' });
        }
    }

    if (!isOpen) return null;

    return (
        <>
            {toast && (
                <Toast
                    message={toast.message}
                    type={toast.type}
                    onClose={() => setToast(null)}
                    duration={4000}
                />
            )}
            <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/50 backdrop-blur-sm">
                <div className="relative w-full max-w-[95vw] sm:max-w-md lg:max-w-xl bg-white rounded-2xl sm:rounded-3xl shadow-2xl max-h-[95vh] sm:max-h-[90vh] overflow-y-auto">
                    {/* Close Button - Only show on home page */}
                    {showCloseButton && (
                        <button
                            onClick={onClose}
                            className="absolute top-3 right-3 sm:top-4 sm:right-4 z-10 w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
                        >
                            <FontAwesomeIcon icon={faTimes} className="h-4 w-4 sm:h-5 sm:w-5 text-gray-600" />
                        </button>
                    )}

                    <div className="p-5 sm:p-6 lg:p-8">
                        {/* Header */}
                        <div className="text-center mb-6 sm:mb-8">
                            <div className="mb-4 sm:mb-6">
                                <Image
                                    src="/taralogo.jpg"
                                    alt="Tara Logo"
                                    width={60}
                                    height={60}
                                    className="mx-auto rounded-full shadow-2xl border-4 border-white sm:w-20 sm:h-20"
                                />
                            </div>
                            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-2 sm:mb-3">
                                Welcome to Tara
                            </h1>
                            <p className="text-sm sm:text-base lg:text-lg text-gray-600">
                                Your AI companion for emotional wellness
                            </p>
                        </div>

                        {/* Stats */}
                        <div className="grid grid-cols-3 gap-2 sm:gap-4 mb-4 sm:mb-6 p-3 sm:p-4 bg-gradient-to-r from-rose-50 to-pink-50 rounded-xl sm:rounded-2xl">
                            <div className="text-center">
                                <div className="text-lg sm:text-xl lg:text-2xl font-bold text-rose-600">10K+</div>
                                <div className="text-xs text-gray-600">Users</div>
                            </div>
                            <div className="text-center">
                                <div className="text-lg sm:text-xl lg:text-2xl font-bold text-rose-600">100+</div>
                                <div className="text-xs text-gray-600">AI Friends</div>
                            </div>
                            <div className="text-center">
                                <div className="text-lg sm:text-xl lg:text-2xl font-bold text-rose-600">4.9★</div>
                                <div className="text-xs text-gray-600">Rating</div>
                            </div>
                        </div>

                        {/* Login Button */}
                        <button
                            onClick={handleGoogle}
                            className="w-full group relative overflow-hidden rounded-xl sm:rounded-2xl bg-gradient-to-r from-rose-400 to-rose-600 border-2 border-rose-300 px-4 sm:px-6 py-3 sm:py-4 text-sm sm:text-base text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                        >
                            <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                            <div className="relative flex items-center justify-center gap-2 sm:gap-3">
                                <FontAwesomeIcon icon={faGoogle} className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
                                <span>Continue with Google</span>
                                <div className="ml-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                    →
                                </div>
                            </div>
                        </button>

                        {/* Features */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-3 my-4 sm:my-6">
                            <div className="flex flex-col items-center gap-1.5 sm:gap-2 p-3 sm:p-4 bg-rose-50 rounded-lg sm:rounded-xl text-center hover:bg-rose-100 transition-colors">
                                <FontAwesomeIcon icon={faHeart} className="h-5 w-5 sm:h-6 sm:w-6 text-rose-500" />
                                <span className="text-xs sm:text-sm font-medium text-gray-700 leading-tight">24/7 Emotional Support</span>
                            </div>
                            <div className="flex flex-col items-center gap-1.5 sm:gap-2 p-3 sm:p-4 bg-rose-50 rounded-lg sm:rounded-xl text-center hover:bg-rose-100 transition-colors">
                                <FontAwesomeIcon icon={faUserFriends} className="h-5 w-5 sm:h-6 sm:w-6 text-rose-500" />
                                <span className="text-xs sm:text-sm font-medium text-gray-700 leading-tight">Chat with AI Characters</span>
                            </div>
                            <div className="flex flex-col items-center gap-1.5 sm:gap-2 p-3 sm:p-4 bg-rose-50 rounded-lg sm:rounded-xl text-center hover:bg-rose-100 transition-colors">
                                <FontAwesomeIcon icon={faShield} className="h-5 w-5 sm:h-6 sm:w-6 text-rose-500" />
                                <span className="text-xs sm:text-sm font-medium text-gray-700 leading-tight">Complete Privacy & Security</span>
                            </div>
                        </div>

                        {/* Security Cards */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3 mt-4 sm:mt-6">
                            <div className="p-3 sm:p-4 bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg sm:rounded-xl border border-green-200 hover:shadow-md transition-shadow">
                                <div className="flex items-center gap-2 text-green-700 mb-1.5 sm:mb-2">
                                    <FontAwesomeIcon icon={faShield} className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                                    <span className="text-xs sm:text-sm font-semibold">Secure Authentication</span>
                                </div>
                                <p className="text-xs text-green-600 leading-relaxed">
                                    Powered by Firebase with enterprise-grade security and privacy protection.
                                </p>
                            </div>

                            <div className="p-3 sm:p-4 bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg sm:rounded-xl border border-green-200 hover:shadow-md transition-shadow">
                                <div className="flex items-center gap-2 text-green-700 mb-1.5 sm:mb-2">
                                    <FontAwesomeIcon icon={faShield} className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                                    <span className="text-xs sm:text-sm font-semibold">Secure & Private</span>
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
        </>
    );
}
