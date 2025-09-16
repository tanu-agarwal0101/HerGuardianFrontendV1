import axiosInstance from "../axiosInstance";

export async function start(payload: {
  duration: number;
  shareLocation: boolean;
  latitude?: number;
  longitude?: number;
}) {
  return axiosInstance.post("/timer/start", payload);
}

export async function cancel() {
  return axiosInstance.patch("/timer/cancel", { status: "cancelled" });
}
