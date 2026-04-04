"use client";

import React, { useEffect, useRef, useState } from "react";
import { useExitAssistant } from "@/hooks/useExitAssistant";
import { AvatarBadge } from "./AvatarBadge";
import { Button } from "@/components/ui/button";
import { triggerAlertFeedback } from "@/lib/exitSounds";
import { motion, AnimatePresence } from "motion/react";
import { X, Phone } from "lucide-react";
import dynamic from "next/dynamic";

const FakeCall = dynamic(() => import("@/components/common/fakeCall"), {
  ssr: false,
});

const AUTO_DISMISS_MS = 8000;

export function ContactAlert() {
  const alertVisible = useExitAssistant((s) => s.alertVisible);
  const contactName = useExitAssistant((s) => s.contactName);
  const message = useExitAssistant((s) => s.message);
  const dismissAlert = useExitAssistant((s) => s.dismissAlert);

  const [showFakeCall, setShowFakeCall] = useState(false);
  const [dismissProgress, setDismissProgress] = useState(100);
  const feedbackFired = useRef(false);
  const autoDismissRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const progressRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (alertVisible && !feedbackFired.current) {
      feedbackFired.current = true;
      triggerAlertFeedback();
    }
    if (!alertVisible) {
      feedbackFired.current = false;
    }
  }, [alertVisible]);

  // Auto-dismiss countdown
  useEffect(() => {
    if (!alertVisible || showFakeCall) return;

    setDismissProgress(100);

    const startTime = Date.now();

    progressRef.current = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const remaining = Math.max(0, 100 - (elapsed / AUTO_DISMISS_MS) * 100);
      setDismissProgress(remaining);
    }, 50);

    autoDismissRef.current = setTimeout(() => {
      dismissAlert();
    }, AUTO_DISMISS_MS);

    return () => {
      if (autoDismissRef.current) clearTimeout(autoDismissRef.current);
      if (progressRef.current) clearInterval(progressRef.current);
    };
  }, [alertVisible, showFakeCall, dismissAlert]);

  const handleDismiss = () => {
    if (autoDismissRef.current) clearTimeout(autoDismissRef.current);
    if (progressRef.current) clearInterval(progressRef.current);
    dismissAlert();
  };

  const handleFakeCall = () => {

    if (autoDismissRef.current) clearTimeout(autoDismissRef.current);
    if (progressRef.current) clearInterval(progressRef.current);
    setShowFakeCall(true);
  };

  if (!alertVisible && !showFakeCall) return null;

  if (showFakeCall) {
    return (
      <FakeCall
        onClose={() => {
          setShowFakeCall(false);
          dismissAlert();
        }}
        settings={{
          name: contactName || "Mom",
          photo: "",
          ringtone: "/fake-ring.mp3",
          voice: "/voice1.mp3",
        }}
      />
    );
  }

  return (
    <AnimatePresence>
      {alertVisible && (
        <motion.div
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <motion.div
            initial={{ y: 100, opacity: 0, scale: 0.95 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 100, opacity: 0, scale: 0.95 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="w-full max-w-sm bg-card rounded-3xl shadow-2xl overflow-hidden relative border border-border/50"
          >

            <div className="absolute top-0 left-0 right-0 h-1 bg-muted/30">
              <motion.div
                className="h-full bg-primary/60 rounded-r-full"
                style={{ width: `${dismissProgress}%` }}
                transition={{ duration: 0.05, ease: "linear" }}
              />
            </div>

            <div className="flex items-center justify-between px-5 pt-5 pb-2">
              <span className="text-xs font-bold uppercase tracking-widest text-primary">
                Alert
              </span>
              <button
                onClick={handleDismiss}
                className="p-1.5 rounded-full hover:bg-muted transition-colors"
              >
                <X className="w-4 h-4 text-muted-foreground" />
              </button>
            </div>

            <div className="flex flex-col items-center px-6 pb-6 space-y-4">
              <motion.div
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.15, type: "spring", stiffness: 200 }}
              >
                <AvatarBadge
                  name={contactName || "?"}
                  size="lg"
                />
              </motion.div>

              <motion.h2
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="text-xl font-bold text-foreground"
              >
                {contactName || "Unknown"}
              </motion.h2>

              <motion.div
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.25 }}
                className="w-full p-4 bg-muted/50 rounded-2xl border border-border/30"
              >
                <p className="text-sm text-foreground text-center leading-relaxed">
                  {message || "Call me ASAP"}
                </p>
              </motion.div>

              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="text-xs text-muted-foreground font-medium"
              >
                Just now
              </motion.span>


              <motion.div
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.35 }}
                className="flex gap-3 w-full pt-2"
              >
                <Button
                  variant="outline"
                  onClick={handleDismiss}
                  className="flex-1 rounded-2xl h-12 font-semibold"
                >
                  Dismiss
                </Button>
                <Button
                  onClick={handleFakeCall}
                  className="flex-1 rounded-2xl h-12 font-semibold gap-2 shadow-md shadow-primary/20"
                >
                  <Phone className="w-4 h-4" />
                  Call Back
                </Button>
              </motion.div>
            </div>

            <div className="px-6 pb-4">
              <p className="text-[10px] text-muted-foreground text-center font-medium">
                Time to wrap up and leave
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
