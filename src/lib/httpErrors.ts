import { toast } from "sonner";

export function toHumanMessage(error: unknown): string {
  const err = error as { response?: { status?: number, data?: { message?: string, error?: string } }, message?: string, code?: string };
  const status = err?.response?.status;
  const data = err?.response?.data;
  const msg = data?.message || data?.error || err?.message;

  if (status === 0 || err?.code === "ERR_NETWORK") return "Network error. Please check your connection.";
  if (status === 400) return msg || "Invalid request.";
  if (status === 401) return "Your session has expired. Please sign in again.";
  if (status === 403) return "You don't have permission to perform this action.";
  if (status === 404) return "Requested resource was not found.";
  if (status === 429) return "Too many requests. Please slow down.";
  if (status !== undefined && status >= 500) return "Server error. Please try again later.";
  return msg || "Something went wrong. Please try again.";
}

export function notifyError(error: unknown) {
  const message = toHumanMessage(error);
  toast.error(message);
}

export function handleUnauthorizedSideEffects() {
  try {
    if (typeof window !== "undefined") {
      document.cookie = "isAuthenticated=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
      document.cookie = "stealthMode=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
      document.cookie = "stealthType=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
      document.cookie = "stealthSession=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
      
      if (window.location.pathname !== "/") {
        window.location.href = "/";
      }
    }
  } catch {}
}


