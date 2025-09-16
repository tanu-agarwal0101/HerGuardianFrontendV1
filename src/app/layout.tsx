import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Footer from "@/components/common/footer";
import "leaflet/dist/leaflet.css";
import { SonnerToaster } from "@/components/common/SonnerToaster";

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
};

export const viewport = {
  themeColor: "#6C63FF",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body>
        <SonnerToaster />
        {children}
      </body>
    </html>
  );
}
