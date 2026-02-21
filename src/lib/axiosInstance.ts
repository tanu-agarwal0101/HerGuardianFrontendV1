import axios from "axios";
import { notifyError, handleUnauthorizedSideEffects } from "./httpErrors";

// In-memory access token cache populated after refresh/login responses
let accessTokenCache: string | null = null;
let accessTokenExpiryEpoch = 0; // ms epoch

let isRefreshing = false;
let failedQueue: { resolve: (val: string | null) => void, reject: (err: unknown) => void }[] = [];

const processQueue = (error: unknown, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) prom.reject(error);
    else prom.resolve(token);
  });
  failedQueue = [];
};

const axiosInstance = axios.create({
  baseURL:
    process.env.NEXT_PUBLIC_API_URL ||
    process.env.PUBLIC_API_URL ||
    "http://localhost:5000",
  withCredentials: true,
  timeout: 15000, // 15s timeout to prevent hanging
});

// Attach Authorization header if we have a cached token
axiosInstance.interceptors.request.use((config) => {
  if (accessTokenCache) {
    config.headers = config.headers || {};
    if (!config.headers["Authorization"]) {
      config.headers["Authorization"] = `Bearer ${accessTokenCache}`;
    }
  }
  return config;
});

axiosInstance.interceptors.response.use(
  (response) => {
    // If auth endpoints return tokens, capture them
    if (
      response.config.url?.includes("/users/login") ||
      response.config.url?.includes("/users/register")
    ) {
      const newToken = response.data?.accessToken; // backend currently not returning accessToken on login/register; future-proof
      const expiresIn = response.data?.expiresIn; // seconds
      if (newToken && expiresIn) {
        accessTokenCache = newToken;
        accessTokenExpiryEpoch = Date.now() + expiresIn * 1000;
      } else if (expiresIn) {
        // We only got expiresIn (current backend) – no token body; cookies will hold tokens
        accessTokenExpiryEpoch = Date.now() + expiresIn * 1000;
      }
    }
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            if (token)
              originalRequest.headers["Authorization"] = `Bearer ${token}`;
            return axiosInstance(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      isRefreshing = true;
      try {
        const res = await axiosInstance.post("/users/refresh-token");
        const newAccessToken = res.data?.accessToken;
        const expiresIn = res.data?.expiresIn; // seconds
        if (newAccessToken) {
          accessTokenCache = newAccessToken;
          axiosInstance.defaults.headers.common["Authorization"] =
            `Bearer ${newAccessToken}`;
        }
        if (expiresIn) {
          accessTokenExpiryEpoch = Date.now() + expiresIn * 1000;
        }
        processQueue(null, newAccessToken || null);
        return axiosInstance(originalRequest);
      } catch (refreshErr) {
        processQueue(refreshErr, null);
        if ((refreshErr as { response?: { status?: number } })?.response?.status === 401) {
          // Refresh is invalid; force sign-out UX
          handleUnauthorizedSideEffects();
        }
        return Promise.reject(refreshErr);
      } finally {
        isRefreshing = false;
      }
    }

    // For other errors, surface a human-friendly toast
    try {
      if (error?.config?.suppressToast !== true) {
        notifyError(error);
      }
    } catch {}
    return Promise.reject(error);
  }
);

export default axiosInstance;

// Export simple accessors (will be used by passive refresh scheduler)
export const getAccessTokenMeta = () => ({
  token: accessTokenCache,
  expiresAt: accessTokenExpiryEpoch,
});
