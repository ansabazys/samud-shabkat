import { api } from "../api";

export interface UserProfile {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: "ADMIN" | "CUSTOMER" | "SUPER_ADMIN" | "MANAGER";
  avatarUrl?: string;
  createdAt?: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface LoginResponse {
  user: UserProfile;
  tokens: AuthTokens;
}

export const authApi = {
  async login(credentials: {
    email: string;
    password: string;
  }): Promise<LoginResponse> {
    const res = await api.post<{ success: boolean; data: LoginResponse }>(
      "/auth/login",
      credentials,
    );
    return res.data.data;
  },

  async register(data: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    companyName?: string;
    phone?: string;
  }): Promise<LoginResponse> {
    const res = await api.post<{ success: boolean; data: LoginResponse }>(
      "/auth/register",
      data,
    );
    return res.data.data;
  },

  async me(): Promise<UserProfile> {
    const res = await api.get<{ success: boolean; data: UserProfile }>(
      "/auth/me",
    );
    return res.data.data;
  },

  async logout(): Promise<void> {
    await api.post("/auth/logout");
  },
};
