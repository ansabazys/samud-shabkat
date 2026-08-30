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
          if (tokens.accessToken) {
            localStorage.setItem("accessToken", tokens.accessToken);
          }
          if (tokens.refreshToken) {
            localStorage.setItem("refreshToken", tokens.refreshToken);
          }
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
      onRehydrateStorage: () => (state) => {
        if (state && typeof window !== "undefined") {
          const accessToken = state.tokens?.accessToken;
          const refreshToken = state.tokens?.refreshToken;

          if (
            !accessToken ||
            !refreshToken ||
            accessToken.startsWith("demo-") ||
            refreshToken.startsWith("demo-") ||
            accessToken === "undefined" ||
            refreshToken === "undefined"
          ) {
            if (state.isAuthenticated) {
              state.logout();
            }
          } else {
            localStorage.setItem("accessToken", accessToken);
            localStorage.setItem("refreshToken", refreshToken);
          }
        }
      },
    },
  ),
);
