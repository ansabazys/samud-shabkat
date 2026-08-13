"use client";

import { useCartStore } from "@/store/cart-store";
import Link from "next/link";
import {
  X,
  ShoppingBag,
  Trash2,
  Plus,
  Minus,
  ArrowRight,
  ShieldCheck,
  Truck,
} from "lucide-react";

export function CartDrawer() {
  const {
    items,
    isDrawerOpen,
    setDrawerOpen,
    updateQuantity,
    removeItem,
    getTotalPrice,
    getTotalItems,
  } = useCartStore();

  if (!isDrawerOpen) return null;

  const subtotal = getTotalPrice();
  const vatAmount = subtotal * 0.15;
  const totalPrice = subtotal + vatAmount;
  const totalItems = getTotalItems();
  const freeShippingThreshold = 499;
  const amountForFreeShipping = Math.max(0, freeShippingThreshold - subtotal);
  const freeShippingPercent = Math.min(
    100,
    (subtotal / freeShippingThreshold) * 100,
  );

  const installmentAmount = (totalPrice / 4).toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  return (
    <div className="fixed inset-0 z-50 overflow-hidden font-sans">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs transition-opacity"
        onClick={() => setDrawerOpen(false)}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col">
          {/* Drawer Header */}
          <div className="px-6 py-5 bg-slate-900 text-white flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <ShoppingBag className="w-5 h-5 text-emerald-400" />
              <h2 className="text-base font-black uppercase tracking-wider">
                Shopping Cart ({totalItems})
              </h2>
            </div>
            <button
              onClick={() => setDrawerOpen(false)}
              className="p-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition cursor-pointer"
              aria-label="Close Cart Drawer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Free Shipping Progress Indicator */}
          <div className="bg-emerald-50 border-b border-emerald-200/80 px-6 py-3 space-y-1.5">
            <div className="flex items-center justify-between text-xs font-bold text-emerald-900">
              <div className="flex items-center gap-1.5">
                <Truck className="w-4 h-4 text-emerald-700 shrink-0" />
                {amountForFreeShipping > 0 ? (
                  <span>
                    Add{" "}
                    <strong className="font-extrabold text-emerald-950">
                      SAR {amountForFreeShipping.toFixed(2)}
                    </strong>{" "}
                    for Free KSA Delivery
                  </span>
                ) : (
                  <span className="font-extrabold text-emerald-950">
                    🎉 You've unlocked Free KSA Express Delivery!
                  </span>
                )}
              </div>
            </div>
            <div className="w-full h-1.5 bg-emerald-200/80 rounded-full overflow-hidden">
              <div
                className="h-full bg-emerald-600 transition-all duration-500 rounded-full"
                style={{ width: `${freeShippingPercent}%` }}
              />
            </div>
          </div>

          {/* Cart Item List */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center space-y-4 py-12">
                <div className="w-16 h-16 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-sm font-black text-slate-900 uppercase">
                    Your Cart is Empty
                  </h3>
                  <p className="text-xs font-medium text-slate-500 max-w-xs">
                    Explore our enterprise hardware, laptops, and networking
                    catalog to add items.
                  </p>
                </div>
                <Link
                  href="/products"
                  onClick={() => setDrawerOpen(false)}
                  className="bg-[#15803d] hover:bg-emerald-700 text-white font-extrabold text-xs px-6 py-3 rounded-xl uppercase tracking-wider transition cursor-pointer"
                >
                  Browse Products
                </Link>
              </div>
            ) : (
              items.map((item) => {
                const itemImg =
                  item.product.images?.[0]?.url ||
                  "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=300&auto=format&fit=crop";
                return (
                  <div
                    key={item.product.id}
                    className="flex gap-4 p-3 bg-slate-50 border border-slate-200/90 rounded-2xl relative group"
                  >
                    <div className="w-20 h-20 rounded-xl bg-white border border-slate-200 p-1.5 shrink-0 overflow-hidden">
                      <img
                        src={itemImg}
                        alt={item.product.name}
                        className="w-full h-full object-cover rounded-lg"
                      />
                    </div>

                    <div className="flex-1 space-y-1">
                      <h4 className="text-xs font-bold text-slate-900 line-clamp-2 leading-snug">
                        {item.product.name}
                      </h4>
                      <span className="text-xs font-black text-slate-950 block">
                        SAR{" "}
                        {Number(item.product.price).toLocaleString("en-US", {
                          minimumFractionDigits: 2,
                        })}
                      </span>

                      {/* Quantity Controls & Remove */}
                      <div className="flex items-center justify-between pt-1">
                        <div className="flex items-center border border-slate-200 rounded-lg bg-white p-0.5">
                          <button
                            onClick={() =>
                              updateQuantity(item.product.id, item.quantity - 1)
                            }
                            className="w-6 h-6 rounded bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-700 transition"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="w-8 text-center text-xs font-black text-slate-900">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() =>
                              updateQuantity(item.product.id, item.quantity + 1)
                            }
                            className="w-6 h-6 rounded bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-700 transition"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>

                        <button
                          onClick={() => removeItem(item.product.id)}
                          className="text-slate-400 hover:text-red-600 transition p-1 cursor-pointer"
                          title="Remove item"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Drawer Footer (Summary & Checkout Button) */}
          {items.length > 0 && (
            <div className="p-6 bg-slate-50 border-t border-slate-200/90 space-y-4">
              {/* Tabby / Tamara Installment Note */}
              <div className="bg-white border border-emerald-200 p-2.5 rounded-xl text-center text-[11px] font-bold text-emerald-800">
                <span>
                  Or 4 payments of{" "}
                  <strong className="font-extrabold text-emerald-950">
                    SAR {installmentAmount}
                  </strong>
                  /mo with Tabby or Tamara
                </span>
              </div>

              {/* Subtotal & Taxes */}
              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between text-slate-600 font-medium">
                  <span>Subtotal (Excl. VAT)</span>
                  <span className="font-extrabold text-slate-900">
                    SAR{" "}
                    {subtotal.toLocaleString("en-US", {
                      minimumFractionDigits: 2,
                    })}
                  </span>
                </div>
                <div className="flex justify-between text-slate-600 font-medium">
                  <span>VAT (15%)</span>
                  <span className="font-extrabold text-slate-900">
                    SAR{" "}
                    {vatAmount.toLocaleString("en-US", {
                      minimumFractionDigits: 2,
                    })}
                  </span>
                </div>
                <div className="flex justify-between text-sm font-black text-slate-950 pt-2 border-t border-slate-200">
                  <span>Total Amount</span>
                  <span className="text-emerald-700">
                    SAR{" "}
                    {totalPrice.toLocaleString("en-US", {
                      minimumFractionDigits: 2,
                    })}
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2">
                <Link
                  href="/checkout"
                  onClick={() => setDrawerOpen(false)}
                  className="w-full bg-[#15803d] hover:bg-emerald-700 text-white font-extrabold text-xs py-3.5 rounded-xl uppercase tracking-wider transition flex items-center justify-center gap-2 cursor-pointer shadow-sm"
                >
                  <span>Proceed to Checkout</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  href="/cart"
                  onClick={() => setDrawerOpen(false)}
                  className="w-full bg-white hover:bg-slate-100 text-slate-900 border border-slate-300 font-extrabold text-xs py-3 rounded-xl uppercase tracking-wider transition flex items-center justify-center cursor-pointer"
                >
                  View Full Cart Page
                </Link>
              </div>

              <div className="flex items-center justify-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider pt-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>ZATCA VAT Invoice & Official Agency Warranty</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
