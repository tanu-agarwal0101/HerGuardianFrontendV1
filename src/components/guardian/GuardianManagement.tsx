"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Shield, Trash2, Clock, AlertCircle } from "lucide-react";
import { getSentInvites, revokeGuardianLink } from "@/lib/api/guardian";
import { InviteGuardianModal } from "./InviteGuardianModal";
import { toast } from "sonner";
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

interface GuardianLink {
  id: string;
  guardianEmail: string | null;
  status: "pending" | "accepted" | "rejected";
  createdAt: string;
  guardian: {
    firstName: string;
    lastName: string;
    profilePicture?: string;
  } | null;
}

export function GuardianManagement() {
  const [links, setLinks] = useState<GuardianLink[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRevoking, setIsRevoking] = useState<string | null>(null);

  const fetchLinks = async () => {
    try {
      const data = await getSentInvites();
      setLinks(data);
    } catch {
      toast.error("Failed to load your guardians.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLinks();
  }, []);

  const handleRevoke = async (id: string) => {
    setIsRevoking(id);
    try {
      await revokeGuardianLink(id);
      toast.success("Guardian removed successfully.");
      setLinks((prev) => prev.filter((l) => l.id !== id));
    } catch {
      toast.error("Failed to remove guardian.");
    } finally {
      setIsRevoking(null);
    }
  };

  const acceptedLinks = links.filter((l) => l.status === "accepted");
  const pendingLinks = links.filter((l) => l.status === "pending");

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Your Guardians</CardTitle>
          <CardDescription>People who can watch over you in emergencies.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {[1, 2].map((i) => (
            <div key={i} className="flex items-center gap-3">
              <Skeleton className="h-10 w-10 rounded-full" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-3 w-24" />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-border/50 shadow-sm">
      <CardHeader>
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <CardTitle className="text-lg flex items-center gap-2">
              <Shield className="h-5 w-5 text-primary" />
              Your Guardians
            </CardTitle>
            <CardDescription>People who can watch over you in emergencies.</CardDescription>
          </div>
          <InviteGuardianModal />
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {links.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-6 text-center">
            <AlertCircle className="h-8 w-8 text-muted-foreground/30 mb-2" />
            <p className="text-sm text-muted-foreground">You haven&apos;t invited anyone yet.</p>
          </div>
        ) : (
          <>
            <div className="space-y-3">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Active</h4>
              {acceptedLinks.length > 0 ? (
                acceptedLinks.map((link) => (
                  <GuardianItem
                    key={link.id}
                    link={link}
                    onRevoke={() => handleRevoke(link.id)}
                    isRevoking={isRevoking === link.id}
                  />
                ))
              ) : (
                <p className="text-sm text-muted-foreground italic pl-2">No active guardians.</p>
              )}
            </div>

            {pendingLinks.length > 0 && (
              <div className="space-y-3 pt-2">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                  <Clock className="h-3 w-3" /> Still Pending
                </h4>
                {pendingLinks.map((link) => (
                  <GuardianItem
                    key={link.id}
                    link={link}
                    onRevoke={() => handleRevoke(link.id)}
                    isRevoking={isRevoking === link.id}
                  />
                ))}
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}

function GuardianItem({
  link,
  onRevoke,
  isRevoking,
}: {
  link: GuardianLink;
  onRevoke: () => void;
  isRevoking: boolean;
}) {
  const name = link.guardian
    ? `${link.guardian.firstName || ""} ${link.guardian.lastName || ""}`.trim()
    : link.guardianEmail || "Unknown";

  const initials = link.guardian
    ? `${link.guardian.firstName?.charAt(0) || ""}${link.guardian.lastName?.charAt(0) || ""}`
    : "?";

  return (
    <div className="flex items-center gap-3 p-3 rounded-xl border border-transparent hover:border-border/50 hover:bg-muted/30 transition-all group">
      <Avatar className="h-10 w-10 border-2 border-background shadow-sm">
        <AvatarImage src={link.guardian?.profilePicture} />
        <AvatarFallback className="bg-primary/5 text-primary">{initials}</AvatarFallback>
      </Avatar>
      <div className="flex-1 overflow-hidden">
        <div className="flex items-center gap-2">
          <p className="text-sm font-semibold truncate">{name}</p>
          {link.status === "accepted" ? (
            <div className="h-1.5 w-1.5 rounded-full bg-emerald-500" title="Active" />
          ) : (
            <Badge variant="secondary" className="text-[10px] h-4 px-1.5 leading-none">Pending</Badge>
          )}
        </div>
        <p className="text-xs text-muted-foreground truncate">{link.guardianEmail}</p>
      </div>

      <Dialog>
        <DialogTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
            disabled={isRevoking}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Remove Guardian?</DialogTitle>
            <DialogDescription>
              Are you sure you want to remove <strong>{name}</strong>? They will no longer be notified of your emergencies.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button
              onClick={onRevoke}
              variant="destructive"
            >
              {isRevoking ? "Removing..." : "Remove Access"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
