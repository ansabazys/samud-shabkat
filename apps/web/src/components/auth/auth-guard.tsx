"use client";

import { useEffect, useSyncExternalStore } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/auth-store";
import { ShieldAlert, Loader2 } from "lucide-react";

interface AuthGuardProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
}

const emptySubscribe = () => () => {};

export function AuthGuard({ children, requireAdmin = false }: AuthGuardProps) {
  const router = useRouter();
  const { isAuthenticated, isAdmin } = useAuthStore();
  const isHydrated = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false,
  );

  useEffect(() => {
    if (!isHydrated) return;

    if (!isAuthenticated) {
      router.push(
        `/login?redirect=${encodeURIComponent(window.location.pathname)}`,
      );
    } else if (requireAdmin && !isAdmin) {
      router.push("/");
    }
  }, [isHydrated, isAuthenticated, isAdmin, requireAdmin, router]);

  if (!isHydrated) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-300 flex items-center justify-center">
        <div className="flex items-center gap-3">
          <Loader2 className="w-6 h-6 animate-spin text-cyan-400" />
          <span className="text-sm font-medium">
            Verifying authorization...
          </span>
        </div>
      </div>
    );
  }

  if (requireAdmin && !isAdmin) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-300 flex items-center justify-center p-6">
        <div className="max-w-md w-full p-8 rounded-3xl bg-slate-900 border border-slate-800 text-center space-y-4">
          <div className="p-3 w-12 h-12 rounded-2xl bg-rose-950/80 border border-rose-500/30 text-rose-400 mx-auto flex items-center justify-center">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-bold text-white">Access Denied</h2>
          <p className="text-xs text-slate-400 leading-relaxed">
            You do not have administrative permissions to view the backoffice
            portal.
          </p>
          <button
            onClick={() => router.push("/")}
            className="w-full py-3 px-4 bg-cyan-600 hover:bg-cyan-500 text-white font-semibold rounded-xl text-xs transition"
          >
            Return to Storefront
          </button>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
