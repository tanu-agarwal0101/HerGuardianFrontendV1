import axiosInstance from "../axiosInstance";
import { Contact, SafetyTimer, SOSTrigger } from "@/helpers/type";

export interface UserProfile {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber?: string;
  profilePicture?: string;
  contacts?: Contact[];
  safetyTimers?: SafetyTimer[];
  sosTriggers?: SOSTrigger[];
  stealthType?: string;
  stealthMode?: boolean;
  dashboardPass?: string;
  sosPass?: string;
}

export async function getProfile(): Promise<UserProfile> {
  const { data } = await axiosInstance.get("/users/profile");
  return data.user;
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
