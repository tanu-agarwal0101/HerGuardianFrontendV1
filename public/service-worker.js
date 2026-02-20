import { precacheAndRoute } from "workbox-precaching";
import { registerRoute } from "workbox-routing";
import { NetworkFirst, CacheFirst, StaleWhileRevalidate } from "workbox-strategies";

// // Precache files injected by Workbox
precacheAndRoute(self.__WB_MANIFEST || []);

// Push notification placeholder
self.addEventListener("push", (e) => {
  let data = {};
  try {
    data = e.data?.json() || {};
  } catch {}
  const title = data.title || "HerGuardian Alert";
  const options = {
    body: data.body || "You've received a notification.",
    icon: "/android-chrome-192x192.png",
    badge: "/favicon-32x32.png",
    data,
  };
  e.waitUntil(self.registration.showNotification(title, options));
});

// // Automatically activate the service worker without waiting for it to be controlled
self.addEventListener("install", (event) => {
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(self.clients.claim());
});

// Notification click placeholder
self.addEventListener("notificationclick", (e) => {
  e.notification.close();
  const url = e.notification?.data?.url;
  e.waitUntil(
    self.clients.matchAll({ type: "window", includeUncontrolled: true }).then((clientList) => {
      for (const client of clientList) {
        if (client.url && "focus" in client) return client.focus();
      }
      if (url && self.clients.openWindow) return self.clients.openWindow(url);
      if (self.clients.openWindow) return self.clients.openWindow("/");
    })
  );
});

// // Cache static resources (e.g., JS, CSS, HTML)
registerRoute(
  /.*\.(?:js|css|html)$/,
  new StaleWhileRevalidate({
    cacheName: "static-resources",
  })
);

// // Cache images
registerRoute(
  /\.(?:png|jpg|jpeg|svg|gif|webp)$/,
  new CacheFirst({
    cacheName: "images",
  })
);

// // Cache fonts
registerRoute(
  /\.(?:woff2|woff|ttf|eot)$/,
  new CacheFirst({
    cacheName: "fonts",
  })
);

// // Cache JSON and XML data
// registerRoute(
//   /\.(?:json|xml)$/,
//   new CacheFirst({
//     cacheName: "data",
//   }),
// );

// // Cache videos
// registerRoute(
//   /\.(?:mp4|webm|ogg)$/,
//   new CacheFirst({
//     cacheName: "videos",
//   }),
// );

// // Cache text files
// registerRoute(
//   /\.(?:txt|csv)$/,
//   new CacheFirst({
//     cacheName: "text-files",
//   }),
// );
