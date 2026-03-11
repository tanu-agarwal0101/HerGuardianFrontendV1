"use client";

import { useState } from "react";
import { Sidebar } from "./Sidebar";
import { TopBar } from "./TopBar";

// If Sheet doesn't exist, we fallback to a simple mobile drawer logic
// But for now let's assume we can use a simple conditional rendering or standard div for mobile

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="flex min-h-screen w-full bg-muted/30">
        
      {/* Desktop Sidebar */}
      <Sidebar className="hidden lg:flex fixed left-0 top-0 bottom-0 z-40" />

      {/* Main Content Area */}
      <div className="flex flex-1 flex-col transition-all duration-300 lg:pl-64 w-full">
        <TopBar onMenuClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} />
        
        <main className="flex-1 p-4 md:p-6 w-full max-w-7xl mx-auto">
            {children}
        </main>
      </div>

      {/* Mobile Drawer Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
            <div 
                className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                onClick={() => setIsMobileMenuOpen(false)}
            />
            <div className="absolute left-0 top-0 bottom-0 w-64 bg-background shadow-2xl animate-in slide-in-from-left duration-300">
                <Sidebar className="w-full h-full border-none" />
            </div>
        </div>
      )}
    </div>
  );
}
