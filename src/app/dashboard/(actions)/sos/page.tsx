"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { io, Socket } from "socket.io-client";
import { toast } from "sonner";
import { Shield, MapPin, CheckCircle, AlertTriangle, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { SOS } from "@/lib/api";
import dynamic from "next/dynamic";

const SOSMap = dynamic(() => import("@/components/common/SOSMap"), { 
    ssr: false,
    loading: () => <div className="h-full w-full bg-gray-900 rounded-xl" />
});

const UPDATE_INTERVAL_MS = 5000; 

export default function SOSActivePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const sessionId = searchParams?.get("sessionId");

  const [location, setLocation] = useState<{ lat: number; lon: number } | null>(null);
  const [history, setHistory] = useState<{ latitude: number; longitude: number }[]>([]);
  const [isResolving, setIsResolving] = useState(false);
  const [lastUpdateTime, setLastUpdateTime] = useState<Date | null>(null);
  const [socketConnected, setSocketConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const socketRef = useRef<Socket | null>(null);
  const watchIdRef = useRef<number | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const wakeLockRef = useRef<any>(null);

  const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

  const requestWakeLock = async () => {
    try {
      if ("wakeLock" in navigator) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        wakeLockRef.current = await (navigator as any).wakeLock.request("screen");
        console.log("Wake Lock active");
      }
    } catch (err) {
      console.error("Wake Lock failed:", err);
    }
  };

  const lastSentTimeRef = useRef<number>(0);

  const handleLocationUpdate = useCallback(async (pos: GeolocationPosition) => {
    const lat = pos.coords.latitude;
    const lon = pos.coords.longitude;
    const acc = pos.coords.accuracy;
    const speed = pos.coords.speed;

    setLocation({ lat, lon });
    setHistory((prev) => [...prev, { latitude: lat, longitude: lon }]);
    setLastUpdateTime(new Date());

    if (!sessionId) return;

    const now = Date.now();
    if (now - lastSentTimeRef.current < UPDATE_INTERVAL_MS) {
        return;
    }
    lastSentTimeRef.current = now;

    if (socketRef.current?.connected) {
      socketRef.current.emit("location_update", {
        sessionId,
        latitude: lat,
        longitude: lon,
        accuracy: acc,
        speed: speed || undefined,
      });
    } else {
      try {
        await SOS.pushLocation({
          sessionId,
          latitude: lat,
          longitude: lon,
          accuracy: acc,
          speed: speed || undefined,
        });
      } catch (err) {
        console.error("REST fallback failed:", err);
      }
    }
  }, [sessionId]);

  useEffect(() => {
    if (!sessionId) {
      setError("Active SOS session ID missing. Unable to track.");
      return;
    }

  
    const socket = io(BACKEND_URL, { withCredentials: true });
    socketRef.current = socket;

    socket.on("connect", () => {
      setSocketConnected(true);
      setError(null);
    });

    socket.on("disconnect", () => {
      setSocketConnected(false);
    });

    socket.on("track_error", (err) => {
      console.error("Socket tracking error:", err);
      if (err.message?.includes("ended") || err.message?.includes("no longer active")) {
        toast.info("SOS session has been resolved or expired.");
        router.push("/dashboard");
      }
    });

    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser.");
    } else {
      watchIdRef.current = navigator.geolocation.watchPosition(
        handleLocationUpdate,
      (err) => {
        console.error("Geolocation error full:", err);
        let errorMsg = "An unknown location error occurred.";
        
        if (err.code === 1) { 
          errorMsg = "Location access denied. Please enable GPS and allow browser permissions to share your location.";
        } else if (err.code === 2) { 
          errorMsg = "Location information is unavailable. Ensure GPS is on and you have a clear view of the sky.";
        } else if (err.code === 3) { 
          errorMsg = "Location request timed out. Retrying...";
        }

        setError(errorMsg);
        toast.error(errorMsg, { id: "geo-error" });
      },
      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 0
      }
    );
    }
    
    requestWakeLock();

    return () => {
      if (watchIdRef.current !== null) {
        navigator.geolocation.clearWatch(watchIdRef.current);
      }
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
      if (wakeLockRef.current) {
        wakeLockRef.current.release().then(() => {
          wakeLockRef.current = null;
        });
      }
    };
  }, [sessionId, BACKEND_URL, handleLocationUpdate, router]);

  const handleResolve = async () => {
    if (!sessionId) return;
    setIsResolving(true);
    try {
      await SOS.resolve(sessionId);
      if (socketRef.current) {
        socketRef.current.emit("resolve_sos", { sessionId });
      }
      toast.success("Glad you are safe! SOS resolved.");
      router.push("/dashboard");
    } catch {
      toast.error("Failed to resolve SOS. Please try again.");
    } finally {
      setIsResolving(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center space-y-2">
          <div className="mx-auto w-20 h-20 bg-red-600/20 rounded-full flex items-center justify-center animate-pulse border-4 border-red-600">
            <Shield className="w-10 h-10 text-red-600" />
          </div>
          <h1 className="text-3xl font-extrabold text-white">SOS ACTIVE</h1>
          <p className="text-red-400 font-medium">Your location is being tracked by guardians.</p>
        </div>

        <Card className="bg-gray-900 border-red-900/50 text-white">
          <CardHeader>
            <CardTitle className="text-xl flex items-center gap-2">
              <MapPin className="text-red-500" /> Live Status
            </CardTitle>
            <CardDescription className="text-gray-400">
              {socketConnected 
                ? "Connected to real-time tracking network." 
                : "Using backup connection (REST fallback)."}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {location ? (
            <div className="relative h-64 w-full rounded-xl overflow-hidden border border-gray-700">
               <SOSMap 
                  center={location} 
                  history={history}
                  className="h-full w-full rounded-xl opacity-80" 
               />
               <div className="absolute inset-x-0 bottom-4 flex justify-center z-10">
                  <div className="bg-black/60 backdrop-blur-md px-3 py-1 rounded-full border border-red-900/30 text-[10px] text-gray-300">
                    {location.lat.toFixed(4)}, {location.lon.toFixed(4)}
                  </div>
               </div>
            </div>
          ) : (
              <div className="h-32 flex items-center justify-center border-2 border-dashed border-gray-800 rounded-lg">
                <div className="text-center text-gray-500">
                  <div className="w-8 h-8 border-2 border-red-500 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
                  <p>Initializing GPS...</p>
                </div>
              </div>
            )}

            {error && (
              <div className="bg-red-900/20 border border-red-600/50 p-3 rounded-lg flex items-center gap-3 text-red-200 text-sm">
                <AlertTriangle className="w-5 h-5 flex-shrink-0" />
                <p>{error}</p>
              </div>
            )}

            {lastUpdateTime && (
              <p className="text-center text-xs text-gray-500 uppercase tracking-widest">
                Last update: {lastUpdateTime.toLocaleTimeString()}
              </p>
            )}
          </CardContent>
          <CardFooter className="flex flex-col gap-3">
            <Button 
              onClick={handleResolve}
              disabled={isResolving}
              className="w-full h-14 text-xl font-bold bg-green-600 hover:bg-green-700 text-white rounded-xl shadow-lg shadow-green-900/20 transition-all active:scale-95"
            >
              <CheckCircle className="mr-2 h-6 w-6" /> I AM SAFE
            </Button>
            <p className="text-[10px] text-center text-gray-600 leading-tight">
              Keep this screen active and visible. Locking your phone or closing the browser may disrupt live tracking for your guardians.
            </p>
          </CardFooter>
        </Card>

        <div className="flex justify-center">
            <Button 
              variant="ghost" 
              onClick={() => router.push("/dashboard")}
              className="text-gray-500 hover:text-white hover:bg-gray-800"
            >
                <LogOut className="mr-2 h-4 w-4" /> Go back to dashboard
            </Button>
        </div>
      </div>
    </div>
  );
}
