"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  ShoppingBag,
  Boxes,
  Package,
  Layers,
  Tag,
  Settings,
  LogOut,
  Box,
  ExternalLink,
} from "lucide-react";
import { useAuthStore } from "@/store/auth-store";

const navItems = [
  { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { name: "Orders", href: "/admin/orders", icon: ShoppingBag },
  { name: "Stock & Inventory", href: "/admin/inventory", icon: Boxes },
  { name: "Products", href: "/admin/products", icon: Package },
  { name: "Categories", href: "/admin/categories", icon: Layers },
  { name: "Brands", href: "/admin/brands", icon: Tag },
  { name: "Settings", href: "/admin/settings", icon: Settings },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const logout = useAuthStore((state) => state.logout);

  return (
    <aside className="w-64 bg-slate-950 border-r border-slate-800 text-slate-300 flex flex-col justify-between shrink-0 min-h-screen">
      <div>
        {/* Brand Header */}
        <div className="p-6 border-b border-slate-800 flex items-center justify-between">
          <Link href="/admin" className="flex items-center gap-3 group">
            <div className="p-2 rounded-xl bg-cyan-950/80 border border-cyan-500/30 text-cyan-400 group-hover:border-cyan-400 transition">
              <Box className="w-5 h-5 text-cyan-400" />
            </div>
            <div>
              <h1 className="text-sm font-extrabold text-white tracking-wider">
                SAMUD ADMIN
              </h1>
              <span className="text-[10px] text-cyan-400 font-mono block">
                Backoffice Operations
              </span>
            </div>
          </Link>
        </div>

        {/* Navigation Links */}
        <nav className="p-4 space-y-1">
          {navItems.map((item) => {
            const isActive =
              pathname === item.href ||
              (item.href !== "/admin" && pathname.startsWith(item.href));
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-semibold transition ${
                  isActive
                    ? "bg-cyan-600/20 text-cyan-300 border border-cyan-500/30 shadow-md shadow-cyan-950/50"
                    : "text-slate-400 hover:text-white hover:bg-slate-900"
                }`}
              >
                <Icon
                  className={`w-4 h-4 ${isActive ? "text-cyan-400" : "text-slate-500"}`}
                />
                {item.name}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Footer Actions */}
      <div className="p-4 border-t border-slate-800 space-y-2">
        <Link
          href="/"
          target="_blank"
          className="flex items-center justify-between px-4 py-2.5 rounded-xl bg-slate-900/60 border border-slate-800 hover:border-slate-700 text-xs text-slate-300 font-medium transition"
        >
          <span className="flex items-center gap-2">Storefront</span>
          <ExternalLink className="w-3.5 h-3.5 text-slate-500" />
        </Link>

        <button
          onClick={logout}
          className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-semibold text-rose-400 hover:bg-rose-950/40 hover:text-rose-300 border border-transparent hover:border-rose-500/20 transition"
        >
          <LogOut className="w-4 h-4 text-rose-400" />
          Sign Out
        </button>
      </div>
    </aside>
  );
}
