"use client";
import React, { useState, useEffect } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@radix-ui/react-label";
import { Play, StopCircle, ArrowLeft } from "lucide-react";
import CircularProgress from "@mui/material/CircularProgress";
import { Timer } from "@/lib/api";
import { getCurrentLocation, logLocation } from "@/lib/locationService";
import { useRouter } from "next/navigation";

export default function SafetyTimer() {
  const router = useRouter();
  const [duration, setDuration] = useState(30);
  const [shareLocation, setShareLocation] = useState(false);
  const [countdown, setCountdown] = useState<number | null>(null);
  const [timerActive, setTimerActive] = useState(false);
  const [progress, setProgress] = useState(100);
  const [loading, setLoading] = useState(false);
  const [currentTimerId, setCurrentTimerId] = useState<string | null>(null);

  const startTimer = async () => {
    try {
      setLoading(true);
      let loc: { latitude: number; longitude: number } | null = null;

      if (shareLocation) {
        loc = await getCurrentLocation();
        loc = await getCurrentLocation();
      }

      const response = await Timer.start({
        duration,
        shareLocation: !!loc,
        latitude: loc?.latitude,
        longitude: loc?.longitude,
      });

      const timerId = response?.data?.timer?.id;
      if (timerId) setCurrentTimerId(timerId);

      // Log location snapshot when timer starts (if location was captured)
      if (loc && timerId) {
        await logLocation({
          latitude: loc.latitude,
          longitude: loc.longitude,
          timerId,
          event: "started",
        });
      }

      setCountdown(duration * 60);
      setTimerActive(true);
    } catch (e) {
      console.error("Failed to start timer:", e);
    } finally {
      setLoading(false);
    }
  };

  const cancelTimer = async () => {
    const wasActive = timerActive;
    setCountdown(null);
    setTimerActive(false);

    // Log location snapshot when timer is cancelled
    if (wasActive && currentTimerId) {
      const loc = await getCurrentLocation();
      if (loc) {
        await logLocation({
          latitude: loc.latitude,
          longitude: loc.longitude,
          timerId: currentTimerId,
          event: "cancelled",
        });
      }
    }

    setCurrentTimerId(null);

    try {
      await Timer.cancel();
      console.log("Timer cancelled successfully");
    } catch (e) {
      console.error("Failed to cancel timer:", e);
    }
  };


  const expiryHandled = React.useRef(false);

  // Reset expiry ref when timer starts
  useEffect(() => {
    if (timerActive) {
      expiryHandled.current = false;
    }
  }, [timerActive]);

  useEffect(() => {
    let interval: NodeJS.Timeout | undefined;
    if (countdown && countdown > 0) {
      interval = setInterval(() => {
        setCountdown((prev) => (prev ? prev - 1 : 0));
      }, 1000);
    } else if (countdown === 0) {
        // Prevent double execution
       if (expiryHandled.current) return;
       expiryHandled.current = true;

      setTimerActive(false);
      toast.error("Safety timer expired! SOS has been sent to your contacts.");

      // Log location snapshot when timer expires
      // "Second Chance" logic: Always try to get location, but fail silently if denied
      if (currentTimerId) {
        getCurrentLocation()
            .then((loc) => {
                if (loc) {
                    logLocation({
                    latitude: loc.latitude,
                    longitude: loc.longitude,
                    timerId: currentTimerId,
                    event: "expired",
                    });
                }
            })
            .catch((err) => {
                // User denied or failed; respect wish and proceed without location
                console.log("Location not shared on expiry:", err);
            });
      }

      setCurrentTimerId(null);
    }

    return () => clearInterval(interval);
  }, [countdown, currentTimerId]);

  useEffect(() => {
    let animationFrame: number;

    const updateProgress = () => {
      if (countdown !== null && duration > 0) {
        const total = duration * 60;
        const elapsed = total - countdown;
        const progressValue = (elapsed / total) * 100;
        setProgress(progressValue);
      }
      animationFrame = requestAnimationFrame(updateProgress);
    };

    animationFrame = requestAnimationFrame(updateProgress);

    return () => cancelAnimationFrame(animationFrame);
  }, [countdown, duration]);

  const formatTime = (secs: number) => {
    const h = Math.floor(secs / 3600);
    const m = Math.floor((secs % 3600) / 60);
    const s = secs % 60;
    return `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] p-4 relative">
      <Button 
        variant="ghost" 
        onClick={() => router.push("/dashboard/actions")}
        className="absolute top-0 left-4 flex items-center gap-2 text-primary hover:bg-primary/10"
      >
        <ArrowLeft size={18} />
        Back to Actions
      </Button>

      <Card className="m-4 p-6 lg:w-[600px] w-full shadow-lg border-primary/10">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl text-primary font-bold">
            Safety Timer
          </CardTitle>
          <p className="text-gray-500 mt-2">Set a timer for automatic check-ins</p>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <Label className="font-medium">Duration</Label>
              <span className="text-primary font-bold text-lg">{duration} min</span>
            </div>
            <Input
              type="range"
              min="1"
              max="240"
              step="1"
              value={duration}
              onChange={(e) => setDuration(parseInt(e.target.value))}
              className="accent-primary cursor-pointer"
              disabled={timerActive}
            />
          </div>

          <div className="flex items-center justify-between p-4 bg-accent/30 rounded-xl">
            <div className="flex flex-col">
              <span className="font-medium">Share Location</span>
              <span className="text-xs text-gray-500">Attach location to the alert</span>
            </div>
            <Switch
              checked={shareLocation}
              onCheckedChange={() => setShareLocation(!shareLocation)}
              disabled={timerActive}
            />
          </div>

          {!timerActive ? (
            <Button
              onClick={startTimer}
              className="w-full py-6 text-lg rounded-xl shadow-md transition-all active:scale-95"
              disabled={loading}
            >
              {loading ? (
                <>
                  <CircularProgress size={20} color="inherit" className="mr-2" />
                  Starting...
                </>
              ) : (
                <>
                  <Play className="mr-2" size={20} />
                  Start Safety Timer
                </>
              )}
            </Button>
          ) : (
            <div className="flex flex-col items-center gap-6 py-4">
              <div className="relative w-48 h-48 flex items-center justify-center">
                <svg className="transform -rotate-90" width="192" height="192">
                  <defs>
                    <linearGradient id="timerGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#8b5cf6" />
                      <stop offset="100%" stopColor="#d946ef" />
                    </linearGradient>
                  </defs>
                  <circle cx="96" cy="96" r="86" stroke="#f3f4f6" strokeWidth="12" fill="none" />
                  <circle
                    cx="96"
                    cy="96"
                    r="86"
                    stroke={countdown !== null && countdown <= 60 ? "#ef4444" : "url(#timerGradient)"}
                    strokeWidth="12"
                    strokeDasharray={540}
                    strokeDashoffset={`${540 * (1 - progress / 100)}`}
                    strokeLinecap="round"
                    fill="none"
                    className="transition-all duration-1000 ease-linear"
                  />
                </svg>
                <div className="absolute flex flex-col items-center">
                  <span className="text-3xl font-bold tracking-wider tabular-nums">
                    {formatTime(countdown ?? 0)}
                  </span>
                  <span className="text-[10px] uppercase text-gray-400 font-bold tracking-widest mt-1">
                    Remaining
                  </span>
                </div>
              </div>

              <div className="text-center">
                <p className="text-sm text-gray-500 mb-1">
                  Active for {Math.floor((duration * 60 - (countdown || 0)) / 60)}m {Math.floor((duration * 60 - (countdown || 0)) % 60)}s
                </p>
                <Button
                  onClick={cancelTimer}
                  variant="destructive"
                  className="px-8 rounded-full shadow-lg"
                >
                  <StopCircle className="mr-2" size={18} />
                  Stop Timer
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
