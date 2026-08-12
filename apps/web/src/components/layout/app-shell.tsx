"use client";

import { usePathname } from "next/navigation";
import { Header } from "@/components/layout/header";
// import { Footer } from "@/components/layout/footer";
import { CartDrawer } from "@/components/cart/cart-drawer";

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdminPage = pathname.startsWith("/admin");
  const isAuthPage = pathname === "/login" || pathname === "/register";

  if (isAdminPage || isAuthPage) {
    return (
      <div className="min-h-full flex flex-col bg-slate-950 text-slate-100 selection:bg-cyan-500 selection:text-white">
        {children}
        <CartDrawer />
      </div>
    );
  }

  return (
    <div className="min-h-full flex flex-col bg-[#FAF9F6] text-slate-900 selection:bg-emerald-600 selection:text-white">
      <Header />
      <main className="flex-1 w-full">{children}</main>
      <CartDrawer />
      {/* <Footer /> */}
    </div>
  );
}
