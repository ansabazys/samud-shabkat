import { api } from "../api";

export interface UserProfile {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: "ADMIN" | "CUSTOMER" | "SUPER_ADMIN" | "MANAGER";
  companyName?: string;
  phoneNumber?: string;
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
    const res = await api.post<any>("/auth/login", credentials);
    const body = res.data?.data ?? res.data;
    return {
      user: body.user,
      tokens: {
        accessToken: body.accessToken ?? body.tokens?.accessToken,
        refreshToken: body.refreshToken ?? body.tokens?.refreshToken,
      },
    };
  },

  async register(data: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    companyName?: string;
    phone?: string;
  }): Promise<LoginResponse> {
    const res = await api.post<any>("/auth/register", data);
    const body = res.data?.data ?? res.data;
    return {
      user: body.user,
      tokens: {
        accessToken: body.accessToken ?? body.tokens?.accessToken,
        refreshToken: body.refreshToken ?? body.tokens?.refreshToken,
      },
    };
  },

  async me(): Promise<UserProfile> {
    const res = await api.get<any>("/auth/me");
    const body = res.data?.data ?? res.data;
    return body.user ?? body;
  },

  async logout(): Promise<void> {
    try {
      await api.post("/auth/logout");
    } catch {
      // Ignore network errors on logout
    }
  },
};
