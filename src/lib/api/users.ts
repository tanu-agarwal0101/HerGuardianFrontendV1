import axiosInstance from "../axiosInstance";

export interface UserProfile {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber?: string;
  profilePicture?: string;
  contacts?: any[];
  safetyTimers?: any[];
  sosTriggers?: any[];
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
