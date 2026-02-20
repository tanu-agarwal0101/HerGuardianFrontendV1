import axiosInstance from "./axiosInstance";
import { toast } from "sonner";

function urlBase64ToUint8Array(base64String: string) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  const rawData = atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; ++i) outputArray[i] = rawData.charCodeAt(i);
  return outputArray;
}

export async function enableNotifications() {
  if (typeof window === "undefined") return;
  if (!("serviceWorker" in navigator) || !("PushManager" in window)) {
    toast.error("Push notifications are not supported in this browser.");
    return;
  }

  // Ask permission
  const permission = await Notification.requestPermission();
  if (permission !== "granted") {
    toast.error("Notification permission denied.");
    return;
  }
  toast.success("Notifications enabled.");

  // Ensure SW registered (next-pwa handles this in production; this is a safety net)
  const registration = await navigator.serviceWorker.ready;

  // Fetch VAPID public key from backend
  let vapidPublicKey: string | undefined;
  try {
    const res = await axiosInstance.get("/api/notifications/vapid-public");
    vapidPublicKey = res.data?.publicKey;
  } catch {
    // In dev, allow subscription without sending to backend
  }

  // Subscribe for push
  const sub = await registration.pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey: vapidPublicKey ? urlBase64ToUint8Array(vapidPublicKey) : undefined,
  });

  // Send subscription to backend in production only
  if (process.env.NODE_ENV === "production") {
    try {
      await axiosInstance.post("/api/notifications/subscribe", sub);
      toast.success("Device subscribed for push alerts.");
    } catch {
      // fall back silently; user already granted permission
    }
  }
}


