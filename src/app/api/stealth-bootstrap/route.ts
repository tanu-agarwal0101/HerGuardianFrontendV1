import { NextRequest, NextResponse } from "next/server";

// This route restores stealth cookies from the backend user settings
// Then redirects to stealth UI (if enabled) or dashboard.
export async function GET(request: NextRequest) {
  const apiBase =
    process.env.NEXT_PUBLIC_API_URL ||
    process.env.PUBLIC_API_URL ||
    "http://localhost:5000";

  // Forward cookies to backend to authenticate the call
  const cookieHeader = request.headers.get("cookie") || "";
  let stealthMode = false;
  let stealthType: string | null = null;

  try {
    const res = await fetch(`${apiBase}/users/stealth-settings`, {
      method: "GET",
      headers: {
        cookie: cookieHeader,
      },
      credentials: "include",
      cache: "no-store",
    });

    if (res.ok) {
      const data = await res.json();
      stealthMode = !!data?.stealth?.stealthMode;
      stealthType = data?.stealth?.stealthType || "calculator";
    }
  } catch (e) {
    // ignore network errors; we'll fall back to dashboard redirect
  }

  const response = NextResponse.redirect(
    new URL(stealthMode ? `/stealth/${stealthType}` : "/dashboard", request.url)
  );

  // Rehydrate cookies for middleware-based redirects next time
  response.cookies.set("stealthMode", stealthMode ? "true" : "false", {
    path: "/",
    sameSite: "lax",
    httpOnly: false,
    secure: process.env.NODE_ENV === "production",
    maxAge: 30 * 24 * 60 * 60,
  });
  response.cookies.set("stealthType", stealthType || "calculator", {
    path: "/",
    sameSite: "lax",
    httpOnly: false,
    secure: process.env.NODE_ENV === "production",
    maxAge: 30 * 24 * 60 * 60,
  });

  return response;
}
