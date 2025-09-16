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
