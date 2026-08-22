"use client";

import { useState, useSyncExternalStore } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Search,
  ShoppingCart,
  Heart,
  User,
  ChevronDown,
  Menu,
  X,
  Globe,
  Headphones,
} from "lucide-react";
import { useCartStore } from "@/store/cart-store";
import { useAuthStore } from "@/store/auth-store";

const emptySubscribe = () => () => {};

const CATEGORIES = [
  { name: "All Categories", value: "All Categories", href: "/products" },
  {
    name: "Networking",
    value: "Networking",
    href: "/products?category=networking",
  },
  {
    name: "Computers",
    value: "Computers",
    href: "/products?category=computers",
  },
  {
    name: "Components",
    value: "Components",
    href: "/products?category=components",
  },
  { name: "Monitors", value: "Monitors", href: "/products?category=monitors" },
  {
    name: "Accessories",
    value: "Accessories",
    href: "/products?category=accessories",
  },
  {
    name: "Servers & NAS",
    value: "Servers & NAS",
    href: "/products?category=servers-nas",
  },
  { name: "Hot Deals", value: "Hot Deals", href: "/products?deals=true" },
];

export function Header() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const router = useRouter();

  const mounted = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false,
  );

  const totalItems = useCartStore((state) => state.getTotalItems());
  const setDrawerOpen = useCartStore((state) => state.setDrawerOpen);
  const { isAuthenticated, user } = useAuthStore();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      const categoryParam =
        selectedCategory !== "All Categories" &&
        selectedCategory !== "Hot Deals"
          ? `&category=${encodeURIComponent(selectedCategory.toLowerCase().replace(" & ", "-"))}`
          : selectedCategory === "Hot Deals"
            ? "&deals=true"
            : "";
      router.push(
        `/products?search=${encodeURIComponent(searchQuery.trim())}${categoryParam}`,
      );
    }
  };

  return (
    <header className="w-full bg-white sticky top-0 z-40">
      {/* Top Announcement Bar - Clean & Compact */}
      <div className="bg-[#15803d] text-white flex items-center justify-center text-[11px] font-medium py-1.5 px-3 sm:px-6 lg:px-8">
        <div className="w-full max-w-7xl mx-auto flex items-center justify-between gap-2 sm:gap-4">
          {/* Shipping Promotion */}
          <div className="flex items-center gap-1.5 sm:gap-2 tracking-wide truncate">
            <span className="inline-flex items-center gap-1 bg-emerald-700/80 text-emerald-100 text-[10px] font-semibold px-2 py-0.5 rounded-full uppercase tracking-wider shrink-0">
              Free Shipping
            </span>
            <span className="hidden xs:inline truncate">On orders over</span>
            <span className="xs:hidden">Over</span>
            <strong className="text-white font-semibold shrink-0">
              499 SAR
            </strong>
            <span className="hidden md:inline text-emerald-200/80 truncate">
              • Express Delivery Across KSA
            </span>
          </div>

          {/* Quick Actions & Region */}
          <div className="flex items-center gap-2.5 sm:gap-3 text-emerald-100/90 text-xs font-sans shrink-0">
            <div className="flex items-center gap-1 font-medium cursor-pointer hover:text-white transition">
              <span className="text-sm">🇸🇦</span>
              <span className="font-semibold text-white">SAR</span>
            </div>
            <span className="text-emerald-700/80">|</span>
            <div className="flex items-center gap-1 cursor-pointer hover:text-white transition">
              <Globe className="w-3 h-3 text-emerald-200" />
              <span>EN</span>
            </div>
            <span className="hidden sm:inline text-emerald-700/80">|</span>
            <Link
              href="/support"
              className="hidden sm:flex items-center gap-1 hover:text-white transition"
            >
              <Headphones className="w-3 h-3 text-emerald-200" />
              <span>Help</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Main Clean Header - Full Width (No Bottom Border under samud.shabkat) */}
      <div className="w-full px-3 flex justify-center items-center relative sm:px-6 lg:px-8 py-2.5 sm:py-3">
        <div className="flex w-full max-w-7xl mx-auto items-center justify-between gap-2 sm:gap-4 md:gap-8">
          {/* Mobile Menu Toggle & Logo */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="py-1.5 text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded-lg md:hidden transition-colors"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </button>

            <Link href="/" className="flex items-center gap-2 group">
              <span className="text-lg sm:text-xl md:text-2xl font-bold tracking-tight text-slate-900 font-sans">
                samud<span className="text-emerald-600">.</span>shabkat
              </span>
            </Link>
          </div>

          {/* Desktop Search Bar */}
          <form
            onSubmit={handleSearch}
            className="hidden md:flex flex-1 max-w-2xl items-center bg-slate-50 hover:bg-slate-100/70 focus-within:bg-white border border-slate-200 focus-within:border-slate-800 focus-within:ring-2 focus-within:ring-slate-900/5 rounded-xl transition-all overflow-hidden shadow-2xs group"
          >
            {/* Search Icon & Button */}
            <button
              type="submit"
              className="pl-3.5 pr-2 py-2 text-slate-400 group-focus-within:text-slate-900 hover:text-slate-900 transition-colors"
              aria-label="Search"
            >
              <Search className="w-4 h-4" />
            </button>

            {/* Search Input Field */}
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search networking, computers, components, SKUs..."
              className="flex-1 py-2 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 bg-transparent focus:outline-none"
            />

            {/* Category Select Divider */}
            <div className="h-5 w-[1px] bg-slate-200 shrink-0 mx-1" />

            {/* Integrated Category Selector */}
            <div className="relative flex items-center pr-2 shrink-0">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="appearance-none bg-transparent py-1.5 pl-2 pr-6 text-xs font-semibold text-slate-700 hover:text-slate-900 focus:outline-none cursor-pointer border-none"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat.value} value={cat.value}>
                    {cat.name}
                  </option>
                ))}
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2 pointer-events-none" />
            </div>
          </form>

          {/* Action Icons (User, Wishlist, Cart) */}
          <div className="flex items-center gap-4 sm:gap-5 text-slate-700 shrink-0">
            {/* User / Account */}
            <Link
              href={isAuthenticated ? "/account" : "/login"}
              className="p-1 hover:text-emerald-600 transition-colors"
              title={isAuthenticated ? user?.firstName || "Account" : "Sign In"}
            >
              <User className="w-5 h-5 sm:w-6 sm:h-6 stroke-[1.75]" />
            </Link>

            {/* Wishlist */}
            <Link
              href="/account/wishlist"
              className="p-1 hover:text-emerald-600 transition-colors relative"
              title="Wishlist"
            >
              <Heart className="w-5 h-5 sm:w-6 sm:h-6 stroke-[1.75]" />
              <span className="absolute -top-1.5 -right-1.5 bg-amber-400 text-slate-950 text-[10px] font-bold min-w-4 h-4 px-1 rounded-full flex items-center justify-center leading-none border border-white shadow-2xs">
                0
              </span>
            </Link>

            {/* Cart Icon */}
            <button
              onClick={() => setDrawerOpen(true)}
              className="p-1 hover:text-emerald-600 transition-colors relative cursor-pointer group"
              aria-label="Shopping Cart"
            >
              <ShoppingCart className="w-5 h-5 sm:w-6 sm:h-6 stroke-[1.75]" />
              <span className="absolute -top-1.5 -right-1.5 bg-amber-400 text-slate-950 text-[10px] font-bold min-w-4 h-4 px-1 rounded-full flex items-center justify-center leading-none border border-white shadow-2xs">
                {mounted ? totalItems : 0}
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Secondary Navigation Row - Desktop Only (Hidden on Mobile) */}
      <nav className="hidden md:flex bg-white w-full border-b border-slate-100 py-1.5 px-3 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex items-center justify-center">
          <div className="flex items-center gap-2 sm:gap-6 text-xs sm:text-sm font-semibold text-slate-700 shrink-0">
            <Link
              href="/"
              className="px-2 py-1 hover:text-emerald-600 transition-colors whitespace-nowrap"
            >
              Home
            </Link>
            <Link
              href="/products"
              className="px-2 py-1 hover:text-emerald-600 transition-colors whitespace-nowrap"
            >
              Products
            </Link>
            <Link
              href="/new-arrivals"
              className="px-2 py-1 hover:text-emerald-600 transition-colors whitespace-nowrap flex items-center gap-1"
            >
              <span>New Arrivals</span>
            </Link>
            <Link
              href="/about"
              className="px-2 py-1 hover:text-emerald-600 transition-colors whitespace-nowrap"
            >
              About Us
            </Link>
            <Link
              href="/brands"
              className="px-2 py-1 hover:text-emerald-600 transition-colors whitespace-nowrap"
            >
              Partners
            </Link>
            <Link
              href="/account/orders"
              className="px-2 py-1 hover:text-emerald-600 transition-colors whitespace-nowrap"
            >
              My Orders
            </Link>
          </div>
        </div>
      </nav>

      {/* Mobile Navigation Slide-out Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 py-4 space-y-4 shadow-lg animate-in slide-in-from-top duration-200">
          {/* Mobile Search Bar inside Drawer */}
          <form
            onSubmit={(e) => {
              handleSearch(e);
              setMobileMenuOpen(false);
            }}
            className="flex items-center bg-slate-50 border border-slate-200 rounded-xl overflow-hidden focus-within:border-slate-800 focus-within:ring-2 focus-within:ring-slate-900/5 transition-all shadow-2xs"
          >
            <button
              type="submit"
              className="pl-3 pr-2 text-slate-400"
              aria-label="Search"
            >
              <Search className="w-4 h-4" />
            </button>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search products..."
              className="flex-1 py-2 text-xs text-slate-900 bg-transparent focus:outline-none"
            />
            <div className="h-4 w-[1px] bg-slate-200 mx-1" />
            <div className="relative flex items-center pr-2">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="appearance-none bg-transparent py-1.5 pl-1.5 pr-6 text-[11px] font-semibold text-slate-700 focus:outline-none cursor-pointer"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat.value} value={cat.value}>
                    {cat.name}
                  </option>
                ))}
              </select>
              <ChevronDown className="w-3 h-3 text-slate-400 absolute right-2 pointer-events-none" />
            </div>
          </form>

          <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Navigation
          </div>
          <div className="flex flex-col space-y-1 text-sm font-semibold text-slate-800">
            <Link
              href="/"
              onClick={() => setMobileMenuOpen(false)}
              className="p-2 hover:bg-slate-50 rounded-lg"
            >
              Home
            </Link>
            <Link
              href="/products"
              onClick={() => setMobileMenuOpen(false)}
              className="p-2 hover:bg-slate-50 rounded-lg"
            >
              Products
            </Link>
            <Link
              href="/new-arrivals"
              onClick={() => setMobileMenuOpen(false)}
              className="p-2 hover:bg-slate-50 rounded-lg flex items-center justify-between"
            >
              <span>New Arrivals</span>
              <span className="bg-amber-400 text-slate-950 text-[9px] font-black px-1.5 py-[1px] rounded uppercase">
                NEW
              </span>
            </Link>
            <Link
              href="/about"
              onClick={() => setMobileMenuOpen(false)}
              className="p-2 hover:bg-slate-50 rounded-lg"
            >
              About Us
            </Link>
            <Link
              href="/brands"
              onClick={() => setMobileMenuOpen(false)}
              className="p-2 hover:bg-slate-50 rounded-lg"
            >
              Partners
            </Link>
            <Link
              href="/account/orders"
              onClick={() => setMobileMenuOpen(false)}
              className="p-2 hover:bg-slate-50 rounded-lg"
            >
              My Orders
            </Link>
          </div>

          <div className="border-t border-slate-100 pt-3 flex items-center justify-between text-xs font-medium text-slate-700">
            <Link
              href="/account/wishlist"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-2 p-2 hover:bg-slate-50 rounded-lg"
            >
              <Heart className="w-4 h-4 text-red-500" />
              <span>Wishlist</span>
            </Link>
            <Link
              href={isAuthenticated ? "/account" : "/login"}
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-2 p-2 hover:bg-slate-50 rounded-lg"
            >
              <User className="w-4 h-4 text-slate-600" />
              <span>
                {isAuthenticated ? user?.firstName || "Account" : "Sign In"}
              </span>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
