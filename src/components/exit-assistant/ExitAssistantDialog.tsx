"use client";

import React from "react";
import { useExitAssistant } from "@/hooks/useExitAssistant";
import { useUserStore } from "@/store/userStore";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ExitCategorySelector } from "./ExitCategorySelector";
import { ContactPresetSelector } from "./ContactPresetSelector";
import { MessageTemplateSelector } from "./MessageTemplateSelector";
import { TimerSelector } from "./TimerSelector";
import { AIExcuseGenerator } from "./AIExcuseGenerator";
import { ContactAlert } from "./ContactAlert";
import { motion, AnimatePresence } from "motion/react";
import {
  ArrowLeft,
  Zap,
  Clock,
  Sparkles,
  DoorOpen,
} from "lucide-react";

export function ExitAssistantDialog() {
  const isOpen = useExitAssistant((s) => s.isOpen);
  const step = useExitAssistant((s) => s.step);
  const close = useExitAssistant((s) => s.close);
  const setStep = useExitAssistant((s) => s.setStep);
  const triggerAlert = useExitAssistant((s) => s.triggerAlert);
  const contactName = useExitAssistant((s) => s.contactName);
  const message = useExitAssistant((s) => s.message);
  const alertVisible = useExitAssistant((s) => s.alertVisible);
  const timerActive = useExitAssistant((s) => s.timerActive);
  const setQuickExit = useUserStore((s) => s.setQuickExit);

  const canTrigger = contactName.trim() && message.trim();

  const goBack = () => {
    switch (step) {
      case "customize":
        setStep("category");
        break;
      case "ai":
        setStep("category");
        break;
      case "timer":
        if (!timerActive) {
          setStep("customize");
        }
        break;
      default:
        break;
    }
  };

  const getTitle = () => {
    switch (step) {
      case "category":
        return "Smart Exit";
      case "customize":
        return "Customize Alert";
      case "timer":
        return "Timed Exit";
      case "ai":
        return "AI Excuse";
      default:
        return "Smart Exit";
    }
  };

  return (
    <>
      <ContactAlert />

      <Dialog
        open={isOpen && !alertVisible}
        onOpenChange={(open) => {
          if (!open) close();
        }}
      >
        <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto p-0 rounded-3xl border-border/50 bg-card/95 backdrop-blur-2xl shadow-2xl gap-0">
          {/* Header */}
          <DialogHeader className="p-5 pb-3 border-b border-border/30 sticky top-0 bg-card/95 backdrop-blur-xl z-10">
            <div className="flex items-center gap-3">
              {step !== "category" && (
                <button
                  onClick={goBack}
                  className="p-1.5 rounded-full hover:bg-muted transition-colors -ml-1"
                  disabled={step === "timer" && timerActive}
                >
                  <ArrowLeft className="w-4 h-4 text-muted-foreground" />
                </button>
              )}
              <div className="flex-1">
                <DialogTitle className="text-lg font-bold text-foreground flex items-center gap-2">
                  <DoorOpen className="w-5 h-5 text-primary" />
                  {getTitle()}
                </DialogTitle>
                <DialogDescription className="text-xs text-muted-foreground mt-0.5">
                  Quick escape assistance
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>

          <div className="p-5">
            <AnimatePresence mode="wait">
              {step === "category" && (
                <motion.div
                  key="category"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.25 }}
                  className="space-y-5"
                >
                  <ExitCategorySelector />

                  <div className="flex items-center gap-3">
                    <div className="flex-1 h-px bg-border/50" />
                    <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                      or
                    </span>
                    <div className="flex-1 h-px bg-border/50" />
                  </div>

                  <Button
                    variant="outline"
                    onClick={() => setStep("ai")}
                    className="w-full h-12 rounded-2xl font-semibold border-primary/20 hover:bg-primary/5 hover:border-primary/30 gap-2 transition-all"
                  >
                    <Sparkles className="w-4 h-4 text-primary" />
                    Generate AI Excuse
                  </Button>
                </motion.div>
              )}

              {step === "customize" && (
                <motion.div
                  key="customize"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.25 }}
                  className="space-y-5"
                >
                  <ContactPresetSelector />
                  <MessageTemplateSelector />

                  <div className="space-y-3 pt-2">
                    <Button
                      onClick={triggerAlert}
                      disabled={!canTrigger}
                      className="w-full h-12 rounded-2xl font-bold text-base shadow-[0_0_30px_-8px_rgba(99,102,241,0.4)] hover:shadow-[0_0_40px_-8px_rgba(99,102,241,0.6)] transition-all gap-2"
                    >
                      <Zap className="w-4 h-4" />
                      Trigger Now
                    </Button>

                    <Button
                      variant="outline"
                      onClick={() => setStep("timer")}
                      disabled={!canTrigger}
                      className="w-full h-11 rounded-2xl font-semibold border-border/50 hover:border-primary/30 gap-2"
                    >
                      <Clock className="w-4 h-4" />
                      Set Timer Instead
                    </Button>

                    <Button
                      variant="ghost"
                      onClick={() => {
                        setQuickExit({
                          contactName,
                          message,
                          enabled: true,
                        });
                        toast.success("Quick Trigger default updated!");
                      }}
                      disabled={!canTrigger}
                      className="w-full h-10 rounded-2xl text-xs font-bold text-muted-foreground hover:text-primary transition-all gap-1.5"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      Set as Default Quick Trigger
                    </Button>
                  </div>
                </motion.div>
              )}
              {step === "timer" && (
                <motion.div
                  key="timer"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.25 }}
                >
                  <TimerSelector />
                </motion.div>
              )}
              {step === "ai" && (
                <motion.div
                  key="ai"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.25 }}
                >
                  <AIExcuseGenerator />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
