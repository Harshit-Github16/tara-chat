"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFaceSmile,
  faHeart,
  faLeaf,
  faBolt,
  faCloudRain,
  faFaceFrown,
  faSun,
  faStar,
  faBrain,
} from "@fortawesome/free-solid-svg-icons";

const MOODS = [
  { key: "joyful", label: "Joyful", icon: faFaceSmile, color: "bg-yellow-100 text-yellow-700 border-yellow-200" },
  { key: "grateful", label: "Grateful", icon: faHeart, color: "bg-rose-100 text-rose-700 border-rose-200" },
  { key: "calm", label: "Calm", icon: faLeaf, color: "bg-emerald-100 text-emerald-700 border-emerald-200" },
  { key: "energized", label: "Energized", icon: faBolt, color: "bg-amber-100 text-amber-700 border-amber-200" },
  { key: "rainy", label: "Rainy", icon: faCloudRain, color: "bg-sky-100 text-sky-700 border-sky-200" },
  { key: "down", label: "Down", icon: faFaceFrown, color: "bg-slate-100 text-slate-700 border-slate-200" },
  { key: "bright", label: "Bright", icon: faSun, color: "bg-orange-100 text-orange-700 border-orange-200" },
  { key: "inspired", label: "Inspired", icon: faStar, color: "bg-indigo-100 text-indigo-700 border-indigo-200" },
  { key: "focused", label: "Focused", icon: faBrain, color: "bg-purple-100 text-purple-700 border-purple-200" },
  { key: "hopeful", label: "Hopeful", icon: faStar, color: "bg-fuchsia-100 text-fuchsia-700 border-fuchsia-200" },
];

export default function WelcomePage() {
  const [selected, setSelected] = useState(null);
  const [saving, setSaving] = useState(false);
  const router = useRouter();

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
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-pink-100 via-white to-pink-200">
      {/* Decorative gradients */}
      <div className="pointer-events-none absolute -left-32 -top-32 h-96 w-96 rounded-full bg-pink-300/30 blur-3xl" />
      <div className="pointer-events-none absolute -right-24 -bottom-24 h-80 w-80 rounded-full bg-pink-300/30 blur-3xl" />
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-pink-300/20 blur-3xl" />

      <div className="relative z-10 mx-auto max-w-5xl px-6 py-16">
        <div className="mx-auto max-w-3xl rounded-3xl border border-white/60 bg-white/70 p-8 shadow-xl backdrop-blur">
          <h1 className="bg-gradient-to-r from-pink-600 to-pink-600 bg-clip-text text-center text-4xl font-extrabold text-transparent">
            Welcome back to Tara ✨
          </h1>
          <p className="mt-2 text-center text-base text-gray-600">
            Check in with your mood to personalize your chat and journaling experience today.
          </p>

          <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-5">
            {MOODS.map((m) => (
              <button
                key={m.key}
                onClick={() => setSelected(m.key)}
                className={`group rounded-2xl border px-4 py-4 text-sm font-semibold transition ${selected === m.key
                  ? `ring-2 ring-pink-500 ${m.color}`
                  : `bg-white/80 text-gray-700 border-pink-100 hover:bg-white ${m.color}`
                  }`}
              >
                <span className="flex flex-col items-center gap-2">
                  <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-white/70 text-current shadow">
                    <FontAwesomeIcon icon={m.icon} />
                  </span>
                  {m.label}
                </span>
              </button>
            ))}
          </div>

          <div className="mt-8 flex items-center justify-center gap-3">
            <button
              onClick={saveMood}
              disabled={!selected || saving}
              className="rounded-full bg-pink-500 px-6 py-3 text-sm font-bold text-white shadow hover:bg-pink-600 disabled:opacity-60"
            >
              {saving ? "Saving..." : "Continue"}
            </button>
            <span className="text-xs text-gray-500">
              Your selection helps tailor prompts and character suggestions.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}


