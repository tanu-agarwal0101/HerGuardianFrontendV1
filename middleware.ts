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

  console.log("🍪 Middleware running...");
  console.log("🕵️ Stealth mode:", stealthMode);
  console.log("📓 Stealth type:", stealthType);
  console.log("📍 Pathname:", request.nextUrl.pathname);

  if (stealthMode === "true" && request.nextUrl.pathname === "/") {
    const redirectUrl = new URL(`/stealth/${stealthType}`, request.url);
    console.log("➡️ Redirecting to:", redirectUrl.toString());
    return NextResponse.redirect(redirectUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/"], // Only runs on exact "/"
};

