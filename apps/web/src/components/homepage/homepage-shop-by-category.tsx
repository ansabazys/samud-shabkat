"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useLanguageStore } from "@/store/language-store";
import {
  Layers,
  ChevronLeft,
  ChevronRight,
  Laptop,
  Network,
  HardDrive,
  Cpu,
  Tv,
  Headphones,
  Smartphone,
  Server,
  FolderTree,
} from "lucide-react";
import { fetchCategories, type Category } from "@/lib/api";

const ICON_MAP: Record<string, any> = {
  networking: Network,
  computers: Laptop,
  servers: Server,
  "storage-nas": HardDrive,
  components: Cpu,
  monitors: Tv,
  accessories: Headphones,
  "smart-iot": Smartphone,
};

export function HomepageShopByCategory() {
  const t = useLanguageStore((state) => state.t);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCategories()
      .then((data) => setCategories(Array.isArray(data) ? data : []))
      .catch((err) => {
        console.error("Failed to load categories for homepage:", err);
        setCategories([]);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <section className="w-full max-w-7xl md:max-w-4/5 mx-auto px-4 md:px-0 py-8 sm:py-12 bg-white font-sans">
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
      {loading ? (
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-7 gap-5 text-center">
          {[...Array(7)].map((_, i) => (
            <div key={i} className="flex flex-col items-center justify-center space-y-3">
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-slate-100 animate-pulse border border-slate-200" />
              <div className="w-16 h-3.5 bg-slate-100 rounded animate-pulse" />
            </div>
          ))}
        </div>
      ) : categories.length === 0 ? (
        <div className="py-8 text-center text-xs text-slate-500 font-medium">
          No categories configured yet. Add categories in the backoffice admin portal.
        </div>
      ) : (
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-7 gap-5 text-center">
          {categories.map((cat) => {
            const Icon = ICON_MAP[cat.slug] || FolderTree;

            return (
              <Link
                key={cat.id}
                href={`/products?category=${encodeURIComponent(cat.slug || cat.id)}`}
                className="group flex flex-col items-center justify-center cursor-pointer"
              >
                <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-[#F4F5F7] group-hover:bg-[#FFD400]/25 flex items-center justify-center border border-slate-200/80 shadow-2xs group-hover:shadow group-hover:scale-105 transition-all duration-300 overflow-hidden relative">
                  {cat.imageUrl ? (
                    <img
                      src={cat.imageUrl}
                      alt={cat.name}
                      className="w-full h-full object-cover p-2 rounded-full"
                    />
                  ) : (
                    <Icon className="w-7 h-7 sm:w-8 sm:h-8 text-slate-700 group-hover:text-slate-950 transition-colors stroke-[1.5]" />
                  )}
                </div>
                <span className="mt-3 text-xs font-bold text-slate-700 group-hover:text-slate-950 transition-colors line-clamp-1">
                  {cat.name}
                </span>
              </Link>
            );
          })}
        </div>
      )}
    </section>
  );
}
