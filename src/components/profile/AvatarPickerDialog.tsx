"use client";

import { useState } from "react";
import Image from "next/image";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { PRESET_AVATARS } from "@/constants/avatars";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { CheckCircle2 } from "lucide-react";

interface AvatarPickerDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentAvatar?: string;
  userInitials: string;
  onSave: (avatarSrc: string) => Promise<void>;
  isSaving: boolean;
}

export function AvatarPickerDialog({
  open,
  onOpenChange,
  currentAvatar,
  userInitials,
  onSave,
  isSaving,
}: AvatarPickerDialogProps) {
  // Local selection state — doesn't touch backend until Save is clicked
  const [selectedAvatar, setSelectedAvatar] = useState<string | null>(null);

  // Preview: show selected choice, otherwise show current saved avatar
  const previewSrc = selectedAvatar ?? currentAvatar;

  const hasChanged = selectedAvatar !== null && selectedAvatar !== currentAvatar;

  const handleSave = async () => {
    if (!selectedAvatar || !hasChanged) return;
    try {
      await onSave(selectedAvatar);
      toast.success("Avatar updated successfully");
      setSelectedAvatar(null); // Reset local selection after save
      onOpenChange(false);
    } catch {
      toast.error("Failed to update avatar. Please try again.");
    }
  };

  const handleOpenChange = (isOpen: boolean) => {
    if (!isOpen) {
      setSelectedAvatar(null); // Reset on close
    }
    onOpenChange(isOpen);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-lg bg-card/95 backdrop-blur-xl border-border/50">
        <DialogHeader>
          <DialogTitle>Choose Your Avatar</DialogTitle>
          <DialogDescription>
            Select a preset avatar. Changes are saved only when you click Save.
          </DialogDescription>
        </DialogHeader>

        {/* Live preview */}
        <div className="flex justify-center pt-2 pb-1">
          <div className="relative">
            <Avatar className="h-20 w-20 border-4 border-primary/30 shadow-lg transition-all duration-300">
              {previewSrc ? (
                <AvatarImage src={previewSrc} alt="Preview" />
              ) : null}
              <AvatarFallback className="text-lg font-semibold">
                {userInitials}
              </AvatarFallback>
            </Avatar>
            {selectedAvatar && (
              <span className="absolute -bottom-1 -right-1 rounded-full bg-primary text-primary-foreground p-0.5 shadow-md">
                <CheckCircle2 className="h-4 w-4" />
              </span>
            )}
          </div>
        </div>

        {/* Avatar grid */}
        <div className="grid grid-cols-4 gap-3 py-2 sm:grid-cols-4">
          {PRESET_AVATARS.map((avatar) => {
            const isSelected = selectedAvatar === avatar.src;
            const isCurrent =
              !selectedAvatar && currentAvatar === avatar.src;
            const isHighlighted = isSelected || isCurrent;

            return (
              <button
                key={avatar.id}
                type="button"
                aria-label={`Select avatar: ${avatar.label}`}
                aria-pressed={isHighlighted}
                onClick={() => setSelectedAvatar(avatar.src)}
                className={cn(
                  "group relative flex flex-col items-center gap-1 rounded-xl p-1.5 transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                  isHighlighted
                    ? "bg-primary/10 ring-2 ring-primary ring-offset-2 ring-offset-background"
                    : "hover:bg-muted/60 hover:scale-105"
                )}
              >
                <div className="relative h-14 w-14 overflow-hidden rounded-full">
                  <Image
                    src={avatar.src}
                    alt={avatar.label}
                    fill
                    className="object-cover transition-transform duration-200 group-hover:scale-110"
                    sizes="56px"
                  />
                  {isHighlighted && (
                    <div className="absolute inset-0 flex items-center justify-center rounded-full bg-primary/20">
                      <CheckCircle2 className="h-5 w-5 text-primary drop-shadow" />
                    </div>
                  )}
                </div>
                <span className="text-[10px] text-muted-foreground leading-none truncate w-full text-center">
                  {avatar.label}
                </span>
              </button>
            );
          })}
        </div>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button
            type="button"
            variant="outline"
            onClick={() => handleOpenChange(false)}
            disabled={isSaving}
          >
            Cancel
          </Button>
          <Button
            type="button"
            disabled={!hasChanged || isSaving}
            onClick={handleSave}
          >
            {isSaving ? "Saving..." : "Save Avatar"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
