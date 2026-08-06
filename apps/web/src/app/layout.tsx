import type { Metadata } from "next";
import "./globals.css";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { CartDrawer } from "@/components/cart/cart-drawer";

export const metadata: Metadata = {
  title: "Samud Shabkat | Enterprise Network & Hardware B2B Platform",
  description:
    "Leading wholesale distributor of enterprise network hardware, servers, switches, fiber optics, and telecom equipment in UAE and GCC.",
  keywords:
    "networking, hardware, B2B wholesale, enterprise servers, fiber optics, Dubai, GCC",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full dark">
      <body className="min-h-full flex flex-col bg-slate-950 text-slate-100 antialiased selection:bg-cyan-500 selection:text-white">
        <Header />
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {children}
        </main>
        <CartDrawer />
        <Footer />
      </body>
    </html>
  );
}
