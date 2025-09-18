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
      {/* <section className="flex flex-col lg:flex-row justify-center items-center  gap-2 py-4 ">
        <div className="flex lg:flex-col md:flex-row flex-wrap md:w-full justify-center p-2 lg:w-1/2  gap-2 ">
          <SosCard />
          <SafetyTimerCard />
        </div>
        <div className="flex lg:flex-col md:flex-row  flex-wrap lg:w-1/3 justify-center">
          <QuickActionsCard />
          <SafetyCircleCard />
        </div>
      </section>

      <section className="flex flex-wrap justify-center w-full p-2 gap-8 md:px-14">
        <FakeCallCard />
        <ResourcesPanel />
      </section> */}

      <section className="p-2 grid  mt-6 grid-cols-1 md:grid-cols-1 xl:grid-cols-2">
        <div className="p-2 grid justify-center items-center gap-2">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: 0.05 }}
          >
            <SosCard />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: 0.15 }}
          >
            <QuickActionsCard />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: 0.25 }}
          >
            <FakeCallCard />
          </motion.div>
        </div>
        <div className="p-2 grid justify-center items-center gap-2">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: 0.1 }}
          >
            <SafetyTimerCard />
          </motion.div>
          <motion.div
            className=""
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: 0.2 }}
          >
            <SafetyCircleCard />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: 0.3 }}
          >
            <ResourcesPanel />
          </motion.div>
        </div>
      </section>
    </div>
  );
}

//  Tools You Could Use:
// framer-motion → For smooth slide transitions

// useRef + scrollIntoView() → For native scroll

// Tailwind utilities like overflow-x-scroll, snap-x, snap-start → For scroll snapping
