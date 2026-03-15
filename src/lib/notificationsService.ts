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
    console.error("Push: Not supported in browser");
    toast.error("Push notifications are not supported in this browser.");
    return;
  }

  const permission = await Notification.requestPermission();

  if (permission !== "granted") {
    toast.error("Notification permission denied.");
    return;
  }
  toast.success("Notifications enabled.");

  let registration = await navigator.serviceWorker.getRegistration("/notifications-sw.js");
  
  if (!registration) {
    const registrations = await navigator.serviceWorker.getRegistrations();
    for (const r of registrations) {
      if (!r.active?.scriptURL.includes("notifications-sw.js")) {
        await r.unregister();
      }
    }
    registration = await navigator.serviceWorker.register("/notifications-sw.js", { scope: "/" });
  }

  if (!registration.active) {
    await new Promise<void>((resolve) => {
      const worker = registration!.installing || registration!.waiting;
      if (!worker) return resolve();
      worker.addEventListener("statechange", (e) => {
        if ((e.target as ServiceWorker).state === "activated") resolve();
      });
      setTimeout(resolve, 5000); 
    });
  }

  let vapidPublicKey: string | undefined;
  try {
    const res = await axiosInstance.get("/api/notifications/vapid-public");
    vapidPublicKey = res.data?.publicKey;
  } catch (err) {
    console.error("Push: VAPID fetch failed", err);
  }

  if (!vapidPublicKey) {
    toast.error("Could not initialize push notifications (missing key).");
    return;
  }

  let sub: PushSubscription | undefined;
  try {
    const existingSub = await registration.pushManager.getSubscription();
    if (existingSub) {
      await existingSub.unsubscribe();
    }

    sub = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(vapidPublicKey),
    });
  } catch (err) {
    console.error("Push: Subscription failed", err);
    if (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1") {
      toast.info("Push notifications require HTTPS — they'll work once deployed.");
    } else {
      toast.error("Failed to register device for push alerts.");
    }
    return;
  }

  if (!sub) return;

  try {
    await axiosInstance.post("/api/notifications/subscribe", sub);
    toast.success("Device subscribed for push alerts.");
  } catch (error) {
    console.error("Push subscription error:", error);
  }
}


