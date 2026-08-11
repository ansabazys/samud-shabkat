"use client";

import Link from "next/link";
import { ArrowRight, Monitor, Laptop, Keyboard, Cpu } from "lucide-react";

export function HomepageFeaturedSetup() {
  return (
    <section className="py-16 bg-white border-b border-neutral-200/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Visual Composition Story */}
          <div className="lg:col-span-7 relative">
            <div className="bg-neutral-100 rounded-3xl p-8 border border-neutral-200/80 relative overflow-hidden">
              <div className="aspect-[16/10] rounded-2xl overflow-hidden shadow-md">
                <img
                  src="https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=1000&auto=format&fit=crop"
                  alt="Modern Minimalist Workstation Setup"
                  className="w-full h-full object-cover rounded-2xl"
                />
              </div>

              {/* Hotspot Floating Badges */}
              <div className="hidden sm:flex absolute top-12 right-12 bg-white/95 backdrop-blur-md border border-neutral-200 px-3.5 py-2 rounded-xl shadow-md items-center gap-2 text-xs font-bold text-slate-900">
                <Monitor className="w-4 h-4 text-cyan-600" />
                <span>ASUS ProArt 32" 4K HDR</span>
              </div>

              <div className="hidden sm:flex absolute bottom-12 left-12 bg-white/95 backdrop-blur-md border border-neutral-200 px-3.5 py-2 rounded-xl shadow-md items-center gap-2 text-xs font-bold text-slate-900">
                <Laptop className="w-4 h-4 text-cyan-600" />
                <span>Dell XPS Workstation</span>
              </div>
            </div>
          </div>

          {/* Right Text & Collection Details */}
          <div className="lg:col-span-5 space-y-6">
            <div>
              <span className="text-[11px] font-mono font-bold uppercase tracking-widest text-cyan-700 block mb-2">
                FEATURED COLLECTION
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight font-sans leading-tight">
                Build Your Setup.
              </h2>
            </div>

            <p className="text-sm sm:text-base text-slate-600 leading-relaxed font-normal">
              Everything you need for a cleaner, smarter workspace. From 4K
              reference monitors to whisper-quiet mechanical keyboards and
              high-bandwidth Thunderbolt docking stations.
            </p>

            <div className="space-y-3 pt-2">
              <div className="flex items-center gap-3 text-xs font-semibold text-slate-800 p-3 rounded-xl bg-neutral-50 border border-neutral-200/60">
                <Monitor className="w-4 h-4 text-cyan-600 shrink-0" />
                <span>Calibrated 4K Mini-LED Displays with 99% DCI-P3</span>
              </div>
              <div className="flex items-center gap-3 text-xs font-semibold text-slate-800 p-3 rounded-xl bg-neutral-50 border border-neutral-200/60">
                <Keyboard className="w-4 h-4 text-cyan-600 shrink-0" />
                <span>Hot-swappable Custom Mechanical Keyboards</span>
              </div>
              <div className="flex items-center gap-3 text-xs font-semibold text-slate-800 p-3 rounded-xl bg-neutral-50 border border-neutral-200/60">
                <Cpu className="w-4 h-4 text-cyan-600 shrink-0" />
                <span>Thunderbolt 4 Docks with 100W Power Delivery</span>
              </div>
            </div>

            <div className="pt-4">
              <Link
                href="/products?collection=workstation"
                className="px-6 py-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs transition inline-flex items-center gap-2 shadow-sm"
              >
                Explore Workspace Collection{" "}
                <ArrowRight className="w-4 h-4 text-cyan-400" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
