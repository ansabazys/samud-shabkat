"use client";

import { useEffect } from "react";
import { useCartStore } from "@/store/cart-store";
import { useLanguageStore } from "@/store/language-store";
import Link from "next/link";
import {
  X,
  ShoppingBag,
  Trash2,
  Plus,
  Minus,
  ArrowRight,
  ArrowLeft,
  ShieldCheck,
  Truck,
  CheckCircle2,
  Lock,
} from "lucide-react";
import { useTranslations } from "next-intl";

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

  const tCart = useTranslations("cart");
  const tCommon = useTranslations("common");
  const language = useLanguageStore((state) => state.language);
  const isRtl = language === "ar";

  // Listen for Escape key to close drawer
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isDrawerOpen) {
        setDrawerOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isDrawerOpen, setDrawerOpen]);

  if (!isDrawerOpen) return null;

  const subtotal = getTotalPrice();
  const vatAmount = subtotal * 0.15;
  const freeShippingThreshold = 499;
  const deliveryFee =
    subtotal >= freeShippingThreshold || subtotal === 0 ? 0 : 35.0;
  const totalPrice = subtotal + vatAmount + (subtotal > 0 ? deliveryFee : 0);
  const totalItems = getTotalItems();
  const amountForFreeShipping = Math.max(0, freeShippingThreshold - subtotal);
  const freeShippingPercent = Math.min(
    100,
    (subtotal / freeShippingThreshold) * 100,
  );

  const installmentAmount = (totalPrice / 4).toLocaleString(
    isRtl ? "ar-SA" : "en-US",
    {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    },
  );

  return (
    <div className="fixed inset-0 z-50 overflow-hidden font-sans">
      {/* Backdrop with smooth blur */}
      <div
        className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs transition-opacity duration-300 animate-in fade-in"
        onClick={() => setDrawerOpen(false)}
        aria-hidden="true"
      />

      {/* Drawer Container (RTL left-aligned, LTR right-aligned) */}
      <div
        className={`fixed inset-y-0 ${
          isRtl ? "left-0 pr-0 sm:pr-10" : "right-0 pl-0 sm:pl-10"
        } max-w-full flex`}
      >
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col border-l rtl:border-l-0 rtl:border-r border-slate-200/80">
          {/* Drawer Header */}
          <div className="px-6 py-4.5 bg-white text-slate-900 flex items-center justify-between border-b border-slate-200/90">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200/80 shadow-2xs">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-sm font-black uppercase tracking-wider flex items-center gap-2 text-slate-950">
                  <span>{tCart("yourCart")}</span>
                  <span className="bg-amber-400 text-slate-950 text-xs px-2.5 py-0.5 rounded-full font-black shadow-2xs">
                    {totalItems}
                  </span>
                </h2>
                <span className="text-[11px] text-slate-500 font-bold block">
                  samud
                  <span className="text-emerald-600 font-extrabold">.</span>
                  shabkat KSA
                </span>
              </div>
            </div>
            <button
              onClick={() => setDrawerOpen(false)}
              className="p-2 rounded-xl text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition cursor-pointer border border-transparent hover:border-slate-200"
              aria-label={tCommon("close")}
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Free Shipping Progress Bar */}
          <div className="bg-emerald-50/90 border-b border-emerald-200/80 px-6 py-3.5 space-y-2">
            <div className="flex items-center justify-between text-xs font-bold text-emerald-950">
              <div className="flex items-center gap-2">
                <Truck className="w-4 h-4 text-emerald-700 shrink-0" />
                {amountForFreeShipping > 0 ? (
                  <span>
                    {tCart("freeShippingProgress", {
                      amount: amountForFreeShipping.toFixed(2),
                    })}
                  </span>
                ) : (
                  <span className="font-black text-emerald-950 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 inline shrink-0" />
                    <span>{tCart("freeDeliveryNotice")}</span>
                  </span>
                )}
              </div>
            </div>
            <div className="w-full h-2 bg-emerald-200/80 rounded-full overflow-hidden">
              <div
                className="h-full bg-[#15803d] transition-all duration-500 rounded-full"
                style={{ width: `${freeShippingPercent}%` }}
              />
            </div>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-5 space-y-3.5 bg-slate-50/40">
            {items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center space-y-4 py-12 px-6">
                <div className="w-20 h-20 rounded-2xl bg-emerald-50 text-emerald-600 border border-emerald-200/60 flex items-center justify-center shadow-2xs">
                  <ShoppingBag className="w-10 h-10" />
                </div>
                <div className="space-y-1.5">
                  <h3 className="text-base font-black text-slate-950 uppercase tracking-tight">
                    {tCart("emptyCartTitle")}
                  </h3>
                  <p className="text-xs font-medium text-slate-500 max-w-xs leading-relaxed">
                    {tCart("emptyCartDesc")}
                  </p>
                </div>
                <Link
                  href="/products"
                  onClick={() => setDrawerOpen(false)}
                  className="bg-[#15803d] hover:bg-emerald-700 text-white font-extrabold text-xs px-6 py-3.5 rounded-xl uppercase tracking-wider transition cursor-pointer shadow-xs hover:shadow-md flex items-center gap-2"
                >
                  <span>{tCart("startShopping")}</span>
                  {isRtl ? (
                    <ArrowLeft className="w-4 h-4" />
                  ) : (
                    <ArrowRight className="w-4 h-4" />
                  )}
                </Link>
              </div>
            ) : (
              items.map((item) => {
                const itemImg =
                  item.product.images?.[0]?.url ||
                  "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=300&auto=format&fit=crop";
                const itemTotal = Number(item.product.price) * item.quantity;

                return (
                  <div
                    key={item.product.id}
                    className="flex gap-4 p-4 bg-white border border-slate-200/90 hover:border-emerald-300 rounded-2xl relative group transition-all duration-200 shadow-2xs hover:shadow-xs"
                  >
                    {/* Product Image */}
                    <div className="w-20 h-20 rounded-xl bg-slate-50 border border-slate-200 p-1.5 shrink-0 overflow-hidden">
                      <img
                        src={itemImg}
                        alt={item.product.name}
                        className="w-full h-full object-cover rounded-lg group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>

                    {/* Info & Actions */}
                    <div className="flex-1 space-y-1.5 flex flex-col justify-between">
                      <div>
                        <div className="flex items-center justify-between gap-2 mb-1">
                          <span className="text-[10px] font-black text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded uppercase tracking-wider">
                            {tCommon("inStock")}
                          </span>
                          <button
                            onClick={() => removeItem(item.product.id)}
                            className="text-slate-400 hover:text-red-600 hover:bg-red-50 p-1 rounded-lg transition cursor-pointer"
                            title={tCart("clearCart")}
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                        <Link
                          href={`/products/${item.product.slug || item.product.id}`}
                          onClick={() => setDrawerOpen(false)}
                          className="text-xs font-bold text-slate-900 hover:text-emerald-700 transition line-clamp-2 leading-snug block"
                        >
                          {item.product.name}
                        </Link>
                      </div>

                      <div className="flex items-center justify-between pt-1">
                        {/* Stepper Quantity Controller */}
                        <div className="flex items-center border border-slate-200 rounded-xl bg-slate-50 p-1 shadow-2xs">
                          <button
                            onClick={() =>
                              updateQuantity(item.product.id, item.quantity - 1)
                            }
                            className="w-6 h-6 rounded-lg bg-white border border-slate-200 hover:bg-emerald-50 hover:text-emerald-700 text-slate-700 flex items-center justify-center transition cursor-pointer"
                            aria-label="Decrease Quantity"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="w-7 text-center text-xs font-black text-slate-900">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() =>
                              updateQuantity(item.product.id, item.quantity + 1)
                            }
                            className="w-6 h-6 rounded-lg bg-white border border-slate-200 hover:bg-emerald-50 hover:text-emerald-700 text-slate-700 flex items-center justify-center transition cursor-pointer"
                            aria-label="Increase Quantity"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>

                        {/* Price Breakdown */}
                        <div className="text-right rtl:text-left">
                          <span className="text-xs font-black text-slate-950 block">
                            {tCommon("currency")}{" "}
                            {itemTotal.toLocaleString(
                              isRtl ? "ar-SA" : "en-US",
                              { minimumFractionDigits: 2 },
                            )}
                          </span>
                          {item.quantity > 1 && (
                            <span className="text-[10px] text-slate-400 font-semibold block">
                              ({tCommon("currency")}{" "}
                              {Number(item.product.price).toLocaleString(
                                isRtl ? "ar-SA" : "en-US",
                                { minimumFractionDigits: 2 },
                              )}{" "}
                              / {tCommon("item")})
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Drawer Footer Summary */}
          {items.length > 0 && (
            <div className="p-6 bg-white border-t border-slate-200/90 space-y-4 shadow-lg">
              {/* Tabby & Tamara Installment Estimation Box */}
              <div className="bg-emerald-50/80 border border-emerald-200/90 p-3 rounded-2xl space-y-1.5">
                <div className="flex items-center justify-between text-[10px]">
                  <div className="flex items-center gap-1.5">
                    <span className="bg-emerald-100 text-emerald-900 font-extrabold px-2 py-0.5 rounded border border-emerald-300/50">
                      Tabby
                    </span>
                    <span className="bg-blue-100 text-blue-900 font-extrabold px-2 py-0.5 rounded border border-blue-300/50">
                      Tamara
                    </span>
                  </div>
                  <span className="bg-[#15803d] text-white text-[9px] font-bold px-2 py-0.5 rounded-full">
                    0% Interest
                  </span>
                </div>
                <p className="text-xs font-bold text-emerald-950">
                  {tCommon("installmentsText", { amount: installmentAmount })}{" "}
                  <strong>{tCommon("tabbyOrTamara")}</strong>
                </p>
              </div>

              {/* Price Breakdown Details */}
              <div className="space-y-2 text-xs">
                <div className="flex justify-between text-slate-600 font-medium">
                  <span>{tCommon("subtotal")}</span>
                  <span className="font-extrabold text-slate-900">
                    {tCommon("currency")}{" "}
                    {subtotal.toLocaleString(isRtl ? "ar-SA" : "en-US", {
                      minimumFractionDigits: 2,
                    })}
                  </span>
                </div>

                <div className="flex justify-between text-slate-600 font-medium">
                  <span>{tCart("deliveryFee")}</span>
                  <span>
                    {deliveryFee === 0 ? (
                      <strong className="text-emerald-700 font-black">
                        {tCommon("free")}
                      </strong>
                    ) : (
                      <strong className="text-slate-900 font-extrabold">
                        {tCommon("currency")} {deliveryFee.toFixed(2)}
                      </strong>
                    )}
                  </span>
                </div>

                <div className="flex justify-between text-slate-600 font-medium">
                  <span>{tCommon("zatcaVatIncluded")}</span>
                  <span className="font-extrabold text-slate-900">
                    {tCommon("currency")}{" "}
                    {vatAmount.toLocaleString(isRtl ? "ar-SA" : "en-US", {
                      minimumFractionDigits: 2,
                    })}
                  </span>
                </div>

                <div className="flex justify-between text-base font-black text-slate-950 pt-2.5 border-t border-slate-200">
                  <span>{tCommon("total")}</span>
                  <span className="text-emerald-700">
                    {tCommon("currency")}{" "}
                    {totalPrice.toLocaleString(isRtl ? "ar-SA" : "en-US", {
                      minimumFractionDigits: 2,
                    })}
                  </span>
                </div>
              </div>

              {/* Action CTA Buttons */}
              <div className="space-y-2 pt-1">
                <Link
                  href="/checkout"
                  onClick={() => setDrawerOpen(false)}
                  className="w-full bg-[#15803d] hover:bg-emerald-700 text-white font-extrabold text-xs sm:text-sm py-3.5 rounded-xl uppercase tracking-wider transition flex items-center justify-center gap-2 cursor-pointer shadow-xs hover:shadow-md active:scale-[0.99]"
                >
                  <span>{tCart("proceedToCheckout")}</span>
                  {isRtl ? (
                    <ArrowLeft className="w-4 h-4" />
                  ) : (
                    <ArrowRight className="w-4 h-4" />
                  )}
                </Link>

                <Link
                  href="/cart"
                  onClick={() => setDrawerOpen(false)}
                  className="w-full bg-white hover:bg-slate-50 text-slate-800 border border-slate-200 font-extrabold text-xs py-3 rounded-xl uppercase tracking-wider transition flex items-center justify-center cursor-pointer hover:border-slate-300 shadow-2xs"
                >
                  {tCart("continueShopping")}
                </Link>
              </div>

              {/* Accepted KSA Payment Methods */}
              <div className="pt-2 border-t border-slate-100 space-y-2">
                <div className="flex items-center justify-center gap-1.5 flex-wrap text-[10px] font-extrabold text-slate-600">
                  <span className="bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                    Mada
                  </span>
                  <span className="bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                    Apple Pay
                  </span>
                  <span className="bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                    Visa / MC
                  </span>
                  <span className="bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded border border-emerald-200">
                    Tabby
                  </span>
                  <span className="bg-blue-100 text-blue-800 px-2 py-0.5 rounded border border-blue-200">
                    Tamara
                  </span>
                </div>

                <div className="flex items-center justify-center gap-2 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span>{tCommon("zatcaVatBadge")}</span>
                  <span>•</span>
                  <Lock className="w-3 h-3 text-slate-400 inline" />
                  <span>SSL</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
