"use client";

import Link from "next/link";
import { useLanguageStore } from "@/store/language-store";
import {
  Network,
  Laptop,
  HardDrive,
  Cpu,
  Tv,
  Headphones,
  Smartphone,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

const CATEGORIES = [
  {
    id: "networking",
    label: "Networking",
    icon: Network,
    href: "/products?category=networking",
  },
  {
    id: "computers",
    label: "Computers",
    icon: Laptop,
    href: "/products?category=computers",
  },
  {
    id: "servers",
    label: "Servers & NAS",
    icon: HardDrive,
    href: "/products?category=servers-nas",
  },
  {
    id: "components",
    label: "Components",
    icon: Cpu,
    href: "/products?category=components",
  },
  {
    id: "monitors",
    label: "Monitors",
    icon: Tv,
    href: "/products?category=monitors",
  },
  {
    id: "accessories",
    label: "Accessories",
    icon: Headphones,
    href: "/products?category=accessories",
  },
  {
    id: "smart-iot",
    label: "Smart & IoT",
    icon: Smartphone,
    href: "/products?category=smart-iot",
  },
];

export function HomepageShopByCategory() {
  const t = useLanguageStore((state) => state.t);

  return (
    <section className="w-full max-w-7xl md:max-w-4/5 mx-auto px-4 md:px-0 py-8 sm:py-12 bg-white">
      {/* Header Row */}
      <div className="flex items-center justify-between pb-3 mb-8">
        <h2 className="text-sm sm:text-base font-extrabold text-slate-900 tracking-tight uppercase relative inline-block">
          {t.shopByCategoryTitle}
          <span className="absolute bottom-[-13px] left-0 w-full h-[3px] bg-[#FFD400] rounded-full" />
        </h2>

        {/* Carousel Arrows */}
        <div className="flex items-center gap-2">
          <button
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center transition cursor-pointer"
            aria-label="Previous Category"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center transition cursor-pointer"
            aria-label="Next Category"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Circular Category Pill Grid */}
      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-7 gap-5 text-center">
        {CATEGORIES.map((cat) => {
          const Icon = cat.icon;
          return (
            <Link
              key={cat.id}
              href={cat.href}
              className="group flex flex-col items-center justify-center cursor-pointer"
            >
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-[#F4F5F7] group-hover:bg-[#FFD400]/25 flex items-center justify-center border border-slate-200/80 shadow-2xs group-hover:shadow group-hover:scale-105 transition-all duration-300">
                <Icon className="w-7 h-7 sm:w-8 sm:h-8 text-slate-700 group-hover:text-slate-950 transition-colors stroke-[1.5]" />
              </div>
              <span className="mt-3 text-xs font-bold text-slate-700 group-hover:text-slate-950 transition-colors">
                {cat.label}
              </span>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
