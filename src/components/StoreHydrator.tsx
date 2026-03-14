"use client";
import { useEffect } from "react";
import { useUserStore } from "@/store/userStore";

export default function StoreHydrator() {
  useEffect(() => {
    // Always mark hydration done
    useUserStore.setState({ _hasHydrated: true });
    // ALWAYS verify session with the server on page load.
    // If the stored user's cookies have expired, hydrateUser will call logout()
    // to clear the stale localStorage entry, preventing the ghost-session bug.
    useUserStore.getState().hydrateUser?.();
  }, []);
  return null;
}
