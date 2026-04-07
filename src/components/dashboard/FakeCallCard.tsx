"use client";

import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Settings2, PhoneCall } from "lucide-react";
import dynamic from "next/dynamic";

// Lazy load heavy components
const FakeCall = dynamic(() => import("@/components/common/fakeCall"), {
  ssr: false,
});
const FakeCallSettings = dynamic(
  () => import("@/components/common/fakeCallSettings"),
  { ssr: false }
);

interface Settings {
  name: string;
  photo: string;
  ringtone: string;
  voice: string;
}

export function FakeCallCard() {
  const [openSettings, setOpenSettings] = useState(false);
  const [fakeCall, setFakeCall] = useState(false);
  const [delay, setDelay] = useState(10);
  const [countdown, setCountdown] = useState<number | null>(null);
  const [pending, setPending] = useState(false);
  const [settings, setSettings] = useState<Settings>({
    name: "Mom",
    photo: "/mom.jpg",
    ringtone: "/fake-ring.mp3",
    voice: "/voice1.mp3",
  });

  const schedule = () => {
    // Trigger Fullscreen immediately on user gesture to avoid permission errors
    if (document.documentElement.requestFullscreen) {
      document.documentElement.requestFullscreen().catch((err) => {
        console.error(
          `Error attempting to enable full-screen mode: ${err.message}`
        );
      });
    }
    setPending(true);
    setCountdown(delay);
  };

  useEffect(() => {
    if (!pending || countdown === null) return;
    if (countdown === 0) {
      setPending(false);
      setCountdown(null);
      setFakeCall(true);
      return;
    }
    const id = setTimeout(
      () => setCountdown((prev) => (prev !== null ? prev - 1 : null)),
      1000
    );
    return () => clearTimeout(id);
  }, [pending, countdown]);

  return (
    <Card className="relative flex flex-col h-full shadow-md hover:shadow-lg transition-all">
      <CardHeader className="">
         <div className="flex justify-between items-start">
            <div>
                <CardTitle className="text-xl font-bold text-primary">Fake Call</CardTitle>
                <p className="text-sm text-muted-foreground mt-1">
                    Trigger a fake incoming call to exit unsafe situations.
                </p>
            </div>
                <Button variant="ghost" size="icon" onClick={() => setOpenSettings(true)}>
                <Settings2 className="h-4 w-4" />
            </Button>
         </div>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col items-center justify-center gap-6 pb-8">
        <div className="flex flex-col items-center gap-4">
          <Button
              size="lg"
              className="w-24 h-24 rounded-full bg-primary hover:bg-primary/90 flex flex-col items-center justify-center shadow-xl hover:scale-105 transition-all relative overflow-visible"
              onClick={schedule}
              disabled={pending}
          >
              <PhoneCall className="w-10 h-10" />
          </Button>

          <div className="h-4">
            {pending && countdown !== null && (
              <span className="text-xs font-bold animate-pulse text-primary flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-primary animate-ping" />
                Triggering in {countdown}s
              </span>
            )}
          </div>
        </div>
        
        <div className="text-sm text-muted-foreground flex items-center gap-2 bg-muted/50 px-3 py-1 rounded-md">
            <span>Delay:</span>
            <select title="delay"
            className="bg-transparent font-medium text-foreground focus:outline-none cursor-pointer"
            value={delay}
            onChange={(e) => setDelay(Number(e.target.value))}
            >
            {[0, 5, 10, 30].map((v) => (
                <option value={v} key={v}>
                {v}s
                </option>
            ))}
            </select>
        </div>
      </CardContent>

      {openSettings && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-50 p-4">
          <Card className="w-full max-w-md">
              <FakeCallSettings
                onSave={(s: Settings) => {
                setSettings(s);
                setOpenSettings(false);
                }}
            />
             <div className="p-4 pt-0 flex justify-end">
                <Button variant="ghost" onClick={() => setOpenSettings(false)}>Cancel</Button>
            </div>
          </Card>
        </div>
      )}
      {fakeCall && (
        <FakeCall onClose={() => setFakeCall(false)} settings={settings} />
      )}
    </Card>
  );
}


