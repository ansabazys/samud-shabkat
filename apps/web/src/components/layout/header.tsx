"use client";

import { useState, useSyncExternalStore } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Search,
  ShoppingCart,
  User,
  ChevronDown,
  Menu,
  X,
  Globe,
  Headphones,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { useCartStore } from "@/store/cart-store";
import { useAuthStore } from "@/store/auth-store";
import { useLanguageStore } from "@/store/language-store";
import { Logo } from "@/components/ui/logo";

const emptySubscribe = () => () => {};

export function Header() {
  const t = useTranslations("header");
  const tCommon = useTranslations("common");
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
  const setLanguage = useLanguageStore((state) => state.setLanguage);

  const handleToggleLanguage = () => {
    const nextLang = language === "en" ? "ar" : "en";
    setLanguage(nextLang);
    if (typeof window !== "undefined") {
      window.location.reload();
    }
  };

  const categories = [
    { name: t("categories.all"), value: "All Categories", href: "/products" },
    {
      name: t("categories.networking"),
      value: "Networking",
      href: "/products?category=networking",
    },
    {
      name: t("categories.computers"),
      value: "Computers",
      href: "/products?category=computers",
    },
    {
      name: t("categories.components"),
      value: "Components",
      href: "/products?category=components",
    },
    {
      name: t("categories.monitors"),
      value: "Monitors",
      href: "/products?category=monitors",
    },
    {
      name: t("categories.accessories"),
      value: "Accessories",
      href: "/products?category=accessories",
    },
    {
      name: t("categories.servers"),
      value: "Servers & NAS",
      href: "/products?category=servers-nas",
    },
    {
      name: t("categories.deals"),
      value: "Hot Deals",
      href: "/products?deals=true",
    },
  ];

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
      {/* Top Announcement Bar */}
      <div className="w-full bg-[#15803d] text-white text-[11px] font-medium">
        <div className="w-full max-w-7xl md:max-w-4/5 mx-auto px-4 md:px-0 py-1.5 flex items-center justify-between gap-2 sm:gap-4">
          {/* Shipping Promotion */}
          <div className="flex items-center gap-1.5 sm:gap-2 tracking-wide truncate">
            <span className="inline-flex items-center gap-1 bg-emerald-700/80 text-emerald-100 text-[10px] font-semibold px-2 py-0.5 rounded-full uppercase tracking-wider shrink-0">
              {t("freeShippingAnnouncement")}
            </span>
            <span className="text-emerald-50 hidden sm:inline">|</span>
            <span className="font-normal truncate">
              {t("onOrdersOverAnnouncement")}
            </span>
          </div>

          {/* Quick Utility Links */}
          <div className="flex items-center gap-3 sm:gap-4 shrink-0 text-emerald-100">
            {/* Language Switcher Button */}
            <button
              onClick={handleToggleLanguage}
              className="flex items-center gap-1.5 hover:text-white transition-colors cursor-pointer text-[11px] font-bold bg-emerald-700/50 hover:bg-emerald-700/80 px-2 py-0.5 rounded-md"
              title="Switch Language / تغيير اللغة"
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
              <span>{t("help")}</span>
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
              className="md:hidden p-1.5 -ms-1 text-slate-700 hover:text-slate-950 focus:outline-none cursor-pointer"
              aria-label={t("menuAria")}
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
              className="ps-3.5 pe-2 py-2 text-slate-400 group-focus-within:text-slate-900 hover:text-slate-900 transition-colors cursor-pointer"
              aria-label={t("searchAria")}
            >
              <Search className="w-4 h-4" />
            </button>

            {/* Search Input Field */}
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={tCommon("searchPlaceholder")}
              className="flex-1 py-2 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 bg-transparent focus:outline-none"
            />

            {/* Category Select Divider */}
            <div className="h-5 w-[1px] bg-slate-200 shrink-0 mx-1" />

            {/* Integrated Category Selector */}
            <div className="relative flex items-center pe-2 shrink-0">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="appearance-none bg-transparent py-1.5 ps-2 pe-6 text-xs font-semibold text-slate-700 hover:text-slate-900 focus:outline-none cursor-pointer border-none"
              >
                {categories.map((cat) => (
                  <option key={cat.value} value={cat.value}>
                    {cat.name}
                  </option>
                ))}
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute end-2 pointer-events-none" />
            </div>
          </form>

          {/* Action Icons (User, Cart) */}
          <div className="flex items-center gap-4 sm:gap-5 text-slate-700 shrink-0">
            {/* User / Account */}
            <Link
              href={accountUrl}
              className="p-1 hover:text-emerald-600 transition-colors"
              title={
                isAuthenticated
                  ? user?.firstName || t("myProfile")
                  : tCommon("signIn")
              }
            >
              <User className="w-5 h-5 sm:w-6 sm:h-6 stroke-[1.75]" />
            </Link>

            {/* Cart Button */}
            <button
              onClick={() => setDrawerOpen(true)}
              className="p-1 hover:text-emerald-600 transition-colors relative cursor-pointer group"
              aria-label={t("cartAria")}
            >
              <ShoppingCart className="w-5 h-5 sm:w-6 sm:h-6 stroke-[1.75]" />
              <span className="absolute -top-1.5 -end-1.5 bg-amber-400 text-slate-950 text-[10px] font-bold min-w-4 h-4 px-1 rounded-full flex items-center justify-center leading-none border border-white shadow-2xs">
                {mounted ? totalItems : 0}
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Search Bar Row */}
      <div className="md:hidden w-full bg-white border-t border-b border-slate-100 py-2.5">
        <div className="w-full max-w-7xl md:max-w-4/5 mx-auto px-4 md:px-0">
          <form
            onSubmit={handleSearch}
            className="flex items-center bg-slate-50 hover:bg-slate-100/70 focus-within:bg-white border border-slate-200 focus-within:border-slate-800 focus-within:ring-2 focus-within:ring-slate-900/5 rounded-xl transition-all overflow-hidden shadow-2xs group w-full"
          >
            <button
              type="submit"
              className="ps-3 pe-2 py-2 text-slate-400 group-focus-within:text-slate-900 hover:text-slate-900 transition-colors"
              aria-label={t("searchAria")}
            >
              <Search className="w-4 h-4" />
            </button>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={tCommon("searchPlaceholder")}
              className="flex-1 py-2 text-xs text-slate-900 placeholder:text-slate-400 bg-transparent focus:outline-none"
            />
            <div className="h-4 w-[1px] bg-slate-200 mx-1" />
            <div className="relative flex items-center pe-2 shrink-0">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="appearance-none bg-transparent py-1 ps-1 pe-5 text-[11px] font-semibold text-slate-700 hover:text-slate-900 focus:outline-none cursor-pointer border-none"
              >
                {categories.map((cat) => (
                  <option key={cat.value} value={cat.value}>
                    {cat.name}
                  </option>
                ))}
              </select>
              <ChevronDown className="w-3 h-3 text-slate-400 absolute end-1.5 pointer-events-none" />
            </div>
          </form>
        </div>
      </div>

      {/* Secondary Navigation Row (Desktop) */}
      <nav className="hidden md:flex bg-white w-full border-b border-slate-100 py-1.5">
        <div className="w-full max-w-7xl md:max-w-4/5 mx-auto px-4 md:px-0 flex items-center justify-center">
          <div className="flex items-center gap-2 sm:gap-6 text-xs sm:text-sm font-semibold text-slate-700 shrink-0">
            <Link
              href="/"
              className="px-2 py-1 hover:text-emerald-600 transition-colors whitespace-nowrap"
            >
              {tCommon("home")}
            </Link>
            <Link
              href="/products"
              className="px-2 py-1 hover:text-emerald-600 transition-colors whitespace-nowrap"
            >
              {tCommon("catalog")}
            </Link>
            <Link
              href="/new-arrivals"
              className="px-2 py-1 hover:text-emerald-600 transition-colors whitespace-nowrap flex items-center gap-1"
            >
              <span>{tCommon("newArrivals")}</span>
            </Link>
            <Link
              href="/contact"
              className="px-2 py-1 hover:text-emerald-600 transition-colors whitespace-nowrap font-bold text-emerald-700"
            >
              {tCommon("contact")}
            </Link>
            <Link
              href="/orders"
              className="px-2 py-1 hover:text-emerald-600 transition-colors whitespace-nowrap"
            >
              {tCommon("myOrders")}
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
              className="ps-3 pe-2 text-slate-400"
              aria-label={t("searchAria")}
            >
              <Search className="w-4 h-4" />
            </button>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={tCommon("searchPlaceholder")}
              className="flex-1 py-2 text-xs text-slate-900 bg-transparent focus:outline-none"
            />
            <div className="h-4 w-[1px] bg-slate-200 mx-1" />
            <div className="relative flex items-center pe-2">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="appearance-none bg-transparent py-1.5 ps-1.5 pe-6 text-[11px] font-semibold text-slate-700 focus:outline-none cursor-pointer"
              >
                {categories.map((cat) => (
                  <option key={cat.value} value={cat.value}>
                    {cat.name}
                  </option>
                ))}
              </select>
              <ChevronDown className="w-3 h-3 text-slate-400 absolute end-2 pointer-events-none" />
            </div>
          </form>

          {/* Language Switcher inside Mobile Drawer */}
          <div className="flex items-center justify-between p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800">
            <span className="flex items-center gap-2">
              <Globe className="w-4 h-4 text-emerald-700" />
              <span>{language === "en" ? "Language" : "اللغة"}</span>
            </span>
            <button
              onClick={() => {
                handleToggleLanguage();
                setMobileMenuOpen(false);
              }}
              className="bg-white border border-slate-200 hover:border-emerald-600 text-slate-900 px-3 py-1 rounded-lg text-xs font-extrabold transition cursor-pointer"
            >
              {language === "en" ? "العربية" : "English"}
            </button>
          </div>

          {/* Nav Links inside Mobile Drawer */}
          <div className="flex flex-col space-y-2 text-sm font-semibold text-slate-800">
            <Link
              href="/"
              onClick={() => setMobileMenuOpen(false)}
              className="p-2 hover:bg-slate-50 rounded-lg"
            >
              {tCommon("home")}
            </Link>
            <Link
              href="/products"
              onClick={() => setMobileMenuOpen(false)}
              className="p-2 hover:bg-slate-50 rounded-lg"
            >
              {tCommon("catalog")}
            </Link>
            <Link
              href="/new-arrivals"
              onClick={() => setMobileMenuOpen(false)}
              className="p-2 hover:bg-slate-50 rounded-lg"
            >
              {tCommon("newArrivals")}
            </Link>
            <Link
              href="/contact"
              onClick={() => setMobileMenuOpen(false)}
              className="p-2 hover:bg-slate-50 rounded-lg font-bold text-emerald-700"
            >
              {tCommon("contact")}
            </Link>
            <Link
              href="/orders"
              onClick={() => setMobileMenuOpen(false)}
              className="p-2 hover:bg-slate-50 rounded-lg"
            >
              {tCommon("myOrders")}
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
                {isAuthenticated
                  ? user?.firstName || t("myProfile")
                  : tCommon("signIn")}
              </span>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
