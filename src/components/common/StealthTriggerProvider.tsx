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

        if (stealth?.sosPass && buffer.endsWith(stealth.sosPass)) {
            triggerSOS(); 
            pinBuffer.current = ""; 
            return; 
        }

        else if (stealth?.dashboardPass && buffer.endsWith(stealth.dashboardPass)) {
            const isDashboard = window.location.pathname.startsWith("/dashboard");

            if (isDashboard) {
                fetch("/api/stealth/lock", { method: "POST" })
                    .finally(() => {
                         const target = stealth.stealthType || "calculator";
                         window.location.replace(`/stealth/${target}`);
                    });
            } else {
                  fetch("/api/stealth/unlock", { 
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ pin: stealth.dashboardPass }) 
                })
                    .then(async (res) => {
                        if (res.ok) {
                            
                             window.location.href = "/dashboard"; 
                        } else if (res.status === 401) {
                             console.error("Unlock failed auth check");
                        }
                    })
                    .catch((err) => console.error("Unlock failed", err));
            }
            
            pinBuffer.current = ""; 
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
