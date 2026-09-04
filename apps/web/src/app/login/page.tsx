"use client";

import { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Lock,
  Mail,
  Eye,
  EyeOff,
  ArrowRight,
  ArrowLeft,
  ShieldCheck,
  AlertCircle,
  CheckCircle2,
  Loader2,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { useAuthStore } from "@/store/auth-store";
import { useLanguageStore } from "@/store/language-store";
import { authApi } from "@/lib/api/auth-api";
import { Logo } from "@/components/ui/logo";

function LoginForm() {
  const tAuth = useTranslations("auth");
  const language = useLanguageStore((state) => state.language);
  const isRtl = language === "ar";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get("redirect") || "";
  const setAuth = useAuthStore((state) => state.setAuth);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const response = await authApi.login({
        email: email.trim().toLowerCase(),
        password,
      });

      setAuth(response.user, response.tokens);
      setSuccessMsg(
        isRtl
          ? "تم تسجيل الدخول بنجاح! جاري التحويل..."
          : "Signed in successfully! Redirecting...",
      );

      setTimeout(() => {
        if (redirectUrl) {
          router.push(redirectUrl);
        } else if (
          response.user.role === "ADMIN" ||
          response.user.role === "SUPER_ADMIN" ||
          response.user.role === "MANAGER"
        ) {
          router.push("/admin");
        } else {
          router.push("/profile");
        }
      }, 700);
    } catch (err: unknown) {
      console.error("Login error:", err);
      const error = err as {
        response?: {
          data?: { message?: unknown; error?: unknown };
          status?: number;
        };
        message?: unknown;
      };
      const apiMsg =
        error.response?.data?.message ||
        error.response?.data?.error ||
        error.message;
      if (error.response?.status === 401) {
        setError(
          isRtl
            ? "البريد الإلكتروني أو كلمة المرور غير صحيحة."
            : "Incorrect email or password. Please check your spelling.",
        );
      } else {
        setError(
          typeof apiMsg === "string"
            ? apiMsg
            : isRtl
              ? "تعذر تسجيل الدخول. يرجى التحقق من البيانات."
              : "Unable to sign in. Please check your email and password.",
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-8 shadow-md space-y-6">
      {/* Header */}
      <div className="flex flex-col items-center text-center space-y-3 pb-1">
        <Logo href="/" size="lg" />

        <div className="space-y-1 w-full">
          <h1 className="text-2xl font-black text-slate-950 uppercase tracking-tight relative inline-block">
            {tAuth("loginTitle")}
            <span className="absolute bottom-[-6px] left-1/2 -translate-x-1/2 w-16 h-[3px] bg-[#FFD400] rounded-full" />
          </h1>

          <p className="text-xs text-slate-500 font-semibold pt-2">
            {tAuth("loginSubtitle")}
          </p>
        </div>
      </div>

      {/* Alert Banners */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-800 text-xs font-semibold p-3.5 rounded-xl flex items-start gap-2">
          <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      {successMsg && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-semibold p-3.5 rounded-xl flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Login Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Email Field */}
        <div className="space-y-1.5">
          <label className="text-xs font-black uppercase tracking-wider text-slate-700 block">
            {tAuth("email")}
          </label>
          <div className="relative">
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@example.com"
              className="w-full ps-9 pe-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:outline-none focus:border-emerald-600 focus:bg-white transition"
            />
            <Mail className="w-4 h-4 text-slate-400 absolute start-3 top-3" />
          </div>
        </div>

        {/* Password Field */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label className="text-xs font-black uppercase tracking-wider text-slate-700 block">
              {tAuth("password")}
            </label>
            <a
              href="#forgot"
              onClick={(e) => {
                e.preventDefault();
                alert(
                  isRtl
                    ? "تم إرسال تعليمات استعادة كلمة المرور إلى بريدك الإلكتروني!"
                    : "Password reset instructions sent to your email!",
                );
              }}
              className="text-[11px] font-extrabold text-emerald-700 hover:underline"
            >
              {tAuth("forgotPassword")}
            </a>
          </div>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full ps-9 pe-9 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:outline-none focus:border-emerald-600 focus:bg-white transition"
            />
            <Lock className="w-4 h-4 text-slate-400 absolute start-3 top-3" />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute end-3 top-3 text-slate-400 hover:text-slate-600 cursor-pointer"
            >
              {showPassword ? (
                <EyeOff className="w-4 h-4" />
              ) : (
                <Eye className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>

        {/* Remember Me */}
        <div className="flex items-center justify-between text-xs pt-1">
          <label className="flex items-center gap-2 font-semibold text-slate-700 cursor-pointer">
            <input
              type="checkbox"
              defaultChecked
              className="w-4 h-4 accent-emerald-600 rounded"
            />
            <span>{tAuth("rememberMe")}</span>
          </label>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-[#15803d] hover:bg-emerald-700 text-white text-xs font-black py-3.5 rounded-xl uppercase tracking-wider transition cursor-pointer flex items-center justify-center gap-2 shadow-xs active:scale-98 disabled:opacity-50"
        >
          {loading ? (
            <div className="flex items-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>{tAuth("signingIn")}</span>
            </div>
          ) : (
            <>
              <span>{tAuth("signInButton")}</span>
              {isRtl ? (
                <ArrowLeft className="w-4 h-4" />
              ) : (
                <ArrowRight className="w-4 h-4" />
              )}
            </>
          )}
        </button>
      </form>

      {/* Footer Register Link */}
      <div className="pt-4 border-t border-slate-100 text-center text-xs font-semibold text-slate-600">
        {tAuth("dontHaveAccount")}{" "}
        <Link
          href={
            redirectUrl
              ? `/register?redirect=${encodeURIComponent(redirectUrl)}`
              : "/register"
          }
          className="font-extrabold text-emerald-700 hover:underline"
        >
          {tAuth("registerLink")}
        </Link>
      </div>
    </div>
  );
}

export default function LoginPage() {
  const tCommon = useTranslations("common");

  return (
    <div className="w-full bg-slate-50/50 min-h-screen text-slate-900 font-sans pb-16">
      <div className="w-full max-w-7xl md:max-w-4/5 mx-auto px-4 md:px-0 py-8 sm:py-12">
        <Suspense
          fallback={
            <div className="max-w-md mx-auto bg-white border border-slate-200 rounded-3xl p-12 text-center">
              <Loader2 className="w-8 h-8 animate-spin mx-auto text-slate-400" />
            </div>
          }
        >
          <LoginForm />
        </Suspense>

        {/* Security Note */}
        <div className="max-w-md mx-auto mt-6 text-center text-[11px] text-slate-400 font-medium flex items-center justify-center gap-1.5">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
          <span>{tCommon("zatcaVatBadge")}</span>
        </div>
      </div>
    </div>
  );
}
