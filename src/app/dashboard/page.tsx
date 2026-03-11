"use client";
import React, { useState, useEffect, useRef } from "react";
import { useUserStore } from "@/store/userStore";
import { HeroCard } from "@/components/dashboard/HeroCard";
import { SosCard } from "@/components/dashboard/SosCard";
import { SafetyTimerCard } from "@/components/dashboard/SafetyTimerCard";
import { ResourcesPanel } from "@/components/dashboard/ResourcesPanel";
import { FakeCallCard } from "@/components/dashboard/FakeCallCard";
import { SafetyCircleCard } from "@/components/dashboard/SafetyCircleCard";
import { motion } from "motion/react";
import Link from "next/link";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { enableNotifications } from "@/lib/notificationsService";
import { MapPin, Watch, Bell, ArrowRight } from "lucide-react";


export default function Dashboard() {
  const { stealth } = useUserStore();
  const [warning, setWarning] = useState("");
  const pinInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!stealth.stealthMode) return;
    if (!pinInputRef.current) return;
    pinInputRef.current.focus();
  }, [stealth.stealthMode]);

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

          {/* Safety Circle + Resources */}
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

          {/* Address, Watch, FakeCall & Notifications */}
          <div className="space-y-6">
             {/* Address Card */}
             <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.2 }}
             >
                <Link href="/dashboard/location">
                  <Card className="shadow-md hover:shadow-lg transition-all p-4 cursor-pointer group">
                    <CardHeader className="flex flex-row items-center gap-3 p-0 pb-2">
                      <div className="p-2 bg-primary/10 rounded-full text-primary">
                        <MapPin className="h-5 w-5" />
                      </div>
                      <div className="flex-1">
                        <CardTitle className="text-lg font-bold text-primary">Saved Addresses</CardTitle>
                        <p className="text-sm text-muted-foreground">Home, work & safe zones.</p>
                      </div>
                      <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
                    </CardHeader>
                  </Card>
                </Link>
             </motion.div>

             {/* Smart Watch Card */}
             <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.25 }}
             >
                <Link href="/dashboard/watch">
                  <Card className="shadow-md hover:shadow-lg transition-all p-4 cursor-pointer group">
                    <CardHeader className="flex flex-row items-center gap-3 p-0 pb-2">
                      <div className="p-2 bg-primary/10 rounded-full text-primary">
                        <Watch className="h-5 w-5" />
                      </div>
                      <div className="flex-1">
                        <CardTitle className="text-lg font-bold text-primary">Smart Watch</CardTitle>
                        <p className="text-sm text-muted-foreground">Connect your wearable device.</p>
                      </div>
                      <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
                    </CardHeader>
                  </Card>
                </Link>
             </motion.div>

             {/* Fake Call */}
             <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.3 }}
             >
                <FakeCallCard />
             </motion.div>

             {/* Enable Notifications */}
             <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.35 }}
             >
                <Card className="shadow-md hover:shadow-lg transition-all p-4 cursor-pointer group" onClick={() => enableNotifications()}>
                  <CardHeader className="flex flex-row items-center gap-3 p-0 pb-2">
                    <div className="p-2 bg-primary/10 rounded-full text-primary">
                      <Bell className="h-5 w-5" />
                    </div>
                    <div className="flex-1">
                      <CardTitle className="text-lg font-bold text-primary">Enable Notifications</CardTitle>
                      <p className="text-sm text-muted-foreground">Stay alerted with push notifications.</p>
                    </div>
                    <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
                  </CardHeader>
                </Card>
             </motion.div>
          </div>
      </section>
    </div>
  );
}

