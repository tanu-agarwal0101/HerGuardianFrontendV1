import { toast } from "sonner";

export function toHumanMessage(error: any): string {
  const status = error?.response?.status;
  const data = error?.response?.data;
  const msg = data?.message || data?.error || error?.message;

  if (status === 0 || error?.code === "ERR_NETWORK") return "Network error. Please check your connection.";
  if (status === 400) return msg || "Invalid request.";
  if (status === 401) return "Your session has expired. Please sign in again.";
  if (status === 403) return "You don't have permission to perform this action.";
  if (status === 404) return "Requested resource was not found.";
  if (status === 429) return "Too many requests. Please slow down.";
  if (status >= 500) return "Server error. Please try again later.";
  return msg || "Something went wrong. Please try again.";
}

export function notifyError(error: any) {
  const message = toHumanMessage(error);
  toast.error(message);
}

export function handleUnauthorizedSideEffects() {
  try {
    // Best-effort client reset; server middleware will also protect routes
    if (typeof window !== "undefined") {
      // Clear cookies is server-controlled; redirect to landing
      window.location.href = "/";
    }
  } catch {}
}


