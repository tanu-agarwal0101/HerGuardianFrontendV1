"use client"
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import RequireAuth from "@/components/common/RequireAuth";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Users as UsersApi } from "@/lib/api";
import { User } from "@/helpers/type";
import { Mail, Phone, MapPin, Shield, AlertTriangle, Clock, Edit2, Plus, Camera, Users } from "lucide-react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { format } from "date-fns";

export default function ProfilePage() {
  const router = useRouter();
  const [profile, setProfile] = useState<User | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const user = await UsersApi.getProfile();
        setProfile(user as any);
      } catch (err) {
        console.error("Failed to load profile:", err);
      }
    };
    fetchProfile();
  }, []);

  const stats = [
    { label: "Safety Score", value: "98/100", icon: Shield, color: "text-green-500" },
    { label: "Circle Members", value: profile?.contacts?.length || 0, icon: Users, color: "text-blue-500" },
    { label: "SOS Alerts", value: profile?.sosTriggers?.length || 0, icon: AlertTriangle, color: "text-red-500" },
    { label: "Check-ins", value: "12", icon: MapPin, color: "text-purple-500" },
  ];

  return (
    <RequireAuth>
      <DashboardLayout>
        <div className="flex-1 space-y-6 p-4 md:p-8 pt-6">
           {/* Header */}
           <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
               <div>
                   <h2 className="text-3xl font-bold tracking-tight">Profile</h2>
                   <p className="text-muted-foreground">Manage your personal information and safety settings.</p>
               </div>
               <Button onClick={() => {}}>
                   <Edit2 className="mr-2 h-4 w-4" /> Edit Profile
               </Button>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                {/* Left Column: User Card & Contacts */}
                <div className="md:col-span-4 space-y-6">
                    <Card>
                        <CardHeader className="relative pb-0">
                           <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-r from-primary/20 to-secondary/20 rounded-t-xl" />
                           <div className="relative pt-12 flex justify-center">
                                <Avatar className="h-24 w-24 border-4 border-background shadow-xl">
                                    <AvatarImage src={profile?.profilePicture || "/img1.avif"} alt="Profile" />
                                    <AvatarFallback>TA</AvatarFallback>
                                </Avatar>
                                <Button size="icon" variant="secondary" className="absolute bottom-0 right-[35%] rounded-full h-8 w-8 shadow-sm">
                                    <Camera className="h-4 w-4" />
                                </Button>
                           </div>
                        </CardHeader>
                        <CardContent className="text-center pt-4 pb-6">
                            <h3 className="text-xl font-bold">{profile?.firstName} {profile?.lastName || "Tanu Agarwal"}</h3>
                            <p className="text-muted-foreground text-sm flex items-center justify-center gap-1 mt-1">
                                <MapPin className="h-3 w-3" /> India • Engineer
                            </p>
                            
                            <div className="mt-6 flex justify-center gap-4">
                                <div className="text-center">
                                    <div className="text-2xl font-bold">24</div>
                                    <div className="text-xs text-muted-foreground">Age</div>
                                </div>
                                <Separator orientation="vertical" className="h-10" />
                                <div className="text-center">
                                    <div className="text-2xl font-bold">A+</div>
                                    <div className="text-xs text-muted-foreground">Blood</div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="p-4">
                        <CardHeader className="flex flex-row items-center justify-between">
                             <CardTitle className="text-lg">Contact Info</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center gap-3 text-sm">
                                <Mail className="h-4 w-4 text-muted-foreground" />
                                <span>{profile?.email || "tanu.ag976@gmail.com"}</span>
                            </div>
                            <div className="flex items-center gap-3 text-sm">
                                <Phone className="h-4 w-4 text-muted-foreground" />
                                <span>{profile?.phoneNumber || "+91 98765 43210"}</span>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="p-4">
                         <CardHeader className="flex flex-row items-center justify-between">
                             <CardTitle className="text-lg">Safety Circle</CardTitle>
                             <Button variant="ghost" size="icon" onClick={() => router.push("/dashboard/actions/calls")}>
                                 <Plus className="h-4 w-4" />
                             </Button>
                        </CardHeader>
                        <CardContent>
                             <div className="space-y-4">
                                {profile?.contacts?.length ? (
                                    profile.contacts.map((c, i) => (
                                        <div key={i} className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50 transition-colors">
                                            <Avatar className="h-8 w-8">
                                                <AvatarFallback>{c.name.charAt(0)}</AvatarFallback>
                                            </Avatar>
                                            <div className="flex-1 overflow-hidden">
                                                <p className="text-sm font-medium truncate">{c.name}</p>
                                                <p className="text-xs text-muted-foreground truncate">{c.phoneNumber}</p>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-sm text-muted-foreground text-center py-4">No contacts yet.</p>
                                )}
                             </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Right Column: Stats & Activity */}
                <div className="md:col-span-8 space-y-6">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                         {stats.map((stat, i) => {
                             const Icon = stat.icon;
                             return (
                             <Card key={i}>
                                 <CardContent className="p-4 flex flex-col items-center justify-center text-center space-y-2">
                                     <Icon className={`h-8 w-8 ${stat.color}`} />
                                     <div className="text-2xl font-bold">{stat.value}</div>
                                     <div className="text-xs text-muted-foreground">{stat.label}</div>
                                 </CardContent>
                             </Card>
                             );
                         })}
                    </div>

                    <Card className="p-4">
                         <CardHeader>
                             <CardTitle>Safety History</CardTitle>
                             <CardDescription>Recent SOS triggers and safety timer activity.</CardDescription>
                         </CardHeader>
                         <CardContent>
                            <div className="space-y-8">
                                {[
                                    ...(profile?.safetyTimers || []).map(t => ({...t, type: 'timer', date: t.createdAt})),
                                    ...(profile?.sosTriggers || []).map(s => ({...s, type: 'sos', date: s.triggeredAt}))
                                ]
                                .sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                                .slice(0, 5)
                                .map((item: any, i) => (
                                    <div key={i} className="flex items-start gap-4">
                                        <div className={`mt-1 h-2 w-2 rounded-full ${item.type === 'sos' ? 'bg-red-500' : 'bg-blue-500'}`} />
                                        <div className="space-y-1">
                                            <p className="text-sm font-medium leading-none">
                                                {item.type === 'sos' ? "SOS Alert Triggered" : `Safety Timer (${item.duration}m)`}
                                            </p>
                                            <p className="text-xs text-muted-foreground">
                                                {format(new Date(item.date), "PPP p")}
                                            </p>
                                        </div>
                                        <div className="ml-auto font-medium text-sm">
                                             {item.type === 'sos' ? (
                                                 <Badge variant={item.resolved ? "secondary" : "destructive"}>{item.resolved ? "Resolved" : "Active"}</Badge>
                                             ) : (
                                                 <Badge variant="outline">{item.isActive ? "Running" : "Completed"}</Badge>
                                             )}
                                        </div>
                                    </div>
                                ))}
                                {(!profile?.safetyTimers?.length && !profile?.sosTriggers?.length) && (
                                    <p className="text-center text-muted-foreground py-8">No activity recorded.</p>
                                )}
                            </div>
                         </CardContent>
                    </Card>
                </div>
           </div>
        </div>
      </DashboardLayout>
    </RequireAuth>
  );
}
