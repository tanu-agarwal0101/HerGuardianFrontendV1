"use client";
import React, { useState, useEffect } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StopCircle, Clock, MapPin, Shield } from "lucide-react";
import { Timer } from "@/lib/api";
import { getCurrentLocation, logLocation } from "@/lib/locationService";
import { motion, AnimatePresence } from "motion/react";

export default function SafetyTimer() {

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
      }

      const response = await Timer.start({
        duration,
        shareLocation: !!loc,
        latitude: loc?.latitude,
        longitude: loc?.longitude,
      });

      const timerId = response?.data?.timer?.id;
      if (timerId) setCurrentTimerId(timerId);

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
      toast.error("Failed to start safety timer. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const cancelTimer = async () => {
    const wasActive = timerActive;
    setCountdown(null);
    setTimerActive(false);

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
      toast.success("Timer cancelled securely.");
    } catch (e) {
      console.error("Failed to cancel timer:", e);
    }
  };


  const expiryHandled = React.useRef(false);

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
       if (expiryHandled.current) return;
       expiryHandled.current = true;

      setTimerActive(false);
      toast.error("Safety timer expired! SOS has been sent to your contacts.");

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

    if (timerActive) {
        animationFrame = requestAnimationFrame(updateProgress);
    }

    return () => cancelAnimationFrame(animationFrame);
  }, [countdown, duration, timerActive]);

  const formatTime = (secs: number) => {
    const h = Math.floor(secs / 3600);
    const m = Math.floor((secs % 3600) / 60);
    const s = secs % 60;
    
    if (h > 0) {
        return `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
    }
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  // Premium Duration Presets
  const presets = [15, 30, 45, 60, 120];

  return (
    <div className="flex flex-col items-center justify-center min-h-[85vh] p-4 relative w-full max-w-2xl mx-auto">
      
      {/* Background Glows for Glassmorphism Context */}
      <div className="absolute top-1/4 left-0 w-64 h-64 bg-primary/10 rounded-full blur-[100px] -z-10" />
      <div className="absolute bottom-1/4 right-0 w-64 h-64 bg-secondary/10 rounded-full blur-[100px] -z-10" />

      <Card className="w-full bg-card/60 backdrop-blur-2xl border-white/10 dark:border-white/5 shadow-2xl relative overflow-hidden group">
        
        {/* Animated subtle top border */}
        <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-primary/0 via-primary to-primary/0 opacity-50 group-hover:opacity-100 transition-opacity duration-1000" />
        
        <CardHeader className="text-center pt-8 pb-4 space-y-4">
            <div className="flex justify-center">
                <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center transform -rotate-6 transition-transform group-hover:rotate-0 duration-500">
                    <Clock className="w-7 h-7 text-primary transition-transform group-hover:scale-110 duration-500" />
                </div>
            </div>
          <CardTitle className="text-3xl font-bold tracking-tight text-foreground">
            Safety Timer
          </CardTitle>
          <p className="text-muted-foreground text-sm font-medium px-4">
            Your trusted companion. Automatically triggers an SOS if you don&apos;t check in before time runs out.
          </p>
        </CardHeader>

        <CardContent className="px-6 pb-8 sm:px-10 sm:pb-10 pt-4">
            <AnimatePresence mode="wait">
                
                {/* --- SETUP STATE --- */}
                {!timerActive ? (
                    <motion.div 
                        key="setup"
                        initial={{ opacity: 0, scale: 0.95, filter: "blur(4px)" }}
                        animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                        exit={{ opacity: 0, scale: 0.95, filter: "blur(4px)" }}
                        transition={{ duration: 0.4, ease: "easeInOut" }}
                        className="space-y-8"
                    >
                        {/* Interactive Duration Selector */}
                        <div className="flex flex-col items-center space-y-6 bg-background/50 rounded-3xl p-6 border border-border/50 shadow-inner">
                            <span className="text-sm font-bold text-muted-foreground uppercase tracking-widest">Select Duration</span>
                            
                            <div className="flex items-center justify-center gap-6">
                                <Button 
                                    variant="outline" 
                                    size="icon" 
                                    className="h-12 w-12 rounded-full border-primary/20 text-primary hover:bg-primary/10"
                                    onClick={() => setDuration(Math.max(5, duration - 5))}
                                    disabled={duration <= 5}
                                >
                                    <span className="text-2xl font-light">-</span>
                                </Button>
                                
                                <div className="text-center w-32">
                                    <motion.span 
                                        key={duration}
                                        initial={{ y: -10, opacity: 0 }}
                                        animate={{ y: 0, opacity: 1 }}
                                        className="text-6xl font-black text-foreground tabular-nums tracking-tighter"
                                    >
                                        {duration}
                                    </motion.span>
                                    <span className="text-xl font-medium text-muted-foreground ml-1">min</span>
                                </div>
                                
                                <Button 
                                    variant="outline" 
                                    size="icon" 
                                    className="h-12 w-12 rounded-full border-primary/20 text-primary hover:bg-primary/10"
                                    onClick={() => setDuration(Math.min(240, duration + 5))}
                                    disabled={duration >= 240}
                                >
                                    <span className="text-2xl font-light">+</span>
                                </Button>
                            </div>

                            {/* Presets */}
                            <div className="flex flex-wrap justify-center gap-2 pt-2">
                                {presets.map((preset) => (
                                    <Button
                                        key={preset}
                                        variant={duration === preset ? "default" : "outline"}
                                        size="sm"
                                        className={`rounded-full px-4 font-medium transition-all ${
                                            duration === preset 
                                            ? "shadow-md bg-primary text-primary-foreground" 
                                            : "border-border/50 text-muted-foreground hover:text-foreground"
                                        }`}
                                        onClick={() => setDuration(preset)}
                                    >
                                        {preset}m
                                    </Button>
                                ))}
                            </div>
                        </div>

                        {/* Location Toggle */}
                        <div className="flex items-center justify-between p-5 bg-card border border-border/50 rounded-2xl shadow-sm hover:border-primary/30 transition-colors">
                            <div className="flex items-center gap-4">
                                <div className={`p-2 rounded-xl transition-colors ${shareLocation ? 'bg-primary/10 text-primary' : 'bg-muted text-muted-foreground'}`}>
                                    <MapPin className="h-5 w-5" />
                                </div>
                                <div className="flex flex-col">
                                    <span className="font-semibold text-foreground">Live Location</span>
                                    <span className="text-xs font-medium text-muted-foreground mt-0.5">Attach GPS coordinates to SOS</span>
                                </div>
                            </div>
                            <Switch
                                checked={shareLocation}
                                onCheckedChange={() => setShareLocation(!shareLocation)}
                                className="data-[state=checked]:bg-primary"
                            />
                        </div>

                        {/* Start Button */}
                        <div className="pt-2">
                            <Button
                                onClick={startTimer}
                                disabled={loading}
                                className="w-full h-14 text-lg font-bold rounded-2xl shadow-[0_0_40px_-10px_rgba(99,102,241,0.5)] hover:shadow-[0_0_60px_-15px_rgba(99,102,241,0.7)] transition-all bg-primary hover:bg-primary/90 text-white relative overflow-hidden group"
                            >
                                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-[100%] group-hover:animate-[shimmer_2s_infinite]" />
                                {loading ? (
                                    <span className="flex items-center gap-2">
                                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                        Initializing Shield...
                                    </span>
                                ) : (
                                    <span className="flex items-center justify-center gap-2 w-full">
                                        <Shield className="w-5 h-5" />
                                        Activate Safety Timer
                                    </span>
                                )}
                            </Button>
                        </div>
                    </motion.div>
                ) : (
                    
                    /* --- ACTIVE TIMER STATE --- */
                    <motion.div 
                        key="active"
                        initial={{ opacity: 0, scale: 0.95, filter: "blur(4px)" }}
                        animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                        exit={{ opacity: 0, scale: 0.95, filter: "blur(4px)" }}
                        transition={{ duration: 0.5, ease: "backOut" }}
                        className="flex flex-col items-center py-6 space-y-10"
                    >
                        {/* Premium SVG Progress Ring */}
                        <div className="relative flex items-center justify-center group">
                            {/* Inner ambient glow */}
                            <div className="absolute inset-0 bg-primary/5 rounded-full blur-2xl transition-all duration-1000" />
                            
                            <svg className="transform -rotate-90 w-64 h-64 sm:w-72 sm:h-72 drop-shadow-2xl">
                                <defs>
                                    <linearGradient id="activeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                                        <stop offset="0%" stopColor="#818cf8" />
                                        <stop offset="50%" stopColor="#6366f1" />
                                        <stop offset="100%" stopColor="#4f46e5" />
                                    </linearGradient>
                                    <linearGradient id="dangerGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                                        <stop offset="0%" stopColor="#fca5a5" />
                                        <stop offset="100%" stopColor="#ef4444" />
                                    </linearGradient>
                                    {/* Subtle shadow filter for the glowing ring */}
                                    <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                                        <feGaussianBlur stdDeviation="6" result="blur" />
                                        <feComposite in="SourceGraphic" in2="blur" operator="over" />
                                    </filter>
                                </defs>
                                
                                {/* Background Ring */}
                                <circle 
                                    cx="50%" 
                                    cy="50%" 
                                    r="44%" 
                                    className="stroke-muted/30 dark:stroke-muted/10" 
                                    strokeWidth="6" 
                                    fill="none" 
                                />
                                {/* Track Ring (Thicker) */}
                                <circle 
                                    cx="50%" 
                                    cy="50%" 
                                    r="44%" 
                                    className="stroke-card dark:stroke-background" 
                                    strokeWidth="14" 
                                    fill="none" 
                                />
                                
                                {/* Active Animated Ring */}
                                {progress > 0 && (
                                    <circle
                                        cx="50%"
                                        cy="50%"
                                        r="44%"
                                        stroke={countdown !== null && countdown <= 60 ? "url(#dangerGradient)" : "url(#activeGradient)"}
                                        strokeWidth="14"
                                        strokeDasharray="276%" /* Circumference approximation */
                                        strokeDashoffset={`${276 * (1 - progress / 100)}%`}
                                        strokeLinecap="round"
                                        fill="none"
                                        filter="url(#glow)"
                                        className="transition-all duration-1000 ease-linear origin-center"
                                    />
                                )}
                            </svg>

                            <div className="absolute flex flex-col items-center justify-center inset-0 backdrop-blur-[2px] rounded-full m-4">
                                <motion.span 
                                    className={`text-6xl sm:text-7xl font-black tabular-nums tracking-tighter ${countdown !== null && countdown <= 60 ? 'text-destructive animate-pulse' : 'text-foreground'}`}
                                    animate={countdown !== null && countdown <= 60 ? { scale: [1, 1.05, 1] } : {}}
                                    transition={{ repeat: Infinity, duration: 1 }}
                                >
                                    {formatTime(countdown ?? 0)}
                                </motion.span>
                                <span className="text-sm font-bold text-muted-foreground uppercase tracking-[0.2em] mt-2">
                                    Remaining
                                </span>
                            </div>
                        </div>

                        {/* Status & Cancel Control */}
                        <div className="flex flex-col items-center w-full space-y-6">
                            <div className="flex items-center justify-center gap-2 px-4 py-2 bg-primary/5 rounded-full border border-primary/10">
                                <Shield className="w-4 h-4 text-primary" />
                                <span className="text-sm font-semibold text-primary">Guardian Active</span>
                                <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse ml-1" />
                            </div>

                            <Button
                                onClick={cancelTimer}
                                variant="destructive"
                                className="w-full h-14 text-lg font-bold rounded-2xl shadow-lg hover:shadow-xl transition-all hover:bg-destructive/90 group"
                            >
                                <StopCircle className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
                                I&apos;m Safe - Stop Timer
                            </Button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </CardContent>
      </Card>
      
      {/* Footer hint */}
      <p className="text-xs font-medium text-muted-foreground text-center mt-6 max-w-sm">
        Closing the app will not stop the timer. Your trusted contacts will be notified if time expires.
      </p>

    </div>
  );
}
