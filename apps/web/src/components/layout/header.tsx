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
import { useLanguageStore } from "@/store/language-store";
import { Logo } from "@/components/ui/logo";

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

  const user = useAuthStore((state) => state.user);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  const language = useLanguageStore((state) => state.language);
  const toggleLanguage = useLanguageStore((state) => state.toggleLanguage);
  const t = useLanguageStore((state) => state.t);

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

  const accountUrl = isAuthenticated ? "/profile" : "/login";

  return (
    <header className="w-full bg-white sticky top-0 z-40">
      {/* Top Announcement Bar - Clean & Compact */}
      <div className="w-full bg-[#15803d] text-white text-[11px] font-medium">
        <div className="w-full max-w-7xl md:max-w-4/5 mx-auto px-4 md:px-0 py-1.5 flex items-center justify-between gap-2 sm:gap-4">
          {/* Shipping Promotion */}
          <div className="flex items-center gap-1.5 sm:gap-2 tracking-wide truncate">
            <span className="inline-flex items-center gap-1 bg-emerald-700/80 text-emerald-100 text-[10px] font-semibold px-2 py-0.5 rounded-full uppercase tracking-wider shrink-0">
              {t.freeShipping}
            </span>
            <span className="text-emerald-50 hidden sm:inline">|</span>
            <span className="font-normal truncate">{t.onOrdersOver}</span>
          </div>

          {/* Quick Utility Links (Right Side) */}
          <div className="flex items-center gap-3 sm:gap-4 shrink-0 text-emerald-100">
            {/* Language Switcher */}
            <button
              onClick={toggleLanguage}
              className="flex items-center gap-1 hover:text-white transition-colors cursor-pointer text-[10.5px] font-semibold"
              title="Switch Language"
            >
              <Globe className="w-3.5 h-3.5" />
              <span>{language === "en" ? "العربية" : "English"}</span>
            </button>

            <span className="text-emerald-700/60 hidden sm:inline">•</span>

            {/* Help / Support Link */}
            <Link
              href="/contact"
              className="hidden sm:flex items-center gap-1 hover:text-white transition-colors text-[10.5px]"
            >
              <Headphones className="w-3 h-3" />
              <span>{t.help}</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Main Header Container */}
      <div className="w-full border-b border-slate-100 py-3.5">
        <div className="w-full max-w-7xl md:max-w-4/5 mx-auto px-4 md:px-0 flex items-center justify-between gap-4 sm:gap-8">
          {/* Mobile Menu Trigger & Logo Container */}
          <div className="flex items-center gap-3 sm:gap-4">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-1.5 -ml-1 text-slate-700 hover:text-slate-950 focus:outline-none"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>

            {/* Brand Logo */}
            <Logo href="/" size="md" />
          </div>

          {/* Desktop Search Bar (Hidden on Mobile) */}
          <form
            onSubmit={handleSearch}
            className="hidden md:flex flex-1 max-w-2xl items-center bg-slate-50 hover:bg-slate-100/80 focus-within:bg-white border border-slate-200 focus-within:border-slate-800 focus-within:ring-2 focus-within:ring-slate-900/5 rounded-2xl transition-all overflow-hidden shadow-2xs group"
          >
            {/* Search Icon & Button */}
            <button
              type="submit"
              className="pl-3.5 pr-2 py-2 text-slate-400 group-focus-within:text-slate-900 hover:text-slate-900 transition-colors cursor-pointer"
              aria-label="Search"
            >
              <Search className="w-4 h-4" />
            </button>

            {/* Search Input Field */}
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t.searchPlaceholder}
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

          {/* Action Icons (User, Cart) */}
          <div className="flex items-center gap-4 sm:gap-5 text-slate-700 shrink-0">
            {/* User / Account */}
            <Link
              href={accountUrl}
              className="p-1 hover:text-emerald-600 transition-colors"
              title={isAuthenticated ? user?.firstName || "My Profile" : "Sign In"}
            >
              <User className="w-5 h-5 sm:w-6 sm:h-6 stroke-[1.75]" />
            </Link>

            {/* Cart Button */}
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

      {/* Mobile Search Bar Row - Mobile Only (Hidden on Desktop) */}
      <div className="md:hidden w-full bg-white border-t border-b border-slate-100 py-2.5">
        <div className="w-full max-w-7xl md:max-w-4/5 mx-auto px-4 md:px-0">
          <form
            onSubmit={handleSearch}
            className="flex items-center bg-slate-50 hover:bg-slate-100/70 focus-within:bg-white border border-slate-200 focus-within:border-slate-800 focus-within:ring-2 focus-within:ring-slate-900/5 rounded-xl transition-all overflow-hidden shadow-2xs group w-full"
          >
            <button
              type="submit"
              className="pl-3 pr-2 py-2 text-slate-400 group-focus-within:text-slate-900 hover:text-slate-900 transition-colors"
              aria-label="Search"
            >
              <Search className="w-4 h-4" />
            </button>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t.searchPlaceholder}
              className="flex-1 py-2 text-xs text-slate-900 placeholder:text-slate-400 bg-transparent focus:outline-none"
            />
            <div className="h-4 w-[1px] bg-slate-200 mx-1" />
            <div className="relative flex items-center pr-2 shrink-0">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="appearance-none bg-transparent py-1 pl-1 pr-5 text-[11px] font-semibold text-slate-700 hover:text-slate-900 focus:outline-none cursor-pointer border-none"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat.value} value={cat.value}>
                    {cat.name}
                  </option>
                ))}
              </select>
              <ChevronDown className="w-3 h-3 text-slate-400 absolute right-1.5 pointer-events-none" />
            </div>
          </form>
        </div>
      </div>

      {/* Secondary Navigation Row - Desktop Only (Hidden on Mobile) */}
      <nav className="hidden md:flex bg-white w-full border-b border-slate-100 py-1.5">
        <div className="w-full max-w-7xl md:max-w-4/5 mx-auto px-4 md:px-0 flex items-center justify-center">
          <div className="flex items-center gap-2 sm:gap-6 text-xs sm:text-sm font-semibold text-slate-700 shrink-0">
            <Link
              href="/"
              className="px-2 py-1 hover:text-emerald-600 transition-colors whitespace-nowrap"
            >
              {t.home}
            </Link>
            <Link
              href="/products"
              className="px-2 py-1 hover:text-emerald-600 transition-colors whitespace-nowrap"
            >
              {t.catalog}
            </Link>
            <Link
              href="/new-arrivals"
              className="px-2 py-1 hover:text-emerald-600 transition-colors whitespace-nowrap flex items-center gap-1"
            >
              <span>{t.newArrivals}</span>
            </Link>
            <Link
              href="/contact"
              className="px-2 py-1 hover:text-emerald-600 transition-colors whitespace-nowrap font-bold text-emerald-700"
            >
              {language === "ar" ? "اتصل بنا" : "Contact Us"}
            </Link>
            <Link
              href="/orders"
              className="px-2 py-1 hover:text-emerald-600 transition-colors whitespace-nowrap"
            >
              {t.myOrders}
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

          {/* Nav Links inside Mobile Drawer */}
          <div className="flex flex-col space-y-2 text-sm font-semibold text-slate-800">
            <Link
              href="/"
              onClick={() => setMobileMenuOpen(false)}
              className="p-2 hover:bg-slate-50 rounded-lg"
            >
              {t.home}
            </Link>
            <Link
              href="/products"
              onClick={() => setMobileMenuOpen(false)}
              className="p-2 hover:bg-slate-50 rounded-lg"
            >
              {t.catalog}
            </Link>
            <Link
              href="/new-arrivals"
              onClick={() => setMobileMenuOpen(false)}
              className="p-2 hover:bg-slate-50 rounded-lg"
            >
              {t.newArrivals}
            </Link>
            <Link
              href="/contact"
              onClick={() => setMobileMenuOpen(false)}
              className="p-2 hover:bg-slate-50 rounded-lg font-bold text-emerald-700"
            >
              Contact Us
            </Link>
            <Link
              href="/orders"
              onClick={() => setMobileMenuOpen(false)}
              className="p-2 hover:bg-slate-50 rounded-lg"
            >
              My Orders
            </Link>
          </div>

          <div className="border-t border-slate-100 pt-3 flex items-center justify-end text-xs font-medium text-slate-700">
            <Link
              href={accountUrl}
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-2 p-2 hover:bg-slate-50 rounded-lg"
            >
              <User className="w-4 h-4 text-slate-600" />
              <span>
                {isAuthenticated ? user?.firstName || "My Profile" : "Sign In"}
              </span>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
