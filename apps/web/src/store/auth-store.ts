import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { UserProfile, AuthTokens } from "@/lib/api/auth-api";

interface AuthState {
  user: UserProfile | null;
  tokens: AuthTokens | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  setAuth: (user: UserProfile, tokens: AuthTokens) => void;
  updateUser: (user: UserProfile) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      tokens: null,
      isAuthenticated: false,
      isAdmin: false,
      setAuth: (user, tokens) => {
        if (typeof window !== "undefined") {
          localStorage.setItem("accessToken", tokens.accessToken);
          localStorage.setItem("refreshToken", tokens.refreshToken);
        }
        const isAdminRole =
          user.role === "ADMIN" ||
          user.role === "SUPER_ADMIN" ||
          user.role === "MANAGER";
        set({
          user,
          tokens,
          isAuthenticated: true,
          isAdmin: isAdminRole,
        });
      },
      updateUser: (user) => {
        const isAdminRole =
          user.role === "ADMIN" ||
          user.role === "SUPER_ADMIN" ||
          user.role === "MANAGER";
        set({
          user,
          isAdmin: isAdminRole,
        });
      },
      logout: () => {
        if (typeof window !== "undefined") {
          localStorage.removeItem("accessToken");
          localStorage.removeItem("refreshToken");
        }
        set({
          user: null,
          tokens: null,
          isAuthenticated: false,
          isAdmin: false,
        });
      },
    }),
    {
      name: "samud-auth-storage",
    },
  ),
);
