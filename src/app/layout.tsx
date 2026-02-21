import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

// import Footer from "@/components/common/footer";
import "leaflet/dist/leaflet.css";
import { SonnerToaster } from "@/components/common/SonnerToaster";

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

export const metadata: Metadata = {
  title: "HerGuardian",
  description: "HerGuardian is an app for safety and assistance.",
  icons: {
    icon: "/favicon-32x32.png",
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
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#1d4ed8" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta
          name="apple-mobile-web-app-status-bar-style"
          content="black-translucent"
        />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin=""
        />

        <link rel="icon" href="/favicon.ico" />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/favicon-32x32.png"
        />

        {/* add this — fixes Edge Tools warning */}
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/apple-touch-icon.png"
        />
      </head>

      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <SonnerToaster />
        <StoreHydrator />
        <SessionRefresherProvider>
          {/* StealthTriggerProvider removed temporarily — stealth feature paused */}
          {/* <StealthTriggerProvider>{children}</StealthTriggerProvider> */}
          {children}
        </SessionRefresherProvider>
      </body>
    </html>
  );
}
