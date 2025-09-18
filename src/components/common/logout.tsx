"use client";
import { useUserStore } from "@/store/userStore";
// components/LoginFormDialog.tsx
// This is needed for client-side interactivity

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRouter } from "next/navigation";
// import axiosInstance from "@/lib/axiosInstance";
import { Users } from "@/lib/api";
import { toast } from "sonner";

export function LogoutDialog({
  open,
  setOpen,
}: {
  open: boolean;
  setOpen: (open: boolean) => void;
}) {
  const router = useRouter();
  const logoutStore = useUserStore((state) => state.logout);
  const handleSubmit = async () => {
    try {
      const res = await Users.logout();
      if (res.status === 200) {
        // Clear cookies on logout
        document.cookie =
          "stealthMode=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
        document.cookie =
          "stealthType=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
        document.cookie =
          "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
        toast.success("Logged out successfully.");
        router.push("/");
      }
    } catch (error) {
      console.error("Logout failed:", error);
      toast.error("Logout failed. Please try again.");
    }
    // Always clear cookies even if API fails
    document.cookie =
      "stealthMode=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    document.cookie =
      "stealthType=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    logoutStore();
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Logout</DialogTitle>
          <DialogDescription>
            Are you sure you want to log out?
          </DialogDescription>
        </DialogHeader>

        <div className="flex gap-4 justify-end mt-4">
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={handleSubmit}>
            Yes, Logout
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
