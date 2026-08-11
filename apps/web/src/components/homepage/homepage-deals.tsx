"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { HomepageProductCard } from "./homepage-product-card";
import type { Product } from "@/lib/api";

const dealProducts: Product[] = [
  {
    id: "prod-9",
    name: "Cisco Catalyst 9300 24-Port UPOE Managed Switch",
    slug: "cisco-catalyst-9300-24u",
    sku: "C9300-24U-A",
    shortDescription:
      "Stackable switch with 24 60W UPOE ports, dual modular power supply slot and Network Advantage license.",
    price: 11200,
    categoryId: "cat-1",
    brandId: "brand-cisco",
    isActive: true,
    category: {
      id: "cat-1",
      name: "Switches & Routers",
      slug: "switches-routers",
    },
    brand: { id: "brand-cisco", name: "Cisco", slug: "cisco" },
    availableStock: 18,
    images: [
      {
        id: "img-9",
        url: "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=800&auto=format&fit=crop",
        isPrimary: true,
      },
    ],
  },
  {
    id: "prod-10",
    name: "MikroTik Cloud Router Switch CRS354-48P-4S+2Q+RM",
    slug: "mikrotik-crs354-48p",
    sku: "CRS354-48P-4S+2Q",
    shortDescription:
      "High-power 48-port Gigabit PoE+ switch with 4x 10G SFP+ ports and 2x 40G QSFP+ uplinks.",
    price: 3400,
    categoryId: "cat-1",
    brandId: "brand-mikrotik",
    isActive: true,
    category: {
      id: "cat-1",
      name: "Switches & Routers",
      slug: "switches-routers",
    },
    brand: { id: "brand-mikrotik", name: "MikroTik", slug: "mikrotik" },
    availableStock: 14,
    images: [
      {
        id: "img-10",
        url: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&auto=format&fit=crop",
        isPrimary: true,
      },
    ],
  },
  {
    id: "prod-11",
    name: "Ubiquiti UniFi Enterprise Campus Switch 48 PoE",
    slug: "ubiquiti-enterprise-48-poe",
    sku: "SWITCH-ENT-48-POE",
    shortDescription:
      "Managed Layer 3 switch with 48x 2.5G PoE+ ports and 4x 10G SFP+ ports with UniFi controller.",
    price: 5400,
    categoryId: "cat-1",
    brandId: "brand-ubiquiti",
    isActive: true,
    category: {
      id: "cat-1",
      name: "Switches & Routers",
      slug: "switches-routers",
    },
    brand: { id: "brand-ubiquiti", name: "Ubiquiti", slug: "ubiquiti" },
    availableStock: 10,
    images: [
      {
        id: "img-11",
        url: "https://images.unsplash.com/photo-1606904825846-647eb07f5be2?w=800&auto=format&fit=crop",
        isPrimary: true,
      },
    ],
  },
  {
    id: "prod-12",
    name: "Dell UltraSharp 34 Curved Thunderbolt 4 Hub Monitor",
    slug: "dell-ultrasharp-34-curved",
    sku: "DELL-U3423WE",
    shortDescription:
      "WQHD 3440 x 1440 curved IPS Black display with integrated 90W USB-C hub and RJ45 ethernet.",
    price: 3950,
    categoryId: "cat-monitors",
    brandId: "brand-dell",
    isActive: true,
    category: {
      id: "cat-monitors",
      name: "Monitors & Displays",
      slug: "monitors",
    },
    brand: { id: "brand-dell", name: "Dell", slug: "dell" },
    availableStock: 16,
    images: [
      {
        id: "img-12",
        url: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=800&auto=format&fit=crop",
        isPrimary: true,
      },
    ],
  },
];

export function HomepageDeals() {
  return (
    <section className="py-16 bg-[#FAF9F6] border-b border-neutral-200/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <span className="text-[11px] uppercase tracking-widest font-mono font-bold text-cyan-700 block mb-1">
              PROMOTIONAL SAVINGS
            </span>
            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight font-sans">
              Weekly Picks
            </h2>
            <p className="text-xs text-slate-500 mt-1 font-normal">
              Better prices on technology worth having.
            </p>
          </div>

          <Link
            href="/products?deals=true"
            className="text-xs font-semibold text-slate-800 hover:text-cyan-700 flex items-center gap-1.5 transition"
          >
            View All Weekly Deals <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* 4-Column Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {dealProducts.map((prod) => (
            <HomepageProductCard key={prod.id} product={prod} />
          ))}
        </div>
      </div>
    </section>
  );
}
