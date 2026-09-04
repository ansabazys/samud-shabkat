"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";

export function HomepageHeroSection() {
  const t = useTranslations("home");

  return (
    <div className="w-full bg-white text-slate-900 pb-12">
      <div className="w-full max-w-7xl md:max-w-4/5 mx-auto px-4 md:px-0 space-y-6 pt-4 sm:pt-6">
        {/* 1. Main Hero Banner Placeholder (matching existing layout) */}
        <div className="bg-[#F2F3F5] md:h-[420px] h-[260px] rounded-2xl p-8 sm:p-12 lg:p-16 relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8 border border-slate-200/80 shadow-2xs">
          <div className="space-y-4 max-w-lg z-10">
            <span className="inline-flex items-center gap-1.5 bg-[#15803d] text-white text-[11px] font-black px-3.5 py-1 rounded-full uppercase tracking-wider">
              {t("dualPromoEnterpriseTag")}
            </span>
            <h1 className="text-2xl sm:text-4xl font-black text-slate-950 uppercase tracking-tight leading-tight">
              {t("dualPromoEnterpriseTitle")}
            </h1>
            <p className="text-xs sm:text-sm font-semibold text-slate-600">
              {t("dualPromoEnterpriseDesc")}
            </p>
            <div className="pt-2">
              <Link
                href="/products?category=networking"
                className="inline-flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-black px-6 py-3 rounded-xl uppercase tracking-wider transition-all shadow-sm"
              >
                {t("dualPromoEnterpriseBtn")}
              </Link>
            </div>
          </div>
          <div className="w-48 sm:w-72 aspect-square rounded-2xl overflow-hidden bg-white p-3 border border-slate-200/80 shadow-md">
            <img
              src="https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=800&auto=format&fit=crop"
              alt="Enterprise Hardware"
              className="w-full h-full object-cover rounded-xl"
            />
          </div>
        </div>

        {/* 2. Three Sub-Banners Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 lg:gap-6">
          {/* Card 1 */}
          <Link
            href="/products?category=gaming"
            className="group bg-[#F2F3F5] hover:bg-slate-200/80 border border-slate-200/80 rounded-lg p-6 flex items-center justify-between transition-all duration-300 shadow-2xs hover:shadow-xs"
          >
            <div className="space-y-2 max-w-[160px]">
              <h3 className="text-xs sm:text-sm font-black text-slate-900 uppercase tracking-tight leading-snug group-hover:text-amber-600 transition-colors">
                {t("heroPromoConsoles")}
              </h3>
              <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                {t("fromDiscount", { amount: "250 SAR" })}
              </p>
            </div>
            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl overflow-hidden bg-white/90 p-1.5 border border-slate-200/60 shrink-0 shadow-2xs group-hover:scale-105 transition-transform duration-300">
              <img
                src="https://images.unsplash.com/photo-1600080972464-8e5f35f63d08?w=500&auto=format&fit=crop"
                alt="Consoles & Gaming"
                className="w-full h-full object-cover rounded-lg"
              />
            </div>
          </Link>

          {/* Card 2 */}
          <Link
            href="/products?category=wearables"
            className="group bg-[#F2F3F5] hover:bg-slate-200/80 border border-slate-200/80 rounded-lg p-6 flex items-center justify-between transition-all duration-300 shadow-2xs hover:shadow-xs"
          >
            <div className="space-y-2 max-w-[160px]">
              <h3 className="text-xs sm:text-sm font-black text-slate-900 uppercase tracking-tight leading-snug group-hover:text-amber-600 transition-colors">
                {t("heroPromoWearables")}
              </h3>
              <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                {t("fromDiscount", { amount: "199 SAR" })}
              </p>
            </div>
            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl overflow-hidden bg-white/90 p-1.5 border border-slate-200/60 shrink-0 shadow-2xs group-hover:scale-105 transition-transform duration-300">
              <img
                src="https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=500&auto=format&fit=crop"
                alt="Smart Watch G3"
                className="w-full h-full object-cover rounded-lg"
              />
            </div>
          </Link>

          {/* Card 3 */}
          <Link
            href="/products?category=audio"
            className="group bg-[#F2F3F5] hover:bg-slate-200/80 border border-slate-200/80 rounded-lg p-6 flex items-center justify-between transition-all duration-300 shadow-2xs hover:shadow-xs"
          >
            <div className="space-y-2 max-w-[160px]">
              <h3 className="text-xs sm:text-sm font-black text-slate-900 uppercase tracking-tight leading-snug group-hover:text-amber-600 transition-colors">
                {t("heroPromoAudio")}
              </h3>
              <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                {t("fromDiscount", { amount: "250 SAR" })}
              </p>
            </div>
            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl overflow-hidden bg-white/90 p-1.5 border border-slate-200/60 shrink-0 shadow-2xs group-hover:scale-105 transition-transform duration-300">
              <img
                src="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&auto=format&fit=crop"
                alt="Wireless Headphones"
                className="w-full h-full object-cover rounded-lg"
              />
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
