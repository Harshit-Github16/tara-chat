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
  faHeart,
  faLeaf,
  faBolt,
  faFaceFrown,
  faSun,
  faStar,
  faBrain,
  faArrowRight,
} from "@fortawesome/free-solid-svg-icons";

const MOODS = [
  { key: "joyful", label: "Joyful", icon: faFaceSmile, color: "bg-rose-50 text-rose-700 border-rose-200", gradient: "from-rose-100 to-rose-50" },
  { key: "grateful", label: "Grateful", icon: faHeart, color: "bg-rose-100 text-rose-700 border-rose-200", gradient: "from-rose-200 to-rose-100" },
  { key: "calm", label: "Calm", icon: faLeaf, color: "bg-rose-50 text-rose-600 border-rose-200", gradient: "from-rose-100 to-rose-50" },
  { key: "energized", label: "Energized", icon: faBolt, color: "bg-rose-100 text-rose-700 border-rose-200", gradient: "from-rose-200 to-rose-100" },
  { key: "peaceful", label: "Peaceful", icon: faLeaf, color: "bg-rose-50 text-rose-600 border-rose-200", gradient: "from-rose-100 to-rose-50" },
  { key: "down", label: "Reflective", icon: faFaceFrown, color: "bg-rose-100 text-rose-700 border-rose-200", gradient: "from-rose-200 to-rose-100" },
  { key: "bright", label: "Bright", icon: faSun, color: "bg-rose-50 text-rose-600 border-rose-200", gradient: "from-rose-100 to-rose-50" },
  { key: "inspired", label: "Inspired", icon: faStar, color: "bg-rose-100 text-rose-700 border-rose-200", gradient: "from-rose-200 to-rose-100" },
  { key: "focused", label: "Focused", icon: faBrain, color: "bg-rose-50 text-rose-600 border-rose-200", gradient: "from-rose-100 to-rose-50" },
  { key: "hopeful", label: "Hopeful", icon: faHeart, color: "bg-rose-100 text-rose-700 border-rose-200", gradient: "from-rose-200 to-rose-100" },
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
      const response = await api.post("/api/mood", {
        mood: selected,
        intensity: 5, // Default intensity
        note: ""
      });

      console.log('Welcome: Response status:', response.status);

      if (response.ok) {
        const data = await response.json();
        console.log('Welcome: Success response:', data);
        router.replace("/chatlist");
      } else {
        const errorData = await response.json();
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
              Welcome back{user?.name ? `, ${user.nickname || user.name.split(' ')[0]}` : ''}! How are you feeling today?
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
                  <div className={`h-8 w-8 rounded-lg flex items-center justify-center transition-all ${selected === m.key
                    ? 'bg-white/90 text-rose-600'
                    : 'bg-rose-50 text-rose-500 group-hover:bg-rose-100'
                    }`}>
                    <FontAwesomeIcon icon={m.icon} className="h-3 w-3" />
                  </div>
                  <span className={selected === m.key ? 'text-rose-700' : 'text-gray-700'}>
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