"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Shield, MapPin, AlertTriangle, Battery, BatteryFull, BatteryLow, BatteryMedium, Wifi, WifiOff, LogOut } from "lucide-react";
import { getGuardianDashboardUsers, revokeGuardianLink } from "@/lib/api/guardian";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { formatDistanceToNow } from "date-fns";

interface DeviceStatus {
  batteryLevel?: number;
  isCharging?: boolean;
  isOnline?: boolean;
  connectionType?: string;
}

interface GuardianUser {
  linkId: string;
  userId: string;
  firstName: string;
  lastName: string;
  profilePicture?: string;
  lastActiveAt: string;
  hasActiveSOS: boolean;
  activeSOSToken?: string;
  deviceStatus?: DeviceStatus | null;
}

export default function GuardianDashboardPage() {
  const router = useRouter();
  const [users, setUsers] = useState<GuardianUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRevoking, setIsRevoking] = useState<string | null>(null);

  const fetchUsers = async () => {
    try {
      const data = await getGuardianDashboardUsers();
      setUsers(data);
    } catch {
      toast.error("Failed to load your guardian dashboard.");

    } finally {
      setIsLoading(false);
    }
  };

  const handleStopWatching = async (linkId: string) => {
    setIsRevoking(linkId);
    try {
      await revokeGuardianLink(linkId);
      toast.success("You are no longer watching this user.");
      setUsers((prev) => prev.filter((u) => u.linkId !== linkId));
    } catch {
      toast.error("Failed to stop watching user.");
    } finally {
      setIsRevoking(null);
    }
  };

  useEffect(() => {
    fetchUsers();
    // Poll every 30 seconds for MVP
    const interval = setInterval(fetchUsers, 30000);
    return () => clearInterval(interval);
  }, []);

  const getRelativeTime = (isoString: string) => {
    const date = new Date(isoString);
    if (isNaN(date.getTime())) return "Unknown";
    const diff = Date.now() - date.getTime();
    if (diff < 60000) return "Just now";
    return formatDistanceToNow(date, { addSuffix: true });
  };

  const getBatteryIcon = (level?: number) => {
    if (level === undefined || level === null) return <Battery className="w-4 h-4" />;
    if (level > 80) return <BatteryFull className="w-4 h-4 text-emerald-500" />;
    if (level > 30) return <BatteryMedium className="w-4 h-4 text-yellow-500" />;
    return <BatteryLow className="w-4 h-4 text-red-500" />;
  };

  return (
    <div className="flex-1 space-y-6 pt-2">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Guardian Dashboard</h2>
          <p className="text-muted-foreground">
            Monitor the safety and status of the people you are protecting.
          </p>
        </div>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(3)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader className="flex flex-row items-center gap-4">
                <Skeleton className="h-12 w-12 rounded-full" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-3 w-16" />
                </div>
              </CardHeader>
              <CardContent>
                <Skeleton className="h-10 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : users.length === 0 ? (
        <Card className="flex flex-col items-center justify-center p-12 border-dashed">
          <div className="bg-primary/10 p-4 rounded-full mb-4">
            <Shield className="w-8 h-8 text-primary" />
          </div>
          <h3 className="text-xl font-semibold mb-2">No active protections</h3>
          <p className="text-muted-foreground text-center max-w-sm">
            You haven&apos;t been linked as a guardian to anyone yet, or your invitations are still pending.
          </p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {users.map((u) => {
            const isOnline = Date.now() - new Date(u.lastActiveAt).getTime() < 2 * 60 * 1000;

            return (
              <Card
                key={u.linkId}
                className={`relative overflow-hidden transition-all duration-300 ${u.hasActiveSOS
                  ? "border-red-500 shadow-[0_0_15px_rgba(239,68,68,0.3)] animate-[pulse_2s_cubic-bezier(0.4,0,0.6,1)_infinite]"
                  : "hover:border-primary/50"
                  }`}
              >
                {u.hasActiveSOS && (
                  <div className="absolute top-0 left-0 right-0 h-1 bg-red-500" />
                )}
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <div className="flex items-center gap-3">
                    <Avatar className={`h-12 w-12 ${u.hasActiveSOS ? "ring-2 ring-red-500 ring-offset-2 ring-offset-background" : ""}`}>
                      <AvatarImage src={u.profilePicture} />
                      <AvatarFallback>{u.firstName.charAt(0)}{u.lastName?.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <CardTitle className="text-lg">{u.firstName} {u.lastName}</CardTitle>
                      <div className="flex items-center gap-2 mt-1">
                        <div className={`w-2 h-2 rounded-full ${isOnline ? "bg-emerald-500" : "bg-muted-foreground"}`} />
                        <span className="text-xs text-muted-foreground">
                          {isOnline ? "Online" : getRelativeTime(u.lastActiveAt)}
                        </span>
                      </div>
                    </div>
                  </div>

                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-destructive hover:bg-destructive/10">
                        <LogOut className="h-4 w-4" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Stop Watching?</DialogTitle>
                        <DialogDescription>
                          Are you sure you want to stop watching over <strong>{u.firstName} {u.lastName}</strong>? You will no longer receive emergency alerts for them.
                        </DialogDescription>
                      </DialogHeader>
                      <DialogFooter>
                        <DialogClose asChild>
                          <Button variant="outline" type="button">Cancel</Button>
                        </DialogClose>
                        <Button
                          variant="destructive"
                          onClick={() => handleStopWatching(u.linkId)}
                          disabled={isRevoking === u.linkId}
                        >
                          {isRevoking === u.linkId ? "Processing..." : "Stop Watching"}
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </CardHeader>

                <CardContent className="pt-4 pb-2 text-sm">
                  <div className="flex items-center justify-between bg-muted/50 p-2 rounded-md mb-2">
                    <span className="text-muted-foreground flex items-center gap-2">
                      <Shield className="w-4 h-4 opacity-70" /> System Status
                    </span>
                    {u.hasActiveSOS ? (
                      <Badge variant="destructive" className="animate-pulse flex items-center gap-1">
                        <AlertTriangle className="w-3 h-3" /> SOS ACTIVE
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="border-emerald-500 text-emerald-500">
                        Safe
                      </Badge>
                    )}
                  </div>

                  {u.deviceStatus ? (
                    <div className="flex items-center justify-between px-2 mt-4 text-xs">
                      <div className="flex items-center gap-1.5 opacity-80" title="Device Battery">
                        {getBatteryIcon(u.deviceStatus.batteryLevel)}
                        <span>{u.deviceStatus.batteryLevel ? `${Math.round(u.deviceStatus.batteryLevel)}%` : "Unknown"} {u.deviceStatus.isCharging && "(Charging)"}</span>
                      </div>
                      <div className="flex items-center gap-1.5 opacity-80">
                        {u.deviceStatus.isOnline ? <Wifi className="w-3.5 h-3.5 text-emerald-500" /> : <WifiOff className="w-3.5 h-3.5 text-red-500" />}
                        <span className="capitalize">{u.deviceStatus.connectionType || "Network"}</span>
                      </div>
                    </div>
                  ) : (
                    <div className="flex justify-center mt-4">
                      <span className="text-xs text-muted-foreground opacity-60">No recent device telemetry</span>
                    </div>
                  )}
                </CardContent>

                <CardFooter className="pt-2 pb-4">
                  <Button
                    className={`w-full gap-2 transition-colors ${u.hasActiveSOS
                      ? "bg-red-500 hover:bg-red-600 outline outline-4 outline-red-500/20"
                      : "bg-primary hover:bg-primary/90"
                      }`}
                    onClick={() => {
                      if (u.activeSOSToken) {
                        router.push(`/track/${u.activeSOSToken}`);
                      } else {
                        toast.info("No active emergency broadcast found.");
                      }
                    }}
                    disabled={!u.activeSOSToken}
                  >
                    <MapPin className="w-4 h-4" />
                    {u.activeSOSToken ? "Open Live Tracking" : "No Active Broadcast"}
                  </Button>
                </CardFooter>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
