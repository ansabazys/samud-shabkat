"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";

export function HomepageCTA() {
  return (
    <section className="py-20 bg-[#FAF9F6] border-b border-neutral-200/60 text-center">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <span className="text-[11px] font-mono font-bold uppercase tracking-widest text-cyan-700 block">
          READY TO UPGRADE YOUR HARDWARE?
        </span>

        <h2 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight font-sans">
          Find something you'll love.
        </h2>

        <p className="text-sm sm:text-base text-slate-600 max-w-xl mx-auto leading-relaxed">
          Explore thousands of enterprise networking, workstation, and telecom
          products ready for immediate B2B procurement and fast shipping.
        </p>

        <div className="pt-2">
          <Link
            href="/products"
            className="px-8 py-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs shadow-md shadow-slate-900/10 transition inline-flex items-center gap-2"
          >
            Start Shopping <ArrowRight className="w-4 h-4 text-cyan-400" />
          </Link>
        </div>
      </div>
    </section>
  );
}
