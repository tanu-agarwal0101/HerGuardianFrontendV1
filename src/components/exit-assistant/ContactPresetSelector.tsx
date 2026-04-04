"use client";

import React from "react";
import {
  useExitAssistant,
  CONTACT_PRESETS,
  type PresetContact,
} from "@/hooks/useExitAssistant";
import { Plus } from "lucide-react";
import { AvatarBadge } from "./AvatarBadge";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";

const presets: PresetContact[] = ["Mom", "Friend", "Boss", "Custom"];

export function ContactPresetSelector() {
  const presetContact = useExitAssistant((s) => s.presetContact);
  const selectPreset = useExitAssistant((s) => s.selectPreset);

  return (
    <div className="space-y-3">
      <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
        Contact
      </span>

      <div className="flex gap-3 overflow-x-auto pb-1 scrollbar-hide">
        {presets.map((preset, idx) => {
          const isSelected = presetContact === preset;
          const isCustom = preset === "Custom";
          const data = !isCustom ? CONTACT_PRESETS[preset] : null;

          return (
            <motion.button
              key={preset}
              onClick={() => selectPreset(preset)}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: idx * 0.05, duration: 0.25 }}
              className={cn(
                "flex flex-col items-center gap-2 min-w-[72px] p-3 rounded-2xl border transition-all duration-200",
                isSelected
                  ? "border-primary bg-primary/10 shadow-md shadow-primary/10"
                  : "border-border/50 bg-card hover:border-primary/30 hover:bg-primary/5"
              )}
            >
              {isCustom ? (
                <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                  <Plus className="w-5 h-5 text-muted-foreground" />
                </div>
              ) : (
                <AvatarBadge name={data?.name || preset} size="sm" />
              )}
              <span
                className={cn(
                  "text-xs font-semibold",
                  isSelected ? "text-primary" : "text-muted-foreground"
                )}
              >
                {preset}
              </span>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
