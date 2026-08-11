"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { HomepageProductCard } from "./homepage-product-card";
import type { Product } from "@/lib/api";

const sampleFeaturedProducts: Product[] = [
  {
    id: "prod-1",
    name: "Cisco Catalyst 9300 48-Port PoE+ Managed Switch",
    slug: "cisco-catalyst-9300-48p",
    sku: "C9300-48P-A",
    shortDescription:
      "Stackable enterprise switch with 48 PoE+ ports, UPOE capability and dual power supply support.",
    price: 14500,
    categoryId: "cat-1",
    brandId: "brand-cisco",
    isActive: true,
    category: {
      id: "cat-1",
      name: "Switches & Routers",
      slug: "switches-routers",
    },
    brand: { id: "brand-cisco", name: "Cisco", slug: "cisco" },
    availableStock: 45,
    images: [
      {
        id: "img-1",
        url: "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=800&auto=format&fit=crop",
        isPrimary: true,
      },
    ],
  },
  {
    id: "prod-2",
    name: "MikroTik CCR2216-1G-12XS-2XQ 100G Router",
    slug: "mikrotik-ccr2216",
    sku: "CCR2216-12XS-2XQ",
    shortDescription:
      "Flagship Cloud Core Router with 16-core Marvell CPU, 2x 100G QSFP28 ports and 12x 25G SFP28.",
    price: 8900,
    categoryId: "cat-1",
    brandId: "brand-mikrotik",
    isActive: true,
    category: {
      id: "cat-1",
      name: "Switches & Routers",
      slug: "switches-routers",
    },
    brand: { id: "brand-mikrotik", name: "MikroTik", slug: "mikrotik" },
    availableStock: 12,
    images: [
      {
        id: "img-2",
        url: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&auto=format&fit=crop",
        isPrimary: true,
      },
    ],
  },
  {
    id: "prod-3",
    name: "Ubiquiti UniFi U7 Pro Wi-Fi 7 Access Point",
    slug: "ubiquiti-u7-pro",
    sku: "U7-PRO-US",
    shortDescription:
      "Ceiling-mounted Wi-Fi 7 access point with 6 GHz support, 9.3 Gbps throughput and 2.5G PoE+.",
    price: 1250,
    categoryId: "cat-4",
    brandId: "brand-ubiquiti",
    isActive: true,
    category: {
      id: "cat-4",
      name: "Wireless Access Points",
      slug: "wireless-ap",
    },
    brand: { id: "brand-ubiquiti", name: "Ubiquiti", slug: "ubiquiti" },
    availableStock: 80,
    images: [
      {
        id: "img-3",
        url: "https://images.unsplash.com/photo-1606904825846-647eb07f5be2?w=800&auto=format&fit=crop",
        isPrimary: true,
      },
    ],
  },
  {
    id: "prod-4",
    name: "Dell XPS 16 Workstation Laptop (Intel Core Ultra 9)",
    slug: "dell-xps-16-ultra-9",
    sku: "DELL-XPS16-U9-64GB",
    shortDescription:
      "Flagship workstation laptop with 64GB LPDDR5X RAM, RTX 4070 8GB & 4K OLED Touchscreen.",
    price: 9850,
    categoryId: "cat-comp",
    brandId: "brand-dell",
    isActive: true,
    category: {
      id: "cat-comp",
      name: "Computers",
      slug: "computers",
    },
    brand: { id: "brand-dell", name: "Dell", slug: "dell" },
    availableStock: 8,
    images: [
      {
        id: "img-4",
        url: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&auto=format&fit=crop",
        isPrimary: true,
      },
    ],
  },
];

export function HomepageProductGrid() {
  return (
    <section className="py-16 bg-[#FAF9F6] border-b border-neutral-200/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <span className="text-[11px] uppercase tracking-widest font-mono font-bold text-cyan-700 block mb-1">
              SPOTLIGHT HARDWARE
            </span>
            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight font-sans">
              New & Noteworthy
            </h2>
            <p className="text-xs text-slate-500 mt-1 font-normal">
              Fresh technology worth a closer look for your infrastructure.
            </p>
          </div>

          <Link
            href="/products"
            className="text-xs font-semibold text-slate-800 hover:text-cyan-700 flex items-center gap-1.5 transition"
          >
            Browse Full Catalog <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* 4-Column Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {sampleFeaturedProducts.map((prod) => (
            <HomepageProductCard key={prod.id} product={prod} />
          ))}
        </div>
      </div>
    </section>
  );
}
