"use client";

import { useState, useCallback } from "react";
import { Users as UsersApi } from "@/lib/api";
import { User } from "@/helpers/type";
import { UpdateProfileFormData } from "@/helpers/profileSchema";

interface UseProfileReturn {
  profile: User | null;
  isLoading: boolean;
  error: string | null;
  isUpdating: boolean;
  isUpdatingAvatar: boolean;
  fetchProfile: () => Promise<void>;
  updateProfile: (data: UpdateProfileFormData) => Promise<void>;
  updateAvatar: (avatarSrc: string) => Promise<void>;
}

export function useProfile(): UseProfileReturn {
  const [profile, setProfile] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isUpdatingAvatar, setIsUpdatingAvatar] = useState(false);

  const fetchProfile = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const user = await UsersApi.getProfile();
      setProfile(user as unknown as User);
    } catch (err) {
      console.error("Failed to load profile:", err);
      setError("Failed to load profile. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  const updateProfile = useCallback(
    async (formData: UpdateProfileFormData) => {
      setIsUpdating(true);
      try {
        // Sanitize: convert empty strings to undefined so backend ignores them
        const payload = {
          firstName: formData.firstName || undefined,
          lastName: formData.lastName || undefined,
          phoneNumber: formData.phoneNumber || undefined,
          location: formData.location || undefined,
          bio: formData.bio || undefined,
        };
        await UsersApi.updateProfile(payload);
        // Refresh profile data after a successful update
        await fetchProfile();
      } finally {
        setIsUpdating(false);
      }
    },
    [fetchProfile]
  );

  const updateAvatar = useCallback(
    async (avatarSrc: string) => {
      setIsUpdatingAvatar(true);
      // Optimistic update — instant preview in the main profile card
      setProfile((prev) => (prev ? { ...prev, profilePicture: avatarSrc } : prev));
      try {
        await UsersApi.updateProfile({ profilePicture: avatarSrc });
        // Refresh to sync with server
        await fetchProfile();
      } catch {
        // Roll back optimistic update on failure
        await fetchProfile();
        throw new Error("Failed to update avatar");
      } finally {
        setIsUpdatingAvatar(false);
      }
    },
    [fetchProfile]
  );

  return { profile, isLoading, error, isUpdating, isUpdatingAvatar, fetchProfile, updateProfile, updateAvatar };
}
