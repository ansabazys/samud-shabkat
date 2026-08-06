"use client";

import { useState } from "react";
import { useCartStore } from "@/store/cart-store";
import {
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Building,
  MapPin,
  FileText,
} from "lucide-react";
import Link from "next/link";

export default function CheckoutPage() {
  const { items, getTotalPrice, clearCart } = useCartStore();

  const [formData, setFormData] = useState({
    companyName: "",
    contactPhone: "",
    billingAddress: "",
    shippingAddress: "",
    notes: "",
  });

  const [isSubmitted, setIsSubmitted] = useState(false);
  const [orderNumber, setOrderNumber] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    setTimeout(() => {
      const generatedOrderNum = `ORD-${new Date().toISOString().slice(0, 10).replace(/-/g, "")}-${Math.floor(
        1000 + Math.random() * 9000,
      )}`;
      setOrderNumber(generatedOrderNum);
      setIsSubmitted(true);
      setLoading(false);
      clearCart();
    }, 1200);
  };

  if (isSubmitted) {
    return (
      <div className="max-w-xl mx-auto py-16 text-center space-y-6 bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl">
        <div className="w-16 h-16 bg-cyan-950 border border-cyan-500/30 text-cyan-400 rounded-full flex items-center justify-center mx-auto">
          <CheckCircle2 className="w-10 h-10" />
        </div>

        <h1 className="text-3xl font-bold text-white">
          Order Placed Successfully!
        </h1>
        <p className="text-sm text-slate-300">
          Your order number is{" "}
          <span className="font-mono font-bold text-cyan-400">
            {orderNumber}
          </span>
          . Our sales team is reviewing your purchase and will contact you
          shortly for dispatch.
        </p>

        <div className="pt-4 flex justify-center gap-4">
          <Link
            href="/account/orders"
            className="px-6 py-3 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold transition"
          >
            Track Order Status
          </Link>
          <Link
            href="/products"
            className="px-6 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-medium transition"
          >
            Back to Shop
          </Link>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="max-w-xl mx-auto py-16 text-center space-y-4">
        <h2 className="text-2xl font-bold text-white">Your cart is empty</h2>
        <p className="text-xs text-slate-400">
          Add products to your cart before proceeding to checkout.
        </p>
        <Link
          href="/products"
          className="inline-block px-6 py-3 rounded-xl bg-cyan-600 text-white text-xs font-bold"
        >
          Browse Products
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-white">Wholesale Checkout</h1>
        <p className="text-xs text-slate-400 mt-1">
          Complete your order details below
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Checkout Form */}
        <div className="lg:col-span-2">
          <form
            onSubmit={handleSubmit}
            className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6"
          >
            <div className="space-y-4">
              <h3 className="text-base font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-3">
                <Building className="w-4 h-4 text-cyan-400" /> Customer &
                Business Information
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1.5">
                    Company / Business Name (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Shabkat Telecom LLC"
                    value={formData.companyName}
                    onChange={(e) =>
                      setFormData({ ...formData, companyName: e.target.value })
                    }
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1.5">
                    Contact Phone Number *
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="+971 50 123 4567"
                    value={formData.contactPhone}
                    onChange={(e) =>
                      setFormData({ ...formData, contactPhone: e.target.value })
                    }
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-base font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-3">
                <MapPin className="w-4 h-4 text-cyan-400" /> Address Details
              </h3>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1.5">
                    Shipping Address *
                  </label>
                  <textarea
                    required
                    rows={2}
                    placeholder="Building, Street, Area, City, Emirate / Country"
                    value={formData.shippingAddress}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        shippingAddress: e.target.value,
                      })
                    }
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1.5">
                    Billing Address *
                  </label>
                  <textarea
                    required
                    rows={2}
                    placeholder="Same as shipping or registered Tax ID address"
                    value={formData.billingAddress}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        billingAddress: e.target.value,
                      })
                    }
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-base font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-3">
                <FileText className="w-4 h-4 text-cyan-400" /> Additional Order
                Notes
              </h3>
              <textarea
                rows={2}
                placeholder="Gate pass requirements, delivery time slots, PO reference..."
                value={formData.notes}
                onChange={(e) =>
                  setFormData({ ...formData, notes: e.target.value })
                }
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-gradient-to-r from-cyan-600 via-sky-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-white font-bold text-sm rounded-2xl shadow-xl shadow-cyan-600/20 transition flex items-center justify-center gap-2"
            >
              {loading ? "Processing Order..." : "Confirm & Place Order"}{" "}
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        </div>

        {/* Order Summary Sidebar */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 h-fit space-y-6">
          <h3 className="text-base font-bold text-white pb-3 border-b border-slate-800">
            Order Summary ({items.length} items)
          </h3>

          <div className="space-y-3 max-h-60 overflow-y-auto">
            {items.map((item) => (
              <div
                key={item.product.id}
                className="flex justify-between text-xs text-slate-300"
              >
                <div>
                  <span className="font-semibold block text-white truncate max-w-[180px]">
                    {item.product.name}
                  </span>
                  <span className="text-slate-500">Qty: {item.quantity}</span>
                </div>
                <span className="font-bold text-cyan-400">
                  AED{" "}
                  {(
                    Number(item.product.price) * item.quantity
                  ).toLocaleString()}
                </span>
              </div>
            ))}
          </div>

          <div className="border-t border-slate-800 pt-4 space-y-2 text-xs">
            <div className="flex justify-between text-slate-400">
              <span>Subtotal</span>
              <span>AED {getTotalPrice().toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-slate-400">
              <span>Shipping</span>
              <span className="text-emerald-400 font-semibold">
                Free (Dubai)
              </span>
            </div>
            <div className="flex justify-between text-base font-bold text-white pt-2 border-t border-slate-800">
              <span>Total</span>
              <span className="text-cyan-400">
                AED {getTotalPrice().toLocaleString()}
              </span>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 text-[11px] text-slate-400 flex items-center gap-2.5">
            <ShieldCheck className="w-5 h-5 text-cyan-400 shrink-0" />
            <span>Tax invoice will be generated upon order dispatch.</span>
          </div>
        </div>
      </div>
    </div>
  );
}
