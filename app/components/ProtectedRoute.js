"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../contexts/AuthContext";

export default function ProtectedRoute({ children }) {
    const router = useRouter();
    const { user, loading } = useAuth();
    const [isChecking, setIsChecking] = useState(true);

    useEffect(() => {
        // Check localStorage for authToken
        const checkAuth = () => {
            if (typeof window === 'undefined') return;

            const token = localStorage.getItem('authToken');

            if (!token) {
                console.log('No authToken found in localStorage, redirecting to login');
                const currentPath = window.location.pathname;
                router.replace(`/login?redirect=${currentPath}`);
                return;
            }

            setIsChecking(false);
        };

        // Wait for auth context to load
        if (!loading) {
            checkAuth();
        }
    }, [loading, router]);

    // Show loading while checking authentication
    if (loading || isChecking) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-rose-50 via-white to-rose-100 flex items-center justify-center">
                <div className="text-center">
                    <div className="w-12 h-12 border-4 border-rose-200 border-t-rose-600 rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading...</p>
                </div>
            </div>
        );
    }

    // If no user after loading, don't render children
    if (!user) {
        return null;
    }

    return <>{children}</>;
}
