"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ShieldCheck,
  Truck,
  Building2,
  Lock,
  ArrowRight,
  PackageCheck,
  Printer,
  Store,
  Banknote,
} from "lucide-react";
import { useCartStore } from "@/store/cart-store";

const STORE_LOCATIONS = [
  {
    id: "loc-1",
    name: "Riyadh Main Store - Olaya Computer Market",
    address: "King Fahd Road, Olaya Computer Market, Riyadh",
    hours: "9:00 AM - 10:00 PM",
  },
  {
    id: "loc-2",
    name: "Jeddah Store - Palestine Street Hardware Center",
    address: "Palestine Street, Computer Center, Jeddah",
    hours: "9:30 AM - 10:30 PM",
  },
];

const SAUDI_CITIES = [
  "Riyadh",
  "Jeddah",
  "Dammam",
  "Khobar",
  "Mecca",
  "Medina",
  "Dhahran",
  "Tabuk",
  "Buraidah",
  "Abha",
];

export default function CheckoutPage() {
  const { items, clearCart, getTotalPrice, getTotalItems } = useCartStore();

  // Form State
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [isB2B, setIsB2B] = useState(false);
  const [companyName, setCompanyName] = useState("");
  const [vatNumber, setVatNumber] = useState("");

  const [fulfillmentType, setFulfillmentType] = useState<
    "delivery" | "takeaway"
  >("takeaway");
  const [selectedStore, setSelectedStore] = useState("loc-1");

  const [country, setCountry] = useState("Saudi Arabia");
  const [city, setCity] = useState("Riyadh");
  const [district, setDistrict] = useState("");
  const [street, setStreet] = useState("");

  const [paymentOption, setPaymentOption] = useState<
    "takeaway_store" | "cod" | "bank"
  >("takeaway_store");

  const [orderPlaced, setOrderPlaced] = useState(false);
  const [orderNumber, setOrderNumber] = useState("");

  const subtotal = getTotalPrice();
  const vatAmount = subtotal * 0.15;
  const shippingFee =
    fulfillmentType === "takeaway"
      ? 0
      : subtotal >= 499 || subtotal === 0
        ? 0
        : 35.0;
  const totalPrice = subtotal + vatAmount + shippingFee;
  const totalItems = getTotalItems();

  const handlePlaceOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!firstName || !phone) {
      alert("Please fill in all required contact information.");
      return;
    }

    if (fulfillmentType === "delivery" && !street) {
      alert("Please fill in your delivery street address.");
      return;
    }

    const randomOrd = "ORD-" + Math.floor(100000 + Math.random() * 900000);
    setOrderNumber(randomOrd);
    setOrderPlaced(true);
    clearCart();
  };

  return (
    <div className="w-full bg-slate-50/50 min-h-screen text-slate-900 font-sans pb-16">
      {/* Checkout Header */}
      <div className="bg-white border-b border-slate-200/80 py-4 sm:py-6">
        <div className="max-w-4/5 mx-auto md:px-0 px-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Link
              href="/"
              className="text-lg font-black text-slate-950 uppercase tracking-tight"
            >
              Samud<span className="text-[#15803d]">Shabkat</span>
            </Link>
            <span className="text-xs font-bold text-slate-400 border-l border-slate-200 pl-2">
              Order Fulfillment & Takeaway
            </span>
          </div>

          <div className="flex items-center gap-2 text-xs font-extrabold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200">
            <Lock className="w-3.5 h-3.5" />
            <span>Official ZATCA Invoice Order</span>
          </div>
        </div>
      </div>

      {/* Main Checkout Container */}
      <div className="max-w-4/5 mx-auto md:px-0 px-4 pt-8">
        {orderPlaced ? (
          /* Order Confirmation View */
          <div className="bg-white border border-slate-200/90 rounded-2xl p-8 sm:p-12 text-center space-y-6 shadow-2xs max-w-2xl mx-auto">
            <div className="w-16 h-16 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto animate-bounce">
              <PackageCheck className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <span className="text-xs font-black uppercase tracking-widest text-emerald-700 bg-emerald-50 px-3 py-1 rounded-md">
                Order Received
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-950 uppercase tracking-tight">
                {fulfillmentType === "takeaway"
                  ? "Takeaway Order Confirmed!"
                  : "Order Placed Successfully!"}
              </h2>
              <p className="text-xs sm:text-sm font-medium text-slate-600 max-w-md mx-auto">
                Your order{" "}
                <strong className="font-extrabold text-slate-950">
                  {orderNumber}
                </strong>{" "}
                has been registered. Our team will contact you via
                phone/WhatsApp for verification.
              </p>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-left space-y-2 text-xs">
              <div className="flex justify-between font-bold text-slate-700">
                <span>Fulfillment Mode:</span>
                <span className="text-emerald-700 font-extrabold uppercase">
                  {fulfillmentType === "takeaway"
                    ? "Store Pickup (Takeaway)"
                    : "Express KSA Delivery"}
                </span>
              </div>
              {fulfillmentType === "takeaway" ? (
                <div className="flex justify-between font-bold text-slate-700">
                  <span>Pickup Location:</span>
                  <span className="text-slate-950">
                    {STORE_LOCATIONS.find((l) => l.id === selectedStore)?.name}
                  </span>
                </div>
              ) : (
                <div className="flex justify-between font-bold text-slate-700">
                  <span>Delivery Address:</span>
                  <span className="text-slate-950">
                    {street}, {district}, {city}, KSA
                  </span>
                </div>
              )}
              <div className="flex justify-between font-bold text-slate-700">
                <span>Payment Method:</span>
                <span className="text-slate-950 uppercase font-black">
                  {paymentOption === "takeaway_store"
                    ? "Pay at Store on Pickup"
                    : paymentOption === "cod"
                      ? "Cash on Delivery"
                      : "Direct Bank Transfer"}
                </span>
              </div>
              <div className="flex justify-between font-bold text-slate-700 pt-2 border-t border-slate-200">
                <span>Total Amount (VAT Included):</span>
                <span className="text-slate-950 text-sm font-black">
                  SAR{" "}
                  {totalPrice.toLocaleString("en-US", {
                    minimumFractionDigits: 2,
                  })}
                </span>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <button
                onClick={() => window.print()}
                className="bg-slate-100 hover:bg-slate-200 text-slate-900 font-extrabold text-xs px-5 py-3 rounded-xl uppercase tracking-wider transition inline-flex items-center gap-2 cursor-pointer"
              >
                <Printer className="w-4 h-4" />
                <span>Print ZATCA Invoice Copy</span>
              </button>
              <Link
                href="/products"
                className="bg-[#15803d] hover:bg-emerald-700 text-white font-extrabold text-xs px-6 py-3 rounded-xl uppercase tracking-wider transition cursor-pointer"
              >
                Back to Catalog
              </Link>
            </div>
          </div>
        ) : (
          <form
            onSubmit={handlePlaceOrder}
            className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start"
          >
            {/* Left Checkout Steps (8 cols) */}
            <div className="col-span-12 lg:col-span-8 space-y-6">
              {/* Step 1: Fulfillment Mode Selector (Takeaway vs Delivery) */}
              <div className="bg-white border border-slate-200/90 rounded-2xl p-6 space-y-4 shadow-2xs">
                <h3 className="text-xs font-black uppercase tracking-wider text-slate-950 flex items-center gap-2 pb-3 border-b border-slate-100">
                  <span className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center text-[10px]">
                    1
                  </span>
                  Select Order Fulfillment Mode
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Takeaway Option */}
                  <button
                    type="button"
                    onClick={() => {
                      setFulfillmentType("takeaway");
                      setPaymentOption("takeaway_store");
                    }}
                    className={`p-4 rounded-2xl border text-left flex items-start justify-between transition cursor-pointer ${
                      fulfillmentType === "takeaway"
                        ? "bg-emerald-50 border-emerald-600 text-emerald-950 font-bold shadow-2xs"
                        : "border-slate-200 bg-white hover:bg-slate-50"
                    }`}
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <Store className="w-4 h-4 text-emerald-700" />
                        <span className="font-black text-sm uppercase">
                          Store Pickup / Takeaway
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 font-medium">
                        Pick up directly from our Riyadh or Jeddah branch. No
                        shipping fees.
                      </p>
                    </div>
                    <span className="text-xs font-black text-emerald-700 bg-white px-2 py-1 rounded border border-emerald-200">
                      FREE
                    </span>
                  </button>

                  {/* Express Delivery Option */}
                  <button
                    type="button"
                    onClick={() => {
                      setFulfillmentType("delivery");
                      setPaymentOption("cod");
                    }}
                    className={`p-4 rounded-2xl border text-left flex items-start justify-between transition cursor-pointer ${
                      fulfillmentType === "delivery"
                        ? "bg-emerald-50 border-emerald-600 text-emerald-950 font-bold shadow-2xs"
                        : "border-slate-200 bg-white hover:bg-slate-50"
                    }`}
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <Truck className="w-4 h-4 text-blue-600" />
                        <span className="font-black text-sm uppercase">
                          Express KSA Delivery
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 font-medium">
                        Doorstep courier delivery across Saudi Arabia (1-2
                        Days).
                      </p>
                    </div>
                    <span className="text-xs font-black text-slate-900 bg-white px-2 py-1 rounded border border-slate-200">
                      {subtotal >= 499 ? "FREE" : "SAR 35"}
                    </span>
                  </button>
                </div>
              </div>

              {/* Step 2: Customer Contact Information */}
              <div className="bg-white border border-slate-200/90 rounded-2xl p-6 space-y-4 shadow-2xs">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <h3 className="text-xs font-black uppercase tracking-wider text-slate-950 flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center text-[10px]">
                      2
                    </span>
                    Customer & Contact Details
                  </h3>
                  <label className="flex items-center gap-2 text-xs font-bold text-slate-700 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isB2B}
                      onChange={(e) => setIsB2B(e.target.checked)}
                      className="w-4 h-4 accent-emerald-600 rounded"
                    />
                    <span>B2B Corporate Account</span>
                  </label>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div>
                    <label className="font-extrabold text-slate-700 block mb-1">
                      First Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Fahad"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold focus:outline-none focus:border-emerald-600"
                    />
                  </div>
                  <div>
                    <label className="font-extrabold text-slate-700 block mb-1">
                      Last Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Al-Mansoor"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold focus:outline-none focus:border-emerald-600"
                    />
                  </div>
                  <div>
                    <label className="font-extrabold text-slate-700 block mb-1">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="fahad@company.com.sa"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold focus:outline-none focus:border-emerald-600"
                    />
                  </div>
                  <div>
                    <label className="font-extrabold text-slate-700 block mb-1">
                      Saudi Phone / WhatsApp (+966) *
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="050 123 4567"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold focus:outline-none focus:border-emerald-600"
                    />
                  </div>
                </div>

                {isB2B && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs pt-2 border-t border-slate-100">
                    <div>
                      <label className="font-extrabold text-slate-700 block mb-1">
                        Company Name
                      </label>
                      <input
                        type="text"
                        placeholder="Saudi Technology Co."
                        value={companyName}
                        onChange={(e) => setCompanyName(e.target.value)}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold focus:outline-none focus:border-emerald-600"
                      />
                    </div>
                    <div>
                      <label className="font-extrabold text-slate-700 block mb-1">
                        ZATCA VAT Tax #
                      </label>
                      <input
                        type="text"
                        placeholder="310977874800003"
                        value={vatNumber}
                        onChange={(e) => setVatNumber(e.target.value)}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold focus:outline-none focus:border-emerald-600"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Step 3: Location / Address Details */}
              {fulfillmentType === "takeaway" ? (
                <div className="bg-white border border-slate-200/90 rounded-2xl p-6 space-y-4 shadow-2xs">
                  <h3 className="text-xs font-black uppercase tracking-wider text-slate-950 flex items-center gap-2 pb-3 border-b border-slate-100">
                    <span className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center text-[10px]">
                      3
                    </span>
                    Select Takeaway Branch Location
                  </h3>

                  <div className="space-y-3">
                    {STORE_LOCATIONS.map((loc) => (
                      <label
                        key={loc.id}
                        onClick={() => setSelectedStore(loc.id)}
                        className={`p-4 rounded-xl border flex items-center justify-between transition cursor-pointer ${
                          selectedStore === loc.id
                            ? "bg-emerald-50 border-emerald-600 text-emerald-950 font-bold"
                            : "border-slate-200 bg-white"
                        }`}
                      >
                        <div className="space-y-0.5">
                          <span className="font-extrabold text-xs block">
                            {loc.name}
                          </span>
                          <span className="text-[11px] text-slate-500 block">
                            {loc.address}
                          </span>
                          <span className="text-[10px] text-emerald-700 font-extrabold block">
                            Hours: {loc.hours}
                          </span>
                        </div>
                        <input
                          type="radio"
                          name="store_location"
                          checked={selectedStore === loc.id}
                          onChange={() => setSelectedStore(loc.id)}
                          className="w-4 h-4 accent-emerald-600"
                        />
                      </label>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="bg-white border border-slate-200/90 rounded-2xl p-6 space-y-4 shadow-2xs">
                  <h3 className="text-xs font-black uppercase tracking-wider text-slate-950 flex items-center gap-2 pb-3 border-b border-slate-100">
                    <span className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center text-[10px]">
                      3
                    </span>
                    Delivery Address
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                    <div>
                      <label className="font-extrabold text-slate-700 block mb-1">
                        Country
                      </label>
                      <select
                        value={country}
                        onChange={(e) => setCountry(e.target.value)}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold focus:outline-none"
                      >
                        <option value="Saudi Arabia">Saudi Arabia (KSA)</option>
                        <option value="United Arab Emirates">
                          United Arab Emirates (UAE)
                        </option>
                        <option value="Bahrain">Bahrain</option>
                      </select>
                    </div>
                    <div>
                      <label className="font-extrabold text-slate-700 block mb-1">
                        City *
                      </label>
                      <select
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold focus:outline-none"
                      >
                        {SAUDI_CITIES.map((c) => (
                          <option key={c} value={c}>
                            {c}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="font-extrabold text-slate-700 block mb-1">
                        District / Area *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="Al Olaya"
                        value={district}
                        onChange={(e) => setDistrict(e.target.value)}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold focus:outline-none focus:border-emerald-600"
                      />
                    </div>
                    <div>
                      <label className="font-extrabold text-slate-700 block mb-1">
                        Street Address *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="King Fahd Road, Gate 4"
                        value={street}
                        onChange={(e) => setStreet(e.target.value)}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold focus:outline-none focus:border-emerald-600"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Step 4: Payment / Settlement Selection */}
              <div className="bg-white border border-slate-200/90 rounded-2xl p-6 space-y-4 shadow-2xs">
                <h3 className="text-xs font-black uppercase tracking-wider text-slate-950 flex items-center gap-2 pb-3 border-b border-slate-100">
                  <span className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center text-[10px]">
                    4
                  </span>
                  Select Payment Option
                </h3>

                <div className="space-y-3 text-xs">
                  {fulfillmentType === "takeaway" && (
                    <button
                      type="button"
                      onClick={() => setPaymentOption("takeaway_store")}
                      className={`w-full p-4 rounded-xl border text-left flex items-center justify-between transition cursor-pointer ${
                        paymentOption === "takeaway_store"
                          ? "bg-emerald-50 border-emerald-600 text-emerald-950 font-bold"
                          : "border-slate-200 bg-white hover:bg-slate-50"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <Store className="w-5 h-5 text-emerald-700 shrink-0" />
                        <div>
                          <span className="font-extrabold block">
                            Pay at Store upon Takeaway
                          </span>
                          <span className="text-[11px] text-slate-500 font-medium">
                            Pay with Cash, Mada, or Credit Card when picking up
                            your order.
                          </span>
                        </div>
                      </div>
                    </button>
                  )}

                  {fulfillmentType === "delivery" && (
                    <button
                      type="button"
                      onClick={() => setPaymentOption("cod")}
                      className={`w-full p-4 rounded-xl border text-left flex items-center justify-between transition cursor-pointer ${
                        paymentOption === "cod"
                          ? "bg-emerald-50 border-emerald-600 text-emerald-950 font-bold"
                          : "border-slate-200 bg-white hover:bg-slate-50"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <Banknote className="w-5 h-5 text-emerald-700 shrink-0" />
                        <div>
                          <span className="font-extrabold block">
                            Payment upon Delivery (COD)
                          </span>
                          <span className="text-[11px] text-slate-500 font-medium">
                            Pay the courier upon delivery across KSA.
                          </span>
                        </div>
                      </div>
                    </button>
                  )}

                  {/* Bank Transfer Option */}
                  <button
                    type="button"
                    onClick={() => setPaymentOption("bank")}
                    className={`w-full p-4 rounded-xl border text-left flex items-center justify-between transition cursor-pointer ${
                      paymentOption === "bank"
                        ? "bg-emerald-50 border-emerald-600 text-emerald-950 font-bold"
                        : "border-slate-200 bg-white hover:bg-slate-50"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Building2 className="w-5 h-5 text-blue-700 shrink-0" />
                      <div>
                        <span className="font-extrabold block">
                          Direct Saudi Bank Transfer / Corporate RFQ
                        </span>
                        <span className="text-[11px] text-slate-500 font-medium">
                          Transfer directly to company Al Rajhi or SNB bank
                          accounts (ZATCA Proforma Invoice issued).
                        </span>
                      </div>
                    </div>
                  </button>
                </div>
              </div>
            </div>

            {/* Right Order Summary (4 cols) */}
            <div className="col-span-12 lg:col-span-4 space-y-4">
              <div className="bg-white border border-slate-200/90 rounded-2xl p-6 space-y-6 shadow-2xs">
                <h3 className="text-sm font-black uppercase tracking-wider text-slate-950 pb-3 border-b border-slate-100">
                  Order Summary ({totalItems} items)
                </h3>

                {/* Items List */}
                <div className="space-y-3 max-h-48 overflow-y-auto no-scrollbar">
                  {items.map((item) => (
                    <div
                      key={item.product.id}
                      className="flex items-center justify-between text-xs font-bold gap-2"
                    >
                      <span className="line-clamp-1 flex-1 text-slate-700">
                        {item.quantity}x {item.product.name}
                      </span>
                      <span className="text-slate-950 shrink-0">
                        SAR{" "}
                        {(
                          Number(item.product.price) * item.quantity
                        ).toLocaleString("en-US", { minimumFractionDigits: 2 })}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Price Breakdown */}
                <div className="space-y-2 text-xs font-bold pt-3 border-t border-slate-100">
                  <div className="flex justify-between text-slate-600">
                    <span>Subtotal</span>
                    <span className="text-slate-950">
                      SAR{" "}
                      {subtotal.toLocaleString("en-US", {
                        minimumFractionDigits: 2,
                      })}
                    </span>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>
                      Fulfillment (
                      {fulfillmentType === "takeaway"
                        ? "Takeaway Pickup"
                        : "Delivery"}
                      )
                    </span>
                    <span className="text-slate-950">
                      {shippingFee === 0
                        ? "FREE"
                        : `SAR ${shippingFee.toFixed(2)}`}
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

                {/* Confirm Order CTA */}
                <button
                  type="submit"
                  className="w-full bg-[#15803d] hover:bg-emerald-700 text-white font-extrabold text-xs py-3.5 rounded-xl uppercase tracking-wider transition flex items-center justify-center gap-2 cursor-pointer shadow-sm active:scale-95"
                >
                  <span>
                    {fulfillmentType === "takeaway"
                      ? "Confirm Takeaway Order"
                      : "Place Order"}
                  </span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <div className="flex items-center justify-center gap-1.5 text-[11px] font-bold text-slate-500 pt-1">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>Official KSA ZATCA Tax Invoice Included</span>
                </div>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
