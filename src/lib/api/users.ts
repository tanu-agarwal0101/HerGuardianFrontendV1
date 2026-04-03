import axiosInstance from "../axiosInstance";
import { User } from "@/helpers/type";

// Re-export User as UserProfile for backward compat — single source of truth is helpers/type.ts
export type { User as UserProfile };

export async function getProfile(): Promise<User> {
  const { data } = await axiosInstance.get("/users/profile", {
    // @ts-expect-error Custom config used by global interceptor
    suppressToast: true,
  });
  return data.user;
}

export async function updateProfile(payload: {
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
  location?: string;
  bio?: string;
  profilePicture?: string;
}) {
  const { data } = await axiosInstance.patch("/users/update-profile", payload);
  return data;
}

export async function updateStealth(payload: { stealthMode: boolean }) {
  return axiosInstance.patch("/users/update-stealth", payload);
}

export async function onboard(payload: {
  firstName: string;
  lastName: string;
  phoneNumber: string;
}) {
  return axiosInstance.patch("/users/onboard", payload);
}

export async function logout() {
  return axiosInstance.post("/users/logout", {});
}

export async function sosTrigger(payload: {
  latitude: number;
  longitude: number;
}) {
  return axiosInstance.post("/users/sos-trigger", payload);
}

export async function updateVoiceTrigger(payload: {
  voiceTriggerPhrase: string;
}) {
  return axiosInstance.patch("/users/update-voice-settings", payload);
}
