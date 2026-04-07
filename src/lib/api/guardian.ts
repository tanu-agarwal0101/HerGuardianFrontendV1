import { AxiosRequestConfig } from "axios";
import api from "../axiosInstance";

export const inviteGuardian = async (email: string, config?: AxiosRequestConfig) => {
  const response = await api.post("/api/guardian/invite", { email }, config);
  return response.data;
};

export const checkInviteToken = async (token: string, config?: AxiosRequestConfig) => {
  const response = await api.get("/api/guardian/invite/check", {
    ...config,
    params: { token, ...config?.params },
  });
  return response.data;
};

export const acceptInvite = async (token: string, config?: AxiosRequestConfig) => {
  const response = await api.patch("/api/guardian/accept", { token }, config);
  return response.data;
};

export const rejectInvite = async (token: string, config?: AxiosRequestConfig) => {
  const response = await api.patch("/api/guardian/reject", { token }, config);
  return response.data;
};

export const revokeGuardianLink = async (id: string, config?: AxiosRequestConfig) => {
  const response = await api.delete(`/api/guardian/link/${id}`, config);
  return response.data;
};

export const getGuardianDashboardUsers = async (config?: AxiosRequestConfig) => {
  const response = await api.get("/api/guardian/dashboard", config);
  return response.data;
};

export const getSentInvites = async (config?: AxiosRequestConfig) => {
  const response = await api.get("/api/guardian/invites/sent", config);
  return response.data;
};
