"use client";

import Link from "next/link";
import {
  ArrowRight,
  Laptop,
  Cpu,
  Server,
  Monitor,
  HardDrive,
} from "lucide-react";

const categories = [
  {
    title: "COMPUTING & WORKSTATIONS",
    slug: "computers",
    description: "High-performance laptops, workstations, and mini PCs.",
    icon: Laptop,
    image:
      "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600&auto=format&fit=crop",
    subLinks: ["Workstation Laptops", "Mini PCs", "Desktop Towers"],
    gridSpan: "lg:col-span-8",
  },
  {
    title: "PC & HARDWARE COMPONENTS",
    slug: "components",
    description: "Processors, GPUs, RAM, high-speed storage & power units.",
    icon: Cpu,
    image:
      "https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?w=600&auto=format&fit=crop",
    subLinks: ["CPUs & GPUs", "DDR5 RAM", "PCIe NVMe SSDs"],
    gridSpan: "lg:col-span-4",
  },
  {
    title: "ENTERPRISE NETWORKING",
    slug: "switches-routers",
    description:
      "Layer 2/3 managed switches, core routers & fiber transceivers.",
    icon: Server,
    image:
      "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=600&auto=format&fit=crop",
    subLinks: ["PoE+ Switches", "Core Routers", "Optical Modules"],
    gridSpan: "lg:col-span-4",
  },
  {
    title: "MONITORS & STUDIO DISPLAYS",
    slug: "monitors",
    description: "4K UHD reference displays, ultrawides & studio monitors.",
    icon: Monitor,
    image:
      "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=600&auto=format&fit=crop",
    subLinks: ["4K Monitors", "Ultrawide Displays", "Studio Displays"],
    gridSpan: "lg:col-span-4",
  },
  {
    title: "RACK SERVERS & NAS",
    slug: "servers-storage",
    description: "Xeon enterprise rack servers & high-density NAS arrays.",
    icon: HardDrive,
    image:
      "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=600&auto=format&fit=crop",
    subLinks: ["Rack Servers", "NAS Storage", "RAID Controllers"],
    gridSpan: "lg:col-span-4",
  },
];

export function HomepageCategories() {
  return (
    <section className="py-16 bg-[#FAF9F6] border-b border-neutral-200/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Section Title */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <span className="text-[11px] uppercase tracking-widest font-mono font-bold text-cyan-700 block mb-1">
              CURATED HARDWARE
            </span>
            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight font-sans">
              Shop by Category
            </h2>
          </div>
          <Link
            href="/categories"
            className="text-xs font-semibold text-slate-800 hover:text-cyan-700 flex items-center gap-1.5 transition"
          >
            View All Categories <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Editorial Categories Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {categories.map((cat) => {
            const Icon = cat.icon;
            return (
              <div
                key={cat.slug}
                className={`${cat.gridSpan} group relative rounded-3xl bg-white border border-neutral-200/80 p-8 flex flex-col justify-between overflow-hidden shadow-sm hover:shadow-md transition-all duration-300`}
              >
                <div className="space-y-3 max-w-md z-10">
                  <div className="w-10 h-10 rounded-xl bg-neutral-100 border border-neutral-200 flex items-center justify-center text-slate-800 group-hover:bg-slate-900 group-hover:text-white transition">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 tracking-tight font-sans group-hover:text-cyan-700 transition">
                    {cat.title}
                  </h3>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    {cat.description}
                  </p>

                  <div className="pt-2 flex flex-wrap gap-2 text-[11px] font-medium text-slate-600">
                    {cat.subLinks.map((sub) => (
                      <span
                        key={sub}
                        className="px-2.5 py-1 rounded-md bg-neutral-100 text-slate-700 border border-neutral-200/60"
                      >
                        {sub}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-6 z-10">
                  <Link
                    href={`/products?category=${cat.slug}`}
                    className="inline-flex items-center gap-2 text-xs font-bold text-slate-900 hover:text-cyan-700 transition"
                  >
                    Explore Category <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>

                {/* Subtle Image Background Fade */}
                <div className="absolute right-0 bottom-0 w-1/2 h-full opacity-10 group-hover:opacity-25 transition duration-500 pointer-events-none">
                  <img
                    src={cat.image}
                    alt={cat.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
