import axios from "axios";
import { notifyError, handleUnauthorizedSideEffects } from "./httpErrors";
import { useUserStore } from "@/store/userStore";

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
  timeout: 60000, // 60s timeout to handle Render cold starts
});

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
    if (
      response.config.url?.includes("/users/login") ||
      response.config.url?.includes("/users/register")
    ) {
      const newToken = response.data?.accessToken; 
      const expiresIn = response.data?.expiresIn; // seconds
      if (newToken && expiresIn) {
        accessTokenCache = newToken;
        accessTokenExpiryEpoch = Date.now() + expiresIn * 1000;
      } else if (expiresIn) {
        
        accessTokenExpiryEpoch = Date.now() + expiresIn * 1000;
      }
    }
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    const url = originalRequest.url || "";

    
    if (url.includes("/users/refresh-token")) {
      return Promise.reject(error);
    }

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
        
        const refreshBaseUrl = axiosInstance.defaults.baseURL;
        const res = await axios.post(`${refreshBaseUrl}/users/refresh-token`, {}, { withCredentials: true });
        
        const newAccessToken = res.data?.accessToken;
        const expiresIn = res.data?.expiresIn; 
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
        const status = (refreshErr as { response?: { status?: number } })?.response?.status;
        if (status === 401 || status === 403 || status === 404) {
          
          try {
            useUserStore.getState().logout();
          } catch (e) {
            console.error("Failed to clear store", e);
          }
          handleUnauthorizedSideEffects();
        }
        return Promise.reject(refreshErr);
      } finally {
        isRefreshing = false;
      }
    }
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
