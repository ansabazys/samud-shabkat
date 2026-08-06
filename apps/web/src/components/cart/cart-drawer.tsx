"use client";

import { useCartStore } from "@/store/cart-store";
import {
  X,
  Trash2,
  ArrowRight,
  ShoppingBag,
  Plus,
  Minus,
  Warehouse,
  AlertTriangle,
} from "lucide-react";
import Link from "next/link";

export function CartDrawer() {
  const {
    items,
    isDrawerOpen,
    setDrawerOpen,
    removeItem,
    updateQuantity,
    getTotalPrice,
  } = useCartStore();

  if (!isDrawerOpen) return null;

  const hasStockValidationErrors = items.some((item) => {
    const available = item.product.availableStock ?? 45;
    return item.quantity > available;
  });

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        onClick={() => setDrawerOpen(false)}
        className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm transition-opacity"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-slate-900 border-l border-slate-800 text-white shadow-2xl flex flex-col">
          {/* Header */}
          <div className="p-6 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-cyan-950/80 border border-cyan-500/30 text-cyan-400">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-lg font-bold">
                  B2B Order Cart ({items.length})
                </h2>
                <span className="text-[10px] text-slate-400 font-mono">
                  Stock Reserved on Checkout
                </span>
              </div>
            </div>
            <button
              onClick={() => setDrawerOpen(false)}
              className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Validation Warning Alert */}
          {hasStockValidationErrors && (
            <div className="bg-amber-950/80 border-b border-amber-500/30 p-3.5 px-6 flex items-center gap-2.5 text-xs text-amber-200">
              <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
              <span>
                Some items exceed available stock in warehouse. Please reduce
                quantity before checkout.
              </span>
            </div>
          )}

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {items.length === 0 ? (
              <div className="text-center py-16 text-slate-400 space-y-4">
                <ShoppingBag className="w-12 h-12 mx-auto text-slate-600 stroke-[1.5]" />
                <p className="text-base font-medium">
                  Your cart is currently empty
                </p>
                <button
                  onClick={() => setDrawerOpen(false)}
                  className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white font-medium rounded-xl text-xs transition"
                >
                  Explore Catalog
                </button>
              </div>
            ) : (
              items.map((item) => {
                const primaryImage =
                  item.product.images?.find((img) => img.isPrimary)?.url ||
                  item.product.images?.[0]?.url ||
                  "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=300&auto=format&fit=crop";

                const availableStock = item.product.availableStock ?? 45;
                const isExceedingStock = item.quantity > availableStock;
                const warehouseCode = item.product.warehouseCode || "DXB-MAIN";

                return (
                  <div
                    key={item.product.id}
                    className={`p-4 rounded-xl bg-slate-800/60 border flex flex-col gap-3 transition ${
                      isExceedingStock
                        ? "border-amber-500/60 bg-amber-950/20"
                        : "border-slate-700/60"
                    }`}
                  >
                    <div className="flex gap-4 items-start">
                      <img
                        src={primaryImage}
                        alt={item.product.name}
                        className="w-16 h-16 object-cover rounded-lg bg-slate-900 border border-slate-700/50 shrink-0"
                      />

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-1 mb-1">
                          <span className="text-[10px] font-mono text-cyan-400 font-semibold truncate">
                            SKU: {item.product.sku}
                          </span>
                          <span className="inline-flex items-center gap-1 text-[9px] font-bold px-2 py-0.5 rounded bg-slate-900 border border-slate-700 text-slate-300">
                            <Warehouse className="w-2.5 h-2.5 text-cyan-400" />{" "}
                            {warehouseCode}
                          </span>
                        </div>

                        <h4 className="text-sm font-semibold text-white truncate">
                          {item.product.name}
                        </h4>

                        <div className="flex items-center gap-2 mt-1 text-[11px]">
                          <span className="text-slate-400">Available:</span>
                          <span
                            className={`font-bold ${availableStock > 0 ? "text-emerald-400" : "text-red-400"}`}
                          >
                            {availableStock} units
                          </span>
                        </div>
                      </div>

                      <button
                        onClick={() => removeItem(item.product.id)}
                        className="p-1.5 text-slate-500 hover:text-red-400 transition"
                        title="Remove Item"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Quantity Bounding & Subtotal */}
                    <div className="flex items-center justify-between pt-2 border-t border-slate-700/50">
                      <div className="flex items-center gap-2 bg-slate-900 border border-slate-700 rounded-lg p-1">
                        <button
                          onClick={() =>
                            updateQuantity(item.product.id, item.quantity - 1)
                          }
                          className="p-1 hover:text-cyan-400 transition"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="text-xs font-semibold px-2">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() =>
                            updateQuantity(item.product.id, item.quantity + 1)
                          }
                          disabled={item.quantity >= availableStock}
                          className="p-1 hover:text-cyan-400 transition disabled:opacity-40"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <div className="text-right">
                        <span className="text-xs text-slate-400 block font-mono">
                          AED {Number(item.product.price).toLocaleString()} /
                          unit
                        </span>
                        <span className="text-sm font-bold text-cyan-400">
                          AED{" "}
                          {(
                            Number(item.product.price) * item.quantity
                          ).toLocaleString()}
                        </span>
                      </div>
                    </div>

                    {isExceedingStock && (
                      <p className="text-[10px] text-amber-400 font-semibold">
                        ⚠️ Maximum available stock is {availableStock} units.
                      </p>
                    )}
                  </div>
                );
              })
            )}
          </div>

          {/* Footer Summary */}
          {items.length > 0 && (
            <div className="p-6 border-t border-slate-800 bg-slate-950/60 space-y-4">
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-400">Subtotal</span>
                <span className="text-lg font-bold text-white">
                  AED {getTotalPrice().toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between items-center text-xs text-slate-400">
                <span>Estimated Total (Tax Included)</span>
                <span className="font-bold text-cyan-400">
                  AED {getTotalPrice().toLocaleString()}
                </span>
              </div>

              <Link
                href={hasStockValidationErrors ? "#" : "/checkout"}
                onClick={(e) => {
                  if (hasStockValidationErrors) {
                    e.preventDefault();
                  } else {
                    setDrawerOpen(false);
                  }
                }}
                className={`w-full py-3.5 px-4 font-semibold rounded-xl text-sm flex items-center justify-center gap-2 transition ${
                  hasStockValidationErrors
                    ? "bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700"
                    : "bg-gradient-to-r from-cyan-600 via-sky-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-white shadow-lg shadow-cyan-600/20"
                }`}
              >
                {hasStockValidationErrors
                  ? "Fix Stock Errors to Checkout"
                  : "Proceed to Checkout"}{" "}
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
