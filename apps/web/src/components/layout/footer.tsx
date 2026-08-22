"use client";

import Link from "next/link";
import {
  Mail,
  Phone,
  MapPin,
  ShieldCheck,
  Truck,
  Headphones,
} from "lucide-react";

export function Footer() {
  return (
    <footer className="w-full bg-[#F4F5F7] border-t border-slate-200/80 font-sans text-slate-900 mt-16 pt-10 pb-12">
      <div className="w-full max-w-7xl md:max-w-4/5 mx-auto px-4 md:px-0">
        {/* Top Feature Guarantee Bar */}
        <div className="bg-white border-2 border-[#FFD400] rounded-2xl p-5 mb-10 shadow-2xs">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 divide-y sm:divide-y-0 sm:divide-x divide-slate-100">
            <div className="flex items-center gap-4">
              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/60 text-slate-900 shrink-0">
                <Truck className="w-6 h-6 stroke-[1.5]" />
              </div>
              <div>
                <h4 className="text-xs sm:text-sm font-extrabold text-slate-900 uppercase tracking-tight">
                  Fast KSA & GCC Shipping
                </h4>
                <p className="text-[11px] font-medium text-slate-500 mt-0.5">
                  Express delivery across Riyadh, Jeddah & Dammam
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4 pt-4 sm:pt-0 sm:pl-6">
              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/60 text-slate-900 shrink-0">
                <ShieldCheck className="w-6 h-6 stroke-[1.5]" />
              </div>
              <div>
                <h4 className="text-xs sm:text-sm font-extrabold text-slate-900 uppercase tracking-tight">
                  100% Genuine Hardware
                </h4>
                <p className="text-[11px] font-medium text-slate-500 mt-0.5">
                  Official manufacturer warranty guaranteed
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4 pt-4 sm:pt-0 sm:pl-6">
              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/60 text-slate-900 shrink-0">
                <Headphones className="w-6 h-6 stroke-[1.5]" />
              </div>
              <div>
                <h4 className="text-xs sm:text-sm font-extrabold text-slate-900 uppercase tracking-tight">
                  Dedicated B2B Support
                </h4>
                <p className="text-[11px] font-medium text-slate-500 mt-0.5">
                  Account managers & certified engineers on standby
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* 4-Column Links Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 lg:gap-12 pb-8 border-b border-slate-200/80">
          {/* Column 1: Brand Summary */}
          <div className="space-y-3">
            <Link href="/" className="inline-block">
              <span className="text-xl sm:text-2xl font-black tracking-tight text-slate-900 font-sans">
                samud<span className="text-amber-500">.</span>shabkat
              </span>
            </Link>
            <p className="text-xs text-slate-600 leading-relaxed font-medium">
              Saudi Arabia’s premier distributor of enterprise networking
              equipment, servers, computers, workstations, and high-performance
              IT components.
            </p>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h3 className="text-xs sm:text-sm font-extrabold text-slate-900 uppercase tracking-tight mb-4 relative inline-block">
              Quick Links
              <span className="absolute bottom-[-6px] left-0 w-full h-[2.5px] bg-[#FFD400] rounded-full" />
            </h3>
            <ul className="space-y-2.5 text-xs font-semibold text-slate-600">
              <li>
                <Link
                  href="/products"
                  className="hover:text-amber-600 transition"
                >
                  All Products Catalog
                </Link>
              </li>
              <li>
                <Link
                  href="/products?deals=true"
                  className="hover:text-amber-600 transition"
                >
                  Hot Deals & Promotions
                </Link>
              </li>
              <li>
                <Link
                  href="/brands"
                  className="hover:text-amber-600 transition"
                >
                  Featured Partner Brands
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-amber-600 transition">
                  About Samud Shabkat
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Hardware Categories */}
          <div>
            <h3 className="text-xs sm:text-sm font-extrabold text-slate-900 uppercase tracking-tight mb-4 relative inline-block">
              Hardware Categories
              <span className="absolute bottom-[-6px] left-0 w-full h-[2.5px] bg-[#FFD400] rounded-full" />
            </h3>
            <ul className="space-y-2.5 text-xs font-semibold text-slate-600">
              <li>
                <Link
                  href="/products?category=networking"
                  className="hover:text-amber-600 transition"
                >
                  Switches & Routers
                </Link>
              </li>
              <li>
                <Link
                  href="/products?category=computers"
                  className="hover:text-amber-600 transition"
                >
                  Workstations & Laptops
                </Link>
              </li>
              <li>
                <Link
                  href="/products?category=servers-nas"
                  className="hover:text-amber-600 transition"
                >
                  Rack Servers & NAS Storage
                </Link>
              </li>
              <li>
                <Link
                  href="/products?category=components"
                  className="hover:text-amber-600 transition"
                >
                  GPUs & Processors
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Contact Information */}
          <div>
            <h3 className="text-xs sm:text-sm font-extrabold text-slate-900 uppercase tracking-tight mb-4 relative inline-block">
              Contact Us
              <span className="absolute bottom-[-6px] left-0 w-full h-[2.5px] bg-[#FFD400] rounded-full" />
            </h3>
            <ul className="space-y-3 text-xs font-semibold text-slate-600">
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-slate-800 shrink-0 mt-0.5" />
                <span>Olaya District, King Fahd Road, Riyadh, KSA</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-slate-800 shrink-0" />
                <span>+966 11 234 5678</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-slate-800 shrink-0" />
                <span>sales@samudshabkat.com</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Copyright Bar */}
        <div className="pt-6 text-center text-xs font-semibold text-slate-500">
          <p>
            © {new Date().getFullYear()} Samud Shabkat Technology Co. All rights
            reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
