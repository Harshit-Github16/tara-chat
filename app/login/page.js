"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGoogle } from "@fortawesome/free-brands-svg-icons";
import { faHeart, faShield, faUserFriends } from "@fortawesome/free-solid-svg-icons";
import ClientOnly from "../components/ClientOnly";
import { signInWithGoogle } from "../../lib/firebase";
import { useAuth } from "../contexts/AuthContext";

export default function LoginPage() {
  const router = useRouter();
  const { user, loading: authLoading, checkAuth } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Check for error in URL params (client-side only)
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      const errorParam = urlParams.get('error');
      if (errorParam) {
        switch (errorParam) {
          case 'access_denied':
            setError('Google sign-in was cancelled');
            break;
          case 'callback_failed':
            setError('Authentication failed. Please try again.');
            break;
          default:
            setError('An error occurred during sign-in');
        }
      }
    }
  }, []);

  // Check if user is already authenticated and redirect
  useEffect(() => {
    if (!authLoading && user) {
      console.log('User already authenticated:', user);

      // Check for redirect parameter
      const urlParams = new URLSearchParams(window.location.search);
      const redirectTo = urlParams.get('redirect');

      if (redirectTo && user.isOnboardingComplete) {
        console.log('Redirecting to:', redirectTo);
        router.replace(redirectTo);
      } else if (user.isOnboardingComplete) {
        console.log('Redirecting to welcome - onboarding complete');
        router.replace('/welcome');
      } else {
        console.log('Redirecting to onboarding - incomplete');
        router.replace('/onboarding');
      }
    }
  }, [user, authLoading, router]);

  async function handleGoogle() {
    setLoading(true);
    setError("");

    try {
      // Use Firebase authentication
      console.log('Starting Google login...');
      const { user, isNewUser } = await signInWithGoogle();
      console.log('Login successful, user:', user, 'isNewUser:', isNewUser);

      // Check if token is stored
      const token = localStorage.getItem('authToken');
      console.log('Token stored in localStorage:', token ? 'Yes' : 'No');

      // Refresh AuthContext to load user data
      console.log('Refreshing AuthContext...');
      await checkAuth();

      // Small delay then redirect
      setTimeout(() => {
        // Check for redirect parameter
        const urlParams = new URLSearchParams(window.location.search);
        const redirectTo = urlParams.get('redirect');

        if (isNewUser || !user.isOnboardingComplete) {
          console.log('Redirecting to onboarding');
          router.push('/onboarding');
        } else if (redirectTo) {
          console.log('Redirecting to:', redirectTo);
          router.push(redirectTo);
        } else {
          console.log('Redirecting to welcome');
          router.push('/welcome');
        }
      }, 500);
    } catch (error) {
      console.error('Login error:', error);
      setError(error.message || "Failed to sign in. Please try again.");
    } finally {
      setLoading(false);
    }
  }



  // Show loading while checking authentication
  if (authLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-rose-50 via-white to-rose-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-rose-200 border-t-rose-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Checking authentication...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-white to-rose-100 relative overflow-hidden flex items-center justify-center p-6">

      {/* Animated SVG Background Elements */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Floating Heart SVG */}
        <div className="absolute top-20 left-10 animate-float-slow">
          <svg width="60" height="60" viewBox="0 0 24 24" fill="none" className="text-rose-300 opacity-30">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" fill="currentColor" />
          </svg>
        </div>

        {/* Floating Brain/Mind SVG */}
        <div className="absolute top-32 right-20 animate-float-medium">
          <svg width="80" height="80" viewBox="0 0 24 24" fill="none" className="text-rose-400 opacity-25">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" fill="currentColor" />
          </svg>
        </div>

        {/* Floating Chat Bubble SVG */}
        <div className="absolute bottom-32 left-16 animate-float-fast">
          <svg width="70" height="70" viewBox="0 0 24 24" fill="none" className="text-rose-200 opacity-40">
            <path d="M20 2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h4l4 4 4-4h4c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z" fill="currentColor" />
            <circle cx="8" cy="10" r="1.5" fill="white" />
            <circle cx="12" cy="10" r="1.5" fill="white" />
            <circle cx="16" cy="10" r="1.5" fill="white" />
          </svg>
        </div>

        {/* Floating Star SVG */}
        <div className="absolute bottom-20 right-12 animate-float-slow">
          <svg width="50" height="50" viewBox="0 0 24 24" fill="none" className="text-yellow-300 opacity-35">
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" fill="currentColor" />
          </svg>
        </div>

        {/* Additional floating elements */}
        <div className="absolute top-1/2 left-8 animate-pulse">
          <div className="w-4 h-4 bg-rose-300 rounded-full opacity-20"></div>
        </div>
        <div className="absolute top-1/3 right-8 animate-bounce">
          <div className="w-6 h-6 bg-rose-400 rounded-full opacity-15"></div>
        </div>
        <div className="absolute bottom-1/3 left-1/4 animate-pulse">
          <div className="w-3 h-3 bg-rose-200 rounded-full opacity-25"></div>
        </div>
      </div>

      {/* Main Login Card */}
      <div className="relative z-10 w-full max-w-xl">
        {/* Logo and Title */}
        <div className="text-center mb-8">
          <div className="mb-6">
            <Image
              src="/taralogo.jpg"
              alt="Tara Logo"
              width={80}
              height={80}
              className="mx-auto rounded-full shadow-2xl border-4 border-white animate-gentle-bounce"
            />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-3 animate-fade-in">
            Welcome to Tara
          </h1>
          <p className="text-lg text-gray-600 animate-fade-in-delay">
            Your AI companion for emotional wellness
          </p>
        </div>

        {/* Login Card */}
        <div className="bg-white/90 backdrop-blur-sm rounded-3xl border border-rose-100 p-8 shadow-2xl animate-slide-up">

          {/* Stats Section */}
          <div className="grid grid-cols-3 gap-4 mb-8 p-4 bg-gradient-to-r from-rose-50 to-pink-50 rounded-2xl">
            <div className="text-center animate-count-up-1">
              <div className="text-2xl font-bold text-rose-600">10K+</div>
              <div className="text-xs text-gray-600">Users</div>
            </div>
            <div className="text-center animate-count-up-2">
              <div className="text-2xl font-bold text-rose-600">100+</div>
              <div className="text-xs text-gray-600">AI Friends</div>
            </div>
            <div className="text-center animate-count-up-3">
              <div className="text-2xl font-bold text-rose-600">4.9★</div>
              <div className="text-xs text-gray-600">Rating</div>
            </div>
          </div>

          {/* Features - 3 cards in one row */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
            <div className="flex flex-col items-center gap-2 p-4 bg-rose-50 rounded-xl animate-slide-in-1 text-center hover:bg-rose-100 transition-colors">
              <FontAwesomeIcon icon={faHeart} className="h-6 w-6 text-rose-500" />
              <span className="text-xs sm:text-sm font-medium text-gray-700 leading-tight">24/7 Emotional Support</span>
            </div>
            <div className="flex flex-col items-center gap-2 p-4 bg-rose-50 rounded-xl animate-slide-in-2 text-center hover:bg-rose-100 transition-colors">
              <FontAwesomeIcon icon={faUserFriends} className="h-6 w-6 text-rose-500" />
              <span className="text-xs sm:text-sm font-medium text-gray-700 leading-tight">Chat with AI Characters</span>
            </div>
            <div className="flex flex-col items-center gap-2 p-4 bg-rose-50 rounded-xl animate-slide-in-3 text-center hover:bg-rose-100 transition-colors">
              <FontAwesomeIcon icon={faShield} className="h-6 w-6 text-rose-500" />
              <span className="text-xs sm:text-sm font-medium text-gray-700 leading-tight">Complete Privacy & Security</span>
            </div>
          </div>

          {/* Error Message */}
          <ClientOnly>
            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl">
                <p className="text-sm text-red-600 text-center">{error}</p>
              </div>
            )}
          </ClientOnly>



          {/* Google Login Button */}
          <button
            onClick={handleGoogle}
            disabled={loading}
            className="w-full group relative overflow-hidden rounded-2xl bg-gradient-to-r from-rose-500 to-pink-600 border-2 border-rose-500 px-6 py-4 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:from-rose-600 hover:to-pink-700 hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed animate-button-appear"
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

          {/* Security Cards - 2 cards in one row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-6">
            <div className="p-4 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl border border-green-200 animate-fade-in-final hover:shadow-md transition-shadow">
              <div className="flex items-center gap-2 text-green-700 mb-2">
                <FontAwesomeIcon icon={faShield} className="h-4 w-4" />
                <span className="text-sm font-semibold">Secure Authentication</span>
              </div>
              <p className="text-xs text-green-600 leading-relaxed">
                Powered by Firebase with enterprise-grade security and privacy protection.
              </p>
            </div>

            <div className="p-4 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl border border-green-200 animate-fade-in-final hover:shadow-md transition-shadow">
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
          <p className="text-xs text-gray-500 text-center mt-6 animate-fade-in-final">
            By continuing, you agree to our{" "}
            <Link href="/privacy-policy" className="text-rose-600 hover:underline font-medium">
              Terms
            </Link>
            {" "}and{" "}
            <Link href="/privacy-policy" className="text-rose-600 hover:underline font-medium">
              Privacy Policy
            </Link>
          </p>
        </div>
      </div>

      {/* Custom CSS for animations */}
      <style jsx>{`
        @keyframes float-slow {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(5deg); }
        }
        
        @keyframes float-medium {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-15px) rotate(-3deg); }
        }
        
        @keyframes float-fast {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-10px) rotate(2deg); }
        }
        
        @keyframes gentle-bounce {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }
        
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes fade-in-delay {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes slide-up {
          from { opacity: 0; transform: translateY(40px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes slide-in-left {
          from { opacity: 0; transform: translateX(-30px); }
          to { opacity: 1; transform: translateX(0); }
        }
        
        @keyframes count-up {
          from { transform: scale(0.5); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
        
        .animate-float-slow {
          animation: float-slow 6s ease-in-out infinite;
        }
        
        .animate-float-medium {
          animation: float-medium 4s ease-in-out infinite;
        }
        
        .animate-float-fast {
          animation: float-fast 3s ease-in-out infinite;
        }
        
        .animate-gentle-bounce {
          animation: gentle-bounce 3s ease-in-out infinite;
        }
        
        .animate-fade-in {
          animation: fade-in 0.8s ease-out;
        }
        
        .animate-fade-in-delay {
          animation: fade-in-delay 0.8s ease-out 0.3s both;
        }
        
        .animate-slide-up {
          animation: slide-up 0.8s ease-out 0.5s both;
        }
        
        .animate-slide-in-1 {
          animation: slide-in-left 0.6s ease-out 0.8s both;
        }
        
        .animate-slide-in-2 {
          animation: slide-in-left 0.6s ease-out 1s both;
        }
        
        .animate-slide-in-3 {
          animation: slide-in-left 0.6s ease-out 1.2s both;
        }
        
        .animate-count-up-1 {
          animation: count-up 0.6s ease-out 1.4s both;
        }
        
        .animate-count-up-2 {
          animation: count-up 0.6s ease-out 1.6s both;
        }
        
        .animate-count-up-3 {
          animation: count-up 0.6s ease-out 1.8s both;
        }
        
        .animate-button-appear {
          animation: slide-up 0.6s ease-out 2s both;
        }
        
        .animate-fade-in-final {
          animation: fade-in 0.6s ease-out 2.2s both;
        }
      `}</style>
    </div>
  );
}