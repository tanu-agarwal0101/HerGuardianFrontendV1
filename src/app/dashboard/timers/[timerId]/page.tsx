"use client";

import { useEffect, useMemo, useState, useCallback } from "react";
import dynamic from "next/dynamic";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Timer, SOS } from "@/lib/api";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { Loader2, AlertTriangle } from "lucide-react";

const LocationMap = dynamic(() => import("@/components/common/LocationMap"), {
  ssr: false,
});

type TimerRecord = {
  id: string;
  duration: number;
  expiresAt: string;
  createdAt: string;
  updatedAt: string;
  isActive: boolean;
  status: string;
  sharedLocation: boolean;
  latitude?: number;
  longitude?: number;
};

type LocationLog = {
  id: string;
  createdAt: string;
  event: string;
  latitude: number;
  longitude: number;
};

type SosLog = {
  id: string;
  triggeredAt: string;
  resolved: boolean;
  latitude?: number;
  longitude?: number;
};

type TimerDetailsPayload = {
  timer: TimerRecord;
  locationLogs: LocationLog[];
  sosLogs: SosLog[];
};

type AxiosLikeError = {
  response?: { data?: { message?: string } };
  message?: string;
};

function formatDate(value?: string) {
  if (!value) return "—";
  try {
    return new Date(value).toLocaleString();
  } catch {
    return value;
  }
}

function formatCoords(lat?: number, lon?: number) {
  if (lat == null || lon == null) return "—";
  return `${lat.toFixed(5)}, ${lon.toFixed(5)}`;
}

const statusVariant: Record<string, string> = {
  active: "bg-green-100 text-green-700",
  escalated: "bg-red-100 text-red-700",
  cancelled: "bg-gray-100 text-gray-700",
};

function getErrorMessage(err: unknown, fallback: string) {
  if (typeof err === "object" && err !== null) {
    const typed = err as AxiosLikeError;
    return typed.response?.data?.message || typed.message || fallback;
  }
  if (typeof err === "string") return err;
  return fallback;
}

