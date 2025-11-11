"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import ProtectedRoute from "../components/ProtectedRoute";
import { useAuth } from "../contexts/AuthContext";
import { api } from "../../lib/api";
import {
  faFaceSmile,
  faFaceGrinStars,
  faFaceGrinHearts,
  faFaceMeh,
  faFaceTired,
  faFaceDizzy,
  faFaceFrownOpen,
  faFaceSadTear,
  faFaceAngry,
  faArrowRight,
} from "@fortawesome/free-solid-svg-icons";

const MOODS = [
  { key: "happy", label: "Happy", icon: faFaceSmile, color: "bg-yellow-50 text-yellow-600 border-yellow-200", gradient: "from-yellow-100 to-yellow-50" },
  { key: "excited", label: "Excited", icon: faFaceGrinStars, color: "bg-orange-50 text-orange-600 border-orange-200", gradient: "from-orange-100 to-orange-50" },
  { key: "grateful", label: "Grateful", icon: faFaceGrinHearts, color: "bg-pink-50 text-pink-600 border-pink-200", gradient: "from-pink-100 to-pink-50" },
  { key: "calm", label: "Calm", icon: faFaceMeh, color: "bg-green-50 text-green-600 border-green-200", gradient: "from-green-100 to-green-50" },
  { key: "tired", label: "Tired", icon: faFaceTired, color: "bg-gray-50 text-gray-600 border-gray-200", gradient: "from-gray-100 to-gray-50" },
  { key: "confused", label: "Confused", icon: faFaceDizzy, color: "bg-purple-50 text-purple-600 border-purple-200", gradient: "from-purple-100 to-purple-50" },
  { key: "stressed", label: "Stressed", icon: faFaceFrownOpen, color: "bg-red-50 text-red-600 border-red-200", gradient: "from-red-100 to-red-50" },
  { key: "anxious", label: "Anxious", icon: faFaceFrownOpen, color: "bg-indigo-50 text-indigo-600 border-indigo-200", gradient: "from-indigo-100 to-indigo-50" },
  { key: "sad", label: "Sad", icon: faFaceSadTear, color: "bg-blue-50 text-blue-600 border-blue-200", gradient: "from-blue-100 to-blue-50" },
  { key: "angry", label: "Angry", icon: faFaceAngry, color: "bg-rose-50 text-rose-600 border-rose-200", gradient: "from-rose-100 to-rose-50" },
];

const FACE_EMOJIS = [
  "😊", "😍", "😄", "😃", "🙂", "😎", "😋", "😉", "😌", "🤗",
  "😘", "🤩", "😚", "😙", "🤔", "😏", "😴", "😀", "😇", "🥳"
];

