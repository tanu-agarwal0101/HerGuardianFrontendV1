"use client"
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import RequireAuth from "@/components/common/RequireAuth";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

import { Users as UsersApi } from "@/lib/api";
import { User } from "@/helpers/type";
import { Mail, Phone, MapPin, Shield, AlertTriangle, Edit2, Plus, Camera, Users } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { format } from "date-fns";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function ProfilePage() {
  const router = useRouter();
  const [profile, setProfile] = useState<User | null>(null);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  
  const [editForm, setEditForm] = useState({
    firstName: "",
    lastName: "",
    phoneNumber: "",
  });

  const fetchProfile = async () => {
    try {
      const user = await UsersApi.getProfile();
      setProfile(user as unknown as User);
      setEditForm({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        phoneNumber: user.phoneNumber || "",
      });
    } catch (err) {
      console.error("Failed to load profile:", err);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsEditing(true);
    try {
      await UsersApi.onboard({
        firstName: editForm.firstName,
        lastName: editForm.lastName,
        phoneNumber: editForm.phoneNumber,
      });
      toast.success("Profile updated successfully");
      setIsEditOpen(false);
      fetchProfile(); // refresh data
    } catch {
      toast.error("Failed to update profile", {
        description: "Please check your details and try again.",
      });
    } finally {
      setIsEditing(false);
    }
  };

  const calculateSafetyScore = () => {
    if (!profile) return 100;
    let score = 100;
    
    // Deduct points for SOS alerts
    const sosCount = profile.sosTriggers?.length || 0;
    score -= (sosCount * 10);
    
    // Add points for safely completed timers (up to a max of 100)
    const completedTimers = profile.safetyTimers?.filter(t => !t.isActive).length || 0;
    score += (completedTimers * 2);
    
    return Math.min(Math.max(score, 0), 100);
  };

  const stats = [
    { label: "Safety Score", value: `${calculateSafetyScore()}/100`, icon: Shield, color: "text-emerald-500" },
    { label: "Circle Members", value: profile?.contacts?.length || 0, icon: Users, color: "text-blue-500" },
    { label: "SOS Alerts", value: profile?.sosTriggers?.length || 0, icon: AlertTriangle, color: "text-red-500" },
    { label: "Check-ins", value: profile?.safetyTimers?.length || 0, icon: MapPin, color: "text-primary" },
  ];

  return (
    <RequireAuth>
      <DashboardLayout>
        <div className="flex-1 space-y-6 pt-2">
           {/* Header */}
           <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
               <div>
                   <h2 className="text-3xl font-bold tracking-tight">Profile</h2>
                   <p className="text-muted-foreground">Manage your personal information and safety settings.</p>
               </div>
               <Button onClick={() => setIsEditOpen(true)} className="bg-primary hover:bg-primary/90">
                   <Edit2 className="mr-2 h-4 w-4" /> Edit Profile
               </Button>
           </div>

           {/* Edit Profile Dialog */}
           <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
             <DialogContent className="sm:max-w-md bg-card/95 backdrop-blur-xl border-border/50">
               <form onSubmit={handleEditSubmit}>
                 <DialogHeader>
                   <DialogTitle>Edit Profile</DialogTitle>
                   <DialogDescription>Update your personal details here.</DialogDescription>
                 </DialogHeader>
                 <div className="grid gap-4 py-4">
                   <div className="grid grid-cols-2 gap-4">
                     <div className="space-y-2">
                       <Label htmlFor="firstName">First Name</Label>
                       <Input id="firstName" value={editForm.firstName} onChange={(e) => setEditForm({...editForm, firstName: e.target.value})} required className="bg-background/50" />
                     </div>
                     <div className="space-y-2">
                       <Label htmlFor="lastName">Last Name</Label>
                       <Input id="lastName" value={editForm.lastName} onChange={(e) => setEditForm({...editForm, lastName: e.target.value})} required className="bg-background/50" />
                     </div>
                   </div>
                   <div className="space-y-2">
                     <Label htmlFor="phoneNumber">Phone Number</Label>
                     <Input id="phoneNumber" value={editForm.phoneNumber} onChange={(e) => setEditForm({...editForm, phoneNumber: e.target.value})} placeholder="+1 234 567 8900" required className="bg-background/50" />
                   </div>
                 </div>
                 <DialogFooter>
                   <Button type="button" variant="outline" onClick={() => setIsEditOpen(false)}>Cancel</Button>
                   <Button type="submit" disabled={isEditing}>{isEditing ? "Saving..." : "Save changes"}</Button>
                 </DialogFooter>
               </form>
             </DialogContent>
           </Dialog>

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
                            <h3 className="text-xl font-bold">{profile?.firstName || "Loading..."} {profile?.lastName || ""}</h3>
                            <p className="text-muted-foreground text-sm flex items-center justify-center gap-1 mt-1 mb-2">
                                <MapPin className="h-3 w-3" /> Earth • Guardian
                            </p>
                        </CardContent>
                    </Card>

                    <Card className="p-4">
                        <CardHeader className="flex flex-row items-center justify-between">
                             <CardTitle className="text-lg">Contact Info</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center gap-3 text-sm">
                                <Mail className="h-4 w-4 text-muted-foreground" />
                                <span>{profile?.email || "Loading..."}</span>
                            </div>
                            <div className="flex items-center gap-3 text-sm">
                                <Phone className="h-4 w-4 text-muted-foreground" />
                                <span>{profile?.phoneNumber || "Not provided"}</span>
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
                                    profile.contacts.map((c: { name: string, phoneNumber: string }, i: number) => (
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
                                    ...(profile?.safetyTimers || []).map((t: { createdAt: string, duration?: number, isActive?: boolean }) => ({...t, type: 'timer', date: t.createdAt})),
                                    ...(profile?.sosTriggers || []).map((s: { triggeredAt: string, resolved?: boolean }) => ({...s, type: 'sos', date: s.triggeredAt}))
                                ]
                                .sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                                .slice(0, 5)
                                .map((item: { type: string, date: string, duration?: number, resolved?: boolean, isActive?: boolean }, i) => (
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
