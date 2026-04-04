"use client";

import React from "react";
import { User, Heart, Briefcase } from "lucide-react";
import { cn } from "@/lib/utils";

interface AvatarBadgeProps {
  name: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}

function getColorFromName(name: string): string {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  const hue = Math.abs(hash % 360);
  return `hsl(${hue}, 55%, 55%)`;
}

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((w) => w[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

function getPresetIcon(name: string) {
  const lower = name.toLowerCase();
  if (lower.includes("mom") || lower.includes("dad") || lower.includes("family")) {
    return Heart;
  }
  if (lower.includes("boss") || lower.includes("work") || lower.includes("manager")) {
    return Briefcase;
  }
  return User;
}

const sizeClasses = {
  sm: "w-10 h-10 text-sm",
  md: "w-14 h-14 text-lg",
  lg: "w-20 h-20 text-2xl",
};

export function AvatarBadge({ name, size = "md", className }: AvatarBadgeProps) {
  const initials = getInitials(name || "?");
  const bgColor = getColorFromName(name || "default");
  const Icon = getPresetIcon(name);

  return (
    <div
      className={cn(
        "rounded-full flex items-center justify-center font-bold text-white shadow-lg relative overflow-hidden",
        sizeClasses[size],
        className
      )}
      style={{ backgroundColor: bgColor }}
    >

      <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent" />
      
      {initials ? (
        <span className="relative z-10">{initials}</span>
      ) : (
        <Icon className="relative z-10 w-1/2 h-1/2" />
      )}
    </div>
  );
}
