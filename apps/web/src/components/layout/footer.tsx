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
import { useTranslations } from "next-intl";
import { Logo } from "@/components/ui/logo";

export function Footer() {
  const t = useTranslations("footer");

  return (
    <footer className="w-full bg-[#F4F5F7] border-t border-slate-200/80 font-sans text-slate-900 mt-16 pt-10 pb-12">
      <div className="w-full max-w-7xl md:max-w-4/5 mx-auto px-4 md:px-0">
        {/* Top Feature Guarantee Bar */}
        <div className="bg-white border-2 border-[#FFD400] rounded-2xl p-5 mb-10 shadow-2xs">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 divide-y sm:divide-y-0 sm:divide-x rtl:sm:divide-x-reverse divide-slate-100">
            <div className="flex items-center gap-4">
              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/60 text-slate-900 shrink-0">
                <Truck className="w-6 h-6 stroke-[1.5]" />
              </div>
              <div>
                <h4 className="text-xs sm:text-sm font-extrabold text-slate-900 uppercase tracking-tight">
                  {t("guarantees.shippingTitle")}
                </h4>
                <p className="text-[11px] font-medium text-slate-500 mt-0.5">
                  {t("guarantees.shippingDesc")}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4 pt-4 sm:pt-0 sm:ps-6">
              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/60 text-slate-900 shrink-0">
                <ShieldCheck className="w-6 h-6 stroke-[1.5]" />
              </div>
              <div>
                <h4 className="text-xs sm:text-sm font-extrabold text-slate-900 uppercase tracking-tight">
                  {t("guarantees.genuineTitle")}
                </h4>
                <p className="text-[11px] font-medium text-slate-500 mt-0.5">
                  {t("guarantees.genuineDesc")}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4 pt-4 sm:pt-0 sm:ps-6">
              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/60 text-slate-900 shrink-0">
                <Headphones className="w-6 h-6 stroke-[1.5]" />
              </div>
              <div>
                <h4 className="text-xs sm:text-sm font-extrabold text-slate-900 uppercase tracking-tight">
                  {t("guarantees.supportTitle")}
                </h4>
                <p className="text-[11px] font-medium text-slate-500 mt-0.5">
                  {t("guarantees.supportDesc")}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* 4-Column Links Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 lg:gap-12 pb-8 border-b border-slate-200/80">
          {/* Column 1: Brand Summary */}
          <div className="space-y-3">
            <Logo href="/" size="md" />
            <p className="text-xs text-slate-600 leading-relaxed font-medium">
              {t("brandDescription")}
            </p>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h3 className="text-xs sm:text-sm font-extrabold text-slate-900 uppercase tracking-tight mb-4 relative inline-block">
              {t("quickLinksTitle")}
              <span className="absolute bottom-[-6px] start-0 w-full h-[2.5px] bg-[#FFD400] rounded-full" />
            </h3>
            <ul className="space-y-2.5 text-xs font-semibold text-slate-600">
              <li>
                <Link
                  href="/products"
                  className="hover:text-amber-600 transition"
                >
                  {t("allProductsLink")}
                </Link>
              </li>
              <li>
                <Link
                  href="/products?deals=true"
                  className="hover:text-amber-600 transition"
                >
                  {t("hotDealsLink")}
                </Link>
              </li>
              <li>
                <Link
                  href="/products"
                  className="hover:text-amber-600 transition"
                >
                  {t("partnerBrandsLink")}
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="hover:text-amber-600 transition"
                >
                  {t("aboutLink")}
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Hardware Categories */}
          <div>
            <h3 className="text-xs sm:text-sm font-extrabold text-slate-900 uppercase tracking-tight mb-4 relative inline-block">
              {t("categoriesTitle")}
              <span className="absolute bottom-[-6px] start-0 w-full h-[2.5px] bg-[#FFD400] rounded-full" />
            </h3>
            <ul className="space-y-2.5 text-xs font-semibold text-slate-600">
              <li>
                <Link
                  href="/products?category=networking"
                  className="hover:text-amber-600 transition"
                >
                  {t("switchesRouters")}
                </Link>
              </li>
              <li>
                <Link
                  href="/products?category=computers"
                  className="hover:text-amber-600 transition"
                >
                  {t("workstationsLaptops")}
                </Link>
              </li>
              <li>
                <Link
                  href="/products?category=servers-nas"
                  className="hover:text-amber-600 transition"
                >
                  {t("rackServersStorage")}
                </Link>
              </li>
              <li>
                <Link
                  href="/products?category=components"
                  className="hover:text-amber-600 transition"
                >
                  {t("gpusProcessors")}
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Contact Information */}
          <div>
            <h3 className="text-xs sm:text-sm font-extrabold text-slate-900 uppercase tracking-tight mb-4 relative inline-block">
              {t("contactTitle")}
              <span className="absolute bottom-[-6px] start-0 w-full h-[2.5px] bg-[#FFD400] rounded-full" />
            </h3>
            <ul className="space-y-3 text-xs font-semibold text-slate-600">
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-slate-800 shrink-0 mt-0.5" />
                <span>{t("addressText")}</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-slate-800 shrink-0" />
                <span dir="ltr">{t("phoneText")}</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-slate-800 shrink-0" />
                <span dir="ltr">{t("emailText")}</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Copyright Bar */}
        <div className="pt-6 text-center text-xs font-semibold text-slate-500">
          <p>{t("copyright", { year: new Date().getFullYear() })}</p>
        </div>
      </div>
    </footer>
  );
}
