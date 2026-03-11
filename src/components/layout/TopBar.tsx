"use client";

import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";

interface TopBarProps {
  onMenuClick?: () => void;
}

export function TopBar({ onMenuClick }: TopBarProps) {
  // TopBar logic simplified

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between lg:hidden border-b border-border/50 bg-white/50 px-6 backdrop-blur-xl dark:bg-black/50">
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={onMenuClick}
        >
          <Menu className="size-6" />
        </Button>
      </div>
    </header>
  );
}
