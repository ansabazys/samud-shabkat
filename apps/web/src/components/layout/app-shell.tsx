"use client";

import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { CartDrawer } from "@/components/cart/cart-drawer";

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-full flex flex-col bg-white text-slate-900 selection:bg-emerald-600 selection:text-white">
      <Header />
      <main className="flex-1 w-full">{children}</main>
      <CartDrawer />
      <Footer />
    </div>
  );
}
