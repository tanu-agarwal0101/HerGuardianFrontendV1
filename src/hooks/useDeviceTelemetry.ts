"use client";

import { useEffect, useRef, useCallback } from "react";
import { updateDeviceStatus } from "@/lib/api/users";

export function useDeviceTelemetry() {
  const lastSyncRef = useRef<number>(0);
  const SYNC_INTERVAL = 5 * 60 * 1000;

  const syncStatus = useCallback(async () => {
    if (Date.now() - lastSyncRef.current < SYNC_INTERVAL) return;

    try {
      let batteryData: { level?: number; charging?: boolean } = {};

      if ("getBattery" in navigator) {
        // @ts-expect-error - Battery API types are missing in some environments
        const battery = await navigator.getBattery();
        batteryData = {
          level: battery.level * 100,
          charging: battery.charging,
        };
      }

      const connection = 
        // @ts-expect-error - Network Information API types are missing in some environments
        navigator.connection || navigator.mozConnection || navigator.webkitConnection;
      const connectionType = connection?.effectiveType || (navigator.onLine ? "Online" : "Offline");

      await updateDeviceStatus({
        batteryLevel: batteryData.level,
        isCharging: batteryData.charging,
        isOnline: navigator.onLine,
        connectionType: connectionType,
      });

      lastSyncRef.current = Date.now();
      console.log("[Telemetry] Device status synced successfully");
    } catch (err) {
      console.error("[Telemetry] Failed to sync device status", err);
    }
  }, [SYNC_INTERVAL]);

  useEffect(() => {
    syncStatus();

    window.addEventListener("online", syncStatus);
    window.addEventListener("offline", syncStatus);

    const interval = setInterval(syncStatus, 1 * 60 * 1000);

    return () => {
      window.removeEventListener("online", syncStatus);
      window.removeEventListener("offline", syncStatus);
      clearInterval(interval);
    };
  }, [syncStatus]);
}
