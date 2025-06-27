import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Footer from "@/components/common/footer";
import "leaflet/dist/leaflet.css";


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
  themeColor: "#6C63FF",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  //useEffect(() => {
  //   if (process.env.NODE_ENV === "development" && 'serviceWorker' in navigator) {
  //     navigator.serviceWorker.register('/sw.js')
  //       .then((registration) => {
  //         console.log('Service Worker registered (dev):', registration);
  //       })
  //       .catch(console.error);
  //   }
  // }, []);

  return (
    <html lang="en">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <link rel="icon" href="/icon-192.png" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
        {/* <Footer/> */}
      </body>
    </html>
  );
}
