"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import { useExitAssistant } from "@/hooks/useExitAssistant";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "motion/react";
import { Clock, X } from "lucide-react";
import { cn } from "@/lib/utils";

const presetMinutes = [1, 3, 5, 10, 15, 30];

export function TimerSelector() {
  const timerMinutes = useExitAssistant((s) => s.timerMinutes);
  const timerActive = useExitAssistant((s) => s.timerActive);
  const timerEndTime = useExitAssistant((s) => s.timerEndTime);
  const setTimerMinutes = useExitAssistant((s) => s.setTimerMinutes);
  const startTimer = useExitAssistant((s) => s.startTimer);
  const cancelTimer = useExitAssistant((s) => s.cancelTimer);
  const triggerAlert = useExitAssistant((s) => s.triggerAlert);

  const [remainingSeconds, setRemainingSeconds] = useState(0);
  const triggerFired = useRef(false);

  const computeRemaining = useCallback(() => {
    if (!timerEndTime) return 0;
    return Math.max(0, Math.ceil((timerEndTime - Date.now()) / 1000));
  }, [timerEndTime]);

  useEffect(() => {
    if (!timerActive || !timerEndTime) {
      triggerFired.current = false;
      return;
    }

    triggerFired.current = false;

    const tick = () => {
      const remaining = computeRemaining();
      setRemainingSeconds(remaining);

      if (remaining <= 0 && !triggerFired.current) {
        triggerFired.current = true;
        triggerAlert();
      }
    };

    tick();
    const id = setInterval(tick, 1000);

    return () => clearInterval(id);
  }, [timerActive, timerEndTime, computeRemaining, triggerAlert]);

  useEffect(() => {
    const handleVisibility = () => {
      if (document.visibilityState === "visible" && timerActive) {
        const remaining = computeRemaining();
        setRemainingSeconds(remaining);
        if (remaining <= 0 && !triggerFired.current) {
          triggerFired.current = true;
          triggerAlert();
        }
      }
    };

    document.addEventListener("visibilitychange", handleVisibility);
    return () =>
      document.removeEventListener("visibilitychange", handleVisibility);
  }, [timerActive, computeRemaining, triggerAlert]);

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  const totalSeconds = timerMinutes * 60;
  const progress = timerActive
    ? (remainingSeconds / totalSeconds) * 100
    : 100;

  return (
    <div className="space-y-5">
      <AnimatePresence mode="wait">
        {!timerActive ? (
          <motion.div
            key="setup"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="space-y-5"
          >
            <div className="text-center">
              <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                Trigger in
              </span>
              <div className="text-5xl font-black text-foreground tabular-nums mt-2">
                {timerMinutes}
                <span className="text-xl font-medium text-muted-foreground ml-1">
                  min
                </span>
              </div>
            </div>

            <div className="flex flex-wrap justify-center gap-2">
              {presetMinutes.map((m) => (
                <Button
                  key={m}
                  variant={timerMinutes === m ? "default" : "outline"}
                  size="sm"
                  onClick={() => setTimerMinutes(m)}
                  className={cn(
                    "rounded-full px-4 font-medium transition-all",
                    timerMinutes === m
                      ? "shadow-md bg-primary text-primary-foreground"
                      : "border-border/50 text-muted-foreground hover:text-foreground"
                  )}
                >
                  {m}m
                </Button>
              ))}
            </div>

            <Button
              onClick={startTimer}
              className="w-full h-12 rounded-2xl font-bold text-base shadow-[0_0_30px_-8px_rgba(99,102,241,0.4)] hover:shadow-[0_0_40px_-8px_rgba(99,102,241,0.6)] transition-all"
            >
              <Clock className="w-4 h-4 mr-2" />
              Start Timer
            </Button>
          </motion.div>
        ) : (
          <motion.div
            key="active"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="flex flex-col items-center space-y-6"
          >
            <div className="relative flex items-center justify-center">
              <svg className="w-40 h-40 transform -rotate-90">
                <circle
                  cx="50%"
                  cy="50%"
                  r="42%"
                  className="stroke-muted/20"
                  strokeWidth="8"
                  fill="none"
                />
                <circle
                  cx="50%"
                  cy="50%"
                  r="42%"
                  stroke={remainingSeconds <= 30 ? "#ef4444" : "#6366f1"}
                  strokeWidth="8"
                  strokeDasharray={`${2 * Math.PI * 42}%`}
                  strokeDashoffset={`${2 * Math.PI * 42 * (1 - progress / 100)}%`}
                  strokeLinecap="round"
                  fill="none"
                  className="transition-all duration-1000 ease-linear"
                />
              </svg>

              <div className="absolute flex flex-col items-center">
                <span
                  className={cn(
                    "text-3xl font-black tabular-nums",
                    remainingSeconds <= 30
                      ? "text-destructive animate-pulse"
                      : "text-foreground"
                  )}
                >
                  {formatTime(remainingSeconds)}
                </span>
                <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mt-1">
                  Remaining
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2 px-3 py-1.5 bg-primary/5 rounded-full border border-primary/10">
              <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
              <span className="text-xs font-semibold text-primary">
                Alert will trigger automatically
              </span>
            </div>

            <Button
              onClick={cancelTimer}
              variant="destructive"
              className="w-full h-12 rounded-2xl font-bold text-base"
            >
              <X className="w-4 h-4 mr-2" />
              Cancel Timer
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
