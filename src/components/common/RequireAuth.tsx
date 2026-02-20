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
  const authError = useUserStore((s) => (s as any).authError as string | null);



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
    // Stealth Check: If stealth is on, ensure we have a session
    if (user) {
        const stealth = useUserStore.getState().stealth; // Access direct state to avoid hook dep loops if needed
        // We can also use the hook if we simply add it to the component
        // But let's check document.cookie directly for speed
        // Check BOTH store preference AND user profile to be robust against stale state
        const isStealthEnabled = stealth.stealthMode || !!user.stealthMode;
        
        console.log("RequireAuth Debug:", { 
            storeStealth: stealth.stealthMode, 
            userStealth: user.stealthMode, 
            isStealthEnabled 
        });

        if (isStealthEnabled) {
             // Use Regex for robust cookie check
             const hasSession = /(?:^|; )stealthSession=([^;]*)/.test(document.cookie);
             if (!hasSession) {
                 // Locked!
                 const target = stealth.stealthType || user.stealthType || "calculator";
                 router.replace(`/stealth/${target}`);
                 return;
             }
        }
    }

    // if user exists, render children
    
    // Add pageshow listener for BFCache (restore from history)
    const onPageShow = (event: PageTransitionEvent) => {
        if (event.persisted) {
             // Force re-check logic
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

  }, [loadingUser, user, authError, router]);

  // While loading AND no user, show loading UI
  // If we have a user (e.g. from login or cache), show the app while revalidating in background
  if ((!_hasHydrated || loadingUser) && !user) {
      console.log("RequireAuth: Stuck loading:", { _hasHydrated, loadingUser });
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
