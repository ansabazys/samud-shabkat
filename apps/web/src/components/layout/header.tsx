"use client";

import { useState, useSyncExternalStore } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Search,
  ShoppingBag,
  Menu,
  X,
  ShieldCheck,
  Box,
  Tag,
  Phone,
  User,
  LayoutDashboard,
  LogOut,
} from "lucide-react";
import { useCartStore } from "@/store/cart-store";
import { useAuthStore } from "@/store/auth-store";

const emptySubscribe = () => () => {};

export function Header() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const mounted = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false,
  );

  const router = useRouter();
  const totalItems = useCartStore((state) => state.getTotalItems());
  const setDrawerOpen = useCartStore((state) => state.setDrawerOpen);

  const { isAuthenticated, isAdmin, logout } = useAuthStore();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full glass-nav transition-all">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-cyan-900/60 via-sky-900/60 to-indigo-900/60 text-xs text-sky-200 border-b border-sky-800/30 py-1.5 px-4 text-center flex items-center justify-between max-w-7xl mx-auto">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" /> Authorized B2B
            & Wholesale Distributor
          </span>
          <span className="hidden sm:inline-block text-sky-400/50">•</span>
          <span className="hidden sm:inline-block">
            Express Delivery Across UAE & GCC
          </span>
        </div>
        <div className="flex items-center gap-3">
          <a
            href="tel:+97141234567"
            className="flex items-center gap-1 hover:text-white transition"
          >
            <Phone className="w-3.5 h-3.5 text-cyan-400" /> +971 4 123 4567
          </a>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 gap-4">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 via-sky-500 to-indigo-500 flex items-center justify-center shadow-lg shadow-cyan-500/20 group-hover:scale-105 transition">
              <Box className="w-6 h-6 text-white" />
            </div>
            <div>
              <span className="text-xl font-bold tracking-tight text-white group-hover:text-cyan-400 transition">
                Samud<span className="text-cyan-400">Shabkat</span>
              </span>
              <span className="block text-[10px] uppercase tracking-widest text-slate-400 font-semibold">
                Network & Hardware
              </span>
            </div>
          </Link>

          {/* Search Bar */}
          <form
            onSubmit={handleSearch}
            className="hidden md:flex flex-1 max-w-md relative"
          >
            <input
              type="text"
              placeholder="Search products, SKUs, categories..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-800/80 border border-slate-700/80 rounded-xl pl-4 pr-10 py-2.5 text-sm text-white placeholder-slate-400 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition"
            />
            <button
              type="submit"
              className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 text-slate-400 hover:text-cyan-400 transition"
            >
              <Search className="w-4 h-4" />
            </button>
          </form>

          {/* Nav Links & Actions */}
          <div className="flex items-center gap-4">
            <nav className="hidden lg:flex items-center gap-6 text-sm font-medium text-slate-300">
              <Link
                href="/products"
                className="hover:text-cyan-400 transition flex items-center gap-1.5"
              >
                <Box className="w-4 h-4 text-cyan-400" /> Catalog
              </Link>
              <Link
                href="/categories"
                className="hover:text-cyan-400 transition flex items-center gap-1.5"
              >
                <Tag className="w-4 h-4 text-cyan-400" /> Categories
              </Link>
              <Link
                href="/account/orders"
                className="hover:text-cyan-400 transition"
              >
                My Orders
              </Link>
            </nav>

            {/* Auth / Admin Backoffice Link */}
            {mounted && isAuthenticated ? (
              <div className="flex items-center gap-3">
                {isAdmin && (
                  <Link
                    href="/admin"
                    className="px-3.5 py-2 rounded-xl bg-cyan-600/20 hover:bg-cyan-500 text-cyan-300 hover:text-white border border-cyan-500/30 font-semibold text-xs transition flex items-center gap-1.5"
                  >
                    <LayoutDashboard className="w-3.5 h-3.5" /> Backoffice
                  </Link>
                )}
                <button
                  onClick={logout}
                  className="p-2 text-slate-400 hover:text-rose-400 transition"
                  title="Sign Out"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <Link
                href="/login"
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white font-semibold text-xs transition flex items-center gap-1.5"
              >
                <User className="w-3.5 h-3.5 text-cyan-400" /> Sign In
              </Link>
            )}

            {/* Cart Button */}
            <button
              onClick={() => setDrawerOpen(true)}
              className="relative p-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700/80 text-white transition flex items-center gap-2 group"
              aria-label="Shopping Cart"
            >
              <ShoppingBag className="w-5 h-5 text-cyan-400 group-hover:scale-110 transition" />
              <span className="hidden sm:inline text-xs font-semibold">
                Cart
              </span>
              {mounted && totalItems > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-gradient-to-r from-cyan-500 to-blue-500 text-white text-[11px] font-bold w-5 h-5 rounded-full flex items-center justify-center shadow-md animate-bounce">
                  {totalItems}
                </span>
              )}
            </button>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 text-slate-300 hover:text-white"
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      {isMobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-800 bg-slate-900/95 backdrop-blur-xl px-4 pt-4 pb-6 space-y-4">
          <form onSubmit={handleSearch} className="relative">
            <input
              type="text"
              placeholder="Search catalog..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg pl-4 pr-10 py-2 text-sm text-white placeholder-slate-400"
            />
            <button
              type="submit"
              className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-slate-400"
            >
              <Search className="w-4 h-4" />
            </button>
          </form>
          <nav className="flex flex-col space-y-3 font-medium text-slate-300 text-sm">
            <Link
              href="/products"
              onClick={() => setIsMobileMenuOpen(false)}
              className="hover:text-cyan-400 py-1"
            >
              All Products
            </Link>
            <Link
              href="/categories"
              onClick={() => setIsMobileMenuOpen(false)}
              className="hover:text-cyan-400 py-1"
            >
              Categories
            </Link>
            <Link
              href="/account/orders"
              onClick={() => setIsMobileMenuOpen(false)}
              className="hover:text-cyan-400 py-1"
            >
              My Orders & History
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
