"use client";

import { useState, use } from "react";
import { ProductCard } from "@/components/product/product-card";
import type { Product } from "@/lib/api";
import { Search, Filter, SlidersHorizontal, Check } from "lucide-react";

const initialProducts: Product[] = [
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
    name: "10G SFP+ Single-Mode LC Fiber Transceiver 10km",
    slug: "sfp-plus-10g-lr",
    sku: "SFP-10G-LR-SM",
    shortDescription:
      "Duplex LC 1310nm 10GBASE-LR optical transceiver module for Cisco & HP switches.",
    price: 280,
    categoryId: "cat-2",
    brandId: "brand-generic",
    isActive: true,
    category: {
      id: "cat-2",
      name: "Fiber Optic Solutions",
      slug: "fiber-optics",
    },
    brand: { id: "brand-generic", name: "OptiLink", slug: "optilink" },
    images: [
      {
        id: "img-4",
        url: "https://images.unsplash.com/photo-1517420784984-2244be3057d6?w=800&auto=format&fit=crop",
        isPrimary: true,
      },
    ],
  },
];

export default function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ search?: string; category?: string }>;
}) {
  const resolvedParams = use(searchParams);
  const [search, setSearch] = useState(resolvedParams.search || "");
  const [selectedCategory, setSelectedCategory] = useState(
    resolvedParams.category || "all",
  );
  const [sortBy, setSortBy] = useState<"featured" | "price-low" | "price-high">(
    "featured",
  );

  const categories = [
    { id: "all", name: "All Categories" },
    { id: "switches-routers", name: "Switches & Routers" },
    { id: "fiber-optics", name: "Fiber Optic Solutions" },
    { id: "wireless-ap", name: "Wireless Access Points" },
  ];

  const filteredProducts = initialProducts
    .filter((product) => {
      const matchesSearch =
        !search ||
        product.name.toLowerCase().includes(search.toLowerCase()) ||
        product.sku.toLowerCase().includes(search.toLowerCase());

      const matchesCategory =
        selectedCategory === "all" ||
        product.category?.slug === selectedCategory;

      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      if (sortBy === "price-low") return Number(a.price) - Number(b.price);
      if (sortBy === "price-high") return Number(b.price) - Number(a.price);
      return 0;
    });

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">
            Product Catalog
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Showing {filteredProducts.length} hardware items in stock
          </p>
        </div>

        {/* Search & Sort Controls */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative flex-1 sm:w-64">
            <input
              type="text"
              placeholder="Filter catalog..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-4 pr-10 py-2.5 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-cyan-500"
            />
            <Search className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2" />
          </div>

          <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-300">
            <SlidersHorizontal className="w-3.5 h-3.5 text-cyan-400" />
            <select
              value={sortBy}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                setSortBy(
                  e.target.value as "featured" | "price-low" | "price-high",
                )
              }
              className="bg-transparent text-white focus:outline-none cursor-pointer"
            >
              <option value="featured" className="bg-slate-900">
                Sort by: Featured
              </option>
              <option value="price-low" className="bg-slate-900">
                Price: Low to High
              </option>
              <option value="price-high" className="bg-slate-900">
                Price: High to Low
              </option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Grid with Filter Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar */}
        <div className="space-y-6">
          <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-5 space-y-4">
            <div className="flex items-center gap-2 text-sm font-bold text-white pb-3 border-b border-slate-800">
              <Filter className="w-4 h-4 text-cyan-400" /> Categories
            </div>
            <div className="space-y-1">
              {categories.map((cat) => {
                const isSelected = selectedCategory === cat.id;
                return (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`w-full text-left px-3 py-2 rounded-xl text-xs font-medium transition flex items-center justify-between ${
                      isSelected
                        ? "bg-cyan-950/80 border border-cyan-500/40 text-cyan-300 font-semibold"
                        : "text-slate-400 hover:bg-slate-800 hover:text-white"
                    }`}
                  >
                    <span>{cat.name}</span>
                    {isSelected && (
                      <Check className="w-3.5 h-3.5 text-cyan-400" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Product Grid */}
        <div className="lg:col-span-3">
          {filteredProducts.length === 0 ? (
            <div className="text-center py-20 bg-slate-900/40 rounded-2xl border border-slate-800 space-y-3">
              <p className="text-base text-slate-300 font-medium">
                No products match your filter criteria.
              </p>
              <button
                onClick={() => {
                  setSearch("");
                  setSelectedCategory("all");
                }}
                className="text-xs text-cyan-400 hover:underline"
              >
                Reset all filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
