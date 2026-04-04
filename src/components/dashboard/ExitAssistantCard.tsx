"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Zap, LogOut } from "lucide-react";
import { useExitAssistant } from "@/hooks/useExitAssistant";
import { useUserStore } from "@/store/userStore";

export function ExitAssistantCard() {
  const openExitAssistant = useExitAssistant((s) => s.open);
  const triggerQuickExit = useExitAssistant((s) => s.triggerQuickExit);
  const quickExit = useUserStore((s) => s.quickExit);

  return (
    <Card className="flex flex-col h-full shadow-md hover:shadow-lg transition-all p-4 border-l-4 border-l-primary group">
      <CardHeader className="p-0 pb-2 flex flex-row justify-between items-center">
        <div>
          <CardTitle className="text-xl font-bold text-foreground group-hover:text-primary transition-colors">
            Smart Exit
          </CardTitle>
          <p className="text-sm text-muted-foreground mt-1">
            Quick escape assistance
          </p>
        </div>
        <div className="p-2 bg-primary/10 rounded-full text-primary transition-transform group-hover:scale-110">
          <LogOut className="h-5 w-5" />
        </div>
      </CardHeader>
      <CardContent className="p-0 flex-1 flex flex-col gap-3 mt-4">
        {quickExit.enabled && (
          <Button
            onClick={() => triggerQuickExit(quickExit)}
            variant="outline"
            className="w-full h-10 text-xs font-bold border-primary/30 hover:bg-primary/5 text-primary shadow-sm transition-all gap-2"
          >
            <Zap className="w-3.5 h-3.5 fill-primary" />
            Quick Zap: {quickExit.contactName}
          </Button>
        )}
        <Button
          onClick={openExitAssistant}
          className="w-full h-11 text-sm font-bold bg-primary hover:bg-primary/90 text-primary-foreground shadow-md transition-all gap-2"
        >
          <LogOut className="w-4 h-4" />
          Get Me Out
        </Button>
      </CardContent>
    </Card>
  );
}
