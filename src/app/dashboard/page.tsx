"use client";
import React, { useState, useEffect, useRef } from "react";
import { useUserStore } from "@/store/userStore";
import { triggerSOS } from "@/lib/sosTrigger";
import { HeroCard } from "@/components/dashboard/HeroCard";
import { SosCard } from "@/components/dashboard/SosCard";
import { SafetyTimerCard } from "@/components/dashboard/SafetyTimerCard";
import { QuickActionsCard } from "@/components/dashboard/QuickActionsCard";
import { ResourcesPanel } from "@/components/dashboard/ResourcesPanel";
import { FakeCallCard } from "@/components/dashboard/FakeCallCard";
import { SafetyCircleCard } from "@/components/dashboard/SafetyCircleCard";
import { motion } from "motion/react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { enableNotifications } from "@/lib/notificationsService";

export default function Dashboard() {
  const { stealth } = useUserStore();
  const [pinInput, setPinInput] = useState("");
  const [warning, setWarning] = useState("");
  const pinInputRef = useRef<HTMLInputElement>(null);

  // PIN/keyword/gesture logic
  useEffect(() => {
    if (!stealth.stealthMode) return;
    if (!pinInputRef.current) return;
    pinInputRef.current.focus();
  }, [stealth.stealthMode]);

  const handlePinInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPinInput(e.target.value);
    // Dashboard pass triggers dashboard (noop here), sosPass triggers SOS
    if (stealth.dashboardPass && e.target.value === stealth.dashboardPass) {
      setWarning("Already on dashboard");
    }
    if (stealth.sosPass && e.target.value === stealth.sosPass) {
      triggerSOS();
      setPinInput("");
    }
  };

  // Check rememberMe cookie (for stealth enforcement)
  useEffect(() => {
    if (typeof document !== "undefined") {
      const cookies = document.cookie.split(";").map((c) => c.trim());
      const remember = cookies.find((c) => c.startsWith("rememberMe="));
      if (!remember || remember.split("=")[1] !== "true") {
        setWarning(
          "Stealth mode requires 'Remember Me' to be enabled. Please log in again with 'Remember Me'."
        );
      }
    }
  }, []);

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 relative">
      {/* {stealth.stealthMode && (
        <div className="flex flex-col items-center mb-4">
          <input
            ref={pinInputRef}
            type="password"
            value={pinInput}
            onChange={handlePinInput}
            placeholder="Enter dashboard or SOS pass..."
            className="border p-2 rounded text-center"
            disabled={!!warning}
          />
          <div className="mt-2 text-gray-500 text-sm">
            Type your dashboard pass (noop here), or SOS pass to trigger SOS.
          </div>
        </div>
      )} */}
      {warning && (
        <div className="mb-4 rounded border border-yellow-300 bg-yellow-100 px-4 py-2 text-center text-sm text-yellow-800">
          {warning}
        </div>
      )}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45 }}
      >
        <HeroCard />
      </motion.div>

      <section className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Primary Safety Tools */}
          <motion.div 
             initial={{ opacity: 0, scale: 0.95 }}
             animate={{ opacity: 1, scale: 1 }}
             transition={{ duration: 0.4, delay: 0.1 }}
             className="h-full"
          >
             <SosCard />
          </motion.div>

          <motion.div
             initial={{ opacity: 0, scale: 0.95 }}
             animate={{ opacity: 1, scale: 1 }}
             transition={{ duration: 0.4, delay: 0.1 }}
             className="h-full"
          >
             <SafetyTimerCard />
          </motion.div>

          {/* Secondary Actions & Info */}
          <div className="space-y-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.2 }}
             >
                <SafetyCircleCard />
             </motion.div>
             <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.3 }}
             >
                <ResourcesPanel />
             </motion.div>
          </div>

          <div className="space-y-6">
             <motion.div
                 initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.2 }}
             >
                 <QuickActionsCard />
             </motion.div>
              <motion.div
                 initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.3 }}
             >
                 <FakeCallCard />
             </motion.div>
          </div>
      </section>
      <section className="mt-6">
        <h2 className="text-xl font-semibold mb-2">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          <Link href="/dashboard/chat">
            <Card className="p-4 hover:shadow-md transition-shadow cursor-pointer">
              <CardHeader className="p-0 mb-2">
                <CardTitle className="text-lg">Chatbot</CardTitle>
              </CardHeader>
              <CardContent className="p-0 text-sm text-gray-600">
                Talk to HerGuardian in real time.
              </CardContent>
            </Card>
          </Link>
          <Link href="/dashboard/logs">
            <Card className="p-4 hover:shadow-md transition-shadow cursor-pointer">
              <CardHeader className="p-0 mb-2">
                <CardTitle className="text-lg">Logs & SOS History</CardTitle>
              </CardHeader>
              <CardContent className="p-0 text-sm text-gray-600">
                Review recent SOS alerts and locations.
              </CardContent>
            </Card>
          </Link>
          <button onClick={() => enableNotifications()}>
            <Card className="p-4 hover:shadow-md transition-shadow cursor-pointer">
              <CardHeader className="p-0 mb-2">
                <CardTitle className="text-lg">Enable Notifications</CardTitle>
              </CardHeader>
              <CardContent className="p-0 text-sm text-gray-600">
                Allow alerts and updates from HerGuardian.
              </CardContent>
            </Card>
          </button>
        </div>
      </section>
    </div>
  );
}

//  Tools You Could Use:
// framer-motion → For smooth slide transitions

// useRef + scrollIntoView() → For native scroll

// Tailwind utilities like overflow-x-scroll, snap-x, snap-start → For scroll snapping
