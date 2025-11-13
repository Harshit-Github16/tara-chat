'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../contexts/AuthContext';
import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faComments, faBookOpen, faChartLine, faArrowRight } from '@fortawesome/free-solid-svg-icons';
import MoodCheckIn from '../components/MoodCheckIn';
import confetti from 'canvas-confetti';

export default function WelcomePage() {
  const router = useRouter();
  const { user, loading } = useAuth();
  const [showMoodCheckIn, setShowMoodCheckIn] = useState(true);
  const [moodSaved, setMoodSaved] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      // User is not logged in, redirect to login
      router.replace('/login');
    }
  }, [user, loading, router]);

  // Confetti effect on page load
  useEffect(() => {
    if (!loading && user) {
      const end = Date.now() + 3 * 1000; // 3 seconds
      const colors = ['#f43f5e', '#fb7185', '#fda4af', '#fecdd3'];

      const frame = () => {
        if (Date.now() > end) return;

        confetti({
          particleCount: 2,
          angle: 60,
          spread: 55,
          startVelocity: 60,
          origin: { x: 0, y: 0.5 },
          colors: colors,
        });
        confetti({
          particleCount: 2,
          angle: 120,
          spread: 55,
          startVelocity: 60,
          origin: { x: 1, y: 0.5 },
          colors: colors,
        });

        requestAnimationFrame(frame);
      };

      frame();
    }
  }, [loading, user]);

  const handleMoodSaved = () => {
    setMoodSaved(true);
    // Redirect to chatlist after 1 second
    setTimeout(() => {
      router.push('/chatlist');
    }, 1000);
  };

  if (loading) {
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

  // Welcome page content
  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-white to-rose-100 p-6">
      <div className="max-w-4xl mx-auto py-8">
        {/* Welcome Header */}
        <div className="text-center mb-8">
          <img
            src="/taralogo.jpg"
            alt="Tara Logo"
            className="mx-auto h-20 w-20 rounded-full object-cover mb-4 shadow-lg border-4 border-white"
          />
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Welcome  {user?.name || 'Friend'}! 👋
          </h1>
          <p className="text-lg text-gray-600">
            Let's start your day with a quick mood check-in
          </p>
        </div>

        {/* Mood Check-In Section */}
        {showMoodCheckIn ? (
          <div className="mb-8">
            <MoodCheckIn onMoodSaved={handleMoodSaved} />
          </div>
        ) : (
          <>
            {/* Success Message */}
            {moodSaved && (
              <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl text-center animate-fade-in">
                <p className="text-green-700 font-semibold">✅ Mood saved! Great job tracking your wellness.</p>
              </div>
            )}

            {/* Quick Actions */}
            <div className="bg-white/90 backdrop-blur-sm rounded-3xl border border-rose-100 p-8 shadow-xl mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
                What would you like to do today?
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                <Link
                  href="/chatlist"
                  className="group p-6 bg-gradient-to-br from-rose-50 to-rose-100 rounded-2xl border border-rose-200 hover:shadow-lg transition-all hover:-translate-y-1 text-center"
                >
                  <FontAwesomeIcon icon={faComments} className="h-10 w-10 text-rose-600 mb-3 mx-auto" />
                  <h3 className="font-semibold text-gray-900 mb-1">Start Chatting</h3>
                  <p className="text-xs text-gray-600">Talk with AI companions</p>
                </Link>

                <Link
                  href="/journal"
                  className="group p-6 bg-gradient-to-br from-rose-50 to-rose-100 rounded-2xl border border-rose-200 hover:shadow-lg transition-all hover:-translate-y-1 text-center"
                >
                  <FontAwesomeIcon icon={faBookOpen} className="h-10 w-10 text-rose-600 mb-3 mx-auto" />
                  <h3 className="font-semibold text-gray-900 mb-1">Journal</h3>
                  <p className="text-xs text-gray-600">Write your thoughts</p>
                </Link>

                <Link
                  href="/insights"
                  className="group p-6 bg-gradient-to-br from-rose-50 to-rose-100 rounded-2xl border border-rose-200 hover:shadow-lg transition-all hover:-translate-y-1 text-center"
                >
                  <FontAwesomeIcon icon={faChartLine} className="h-10 w-10 text-rose-600 mb-3 mx-auto" />
                  <h3 className="font-semibold text-gray-900 mb-1">Insights</h3>
                  <p className="text-xs text-gray-600">Track your progress</p>
                </Link>
              </div>

              {/* Main CTA */}
              <div className="text-center">
                <Link
                  href="/chatlist"
                  className="inline-flex items-center gap-2 bg-gradient-to-r from-rose-400 to-rose-600 text-white px-8 py-4 rounded-full font-semibold shadow-lg hover:shadow-xl transition-all hover:-translate-y-1"
                >
                  Continue to App
                  <FontAwesomeIcon icon={faArrowRight} className="h-4 w-4" />
                </Link>
              </div>
            </div>

            {/* Check Mood Again Button */}
            <div className="text-center">
              <button
                onClick={() => setShowMoodCheckIn(true)}
                className="text-sm text-rose-600 hover:text-rose-700 font-medium underline"
              >
                Want to update your mood?
              </button>
            </div>
          </>
        )}

        {/* Quick tip */}
        <div className="mt-6 p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-200 text-center">
          <p className="text-sm text-green-700">
            💡 <strong>Tip:</strong> Daily mood check-ins help you track patterns and improve your emotional wellness!
          </p>
        </div>
      </div>

      <style jsx>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}
