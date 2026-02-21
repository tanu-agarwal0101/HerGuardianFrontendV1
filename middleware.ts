import { NextRequest, NextResponse } from "next/server";

// ============================================================
// STEALTH MODE: TEMPORARILY DISABLED
// The stealth redirect logic is preserved below but bypassed.
// Remove the early-return on line ~17 to re-enable stealth.
// ============================================================

export function middleware(request: NextRequest) {
  const token =
    request.cookies.get("accessToken")?.value ||
    request.cookies.get("refreshToken")?.value;
  const url = request.nextUrl.clone();

  // --- STEALTH LOGIC (PAUSED — re-enable by removing this section) ---
  // All stealth redirect logic is intentionally skipped.
  // The code below only handles standard auth redirects.
  // When ready to revisit, restore the stealth checks from git history
  // or uncomment the block at the bottom of this file.
  // -------------------------------------------------------------------

  // AUTH REDIRECTS
  // No token → redirect to landing (except landing itself and auth pages)
  if (
    !token &&
    url.pathname !== "/" &&
    url.pathname !== "/login" &&
    url.pathname !== "/registration"
  ) {
    url.pathname = "/";
    return NextResponse.redirect(url);
  }

  // If logged in, don't show auth pages
  if (
    token &&
    (url.pathname === "/login" || url.pathname === "/registration")
  ) {
    url.pathname = "/dashboard";
    return NextResponse.redirect(url);
  }

  // ROOT REDIRECT — logged-in user at "/" → dashboard
  if (url.pathname === "/" && token) {
    url.pathname = "/dashboard";
    return NextResponse.redirect(url);
  }

  // Stealth pages → redirect to dashboard (feature paused)
  if (url.pathname.startsWith("/stealth")) {
    url.pathname = "/dashboard";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/",
    "/dashboard",
    "/stealth/:path*",
    "/login",
    "/registration",
    "/profile",
  ],
};

// ============================================================
// PRESERVED STEALTH LOGIC — DO NOT DELETE
// Uncomment and remove the early stealth bypass above to restore.
// ============================================================
//
// const stealthMode = request.cookies.get("stealthMode")?.value;
// const stealthType = request.cookies.get("stealthType")?.value || "calculator";
// const stealthSession = request.cookies.get("stealthSession")?.value;
// const justLoggedIn = request.cookies.get("justLoggedIn")?.value;
// const rememberMe = request.cookies.get("rememberMe")?.value === "true";
//
// // FRESH LOGIN BYPASS
// if (justLoggedIn && token) {
//   if (url.pathname === "/" || url.pathname.startsWith("/stealth")) {
//     url.pathname = "/dashboard";
//     return NextResponse.redirect(url);
//   }
//   return NextResponse.next();
// }
//
// // STEALTH ENFORCEMENT — Only on ROOT "/"
// if (url.pathname === "/" && token && stealthMode === "true" && rememberMe && !stealthSession) {
//   return NextResponse.redirect(new URL(`/stealth/${stealthType}`, request.url));
// }
//
// // STEALTH PATH PROTECTION
// if (url.pathname.startsWith("/stealth")) {
//   if (stealthMode !== "true" || !rememberMe) {
//     url.pathname = "/dashboard";
//     return NextResponse.redirect(url);
//   }
// }
