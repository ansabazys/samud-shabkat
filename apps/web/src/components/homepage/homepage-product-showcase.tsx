"use client";

import { useState } from "react";
import Link from "next/link";
import { Star, ChevronLeft, ChevronRight, ShoppingCart } from "lucide-react";
import { useCartStore } from "@/store/cart-store";

const TABS = [
  { id: "networking", label: "Networking & Hardware" },
  { id: "computers", label: "Computers & Laptops" },
  { id: "components", label: "Components & Peripherals" },
];

const SHOWCASE_PRODUCTS = [
  {
    id: "prod-net-1",
    name: "Cisco Catalyst 9300 48-Port Managed Switch",
    category: "networking",
    discount: "-8%",
    rating: 5,
    price: 4250.0,
    originalPrice: 4600.0,
    inStock: true,
    image:
      "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=500&auto=format&fit=crop",
  },
  {
    id: "prod-net-2",
    name: "Ubiquiti UniFi 6 Pro WiFi 6 Access Point",
    category: "networking",
    discount: "-5%",
    rating: 5,
    price: 680.0,
    originalPrice: 715.0,
    inStock: true,
    image:
      "https://images.unsplash.com/photo-1543512214-318c7553f230?w=500&auto=format&fit=crop",
  },
  {
    id: "prod-net-3",
    name: "Synology DiskStation DS923+ 4-Bay NAS Enclosure",
    category: "networking",
    discount: null,
    rating: 5,
    price: 2150.0,
    originalPrice: null,
    inStock: false,
    image:
      "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=500&auto=format&fit=crop",
  },
  {
    id: "prod-comp-1",
    name: 'Apple MacBook Pro 16" M3 Max 36GB / 1TB SSD',
    category: "computers",
    discount: null,
    rating: 5,
    price: 12499.0,
    originalPrice: null,
    inStock: true,
    image:
      "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=500&auto=format&fit=crop",
  },
  {
    id: "prod-comp-2",
    name: "Dell XPS 15 Ultra 9 32GB RAM RTX 4070 Laptop",
    category: "computers",
    discount: "-6%",
    rating: 5,
    price: 8450.0,
    originalPrice: 8990.0,
    inStock: true,
    image:
      "https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=500&auto=format&fit=crop",
  },
  {
    id: "prod-comp-3",
    name: "Lenovo ThinkCentre M70q Tiny Business Desktop",
    category: "computers",
    discount: "-4%",
    rating: 5,
    price: 2890.0,
    originalPrice: 3010.0,
    inStock: true,
    image:
      "https://images.unsplash.com/photo-1587831990711-23ca6441447b?w=500&auto=format&fit=crop",
  },
  {
    id: "prod-parts-1",
    name: "NVIDIA GeForce RTX 4090 24GB Graphics Card",
    category: "components",
    discount: "-4%",
    rating: 5,
    price: 7850.0,
    originalPrice: 8200.0,
    inStock: true,
    image:
      "https://images.unsplash.com/photo-1591488320449-011701bb6704?w=500&auto=format&fit=crop",
  },
  {
    id: "prod-parts-2",
    name: 'Dell UltraSharp 32" 4K USB-C Hub Monitor (U3223QE)',
    category: "components",
    discount: null,
    rating: 5,
    price: 3250.0,
    originalPrice: null,
    inStock: true,
    image:
      "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=500&auto=format&fit=crop",
  },
  {
    id: "prod-parts-3",
    name: "Logitech MX Master 3S Wireless Performance Mouse",
    category: "components",
    discount: "-10%",
    rating: 5,
    price: 410.0,
    originalPrice: 455.0,
    inStock: true,
    image:
      "https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=500&auto=format&fit=crop",
  },
];

