import { toast } from "sonner";
import axiosInstance from "./axiosInstance";

export interface LocationCoords {
  latitude: number;
  longitude: number;
}

export interface LocationLogPayload {
  latitude: number;
  longitude: number;
  timerId?: string;
  event?: "started" | "expired" | "cancelled" | "snapshot";
}

/**
 * Get current location using browser Geolocation API.
 * Handles permissions gracefully with toast notifications.
 */
export async function getCurrentLocation(): Promise<LocationCoords | null> {
  if (typeof window === "undefined" || !navigator.geolocation) {
    toast.error("Geolocation is not supported in this browser.");
    return null;
  }

  return new Promise((resolve) => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          latitude: parseFloat(position.coords.latitude.toFixed(6)),
          longitude: parseFloat(position.coords.longitude.toFixed(6)),
        });
      },
      (error) => {
        let message = "Unable to retrieve location.";
        if (error.code === 1) {
          message = "Location permission denied. Please enable location access.";
        } else if (error.code === 2) {
          message = "Location unavailable. Please try again.";
        } else if (error.code === 3) {
          message = "Location request timed out. Please try again.";
        }
        toast.error(message);
        resolve(null);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000, // Accept cached location up to 1 minute old
      }
    );
  });
}

/**
 * Log location snapshot to backend.
 * Only sends if user is logged in and location is available.
 */
export async function logLocation(payload: LocationLogPayload): Promise<void> {
  try {
    await axiosInstance.post("/api/locations/log", payload);
  } catch (error) {
    // Silently fail; location logging is non-critical
    console.error("Failed to log location:", error);
  }
}

/**
 * Get recent location logs for the authenticated user.
 */
export async function getRecentLocations() {
  try {
    const response = await axiosInstance.get("/api/locations/recent");
    return response.data?.logs || [];
  } catch (error) {
    console.error("Failed to fetch recent locations:", error);
    return [];
  }
}

