"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Mail,
  Phone,
  MapPin,
  Shield,
  AlertTriangle,
  Edit2,
  Plus,
  Camera,
  Users,
  FileText,
  HelpCircle,
} from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/Textarea";
import { toast } from "sonner";
import { format } from "date-fns";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  updateProfileSchema,
  UpdateProfileFormData,
} from "@/helpers/profileSchema";
import { useProfile } from "@/hooks/useProfile";
import { AvatarPickerDialog } from "@/components/profile/AvatarPickerDialog";

export default function ProfilePage() {
  const router = useRouter();
  const {
    profile,
    isLoading,
    error,
    isUpdating,
    isUpdatingAvatar,
    fetchProfile,
    updateProfile,
    updateAvatar,
  } = useProfile();
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isAvatarPickerOpen, setIsAvatarPickerOpen] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<UpdateProfileFormData>({
    resolver: zodResolver(updateProfileSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      phoneNumber: "",
      location: "",
      bio: "",
    },
  });

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  useEffect(() => {
    if (isEditOpen && profile) {
      reset({
        firstName: profile.firstName || "",
        lastName: profile.lastName || "",
        phoneNumber: profile.phoneNumber || "",
        location: profile.location || "",
        bio: profile.bio || "",
      });
    }
  }, [isEditOpen, profile, reset]);

  const handleEditSubmit = async (data: UpdateProfileFormData) => {
    try {
      await updateProfile(data);
      toast.success("Profile updated successfully");
      setIsEditOpen(false);
    } catch {
      toast.error("Failed to update profile", {
        description: "Please check your details and try again.",
      });
    }
  };

  const calculateSafetyScore = () => {
    if (!profile) return 100;
    let score = 100;
    const sosCount = profile.sosTriggers?.length || 0;
    score -= sosCount * 10;
    const completedTimers =
      profile.safetyTimers?.filter((t) => !t.isActive).length || 0;
    score += completedTimers * 2;
    return Math.min(Math.max(score, 0), 100);
  };

  const stats = [
    {
      label: "Safety Score",
      value: `${calculateSafetyScore()}/100`,
      icon: Shield,
      color: "text-emerald-500",
    },
    {
      label: "Circle Members",
      value: profile?.contacts?.length ?? 0,
      icon: Users,
      color: "text-blue-500",
    },
    {
      label: "SOS Alerts",
      value: profile?.sosTriggers?.length ?? 0,
      icon: AlertTriangle,
      color: "text-red-500",
    },
    {
      label: "Check-ins",
      value: profile?.safetyTimers?.length ?? 0,
      icon: MapPin,
      color: "text-primary",
    },
  ];

  return (
    <div className="flex-1 space-y-6 pt-2">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Profile</h2>
          <p className="text-muted-foreground">
            Manage your personal information and safety settings.
          </p>
        </div>
        <Button
          onClick={() => setIsEditOpen(true)}
          className="bg-primary hover:bg-primary/90"
          disabled={isLoading}
        >
          <Edit2 className="mr-2 h-4 w-4" /> Edit Profile
        </Button>
      </div>

    
      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-800 dark:bg-red-950/30 dark:text-red-400">
          {error}
        </div>
      )}


      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="sm:max-w-md bg-card/95 backdrop-blur-xl border-border/50">
          <form onSubmit={handleSubmit(handleEditSubmit)}>
            <DialogHeader>
              <DialogTitle>Edit Profile</DialogTitle>
              <DialogDescription>
                Update your personal details here.
              </DialogDescription>
            </DialogHeader>

            <div className="grid gap-4 py-4">
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name</Label>
                  <Input
                    id="firstName"
                    {...register("firstName")}
                    className="bg-background/50"
                  />
                  {errors.firstName && (
                    <p className="text-xs text-red-500">
                      {errors.firstName.message}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input
                    id="lastName"
                    {...register("lastName")}
                    className="bg-background/50"
                  />
                  {errors.lastName && (
                    <p className="text-xs text-red-500">
                      {errors.lastName.message}
                    </p>
                  )}
                </div>
              </div>

              
              <div className="space-y-2">
                <Label htmlFor="phoneNumber">Phone Number</Label>
                <Input
                  id="phoneNumber"
                  {...register("phoneNumber")}
                  placeholder="e.g. 9876543210"
                  className="bg-background/50"
                />
                {errors.phoneNumber && (
                  <p className="text-xs text-red-500">
                    {errors.phoneNumber.message}
                  </p>
                )}
              </div>

              
              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  {...register("location")}
                  placeholder="e.g. Mumbai, India"
                  className="bg-background/50"
                />
                {errors.location && (
                  <p className="text-xs text-red-500">
                    {errors.location.message}
                  </p>
                )}
              </div>

            
              <div className="space-y-2">
                <Label htmlFor="bio">Bio</Label>
                <Textarea
                  id="bio"
                  {...register("bio")}
                  placeholder="Tell us a little about yourself..."
                  className="bg-background/50 resize-none"
                  rows={3}
                />
                {errors.bio && (
                  <p className="text-xs text-red-500">{errors.bio.message}</p>
                )}
              </div>
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsEditOpen(false)}
                disabled={isUpdating}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isUpdating}>
                {isUpdating ? "Saving..." : "Save changes"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        
        <div className="md:col-span-4 space-y-6">
          <Card>
            <CardHeader className="relative pb-0">
              <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-r from-primary/20 to-secondary/20 rounded-t-xl" />
              <div className="relative pt-12 flex justify-center">
                {isLoading ? (
                  <Skeleton className="h-24 w-24 rounded-full" />
                ) : (
                  <>
                    <Avatar className="h-24 w-24 border-4 border-background shadow-xl">
                      {profile?.profilePicture && (
                        <AvatarImage
                          src={profile.profilePicture}
                          alt="Profile"
                        />
                      )}
                      <AvatarFallback>
                        {profile?.firstName?.charAt(0) || "?"}
                        {profile?.lastName?.charAt(0) || ""}
                      </AvatarFallback>
                    </Avatar>
                    <Button
                      size="icon"
                      variant="secondary"
                      className="absolute bottom-0 right-[35%] rounded-full h-8 w-8 shadow-sm"
                      onClick={() => setIsAvatarPickerOpen(true)}
                      aria-label="Change avatar"
                    >
                      <Camera className="h-4 w-4" />
                    </Button>
                  </>
                )}
              </div>
            </CardHeader>
            <CardContent className="text-center pt-4 pb-6">
              {isLoading ? (
                <div className="space-y-2 flex flex-col items-center">
                  <Skeleton className="h-6 w-40" />
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-4 w-48 mt-2" />
                </div>
              ) : (
                <>
                  <h3 className="text-xl font-bold">
                    {profile?.firstName || "—"} {profile?.lastName || ""}
                  </h3>
                  <p className="text-muted-foreground text-sm flex items-center justify-center gap-1 mt-1 mb-2">
                    <MapPin className="h-3 w-3" />
                    {profile?.location || "Location not set"} • Guardian
                  </p>
                  {profile?.bio && (
                    <p className="text-sm text-muted-foreground px-4">
                      {profile.bio}
                    </p>
                  )}
                  {profile?.updatedAt && (
                    <p className="text-xs text-muted-foreground mt-3">
                      Last updated:{" "}
                      {format(new Date(profile.updatedAt), "MMM d, yyyy")}
                    </p>
                  )}
                </>
              )}
            </CardContent>
          </Card>

          
          <Card className="p-4">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-lg">Contact Info</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {isLoading ? (
                <>
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                </>
              ) : (
                <>
                  <div className="flex items-center gap-3 text-sm">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <span>{profile?.email || "Not provided"}</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span>{profile?.phoneNumber || "Not provided"}</span>
                  </div>
                  {profile?.location && (
                    <div className="flex items-center gap-3 text-sm">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <span>{profile.location}</span>
                    </div>
                  )}
                  {profile?.bio && (
                    <div className="flex items-start gap-3 text-sm">
                      <FileText className="h-4 w-4 text-muted-foreground mt-0.5" />
                      <span className="text-muted-foreground">{profile.bio}</span>
                    </div>
                  )}
                </>
              )}
            </CardContent>
          </Card>

          
          <Card className="p-4">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-lg">Safety Circle</CardTitle>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => router.push("/dashboard/calls")}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {isLoading ? (
                  <>
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-10 w-full" />
                  </>
                ) : profile?.contacts?.length ? (
                  profile.contacts.map(
                    (
                      c: { name: string; phoneNumber: string },
                      i: number
                    ) => (
                      <div
                        key={i}
                        className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50 transition-colors"
                      >
                        <Avatar className="h-8 w-8">
                          <AvatarFallback>{c.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1 overflow-hidden">
                          <p className="text-sm font-medium truncate">
                            {c.name}
                          </p>
                          <p className="text-xs text-muted-foreground truncate">
                            {c.phoneNumber}
                          </p>
                        </div>
                      </div>
                    )
                  )
                ) : (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    No contacts yet.
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        
        <div className="md:col-span-8 space-y-6">
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {isLoading
              ? Array.from({ length: 4 }).map((_, i) => (
                  <Card key={i}>
                    <CardContent className="p-4 flex flex-col items-center justify-center text-center space-y-2">
                      <Skeleton className="h-8 w-8 rounded-full" />
                      <Skeleton className="h-6 w-16" />
                      <Skeleton className="h-3 w-20" />
                    </CardContent>
                  </Card>
                ))
              : stats.map((stat, i) => {
                  const Icon = stat.icon;
                  const isSafetyScore = stat.label === "Safety Score";

                  return (
                    <Card key={i} className="relative group">
                      <CardContent className="p-4 flex flex-col items-center justify-center text-center space-y-2">
                        <Icon className={`h-8 w-8 ${stat.color} transition-transform group-hover:scale-110`} />
                        <div className="text-2xl font-bold">{stat.value}</div>
                        <div className="flex items-center gap-1.5 text-xs text-muted-foreground leading-none">
                          {isSafetyScore ? (
                            <Popover>
                              <PopoverTrigger asChild>
                                <button className="inline-flex items-center gap-1 hover:text-primary transition-colors focus-visible:outline-none">
                                  {stat.label}
                                  <HelpCircle className="h-3 w-3 opacity-60 group-hover:opacity-100" />
                                </button>
                              </PopoverTrigger>
                              <PopoverContent 
                                side="top" 
                                className="w-80 p-0 overflow-hidden border-border/50 bg-card/95 backdrop-blur-xl shadow-2xl"
                              >
                                <div className="p-4 space-y-3">
                                  <div className="flex items-center gap-2 border-b border-border/50 pb-2">
                                    <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-500">
                                      <Shield className="h-4 w-4" />
                                    </div>
                                    <h4 className="font-semibold text-sm">How is your score calculated?</h4>
                                  </div>
                                  
                                  <div className="space-y-2.5 text-xs">
                                    <div className="flex justify-between items-center text-muted-foreground">
                                      <span>Base Score</span>
                                      <span className="font-medium text-foreground">+100</span>
                                    </div>
                                    
                                    <div className="flex justify-between items-start gap-4">
                                      <div className="flex flex-col">
                                        <span className="flex items-center gap-1.5">
                                          <AlertTriangle className="h-3 w-3 text-red-500" />
                                          SOS Alerts
                                        </span>
                                        <span className="text-[10px] opacity-70">Penalty for each emergency trigger</span>
                                      </div>
                                      <span className="font-medium text-red-500">-10 pts</span>
                                    </div>

                                    <div className="flex justify-between items-start gap-4">
                                      <div className="flex flex-col">
                                        <span className="flex items-center gap-1.5">
                                          <MapPin className="h-3 w-3 text-primary" />
                                          Check-ins
                                        </span>
                                        <span className="text-[10px] opacity-70">Bonus for successful timer completion</span>
                                      </div>
                                      <span className="font-medium text-emerald-500">+2 pts</span>
                                    </div>
                                  </div>

                                  {/* User Tally */}
                                  <div className="pt-2 border-t border-border/50">
                                    <div className="rounded-lg bg-muted/40 p-2.5 space-y-2">
                                      <p className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">Your History</p>
                                      <div className="flex justify-between text-xs">
                                        <span>{profile?.sosTriggers?.length || 0} Alerts</span>
                                        <span className="text-red-500/80">-{ (profile?.sosTriggers?.length || 0) * 10 }</span>
                                      </div>
                                      <div className="flex justify-between text-xs">
                                        <span>{profile?.safetyTimers?.filter(t => !t.isActive).length || 0} Check-ins</span>
                                        <span className="text-emerald-500/80">+{ (profile?.safetyTimers?.filter(t => !t.isActive).length || 0) * 2 }</span>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </PopoverContent>
                            </Popover>
                          ) : (
                            stat.label
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
          </div>

          {/* Safety History */}
          <Card className="p-4">
            <CardHeader>
              <CardTitle>Safety History</CardTitle>
              <CardDescription>
                Recent SOS triggers and safety timer activity.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="space-y-6">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className="flex items-start gap-4">
                      <Skeleton className="mt-1 h-2 w-2 rounded-full" />
                      <div className="space-y-1 flex-1">
                        <Skeleton className="h-4 w-48" />
                        <Skeleton className="h-3 w-32" />
                      </div>
                      <Skeleton className="h-6 w-16 rounded-full" />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="space-y-8">
                  {[
                    ...(profile?.safetyTimers || []).map(
                      (t: {
                        createdAt: string;
                        duration?: number;
                        isActive?: boolean;
                      }) => ({ ...t, type: "timer", date: t.createdAt })
                    ),
                    ...(profile?.sosTriggers || []).map(
                      (s: { triggeredAt: string; resolved?: boolean }) => ({
                        ...s,
                        type: "sos",
                        date: s.triggeredAt,
                      })
                    ),
                  ]
                    .sort(
                      (a, b) =>
                        new Date(b.date).getTime() - new Date(a.date).getTime()
                    )
                    .slice(0, 5)
                    .map(
                      (
                        item: {
                          type: string;
                          date: string;
                          duration?: number;
                          resolved?: boolean;
                          isActive?: boolean;
                        },
                        i
                      ) => (
                        <div key={i} className="flex items-start gap-4">
                          <div
                            className={`mt-1 h-2 w-2 rounded-full ${
                              item.type === "sos"
                                ? "bg-red-500"
                                : "bg-blue-500"
                            }`}
                          />
                          <div className="space-y-1">
                            <p className="text-sm font-medium leading-none">
                              {item.type === "sos"
                                ? "SOS Alert Triggered"
                                : `Safety Timer (${item.duration}m)`}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {format(new Date(item.date), "PPP p")}
                            </p>
                          </div>
                          <div className="ml-auto font-medium text-sm">
                            {item.type === "sos" ? (
                              <Badge
                                variant={
                                  item.resolved ? "secondary" : "destructive"
                                }
                              >
                                {item.resolved ? "Resolved" : "Active"}
                              </Badge>
                            ) : (
                              <Badge variant="outline">
                                {item.isActive ? "Running" : "Completed"}
                              </Badge>
                            )}
                          </div>
                        </div>
                      )
                    )}
                  {!profile?.safetyTimers?.length &&
                    !profile?.sosTriggers?.length && (
                      <p className="text-center text-muted-foreground py-8">
                        No activity recorded.
                      </p>
                    )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Avatar Picker Dialog */}
      <AvatarPickerDialog
        open={isAvatarPickerOpen}
        onOpenChange={setIsAvatarPickerOpen}
        currentAvatar={profile?.profilePicture}
        userInitials={`${profile?.firstName?.charAt(0) ?? ""}${profile?.lastName?.charAt(0) ?? ""}`}
        onSave={updateAvatar}
        isSaving={isUpdatingAvatar}
      />
    </div>
  );
}
