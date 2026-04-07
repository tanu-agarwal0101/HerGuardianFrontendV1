"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { UserPlus } from "lucide-react";
import { inviteGuardian } from "@/lib/api/guardian";

export function InviteGuardianModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      toast.error("Please enter an email address.");
      return;
    }

    setIsSubmitting(true);
    try {
      // @ts-expect-error suppressToast is used by axios interceptor
      await inviteGuardian(email, { suppressToast: true });
      toast.success("Guardian invitation sent successfully!");
      setIsOpen(false);
      setEmail("");
    } catch (err: unknown) {
      const typedErr = err as { response?: { status?: number; data?: { message?: string } } };
      if (typedErr.response?.status === 409) {
        toast.error("This user is already a guardian or has a pending invitation.");
      } else {
        toast.error(typedErr.response?.data?.message || "Failed to send invitation.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2 bg-primary text-white hover:bg-primary/90 p-2">
          <UserPlus className="h-4 w-4" />
          Invite Guardian
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Invite a Guardian</DialogTitle>
            <DialogDescription>
              Send an invitation to someone you trust. As your guardian, they will be able to monitor your active SOS alerts and view your device status for enhanced safety.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="email" className="text-right">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="guardian@example.com"
                className="col-span-3"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="ghost" onClick={() => setIsOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Sending..." : "Send Invite"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
