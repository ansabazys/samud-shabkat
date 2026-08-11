"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { HomepageProductCard } from "./homepage-product-card";
import type { Product } from "@/lib/api";

const popularProducts: Product[] = [
  {
    id: "prod-5",
    name: "ASUS ProArt Display PA32UCX-P 32-inch 4K HDR Monitor",
    slug: "asus-proart-pa32ucx-p",
    sku: "ASUS-PA32UCX-P",
    shortDescription:
      "Mini-LED backlight reference display engineered for studio production with 1152 dimming zones.",
    price: 7200,
    categoryId: "cat-monitors",
    brandId: "brand-asus",
    isActive: true,
    category: {
      id: "cat-monitors",
      name: "Monitors & Displays",
      slug: "monitors",
    },
    brand: { id: "brand-asus", name: "ASUS", slug: "asus" },
    availableStock: 15,
    images: [
      {
        id: "img-5",
        url: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=800&auto=format&fit=crop",
        isPrimary: true,
      },
    ],
  },
  {
    id: "prod-6",
    name: "10G SFP+ Single-Mode LC Fiber Transceiver 10km Module",
    slug: "sfp-plus-10g-lr",
    sku: "SFP-10G-LR-SM",
    shortDescription:
      "Duplex LC 1310nm 10GBASE-LR optical transceiver module fully compatible with Cisco & HP.",
    price: 280,
    categoryId: "cat-fiber",
    brandId: "brand-optilink",
    isActive: true,
    category: {
      id: "cat-fiber",
      name: "Fiber Optics",
      slug: "fiber-optics",
    },
    brand: { id: "brand-optilink", name: "OptiLink", slug: "optilink" },
    availableStock: 250,
    images: [
      {
        id: "img-6",
        url: "https://images.unsplash.com/photo-1517420784984-2244be3057d6?w=800&auto=format&fit=crop",
        isPrimary: true,
      },
    ],
  },
  {
    id: "prod-7",
    name: "Ubiquiti UniFi Dream Machine Special Edition (UDM-SE)",
    slug: "ubiquiti-udm-se",
    sku: "UDM-SE-US",
    shortDescription:
      "All-in-one router, security gateway, PoE switch, and NVR with 2.5G WAN and 10G SFP+.",
    price: 2150,
    categoryId: "cat-1",
    brandId: "brand-ubiquiti",
    isActive: true,
    category: {
      id: "cat-1",
      name: "Switches & Routers",
      slug: "switches-routers",
    },
    brand: { id: "brand-ubiquiti", name: "Ubiquiti", slug: "ubiquiti" },
    availableStock: 30,
    images: [
      {
        id: "img-7",
        url: "https://images.unsplash.com/photo-1606904825846-647eb07f5be2?w=800&auto=format&fit=crop",
        isPrimary: true,
      },
    ],
  },
  {
    id: "prod-8",
    name: "Cisco Catalyst 9200 24-Port PoE+ Managed Switch",
    slug: "cisco-catalyst-9200-24p",
    sku: "C9200-24P-E",
    shortDescription:
      "Essential enterprise switch with 24 PoE+ ports, redundant power supply and stacking support.",
    price: 6800,
    categoryId: "cat-1",
    brandId: "brand-cisco",
    isActive: true,
    category: {
      id: "cat-1",
      name: "Switches & Routers",
      slug: "switches-routers",
    },
    brand: { id: "brand-cisco", name: "Cisco", slug: "cisco" },
    availableStock: 22,
    images: [
      {
        id: "img-8",
        url: "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=800&auto=format&fit=crop",
        isPrimary: true,
      },
    ],
  },
];

export function HomepagePopular() {
  return (
    <section className="py-16 bg-[#FAF9F6] border-b border-neutral-200/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <span className="text-[11px] uppercase tracking-widest font-mono font-bold text-cyan-700 block mb-1">
              TRENDING SELECTION
            </span>
            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight font-sans">
              Popular Right Now
            </h2>
            <p className="text-xs text-slate-500 mt-1 font-normal">
              Most requested hardware and accessories across GCC procurement.
            </p>
          </div>

          <Link
            href="/products?sort=popular"
            className="text-xs font-semibold text-slate-800 hover:text-cyan-700 flex items-center gap-1.5 transition"
          >
            Explore Popular Hardware <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {popularProducts.map((prod) => (
            <HomepageProductCard key={prod.id} product={prod} />
          ))}
        </div>
      </div>
    </section>
  );
}
