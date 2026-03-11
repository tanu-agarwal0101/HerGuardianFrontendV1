"use client";

import { ArrowLeft, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { usePathname, useRouter } from "next/navigation";

interface TopBarProps {
  onMenuClick?: () => void;
}

export function TopBar({ onMenuClick }: TopBarProps) {
  const pathname = usePathname();
  const router = useRouter();

  // Hide TopBar completely on auth routes (as it should be wrapped in DashboardLayout anyway, but just in case)
  // Determine if back button should be shown (e.g., not on root dashboard)
  const showBackButton = pathname !== "/dashboard";

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
        {showBackButton && (
          <Button 
            variant="ghost" 
            className="hidden lg:flex items-center gap-2 text-muted-foreground hover:text-foreground hover:bg-muted/50 rounded-xl"
            onClick={() => router.back()}
          >
            <ArrowLeft className="size-5" />
            <span className="font-medium">Back</span>
          </Button>
        )}
      </div>

    </header>
  );
}
