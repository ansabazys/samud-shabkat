"use client";

import Link from "next/link";
import { ArrowRight, Clock } from "lucide-react";

const articles = [
  {
    id: "art-1",
    category: "STORAGE & HARDWARE",
    title:
      "How to Choose the Right NVMe SSD for Workstations & Enterprise Servers",
    excerpt:
      "Understanding PCIe 5.0 speeds, DWPD endurance ratings, and thermal management for high-demand AI and database workloads.",
    readTime: "5 min read",
    image:
      "https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?w=600&auto=format&fit=crop",
  },
  {
    id: "art-2",
    category: "WORKSPACE & DESK",
    title: "Building the Perfect Dual-Monitor Engineering Desk Environment",
    excerpt:
      "A complete guide to ergonomic monitor arms, color accuracy calibration, and clean cable management for developers.",
    readTime: "7 min read",
    image:
      "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=600&auto=format&fit=crop",
  },
  {
    id: "art-3",
    category: "MEMORY & PERFORMANCE",
    title: "Understanding DDR5 RAM Speeds, CAS Latency, and ECC Memory",
    excerpt:
      "Why high MT/s memory speeds matter for rendering, compiling code, and running virtualized server environments.",
    readTime: "4 min read",
    image:
      "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=600&auto=format&fit=crop",
  },
];

export function HomepageArticles() {
  return (
    <section className="py-16 bg-[#FAF9F6] border-b border-neutral-200/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <span className="text-[11px] uppercase tracking-widest font-mono font-bold text-cyan-700 block mb-1">
              EDITORIAL KNOWLEDGE
            </span>
            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight font-sans">
              Technology, Explained.
            </h2>
            <p className="text-xs text-slate-500 mt-1 font-normal">
              Technical guides and hardware breakdowns curated by our engineers.
            </p>
          </div>

          <Link
            href="/guides"
            className="text-xs font-semibold text-slate-800 hover:text-cyan-700 flex items-center gap-1.5 transition"
          >
            View All Guides <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* 3-Column Editorial Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {articles.map((art) => (
            <div
              key={art.id}
              className="group bg-white border border-neutral-200/80 rounded-2xl p-6 flex flex-col justify-between shadow-sm hover:shadow-md transition duration-300"
            >
              <div className="space-y-4">
                <div className="aspect-[16/10] rounded-xl overflow-hidden bg-neutral-100 relative">
                  <img
                    src={art.image}
                    alt={art.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                  />
                </div>

                <div className="flex items-center justify-between text-[11px] font-mono text-slate-400">
                  <span className="text-cyan-700 font-bold tracking-wider uppercase">
                    {art.category}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3 text-slate-400" /> {art.readTime}
                  </span>
                </div>

                <h3 className="text-base font-bold text-slate-900 group-hover:text-cyan-700 transition leading-snug font-sans">
                  {art.title}
                </h3>

                <p className="text-xs text-slate-500 leading-relaxed">
                  {art.excerpt}
                </p>
              </div>

              <div className="pt-4 mt-4 border-t border-neutral-100">
                <Link
                  href={`/guides/${art.id}`}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-900 hover:text-cyan-700 transition"
                >
                  Read Technical Article <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
