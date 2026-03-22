"use client";
declare global {
  interface Window {
    __stealth_kw_buffer?: string;
  }
}
import { useEffect, useRef } from "react";
import { useUserStore } from "@/store/userStore";
import { triggerSOS } from "@/lib/sosTrigger";
import { useRouter } from "next/navigation";

export function StealthTriggerProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const stealth = useUserStore((s) => s.stealth);
  const setStealth = useUserStore((s) => s.setStealth);
  const pinBuffer = useRef("");
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  
  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }

      const key = typeof e.key === "string" ? e.key : "";
      

      if (stealth?.dashboardPass) {
          if (key.length === 1) {
             pinBuffer.current += key;
             if (pinBuffer.current.length > 20) pinBuffer.current = pinBuffer.current.slice(-20);
          }
      }

      timerRef.current = setTimeout(() => {
         checkTriggers();
      }, 500);
    }

    function checkTriggers() {
        const buffer = pinBuffer.current;

        if (stealth?.sosPass && buffer.endsWith(stealth.sosPass)) {
            triggerSOS(router); 
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
  }, [stealth?.dashboardPass, stealth?.sosPass, stealth?.stealthType, setStealth, router]);
  return <>{children}</>;
}
