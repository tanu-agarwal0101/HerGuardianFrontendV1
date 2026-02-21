"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  ScrollText,
  User,
  MessageCircle,
  ShieldCheck,
  LogOut,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { LogoutDialog } from "@/components/common/logout";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/dashboard/chat", label: "Guardian Chat", icon: MessageCircle },
  { href: "/dashboard/logs", label: "Activity Logs", icon: ScrollText },
  { href: "/profile", label: "Profile", icon: User },
  // { href: "/settings", label: "Settings", icon: Settings },
];

export function Sidebar({ className }: { className?: string }) {
  const pathname = usePathname();
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);

  return (
    <aside
      className={cn(
        "flex h-screen w-64 flex-col justify-between border-r border-border/50 bg-white/80 backdrop-blur-xl transition-all dark:bg-black/80",
        className
      )}
    >
      <div className="flex flex-col gap-6 p-6">
        {/* Brand */}
        <div className="flex items-center gap-2 px-2 text-2xl font-bold text-primary">
          <ShieldCheck className="size-8" />
          <span>HerGuardian</span>
        </div>

        {/* Nav */}
        <nav className="flex flex-col gap-2">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                    "flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-all",
                    isActive
                      ? "bg-primary text-primary-foreground shadow-md shadow-primary/20"
                      : "text-muted-foreground hover:bg-secondary hover:text-secondary-foreground"
                  )}
              >
                <Icon className="size-5" />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="p-6">
        <Button
          variant="ghost"
          className="w-full justify-start gap-3 text-muted-foreground hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950/30"
          onClick={() => setShowLogoutDialog(true)}
        >
          <LogOut className="size-5" />
          Log Out
        </Button>
      </div>

      <LogoutDialog open={showLogoutDialog} setOpen={setShowLogoutDialog} />
    </aside>
  );
}
