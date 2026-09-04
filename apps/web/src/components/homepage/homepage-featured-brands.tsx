"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { fetchBrands, Brand } from "@/lib/api";

export function HomepageFeaturedBrands() {
  const t = useTranslations("home");
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBrands()
      .then((data) => setBrands(data))
      .catch(() => setBrands([]))
      .finally(() => setLoading(false));
  }, []);

  // Duplicate for infinite marquee
  const marqueeBrands = [...brands, ...brands];

  return (
    <section className="w-full max-w-7xl md:max-w-4/5 mx-auto px-4 md:px-0 py-8 sm:py-12 bg-white font-sans overflow-hidden">
      <div className="flex items-center justify-between pb-3 mb-8">
        <h2 className="text-sm sm:text-base font-extrabold text-slate-900 tracking-tight uppercase relative inline-block">
          {t("featuredBrandsTitle")}
          <span className="absolute bottom-[-13px] start-0 w-full h-[3px] bg-[#FFD400] rounded-full" />
        </h2>
        <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
          {t("officialDistributors")}
        </span>
      </div>

      {loading ? (
        <div className="flex items-center gap-5 overflow-hidden">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="min-w-[170px] h-24 bg-slate-50 border border-slate-100 rounded-2xl animate-pulse shrink-0"
            />
          ))}
        </div>
      ) : brands.length === 0 ? (
        <p className="text-xs text-slate-400 font-medium py-6">
          No brands available.
        </p>
      ) : (
        <div className="relative w-full overflow-hidden py-2 before:absolute before:start-0 before:top-0 before:z-10 before:h-full before:w-16 before:bg-gradient-to-r rtl:before:bg-gradient-to-l before:from-white before:to-transparent after:absolute after:end-0 after:top-0 after:z-10 after:h-full after:w-16 after:bg-gradient-to-l rtl:after:bg-gradient-to-r after:from-white after:to-transparent">
          <div className="animate-marquee flex items-center gap-5">
            {marqueeBrands.map((brand, idx) => (
              <Link
                key={`${brand.id}-${idx}`}
                href={`/products?brand=${brand.slug}`}
                className="group bg-[#F4F5F7] hover:bg-[#FFD400]/25 border border-slate-200/80 hover:border-slate-300 rounded-2xl px-8 py-4 flex flex-col items-center justify-center text-center transition-all duration-300 shadow-2xs hover:shadow shrink-0 min-w-[170px] h-24 cursor-pointer"
              >
                {brand.logoUrl ? (
                  <img
                    src={brand.logoUrl}
                    alt={brand.name}
                    className="h-10 w-auto object-contain mb-1"
                  />
                ) : (
                  <span className="text-lg font-black tracking-widest text-slate-900 group-hover:text-slate-950 transition-colors uppercase">
                    {brand.name.slice(0, 8)}
                  </span>
                )}
                <span className="text-[10px] font-bold text-slate-500 group-hover:text-slate-800 transition-colors mt-1 uppercase tracking-wider whitespace-nowrap">
                  {brand.description
                    ? brand.description.slice(0, 24)
                    : brand.name}
                </span>
              </Link>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
