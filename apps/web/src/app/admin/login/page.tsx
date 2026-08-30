"use client";

import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
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
  KeyRound,
  Loader2,
  Sparkles,
} from "lucide-react";
import { useAuthStore } from "@/store/auth-store";
import { authApi } from "@/lib/api/auth-api";
import { Logo } from "@/components/ui/logo";

function AdminLoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get("redirect") || "/admin";
  const urlError = searchParams.get("error");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(
    urlError === "access_denied"
      ? "Access Denied: Please sign in with an authorized administrator account."
      : null,
  );
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const { isAuthenticated, isAdmin, setAuth } = useAuthStore();

  // If already authenticated as admin, redirect to destination
  useEffect(() => {
    if (isAuthenticated && isAdmin) {
      router.replace(redirectUrl);
    }
  }, [isAuthenticated, isAdmin, redirectUrl, router]);

  const handleQuickFill = () => {
    setEmail("admin@samudshabkat.com");
    setPassword("SuperAdmin123!");
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMsg(null);
    setLoading(true);

    try {
      const response = await authApi.login({
        email: email.trim().toLowerCase(),
        password,
      });

      if (
        response.user.role !== "ADMIN" &&
        response.user.role !== "SUPER_ADMIN" &&
        response.user.role !== "MANAGER"
      ) {
        setError(
          "Access Denied: This account is not authorized to access the store management backoffice.",
        );
        setLoading(false);
        return;
      }

      setAuth(response.user, response.tokens);
      setSuccessMsg("Administrator identity verified. Redirecting to dashboard...");
      setTimeout(() => {
        router.push(redirectUrl);
      }, 600);
    } catch (err: any) {
      console.error("Admin login error:", err);
      if (err?.response?.status === 401) {
        setError("Incorrect email or password. Please check your admin credentials.");
      } else if (err?.response?.status === 500) {
        setError(
          err?.response?.data?.message ||
            "Database/Server connection issue. Please try again in a moment.",
        );
      } else {
        const apiMsg =
          err?.response?.data?.message ||
          err?.response?.data?.error ||
          err?.message;
        setError(
          apiMsg && typeof apiMsg === "string"
            ? apiMsg
            : "Unable to sign in at this time. Please check your connection and try again.",
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full bg-slate-50/50 min-h-screen text-slate-900 font-sans flex items-center justify-center p-4 py-12">
      <div className="max-w-md w-full bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-8 shadow-md space-y-6">
        {/* Header */}
        <div className="flex flex-col items-center text-center space-y-3 pb-1">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-700 flex items-center justify-center shadow-2xs">
            <ShieldAlert className="w-6 h-6" />
          </div>

          <Logo href="/" size="md" />

          <div className="space-y-1 w-full">
            <h1 className="text-2xl font-black text-slate-950 uppercase tracking-tight">
              Admin Portal Sign In
            </h1>
            <p className="text-xs text-slate-500 font-semibold pt-1">
              Authorized store management, inventory control, and order fulfillment portal.
            </p>
          </div>
        </div>

        {/* Alert Messages */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-800 text-xs font-semibold p-3.5 rounded-xl flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
            <span className="leading-tight">{error}</span>
          </div>
        )}

        {successMsg && (
          <div className="bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-semibold p-3.5 rounded-xl flex items-center gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Quick Demo Helper Card */}
        <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between gap-3 text-xs">
          <div className="space-y-0.5">
            <div className="flex items-center gap-1.5 text-emerald-800 font-black">
              <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
              <span>Default Super Admin</span>
            </div>
            <p className="text-[11px] text-slate-500 font-medium font-mono">
              admin@samudshabkat.com
            </p>
          </div>
          <button
            type="button"
            onClick={handleQuickFill}
            className="px-3 py-1.5 bg-emerald-100 hover:bg-emerald-200 text-emerald-900 border border-emerald-300 rounded-lg font-bold text-[11px] transition cursor-pointer flex items-center gap-1 shadow-2xs"
          >
            <KeyRound className="w-3 h-3 text-emerald-700" />
            Autofill
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-black uppercase tracking-wider text-slate-700 block">
              Admin Email
            </label>
            <div className="relative">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@samudshabkat.com"
                className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-emerald-600 focus:bg-white transition"
              />
              <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-black uppercase tracking-wider text-slate-700 block">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-9 pr-9 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-emerald-600 focus:bg-white transition"
              />
              <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 text-slate-400 hover:text-slate-600 cursor-pointer"
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
            className="w-full bg-[#15803d] hover:bg-emerald-700 text-white text-xs font-black py-3.5 rounded-xl uppercase tracking-wider transition cursor-pointer flex items-center justify-center gap-2 shadow-xs active:scale-98 disabled:opacity-50"
          >
            {loading ? (
              <div className="flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Authenticating Admin...</span>
              </div>
            ) : (
              <>
                <span>Access Management Portal</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500 font-medium">
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>Protected Administrative Access Point</span>
          </div>

          <Link
            href="/"
            className="text-emerald-700 font-bold hover:underline"
          >
            Storefront
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function AdminLoginPage() {
  return (
    <Suspense
      fallback={
        <div className="w-full min-h-screen bg-slate-50 flex items-center justify-center">
          <Loader2 className="w-6 h-6 animate-spin text-emerald-600" />
        </div>
      }
    >
      <AdminLoginForm />
    </Suspense>
  );
}
