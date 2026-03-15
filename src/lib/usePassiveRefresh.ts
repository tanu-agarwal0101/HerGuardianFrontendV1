import { useEffect, useRef, useCallback } from "react";
import axios from "axios";
import axiosInstance, { getAccessTokenMeta } from "./axiosInstance";

/**
 * usePassiveRefresh
 * Sets a timer to refresh the access token shortly before expiry.
 * Relies on cookies for actual token storage; access token body may not be returned on login.
 * Schedules a refresh 60s before expiry, or at 90% of remaining time if window is shorter.
 */
export function usePassiveRefresh(enabled: boolean) {
  const timerRef = useRef<number | null>(null);

  const clearTimer = () => {
    if (timerRef.current) {
      window.clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  };

  const schedule = useCallback(() => {
    clearTimer();
    if (!enabled) return;
    const { expiresAt } = getAccessTokenMeta();
    if (!expiresAt) return;
    const now = Date.now();
    const remaining = expiresAt - now;
    if (remaining <= 0) return;
    const lead = Math.min(remaining - 60_000, remaining * 0.9); // 60s or 90% fallback
    const delay = lead > 0 ? lead : Math.max(remaining - 5_000, 5_000);
    timerRef.current = window.setTimeout(async () => {
      try {
        const baseURL = axiosInstance.defaults.baseURL;
        await axios.post(`${baseURL}/users/refresh-token`, {}, { withCredentials: true });
      } catch {
        // Ignore; 401 will cascade normal logout or retry via interceptor
      } finally {
        schedule(); // reschedule next cycle
      }
    }, delay);
  }, [enabled]);

  useEffect(() => {
    schedule();
    return () => clearTimer();
  }, [schedule]);

  // Refresh visibility: on returning to tab, if <30s left force immediate refresh
  useEffect(() => {
    const onVisibility = () => {
      if (document.visibilityState === "visible") {
        const { expiresAt } = getAccessTokenMeta();
        if (!expiresAt) return;
        const remaining = expiresAt - Date.now();
        if (remaining < 30_000 && remaining > 0) {
          const baseURL = axiosInstance.defaults.baseURL;
          axios.post(`${baseURL}/users/refresh-token`, {}, { withCredentials: true }).finally(schedule);
        }
      }
    };
    document.addEventListener("visibilitychange", onVisibility);
    return () => document.removeEventListener("visibilitychange", onVisibility);
  }, [schedule]);
}
