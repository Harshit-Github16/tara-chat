'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../contexts/AuthContext';
import { useOnboardingCheck } from '../hooks/useOnboardingCheck';
import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faComments, faBookOpen, faChartLine, faArrowRight } from '@fortawesome/free-solid-svg-icons';
import MoodCheckIn from '../components/MoodCheckIn';
import confetti from 'canvas-confetti';

export default function WelcomePage() {
  const router = useRouter();
  const { user, loading, updateUser } = useAuth();

  const { checking } = useOnboardingCheck();
  const [showMoodCheckIn, setShowMoodCheckIn] = useState(true);
  const [moodSaved, setMoodSaved] = useState(false);

  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passwordMode, setPasswordMode] = useState('set'); // 'set' or 'verify'
  const [passwordInput, setPasswordInput] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [isPasswordVerified, setIsPasswordVerified] = useState(false);

  useEffect(() => {
    console.log('WelcomePage Effect:', { loading, user: !!user, hasPassword: !!user?.userPassword, isPasswordVerified, showPasswordModal });

    if (!loading && !user) {
      router.replace('/login');
    } else if (!loading && user) {
      // Check password status
      if (user.userPassword) {
        console.log('User has password, checking verification status...');
        // User has password => Verify mode
        if (!isPasswordVerified) {
          console.log('Password not verified, showing Verify modal');
          setPasswordMode('verify');
          setShowPasswordModal(true);
        }
      } else {
        // User has NO password => Set mode
        // Only show if not already verified (which handles the interim state after setting password)
        if (!isPasswordVerified) {
          console.log('User has NO password, showing Set modal');
          setPasswordMode('set');
          setShowPasswordModal(true);
        }
      }
    }
  }, [user, loading, router, isPasswordVerified, showPasswordModal]);

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

  const handleMoodSaved = (moodEntry) => {
    setMoodSaved(true);
    // Redirect to chatlist after 1 second with mood data
    setTimeout(() => {
      // Pass mood data via URL params
      const moodData = encodeURIComponent(JSON.stringify({
        mood: moodEntry.mood,
        intensity: moodEntry.intensity,
        note: moodEntry.note
      }));
      router.push(`/chatlist?fromMood=true&moodData=${moodData}`);
    }, 1000);
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setPasswordError('');

    if (!passwordInput.trim()) {
      setPasswordError('Safe word cannot be empty');
      return;
    }

    try {
      const token = localStorage.getItem('authToken');
      if (passwordMode === 'set') {
        // Set Password API
        const res = await fetch('/api/auth/set-password', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ userId: user.firebaseUid, userPassword: passwordInput })
        });
        const data = await res.json();

        if (data.success) {
          // Update local state first to prevent useEffect race condition
          setIsPasswordVerified(true);
          setShowPasswordModal(false);

          // Update local user context to reflect password is set
          await updateUser({ ...user, userPassword: passwordInput });
        } else {
          setPasswordError(data.error || 'Failed to set safe word');
        }

      } else {
        // Verify Password API
        const res = await fetch('/api/auth/verify-password', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ userId: user.firebaseUid, password: passwordInput })
        });
        const data = await res.json();

        if (data.success) {
          setShowPasswordModal(false);
          setIsPasswordVerified(true);
        } else {
          setPasswordError('Incorrect safe word');
        }
      }
    } catch (err) {
      console.error(err);
      setPasswordError('Something went wrong. Please try again.');
    }
  };

  if (loading || checking) {
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
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-white to-rose-100 p-4 sm:p-6">
      <div className="max-w-4xl mx-auto py-4 sm:py-8">
        {/* Welcome Header */}
        <div className="text-center mb-4 sm:mb-6">
          <div className="flex items-center justify-center gap-3 mb-2">
            <img
              src="/taralogo.jpg"
              alt="Tara Logo"
              className="h-12 w-12 sm:h-16 sm:w-16 rounded-full object-cover shadow-lg border-2 sm:border-4 border-white"
            />
            <h1 className="text-xl sm:text-3xl font-bold text-gray-900">
              Welcome {user?.name || 'Friend'}! 👋
            </h1>
          </div>
          <p className="text-xs sm:text-base text-gray-600 px-4">
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
                className="text-sm text-rose-600 hover:text-rose-600 font-medium underline"
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

      {/* Password Modal */}
      {showPasswordModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-[9999] flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-8 max-w-sm w-full shadow-2xl animate-fade-in">
            <div className="text-center mb-6">
              <div className="h-16 w-16 bg-rose-100 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl">
                {passwordMode === 'set' ? '🔐' : '🛡️'}
              </div>
              <h2 className="text-2xl font-bold text-gray-900">
                {passwordMode === 'set' ? 'Set Your Safe Word' : 'Enter Your Safe Word'}
              </h2>
              <p className="text-gray-500 mt-2 text-sm">
                {passwordMode === 'set'
                  ? 'Create a safe word to secure your personal space.'
                  : 'Please verify your identity to continue.'}
              </p>
            </div>

            <form onSubmit={handlePasswordSubmit}>
              <div className="mb-4">
                <input
                  type="password"
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  placeholder={passwordMode === 'set' ? "Create a safe word" : "Enter your safe word"}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-rose-500 focus:ring-2 focus:ring-rose-200 outline-none transition-all text-center text-lg"
                  autoFocus
                />
                {passwordError && (
                  <p className="text-red-500 text-xs mt-2 text-center font-medium">{passwordError}</p>
                )}
              </div>

              <button
                type="submit"
                className="w-full bg-gradient-to-r from-rose-500 to-rose-600 text-white font-bold py-3.5 rounded-xl hover:shadow-lg hover:scale-[1.02] transition-all active:scale-95"
              >
                {passwordMode === 'set' ? 'Set Safe Word & Continue' : 'Unlock Access'}
              </button>

              {passwordMode === 'verify' && (
                <p className="text-center mt-4 text-xs text-gray-400">
                  Forgot safe word? Reset in Profile later.
                </p>
              )}
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
