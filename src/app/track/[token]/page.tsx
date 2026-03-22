"use client";

import { useEffect, useRef, useState } from "react";
import { useParams } from "next/navigation";
import axios from "axios";
import { io, Socket } from "socket.io-client";
import dynamic from "next/dynamic";

const SOSMap = dynamic(() => import("@/components/common/SOSMap"), { 
    ssr: false,
    loading: () => <div className="h-full w-full bg-gray-900" />
});

interface LocationPoint {
  latitude: number;
  longitude: number;
  accuracy?: number;
  speed?: number;
  timestamp: string;
}

interface SessionData {
  sessionId: string;
  status: string;
  expiresAt: string;
  user: { firstName?: string; lastName?: string };
  locations: LocationPoint[];
}

type PageState = "loading" | "active" | "ended" | "not_found" | "error";

export default function TrackingPage() {
  const params = useParams();
  const token = params?.token as string;

  const [pageState, setPageState] = useState<PageState>("loading");
  const [session, setSession] = useState<SessionData | null>(null);
  const [locationHistory, setLocationHistory] = useState<LocationPoint[]>([]);
  const [latestLocation, setLatestLocation] = useState<LocationPoint | null>(null);
  const [endMessage, setEndMessage] = useState("");
  const socketRef = useRef<Socket | null>(null);
  // const mapRef = useRef<HTMLDivElement>(null);

  const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

  useEffect(() => {
    if (!token) return;

    const fetchSession = async () => {
      try {
        const res = await axios.get(`${BACKEND_URL}/api/sos/track/${token}`);
        const data: SessionData = res.data;
        setSession(data);
        setLocationHistory(data.locations);
        if (data.locations.length > 0) {
          setLatestLocation(data.locations[data.locations.length - 1]);
        }
        setPageState("active");
      } catch (err: unknown) {
        const status = (err as { response?: { status?: number } })?.response?.status;
        if (status === 410) {
          setEndMessage("This tracking session has ended. The user is safe or the session expired.");
          setPageState("ended");
        } else if (status === 404) {
          setPageState("not_found");
        } else {
          setPageState("error");
        }
      }
    };

    fetchSession();
  }, [token, BACKEND_URL]);


  useEffect(() => {
    if (pageState !== "active" || !session) return;

    const socket = io(BACKEND_URL, { withCredentials: true });
    socketRef.current = socket;

    socket.on("connect", () => {
      socket.emit("join_track", { token });
    });

    socket.on("track_joined", () => {
    });

    socket.on("location_updated", (point: LocationPoint) => {
      setLatestLocation(point);
      setLocationHistory((prev) => [...prev, point]);
    });

    socket.on("sos_resolved", () => {
      setEndMessage("✅ The user has marked themselves as safe.");
      setPageState("ended");
      socket.disconnect();
    });

    socket.on("track_error", ({ message }: { message: string }) => {
      if (message === "Tracking session has ended") {
        setEndMessage("This tracking session has ended.");
        setPageState("ended");
      }
    });

    return () => {
      socket.disconnect();
    };
  }, [pageState, session, token, BACKEND_URL]);

  const userName = session?.user?.firstName
    ? `${session.user.firstName}${session.user.lastName ? " " + session.user.lastName : ""}`
    : "User";

  const formatTime = (iso: string) =>
    new Date(iso).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" });

  const openOnMap = (lat: number, lon: number) =>
    window.open(`https://www.google.com/maps?q=${lat},${lon}`, "_blank");

  if (pageState === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-950 text-white">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-red-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-400">Loading tracking session...</p>
        </div>
      </div>
    );
  }

  if (pageState === "not_found") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-950 text-white">
        <div className="text-center">
          <div className="text-6xl mb-4">🔍</div>
          <h1 className="text-2xl font-bold mb-2">Session Not Found</h1>
          <p className="text-gray-400">This tracking link is invalid or has been removed.</p>
        </div>
      </div>
    );
  }

  if (pageState === "ended") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-950 text-white">
        <div className="text-center max-w-md">
          <div className="text-6xl mb-4">✅</div>
          <h1 className="text-2xl font-bold mb-2">Session Ended</h1>
          <p className="text-gray-400">{endMessage}</p>
          {locationHistory.length > 0 && latestLocation && (
            <button
              onClick={() => openOnMap(latestLocation.latitude, latestLocation.longitude)}
              className="mt-4 px-4 py-2 bg-red-600 rounded-lg text-sm hover:bg-red-700 transition"
            >
              View Last Known Location
            </button>
          )}
        </div>
      </div>
    );
  }

  if (pageState === "error") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-950 text-white">
        <p className="text-gray-400">Unable to load tracking session. Please try refreshing.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white flex flex-col">
      {/* Header */}
      <div className="bg-red-900/40 border-b border-red-700 px-4 py-3 flex items-center justify-between">
        <div>
          <h1 className="text-lg font-bold text-red-400">🚨 Live SOS Tracking</h1>
          <p className="text-sm text-gray-400">
            Tracking: <span className="text-white font-medium">{userName}</span>
          </p>
        </div>
        <div className="text-right">
          <span className="px-2 py-1 bg-red-600 rounded-full text-xs animate-pulse">● LIVE</span>
          {session?.expiresAt && (
            <p className="text-xs text-gray-500 mt-1">
              Expires: {new Date(session.expiresAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
            </p>
          )}
        </div>
      </div>

      <div className="flex flex-col lg:flex-row flex-1 overflow-hidden">
        {/* Map area */}
        <div className="flex-1 relative bg-gray-900 overflow-hidden">
          {latestLocation ? (
            <div className="h-full w-full">
              <SOSMap 
                center={{ lat: latestLocation.latitude, lon: latestLocation.longitude }}
                history={locationHistory}
                className="h-full w-full"
              />
              {/* Overlay stats */}
              <div className="absolute bottom-4 left-4 z-[1000] bg-gray-950/80 backdrop-blur-md p-3 rounded-lg border border-gray-800 pointer-events-none">
                 <div className="flex items-center gap-2 mb-1">
                    <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                    <span className="text-[10px] text-gray-500 uppercase tracking-widest">Live Updates</span>
                 </div>
                 <p className="text-xs font-mono text-gray-300">
                    {latestLocation.latitude.toFixed(6)}, {latestLocation.longitude.toFixed(6)}
                 </p>
                 {latestLocation.accuracy && (
                    <p className="text-[10px] text-gray-500 mt-1">Accuracy: ±{Math.round(latestLocation.accuracy)}m</p>
                 )}
              </div>
            </div>
          ) : (
            <div className="text-center text-gray-500">
              <div className="w-8 h-8 border-2 border-red-500 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
              <p>Waiting for first location update...</p>
            </div>
          )}
        </div>

        {/* Breadcrumb history sidebar */}
        <div className="w-full lg:w-72 bg-gray-900 border-t lg:border-t-0 lg:border-l border-gray-800 overflow-y-auto max-h-64 lg:max-h-full">
          <div className="px-4 py-3 border-b border-gray-800">
            <h2 className="text-sm font-semibold text-gray-400">
              Location History ({locationHistory.length} points)
            </h2>
          </div>
          <div className="divide-y divide-gray-800">
            {[...locationHistory].reverse().map((point, i) => (
              <button
                key={i}
                onClick={() => openOnMap(point.latitude, point.longitude)}
                className="w-full px-4 py-3 text-left hover:bg-gray-800 transition"
              >
                <p className="font-mono text-xs text-gray-300">
                  {point.latitude.toFixed(5)}, {point.longitude.toFixed(5)}
                </p>
                <p className="text-xs text-gray-600 mt-0.5">{formatTime(point.timestamp)}</p>
              </button>
            ))}
            {locationHistory.length === 0 && (
              <p className="px-4 py-4 text-xs text-gray-600">No history yet.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
