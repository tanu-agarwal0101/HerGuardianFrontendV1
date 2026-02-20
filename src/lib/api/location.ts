import axiosInstance from "../axiosInstance";

export interface LocationLogPayload {
  latitude: number;
  longitude: number;
  timerId?: string;
  event?: "started" | "expired" | "cancelled" | "snapshot";
}

export async function logLocation(payload: LocationLogPayload) {
  return axiosInstance.post("/api/locations/log", payload);
}

export async function getRecent() {
  return axiosInstance.get("/api/locations/recent");
}

