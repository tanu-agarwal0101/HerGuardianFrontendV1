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
  console.log("Push: enableNotifications called");
  if (typeof window === "undefined") return;
  
  if (!("serviceWorker" in navigator) || !("PushManager" in window)) {
    console.error("Push: Not supported in browser");
    toast.error("Push notifications are not supported in this browser.");
    return;
  }

  // Ask permission
  console.log("Push: Requesting permission... current:", Notification.permission);
  const permission = await Notification.requestPermission();
  console.log("Push: Permission result:", permission);

  if (permission !== "granted") {
    toast.error("Notification permission denied.");
    return;
  }
  toast.success("Notifications enabled.");

  // Ensure SW registered
  let registration = await navigator.serviceWorker.getRegistration("/notifications-sw.js");
  
  if (!registration) {
    console.log("Push: Registering notifications-sw.js...");
    // Unregister other workers to avoid conflicts (like the broken sw.js)
    const registrations = await navigator.serviceWorker.getRegistrations();
    for (const r of registrations) {
      if (!r.active?.scriptURL.includes("notifications-sw.js")) {
        console.log("Push: Unregistering old/conflicting worker:", r.active?.scriptURL);
        await r.unregister();
      }
    }
    registration = await navigator.serviceWorker.register("/notifications-sw.js", { scope: "/" });
  }
  
  // Wait for it to be active
  if (!registration.active) {
    console.log("Push: Waiting for service worker to be active...");
    await new Promise<void>((resolve) => {
      const worker = registration!.installing || registration!.waiting;
      if (!worker) return resolve();
      worker.addEventListener("statechange", (e) => {
        if ((e.target as ServiceWorker).state === "activated") resolve();
      });
      setTimeout(resolve, 5000); // safety timeout
    });
  }

  console.log("Push: Service worker active:", registration.active?.state);

  // Fetch VAPID public key
  let vapidPublicKey: string | undefined;
  try {
    console.log("Push: Fetching VAPID key...");
    const res = await axiosInstance.get("/api/notifications/vapid-public");
    vapidPublicKey = res.data?.publicKey;
    console.log("Push: VAPID key received:", vapidPublicKey ? "Yes (length: " + vapidPublicKey.length + ")" : "No");
  } catch (err) {
    console.error("Push: VAPID fetch failed", err);
  }

  if (!vapidPublicKey) {
    toast.error("Could not initialize push notifications (missing key).");
    return;
  }

  // Subscribe for push
  let sub: PushSubscription | undefined;
  try {
    console.log("Push: Checking for existing subscription...");
    const existingSub = await registration.pushManager.getSubscription();
    if (existingSub) {
      console.log("Push: Removing existing subscription to avoid key conflict...");
      await existingSub.unsubscribe();
    }

    console.log("Push: Subscribing with key...");
    sub = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(vapidPublicKey),
    });
    console.log("Push: Subscription successful:", sub.endpoint);
  } catch (err) {
    console.error("Push: Subscription failed", err);
    if (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1") {
      toast.info("Push notifications require HTTPS — they'll work once deployed.");
    } else {
      toast.error("Failed to register device for push alerts.");
    }
    return;
  }

  // Send subscription to backend
  if (!sub) return;

  try {
    await axiosInstance.post("/api/notifications/subscribe", sub);
    toast.success("Device subscribed for push alerts.");
  } catch (error) {
    console.error("Push subscription error:", error);
    // fall back silently; user already granted permission
  }
}


