"use client";
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { triggerSOS } from "@/lib/sosTrigger";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { Mic, MicOff, Settings, Sparkles } from "lucide-react";
import { useUserStore } from "@/store/userStore";
import { VoiceSettingsDialog } from "./VoiceSettingsDialog";
import { useVoiceSOS } from "@/providers/VoiceSOSProvider";

export function SosCard() {
  const router = useRouter();
  const { voiceSOS, disableVoiceSOS } = useUserStore();
  const { isPaused } = useVoiceSOS();
  const [showSettings, setShowSettings] = useState(false);

  const handleActivate = () => {
    triggerSOS(router);
  };

  const toggleVoice = () => {
    if (voiceSOS.enabled) {
      disableVoiceSOS();
    } else {
        setShowSettings(true);
    }
  };

  return (
    <>
      <Card className="relative flex flex-col items-center justify-between p-6 shadow-lg border-destructive/20 dark:border-destructive/30 overflow-hidden group">
        <div className="absolute top-3 right-3 z-20">
            <motion.div 
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="bg-primary/10 text-primary text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 border border-primary/20"
            >
                <Sparkles className="w-3 h-3" /> NEW: VOICE SOS
            </motion.div>
        </div>

        <CardHeader className="p-0 pt-4 text-center space-y-2 w-full">
          <CardTitle className="text-2xl font-bold text-destructive">
            Emergency SOS
          </CardTitle>
          <p className="text-muted-foreground text-sm">
            Activate to immediately alert your emergency contacts and share your live location.
          </p>
        </CardHeader>
        
        <CardContent className="flex flex-col items-center justify-center py-6 w-full gap-8">
          <div className="relative flex items-center justify-center">

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

          <div className="flex flex-col sm:flex-row items-center gap-3 w-full max-w-[280px]">
              <Button
                  variant={voiceSOS.enabled ? "default" : "outline"}
                  className={`w-full sm:flex-1 h-12 rounded-xl border-2 transition-all gap-2 font-bold ${
                    voiceSOS.enabled ? "bg-primary shadow-lg shadow-primary/20" : "text-muted-foreground hover:text-primary hover:border-primary/50"
                  }`}
                  onClick={toggleVoice}
              >
                  {voiceSOS.enabled ? (
                    isPaused ? (
                      <>
                        <MicOff className="h-4 w-4 text-amber-400" />
                        <span className="text-amber-400">SOS Paused</span>
                      </>
                    ) : (
                      <>
                        <motion.div
                            animate={{ opacity: [1, 0.5, 1] }}
                            transition={{ duration: 1.5, repeat: Infinity }}
                        >
                            <Mic className="h-4 w-4" />
                        </motion.div>
                        Listening...
                      </>
                    )
                  ) : (
                    <>
                        <MicOff className="h-4 w-4" />
                        Voice SOS
                    </>
                  )}
              </Button>
              <Button
                  variant="outline"
                  className="h-12 w-full sm:w-12 rounded-xl border-2 hover:bg-primary/5 hover:text-primary transition-colors flex items-center justify-center gap-2 sm:gap-0"
                  onClick={() => setShowSettings(true)}
              >
                  <Settings className="h-5 w-5 shrink-0" />
                  <span className="sm:hidden text-sm font-semibold">Settings</span>
              </Button>
          </div>
        </CardContent>

        {/* <div className="text-xs text-destructive-foreground/80 text-center bg-destructive/10 px-4 py-2 rounded-full font-medium">
          Long press for 3s to trigger silently
        </div> */}
      </Card>

      <VoiceSettingsDialog 
        open={showSettings} 
        onOpenChange={setShowSettings} 
      />
    </>
  );
}
