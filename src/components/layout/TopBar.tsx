"use client";

import { Bell, Menu, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"; // Ensure these exist or use basic button for now
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"; // Ensure exist

interface TopBarProps {
  onMenuClick?: () => void;
}

export function TopBar({ onMenuClick }: TopBarProps) {
  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-border/50 bg-white/50 px-6 backdrop-blur-xl dark:bg-black/50">
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          className="lg:hidden"
          onClick={onMenuClick}
        >
          <Menu className="size-6" />
        </Button>
        {/* <div className="relative hidden w-96 md:block">
          <Search className="absolute left-2.5 top-2.5 size-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search..."
            className="w-full bg-background pl-9 md:w-[300px] lg:w-[400px]"
          />
        </div> */}
        <h2 className="text-lg font-semibold text-foreground hidden sm:block">
            Dashboard
        </h2>
      </div>

      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" className="relative text-muted-foreground">
          <Bell className="size-5" />
          <span className="absolute right-2 top-2 size-2 rounded-full bg-red-500" />
        </Button>

        {/* Profile Dropdown Placeholder */}
         <div className="flex items-center gap-3 pl-4 border-l border-border/50">
             <div className="text-right hidden md:block">
                <p className="text-sm font-medium leading-none">Tanu Agarwal</p>
                <p className="text-xs text-muted-foreground text-right">Premium User</p>
             </div>
             <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">
                 TA
             </div>
         </div>
      </div>
    </header>
  );
}
