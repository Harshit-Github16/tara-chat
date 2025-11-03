import { NextResponse } from "next/server";

export async function POST(req) {
  const body = await req.json().catch(() => ({}));
  const provider = body?.provider || "credentials";

  // Temporary: allow demo credentials until DB is wired
  if (provider === "credentials") {
    const { email, password } = body || {};
    if (email === "harshit@gmail.com" && password === "Harshit123") {
      const res = NextResponse.json({ ok: true, provider });
      res.cookies.set("session", "mock-session", {
        httpOnly: true,
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 7,
        path: "/",
      });
      return res;
    }
    return NextResponse.json({ ok: false, error: "Invalid credentials" }, { status: 401 });
  }

  // For Google button in demo, just set session
  const res = NextResponse.json({ ok: true, provider });
  res.cookies.set("session", "mock-session", {
    httpOnly: true,
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7,
    path: "/",
  });
  return res;
}


