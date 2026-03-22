"use client";
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { triggerSOS } from "@/lib/sosTrigger";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

export function SosCard() {
  const router = useRouter();

  const handleActivate = () => {
    triggerSOS(router);
  };

  return (
    <Card className="flex flex-col items-center justify-between p-6 shadow-lg border-destructive/20 dark:border-destructive/30">
      <CardHeader className="p-0 text-center space-y-2 w-full">
        <CardTitle className="text-2xl font-bold text-destructive">
          Emergency SOS
        </CardTitle>
        <p className="text-muted-foreground text-sm">
          Activate to immediately alert your emergency contacts and share your live location.
        </p>
      </CardHeader>
      
      <CardContent className="flex flex-col items-center justify-center py-6 w-full">
        <div className="relative flex items-center justify-center">
            {/* Pulsing Effect */}
            <motion.div
                className="absolute w-48 h-48 rounded-full bg-destructive/20"
                animate={{ scale: [1, 1.5], opacity: [0.5, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeOut" }}
            />
            <motion.div
                className="absolute w-48 h-48 rounded-full bg-destructive/20"
                animate={{ scale: [1, 1.25], opacity: [0.5, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeOut", delay: 0.5 }}
            />
            
            <Button
                size="lg"
                variant="destructive"
                className="w-40 h-40 rounded-full text-xl font-bold shadow-xl hover:shadow-2xl hover:scale-105 transition-all z-10 border-4 border-background"
                onClick={handleActivate}
            >
                ACTIVATE
            </Button>
        </div>
      </CardContent>

      <div className="text-xs text-destructive-foreground/80 text-center bg-destructive/10 px-4 py-2 rounded-full">
        Long press for 3s to trigger silently
      </div>
    </Card>
  );
}

