"use client";
// Fix for window.__stealth_kw_buffer property
declare global {
  interface Window {
    __stealth_kw_buffer?: string;
  }
}
import { useEffect, useRef } from "react";
import { useUserStore } from "@/store/userStore";
import { triggerSOS } from "@/lib/sosTrigger";

export function StealthTriggerProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  // Listen for PIN, keyword, gesture globally
  const stealth = useUserStore((s) => s.stealth);
  const setStealth = useUserStore((s) => s.setStealth);
  const pinBuffer = useRef("");
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  
  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      // Clear existing timer on any key press
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }

      const key = typeof e.key === "string" ? e.key : "";
      
      // Update buffers
      // Dashboard Pass (Numbers only usually, but let's allow all for flexibility if needed, typically numpad)
      if (stealth?.dashboardPass) {
          // Only add if it's a character we care about (length 1)
          if (key.length === 1) {
             pinBuffer.current += key;
             if (pinBuffer.current.length > 20) pinBuffer.current = pinBuffer.current.slice(-20);
          }
      }

      // Set a debounce timer to check triggers after typing stops (e.g., 800ms)
      // This allows "1234" (Dash) to wait and see if it becomes "12345" (SOS)
      timerRef.current = setTimeout(() => {
         checkTriggers();
      }, 500);
    }

    function checkTriggers() {
        const buffer = pinBuffer.current;
        console.log("Checking triggers for buffer:", buffer);

        // Check SOS First (Higher Priority / usually longer)
        if (stealth?.sosPass && buffer.endsWith(stealth.sosPass)) {
            console.log("SOS Triggered!");
            triggerSOS(); 
            pinBuffer.current = ""; // Clear buffer
            return; 
        }

        // Check Dashboard Pass (Toggle Logic)
        else if (stealth?.dashboardPass && buffer.endsWith(stealth.dashboardPass)) {
            console.log("Dashboard Pass Triggered!");
            
            const isDashboard = window.location.pathname.startsWith("/dashboard");

            if (isDashboard) {
                console.log("Locking Dashboard -> Stealth");
                // Call lock API to clear session cookie
                // Call lock API to clear session cookie
                fetch("/api/stealth/lock", { method: "POST" })
                    .finally(() => {
                         // Redirect to stealth
                         const target = stealth.stealthType || "calculator";
                         window.location.replace(`/stealth/${target}`);
                    });
            } else {
                console.log("Unlocking Stealth -> Dashboard");
                // Unlock the app
                fetch("/api/stealth/unlock", { 
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ pin: stealth.dashboardPass }) 
                })
                    .then(async (res) => {
                        if (res.ok) {
                             // Session is active. Redirect to dashboard.
                             window.location.href = "/dashboard"; 
                        } else if (res.status === 401) {
                             console.error("Unlock failed auth check");
                        }
                    })
                    .catch((err) => console.error("Unlock failed", err));
            }
            
            pinBuffer.current = ""; // Clear buffer
            return;
        }
    }

    window.addEventListener("keydown", onKeyDown);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [stealth?.dashboardPass, stealth?.sosPass, stealth?.stealthType, setStealth]);
  return <>{children}</>;
}
