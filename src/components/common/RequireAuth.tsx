"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useUserStore } from "@/store/userStore";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default function RequireAuth({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const user = useUserStore((s) => s.user);
  const loadingUser = useUserStore((s) => s.loadingUser);
  const authError = useUserStore((s) => s.authError as string | null);



  const _hasHydrated = useUserStore((s) => s._hasHydrated);

  useEffect(() => {
    // Wait until hydration finishes; if there's no user, act based on authError
    if (!_hasHydrated || loadingUser) return;
    if (!user) {
      // If we have a transient server error, don't immediately redirect — let UI show message
      if (authError && authError.toLowerCase().includes("server")) {
        // show toast once
        toast.error(authError);
        return;
      }
      // otherwise assume unauthenticated and redirect
      toast.error(authError || "Please sign in to continue.");
      router.replace("/");
    }
    // STEALTH CHECK: TEMPORARILY DISABLED (feature paused)
    // Preserved for when stealth is re-enabled. Remove `false &&` to restore.
    if (false && user) {
        const stealth = useUserStore.getState().stealth;
        const isStealthEnabled = stealth.stealthMode || !!user?.stealthMode;

        if (isStealthEnabled) {
             const hasSession = /(?:^|; )stealthSession=([^;]*)/.test(document.cookie);
             if (!hasSession) {
                  const target = stealth.stealthType || user?.stealthType || "calculator";
                  router.replace(`/stealth/${target}`);
                  return;
             }
        }
    }

    // if user exists, render children
    
    // Add pageshow listener for BFCache (restore from history)
    // STEALTH BFCache CHECK: TEMPORARILY DISABLED (feature paused)
    // Preserved for when stealth is re-enabled. Remove `false &&` to restore.
    const onPageShow = (event: PageTransitionEvent) => {
        if (false && event.persisted) {
             const stealth = useUserStore.getState().stealth;
             const isStealthEnabled = stealth.stealthMode || !!user?.stealthMode;
             if (isStealthEnabled) {
                  const hasSession = /(?:^|; )stealthSession=([^;]*)/.test(document.cookie);
                  if (!hasSession) {
                      const target = stealth.stealthType || user?.stealthType || "calculator";
                      router.replace(`/stealth/${target}`);
                  }
             }
        }
    };
    window.addEventListener("pageshow", onPageShow);
    return () => window.removeEventListener("pageshow", onPageShow);

  }, [loadingUser, user, authError, router, _hasHydrated]);

  // While loading AND no user, show loading UI
  // If we have a user (e.g. from login or cache), show the app while revalidating in background
  if ((!_hasHydrated || loadingUser) && !user) {
      return (
           <div className="flex items-center justify-center min-h-screen">
               <div className="text-center">
                   <h2 className="text-xl font-semibold mb-2">Loading...</h2>
               </div>
           </div>
      );
  }

  // If hydration completed but server error prevented login, show friendly message + retry
  if (!user && authError) {
    return (
      <div className="mx-auto max-w-3xl p-6">
        <Card className="p-4">
          <h3 className="text-lg font-semibold mb-2">Authentication Error</h3>
          <p className="text-sm text-gray-600 mb-4">{authError}</p>
          <div className="flex gap-2">
            <Button
              onClick={() => {
                // retry hydration
                useUserStore.getState().hydrateUser?.();
              }}
            >
              Retry
            </Button>
            <Button
              variant="secondary"
              onClick={() => {
                // take user to landing so they can login again
                router.replace("/");
              }}
            >
              Sign In
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  if (!user) {
       // We let the useEffect handle the redirect, but render a fallback to avoid white screen
       return (
           <div className="flex items-center justify-center min-h-screen">
               <div className="text-center">
                   <h2 className="text-xl font-semibold mb-2">Redirecting...</h2>
               </div>
           </div>
       );
  }
  return <>{children}</>;
}
