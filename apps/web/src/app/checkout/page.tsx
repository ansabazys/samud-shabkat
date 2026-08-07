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
  Store,
  Truck,
  Banknote,
  Loader2,
} from "lucide-react";
import Link from "next/link";
import { ordersApi } from "@/lib/api/orders-api";

export default function CheckoutPage() {
  const { items, getTotalPrice, clearCart } = useCartStore();

  const [fulfillmentType, setFulfillmentType] = useState<
    "STORE_PICKUP" | "HOME_DELIVERY"
  >("HOME_DELIVERY");
  const [formData, setFormData] = useState({
    companyName: "",
    contactPhone: "",
    billingAddress: "",
    shippingAddress: "",
    notes: "",
  });

  const [isSubmitted, setIsSubmitted] = useState(false);
  const [placedOrderNumber, setPlacedOrderNumber] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const orderPayload = {
        companyName: formData.companyName || undefined,
        contactPhone: formData.contactPhone,
        billingAddress:
          formData.billingAddress ||
          (fulfillmentType === "STORE_PICKUP"
            ? "Store Address"
            : formData.shippingAddress),
        shippingAddress:
          fulfillmentType === "STORE_PICKUP"
            ? "Store Pickup (Main Shop Counter)"
            : formData.shippingAddress,
        fulfillmentType,
        paymentMethod:
          fulfillmentType === "STORE_PICKUP"
            ? ("CASH_ON_PICKUP" as const)
            : ("CASH_ON_DELIVERY" as const),
        notes: formData.notes || undefined,
        items: items.map((item) => ({
          productId: item.product.id,
          productName: item.product.name,
          sku: item.product.sku || `SKU-${item.product.id.slice(0, 6)}`,
          unitPrice: Number(item.product.price),
          quantity: item.quantity,
          specifications: item.specifications || {},
        })),
      };

      const orderResult = await ordersApi.createOrder(orderPayload);
      setPlacedOrderNumber(orderResult.orderNumber);
      setIsSubmitted(true);
      clearCart();
    } catch (err: unknown) {
      const msg =
        err instanceof Error
          ? err.message
          : "Failed to place order. Please try again.";
      setError(msg);
    } finally {
      setLoading(false);
    }
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
            {placedOrderNumber}
          </span>
          .
        </p>

        <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 text-xs text-left space-y-2 text-slate-300">
          <div className="flex justify-between">
            <span className="text-slate-400">Fulfillment:</span>
            <span className="font-bold text-cyan-400">
              {fulfillmentType === "STORE_PICKUP"
                ? "Store Takeaway (Pay at Counter)"
                : "Home Delivery (Cash on Delivery)"}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">Payment Notice:</span>
            <span className="font-semibold text-emerald-400">
              {fulfillmentType === "STORE_PICKUP"
                ? "Please bring exact cash to our shop counter upon pickup."
                : "Please keep exact cash ready for the delivery boy."}
            </span>
          </div>
          <div className="flex justify-between pt-1 border-t border-slate-800">
            <span className="text-slate-400">Confirmation Email:</span>
            <span className="text-slate-200">
              Sent via Resend to your email address
            </span>
          </div>
        </div>

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
        <h1 className="text-3xl font-bold text-white">Checkout</h1>
        <p className="text-xs text-slate-400 mt-1">
          Select takeaway or delivery options and confirm your purchase
        </p>
      </div>

      {error && (
        <div className="p-4 bg-rose-950/60 border border-rose-800/60 rounded-xl text-xs text-rose-300">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Checkout Form */}
        <div className="lg:col-span-2">
          <form
            onSubmit={handleSubmit}
            className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6"
          >
            {/* Fulfillment Type Selection */}
            <div className="space-y-4">
              <h3 className="text-base font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-3">
                <Store className="w-4 h-4 text-cyan-400" /> Choose Order Type
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => setFulfillmentType("HOME_DELIVERY")}
                  className={`p-4 rounded-2xl border text-left transition flex items-start gap-3 ${
                    fulfillmentType === "HOME_DELIVERY"
                      ? "bg-cyan-950/40 border-cyan-500 shadow-lg shadow-cyan-950"
                      : "bg-slate-950 border-slate-800 hover:border-slate-700"
                  }`}
                >
                  <div
                    className={`p-2.5 rounded-xl ${fulfillmentType === "HOME_DELIVERY" ? "bg-cyan-600 text-white" : "bg-slate-900 text-slate-400"}`}
                  >
                    <Truck className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white">
                      Home Delivery (COD)
                    </h4>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      Delivered to your door. Pay cash to delivery boy.
                    </p>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setFulfillmentType("STORE_PICKUP")}
                  className={`p-4 rounded-2xl border text-left transition flex items-start gap-3 ${
                    fulfillmentType === "STORE_PICKUP"
                      ? "bg-amber-950/40 border-amber-500 shadow-lg shadow-amber-950"
                      : "bg-slate-950 border-slate-800 hover:border-slate-700"
                  }`}
                >
                  <div
                    className={`p-2.5 rounded-xl ${fulfillmentType === "STORE_PICKUP" ? "bg-amber-600 text-white" : "bg-slate-900 text-slate-400"}`}
                  >
                    <Store className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white">
                      Store Takeaway
                    </h4>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      Collect at our shop counter. Pay cash upon pickup.
                    </p>
                  </div>
                </button>
              </div>
            </div>

            {/* Customer Contact */}
            <div className="space-y-4">
              <h3 className="text-base font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-3">
                <Building className="w-4 h-4 text-cyan-400" /> Contact
                Information
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

            {/* Address Details */}
            {fulfillmentType === "HOME_DELIVERY" ? (
              <div className="space-y-4">
                <h3 className="text-base font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-3">
                  <MapPin className="w-4 h-4 text-cyan-400" /> Delivery Address
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
                </div>
              </div>
            ) : (
              <div className="p-4 bg-slate-950 border border-slate-800 rounded-2xl space-y-1 text-xs">
                <span className="font-bold text-amber-400 block">
                  Pickup Location:
                </span>
                <span className="text-slate-300 block">
                  Samud Shabkat Main Shop Counter
                </span>
                <span className="text-slate-400 text-[11px] block">
                  You will receive an email notification as soon as your items
                  are packed and ready for collection!
                </span>
              </div>
            )}

            {/* Additional Order Notes */}
            <div className="space-y-4">
              <h3 className="text-base font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-3">
                <FileText className="w-4 h-4 text-cyan-400" /> Additional Order
                Notes
              </h3>
              <textarea
                rows={2}
                placeholder="Gate pass requirements, preferred pickup window, special instructions..."
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
              className="w-full py-4 bg-gradient-to-r from-cyan-600 via-sky-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-white font-bold text-sm rounded-2xl shadow-xl shadow-cyan-600/20 transition flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" /> Placing Order...
                </>
              ) : (
                <>
                  Confirm Order (
                  {fulfillmentType === "STORE_PICKUP"
                    ? "Pay at Counter"
                    : "Cash on Delivery"}
                  ) <ArrowRight className="w-4 h-4" />
                </>
              )}
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
                  ₹
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
              <span>₹{getTotalPrice().toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-slate-400">
              <span>Fulfillment</span>
              <span className="text-emerald-400 font-semibold">
                {fulfillmentType === "STORE_PICKUP"
                  ? "Store Pickup (Free)"
                  : "COD Delivery (Free)"}
              </span>
            </div>
            <div className="flex justify-between text-base font-bold text-white pt-2 border-t border-slate-800">
              <span>Total Due</span>
              <span className="text-cyan-400">
                ₹{getTotalPrice().toLocaleString()}
              </span>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 text-[11px] text-slate-400 flex items-center gap-2.5">
            <Banknote className="w-5 h-5 text-emerald-400 shrink-0" />
            <span>
              {fulfillmentType === "STORE_PICKUP"
                ? "Pay cash directly at our shop counter when picking up."
                : "Pay cash to the delivery boy upon order arrival."}
            </span>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 text-[11px] text-slate-400 flex items-center gap-2.5">
            <ShieldCheck className="w-5 h-5 text-cyan-400 shrink-0" />
            <span>Tax invoice will be generated upon cash payment.</span>
          </div>
        </div>
      </div>
    </div>
  );
}
