import { NextResponse } from "next/server";

export async function POST(req) {
  const { mood } = await req.json().catch(() => ({}));
  const res = NextResponse.json({ ok: true, mood });
  // Save mood for the session as a cookie for demo purposes
  res.cookies.set("mood", mood || "", { path: "/", maxAge: 60 * 60 * 24 * 7 });
  return res;
}


