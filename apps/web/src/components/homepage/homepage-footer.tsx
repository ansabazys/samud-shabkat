"use client";

import Link from "next/link";

export function HomepageFooter() {
  return (
    <footer className="bg-neutral-100/90 border-t border-neutral-200 text-slate-600 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 space-y-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Column 1: Brand */}
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-slate-900 text-white font-bold text-xs flex items-center justify-center">
                S
              </div>
              <span className="text-lg font-bold text-slate-900 tracking-tight font-sans">
                SAMUD <span className="text-cyan-700">SHABKAT</span>
              </span>
            </Link>
            <p className="text-slate-500 leading-relaxed max-w-sm font-normal">
              Samud Shabkat is a premier B2B authorized distributor and stockist
              of enterprise network hardware, servers, fiber optics, and
              workspace technology across UAE & GCC.
            </p>
            <div className="text-[11px] font-mono text-slate-500 space-y-1">
              <p>📍 Dubai Silicon Oasis, Dubai, United Arab Emirates</p>
              <p>📞 +971 4 123 4567 | ✉️ sales@samudshabkat.com</p>
            </div>
          </div>

          {/* Column 2: Hardware Products */}
          <div className="space-y-3">
            <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider font-mono">
              Products
            </h4>
            <ul className="space-y-2 text-slate-600">
              <li>
                <Link
                  href="/products?category=switches-routers"
                  className="hover:text-slate-900 transition"
                >
                  Switches & Routers
                </Link>
              </li>
              <li>
                <Link
                  href="/products?category=computers"
                  className="hover:text-slate-900 transition"
                >
                  Computers & Laptops
                </Link>
              </li>
              <li>
                <Link
                  href="/products?category=components"
                  className="hover:text-slate-900 transition"
                >
                  PC Components
                </Link>
              </li>
              <li>
                <Link
                  href="/products?category=monitors"
                  className="hover:text-slate-900 transition"
                >
                  4K & Studio Displays
                </Link>
              </li>
              <li>
                <Link
                  href="/products?category=servers-storage"
                  className="hover:text-slate-900 transition"
                >
                  Servers & Storage
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Customer Support */}
          <div className="space-y-3">
            <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider font-mono">
              Customer Support
            </h4>
            <ul className="space-y-2 text-slate-600">
              <li>
                <Link
                  href="/support/rfq"
                  className="hover:text-slate-900 transition"
                >
                  Request B2B Quote
                </Link>
              </li>
              <li>
                <Link
                  href="/support/shipping"
                  className="hover:text-slate-900 transition"
                >
                  Shipping & Dispatch Policy
                </Link>
              </li>
              <li>
                <Link
                  href="/support/warranty"
                  className="hover:text-slate-900 transition"
                >
                  Manufacturer Warranty
                </Link>
              </li>
              <li>
                <Link
                  href="/support/faq"
                  className="hover:text-slate-900 transition"
                >
                  Frequently Asked Questions
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Account & Corporate */}
          <div className="space-y-3">
            <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider font-mono">
              Corporate & Account
            </h4>
            <ul className="space-y-2 text-slate-600">
              <li>
                <Link
                  href="/account"
                  className="hover:text-slate-900 transition"
                >
                  My Account Dashboard
                </Link>
              </li>
              <li>
                <Link
                  href="/account/orders"
                  className="hover:text-slate-900 transition"
                >
                  Track Order History
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-slate-900 transition">
                  About Samud Shabkat
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="hover:text-slate-900 transition"
                >
                  Contact Engineering Team
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Copyright Strip */}
        <div className="pt-8 border-t border-neutral-200/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-500 font-medium">
          <p>
            © {new Date().getFullYear()} Samud Shabkat FZ-LLC. All rights
            reserved.
          </p>

          <div className="flex items-center gap-6">
            <Link href="/privacy" className="hover:text-slate-900 transition">
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:text-slate-900 transition">
              Terms of Sale
            </Link>
            <Link href="/sitemap" className="hover:text-slate-900 transition">
              Sitemap
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
