"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { CartDrawer } from "@/components/cart/cart-drawer";
import { useLanguageStore } from "@/store/language-store";

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const direction = useLanguageStore((state) => state.direction);
  const language = useLanguageStore((state) => state.language);

  const isAdminRoute = pathname?.startsWith("/admin");

  useEffect(() => {
    if (typeof document !== "undefined") {
      document.documentElement.dir = direction;
      document.documentElement.lang = language;
    }
  }, [direction, language]);

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
