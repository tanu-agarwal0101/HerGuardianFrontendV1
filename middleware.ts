// // middleware.ts
// import { NextRequest, NextResponse } from 'next/server'

// export function middleware(request: NextRequest) {
//   const user = request.cookies.get('auth_token')?.value; // or whatever your auth uses
//   const stealth = request.cookies.get('stealth_mode'); // or fetch from user DB if needed

//   const url = request.nextUrl.clone();

//   if (user && stealth === 'true' && url.pathname === '/') {
//     url.pathname = '/stealth'; // redirect to camouflage
//     return NextResponse.redirect(url);
//   }

//   return NextResponse.next();
// }

// src/middleware.ts
// import { NextRequest, NextResponse } from "next/server";

// export function middleware(request: NextRequest) {
//   console.log("🍪 Middleware running...");

//   const stealthMode = request.cookies.get("stealthMode")?.value;
//   const stealthType = request.cookies.get("stealthType")?.value || "calculator";

//   console.log("🕵️ Stealth mode:", stealthMode);
//   console.log("📓 Stealth type:", stealthType);

//   if (stealthMode === "true" && request.nextUrl.pathname === "/") {
//     console.log("➡️ Redirecting to stealth UI");
//     return NextResponse.redirect(
//       new URL(`/stealth/${stealthType}`, request.url)
//     );
//   }

//   return NextResponse.next();
// }

// // Apply middleware only to root route or specific pages
// export const config = {
//   matcher: ["/", "/stealth"],
// };

// src/middleware.ts
import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  const stealthMode = request.cookies.get("stealthMode")?.value;
  const stealthType = request.cookies.get("stealthType")?.value || "calculator";
  const stealthSession = request.cookies.get("stealthSession")?.value;
  
  // Backend sets tokens as httpOnly cookies: accessToken and refreshToken
  const token =
    request.cookies.get("accessToken")?.value ||
    request.cookies.get("refreshToken")?.value;
  const rememberMe = request.cookies.get("rememberMe")?.value === "true";
  const url = request.nextUrl.clone();

  // 1. STEALTH ENFORCEMENT (Highest Priority)
  console.log(`[Middleware] Path: ${url.pathname}`);
  console.log(`[Middleware] StealthMode Cookie: '${stealthMode}' (type: ${typeof stealthMode})`);
  console.log(`[Middleware] StealthSession Cookie: '${stealthSession}'`);
  console.log(`[Middleware] RememberMe: ${rememberMe}`);

  // Scenario 1: Config is ON, RememberMe is ON, but Session is OFF.
  // Result: Redirect to Stealth App (Calculator).
  if (stealthMode === "true" && rememberMe && !stealthSession) {
      // Don't loop if already there
      if (!url.pathname.startsWith("/stealth") && !url.pathname.startsWith("/api")) {
          url.pathname = `/stealth/${stealthType}`;
          return NextResponse.redirect(url);
      }
  }

  // Scenario 2: Config is ON, RememberMe is ON, Session is ON.
  // Result: Allow Dashboard (Do nothing special).
  
  // Scenario 3: Stealth Path Protection
  // If trying to access /stealth, check if we SHOULD be there.
  if (url.pathname.startsWith("/stealth")) {
      // If stealth is NOT enabled config-wise, get out.
      if (stealthMode !== "true" || !rememberMe) {
          url.pathname = "/dashboard";
          return NextResponse.redirect(url);
      }
      // Otherwise allow.
  }

  // 4. AUTH REDIRECTS (Standard)
  // If no session, redirect to landing (except for landing itself)
  if (!token && url.pathname !== "/") {
    url.pathname = "/";
    return NextResponse.redirect(url);
  }

  // If already logged in, avoid showing auth pages
  if (
    token &&
    (url.pathname === "/login" || url.pathname === "/registration")
  ) {
    url.pathname = "/dashboard";
    return NextResponse.redirect(url);
  }
  
  // 5. Root Redirect
  if (url.pathname === "/" && token) {
      // If we got here, stealth logic passed (either off or session active)
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
