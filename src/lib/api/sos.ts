import axiosInstance from "../axiosInstance";

export async function trigger(payload: {
  latitude: number;
  longitude: number;
}) {
  return axiosInstance.post("/users/sos-trigger", payload);
}

export async function logs() {
  return axiosInstance.get("/users/get-sos-logs");
}

export async function pushLocation(payload: {
  sessionId: string;
  latitude: number;
  longitude: number;
  accuracy?: number;
  speed?: number;
}) {
  return axiosInstance.post("/api/sos/location", payload);
}

export async function resolve(sessionId: string) {
  return axiosInstance.post("/api/sos/resolve", { sessionId });
}

export async function getActiveSession() {
  return axiosInstance.get("/api/sos/active");
}
