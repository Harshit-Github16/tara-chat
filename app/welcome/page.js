'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../contexts/AuthContext';

export default function WelcomePage() {
  const router = useRouter();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading) {
      if (user) {
        // User is logged in, redirect to chatlist
        router.replace('/chatlist');
      } else {
        // User is not logged in, redirect to login
        router.replace('/login');
      }
    }
  }, [user, loading, router]);

  // Show loading state while checking auth
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-rose-50 via-white to-rose-100">
      <div className="text-center">
        <img
          src="/taralogo.jpg"
          alt="Tara Logo"
          className="mx-auto h-20 w-20 rounded-full object-cover mb-4 animate-pulse"
        />
        <h1 className="text-2xl font-bold text-rose-600 mb-2">Welcome to Tara</h1>
        <p className="text-gray-600">Loading...</p>
      </div>
    </div>
  );
}
