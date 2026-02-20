import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const rememberMe = request.cookies.get("rememberMe")?.value === "true";

  if (!rememberMe) {
    return NextResponse.json(
      { success: false, message: "Stealth mode requires 'Remember Me' to be enabled." },
      { status: 403 }
    );
  }

  const response = NextResponse.json({ success: true });
  
  // Clear the SESSION cookie
  response.cookies.delete("stealthSession");
  // Redundant explicit set to ensure it dies
  response.cookies.set("stealthSession", "", {
      path: "/",
      maxAge: 0,
      expires: new Date(0),
      httpOnly: false
  });

  // We do NOT clear stealthMode here because that's the persistent config.

  return response;
}
