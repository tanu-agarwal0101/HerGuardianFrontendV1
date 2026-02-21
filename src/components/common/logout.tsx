"use client";
import { useUserStore } from "@/store/userStore";
// components/LoginFormDialog.tsx
// This is needed for client-side interactivity
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Users } from "@/lib/api";
import { toast } from "sonner";

export function LogoutDialog({
  open,
  setOpen,
}: {
  open: boolean;
  setOpen: (open: boolean) => void;
}) {
  const logoutStore = useUserStore((state) => state.logout);
  const handleSubmit = async () => {
    try {
      const res = await Users.logout();
      
      // Clear store/localstorage *before* navigating
      logoutStore();
      
      if (res.status === 200) {
        // Clear cookies on logout
        document.cookie =
          "stealthMode=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
        document.cookie =
          "stealthType=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
        document.cookie =
          "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
        toast.success("Logged out successfully.");
        // Force full reload to clear any lingering state/cookies
        window.location.href = "/";
        return;
      }
    } catch (error) {
      console.error("Logout failed:", error);
      toast.error("Logout failed. Please try again.");
    }
    // Backup cleanup
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
