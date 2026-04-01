"use client";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mic, MicOff, X, ChevronRight } from "lucide-react";
import { useVoiceSOS } from "@/providers/VoiceSOSProvider";
import { useUserStore } from "@/store/userStore";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

/**
 * Optimized Voice SOS Indicator.
 * Collapses to a simple icon on mobile to save space.
 * Expands on click to show phrase and disable control.
 */
export function VoiceActiveIndicator() {
  const { isPaused, isTriggered, cancelTrigger } = useVoiceSOS();
  const { voiceSOS, disableVoiceSOS } = useUserStore();
  const [isExpanded, setIsExpanded] = useState(false);

  if (!voiceSOS.enabled) return null;

  const handleDisable = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isTriggered) cancelTrigger();
    disableVoiceSOS();
    toast.info("Voice SOS disabled.", { id: "voice-sos-disabled" });
  };

  const paused = isPaused;
  const chipBg = paused 
    ? "bg-background/95 border-amber-500/40 shadow-amber-500/10" 
    : "bg-background/95 border-primary/30 shadow-primary/10";
  const textCol = paused ? "text-amber-500" : "text-primary";

  return (
    <AnimatePresence>
      <motion.div
        key="voice-indicator"
        layout
        initial={{ opacity: 0, scale: 0.8, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.8, y: 20 }}
        onClick={() => setIsExpanded(!isExpanded)}
        className={cn(
          "fixed bottom-20 right-4 z-40 flex items-center shadow-xl border backdrop-blur-md cursor-pointer transition-colors select-none overflow-hidden",
          chipBg,
          textCol,
          isExpanded ? "rounded-2xl pl-3 pr-1.5 py-1.5" : "rounded-full p-2.5"
        )}
      >
        <div className="flex items-center gap-2">
          
          <div className="relative shrink-0">
            {paused ? (
              <MicOff className="w-5 h-5 shrink-0" />
            ) : (
              <motion.div
                animate={{ scale: [1, 1.2, 1], opacity: [1, 0.7, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Mic className="w-5 h-5 shrink-0" />
              </motion.div>
            )}
            {!paused && (
              <motion.span
                className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-primary"
                animate={{ scale: [1, 1.5, 1], opacity: [1, 0, 1] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              />
            )}
          </div>

          
          <AnimatePresence>
            {isExpanded && (
              <motion.div
                initial={{ width: 0, opacity: 0 }}
                animate={{ width: "auto", opacity: 1 }}
                exit={{ width: 0, opacity: 0 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="flex items-center gap-3 overflow-hidden whitespace-nowrap"
              >
                <div className="flex flex-col">
                  {paused ? (
                    <span className="text-[10px] uppercase tracking-wider font-bold">SOS Paused</span>
                  ) : (
                    <>
                      <span className="text-[10px] text-muted-foreground uppercase tracking-wider font-bold">Listening for</span>
                      <span className="text-sm font-bold truncate max-w-[120px]">
                        &quot;{voiceSOS.triggerPhrase}&quot;
                      </span>
                    </>
                  )}
                </div>

                <button
                  onClick={handleDisable}
                  className="flex items-center gap-1 bg-destructive/10 hover:bg-destructive/20 text-destructive border border-destructive/20 rounded-lg px-2 py-1 transition-all active:scale-95"
                >
                  <X className="w-3 h-3" />
                  <span className="text-[10px] font-bold uppercase tracking-tight">Disable</span>
                </button>
              </motion.div>
            )}
          </AnimatePresence>
          
          
          <motion.div 
            animate={{ x: isExpanded ? 0 : 0 }}
            className="text-muted-foreground/30 ml-0.5"
          >
            {isExpanded ? <ChevronRight className="w-3 h-3" /> : null}
          </motion.div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
