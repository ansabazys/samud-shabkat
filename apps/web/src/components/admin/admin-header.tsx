"use client";

import { useAuthStore } from "@/store/auth-store";
import { Search, Bell, ShieldCheck } from "lucide-react";

export function AdminHeader() {
  const user = useAuthStore((state) => state.user);

  return (
    <header className="h-16 bg-white/90 backdrop-blur-md border-b border-slate-200/80 px-6 md:px-8 flex items-center justify-between sticky top-0 z-30 shadow-2xs">
      {/* Search Input */}
      <div className="w-80 md:w-96 relative">
        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
        <input
          type="text"
          placeholder="Search orders, SKU, or products..."
          className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-emerald-600 focus:bg-white font-medium transition"
        />
      </div>

      {/* Admin Quick Profile */}
      <div className="flex items-center gap-4">
        <button className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-600 hover:text-slate-950 transition relative cursor-pointer">
          <Bell className="w-4 h-4" />
          <span className="w-2 h-2 rounded-full bg-emerald-600 absolute top-2 right-2" />
        </button>

        <div className="flex items-center gap-3 pl-3 border-l border-slate-200">
          <div className="w-8 h-8 rounded-xl bg-emerald-100 border border-emerald-300 text-emerald-800 flex items-center justify-center font-black text-xs">
            {user?.firstName?.[0] || "A"}
          </div>
          <div>
            <span className="text-xs font-black text-slate-950 block leading-tight">
              {user
                ? `${user.firstName} ${user.lastName}`.trim()
                : "Mohammed Ansab"}
            </span>
            <span className="text-[10px] text-emerald-700 font-extrabold block uppercase tracking-wider">
              {user?.role || "ADMIN"}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}
