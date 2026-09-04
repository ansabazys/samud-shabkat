"use client";

import { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  User,
  Mail,
  Lock,
  Building2,
  Phone,
  FileText,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  ArrowLeft,
  ShieldCheck,
  Eye,
  EyeOff,
  Loader2,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { useAuthStore } from "@/store/auth-store";
import { useLanguageStore } from "@/store/language-store";
import { authApi } from "@/lib/api/auth-api";
import { Logo } from "@/components/ui/logo";

function RegisterForm() {
  const tAuth = useTranslations("auth");
  const tCommon = useTranslations("common");
  const language = useLanguageStore((state) => state.language);
  const isRtl = language === "ar";

  const [accountType, setAccountType] = useState<"individual" | "corporate">(
    "individual",
  );
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [commercialReg, setCommercialReg] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(true);

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

    if (password !== confirmPassword) {
      setError(
        isRtl
          ? "كلمتا المرور غير متطابقتين."
          : "Passwords do not match. Please verify your password entry.",
      );
      return;
    }

    if (password.length < 6) {
      setError(
        isRtl
          ? "يجب أن تتكون كلمة المرور من 6 أحرف على الأقل."
          : "Password must be at least 6 characters long.",
      );
      return;
    }

    if (!agreeTerms) {
      setError(
        isRtl
          ? "يجب الموافقة على الشروط والأحكام وسياسة الخصوصية للمتابعة."
          : "You must agree to the Terms of Service and Privacy Policy to register.",
      );
      return;
    }

    setLoading(true);

    try {
      const response = await authApi.register({
        email: email.trim().toLowerCase(),
        password,
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        companyName:
          accountType === "corporate" ? companyName.trim() : undefined,
        phone: phone.trim(),
      });

      setAuth(response.user, response.tokens);
      setSuccessMsg(
        isRtl
          ? "تم إنشاء الحساب بنجاح! جاري التحويل..."
          : "Account created successfully! Redirecting...",
      );
      setTimeout(() => {
        if (redirectUrl) {
          router.push(redirectUrl);
        } else {
          router.push("/profile");
        }
      }, 700);
    } catch (err: unknown) {
      console.error("Registration error:", err);
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
      if (error.response?.status === 409) {
        setError(
          isRtl
            ? "يوجد حساب مسجل بهذا البريد الإلكتروني مسبقاً. يرجى تسجيل الدخول."
            : "An account with this email address already exists. Please sign in.",
        );
      } else {
        setError(
          typeof apiMsg === "string"
            ? apiMsg
            : isRtl
              ? "فشل إنشاء الحساب. يرجى التحقق من البيانات والمحاولة مجدداً."
              : "Failed to create account. Please check your details and try again.",
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-8 shadow-md space-y-6">
      {/* Header */}
      <div className="flex flex-col items-center text-center space-y-3 pb-1">
        <Logo href="/" size="lg" />

        <div className="space-y-1 w-full">
          <h1 className="text-2xl font-black text-slate-950 uppercase tracking-tight relative inline-block">
            {tAuth("registerTitle")}
            <span className="absolute bottom-[-6px] left-1/2 -translate-x-1/2 w-16 h-[3px] bg-[#FFD400] rounded-full" />
          </h1>

          <p className="text-xs text-slate-500 font-semibold pt-2">
            {tAuth("registerSubtitle")}
          </p>
        </div>
      </div>

      {/* Account Type Selector Pills */}
      <div className="bg-slate-100 p-1.5 rounded-2xl border border-slate-200 grid grid-cols-2 gap-1 text-xs">
        <button
          type="button"
          onClick={() => setAccountType("individual")}
          className={`py-2 rounded-xl font-black uppercase tracking-wider transition cursor-pointer flex items-center justify-center gap-1.5 ${
            accountType === "individual"
              ? "bg-white text-slate-950 shadow-2xs"
              : "text-slate-500 hover:text-slate-900"
          }`}
        >
          <User className="w-3.5 h-3.5" />
          <span>{tAuth("individualAccount")}</span>
        </button>
        <button
          type="button"
          onClick={() => setAccountType("corporate")}
          className={`py-2 rounded-xl font-black uppercase tracking-wider transition cursor-pointer flex items-center justify-center gap-1.5 ${
            accountType === "corporate"
              ? "bg-white text-slate-950 shadow-2xs"
              : "text-slate-500 hover:text-slate-900"
          }`}
        >
          <Building2 className="w-3.5 h-3.5 text-emerald-700" />
          <span>{tAuth("corporateAccount")}</span>
        </button>
      </div>

      {/* Alert Messages */}
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

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* First & Last Name */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <label className="text-xs font-black uppercase tracking-wider text-slate-700 block">
              {tCommon("fullName")}
            </label>
            <input
              type="text"
              required
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              placeholder="Ahmed"
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:outline-none focus:border-emerald-600 focus:bg-white"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-black uppercase tracking-wider text-slate-700 block">
              {tCommon("fullName")} (Last)
            </label>
            <input
              type="text"
              required
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              placeholder="Al-Mansoor"
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:outline-none focus:border-emerald-600 focus:bg-white"
            />
          </div>
        </div>

        {/* Email Address */}
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
              placeholder="ahmed@example.sa"
              className="w-full ps-9 pe-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:outline-none focus:border-emerald-600 focus:bg-white"
            />
            <Mail className="w-4 h-4 text-slate-400 absolute start-3 top-3" />
          </div>
        </div>

        {/* Phone Number */}
        <div className="space-y-1.5">
          <label className="text-xs font-black uppercase tracking-wider text-slate-700 block">
            {tAuth("phone")}
          </label>
          <div className="relative">
            <input
              type="tel"
              required
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+966 50 123 4567"
              className="w-full ps-9 pe-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:outline-none focus:border-emerald-600 focus:bg-white"
            />
            <Phone className="w-4 h-4 text-slate-400 absolute start-3 top-3" />
          </div>
        </div>

        {/* Corporate B2B Specific Fields */}
        {accountType === "corporate" && (
          <div className="space-y-3 pt-1 border-t border-slate-100">
            <div className="space-y-1.5">
              <label className="text-xs font-black uppercase tracking-wider text-emerald-800 flex items-center gap-1">
                <Building2 className="w-3.5 h-3.5" />
                <span>{tAuth("companyName")}</span>
              </label>
              <input
                type="text"
                required
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                placeholder="Saudi Technology Solutions Ltd."
                className="w-full px-3.5 py-2.5 bg-emerald-50/50 border border-emerald-200 rounded-xl text-xs font-semibold text-slate-900 focus:outline-none focus:border-emerald-600"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-black uppercase tracking-wider text-slate-700 flex items-center gap-1">
                <FileText className="w-3.5 h-3.5" />
                <span>{tAuth("commercialReg")}</span>
              </label>
              <input
                type="text"
                value={commercialReg}
                onChange={(e) => setCommercialReg(e.target.value)}
                placeholder="1010884920 (ZATCA Compliant)"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:outline-none focus:border-emerald-600"
              />
            </div>
          </div>
        )}

        {/* Password & Confirm Password */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <label className="text-xs font-black uppercase tracking-wider text-slate-700 block">
              {tAuth("password")}
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full ps-9 pe-9 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:outline-none focus:border-emerald-600"
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

          <div className="space-y-1.5">
            <label className="text-xs font-black uppercase tracking-wider text-slate-700 block">
              {tAuth("confirmPassword")}
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full ps-9 pe-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:outline-none focus:border-emerald-600"
              />
              <Lock className="w-4 h-4 text-slate-400 absolute start-3 top-3" />
            </div>
          </div>
        </div>

        {/* Terms Checkbox */}
        <div className="pt-1">
          <label className="flex items-start gap-2 text-xs font-semibold text-slate-600 cursor-pointer">
            <input
              type="checkbox"
              checked={agreeTerms}
              onChange={(e) => setAgreeTerms(e.target.checked)}
              className="w-4 h-4 accent-emerald-600 rounded mt-0.5"
            />
            <span>
              {isRtl
                ? "أوافق على الشروط والأحكام وسياسة الخصوصية الضريبية"
                : "I agree to the Terms of Service and Privacy Policy."}
            </span>
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
              <span>{tAuth("registerButton")}...</span>
            </div>
          ) : (
            <>
              <span>{tAuth("registerButton")}</span>
              {isRtl ? (
                <ArrowLeft className="w-4 h-4" />
              ) : (
                <ArrowRight className="w-4 h-4" />
              )}
            </>
          )}
        </button>
      </form>

      {/* Footer Login Link */}
      <div className="pt-4 border-t border-slate-100 text-center text-xs font-semibold text-slate-600">
        {tAuth("alreadyHaveAccount")}{" "}
        <Link
          href={
            redirectUrl
              ? `/login?redirect=${encodeURIComponent(redirectUrl)}`
              : "/login"
          }
          className="font-extrabold text-emerald-700 hover:underline"
        >
          {tAuth("loginLink")}
        </Link>
      </div>
    </div>
  );
}

export default function RegisterPage() {
  const tCommon = useTranslations("common");

  return (
    <div className="w-full bg-slate-50/50 min-h-screen text-slate-900 font-sans pb-16">
      <div className="w-full max-w-7xl md:max-w-4/5 mx-auto px-4 md:px-0 py-8 sm:py-12">
        <Suspense
          fallback={
            <div className="max-w-lg mx-auto bg-white border border-slate-200 rounded-3xl p-12 text-center">
              <Loader2 className="w-8 h-8 animate-spin mx-auto text-slate-400" />
            </div>
          }
        >
          <RegisterForm />
        </Suspense>

        {/* Security Note */}
        <div className="max-w-lg mx-auto mt-6 text-center text-[11px] text-slate-400 font-medium flex items-center justify-center gap-1.5">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
          <span>{tCommon("zatcaVatBadge")}</span>
        </div>
      </div>
    </div>
  );
}
