import axiosInstance from "../axiosInstance";

export interface AuthResponse {
  accessToken: string;
  user: any;
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
