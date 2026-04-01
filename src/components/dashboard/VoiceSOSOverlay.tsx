"use client";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Mic, AlertTriangle, X } from "lucide-react";
import { triggerSOS } from "@/lib/sosTrigger";
import { useRouter } from "next/navigation";

const COUNTDOWN_SECS = 5;

export function VoiceSOSOverlay({ onCancel }: { onCancel: () => void }) {
  const [countdown, setCountdown] = useState(COUNTDOWN_SECS);
  const router = useRouter();
  const triggeredRef = useRef(false); 
  const handleTrigger = useCallback(async () => {
    if (triggeredRef.current) return;
    triggeredRef.current = true;
    onCancel(); 
    await triggerSOS(router);
  }, [onCancel, router]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);


  useEffect(() => {
    if (countdown === 0) handleTrigger();
  }, [countdown, handleTrigger]);

  useEffect(() => {
    const SpeechRecognition =
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (window as any).SpeechRecognition ||
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) return;

    const recognition = new SpeechRecognition();
    recognition.continuous     = false;
    recognition.interimResults = false;
    recognition.lang           = "en-US";

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript.toLowerCase().trim();
      if (transcript.includes("cancel") || transcript.includes("stop") || transcript.includes("abort")) {
        onCancel();
      }
    };

    recognition.onerror = () => {}; 

    try { recognition.start(); } catch { }

    return () => {
      try { recognition.stop(); } catch { }
    };
  }, [onCancel]);

  const circumference = 2 * Math.PI * 52; 
  const progress = countdown / COUNTDOWN_SECS;

  return (
    <div
      role="alertdialog"
      aria-modal="true"
      aria-label="Voice SOS triggered — 5 second countdown"
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-destructive/90 backdrop-blur-md"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 260, damping: 22 }}
        className="max-w-sm w-full mx-4 p-8 bg-background rounded-3xl shadow-2xl text-center space-y-6 relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-destructive/5 -z-10 animate-pulse" />

        <div className="flex justify-center">
          <div className="relative">
            <motion.div
              animate={{ scale: [1, 1.15, 1] }}
              transition={{ duration: 1, repeat: Infinity }}
              className="w-20 h-20 bg-destructive/10 rounded-full flex items-center justify-center text-destructive"
            >
              <Mic className="w-10 h-10" />
            </motion.div>
            <div className="absolute -top-1 -right-1 bg-destructive text-white p-1 rounded-full border-4 border-background">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
        </div>

        <div className="space-y-1">
          <h2 className="text-2xl font-black text-destructive tracking-tight">VOICE SOS TRIGGERED</h2>
          <p className="text-muted-foreground text-sm font-medium">
            Say <strong className="text-foreground">CANCEL</strong> or tap the button below to abort.
          </p>
        </div>

        <div className="relative h-36 flex items-center justify-center">
          <span className="text-7xl font-mono font-bold text-foreground tabular-nums z-10">
            {countdown}
          </span>
          <svg
            className="absolute w-36 h-36 -rotate-90"
            viewBox="0 0 120 120"
            aria-hidden="true"
          >
            <circle
              cx="60" cy="60" r="52"
              stroke="currentColor"
              strokeWidth="8"
              fill="transparent"
              className="text-muted/20"
            />
            <motion.circle
              cx="60" cy="60" r="52"
              stroke="currentColor"
              strokeWidth="8"
              fill="transparent"
              strokeDasharray={circumference}
              strokeDashoffset={circumference * (1 - progress)}
              strokeLinecap="round"
              className="text-destructive"
              transition={{ duration: 0.8, ease: "linear" }}
            />
          </svg>
        </div>

        <div className="space-y-3">
          <Button
            variant="outline"
            size="lg"
            onClick={onCancel}
            className="w-full h-14 rounded-2xl border-2 font-bold hover:bg-muted/50 text-base"
          >
            <X className="mr-2 h-5 w-5" /> CANCEL ALERT
          </Button>
          <Button
            variant="destructive"
            size="lg"
            onClick={handleTrigger}
            className="w-full h-14 rounded-2xl font-bold shadow-lg shadow-destructive/20 text-base"
          >
            SEND SOS NOW
          </Button>
        </div>

        <p className="text-[11px] text-muted-foreground uppercase tracking-widest opacity-40 font-medium">
          Emergency contacts will be notified automatically
        </p>
      </motion.div>
    </div>
  );
}
