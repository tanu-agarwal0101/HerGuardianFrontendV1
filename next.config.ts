import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
};

import withPWAInit from "next-pwa";

const withPWA = withPWAInit({
  dest: "public",
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === "development",
  swSrc: "public/service-worker.js",
});

const isProd = process.env.NODE_ENV === "production";

const baseConfig: NextConfig = {
  ...nextConfig,
  reactStrictMode: true,
};

module.exports = isProd ? withPWA(baseConfig) : baseConfig;
