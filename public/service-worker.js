import { precacheAndRoute } from "workbox-precaching";
import { registerRoute } from "workbox-routing";
import {
  NetworkFirst,
  CacheFirst,
  StaleWhileRevalidate,
} from "workbox-strategies";

// // Precache files injected by Workbox
precacheAndRoute(self.__WB_MANIFEST || []);

// // Custom Push Notification Handler
// self.addEventListener("push", (event) => {
//   const data = event.data?.json() || {};
//   const title = data.title || "HerGuardian Alert";
//   const options = {
//     body: data.body || "You've received an emergency SOS.",
//     icon: "/icon-192.png",
//     badge: "/icon-192.png",
//   };

//   event.waitUntil(self.registration.showNotification(title, options));
// });

// // Automatically activate the service worker without waiting for it to be controlled
self.addEventListener("install", (event) => {
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(self.clients.claim());
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
