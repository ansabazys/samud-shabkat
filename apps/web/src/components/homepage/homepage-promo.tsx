"use client";

import Link from "next/link";
import { ArrowRight, Tag, Sparkles } from "lucide-react";

export function HomepagePromo() {
  return (
    <section className="py-12 bg-[#FAF9F6]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-br from-neutral-900 via-slate-900 to-indigo-950 rounded-3xl p-8 sm:p-12 text-white relative overflow-hidden shadow-xl">
          {/* Subtle Graphic Element */}
          <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-5">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-950/90 border border-cyan-500/30 text-cyan-300 text-xs font-bold uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" /> SUMMER PICKS
              </div>

              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white leading-tight">
                Smart upgrades for your setup.
              </h2>

              <p className="text-sm sm:text-base text-slate-300 max-w-xl leading-relaxed font-normal">
                Upgrade your core infrastructure with next-gen 100G routers,
                stackable switches, and ultra-fast fiber optics. Special B2B
                promotional discounts applied on volume orders.
              </p>

              <div className="pt-2 flex flex-wrap items-center gap-4">
                <Link
                  href="/products?deals=true"
                  className="px-6 py-3 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-semibold text-xs transition flex items-center gap-2 shadow-lg shadow-cyan-600/20"
                >
                  Explore Deals <ArrowRight className="w-4 h-4" />
                </Link>
                <span className="text-xs text-slate-400 font-mono">
                  Limited time promotional pricing
                </span>
              </div>
            </div>

            {/* Right Promotional Card */}
            <div className="lg:col-span-5 bg-white/10 backdrop-blur-md border border-white/15 rounded-2xl p-6 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-[10px] uppercase font-mono tracking-widest text-cyan-300 font-bold flex items-center gap-1">
                  <Tag className="w-3 h-3 text-cyan-400" /> FEATURED PROMO
                </span>
                <span className="bg-rose-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                  SAVE 18%
                </span>
              </div>

              <div className="flex gap-4 items-center">
                <img
                  src="https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=400&auto=format&fit=crop"
                  alt="MikroTik CCR2216 Router"
                  className="w-20 h-20 object-cover rounded-xl bg-slate-900 border border-slate-700 shrink-0"
                />
                <div>
                  <h4 className="text-sm font-bold text-white leading-snug">
                    MikroTik CCR2216-1G-12XS-2XQ 100G Cloud Core Router
                  </h4>
                  <div className="flex items-baseline gap-2 mt-1.5 font-mono">
                    <span className="text-xs text-slate-400 line-through">
                      AED 10,800
                    </span>
                    <span className="text-base font-extrabold text-cyan-400">
                      AED 8,900
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
