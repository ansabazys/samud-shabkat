"use client";

import { useEffect, useSyncExternalStore } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuthStore } from "@/store/auth-store";
import { ShieldAlert, Loader2, LogIn, ArrowLeft } from "lucide-react";
import Link from "next/link";

interface AuthGuardProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
}

const emptySubscribe = () => () => {};

export function AuthGuard({ children, requireAdmin = false }: AuthGuardProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { isAuthenticated, isAdmin, user, logout } = useAuthStore();
  const isHydrated = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false,
  );

  useEffect(() => {
    if (!isHydrated) return;

    if (!isAuthenticated) {
      const targetLogin = requireAdmin ? "/admin/login" : "/login";
      router.push(
        `${targetLogin}?redirect=${encodeURIComponent(pathname || window.location.pathname)}`,
      );
    }
  }, [isHydrated, isAuthenticated, isAdmin, requireAdmin, router, pathname]);

  if (!isHydrated) {
    return (
      <div className="min-h-screen bg-slate-50/50 text-slate-700 flex items-center justify-center font-sans">
        <div className="flex items-center gap-3 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <Loader2 className="w-5 h-5 animate-spin text-emerald-600" />
          <span className="text-xs font-bold text-slate-800">
            Verifying administrative access...
          </span>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-50/50 text-slate-700 flex items-center justify-center font-sans">
        <div className="flex items-center gap-3 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <Loader2 className="w-5 h-5 animate-spin text-emerald-600" />
          <span className="text-xs font-bold text-slate-800">
            Redirecting to authentication portal...
          </span>
        </div>
      </div>
    );
  }

  if (requireAdmin && !isAdmin) {
    return (
      <div className="min-h-screen bg-slate-50/50 text-slate-900 flex items-center justify-center p-6 font-sans">
        <div className="max-w-md w-full p-8 rounded-3xl bg-white border border-slate-200/90 text-center space-y-5 shadow-md">
          <div className="p-3.5 w-14 h-14 rounded-2xl bg-rose-50 border border-rose-200 text-rose-600 mx-auto flex items-center justify-center shadow-2xs">
            <ShieldAlert className="w-7 h-7" />
          </div>
          <div className="space-y-1.5">
            <h2 className="text-xl font-black text-slate-950 uppercase tracking-tight">Access Restricted</h2>
            <p className="text-xs text-slate-500 font-medium leading-relaxed">
              Logged in as <span className="text-slate-900 font-bold">{user?.email}</span> (Role: <span className="text-amber-700 font-mono font-bold uppercase">{user?.role || "CUSTOMER"}</span>). This backoffice dashboard is restricted exclusively to authorized administrators.
            </p>
          </div>

          <div className="pt-2 space-y-2.5">
            <button
              onClick={() => {
                logout();
                router.push(`/admin/login?redirect=${encodeURIComponent(pathname || "/admin")}`);
              }}
              className="w-full py-3 px-4 bg-[#15803d] hover:bg-emerald-700 text-white font-black rounded-xl text-xs uppercase tracking-wider transition flex items-center justify-center gap-2 cursor-pointer shadow-xs active:scale-98"
            >
              <LogIn className="w-4 h-4" />
              Sign in with Admin Account
            </button>

            <Link
              href="/"
              className="w-full py-2.5 px-4 bg-slate-50 hover:bg-slate-100 text-slate-700 font-bold rounded-xl text-xs transition flex items-center justify-center gap-2 border border-slate-200"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Return to Storefront
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
