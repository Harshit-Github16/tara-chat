"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
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

export default function WelcomePage() {
  const [selected, setSelected] = useState(null);
  const [saving, setSaving] = useState(false);
  const [showCrackers, setShowCrackers] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Show crackers animation on page load
    setShowCrackers(true);
    const timer = setTimeout(() => {
      setShowCrackers(false);
    }, 3000); // Hide after 3 seconds

    return () => clearTimeout(timer);
  }, []);

  async function saveMood() {
    if (!selected) return;
    setSaving(true);
    try {
      await fetch("/api/mood", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mood: selected }),
      });
      router.replace("/chatlist");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-rose-50/50 via-white to-rose-50/30 p-4 relative overflow-hidden">
      {/* Decorative gradients */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(244,63,94,0.1),transparent_50%)]"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(244,63,94,0.05),transparent_50%)]"></div>

      {/* Balloons Animation */}
      {showCrackers && (
        <>
          {/* Falling balloons from top */}
          <div className="absolute inset-0 z-40 pointer-events-none">
            {[...Array(12)].map((_, i) => (
              <div
                key={i}
                className={`absolute animate-balloon-fall-${i % 4 + 1}`}
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `-50px`,
                  animationDelay: `${Math.random() * 2}s`
                }}
              >
                <div className="text-3xl">🎈</div>
              </div>
            ))}
          </div>
        </>
      )}

      <div className="relative z-10 w-full max-w-4xl">
        <div className="rounded-3xl border border-rose-100 bg-white/90 backdrop-blur-sm p-6 shadow-xl">
          {/* Logo and Welcome Header */}
          <div className="text-center mb-6">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Image
                src="/taralogo.jpg"
                alt="Tara Logo"
                width={48}
                height={48}
                className="h-12 w-12 rounded-full object-cover"
              />
              <span className="text-2xl font-bold text-rose-600">Tara</span>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Welcome back! How are you feeling today?
            </h1>
            <p className="text-sm text-gray-600">
              Your mood helps us personalize your experience
            </p>
          </div>

          {/* Mood Selection Grid */}
          <div className="grid grid-cols-5 gap-3 mb-6">
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

          {/* Continue Button and Benefits */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4 text-xs text-gray-500">
              <div className="flex items-center gap-1">
                <FontAwesomeIcon icon={faHeart} className="h-3 w-3 text-rose-500" />
                <span>Personalized AI</span>
              </div>
              <div className="flex items-center gap-1">
                <FontAwesomeIcon icon={faBrain} className="h-3 w-3 text-rose-500" />
                <span>Smart Insights</span>
              </div>
              <div className="flex items-center gap-1">
                <FontAwesomeIcon icon={faStar} className="h-3 w-3 text-rose-500" />
                <span>Daily Growth</span>
              </div>
            </div>

            <button
              onClick={saveMood}
              disabled={!selected || saving}
              className="group inline-flex items-center gap-2 rounded-full bg-rose-200 px-6 py-3 text-sm font-semibold text-rose-700 shadow-sm hover:bg-rose-300 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {saving ? (
                <>
                  <div className="h-3 w-3 animate-spin rounded-full border-2 border-rose-700 border-t-transparent"></div>
                  Saving...
                </>
              ) : (
                <>
                  Continue
                  <FontAwesomeIcon icon={faArrowRight} className="h-3 w-3 transition-transform group-hover:translate-x-1" />
                </>
              )}
            </button>
          </div>

          {/* Selected mood feedback */}
          {selected && (
            <div className="mt-4 text-center">
              <p className="text-xs text-gray-500 animate-fade-in">
                Perfect! We'll customize your experience based on your {MOODS.find(m => m.key === selected)?.label.toLowerCase()} mood.
              </p>
            </div>
          )}
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

        /* Balloon falling animations */
        @keyframes balloon-fall {
          0% { transform: translateY(-50px) rotate(0deg); opacity: 0; }
          10% { opacity: 1; }
          100% { transform: translateY(100vh) rotate(360deg); opacity: 0; }
        }

        .animate-balloon-fall-1 {
          animation: balloon-fall 4s linear;
        }

        .animate-balloon-fall-2 {
          animation: balloon-fall 4.5s linear;
        }

        .animate-balloon-fall-3 {
          animation: balloon-fall 3.5s linear;
        }

        .animate-balloon-fall-4 {
          animation: balloon-fall 5s linear;
        }
      `}</style>
    </div>
  );
}