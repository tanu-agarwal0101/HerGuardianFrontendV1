"use client";
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { Timer } from "lucide-react";

export function SafetyTimerCard() {
  const router = useRouter();
  return (
    <Card className="flex flex-col items-center justify-between p-6  hover:border-primary/50 transition-colors">
      <CardHeader className="p-0 text-center space-y-2 w-full">
        <CardTitle className="text-2xl font-bold text-primary flex items-center justify-center gap-2">
          <Timer className="w-6 h-6" />
          Safety Timer
        </CardTitle>
        <p className="text-muted-foreground text-sm">
          Set a countdown for risky activities. Alerts contacts if not stopped.
        </p>
      </CardHeader>
      
      <CardContent className="flex flex-col items-center justify-center py-6 w-full">
        <div className="relative flex items-center justify-center">
            {/* Pulsing Effect */}
            <div className="absolute w-48 h-48 rounded-full bg-primary/10 animate-pulse" />
            
             <Button
              className="w-40 h-40 rounded-full text-xl font-bold bg-primary hover:bg-primary/90 text-primary-foreground shadow-xl hover:shadow-2xl hover:scale-105 transition-all z-10 border-4 border-background"
              onClick={() => router.push("/dashboard/actions/timer")}
            >
              START
            </Button>
        </div>
      </CardContent>
      
      <div className="min-h-[20px]"></div>
    </Card>
  );
}
