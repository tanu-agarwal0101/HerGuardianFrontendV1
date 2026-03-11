"use client";
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Watch, Construction } from "lucide-react";
import { useRouter } from "next/navigation";

export default function SmartWatchComingSoon() {
  const router = useRouter();

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] p-4 relative">
      {/* TopBar Back Button handles navigation now */}

      <Card className="m-4 p-8 lg:w-[600px] w-full shadow-xl border-primary/10 bg-card/50 backdrop-blur-md text-center">
        <CardHeader className="flex flex-col items-center gap-4">
          <div className="p-4 bg-primary/10 rounded-full text-primary animate-pulse">
            <Watch size={48} />
          </div>
          <CardTitle className="text-4xl font-bold text-primary">
            Smart Watch Integration
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-6 mt-4">
          <div className="flex items-center justify-center gap-2 text-amber-500 font-medium bg-amber-500/10 py-2 px-4 rounded-full w-fit mx-auto">
            <Construction size={20} />
            <span>Under Development</span>
          </div>
          
          <p className="text-gray-500 text-lg leading-relaxed">
            We&apos;re working hard to bring HerGuardian to your wrist. Soon you&apos;ll be able to trigger SOS alerts and monitor your safety directly from your Apple Watch or Wear OS device.
          </p>

          <div className="pt-8 grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
            <div className="p-4 rounded-xl border border-primary/5 bg-primary/5">
                <h4 className="font-bold text-primary mb-1">Wrist SOS</h4>
                <p className="text-xs text-gray-500">Trigger emergency alerts with a quick gesture or button press.</p>
            </div>
            <div className="p-4 rounded-xl border border-primary/5 bg-primary/5">
                <h4 className="font-bold text-primary mb-1">Live Sync</h4>
                <p className="text-xs text-gray-500">Real-time location and heart rate monitoring during active timers.</p>
            </div>
          </div>

          <Button 
            onClick={() => router.push("/dashboard")}
            className="w-full mt-8 py-6 rounded-xl shadow-lg hover:scale-105 transition-transform"
          >
            Stay Tuned
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
