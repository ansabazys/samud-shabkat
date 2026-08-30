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
  Users,
  Settings,
  LogOut,
  ExternalLink,
  ShieldCheck,
} from "lucide-react";
import { useAuthStore } from "@/store/auth-store";
import { Logo } from "@/components/ui/logo";

const navItems = [
  { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { name: "Order Management", href: "/admin/orders", icon: ShoppingBag },
  { name: "Product Catalog", href: "/admin/products", icon: Package },
  { name: "Categories", href: "/admin/categories", icon: Layers },
  { name: "Brands", href: "/admin/brands", icon: Tag },
  { name: "Stock & Inventory", href: "/admin/inventory", icon: Boxes },
  { name: "Customers & Staff", href: "/admin/users", icon: Users },
  { name: "Store Settings", href: "/admin/settings", icon: Settings },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const logout = useAuthStore((state) => state.logout);

  return (
    <aside className="w-64 bg-white border-r border-slate-200/80 text-slate-800 flex flex-col justify-between shrink-0 min-h-screen shadow-2xs">
      <div>
        {/* Brand Header */}
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <Link href="/admin" className="flex flex-col gap-1 group">
            <Logo href="/admin" size="sm" />
            <span className="text-[10px] font-extrabold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 uppercase tracking-wider block mt-1 w-fit">
              Backoffice Admin
            </span>
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
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold transition ${
                  isActive
                    ? "bg-emerald-50 text-emerald-800 border border-emerald-200/80 shadow-2xs"
                    : "text-slate-600 hover:text-slate-950 hover:bg-slate-50"
                }`}
              >
                <Icon
                  className={`w-4 h-4 ${isActive ? "text-emerald-700" : "text-slate-400"}`}
                />
                {item.name}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Footer Actions */}
      <div className="p-4 border-t border-slate-100 space-y-2">
        <Link
          href="/"
          target="_blank"
          className="flex items-center justify-between px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 hover:bg-slate-100 text-xs text-slate-700 font-bold transition"
        >
          <span className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            View Storefront
          </span>
          <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
        </Link>

        <button
          onClick={() => {
            logout();
            window.location.href = "/admin/login";
          }}
          className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-extrabold text-rose-600 hover:bg-rose-50 border border-transparent hover:border-rose-200 transition cursor-pointer"
        >
          <LogOut className="w-4 h-4 text-rose-500" />
          Sign Out Admin
        </button>
      </div>
    </aside>
  );
}
