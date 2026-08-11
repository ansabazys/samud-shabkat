"use client";

import Link from "next/link";
import { ShoppingBag, Check, AlertCircle } from "lucide-react";
import type { Product } from "@/lib/api";
import { useCartStore } from "@/store/cart-store";
import { useState } from "react";

interface HomepageProductCardProps {
  product: Product;
}

export function HomepageProductCard({ product }: HomepageProductCardProps) {
  const addItem = useCartStore((state) => state.addItem);
  const [isAdded, setIsAdded] = useState(false);

  const primaryImage =
    product.images?.find((img) => img.isPrimary)?.url ||
    product.images?.[0]?.url ||
    "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=600&auto=format&fit=crop";

  const brandName = product.brand?.name || "Samud";
  const stock = product.availableStock ?? 45;
  const isLowStock = stock > 0 && stock <= 10;
  const isOutOfStock = stock <= 0;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    addItem(product, 1);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 1500);
  };

  return (
    <div className="group bg-white border border-neutral-200/80 hover:border-neutral-300 rounded-2xl p-5 flex flex-col justify-between transition-all duration-300 shadow-sm hover:shadow-md">
      <div>
        {/* Product Image Area */}
        <Link
          href={`/products/${product.id}`}
          className="block aspect-square rounded-xl bg-neutral-50/80 border border-neutral-100/80 overflow-hidden relative p-4 mb-4"
        >
          <img
            src={primaryImage}
            alt={product.name}
            className="w-full h-full object-cover rounded-lg group-hover:scale-105 transition duration-500"
          />
          {isLowStock && (
            <span className="absolute top-2.5 left-2.5 bg-amber-100 text-amber-800 border border-amber-200 text-[10px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wider">
              Low Stock
            </span>
          )}
        </Link>

        {/* Metadata & Title */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-[11px] font-mono">
            <span className="text-slate-600 font-bold uppercase tracking-wider">
              {brandName}
            </span>
            <span className="text-slate-600 truncate max-w-[120px]">
              SKU: {product.sku}
            </span>
          </div>

          <Link href={`/products/${product.id}`}>
            <h3 className="text-sm font-bold text-slate-900 line-clamp-2 hover:text-cyan-700 transition leading-snug font-sans">
              {product.name}
            </h3>
          </Link>

          {product.shortDescription && (
            <p className="text-xs text-slate-500 line-clamp-2 font-normal">
              {product.shortDescription}
            </p>
          )}
        </div>
      </div>

      {/* Pricing & Stock Footer */}
      <div className="pt-4 mt-4 border-t border-neutral-100 space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-[10px] text-slate-600 block uppercase font-mono">
              Price
            </span>
            <span className="text-base font-extrabold text-slate-900 font-sans">
              AED {Number(product.price).toLocaleString()}
            </span>
          </div>

          <div className="text-right">
            <span className="text-[10px] text-slate-600 block uppercase font-mono">
              Status
            </span>
            {isOutOfStock ? (
              <span className="text-xs font-bold text-rose-600 flex items-center gap-1 justify-end">
                <AlertCircle className="w-3 h-3" /> Out of Stock
              </span>
            ) : (
              <span className="text-xs font-bold text-emerald-600 flex items-center gap-1 justify-end">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> In
                Stock
              </span>
            )}
          </div>
        </div>

        {/* Action Button */}
        <button
          onClick={handleAddToCart}
          disabled={isOutOfStock}
          className={`w-full py-2.5 px-4 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition ${
            isAdded
              ? "bg-emerald-600 text-white"
              : isOutOfStock
                ? "bg-neutral-100 text-slate-400 cursor-not-allowed border border-neutral-200"
                : "bg-slate-900 hover:bg-slate-800 text-white shadow-sm"
          }`}
        >
          {isAdded ? (
            <>
              <Check className="w-4 h-4" /> Added to Cart
            </>
          ) : (
            <>
              <ShoppingBag className="w-4 h-4 text-cyan-400" /> Add to Order
              Cart
            </>
          )}
        </button>
      </div>
    </div>
  );
}
