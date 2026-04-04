"use client";

import React from "react";
import { useExitAssistant, type ExitCategory } from "@/hooks/useExitAssistant";
import { AlertTriangle, Heart, Briefcase, Shield, MoreHorizontal } from "lucide-react";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";

const categories: {
  id: ExitCategory;
  label: string;
  description: string;
  icon: React.ElementType;
  color: string;
  bgColor: string;
}[] = [
  {
    id: "emergency",
    label: "Emergency",
    description: "Urgent escape needed",
    icon: AlertTriangle,
    color: "text-red-500",
    bgColor: "bg-red-500/10 hover:bg-red-500/20 border-red-500/20",
  },
  {
    id: "family",
    label: "Family",
    description: "Family-related excuse",
    icon: Heart,
    color: "text-pink-500",
    bgColor: "bg-pink-500/10 hover:bg-pink-500/20 border-pink-500/20",
  },
  {
    id: "work",
    label: "Work / Study",
    description: "Professional excuse",
    icon: Briefcase,
    color: "text-blue-500",
    bgColor: "bg-blue-500/10 hover:bg-blue-500/20 border-blue-500/20",
  },
  {
    id: "safety",
    label: "Safety",
    description: "Safety-first excuse",
    icon: Shield,
    color: "text-emerald-500",
    bgColor: "bg-emerald-500/10 hover:bg-emerald-500/20 border-emerald-500/20",
  },
  {
    id: "other",
    label: "Other",
    description: "General excuse",
    icon: MoreHorizontal,
    color: "text-violet-500",
    bgColor: "bg-violet-500/10 hover:bg-violet-500/20 border-violet-500/20",
  },
];

export function ExitCategorySelector() {
  const selectCategory = useExitAssistant((s) => s.selectCategory);

  return (
    <div className="space-y-4">
      <div className="text-center space-y-1">
        <h3 className="text-lg font-bold text-foreground">Choose a Scenario</h3>
        <p className="text-sm text-muted-foreground">
          Select the type of exit you need
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {categories.map((cat, idx) => {
          const Icon = cat.icon;
          return (
            <motion.button
              key={cat.id}
              onClick={() => selectCategory(cat.id)}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.06, duration: 0.3 }}
              className={cn(
                "flex flex-col items-center gap-2 p-5 rounded-2xl border transition-all duration-200 cursor-pointer group",
                cat.bgColor,
                cat.id === "emergency" && "col-span-2"
              )}
            >
              <div
                className={cn(
                  "p-3 rounded-xl transition-transform group-hover:scale-110 duration-300",
                  cat.color
                )}
              >
                <Icon className="w-6 h-6" />
              </div>
              <div className="text-center">
                <span className="text-sm font-semibold text-foreground block">
                  {cat.label}
                </span>
                <span className="text-xs text-muted-foreground">
                  {cat.description}
                </span>
              </div>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
