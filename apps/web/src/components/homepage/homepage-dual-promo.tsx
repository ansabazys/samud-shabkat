"use client";

import Link from "next/link";
import { ArrowRight, Server, Laptop } from "lucide-react";
import { useTranslations } from "next-intl";

export function HomepageDualPromo() {
  const t = useTranslations("home");

  return (
    <section className="w-full max-w-7xl md:max-w-4/5 mx-auto px-4 md:px-0 py-8 sm:py-10 bg-white font-sans">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Banner 1: Enterprise Networking */}
        <Link
          href="/products?category=networking"
          className="group bg-[#F4F5F7] hover:bg-slate-200/70 border border-slate-200/80 hover:border-slate-300 rounded-lg p-6 sm:p-8 flex items-center justify-between gap-6 relative overflow-hidden transition-all duration-300 shadow-2xs hover:shadow-xs cursor-pointer"
        >
          {/* Left Text */}
          <div className="space-y-3 flex-1 max-w-[240px] sm:max-w-xs z-10">
            <span className="inline-flex items-center gap-1.5 bg-slate-900 text-white text-[10px] font-extrabold px-3 py-1 rounded-full uppercase tracking-wider">
              <Server className="w-3 h-3 text-[#FFD400]" />
              {t("dualPromoEnterpriseTag")}
            </span>

            <h3 className="text-base sm:text-xl font-black text-slate-900 uppercase tracking-tight leading-tight group-hover:text-amber-600 transition-colors">
              {t("dualPromoEnterpriseTitle")}
            </h3>

            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              {t("dualPromoEnterpriseDesc")}
            </p>

            <div className="pt-2">
              <span className="inline-flex items-center gap-1 text-xs font-extrabold text-slate-900 group-hover:text-amber-600 uppercase tracking-wider transition-colors">
                <span>{t("dualPromoEnterpriseBtn")}</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 rtl:group-hover:-translate-x-1 rtl:rotate-180 transition-transform" />
              </span>
            </div>
          </div>

          {/* Right Product Visual */}
          <div className="w-32 sm:w-44 aspect-square rounded-lg overflow-hidden bg-white p-2 border border-slate-200/60 shrink-0 shadow-md group-hover:scale-105 transition-transform duration-300">
            <img
              src="https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=600&auto=format&fit=crop"
              alt="Enterprise Networking Equipment"
              className="w-full h-full object-cover rounded-xl"
            />
          </div>
        </Link>

        {/* Banner 2: Pro Workstations & Laptops */}
        <Link
          href="/products?category=computers"
          className="group bg-[#F4F5F7] hover:bg-slate-200/70 border border-slate-200/80 hover:border-slate-300 rounded-lg p-6 sm:p-8 flex items-center justify-between gap-6 relative overflow-hidden transition-all duration-300 shadow-2xs hover:shadow-xs cursor-pointer"
        >
          {/* Left Text */}
          <div className="space-y-3 flex-1 max-w-[240px] sm:max-w-xs z-10">
            <span className="inline-flex items-center gap-1.5 bg-[#FFD400] text-slate-950 text-[10px] font-extrabold px-3 py-1 rounded-full uppercase tracking-wider">
              <Laptop className="w-3 h-3 text-slate-950" />
              {t("dualPromoWorkstationTag")}
            </span>

            <h3 className="text-base sm:text-xl font-black text-slate-900 uppercase tracking-tight leading-tight group-hover:text-amber-600 transition-colors">
              {t("dualPromoWorkstationTitle")}
            </h3>

            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              {t("dualPromoWorkstationDesc")}
            </p>

            <div className="pt-2">
              <span className="inline-flex items-center gap-1 text-xs font-extrabold text-slate-900 group-hover:text-amber-600 uppercase tracking-wider transition-colors">
                <span>{t("dualPromoWorkstationBtn")}</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 rtl:group-hover:-translate-x-1 rtl:rotate-180 transition-transform" />
              </span>
            </div>
          </div>

          {/* Right Product Visual */}
          <div className="w-32 sm:w-44 aspect-square rounded-2xl overflow-hidden bg-white p-2 border border-slate-200/60 shrink-0 shadow-md group-hover:scale-105 transition-transform duration-300">
            <img
              src="https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600&auto=format&fit=crop"
              alt="Pro Workstations & Laptops"
              className="w-full h-full object-cover rounded-xl"
            />
          </div>
        </Link>
      </div>
    </section>
  );
}
