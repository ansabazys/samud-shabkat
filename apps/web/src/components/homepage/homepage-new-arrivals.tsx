"use client";

import Link from "next/link";
import { Star, ChevronLeft, ChevronRight, ShoppingCart } from "lucide-react";
import { useCartStore } from "@/store/cart-store";

const NEW_ARRIVAL_PRODUCTS = [
  {
    id: "na-1",
    name: "Ubiquiti UniFi Express Pocket Cloud Gateway",
    category: "networking",
    discount: null,
    badge: "NEW",
    rating: 5,
    price: 780.0,
    originalPrice: null,
    inStock: true,
    image:
      "https://images.unsplash.com/photo-1543512214-318c7553f230?w=500&auto=format&fit=crop",
  },
  {
    id: "na-2",
    name: 'Apple iPad Pro 13" M4 256GB WiFi Space Black',
    category: "computers",
    discount: null,
    badge: "NEW",
    rating: 5,
    price: 4899.0,
    originalPrice: null,
    inStock: true,
    image:
      "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=500&auto=format&fit=crop",
  },
  {
    id: "na-3",
    name: 'Asus ROG Swift 32" OLED 240Hz 4K Monitor',
    category: "monitors",
    discount: "-5%",
    badge: "NEW",
    rating: 5,
    price: 4250.0,
    originalPrice: 4500.0,
    inStock: true,
    image:
      "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=500&auto=format&fit=crop",
  },
  {
    id: "na-4",
    name: "Cisco Business 250 Series 16-Port Smart Switch",
    category: "networking",
    discount: null,
    badge: "NEW",
    rating: 5,
    price: 1150.0,
    originalPrice: null,
    inStock: true,
    image:
      "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=500&auto=format&fit=crop",
  },
  {
    id: "na-5",
    name: "Synology DiskStation DS1823xs+ 8-Bay NAS",
    category: "networking",
    discount: null,
    badge: "NEW",
    rating: 5,
    price: 6450.0,
    originalPrice: null,
    inStock: true,
    image:
      "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=500&auto=format&fit=crop",
  },
  {
    id: "na-6",
    name: "Keychron Q1 Max Wireless Custom Keyboard",
    category: "components",
    discount: null,
    badge: "NEW",
    rating: 5,
    price: 820.0,
    originalPrice: null,
    inStock: true,
    image:
      "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=500&auto=format&fit=crop",
  },
];

export function HomepageNewArrivals() {
  const addItem = useCartStore((state) => state.addItem);

  return (
    <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-0 py-8 sm:py-12 bg-white font-sans">
      {/* Header Row */}
      <div className="flex items-center justify-between pb-3 mb-6">
        <h2 className="text-sm sm:text-base font-extrabold text-slate-900 tracking-tight uppercase relative inline-block">
          New Arrivals
          <span className="absolute bottom-[-13px] left-0 w-full h-[3px] bg-[#FFD400] rounded-full" />
        </h2>

        {/* Arrow Navigation Controls */}
        <div className="flex items-center gap-2">
          <button
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center transition cursor-pointer"
            aria-label="Previous New Arrival"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center transition cursor-pointer"
            aria-label="Next New Arrival"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 6-Column Product Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 sm:gap-5">
        {NEW_ARRIVAL_PRODUCTS.map((product) => (
          <div
            key={product.id}
            className="group bg-white border border-slate-200/80 hover:border-slate-300 rounded-xl p-3.5 flex flex-col justify-between transition-all duration-300 shadow-2xs hover:shadow-md relative"
          >
            {/* Top Badges */}
            <div className="flex items-center justify-between w-full mb-2 h-5">
              <span className="bg-emerald-600 text-white text-[9px] font-black px-1.5 py-0.5 rounded uppercase tracking-wider">
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
