"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ChevronRight,
  User,
  MapPin,
  Building2,
  Lock,
  Save,
  Check,
  Plus,
  Trash2,
  LogOut,
  ShieldCheck,
  LayoutDashboard,
} from "lucide-react";
import { useAuthStore } from "@/store/auth-store";

export default function ProfilePage() {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
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
  const [addresses, setAddresses] = useState([
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
              Home
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-slate-900 font-extrabold">My Profile</span>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h1 className="text-2xl sm:text-3xl font-black text-slate-950 uppercase tracking-tight">
                  Profile & Account Settings
                </h1>
                {user?.role && (
                  <span className="inline-flex items-center gap-1 bg-emerald-100 text-emerald-800 text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                    <ShieldCheck className="w-3 h-3" />
                    {user.role.replace("_", " ")}
                  </span>
                )}
              </div>
              <p className="text-xs sm:text-sm font-medium text-slate-500">
                Manage your personal details, delivery addresses, and ZATCA VAT tax credentials.
              </p>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              {isAdminUser && (
                <Link
                  href="/admin/dashboard"
                  className="text-xs font-black text-slate-900 bg-slate-100 px-3.5 py-2 rounded-xl border border-slate-300 hover:bg-slate-200 transition flex items-center gap-1.5"
                >
                  <LayoutDashboard className="w-3.5 h-3.5" />
                  Admin Dashboard
                </Link>
              )}
              <Link
                href="/orders"
                className="text-xs font-black text-emerald-700 bg-emerald-50 px-3.5 py-2 rounded-xl border border-emerald-200/80 hover:bg-emerald-100 transition"
              >
                View Order History
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Main Body Container */}
      <div className="w-full max-w-7xl md:max-w-4/5 mx-auto px-4 md:px-0 pt-6 sm:pt-8">
        {!isAuthenticated ? (
          <div className="bg-white border border-slate-200/90 rounded-2xl p-8 sm:p-12 text-center max-w-xl mx-auto shadow-2xs">
            <User className="w-12 h-12 text-slate-400 mx-auto mb-3" />
            <h2 className="text-lg font-black text-slate-900 mb-1">
              Sign In to View Your Profile
            </h2>
            <p className="text-xs text-slate-500 mb-6">
              Access your personal information, saved delivery addresses, and B2B corporate details.
            </p>
            <div className="flex items-center justify-center gap-3">
              <Link
                href="/login"
                className="bg-[#15803d] hover:bg-emerald-700 text-white font-extrabold text-xs px-6 py-2.5 rounded-xl uppercase tracking-wider transition"
              >
                Sign In
              </Link>
              <Link
                href="/register"
                className="bg-slate-100 hover:bg-slate-200 text-slate-800 font-extrabold text-xs px-6 py-2.5 rounded-xl uppercase tracking-wider transition"
              >
                Create Account
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Navigation Sidebar (3 cols) */}
            <div className="col-span-12 lg:col-span-3 bg-white border border-slate-200/90 rounded-2xl p-3 space-y-1 shadow-2xs">
              <button
                onClick={() => setActiveTab("personal")}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                  activeTab === "personal"
                    ? "bg-[#15803d] text-white shadow-2xs"
                    : "text-slate-700 hover:bg-slate-50"
                }`}
              >
                <User className="w-4 h-4" />
                <span>Personal Information</span>
              </button>

              <button
                onClick={() => setActiveTab("address")}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                  activeTab === "address"
                    ? "bg-[#15803d] text-white shadow-2xs"
                    : "text-slate-700 hover:bg-slate-50"
                }`}
              >
                <MapPin className="w-4 h-4" />
                <span>Saved Addresses ({addresses.length})</span>
              </button>

              <button
                onClick={() => setActiveTab("b2b")}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                  activeTab === "b2b"
                    ? "bg-[#15803d] text-white shadow-2xs"
                    : "text-slate-700 hover:bg-slate-50"
                }`}
              >
                <Building2 className="w-4 h-4" />
                <span>Corporate & ZATCA VAT</span>
              </button>

              <button
                onClick={() => setActiveTab("security")}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                  activeTab === "security"
                    ? "bg-[#15803d] text-white shadow-2xs"
                    : "text-slate-700 hover:bg-slate-50"
                }`}
              >
                <Lock className="w-4 h-4" />
                <span>Security & Password</span>
              </button>

              <div className="pt-2 border-t border-slate-100">
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold text-red-600 hover:bg-red-50 transition cursor-pointer"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Sign Out</span>
                </button>
              </div>
            </div>

            {/* Form Panel (9 cols) */}
            <div className="col-span-12 lg:col-span-9 bg-white border border-slate-200/90 rounded-2xl p-6 sm:p-8 space-y-6 shadow-2xs">
              {activeTab === "personal" && (
                <form onSubmit={handleSave} className="space-y-6">
                  <div className="pb-3 border-b border-slate-100">
                    <h3 className="text-sm font-black uppercase tracking-wider text-slate-950">
                      Personal Information
                    </h3>
                    <p className="text-xs font-medium text-slate-500 mt-0.5">
                      Update your account name and Saudi phone number for order SMS notifications.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                    <div>
                      <label className="font-extrabold text-slate-700 block mb-1">
                        First Name *
                      </label>
                      <input
                        type="text"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold focus:outline-none focus:border-emerald-600"
                      />
                    </div>
                    <div>
                      <label className="font-extrabold text-slate-700 block mb-1">
                        Last Name *
                      </label>
                      <input
                        type="text"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold focus:outline-none focus:border-emerald-600"
                      />
                    </div>
                    <div>
                      <label className="font-extrabold text-slate-700 block mb-1">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        value={email}
                        disabled
                        className="w-full px-3 py-2 bg-slate-100 border border-slate-200 rounded-xl font-bold text-slate-500 cursor-not-allowed"
                      />
                    </div>
                    <div>
                      <label className="font-extrabold text-slate-700 block mb-1">
                        Saudi Phone (+966) *
                      </label>
                      <input
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold focus:outline-none focus:border-emerald-600"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="bg-[#15803d] hover:bg-emerald-700 text-white font-extrabold text-xs px-6 py-3 rounded-xl uppercase tracking-wider transition cursor-pointer flex items-center gap-2 shadow-xs"
                  >
                    {isSaved ? (
                      <>
                        <Check className="w-4 h-4 stroke-[3]" />
                        <span>Changes Saved!</span>
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4" />
                        <span>Save Changes</span>
                      </>
                    )}
                  </button>
                </form>
              )}

              {activeTab === "address" && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                    <div>
                      <h3 className="text-sm font-black uppercase tracking-wider text-slate-950">
                        Saved Delivery Addresses
                      </h3>
                      <p className="text-xs font-medium text-slate-500 mt-0.5">
                        Manage your delivery locations across Saudi Arabia.
                      </p>
                    </div>

                    <button className="bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs px-4 py-2 rounded-xl uppercase tracking-wider transition flex items-center gap-1.5 cursor-pointer">
                      <Plus className="w-4 h-4" />
                      <span>Add New Address</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {addresses.map((addr) => (
                      <div
                        key={addr.id}
                        className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-2 relative"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-black text-slate-900 uppercase">
                            {addr.title}
                          </span>
                          {addr.isDefault && (
                            <span className="bg-emerald-100 text-emerald-800 text-[9px] font-black px-2 py-0.5 rounded uppercase">
                              Default
                            </span>
                          )}
                        </div>
                        <p className="text-xs font-semibold text-slate-600 leading-relaxed">
                          {addr.street}, {addr.district}, {addr.city}, Saudi Arabia
                        </p>

                        <div className="pt-2 flex items-center gap-2 border-t border-slate-200 text-xs font-bold text-slate-500">
                          <button className="hover:text-slate-900 cursor-pointer">Edit</button>
                          <span>•</span>
                          <button
                            onClick={() =>
                              setAddresses(addresses.filter((a) => a.id !== addr.id))
                            }
                            className="hover:text-red-600 cursor-pointer text-slate-400"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === "b2b" && (
                <form onSubmit={handleSave} className="space-y-6">
                  <div className="pb-3 border-b border-slate-100">
                    <h3 className="text-sm font-black uppercase tracking-wider text-slate-950">
                      Corporate & ZATCA Tax Information
                    </h3>
                    <p className="text-xs font-medium text-slate-500 mt-0.5">
                      Save your commercial registration and ZATCA VAT details for automated B2B tax invoice generation.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                    <div>
                      <label className="font-extrabold text-slate-700 block mb-1">
                        Company Name
                      </label>
                      <input
                        type="text"
                        value={companyName}
                        onChange={(e) => setCompanyName(e.target.value)}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold focus:outline-none focus:border-emerald-600"
                      />
                    </div>
                    <div>
                      <label className="font-extrabold text-slate-700 block mb-1">
                        Commercial Registration (CR) #
                      </label>
                      <input
                        type="text"
                        value={crNumber}
                        onChange={(e) => setCrNumber(e.target.value)}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold focus:outline-none focus:border-emerald-600"
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="font-extrabold text-slate-700 block mb-1">
                        ZATCA VAT Tax Number #
                      </label>
                      <input
                        type="text"
                        value={vatNumber}
                        onChange={(e) => setVatNumber(e.target.value)}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold focus:outline-none focus:border-emerald-600"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="bg-[#15803d] hover:bg-emerald-700 text-white font-extrabold text-xs px-6 py-3 rounded-xl uppercase tracking-wider transition cursor-pointer flex items-center gap-2 shadow-xs"
                  >
                    {isSaved ? (
                      <>
                        <Check className="w-4 h-4 stroke-[3]" />
                        <span>VAT Details Saved!</span>
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4" />
                        <span>Save B2B Tax Details</span>
                      </>
                    )}
                  </button>
                </form>
              )}

              {activeTab === "security" && (
                <form onSubmit={handleSave} className="space-y-6">
                  <div className="pb-3 border-b border-slate-100">
                    <h3 className="text-sm font-black uppercase tracking-wider text-slate-950">
                      Account Security & Password
                    </h3>
                    <p className="text-xs font-medium text-slate-500 mt-0.5">
                      Update your password to keep your account secure.
                    </p>
                  </div>

                  <div className="space-y-4 text-xs max-w-md">
                    <div>
                      <label className="font-extrabold text-slate-700 block mb-1">
                        Current Password
                      </label>
                      <input
                        type="password"
                        placeholder="••••••••"
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold focus:outline-none focus:border-emerald-600"
                      />
                    </div>
                    <div>
                      <label className="font-extrabold text-slate-700 block mb-1">
                        New Password
                      </label>
                      <input
                        type="password"
                        placeholder="••••••••"
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold focus:outline-none focus:border-emerald-600"
                      />
                    </div>
                    <div>
                      <label className="font-extrabold text-slate-700 block mb-1">
                        Confirm New Password
                      </label>
                      <input
                        type="password"
                        placeholder="••••••••"
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold focus:outline-none focus:border-emerald-600"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="bg-[#15803d] hover:bg-emerald-700 text-white font-extrabold text-xs px-6 py-3 rounded-xl uppercase tracking-wider transition cursor-pointer flex items-center gap-2 shadow-xs"
                  >
                    <Save className="w-4 h-4" />
                    <span>Update Password</span>
                  </button>
                </form>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
