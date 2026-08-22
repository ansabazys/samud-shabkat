"use client";

import Link from "next/link";

export function HomepageHeroSection() {
  return (
    <div className="w-full bg-white text-slate-900 pb-12">
      <div className="w-full max-w-7xl md:max-w-4/5 mx-auto px-4 md:px-0 space-y-6 pt-4 sm:pt-6">
        {/* 1. Main Hero Banner */}
        <div className="bg-[#F2F3F5] md:h-[600px] h-[300px] rounded-lg p-8 sm:p-12 lg:p-16 relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8 border border-slate-200/80 shadow-2xs"></div>

        {/* 2. Three Sub-Banners Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 lg:gap-6">
          {/* Card 1 */}
          <Link
            href="/products?category=gaming"
            className="group bg-[#F2F3F5] hover:bg-slate-200/80 border border-slate-200/80 rounded-lg p-6 flex items-center justify-between transition-all duration-300 shadow-2xs hover:shadow-xs"
          >
            <div className="space-y-2 max-w-[160px]">
              <h3 className="text-xs sm:text-sm font-black text-slate-900 uppercase tracking-tight leading-snug group-hover:text-amber-600 transition-colors">
                Catch Big Deals Consoles
              </h3>
              <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                from{" "}
                <strong className="text-slate-900 font-extrabold">
                  250 SAR
                </strong>{" "}
                OFF!
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
                New Standard Smart G3
              </h3>
              <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                from{" "}
                <strong className="text-slate-900 font-extrabold">
                  199 SAR
                </strong>{" "}
                OFF!
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
                Big The Standard Headphones
              </h3>
              <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                from{" "}
                <strong className="text-slate-900 font-extrabold">
                  250 SAR
                </strong>{" "}
                OFF!
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
