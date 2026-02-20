"use client";
import { useEffect } from "react";
import { useUserStore } from "@/store/userStore";

export default function StoreHydrator() {
  useEffect(() => {
    // Ensure we mark hydration as done even if persist middleware misses it
    useUserStore.setState({ _hasHydrated: true });
    useUserStore.getState().hydrateUser?.();
  }, []);
  return null;
}
