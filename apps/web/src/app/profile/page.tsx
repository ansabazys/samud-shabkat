"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ChevronRight,
  ChevronLeft,
  User,
  MapPin,
  Building2,
  Lock,
  Save,
  Check,
  Plus,
  LogOut,
  ShieldCheck,
  LayoutDashboard,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { useAuthStore } from "@/store/auth-store";
import { useLanguageStore } from "@/store/language-store";

export default function ProfilePage() {
  const router = useRouter();
  const tProfile = useTranslations("profile");
  const tCommon = useTranslations("common");
  const language = useLanguageStore((state) => state.language);
  const isRtl = language === "ar";

  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);

  const [activeTab, setActiveTab] = useState<
    "personal" | "address" | "b2b" | "security"
  >("personal");
  const [isSaved, setIsSaved] = useState(false);

  // Personal Info State
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  // B2B State
  const [companyName, setCompanyName] = useState("");
  const [crNumber, setCrNumber] = useState("7013237248");
  const [vatNumber, setVatNumber] = useState("310977874800003");

  // Load authenticated user info
  useEffect(() => {
    if (user) {
      setFirstName(user.firstName || "");
      setLastName(user.lastName || "");
      setEmail(user.email || "");
      setPhone(user.phoneNumber || "+966 50 123 4567");
      setCompanyName(user.companyName || "");
    }
  }, [user]);

  // Saved Addresses
  const [addresses] = useState([
    {
      id: "addr-1",
      title: "Riyadh Head Office",
      city: "Riyadh",
      district: "Al Olaya",
      street: "King Fahd Road, Gate 4",
      isDefault: true,
    },
    {
      id: "addr-2",
      title: "Jeddah Branch Office",
      city: "Jeddah",
      district: "Palestine Street",
      street: "Computer Market Building #12",
      isDefault: false,
    },
  ]);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaved(true);
    setTimeout(() => {
      setIsSaved(false);
    }, 2000);
  };

  const handleLogout = async () => {
    await logout();
    router.push("/login");
  };

  const isAdminUser =
    user?.role === "ADMIN" ||
    user?.role === "SUPER_ADMIN" ||
    user?.role === "MANAGER";

  return (
    <div className="w-full bg-slate-50/50 min-h-screen text-slate-900 font-sans pb-16">
      {/* Breadcrumbs Header */}
      <div className="bg-white border-b border-slate-200/80 py-6 sm:py-8">
        <div className="w-full max-w-7xl md:max-w-4/5 mx-auto px-4 md:px-0">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-500 mb-2">
            <Link href="/" className="hover:text-emerald-700 transition">
              {tCommon("home")}
            </Link>
            {isRtl ? (
              <ChevronLeft className="w-3.5 h-3.5 text-slate-400" />
            ) : (
              <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            )}
            <span className="text-slate-900 font-extrabold">
              {tProfile("pageTitle")}
            </span>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h1 className="text-2xl sm:text-3xl font-black text-slate-950 uppercase tracking-tight">
                  {tProfile("pageTitle")}
                </h1>
                {user?.role && (
                  <span className="inline-flex items-center gap-1 bg-emerald-100 text-emerald-800 text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                    <ShieldCheck className="w-3 h-3" />
                    {user.role.replace("_", " ")}
                  </span>
                )}
              </div>
              <p className="text-xs sm:text-sm font-medium text-slate-500">
                {tProfile("pageSubtitle")}
              </p>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              {isAdminUser && (
                <Link
                  href="/admin/dashboard"
                  className="text-xs font-black text-slate-900 bg-slate-100 px-3.5 py-2 rounded-xl border border-slate-300 hover:bg-slate-200 transition flex items-center gap-1.5 cursor-pointer"
                >
                  <LayoutDashboard className="w-3.5 h-3.5" />
                  Admin Dashboard
                </Link>
              )}
              <Link
                href="/orders"
                className="text-xs font-black text-emerald-700 bg-emerald-50 px-3.5 py-2 rounded-xl border border-emerald-200/80 hover:bg-emerald-100 transition cursor-pointer"
              >
                {tCommon("myOrders")}
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Main Profile Grid */}
      <div className="w-full max-w-7xl md:max-w-4/5 mx-auto px-4 md:px-0 pt-6 sm:pt-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Navigation Sidebar (4 cols) */}
          <div className="col-span-12 lg:col-span-4 space-y-4">
            <div className="bg-white border border-slate-200/90 rounded-2xl p-6 space-y-4 shadow-2xs">
              <div className="flex items-center gap-3.5 pb-4 border-b border-slate-100">
                <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-700 border border-emerald-200/80 flex items-center justify-center font-black text-lg">
                  {user?.firstName ? user.firstName[0].toUpperCase() : "U"}
                </div>
                <div>
                  <h3 className="text-sm font-black text-slate-950 uppercase tracking-tight">
                    {user?.firstName} {user?.lastName}
                  </h3>
                  <span className="text-xs text-slate-500 font-semibold block truncate max-w-[200px]">
                    {user?.email}
                  </span>
                </div>
              </div>

              {/* Navigation Tabs */}
              <nav className="space-y-1.5">
                {[
                  {
                    id: "personal",
                    label: tProfile("tabs.personal"),
                    icon: User,
                  },
                  {
                    id: "address",
                    label: tProfile("tabs.addresses"),
                    icon: MapPin,
                  },
                  { id: "b2b", label: tProfile("tabs.b2b"), icon: Building2 },
                  {
                    id: "security",
                    label: tProfile("tabs.security"),
                    icon: Lock,
                  },
                ].map((item) => {
                  const Icon = item.icon;
                  const isSelected = activeTab === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => setActiveTab(item.id as typeof activeTab)}
                      className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition cursor-pointer ${
                        isSelected
                          ? "bg-[#15803d] text-white shadow-2xs"
                          : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <Icon className="w-4 h-4" />
                        <span>{item.label}</span>
                      </div>
                      {isRtl ? (
                        <ChevronLeft className="w-3.5 h-3.5 opacity-60" />
                      ) : (
                        <ChevronRight className="w-3.5 h-3.5 opacity-60" />
                      )}
                    </button>
                  );
                })}
              </nav>

              <div className="pt-4 border-t border-slate-100">
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2 px-3.5 py-2.5 text-xs font-bold text-red-600 hover:bg-red-50 rounded-xl transition cursor-pointer"
                >
                  <LogOut className="w-4 h-4" />
                  <span>{tProfile("logout")}</span>
                </button>
              </div>
            </div>
          </div>

          {/* Right Form Card (8 cols) */}
          <div className="col-span-12 lg:col-span-8 bg-white border border-slate-200/90 rounded-2xl p-6 sm:p-8 space-y-6 shadow-2xs">
            {activeTab === "personal" && (
              <form onSubmit={handleSave} className="space-y-6">
                <div className="border-b border-slate-100 pb-3">
                  <h3 className="text-sm font-black uppercase tracking-wider text-slate-950">
                    {tProfile("tabs.personal")}
                  </h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-bold">
                  <div>
                    <label className="text-slate-700 block mb-1">
                      {tCommon("fullName")} *
                    </label>
                    <input
                      type="text"
                      required
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold focus:outline-none focus:border-emerald-600"
                    />
                  </div>
                  <div>
                    <label className="text-slate-700 block mb-1">
                      {tCommon("fullName")} (Last) *
                    </label>
                    <input
                      type="text"
                      required
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold focus:outline-none focus:border-emerald-600"
                    />
                  </div>
                  <div>
                    <label className="text-slate-700 block mb-1">
                      {tCommon("email")} *
                    </label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold focus:outline-none focus:border-emerald-600"
                    />
                  </div>
                  <div>
                    <label className="text-slate-700 block mb-1">
                      {tCommon("phone")} *
                    </label>
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold focus:outline-none focus:border-emerald-600"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                  {isSaved && (
                    <span className="text-xs font-extrabold text-emerald-700 flex items-center gap-1">
                      <Check className="w-4 h-4" />
                      <span>{tProfile("savedSuccessfully")}</span>
                    </span>
                  )}
                  <button
                    type="submit"
                    className="bg-[#15803d] hover:bg-emerald-700 text-white font-extrabold text-xs px-6 py-2.5 rounded-xl uppercase tracking-wider transition flex items-center gap-2 cursor-pointer shadow-2xs"
                  >
                    <Save className="w-4 h-4" />
                    <span>{tProfile("saveChanges")}</span>
                  </button>
                </div>
              </form>
            )}

            {activeTab === "address" && (
              <div className="space-y-6">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <h3 className="text-sm font-black uppercase tracking-wider text-slate-950">
                    {tProfile("tabs.addresses")}
                  </h3>
                  <button className="text-xs font-extrabold text-emerald-700 hover:underline flex items-center gap-1 cursor-pointer">
                    <Plus className="w-4 h-4" />
                    <span>{isRtl ? "إضافة عنوان جديد" : "Add Address"}</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {addresses.map((addr) => (
                    <div
                      key={addr.id}
                      className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-2 relative group"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-black uppercase text-slate-900">
                          {addr.title}
                        </span>
                        {addr.isDefault && (
                          <span className="text-[10px] font-black text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                            {isRtl ? "افتراضي" : "Default"}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-600 font-medium leading-relaxed">
                        {addr.street}, {addr.district}, {addr.city}, Saudi
                        Arabia
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === "b2b" && (
              <form onSubmit={handleSave} className="space-y-6">
                <div className="border-b border-slate-100 pb-3">
                  <h3 className="text-sm font-black uppercase tracking-wider text-slate-950">
                    {tProfile("tabs.b2b")}
                  </h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-bold">
                  <div>
                    <label className="text-slate-700 block mb-1">
                      {isRtl ? "اسم المؤسسة / الشركة" : "Company Legal Name"}
                    </label>
                    <input
                      type="text"
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                      placeholder="Samud Technology Solutions Ltd"
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold focus:outline-none focus:border-emerald-600"
                    />
                  </div>
                  <div>
                    <label className="text-slate-700 block mb-1">
                      {isRtl
                        ? "السجل التجاري (CR)"
                        : "Commercial Registration (CR)"}
                    </label>
                    <input
                      type="text"
                      value={crNumber}
                      onChange={(e) => setCrNumber(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold focus:outline-none focus:border-emerald-600"
                    />
                  </div>
                  <div>
                    <label className="text-slate-700 block mb-1">
                      {isRtl ? "الرقم الضريبي ZATCA" : "ZATCA VAT Tax Number"}
                    </label>
                    <input
                      type="text"
                      value={vatNumber}
                      onChange={(e) => setVatNumber(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold focus:outline-none focus:border-emerald-600"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                  <button
                    type="submit"
                    className="bg-[#15803d] hover:bg-emerald-700 text-white font-extrabold text-xs px-6 py-2.5 rounded-xl uppercase tracking-wider transition flex items-center gap-2 cursor-pointer shadow-2xs"
                  >
                    <Save className="w-4 h-4" />
                    <span>{tProfile("saveChanges")}</span>
                  </button>
                </div>
              </form>
            )}

            {activeTab === "security" && (
              <form onSubmit={handleSave} className="space-y-6">
                <div className="border-b border-slate-100 pb-3">
                  <h3 className="text-sm font-black uppercase tracking-wider text-slate-950">
                    {tProfile("tabs.security")}
                  </h3>
                </div>

                <div className="space-y-4 text-xs font-bold max-w-md">
                  <div>
                    <label className="text-slate-700 block mb-1">
                      {isRtl ? "كلمة المرور الحالية" : "Current Password"}
                    </label>
                    <input
                      type="password"
                      placeholder="••••••••"
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold focus:outline-none focus:border-emerald-600"
                    />
                  </div>
                  <div>
                    <label className="text-slate-700 block mb-1">
                      {isRtl ? "كلمة المرور الجديدة" : "New Password"}
                    </label>
                    <input
                      type="password"
                      placeholder="••••••••"
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold focus:outline-none focus:border-emerald-600"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                  <button
                    type="submit"
                    className="bg-[#15803d] hover:bg-emerald-700 text-white font-extrabold text-xs px-6 py-2.5 rounded-xl uppercase tracking-wider transition flex items-center gap-2 cursor-pointer shadow-2xs"
                  >
                    <Save className="w-4 h-4" />
                    <span>{tProfile("saveChanges")}</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
