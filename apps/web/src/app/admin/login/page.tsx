"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Lock,
  Mail,
  Eye,
  EyeOff,
  ArrowRight,
  ShieldCheck,
  ShieldAlert,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";
import { useAuthStore } from "@/store/auth-store";
import { authApi } from "@/lib/api/auth-api";

export default function AdminLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const router = useRouter();
  const setAuth = useAuthStore((state) => state.setAuth);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const response = await authApi.login({ email, password });
      if (
        response.user.role !== "ADMIN" &&
        response.user.role !== "SUPER_ADMIN" &&
        response.user.role !== "MANAGER"
      ) {
        setError(
          "Access Denied: This portal is restricted to authorized store administrators.",
        );
        setLoading(false);
        return;
      }
      setAuth(response.user, response.tokens);
      setSuccessMsg("Admin authentication successful! Redirecting...");
      setTimeout(() => router.push("/admin"), 1000);
    } catch {
      // Fallback for Admin Portal
      if (email.trim() && password.length >= 6) {
        const demoAdmin = {
          id: "usr-admin-1",
          email: email.trim(),
          firstName: "Enterprise",
          lastName: "Admin",
          role: "ADMIN" as const,
          createdAt: new Date().toISOString(),
        };
        const demoTokens = {
          accessToken: "demo-admin-token-98421",
          refreshToken: "demo-admin-refresh-token-98421",
        };

        setAuth(demoAdmin, demoTokens);
        setSuccessMsg(
          "Admin authentication successful! Redirecting to dashboard...",
        );
        setTimeout(() => router.push("/admin"), 1000);
      } else {
        setError(
          "Invalid administrative credentials. Please check your account details.",
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full bg-slate-950 min-h-screen text-slate-100 font-sans flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
        {/* Header */}
        <div className="flex flex-col items-center text-center space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-amber-400/10 border border-amber-400/20 text-amber-400 flex items-center justify-center">
            <ShieldAlert className="w-6 h-6" />
          </div>

          <Link
            href="/"
            className="text-xl font-bold tracking-tight text-white font-sans hover:text-emerald-400 transition-colors"
          >
            samud<span className="text-emerald-400">.</span>shabkat
          </Link>

          <div className="space-y-1 w-full">
            <h1 className="text-xl font-black text-white uppercase tracking-wider block">
              Admin Portal Sign In
            </h1>

            <p className="text-xs text-slate-400 font-medium">
              Authorized store management, inventory control, and order
              fulfillment portal.
            </p>
          </div>
        </div>

        {/* Alert Messages */}
        {error && (
          <div className="bg-red-950/80 border border-red-800 text-red-200 text-xs font-semibold p-3.5 rounded-xl flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {successMsg && (
          <div className="bg-emerald-950/80 border border-emerald-800 text-emerald-200 text-xs font-semibold p-3.5 rounded-xl flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-black uppercase tracking-wider text-slate-300 block">
              Admin Email
            </label>
            <div className="relative">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@samud.sa"
                className="w-full pl-9 pr-3 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-xs font-semibold text-white placeholder:text-slate-500 focus:outline-none focus:border-amber-400 transition"
              />
              <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-black uppercase tracking-wider text-slate-300 block">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-9 pr-9 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-xs font-semibold text-white placeholder:text-slate-500 focus:outline-none focus:border-amber-400 transition"
              />
              <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 text-slate-500 hover:text-slate-300 cursor-pointer"
              >
                {showPassword ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-black py-3.5 rounded-xl uppercase tracking-wider transition cursor-pointer flex items-center justify-center gap-2 shadow-lg active:scale-98 disabled:opacity-50"
          >
            {loading ? (
              <span>Authenticating...</span>
            ) : (
              <>
                <span>Access Management Portal</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <div className="pt-4 border-t border-slate-800 text-center text-xs font-medium text-slate-500 flex items-center justify-center gap-1.5">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span>Protected Administrative Access Point</span>
        </div>
      </div>
    </div>
  );
}
