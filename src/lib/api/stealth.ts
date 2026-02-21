import axiosInstance from "../axiosInstance";
// Simple hash function (SHA-256)
async function hashPin(pin: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(pin);
  const hashBuffer = await window.crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(hashBuffer))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export interface StealthSettings {
  stealthMode: boolean;
  stealthType?: string | null;
  stealthPin?: string | null;
  stealthKeyword?: string | null;
  stealthGesture?: string | null;
}

export async function getSettings() {
  const res = await axiosInstance.get("/users/stealth-settings");
  return res.data.stealth as StealthSettings;
}

export async function updateSettings(payload: Partial<StealthSettings>) {
  const toSend = { ...payload };
  if (payload.stealthPin) {
    toSend.stealthPin = await hashPin(payload.stealthPin);
  }
  const res = await axiosInstance.patch("/users/update-stealth", toSend);
  return res.data;
}
