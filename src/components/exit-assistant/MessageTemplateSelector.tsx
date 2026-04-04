"use client";

import React from "react";
import {
  useExitAssistant,
  MESSAGE_TEMPLATES,
} from "@/hooks/useExitAssistant";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { motion } from "motion/react";
import { MessageSquare } from "lucide-react";

const templateGroups = [
  { key: "urgent" as const, label: "Urgent", color: "text-red-500 bg-red-500/10 border-red-500/20" },
  { key: "casual" as const, label: "Casual", color: "text-blue-500 bg-blue-500/10 border-blue-500/20" },
  { key: "work" as const, label: "Work", color: "text-amber-500 bg-amber-500/10 border-amber-500/20" },
];

export function MessageTemplateSelector() {
  const message = useExitAssistant((s) => s.message);
  const contactName = useExitAssistant((s) => s.contactName);
  const setMessage = useExitAssistant((s) => s.setMessage);
  const setContactName = useExitAssistant((s) => s.setContactName);

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
          Contact Name
        </label>
        <Input
          value={contactName}
          onChange={(e) => setContactName(e.target.value)}
          placeholder="Enter a name..."
          className="bg-background/50 border-border/50 rounded-xl"
        />
      </div>

      <div className="space-y-3">
        <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-1.5">
          <MessageSquare className="w-3.5 h-3.5" />
          Message Templates
        </span>

        {templateGroups.map((group) => (
          <div key={group.key} className="space-y-1.5">
            <span
              className={cn(
                "text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border inline-block",
                group.color
              )}
            >
              {group.label}
            </span>
            <div className="flex flex-wrap gap-1.5">
              {MESSAGE_TEMPLATES[group.key].map((tmpl) => (
                <motion.button
                  key={tmpl}
                  onClick={() => setMessage(tmpl)}
                  whileTap={{ scale: 0.97 }}
                  className={cn(
                    "text-xs px-3 py-1.5 rounded-full border transition-all duration-200 cursor-pointer",
                    message === tmpl
                      ? "bg-primary text-primary-foreground border-primary shadow-sm"
                      : "bg-card border-border/50 text-muted-foreground hover:border-primary/30 hover:text-foreground"
                  )}
                >
                  {tmpl}
                </motion.button>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="space-y-2">
        <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
          Message Preview
        </label>
        <div className="relative">
          <Input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type your message..."
            className="bg-background/50 border-border/50 rounded-xl pr-12"
            maxLength={120}
          />
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-muted-foreground/50 tabular-nums">
            {message.length}/120
          </span>
        </div>
      </div>
    </div>
  );
}
