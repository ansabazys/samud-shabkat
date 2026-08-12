"use client";

import Link from "next/link";
import { Star, ChevronLeft, ChevronRight, ShoppingCart } from "lucide-react";
import { useCartStore } from "@/store/cart-store";

const BEST_SELLER_PRODUCTS = [
  {
    id: "bs-1",
    name: "Cisco Catalyst 1000 24-Port Gigabit Switch",
    category: "networking",
    discount: "-12%",
    badge: "BESTSELLER",
    rating: 5,
    price: 1850.0,
    originalPrice: 2100.0,
    inStock: true,
    image:
      "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=500&auto=format&fit=crop",
  },
  {
    id: "bs-2",
    name: "Ubiquiti UniFi Dream Machine Pro (UDM-Pro)",
    category: "networking",
    discount: "-11%",
    badge: "BESTSELLER",
    rating: 5,
    price: 1950.0,
    originalPrice: 2200.0,
    inStock: true,
    image:
      "https://images.unsplash.com/photo-1543512214-318c7553f230?w=500&auto=format&fit=crop",
  },
  {
    id: "bs-3",
    name: 'Apple MacBook Air 15" M3 16GB / 512GB SSD',
    category: "computers",
    discount: "-8%",
    badge: "BESTSELLER",
    rating: 5,
    price: 5699.0,
    originalPrice: 6199.0,
    inStock: true,
    image:
      "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=500&auto=format&fit=crop",
  },
  {
    id: "bs-4",
    name: "Synology DiskStation DS224+ 2-Bay Enterprise NAS",
    category: "networking",
    discount: null,
    badge: "BESTSELLER",
    rating: 5,
    price: 1290.0,
    originalPrice: null,
    inStock: true,
    image:
      "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=500&auto=format&fit=crop",
  },
  {
    id: "bs-5",
    name: "NVIDIA GeForce RTX 4080 Super 16GB GPU",
    category: "components",
    discount: "-7%",
    badge: "BESTSELLER",
    rating: 5,
    price: 4850.0,
    originalPrice: 5200.0,
    inStock: true,
    image:
      "https://images.unsplash.com/photo-1591488320449-011701bb6704?w=500&auto=format&fit=crop",
  },
  {
    id: "bs-6",
    name: "Logitech MX Keys S Wireless Keyboard",
    category: "components",
    discount: "-12%",
    badge: "BESTSELLER",
    rating: 5,
    price: 480.0,
    originalPrice: 550.0,
    inStock: true,
    image:
      "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=500&auto=format&fit=crop",
  },
];

export function HomepageBestSellers() {
  const addItem = useCartStore((state) => state.addItem);

  return (
    <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-0 py-8 sm:py-12 bg-white font-sans">
      {/* Header Row */}
      <div className="flex items-center justify-between pb-3 mb-6">
        <h2 className="text-sm sm:text-base font-extrabold text-slate-900 tracking-tight uppercase relative inline-block">
          Best Seller Products
          <span className="absolute bottom-[-13px] left-0 w-full h-[3px] bg-[#FFD400] rounded-full" />
        </h2>

        {/* Arrow Navigation Controls */}
        <div className="flex items-center gap-2">
          <button
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center transition cursor-pointer"
            aria-label="Previous Best Seller"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center transition cursor-pointer"
            aria-label="Next Best Seller"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 6-Column Product Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 sm:gap-5">
        {BEST_SELLER_PRODUCTS.map((product) => (
          <div
            key={product.id}
            className="group bg-white border border-slate-200/80 hover:border-slate-300 rounded-xl p-3.5 flex flex-col justify-between transition-all duration-300 shadow-2xs hover:shadow-md relative"
          >
            {/* Top Badges */}
            <div className="flex items-center justify-between w-full mb-2 h-5">
              <span className="bg-[#FFD400] text-slate-950 text-[9px] font-black px-1.5 py-0.5 rounded uppercase tracking-wider">
                {product.badge}
              </span>
              {product.discount && (
                <span className="bg-red-600 text-white text-[10px] font-black px-1.5 py-0.5 rounded uppercase tracking-wider">
                  {product.discount}
                </span>
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
                className="w-full h-full object-cover rounded"
              />
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

            {/* Product Title */}
            <Link
              href={`/products/${product.id}`}
              className="text-xs font-semibold text-slate-800 hover:text-amber-600 line-clamp-2 leading-snug transition-colors mb-2 flex-1"
            >
              {product.name}
            </Link>

            {/* Price & Add to Cart */}
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
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
