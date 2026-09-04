"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { CartDrawer } from "@/components/cart/cart-drawer";
import { useLanguageStore } from "@/store/language-store";

interface AppShellProps {
  children: React.ReactNode;
  dir?: "ltr" | "rtl";
  locale?: string;
}

export function AppShell({ children, dir, locale }: AppShellProps) {
  const pathname = usePathname();
  const storeDirection = useLanguageStore((state) => state.direction);
  const storeLanguage = useLanguageStore((state) => state.language);
  const setLanguage = useLanguageStore((state) => state.setLanguage);

  const isAdminRoute = pathname?.startsWith("/admin");

  useEffect(() => {
    if (
      locale &&
      (locale === "en" || locale === "ar") &&
      locale !== storeLanguage
    ) {
      setLanguage(locale);
    }
  }, [locale, storeLanguage, setLanguage]);

  useEffect(() => {
    const activeDir = dir || storeDirection;
    const activeLang = locale || storeLanguage;
    if (typeof document !== "undefined") {
      document.documentElement.dir = activeDir;
      document.documentElement.lang = activeLang;
    }
  }, [dir, locale, storeDirection, storeLanguage]);

  if (isAdminRoute) {
    return (
      <div className="min-h-full flex flex-col bg-slate-50 text-slate-900 selection:bg-emerald-600 selection:text-white font-sans">
        {children}
      </div>
    );
  }

  return (
    <div className="min-h-full flex flex-col bg-white text-slate-900 selection:bg-emerald-600 selection:text-white">
      <Header />
      <main className="flex-1 w-full">{children}</main>
      <CartDrawer />
      <Footer />
    </div>
  );
}
