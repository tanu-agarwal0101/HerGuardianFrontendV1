
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { pin } = await request.json();
    const token = request.cookies.get("accessToken")?.value;
    
    // Validate against backend
    const apiBase = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
    
    // This is technically insecure if the pin is plain text.
    // Ideally we verify hash on backend.
    // But current backend returns plain text dashboardPass in getStealth (as corrected earlier).
    // So we fetch settings and compare here.
    
    const res = await fetch(`${apiBase}/users/verify-stealth-pin`, {
        method: "POST",
        headers: { 
            "Content-Type": "application/json",
            Cookie: `accessToken=${token}` 
        },
        body: JSON.stringify({ pin })
    });

    if (!res.ok) {
        return NextResponse.json({ success: false, message: "Unauthorized or Invalid PIN" }, { status: 401 });
    }

    const data = await res.json();

    if (data.success) {
        const response = NextResponse.json({ success: true, type: data.type });
        if (data.type === 'dashboard') {
            response.cookies.set("stealthSession", "active", {
                path: "/",
                sameSite: "lax",
                httpOnly: false,
                secure: process.env.NODE_ENV === "production",
            });
        }
        return response;
    } else {
        return NextResponse.json({ success: false, message: "Invalid PIN" }, { status: 401 });
    }
  } catch (error) {
    console.error("Unlock error", error);
    return NextResponse.json({ success: false, message: "Error" }, { status: 500 });
  }
}
