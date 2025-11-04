"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGoogle } from "@fortawesome/free-brands-svg-icons";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const checkUserStatus = () => {
    // Check if user has completed onboarding
    const userProfile = localStorage.getItem('userProfile');
    const isNewUser = localStorage.getItem('isNewUser');

    if (!userProfile || isNewUser === 'true') {
      // New user - redirect to onboarding
      router.replace("/onboarding");
    } else {
      // Existing user - redirect to welcome
      router.replace("/welcome");
    }
  };

  async function handleLogin(e) {
    e.preventDefault();
    setLoading(true);
    try {
      await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ provider: "credentials", email, password }),
      });

      // Simulate new user check (in real app, this would come from API)
      // For demo, we'll mark as new user if no profile exists
      const existingProfile = localStorage.getItem('userProfile');
      if (!existingProfile) {
        localStorage.setItem('isNewUser', 'true');
      }

      checkUserStatus();
    } finally {
      setLoading(false);
    }
  }

  async function handleGoogle() {
    setLoading(true);
    try {
      await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ provider: "google" }),
      });

      // Simulate new user check (in real app, this would come from API)
      // For demo, we'll mark as new user if no profile exists
      const existingProfile = localStorage.getItem('userProfile');
      if (!existingProfile) {
        localStorage.setItem('isNewUser', 'true');
      }

      checkUserStatus();
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-rose-50 to-white px-6 py-16">
      <div className="w-full max-w-md rounded-2xl border border-rose-100 bg-white p-8 shadow-sm">
        <h1 className="text-center text-2xl font-bold text-gray-900">Welcome back</h1>
        <p className="mt-1 text-center text-sm text-gray-600">
          Log in to continue your journey
        </p>

        <button
          onClick={handleGoogle}
          className="mt-6 flex w-full items-center justify-center gap-2 rounded-full border border-rose-200 px-5 py-3 text-sm font-medium text-rose-600 hover:bg-rose-200"
          disabled={loading}
        >
          <FontAwesomeIcon icon={faGoogle} className="h-4 w-4" />
          Continue with Google
        </button>

        <div className="my-6 flex items-center gap-4 text-xs text-gray-500">
          <div className="h-px flex-1 bg-rose-100" /> OR <div className="h-px flex-1 bg-rose-100" />
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 w-full rounded-xl border border-red-200 px-4 py-2 outline-none ring-red-100 focus:ring"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 w-full rounded-xl border border-red-200 px-4 py-2 outline-none ring-red-100 focus:ring"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full rounded-full bg-red-500 px-5 py-3 text-sm font-semibold text-white hover:bg-red-600"
            disabled={loading}
          >
            {loading ? "Logging in..." : "Log in"}
          </button>
        </form>
      </div>
    </div>
  );
}


