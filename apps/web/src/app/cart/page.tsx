"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ChevronRight,
  ShoppingBag,
  Trash2,
  Plus,
  Minus,
  ArrowRight,
  ShieldCheck,
  Tag,
  Truck,
  RotateCcw,
  Check,
} from "lucide-react";
import { useCartStore } from "@/store/cart-store";

export default function CartPage() {
  const {
    items,
    updateQuantity,
    removeItem,
    clearCart,
    getTotalPrice,
    getTotalItems,
  } = useCartStore();

  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null);
  const [couponDiscount, setCouponDiscount] = useState(0);

  const subtotal = getTotalPrice();
  const vatAmount = subtotal * 0.15;
  const discountAmount = (subtotal * couponDiscount) / 100;
  const deliveryFee = subtotal >= 499 || subtotal === 0 ? 0 : 35.0;
  const totalPrice = subtotal - discountAmount + vatAmount + deliveryFee;
  const totalItems = getTotalItems();

  const installmentAmount = (totalPrice / 4).toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponCode.trim()) return;

    if (
      couponCode.toUpperCase() === "SAMUD10" ||
      couponCode.toUpperCase() === "WELCOME"
    ) {
      setAppliedCoupon(couponCode.toUpperCase());
      setCouponDiscount(10); // 10% OFF
    } else {
      alert("Invalid coupon code. Try 'SAMUD10' or 'WELCOME' for 10% OFF.");
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCouponDiscount(0);
    setCouponCode("");
  };

  return (
    <div className="w-full bg-slate-50/50 min-h-screen text-slate-900 font-sans pb-16">
      {/* Breadcrumbs Header */}
      <div className="bg-white border-b border-slate-200/80 py-6 sm:py-8">
        <div className="max-w-4/5 mx-auto md:px-0 px-4">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-500 mb-2">
            <Link href="/" className="hover:text-emerald-700 transition">
              Home
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-slate-900 font-extrabold">Shopping Cart</span>
          </div>

          <div className="flex items-center justify-between">
            <h1 className="text-2xl sm:text-3xl font-black text-slate-950 uppercase tracking-tight">
              Shopping Cart ({totalItems} items)
            </h1>
            <Link
              href="/products"
              className="text-xs font-black text-emerald-700 hover:underline inline-flex items-center gap-1"
            >
              <span>Continue Shopping</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>

      {/* Main Cart Body */}
      <div className="max-w-4/5 mx-auto md:px-0 px-4 pt-8">
        {items.length === 0 ? (
          <div className="bg-white border border-slate-200/90 rounded-2xl p-12 text-center space-y-5 shadow-2xs max-w-lg mx-auto">
            <div className="w-20 h-20 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
              <ShoppingBag className="w-10 h-10" />
            </div>
            <div className="space-y-1">
              <h2 className="text-lg font-black text-slate-950 uppercase">
                Your Shopping Cart is Empty
              </h2>
              <p className="text-xs font-medium text-slate-500 max-w-sm mx-auto">
                Looks like you haven't added any products to your cart yet.
                Explore our catalog to find hardware deals.
              </p>
            </div>
            <Link
              href="/products"
              className="bg-[#15803d] hover:bg-emerald-700 text-white font-extrabold text-xs px-6 py-3.5 rounded-xl uppercase tracking-wider transition inline-flex items-center gap-2 cursor-pointer shadow-xs"
            >
              <span>Browse Products Catalog</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left Items Table List (8 cols) */}
            <div className="col-span-12 lg:col-span-8 space-y-4">
              {/* Item Table Header */}
              <div className="bg-white border border-slate-200/90 rounded-2xl p-4 sm:p-6 shadow-2xs space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <span className="text-xs font-black uppercase tracking-wider text-slate-900">
                    Product Details
                  </span>
                  <button
                    onClick={clearCart}
                    className="text-xs font-bold text-red-600 hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Clear Cart</span>
                  </button>
                </div>

                {/* Items List */}
                <div className="divide-y divide-slate-100">
                  {items.map((item) => {
                    const itemImg =
                      item.product.images?.[0]?.url ||
                      "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=300&auto=format&fit=crop";
                    const itemTotal =
                      Number(item.product.price) * item.quantity;

                    return (
                      <div
                        key={item.product.id}
                        className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 first:pt-0 last:pb-0"
                      >
                        <div className="flex items-center gap-4 flex-1">
                          <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl bg-slate-50 border border-slate-200 p-1.5 shrink-0 overflow-hidden">
                            <img
                              src={itemImg}
                              alt={item.product.name}
                              className="w-full h-full object-cover rounded-lg"
                            />
                          </div>

                          <div className="space-y-1">
                            <Link
                              href={`/products/${item.product.id}`}
                              className="text-xs sm:text-sm font-bold text-slate-900 hover:text-emerald-700 transition line-clamp-2 leading-snug"
                            >
                              {item.product.name}
                            </Link>
                            <span className="text-xs font-black text-slate-950 block">
                              SAR{" "}
                              {Number(item.product.price).toLocaleString(
                                "en-US",
                                { minimumFractionDigits: 2 },
                              )}{" "}
                              / unit
                            </span>
                            <span className="text-[10px] font-extrabold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded inline-block">
                              In Stock
                            </span>
                          </div>
                        </div>

                        {/* Quantity & Item Subtotal */}
                        <div className="flex items-center justify-between sm:justify-end gap-6 sm:w-auto">
                          {/* Quantity Selector */}
                          <div className="flex items-center border border-slate-200 rounded-xl bg-slate-50 p-1">
                            <button
                              onClick={() =>
                                updateQuantity(
                                  item.product.id,
                                  item.quantity - 1,
                                )
                              }
                              className="w-7 h-7 rounded-lg bg-white border border-slate-200 hover:bg-slate-100 flex items-center justify-center text-slate-700 transition cursor-pointer"
                            >
                              <Minus className="w-3.5 h-3.5" />
                            </button>
                            <span className="w-8 text-center text-xs font-black text-slate-900">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() =>
                                updateQuantity(
                                  item.product.id,
                                  item.quantity + 1,
                                )
                              }
                              className="w-7 h-7 rounded-lg bg-white border border-slate-200 hover:bg-slate-100 flex items-center justify-center text-slate-700 transition cursor-pointer"
                            >
                              <Plus className="w-3.5 h-3.5" />
                            </button>
                          </div>

                          {/* Item Subtotal Price */}
                          <div className="text-right">
                            <span className="text-xs font-semibold text-slate-400 block text-[10px] uppercase">
                              Total
                            </span>
                            <span className="text-sm sm:text-base font-black text-slate-950 block">
                              SAR{" "}
                              {itemTotal.toLocaleString("en-US", {
                                minimumFractionDigits: 2,
                              })}
                            </span>
                          </div>

                          {/* Trash Remove Button */}
                          <button
                            onClick={() => removeItem(item.product.id)}
                            className="p-2 text-slate-400 hover:text-red-600 transition cursor-pointer"
                            title="Remove product"
                          >
                            <Trash2 className="w-4.5 h-4.5" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Delivery Guarantee Info Box */}
              <div className="bg-emerald-50/80 border border-emerald-200/80 rounded-2xl p-4 flex items-center gap-3.5 text-xs text-emerald-900 font-bold">
                <Truck className="w-5 h-5 text-emerald-700 shrink-0" />
                <div>
                  <h4 className="font-extrabold uppercase tracking-tight">
                    Express Dispatch across Saudi Arabia
                  </h4>
                  <p className="text-[11px] font-semibold text-emerald-800">
                    Orders placed before 2:00 PM are dispatched on the same
                    business day from our KSA warehouse.
                  </p>
                </div>
              </div>
            </div>

            {/* Right Summary Card (4 cols) */}
            <div className="col-span-12 lg:col-span-4 space-y-4">
              <div className="bg-white border border-slate-200/90 rounded-2xl p-6 space-y-6 shadow-2xs">
                <h3 className="text-sm font-black uppercase tracking-wider text-slate-950 pb-3 border-b border-slate-100">
                  Order Summary
                </h3>

                {/* Promo Coupon Form */}
                <form onSubmit={handleApplyCoupon} className="space-y-2">
                  <label className="text-[11px] font-black uppercase tracking-wider text-slate-700 block">
                    Promo Coupon Code
                  </label>
                  <div className="flex items-center gap-2">
                    <div className="relative flex-1">
                      <input
                        type="text"
                        placeholder="Enter SAMUD10"
                        value={couponCode}
                        onChange={(e) => setCouponCode(e.target.value)}
                        disabled={!!appliedCoupon}
                        className="w-full pl-8 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold uppercase focus:outline-none focus:border-emerald-600 disabled:opacity-50"
                      />
                      <Tag className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-3" />
                    </div>
                    {appliedCoupon ? (
                      <button
                        type="button"
                        onClick={handleRemoveCoupon}
                        className="bg-red-50 text-red-600 hover:bg-red-100 font-extrabold text-xs px-3 py-2 rounded-xl transition"
                      >
                        Remove
                      </button>
                    ) : (
                      <button
                        type="submit"
                        className="bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs px-4 py-2.5 rounded-xl uppercase transition cursor-pointer"
                      >
                        Apply
                      </button>
                    )}
                  </div>
                  {appliedCoupon && (
                    <div className="flex items-center justify-between bg-emerald-50 text-emerald-800 text-[11px] font-extrabold px-3 py-1.5 rounded-lg border border-emerald-200">
                      <span>Code '{appliedCoupon}' Applied (10% OFF)</span>
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                    </div>
                  )}
                </form>

                {/* Tabby & Tamara Installment Estimation Box */}
                <div className="bg-slate-50 border border-emerald-200 p-3 rounded-xl space-y-1">
                  <div className="flex items-center justify-between text-[11px] font-black text-emerald-900">
                    <span className="uppercase">Tabby / Tamara Split</span>
                    <span className="bg-[#15803d] text-white text-[9px] px-1.5 py-0.5 rounded">
                      0% Interest
                    </span>
                  </div>
                  <p className="text-xs font-extrabold text-slate-950">
                    4 payments of{" "}
                    <span className="text-emerald-700">
                      SAR {installmentAmount}
                    </span>{" "}
                    / month
                  </p>
                </div>

                {/* Price Breakdown */}
                <div className="space-y-2.5 text-xs font-bold pt-2 border-t border-slate-100">
                  <div className="flex justify-between text-slate-600">
                    <span>Subtotal (Excl. VAT)</span>
                    <span className="text-slate-950">
                      SAR{" "}
                      {subtotal.toLocaleString("en-US", {
                        minimumFractionDigits: 2,
                      })}
                    </span>
                  </div>

                  {couponDiscount > 0 && (
                    <div className="flex justify-between text-emerald-700">
                      <span>Promo Discount ({couponDiscount}%)</span>
                      <span>
                        - SAR{" "}
                        {discountAmount.toLocaleString("en-US", {
                          minimumFractionDigits: 2,
                        })}
                      </span>
                    </div>
                  )}

                  <div className="flex justify-between text-slate-600">
                    <span>Estimated Shipping (KSA)</span>
                    <span className="text-slate-950">
                      {deliveryFee === 0 ? (
                        <span className="text-emerald-700 font-extrabold">
                          FREE
                        </span>
                      ) : (
                        `SAR ${deliveryFee.toFixed(2)}`
                      )}
                    </span>
                  </div>

                  <div className="flex justify-between text-slate-600">
                    <span>ZATCA VAT (15%)</span>
                    <span className="text-slate-950">
                      SAR{" "}
                      {vatAmount.toLocaleString("en-US", {
                        minimumFractionDigits: 2,
                      })}
                    </span>
                  </div>

                  <div className="flex justify-between text-base font-black text-slate-950 pt-3 border-t border-slate-200">
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
                <div className="space-y-2 pt-2">
                  <Link
                    href="/checkout"
                    className="w-full bg-[#15803d] hover:bg-emerald-700 text-white font-extrabold text-xs py-3.5 rounded-xl uppercase tracking-wider transition flex items-center justify-center gap-2 cursor-pointer shadow-xs"
                  >
                    <span>Proceed to Checkout</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>

                {/* Accepted Payment Icons */}
                <div className="pt-2 border-t border-slate-100 space-y-2">
                  <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block text-center">
                    Accepted Payment Methods
                  </span>
                  <div className="flex items-center justify-center gap-2 flex-wrap text-[10px] font-extrabold text-slate-600">
                    <span className="bg-slate-100 px-2 py-1 rounded border border-slate-200">
                      Mada
                    </span>
                    <span className="bg-slate-100 px-2 py-1 rounded border border-slate-200">
                      Apple Pay
                    </span>
                    <span className="bg-slate-100 px-2 py-1 rounded border border-slate-200">
                      Visa / MC
                    </span>
                    <span className="bg-emerald-100 text-emerald-800 px-2 py-1 rounded border border-emerald-200">
                      Tabby
                    </span>
                    <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded border border-blue-200">
                      Tamara
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-center gap-1.5 text-[11px] font-bold text-slate-500 pt-1">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>Secure 256-Bit SSL Checkout</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
