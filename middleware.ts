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
  const token = request.cookies.get("token")?.value;
  const rememberMe = request.cookies.get("rememberMe")?.value === "true";
  const url = request.nextUrl.clone();

  // If no session, redirect to landing (except for landing itself)
  if (!token && url.pathname !== "/") {
    url.pathname = "/";
    return NextResponse.redirect(url);
  }
  // Enforce rememberMe requirement for stealth entry or direct stealth navigation
  if (
    url.pathname.startsWith("/stealth") &&
    (!rememberMe || stealthMode !== "true")
  ) {
    url.pathname = "/dashboard";
    return NextResponse.redirect(url);
  }

  // If stealthMode true & rememberMe, redirect / to /stealth/[type]
  if (stealthMode === "true" && rememberMe && url.pathname === "/") {
    url.pathname = `/stealth/${stealthType}`;
    return NextResponse.redirect(url);
  }
  // If stealthMode false, redirect / to /dashboard
  if (stealthMode !== "true" && url.pathname === "/") {
    url.pathname = "/dashboard";
    return NextResponse.redirect(url);
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/dashboard", "/stealth/:path*", "/"],
};