export default function TimerDetailsPage() {
  const params = useParams<{ timerId: string }>();
  const timerId = params?.timerId;
  const [data, setData] = useState<TimerDetailsPayload | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [resolving, setResolving] = useState(false);

  const hasActiveSOS = useMemo(() => {
    return data?.sosLogs?.some((log) => !log.resolved) ?? false;
  }, [data]);

  const handleResolveSOS = async () => {
    if (!confirm("Are you sure you want to resolve this emergency? This will notify your guardians that you are safe.")) return;
    
    setResolving(true);
    try {
      // 1. Get the current active session ID for the user
      const sessionRes = await SOS.getActiveSession();
      const sessionId = sessionRes.data?.id;

      if (!sessionId) {
        toast.error("Could not find an active tracking session to resolve.", {
            description: "The session may have already expired or been resolved elsewhere."
        });
        
        await loadData();
        return;
      }

      await SOS.resolve(sessionId);
      toast.success("Emergency resolved successfully. You are marked as safe.");
      
      await loadData();
    } catch (err: unknown) {
      toast.error(getErrorMessage(err, "Failed to resolve SOS"));
    } finally {
      setResolving(false);
    }
  };

  const loadData = useCallback(async () => {
    if (!timerId) return;
    try {
      setLoading(true);
      setError(null);
      const res = await Timer.getDetails(timerId);
      setData(res?.data);
    } catch (err: unknown) {
      setError(getErrorMessage(err, "Failed to load timer details"));
    } finally {
      setLoading(false);
    }
  }, [timerId]);

  useEffect(() => {
    if (timerId) {
      loadData();
    }
  }, [timerId, loadData]);

  const latestLocation = useMemo(() => {
    if (data?.locationLogs?.length) {
      return data.locationLogs[0];
    }
    if (data?.timer?.latitude != null && data?.timer?.longitude != null) {
      return {
        id: "timer-origin",
        createdAt: data.timer.createdAt,
        event: data.timer.status,
        latitude: data.timer.latitude,
        longitude: data.timer.longitude,
      };
    }
    return null;
  }, [data]);

  if (!timerId) {
    return (
      <div className="p-6 text-center text-gray-600">
        Missing timer identifier. Go back to the <Link className="text-purple-600 underline" href="/dashboard/logs">logs</Link>.
      </div>
    );
  }

  if (loading) {
    return (
      <div className="p-6 text-center text-gray-600">
        Loading timer details&hellip;
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="p-6 text-center text-red-600">
        {error || "Timer not found"}
      </div>
    );
  }

  const { timer, locationLogs, sosLogs } = data;

  return (
    <div className="max-w-6xl mx-auto w-full p-4 space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Timer #{timer.id.slice(-6)}</h1>
          <p className="text-sm text-gray-500">Created {formatDate(timer.createdAt)}</p>
        </div>
        <div className="flex items-center gap-3">
            {hasActiveSOS && (
                <Button 
                    variant="destructive" 
                    size="sm" 
                    onClick={handleResolveSOS}
                    disabled={resolving}
                    className="animate-pulse hover:animate-none font-bold shadow-lg shadow-red-900/20"
                >
                    {resolving ? (
                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    ) : (
                        <AlertTriangle className="h-4 w-4 mr-2" />
                    )}
                    Resolve Emergency
                </Button>
            )}
            <Badge className={cn("text-sm px-3 py-1 capitalize", statusVariant[timer.status] || "bg-blue-100 text-blue-700")}>
                {timer.status}
            </Badge>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Timer Summary</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div>
            <p className="text-gray-500">Duration</p>
            <p className="text-lg font-medium">{timer.duration} min</p>
          </div>
          <div>
            <p className="text-gray-500">Expires At</p>
            <p className="text-lg font-medium">{formatDate(timer.expiresAt)}</p>
          </div>
          <div>
            <p className="text-gray-500">Shared Location</p>
            <p className="text-lg font-medium">{timer.sharedLocation ? "Yes" : "No"}</p>
          </div>
          <div>
            <p className="text-gray-500">Status</p>
            <p className="text-lg font-medium capitalize">{timer.status}</p>
          </div>
          <div>
            <p className="text-gray-500">Last Update</p>
            <p className="text-lg font-medium">{formatDate(timer.updatedAt)}</p>
          </div>
          <div>
            <p className="text-gray-500">Active</p>
            <p className="text-lg font-medium">{timer.isActive ? "Yes" : "No"}</p>
          </div>
        </CardContent>
      </Card>

      <Card className="p-4">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Map Preview</CardTitle>
            <p className="text-sm text-gray-500">Latest location snapshot tied to this timer.</p>
          </div>
          <Button asChild variant="outline">
            <Link href="/dashboard/logs">View All Logs</Link>
          </Button>
        </CardHeader>
        <CardContent>
          {latestLocation ? (
            <div className="h-80 rounded-md overflow-hidden border">
              <LocationMap
                lat={latestLocation.latitude}
                lon={latestLocation.longitude}
                label={`Last update (${formatDate(latestLocation.createdAt)})`}
                className="h-full w-full"
              />
            </div>
          ) : (
            <div className="text-sm text-gray-500 text-center py-12">
              No location data recorded for this timer yet.
            </div>
          )}
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card className="p-4">
          <CardHeader>
            <CardTitle>Location Logs</CardTitle>
          </CardHeader>
          <CardContent>
            {locationLogs?.length ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Timestamp</TableHead>
                    <TableHead>Event</TableHead>
                    <TableHead>Coordinates</TableHead>
                    <TableHead className="text-right">Map</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {locationLogs.map((log) => (
                    <TableRow key={log.id}>
                      <TableCell>{formatDate(log.createdAt)}</TableCell>
                      <TableCell className="capitalize">{log.event}</TableCell>
                      <TableCell>{formatCoords(log.latitude, log.longitude)}</TableCell>
                      <TableCell className="text-right">
                        <a
                          className="text-purple-600 underline text-sm"
                          target="_blank"
                          rel="noreferrer"
                          href={`https://www.google.com/maps?q=${log.latitude},${log.longitude}`}
                        >
                          Open
                        </a>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <div className="text-sm text-gray-500 text-center py-12">
                No location snapshots recorded for this timer.
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="p-4">
          <CardHeader>
            <CardTitle>SOS Alerts</CardTitle>
          </CardHeader>
          <CardContent>
            {sosLogs?.length ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Triggered</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Location</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sosLogs.map((log) => (
                    <TableRow key={log.id}>
                      <TableCell>{formatDate(log.triggeredAt)}</TableCell>
                      <TableCell>{log.resolved ? "Resolved" : "Active"}</TableCell>
                      <TableCell>
                        {log.latitude != null && log.longitude != null ? (
                          <a
                            className="text-purple-600 underline text-sm"
                            target="_blank"
                            rel="noreferrer"
                            href={`https://www.google.com/maps?q=${log.latitude},${log.longitude}`}
                          >
                            {formatCoords(log.latitude, log.longitude)}
                          </a>
                        ) : (
                          "—"
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <div className="text-sm text-gray-500 text-center py-12">
                No SOS escalations recorded for this timer.
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

