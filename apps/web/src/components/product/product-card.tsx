"use client";

import Link from "next/link";
import { ShoppingBag, ArrowUpRight } from "lucide-react";
import type { Product } from "@/lib/api";
import { useCartStore } from "@/store/cart-store";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const addItem = useCartStore((state) => state.addItem);

  const primaryImage =
    product.images?.find((img) => img.isPrimary)?.url ||
    product.images?.[0]?.url ||
    "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=500&auto=format&fit=crop";

  return (
    <div className="group relative bg-slate-900/70 border border-slate-800 rounded-2xl overflow-hidden hover:border-cyan-500/50 hover:shadow-xl hover:shadow-cyan-500/10 transition-all duration-300 flex flex-col">
      {/* Image Container */}
      <div className="relative aspect-video sm:aspect-square overflow-hidden bg-slate-950/80">
        <img
          src={primaryImage}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-60" />

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
          {product.category && (
            <span className="px-2.5 py-1 rounded-md bg-slate-900/90 backdrop-blur-md border border-slate-700/80 text-[10px] font-semibold text-cyan-400 uppercase tracking-wider">
              {product.category.name}
            </span>
          )}
          {product.brand && (
            <span className="px-2.5 py-1 rounded-md bg-slate-900/90 backdrop-blur-md border border-slate-700/80 text-[10px] font-semibold text-indigo-300 uppercase tracking-wider">
              {product.brand.name}
            </span>
          )}
        </div>
      </div>

      {/* Product Content */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        <div>
          <div className="text-[11px] font-mono text-slate-400 mb-1">
            SKU: {product.sku}
          </div>
          <Link
            href={`/products/${product.id}`}
            className="group-hover:text-cyan-400 transition"
          >
            <h3 className="font-bold text-white text-base line-clamp-2 leading-snug">
              {product.name}
            </h3>
          </Link>
          {product.shortDescription && (
            <p className="text-xs text-slate-400 line-clamp-2 mt-2 leading-relaxed">
              {product.shortDescription}
            </p>
          )}
        </div>

        {/* Price & Action */}
        <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between">
          <div>
            <span className="text-[10px] text-slate-400 uppercase font-semibold block">
              Wholesale Price
            </span>
            <span className="text-lg font-bold text-cyan-400">
              AED {Number(product.price).toLocaleString()}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => addItem(product)}
              className="p-2.5 rounded-xl bg-cyan-600/20 hover:bg-cyan-500 text-cyan-300 hover:text-white border border-cyan-500/30 transition flex items-center justify-center"
              title="Add to Cart"
            >
              <ShoppingBag className="w-4 h-4" />
            </button>
            <Link
              href={`/products/${product.id}`}
              className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition flex items-center justify-center"
              title="View Details"
            >
              <ArrowUpRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
