import Link from "next/link";
import {
  Box,
  Mail,
  Phone,
  MapPin,
  ShieldCheck,
  Truck,
  Headphones,
} from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-slate-950 border-t border-slate-800 text-slate-400 text-sm mt-20">
      {/* Feature Badges */}
      <div className="border-b border-slate-800/60 bg-slate-900/40">
        <div className="max-w-7xl mx-auto px-4 py-8 grid grid-cols-1 sm:grid-cols-3 gap-6 text-center sm:text-left">
          <div className="flex items-center justify-center sm:justify-start gap-4">
            <div className="p-3 rounded-xl bg-cyan-950/60 border border-cyan-500/20 text-cyan-400">
              <Truck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-semibold text-white">Fast GCC Shipping</h4>
              <p className="text-xs text-slate-400">
                Same-day dispatch for Dubai & UAE
              </p>
            </div>
          </div>
          <div className="flex items-center justify-center sm:justify-start gap-4">
            <div className="p-3 rounded-xl bg-sky-950/60 border border-sky-500/20 text-sky-400">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-semibold text-white">
                100% Genuine Hardware
              </h4>
              <p className="text-xs text-slate-400">
                Full manufacturer warranty guaranteed
              </p>
            </div>
          </div>
          <div className="flex items-center justify-center sm:justify-start gap-4">
            <div className="p-3 rounded-xl bg-indigo-950/60 border border-indigo-500/20 text-indigo-400">
              <Headphones className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-semibold text-white">B2B Sales Support</h4>
              <p className="text-xs text-slate-400">
                Dedicated account managers available
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 py-12 grid grid-cols-1 md:grid-cols-4 gap-8">
        <div>
          <Link href="/" className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-cyan-500 to-indigo-500 flex items-center justify-center text-white font-bold">
              <Box className="w-5 h-5" />
            </div>
            <span className="text-lg font-bold text-white">
              Samud<span className="text-cyan-400">Shabkat</span>
            </span>
          </Link>
          <p className="text-xs text-slate-400 leading-relaxed">
            Leading B2B distributor of enterprise network hardware, servers,
            fiber optics, and telecom equipment across UAE and the Middle East.
          </p>
        </div>

        <div>
          <h3 className="text-white font-semibold mb-4 text-xs uppercase tracking-wider">
            Quick Links
          </h3>
          <ul className="space-y-2.5 text-xs">
            <li>
              <Link href="/products" className="hover:text-cyan-400 transition">
                Product Catalog
              </Link>
            </li>
            <li>
              <Link
                href="/categories"
                className="hover:text-cyan-400 transition"
              >
                Browse Categories
              </Link>
            </li>
            <li>
              <Link href="/brands" className="hover:text-cyan-400 transition">
                Our Partner Brands
              </Link>
            </li>
            <li>
              <Link
                href="/account/orders"
                className="hover:text-cyan-400 transition"
              >
                Order History
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="text-white font-semibold mb-4 text-xs uppercase tracking-wider">
            Categories
          </h3>
          <ul className="space-y-2.5 text-xs">
            <li>
              <Link
                href="/products?category=networking"
                className="hover:text-cyan-400 transition"
              >
                Switches & Routers
              </Link>
            </li>
            <li>
              <Link
                href="/products?category=fiber-optics"
                className="hover:text-cyan-400 transition"
              >
                Fiber Optic Cables
              </Link>
            </li>
            <li>
              <Link
                href="/products?category=servers"
                className="hover:text-cyan-400 transition"
              >
                Rack Servers & Enclosures
              </Link>
            </li>
            <li>
              <Link
                href="/products?category=wireless"
                className="hover:text-cyan-400 transition"
              >
                Enterprise Access Points
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="text-white font-semibold mb-4 text-xs uppercase tracking-wider">
            Contact Info
          </h3>
          <ul className="space-y-3 text-xs">
            <li className="flex items-start gap-2.5">
              <MapPin className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
              <span>Dubai Silicon Oasis, Dubai, UAE</span>
            </li>
            <li className="flex items-center gap-2.5">
              <Phone className="w-4 h-4 text-cyan-400 shrink-0" />
              <span>+971 4 123 4567</span>
            </li>
            <li className="flex items-center gap-2.5">
              <Mail className="w-4 h-4 text-cyan-400 shrink-0" />
              <span>sales@samudshabkat.com</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-slate-900 py-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>
            © {new Date().getFullYear()} Samud Shabkat E-Commerce Ordering
            Platform. All rights reserved.
          </p>
          <div className="flex gap-4">
            <span className="hover:text-slate-400 transition cursor-pointer">
              Privacy Policy
            </span>
            <span className="hover:text-slate-400 transition cursor-pointer">
              Terms of Wholesale
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