export function HomepageProductShowcase() {
  const [activeTab, setActiveTab] = useState("networking");
  const addItem = useCartStore((state) => state.addItem);

  const displayedProducts = SHOWCASE_PRODUCTS.filter(
    (p) => activeTab === "networking" || p.category === activeTab,
  ).slice(0, 6);

  return (
    <section className="w-full max-w-7xl md:max-w-4/5 mx-auto px-4 md:px-0 py-8 sm:py-12 bg-white">
      {/* Tab Navigation & Carousel Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-3 mb-6">
        {/* Left Category Tabs */}
        <div className="flex items-center gap-6 sm:gap-8 overflow-x-auto no-scrollbar">
          {TABS.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`text-xs sm:text-sm font-bold tracking-tight pb-3 transition-all relative whitespace-nowrap cursor-pointer ${
                  isActive
                    ? "text-slate-900 font-extrabold"
                    : "text-slate-500 hover:text-slate-800 font-semibold"
                }`}
              >
                {tab.label}
                {isActive && (
                  <span className="absolute bottom-0 left-0 right-0 h-[3px] bg-[#FFD400] rounded-full" />
                )}
              </button>
            );
          })}
        </div>

        {/* Right Arrows */}
        <div className="flex items-center gap-2 self-end sm:self-center">
          <button
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center transition cursor-pointer"
            aria-label="Previous Products"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center transition cursor-pointer"
            aria-label="Next Products"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 6-Column Product Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 sm:gap-5">
        {displayedProducts.map((product) => (
          <div
            key={product.id}
            className="group bg-white border border-slate-200/80 hover:border-slate-300 rounded-xl p-3.5 flex flex-col justify-between transition-all duration-300 shadow-2xs hover:shadow-md relative"
          >
            {/* Top Badges */}
            <div className="flex items-center justify-between w-full mb-2 h-5">
              {product.discount ? (
                <span className="bg-red-600 text-white text-[10px] font-black px-1.5 py-0.5 rounded uppercase tracking-wider">
                  {product.discount}
                </span>
              ) : (
                <span />
              )}
            </div>

            {/* Product Image */}
            <Link
              href={`/products/${product.id}`}
              className="block aspect-square w-full rounded-lg bg-slate-50 border border-slate-100/80 p-2 overflow-hidden relative mb-3 group-hover:scale-105 transition-transform duration-300"
            >
              <img
                src={product.image}
                alt={product.name}
                className={`w-full h-full object-cover rounded ${
                  !product.inStock ? "opacity-35" : ""
                }`}
              />
              {!product.inStock && (
                <div className="absolute inset-0 flex items-center justify-center bg-slate-900/60 rounded backdrop-blur-[1px]">
                  <span className="text-[9px] font-black text-white px-2 py-1 bg-slate-950 rounded uppercase tracking-wider">
                    OUT OF STOCK
                  </span>
                </div>
              )}
            </Link>

            {/* Rating Stars */}
            <div className="flex items-center gap-0.5 mb-1.5">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className="w-3 h-3 fill-[#FFD400] text-[#FFD400]"
                />
              ))}
            </div>

            {/* Product Name */}
            <Link
              href={`/products/${product.id}`}
              className="text-xs font-semibold text-slate-800 hover:text-amber-600 line-clamp-2 leading-snug transition-colors mb-2 flex-1"
            >
              {product.name}
            </Link>

            {/* Price & Add to Cart Action */}
            <div className="flex items-center justify-between pt-2 border-t border-slate-100 mt-auto">
              <div className="flex flex-col">
                {product.originalPrice && (
                  <span className="text-[10px] font-medium text-slate-400 line-through">
                    SAR {product.originalPrice.toFixed(2)}
                  </span>
                )}
                <span className="text-xs font-extrabold text-slate-900">
                  SAR {product.price.toFixed(2)}
                </span>
              </div>

              {product.inStock && (
                <button
                  onClick={() =>
                    addItem({
                      id: product.id,
                      name: product.name,
                      slug: product.id,
                      sku: product.id,
                      price: product.price,
                      categoryId: "cat-1",
                      brandId: "brand-1",
                      isActive: true,
                      images: [
                        { id: "img-1", url: product.image, isPrimary: true },
                      ],
                    })
                  }
                  className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white transition cursor-pointer"
                  title="Add to cart"
                >
                  <ShoppingCart className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
