"use client";

import { useAuthStore } from "@/store/auth-store";
import { Search, Bell, Warehouse } from "lucide-react";

export function AdminHeader() {
  const user = useAuthStore((state) => state.user);

  return (
    <header className="h-16 bg-slate-950/80 backdrop-blur-md border-b border-slate-800 px-8 flex items-center justify-between sticky top-0 z-30">
      {/* Search Input */}
      <div className="w-96 relative">
        <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
        <input
          type="text"
          placeholder="Search orders, SKU, products, or warehouses..."
          className="w-full pl-10 pr-4 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500/50 transition"
        />
      </div>

      {/* Admin Quick Profile & Warehouse Badge */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs">
          <Warehouse className="w-3.5 h-3.5 text-cyan-400" />
          <span className="text-slate-400 font-mono">DXB-MAIN</span>
        </div>

        <button className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white transition relative">
          <Bell className="w-4 h-4" />
          <span className="w-2 h-2 rounded-full bg-cyan-400 absolute top-2 right-2" />
        </button>

        <div className="flex items-center gap-3 pl-2 border-l border-slate-800">
          <div className="w-8 h-8 rounded-xl bg-cyan-950 border border-cyan-500/40 text-cyan-300 flex items-center justify-center font-bold text-xs">
            {user?.firstName?.[0] || "A"}
          </div>
          <div>
            <span className="text-xs font-bold text-white block leading-tight">
              {user
                ? `${user.firstName} ${user.lastName}`.trim()
                : "Mohammed Ansab"}
            </span>
            <span className="text-[10px] text-cyan-400 font-semibold block uppercase">
              {user?.role || "ADMIN"}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}
