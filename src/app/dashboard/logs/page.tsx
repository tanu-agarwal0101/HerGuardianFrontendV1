"use client";
import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, History, AlertTriangle, Clock, ExternalLink } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { SOS } from "@/lib/api";
import * as LocationApi from "@/lib/api/location";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

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

  return (
    <div className="max-w-6xl mx-auto space-y-8 relative p-4 lg:p-8 min-h-[85vh]">
      
      {/* Background Glows for Glassmorphism Context */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-primary/5 rounded-full blur-[120px] -z-10 animate-pulse" />
      <div className="absolute bottom-0 left-1/4 w-80 h-80 bg-secondary/5 rounded-full blur-[100px] -z-10" />

      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col space-y-2 px-2"
      >
        <h2 className="text-4xl font-extrabold tracking-tight bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
            Activity Logs
        </h2>
        <p className="text-muted-foreground font-medium">
            Monitor your recent safety alerts and trajectory history.
        </p>
      </motion.div>

      <Card className="w-full bg-card/60 backdrop-blur-2xl border-white/10 dark:border-white/5 shadow-2xl overflow-hidden relative">
        <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
        
        <Tabs defaultValue="sos" className="w-full">
            <div className="px-6 pt-6 border-b border-white/5">
                <TabsList className="bg-background/40 backdrop-blur-md p-1 rounded-2xl border border-white/10 h-12 w-full md:w-auto grid grid-cols-2 md:inline-flex">
                    <TabsTrigger 
                        value="sos" 
                        className="rounded-xl px-8 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-lg transition-all duration-300"
                    >
                        <AlertTriangle className="w-4 h-4 mr-2" />
                        SOS Alerts
                    </TabsTrigger>
                    <TabsTrigger 
                        value="locations" 
                        className="rounded-xl px-8 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-lg transition-all duration-300"
                    >
                        <History className="w-4 h-4 mr-2" />
                        Location Path
                    </TabsTrigger>
                </TabsList>
            </div>

            <CardContent className="p-0">
                <AnimatePresence mode="wait">
                    <TabsContent key="sos" value="sos" className="m-0 focus-visible:outline-none">
                        <motion.div
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 10 }}
                            className="p-6 lg:p-10"
                        >
                            <div className="flex items-center justify-between mb-8 px-2">
                                <div className="space-y-1">
                                    <h3 className="text-2xl font-bold flex items-center gap-2">
                                        Recent Alerts
                                        {sos.length > 0 && (
                                            <span className="bg-destructive/10 text-destructive text-xs font-bold px-2 py-0.5 rounded-full ml-2">
                                                {sos.filter(s => !s.resolved).length} Unresolved
                                            </span>
                                        )}
                                    </h3>
                                    <p className="text-sm text-muted-foreground font-medium">Detailed log of emergency notifications</p>
                                </div>
                            </div>

                            {loading ? (
                                <div className="space-y-4 py-8">
                                    {[1, 2, 3].map(i => (
                                        <div key={i} className="h-16 w-full animate-pulse rounded-2xl bg-muted/20 border border-white/5" />
                                    ))}
                                </div>
                            ) : sos.length === 0 ? (
                                <div className="flex flex-col items-center justify-center py-20 text-center bg-background/20 rounded-[2rem] border border-dashed border-white/10 mx-2">
                                    <div className="w-16 h-16 bg-background/40 rounded-3xl flex items-center justify-center mb-4 border border-white/5 shadow-inner">
                                        <AlertTriangle className="h-8 w-8 text-muted-foreground/30" />
                                    </div>
                                    <p className="text-muted-foreground font-bold text-lg">Clean Slate</p>
                                    <p className="text-sm text-muted-foreground/60 max-w-xs mt-1">
                                        No SOS alerts have been triggered yet. Stay safe out there!
                                    </p>
                                </div>
                            ) : (
                                <div className="rounded-3xl border border-white/5 bg-background/20 backdrop-blur-sm overflow-hidden shadow-inner">
                                    <Table>
                                        <TableHeader className="bg-muted/30">
                                            <TableRow className="border-white/5 hover:bg-transparent">
                                                <TableHead className="font-bold py-5 pl-8 text-foreground/80 uppercase tracking-widest text-[10px]">Timestamp</TableHead>
                                                <TableHead className="font-bold py-5 text-foreground/80 uppercase tracking-widest text-[10px]">Status</TableHead>
                                                <TableHead className="font-bold py-5 text-foreground/80 uppercase tracking-widest text-[10px]">Source</TableHead>
                                                <TableHead className="font-bold py-5 pr-8 text-foreground/80 uppercase tracking-widest text-[10px] text-right">Location</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {sos.map((row) => (
                                                <TableRow key={row.id || `sos-${row.triggeredAt}-${Math.random()}`} className="border-white/5 hover:bg-white/5 transition-colors group">
                                                    <TableCell className="py-6 pl-8">
                                                        <div className="flex items-center gap-3">
                                                            <div className="w-10 h-10 rounded-xl bg-background/40 flex items-center justify-center border border-white/5 group-hover:bg-primary/10 transition-colors">
                                                                <Clock className="w-4 h-4 text-muted-foreground group-hover:text-primary" />
                                                            </div>
                                                            <div className="flex flex-col">
                                                                <span className="font-bold text-sm">{new Date(row.triggeredAt).toLocaleDateString()}</span>
                                                                <span className="text-xs text-muted-foreground">{new Date(row.triggeredAt).toLocaleTimeString()}</span>
                                                            </div>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell className="py-6">
                                                        <Badge 
                                                            variant={row.resolved ? "secondary" : "destructive"}
                                                            className={`rounded-full px-3 py-1 font-bold text-[10px] uppercase border shadow-sm ${row.resolved ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' : 'bg-destructive/10 text-destructive border-destructive/20'}`}
                                                        >
                                                            {row.resolved ? "Resolved" : "Active Alert"}
                                                        </Badge>
                                                    </TableCell>
                                                    <TableCell className="py-6 font-semibold text-sm">
                                                        {row.timerId ? (
                                                            <Link href={`/dashboard/timers/${row.timerId}`} className="inline-flex items-center px-3 py-1.5 rounded-xl bg-primary/5 text-primary border border-primary/10 hover:bg-primary hover:text-white transition-all duration-300">
                                                                Safety Timer
                                                                <ExternalLink className="w-3 h-3 ml-2" />
                                                            </Link>
                                                        ) : (
                                                            <span className="text-muted-foreground/80 italic">Manual Trigger</span>
                                                        )}
                                                    </TableCell>
                                                    <TableCell className="py-6 pr-8 text-right">
                                                        {row.latitude != null && row.longitude != null ? (
                                                            <a
                                                                className="inline-flex items-center gap-2 text-sm font-bold text-primary hover:text-primary/80 transition-colors"
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                href={`https://www.google.com/maps?q=${row.latitude},${row.longitude}`}
                                                            >
                                                                <MapPin className="h-4 w-4" />
                                                                {row.latitude.toFixed(4)}, {row.longitude.toFixed(4)}
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
                        </motion.div>
                    </TabsContent>

                    <TabsContent key="locations" value="locations" className="m-0 focus-visible:outline-none">
                        <motion.div
                            initial={{ opacity: 0, x: 10 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -10 }}
                            className="p-6 lg:p-10"
                        >
                             <div className="flex items-center justify-between mb-8 px-2">
                                <div className="space-y-1">
                                    <h3 className="text-2xl font-bold flex items-center gap-2">
                                        Tracking History
                                    </h3>
                                    <p className="text-sm text-muted-foreground font-medium">Recent snapshots of your physical trajectory</p>
                                </div>
                            </div>

                            {loading ? (
                                <div className="space-y-4 py-8">
                                    {[1, 2, 3].map(i => (
                                        <div key={i} className="h-16 w-full animate-pulse rounded-2xl bg-muted/20 border border-white/5" />
                                    ))}
                                </div>
                            ) : locations.length === 0 ? (
                                <div className="flex flex-col items-center justify-center py-20 text-center bg-background/20 rounded-[2rem] border border-dashed border-white/10 mx-2">
                                    <div className="w-16 h-16 bg-background/40 rounded-3xl flex items-center justify-center mb-4 border border-white/5 shadow-inner">
                                        <History className="h-8 w-8 text-muted-foreground/30" />
                                    </div>
                                    <p className="text-muted-foreground font-bold text-lg">No Breadcrumbs</p>
                                    <p className="text-sm text-muted-foreground/60 max-w-xs mt-1">
                                        Start a safety timer to begin logging your location path.
                                    </p>
                                </div>
                            ) : (
                                <div className="rounded-3xl border border-white/5 bg-background/20 backdrop-blur-sm overflow-hidden shadow-inner">
                                    <Table>
                                        <TableHeader className="bg-muted/30">
                                            <TableRow className="border-white/5 hover:bg-transparent">
                                                <TableHead className="font-bold py-5 pl-8 text-foreground/80 uppercase tracking-widest text-[10px]">Logged At</TableHead>
                                                <TableHead className="font-bold py-5 text-foreground/80 uppercase tracking-widest text-[10px]">Event Type</TableHead>
                                                <TableHead className="font-bold py-5 text-foreground/80 uppercase tracking-widest text-[10px]">Coordinates</TableHead>
                                                <TableHead className="font-bold py-5 pr-8 text-foreground/80 uppercase tracking-widest text-[10px] text-right">Context</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {locations.map((row) => (
                                                <TableRow key={row.id || `loc-${row.createdAt}-${Math.random()}`} className="border-white/5 hover:bg-white/5 transition-colors group">
                                                    <TableCell className="py-6 pl-8">
                                                        <div className="flex items-center gap-3">
                                                            <div className="w-10 h-10 rounded-xl bg-background/40 flex items-center justify-center border border-white/5 group-hover:bg-primary/10 transition-colors">
                                                                <Clock className="w-4 h-4 text-muted-foreground group-hover:text-primary" />
                                                            </div>
                                                            <div className="flex flex-col">
                                                                <span className="font-bold text-sm">{new Date(row.createdAt).toLocaleDateString()}</span>
                                                                <span className="text-xs text-muted-foreground text-[10px]">{new Date(row.createdAt).toLocaleTimeString()}</span>
                                                            </div>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell className="py-6 text-sm">
                                                        <Badge variant="outline" className="capitalize px-3 py-1 font-bold border-white/10 bg-white/5 text-foreground/70 group-hover:text-foreground group-hover:bg-white/10 transition-colors">
                                                            {row.event}
                                                        </Badge>
                                                    </TableCell>
                                                    <TableCell className="py-6">
                                                        <div className="flex flex-col gap-0.5">
                                                            <div className="flex items-center gap-1.5 text-xs font-bold text-foreground/80">
                                                                <MapPin className="h-3.5 w-3.5 text-primary/60" />
                                                                {row.latitude.toFixed(5)}
                                                            </div>
                                                            <div className="text-[10px] font-medium text-muted-foreground ml-5">
                                                                {row.longitude.toFixed(5)}
                                                            </div>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell className="py-6 pr-8 text-right">
                                                        {row.timerId ? (
                                                            <Link href={`/dashboard/timers/${row.timerId}`} className="text-primary font-bold text-sm hover:underline hover:underline-offset-4 decoration-primary/30">
                                                                View Path
                                                            </Link>
                                                        ) : (
                                                            <span className="text-muted-foreground/30">—</span>
                                                        )}
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </div>
                            )}
                        </motion.div>
                    </TabsContent>
                </AnimatePresence>
            </CardContent>
        </Tabs>
      </Card>
      
      {/* Visual Footer */}
      <div className="flex justify-center pt-4 mb-10">
          <div className="w-32 h-1 bg-gradient-to-r from-transparent via-primary/10 to-transparent rounded-full" />
      </div>
    </div>
  );
}




