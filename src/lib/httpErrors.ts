import { toast } from "sonner";
import { clearTokenCache } from "./axiosInstance";

export function toHumanMessage(error: unknown): string {
  const err = error as { 
    response?: { 
      status?: number, 
      data?: { message?: string, error?: string, errors?: string[] } 
    }, 
    message?: string, 
    code?: string 
  };
  const status = err?.response?.status;
  const data = err?.response?.data;

  if (data?.errors && Array.isArray(data.errors) && data.errors.length > 0) {
    return data.errors.join(", ");
  }

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
    clearTokenCache();

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


