import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import "leaflet/dist/leaflet.css";
import { SonnerToaster } from "@/components/common/SonnerToaster";
import { SpeedInsights } from "@vercel/speed-insights/next"
import { Analytics } from "@vercel/analytics/next"

import { SessionRefresherProvider } from "@/components/SessionRefresherProvider";
import StoreHydrator from "@/components/StoreHydrator";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const viewport: Viewport = {
  themeColor: "#1d4ed8",
};

export const metadata: Metadata = {
  title: "HerGuardian",
  description: "HerGuardian is an app for safety and assistance.",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
  },
  icons: {
    icon: "/favicon.png?v=7",
    shortcut: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <SonnerToaster />
        <StoreHydrator />
        <SessionRefresherProvider>
          {/* StealthTriggerProvider removed temporarily — stealth feature paused */}
          {/* <StealthTriggerProvider>{children}</StealthTriggerProvider> */}
          {children}
        </SessionRefresherProvider>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