function WelcomePageContent() {
  const [selected, setSelected] = useState(null);
  const [saving, setSaving] = useState(false);
  const [showCrackers, setShowCrackers] = useState(false);
  const router = useRouter();
  const { user } = useAuth();

  useEffect(() => {
    setShowCrackers(true);
    const timer = setTimeout(() => {
      setShowCrackers(false);
    }, 5000);
    return () => clearTimeout(timer);
  }, []);

  async function saveMood() {
    if (!selected) return;
    setSaving(true);

    // Debug: Check if token exists
    const token = localStorage.getItem('authToken');
    console.log('Welcome: Token exists:', token ? 'Yes' : 'No');
    console.log('Welcome: Selected mood:', selected);

    try {
      // Step 1: Save mood
      const moodResponse = await api.post("/api/mood-mongo", {
        mood: selected,
        intensity: 5, // Default intensity
        note: ""
      });

      console.log('Welcome: Mood response status:', moodResponse.status);

      if (moodResponse.ok) {
        const moodData = await moodResponse.json();
        console.log('Welcome: Mood saved successfully:', moodData);

        // Step 2: Send automatic first message to TARA to trigger mood-based greeting
        try {
          console.log('Welcome: Sending first message to TARA...');
          const chatResponse = await api.post('/api/chat', {
            userId: user.firebaseUid || user.uid,
            chatUserId: 'tara-ai',
            message: 'Hi',
            userDetails: {
              name: user.name,
              gender: user.gender,
              ageRange: user.ageRange,
              profession: user.profession,
              interests: user.interests,
              personalityTraits: user.personalityTraits
            }
          });

          if (chatResponse.ok) {
            const chatData = await chatResponse.json();
            console.log('Welcome: TARA first message sent successfully:', chatData);
          } else {
            console.error('Welcome: Failed to send TARA first message');
          }
        } catch (chatError) {
          console.error('Welcome: Error sending TARA first message:', chatError);
        }

        // Redirect to chatlist
        router.replace("/chatlist");
      } else {
        const errorData = await moodResponse.json();
        console.error('Welcome: Failed to save mood:', errorData);
        // Still redirect for now, but you can add error handling
        router.replace("/chatlist");
      }
    } catch (error) {
      console.error('Welcome: Error saving mood:', error);
      // Still redirect for now, but you can add error handling
      router.replace("/chatlist");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-rose-50/50 via-white to-rose-50/30 p-4 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(244,63,94,0.1),transparent_50%)]"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(244,63,94,0.05),transparent_50%)]"></div>
      {/* Emojis Animation */}
      {showCrackers && (
        <>
          {/* Falling emojis from top */}
          <div className="absolute inset-0 z-40 pointer-events-none">
            {[...Array(25)].map((_, i) => {
              const emojis = [
                '😊', '😍', '😄', '😁', '🙂', '😎', '😋', '😉', '😘',
                '🤩', '🥳', '😚', '😙', '🤫', '😏', '🤤', '😀', '😂', '😅', '😇'
              ];
              const sizes = ['text-lg', 'text-xl', 'text-2xl', 'text-3xl', 'text-4xl'];
              const randomEmoji = emojis[Math.floor(Math.random() * emojis.length)];
              const randomSize = sizes[Math.floor(Math.random() * sizes.length)];

              return (
                <div
                  key={i}
                  className={`absolute animate-emoji-fall-${(i % 6) + 1}`}
                  style={{
                    left: `${Math.random() * 100}%`,
                    top: `-50px`,
                    animationDelay: `${Math.random() * 4}s`
                  }}
                >
                  <span className={randomSize}>{randomEmoji}</span>
                </div>
              );
            })}
          </div>
        </>
      )}

      {showCrackers && (
        <div className="absolute inset-0 z-40 pointer-events-none">
          {[...Array(25)].map((_, i) => {
            const sizes = ['text-lg', 'text-xl', 'text-2xl', 'text-3xl', 'text-4xl'];
            const randomEmoji = FACE_EMOJIS[i % FACE_EMOJIS.length];
            const randomSize = sizes[i % sizes.length];

            return (
              <div
                key={i}
                className={`absolute animate-emoji-fall-${i % 6 + 1}`}
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `-50px`,
                  animationDelay: `${Math.random() * 4}s`
                }}
              >
                <span className={randomSize}>
                  {randomEmoji}
                </span>
              </div>
            );
          })}
        </div>
      )}

      <div className="relative z-10 w-full max-w-4xl">
        <div className="rounded-3xl border border-rose-100 bg-white/90 backdrop-blur-sm p-6 shadow-xl">
          <div className="flex items-center justify-center mb-6">
            <div className="flex items-center gap-3">
              <Image
                src="/taralogo.jpg"
                alt="Tara Logo"
                width={48}
                height={48}
                className="h-12 w-12 rounded-full object-cover"
              />
              <span className="text-2xl font-bold text-rose-600">Tara</span>
            </div>
          </div>

          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Welcome{user?.name ? `, ${user.nickname || user.name.split(' ')[0]}` : ''}! How are you feeling today?
            </h1>
            <p className="text-sm text-gray-600">
              Your mood helps us personalize your experience
            </p>
          </div>

          <div className="grid lg:grid-cols-5 grid-cols-4 gap-2 mb-6">
            {MOODS.map((m) => (
              <button
                key={m.key}
                onClick={() => setSelected(m.key)}
                className={`group rounded-xl border p-3 text-xs font-medium transition-all duration-200 ${selected === m.key
                  ? `ring-2 ring-rose-500 bg-gradient-to-br ${m.gradient} border-rose-300 shadow-md`
                  : `bg-white hover:bg-rose-50 border-rose-100 hover:border-rose-200 hover:shadow-sm`
                  }`}
              >
                <div className="flex flex-col items-center gap-2">
                  <div className={`h-12 w-12 rounded-full flex items-center justify-center transition-all ${selected === m.key
                    ? `${m.color} scale-110 shadow-lg`
                    : `${m.color} group-hover:scale-105`
                    }`}>
                    <FontAwesomeIcon icon={m.icon} className="h-6 w-6" />
                  </div>
                  <span className={`text-xs font-medium ${selected === m.key ? 'text-gray-900 font-semibold' : 'text-gray-600'}`}>
                    {m.label}
                  </span>
                </div>
              </button>
            ))}
          </div>

          <div className="flex items-center justify-end">


            <button
              onClick={saveMood}
              disabled={!selected || saving}
              className="group inline-flex items-center gap-2 rounded-full bg-rose-500 px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-rose-600 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {saving ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Saving...
                </>
              ) : (
                <>
                  Continue to Chats
                  <FontAwesomeIcon icon={faArrowRight} className="h-3 w-3 transition-transform group-hover:translate-x-1" />
                </>
              )}
            </button>
          </div>


        </div>
      </div>

      <style jsx>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(5px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }

        @keyframes emoji-fall {
          0% { 
            transform: translateY(-100px) rotate(0deg) scale(0.5); 
            opacity: 0; 
          }
          5% { 
            opacity: 1; 
            transform: translateY(-50px) rotate(15deg) scale(1); 
          }
          100% { 
            transform: translateY(calc(100vh + 100px)) rotate(360deg) scale(0.8); 
            opacity: 0; 
          }
        }

        .animate-emoji-fall-1 { animation: emoji-fall 3s linear; }
        .animate-emoji-fall-2 { animation: emoji-fall 3.5s linear; }
        .animate-emoji-fall-3 { animation: emoji-fall 2.5s linear; }
        .animate-emoji-fall-4 { animation: emoji-fall 4s linear; }
        .animate-emoji-fall-5 { animation: emoji-fall 2.8s linear; }
        .animate-emoji-fall-6 { animation: emoji-fall 3.2s linear; }
      `}</style>
    </div>
  );
}
export default function WelcomePage() {
  return (
    <ProtectedRoute requireOnboarding={true}>
      <WelcomePageContent />
    </ProtectedRoute>
  );
}