import axiosInstance from "../axiosInstance";

export interface AuthResponse {
  accessToken: string;
  user: import("@/helpers/type").User;
}

export async function register(payload: {
  // firstName: string;
  // lastName: string;
  email: string;
  password: string;
  phoneNumber?: string;
  rememberMe?: boolean;
}) {
  return axiosInstance.post("/users/register", payload);
}

export async function login(payload: {
  email: string;
  password: string;
  rememberMe?: boolean;
}) {
  return axiosInstance.post<AuthResponse>("/users/login", payload);
}

export async function refresh() {
  return axiosInstance.post("/users/refresh-token", {});
}

export async function verifyEmail(token: string) {
  return axiosInstance.post("/users/verify-email", { token });
}

export async function forgotPassword(email: string) {
  return axiosInstance.post("/users/forgot-password", { email });
}

export async function resetPassword(token: string, newPassword: string) {
  return axiosInstance.post("/users/reset-password", { token, newPassword });
}

export async function resendVerification(email: string) {
  return axiosInstance.post("/users/resend-verification", { email });
}
