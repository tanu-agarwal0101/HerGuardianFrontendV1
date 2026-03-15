"use client";
import { useEffect } from "react";
import { useUserStore } from "@/store/userStore";
import { handleUnauthorizedSideEffects } from "@/lib/httpErrors";
import { clearTokenCache } from "@/lib/axiosInstance";

export default function StoreHydrator() {
  useEffect(() => {
    useUserStore.setState({ _hasHydrated: true });
    useUserStore.getState().hydrateUser?.();
    let bc: BroadcastChannel | null = null;
    try {
      bc = new BroadcastChannel("auth");
      bc.onmessage = (event) => {
        if (event.data?.type === "logout") {
          clearTokenCache();
          useUserStore.getState().logout?.();
          handleUnauthorizedSideEffects();
        }
      };
    } catch {
      // BroadcastChannel not supported — skip multi-tab sync
    }

    return () => {
      bc?.close();
    };
  }, []);
  return null;
}
