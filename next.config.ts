import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
};

const withPWA = require("next-pwa")({
  dest: "public",
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === "development",
  swSrc: "public/service-worker.js",
  // runtimeCaching: [
  //   {
  //     urlPattern: /^https:\/\/example\.com\/api\/.*$/,
  //     handler: 'NetworkFirst',
  //     options: {
  //       cacheName: 'api-cache',
  //       expiration: {
  //         maxEntries: 50,
  //         maxAgeSeconds: 60 * 60 * 24, // 1 day
  //       },
  //     },
  //   },
  //   {
  //     urlPattern: /\.(?:png|jpg|jpeg|svg|gif|webp|ico)$/,
  //     handler: 'CacheFirst',
  //     options: {
  //       cacheName: 'image-cache',
  //       expiration: {
  //         maxEntries: 100,
  //         maxAgeSeconds: 60 * 60 * 24 * 7, // 1 week
  //       },
  //     },
  //   },
  //   {
  //     urlPattern: /\.(?:js|css|woff2|woff|ttf|eot)$/,
  //     handler: 'StaleWhileRevalidate',
  //     options: {
  //       cacheName: 'static-resources',
  //       expiration: {
  //         maxEntries: 100,
  //         maxAgeSeconds: 60 * 60 * 24 * 30, // 1 month
  //       },
  //     },
  //   },
  // ],
});

module.exports = withPWA({
  ...nextConfig,
  reactStrictMode: true,
});
