"use client";
import { useEffect, useState } from "react";
// import RequireAuth from "@/components/common/RequireAuth";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { SOS } from "@/lib/api";
import * as LocationApi from "@/lib/api/location";
import Link from "next/link";

type SosLog = {
  id: string;
  triggeredAt: string;
  resolved: boolean;
  latitude?: number;
  longitude?: number;
  timerId?: string;
};

type LocationLog = {
  id: string;
  createdAt: string;
  event: string;
  latitude: number;
  longitude: number;
  timerId?: string;
};

export default function LogsPage() {
  const [sos, setSos] = useState<SosLog[]>([]);
  const [locations, setLocations] = useState<LocationLog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    async function load() {
      setLoading(true);
      try {
        const [sosRes, locRes] = await Promise.all([SOS.logs(), LocationApi.getRecent()]);
        const sosList: SosLog[] = sosRes?.data?.sosLogs || [];
        const locList: LocationLog[] = locRes?.data?.logs || [];
        if (!mounted) return;
        setSos(sosList);
        setLocations(locList);
      } finally {
        if (mounted) setLoading(false);
      }
    }
    load();
    return () => {
      mounted = false;
    };
  }, []);

  // Loading state moved inside main return to act as content, not wrapper


  return (
    <div className="flex-1 space-y-6">
      <div className="flex flex-col space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Activity Logs</h2>
        <p className="text-muted-foreground">
            View your recent SOS alerts and location history.
        </p>
      </div>

      {loading ? (
         <div className="grid gap-4">
            <div className="h-32 w-full animate-pulse rounded-xl bg-muted/20" />
            <div className="h-64 w-full animate-pulse rounded-xl bg-muted/20" />
         </div>
      ) : (
        <Tabs defaultValue="sos" className="space-y-4">
            <TabsList>
              <TabsTrigger value="sos">SOS Alerts</TabsTrigger>
              <TabsTrigger value="locations">Location History</TabsTrigger>
            </TabsList>

            <TabsContent value="sos" className="space-y-4">
              <Card className="p-4">
                <CardHeader>
                  <CardTitle>Recent SOS Alerts</CardTitle>
                   <CardDescription>
                    Alerts triggered by you or automatic safety checks.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {sos.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-8 text-center text-muted-foreground">
                        <p>No SOS alerts recorded.</p>
                    </div>
                  ) : (
                    <div className="rounded-md border">
                        <Table>
                        <TableHeader>
                            <TableRow>
                            <TableHead>Timestamp</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Trigger Source</TableHead>
                            <TableHead>Location</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {sos.map((row) => (
                            <TableRow key={row.id}>
                                <TableCell className="font-medium">
                                    {new Date(row.triggeredAt).toLocaleString()}
                                </TableCell>
                                <TableCell>
                                    <Badge variant={row.resolved ? "secondary" : "destructive"}>
                                        {row.resolved ? "Resolved" : "Active"}
                                    </Badge>
                                </TableCell>
                                <TableCell>
                                    {row.timerId ? (
                                        <div className="flex items-center gap-2">
                                            <span className="text-muted-foreground">Safety Timer</span>
                                            <Link href={`/dashboard/timers/${row.timerId}`} className="text-xs text-primary underline underline-offset-4">
                                                View
                                            </Link>
                                        </div>
                                    ) : (
                                        "Manual Trigger"
                                    )}
                                </TableCell>
                                <TableCell>
                                {row.latitude != null && row.longitude != null ? (
                                    <a
                                        className="flex items-center gap-1 text-primary hover:underline underline-offset-4"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        href={`https://www.google.com/maps?q=${row.latitude},${row.longitude}`}
                                    >
                                        <MapPin className="h-4 w-4" />
                                        {row.latitude.toFixed(5)}, {row.longitude.toFixed(5)}
                                    </a>
                                ) : (
                                    <span className="text-muted-foreground">—</span>
                                )}
                                </TableCell>
                            </TableRow>
                            ))}
                        </TableBody>
                        </Table>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="locations" className="space-y-4">
              <Card className="p-4">
                <CardHeader>
                  <CardTitle>Location History</CardTitle>
                  <CardDescription>
                    Recorded location snapshots from your device.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {locations.length === 0 ? (
                     <div className="flex flex-col items-center justify-center py-8 text-center text-muted-foreground">
                        <p>No location history available.</p>
                    </div>
                  ) : (
                    <div className="rounded-md border">
                        <Table>
                        <TableHeader>
                            <TableRow>
                            <TableHead>Timestamp</TableHead>
                            <TableHead>Event</TableHead>
                            <TableHead>Coordinates</TableHead>
                            <TableHead>Action</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {locations.map((row) => (
                            <TableRow key={row.id}>
                                <TableCell className="font-medium">
                                    {new Date(row.createdAt).toLocaleString()}
                                </TableCell>
                                <TableCell className="capitalize">{row.event}</TableCell>
                                <TableCell>
                                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                                        <MapPin className="h-3 w-3" />
                                        {row.latitude.toFixed(5)}, {row.longitude.toFixed(5)}
                                    </div>
                                </TableCell>
                                <TableCell>
                                {row.timerId ? (
                                    <Link className="text-primary hover:underline underline-offset-4" href={`/dashboard/timers/${row.timerId}`}>
                                    View Timer
                                    </Link>
                                ) : (
                                    <span className="text-muted-foreground">—</span>
                                )}
                                </TableCell>
                            </TableRow>
                            ))}
                        </TableBody>
                        </Table>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
        </Tabs>
      )}
    </div>
  );
}


