"use client";

import { useState } from "react";
import Link from "next/link";
import { Star, ShoppingCart, Check, Eye } from "lucide-react";
import { useCartStore } from "@/store/cart-store";

export interface ProductItem {
  id: string;
  name: string;
  category: string;
  brand: string;
  tag?: string;
  discount?: string;
  badge?: string;
  rating: number;
  reviewsCount: number;
  price: number;
  originalPrice?: number;
  inStock: boolean;
  image: string;
  specs?: string[];
}

interface ProductCardProps {
  product: ProductItem;
  layout?: "grid" | "list";
}

export function ProductCard({ product, layout = "grid" }: ProductCardProps) {
  const [isAdded, setIsAdded] = useState(false);
  const addItem = useCartStore((state) => state.addItem);

  const handleAddToCart = () => {
    addItem({
      id: product.id,
      name: product.name,
      slug: product.id,
      sku: product.id,
      price: product.price,
      categoryId: "cat-1",
      brandId: "brand-1",
      isActive: true,
      images: [{ id: "img-1", url: product.image, isPrimary: true }],
    });

    setIsAdded(true);
    setTimeout(() => {
      setIsAdded(false);
    }, 1500);
  };

  const installmentAmount = (product.price / 4).toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  if (layout === "list") {
    return (
      <div className="group bg-white border border-slate-200/90 hover:border-emerald-400 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between transition-all duration-300 shadow-2xs hover:shadow-md gap-4">
        <div className="flex items-center gap-4 sm:gap-6 flex-1">
          <div className="relative w-28 h-28 sm:w-36 sm:h-36 rounded-xl bg-slate-50 border border-slate-100 p-2 shrink-0 overflow-hidden">
            {product.discount && (
              <span className="absolute top-2 left-2 bg-blue-600 text-white text-[9px] font-black px-2 py-0.5 rounded z-10">
                {product.discount}
              </span>
            )}
            <Link
              href={`/products/${product.id}`}
              className="block w-full h-full"
            >
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover rounded-lg group-hover:scale-105 transition-transform duration-500"
              />
            </Link>
          </div>

          <div className="space-y-1.5 flex-1">
            <div className="flex items-center gap-2 text-[11px] font-extrabold uppercase tracking-wider text-slate-400">
              <span>{product.brand}</span>
              <span>•</span>
              <span className="text-emerald-700">{product.category}</span>
            </div>

            <Link
              href={`/products/${product.id}`}
              className="text-sm sm:text-base font-extrabold text-slate-900 hover:text-emerald-700 transition-colors line-clamp-2 leading-snug"
            >
              {product.name}
            </Link>

            <div className="flex items-center gap-1 text-xs text-slate-500">
              <div className="flex items-center gap-0.5">
                {[...Array(product.rating)].map((_, i) => (
                  <Star
                    key={i}
                    className="w-3.5 h-3.5 fill-amber-400 text-amber-400"
                  />
                ))}
              </div>
              <span className="font-bold text-slate-600">
                ({product.reviewsCount} reviews)
              </span>
            </div>

            {product.specs && (
              <div className="flex flex-wrap gap-1.5 pt-1">
                {product.specs.map((spec) => (
                  <span
                    key={spec}
                    className="bg-slate-100 text-slate-700 text-[10px] font-extrabold px-2 py-0.5 rounded"
                  >
                    {spec}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="flex flex-col sm:items-end justify-between sm:border-l sm:border-slate-100 sm:pl-6 pt-3 sm:pt-0 border-t sm:border-t-0 border-slate-100 w-full sm:w-auto shrink-0 gap-3">
          <div className="text-left sm:text-right">
            {product.originalPrice && (
              <span className="text-xs font-semibold text-slate-400 line-through block">
                SAR{" "}
                {product.originalPrice.toLocaleString("en-US", {
                  minimumFractionDigits: 2,
                })}
              </span>
            )}
            <span className="text-lg font-black text-slate-950 block">
              SAR{" "}
              {product.price.toLocaleString("en-US", {
                minimumFractionDigits: 2,
              })}
            </span>
            <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded inline-block mt-1">
              4x SAR {installmentAmount} with Tabby
            </span>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href={`/products/${product.id}`}
              className="p-2.5 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-100 transition"
              title="Quick View"
            >
              <Eye className="w-4 h-4" />
            </Link>
            <button
              onClick={handleAddToCart}
              className={`px-4 py-2.5 rounded-xl font-extrabold text-xs uppercase tracking-wider transition cursor-pointer flex items-center gap-2 ${
                isAdded
                  ? "bg-emerald-600 text-white"
                  : "bg-[#15803d] hover:bg-emerald-700 text-white shadow-xs"
              }`}
            >
              {isAdded ? (
                <>
                  <Check className="w-4 h-4 stroke-[3]" />
                  <span>Added</span>
                </>
              ) : (
                <>
                  <ShoppingCart className="w-4 h-4" />
                  <span>Add to Cart</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="group bg-white border border-slate-200/90 hover:border-emerald-400 rounded-2xl p-3.5 flex flex-col justify-between transition-all duration-300 shadow-2xs hover:shadow-lg relative cursor-pointer">
      {/* Top Image & Badges */}
      <div className="relative aspect-square w-full rounded-xl bg-slate-50 border border-slate-100 p-3 overflow-hidden mb-3">
        <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between z-10">
          {product.badge ? (
            <span className="bg-[#15803d] text-white text-[9px] font-black px-2 py-0.5 rounded uppercase tracking-wider shadow-2xs">
              {product.badge}
            </span>
          ) : (
            <span className="text-[9px] font-extrabold uppercase tracking-wider text-slate-500 bg-white/90 px-2 py-0.5 rounded border border-slate-200">
              {product.brand}
            </span>
          )}
          {product.discount && (
            <span className="bg-blue-600 text-white text-[9px] font-black px-2 py-0.5 rounded uppercase tracking-wider shadow-2xs">
              {product.discount}
            </span>
          )}
        </div>

        <Link href={`/products/${product.id}`} className="block w-full h-full">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover rounded-lg group-hover:scale-106 transition-transform duration-500"
          />
        </Link>
      </div>

      {/* Rating & Category */}
      <div className="flex items-center justify-between gap-1 mb-1.5 text-[11px] font-bold text-slate-500">
        <div className="flex items-center gap-0.5">
          {[...Array(product.rating)].map((_, i) => (
            <Star key={i} className="w-3 h-3 fill-amber-400 text-amber-400" />
          ))}
          <span className="ml-1 text-[10px] font-semibold text-slate-400">
            ({product.reviewsCount})
          </span>
        </div>
        <span className="text-[10px] font-black uppercase tracking-wider text-emerald-700">
          {product.category}
        </span>
      </div>

      {/* Product Title */}
      <Link
        href={`/products/${product.id}`}
        className="text-xs sm:text-sm font-bold text-slate-900 hover:text-emerald-700 line-clamp-2 leading-snug transition-colors mb-3 flex-1"
      >
        {product.name}
      </Link>

      {/* Price & Cart Actions */}
      <div className="pt-2.5 border-t border-slate-100 mt-auto space-y-2">
        <div className="flex items-baseline justify-between">
          <div className="flex flex-col">
            {product.originalPrice && (
              <span className="text-[10px] font-semibold text-slate-400 line-through">
                SAR{" "}
                {product.originalPrice.toLocaleString("en-US", {
                  minimumFractionDigits: 2,
                })}
              </span>
            )}
            <span className="text-xs sm:text-sm font-black text-slate-950">
              SAR{" "}
              {product.price.toLocaleString("en-US", {
                minimumFractionDigits: 2,
              })}
            </span>
          </div>

          <button
            onClick={handleAddToCart}
            className={`p-2 rounded-xl transition-all cursor-pointer flex items-center justify-center active:scale-90 ${
              isAdded
                ? "bg-emerald-600 text-white"
                : "bg-[#15803d] hover:bg-emerald-700 text-white shadow-xs"
            }`}
            title={isAdded ? "Added to Cart" : "Add to Cart"}
          >
            {isAdded ? (
              <Check className="w-4 h-4 stroke-[3]" />
            ) : (
              <ShoppingCart className="w-4 h-4" />
            )}
          </button>
        </div>

        {/* Tabby Installment Note */}
        <div className="text-[9.5px] font-bold text-slate-500 bg-slate-50 border border-slate-200/60 px-2 py-1 rounded text-center">
          Or 4x{" "}
          <span className="font-extrabold text-emerald-700">
            SAR {installmentAmount}
          </span>{" "}
          with Tabby
        </div>
      </div>
    </div>
  );
}
