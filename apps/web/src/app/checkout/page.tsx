"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
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
  Loader2,
  AlertCircle,
  LogIn,
} from "lucide-react";
import { useCartStore } from "@/store/cart-store";
import { useAuthStore } from "@/store/auth-store";
import { ordersApi, type CreateOrderPayload, type OrderRecord } from "@/lib/api/orders-api";

const STORE_LOCATIONS = [
  {
    id: "loc-1",
    name: "Samud Shabkat - Main IT Hardware & Technology Hub",
    address: "Technology Market, Main Store Branch",
    hours: "9:00 AM - 9:00 PM",
  },
  {
    id: "loc-2",
    name: "Samud Shabkat - Distribution & Service Counter",
    address: "Commercial Center, Secondary Store Branch",
    hours: "9:30 AM - 8:30 PM",
  },
];

const CITIES = [
  "Riyadh",
  "Jeddah",
  "Dammam",
  "Khobar",
  "Mecca",
  "Medina",
  "Kochi",
  "Calicut",
  "Trivandrum",
];

export default function CheckoutPage() {
  const router = useRouter();
  const { items, clearCart, getTotalPrice, getTotalItems } = useCartStore();
  const { user, isAuthenticated } = useAuthStore();

  // Form State
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [isB2B, setIsB2B] = useState(false);
  const [companyName, setCompanyName] = useState("");
  const [vatNumber, setVatNumber] = useState("");

  const [fulfillmentType, setFulfillmentType] = useState<"delivery" | "takeaway">(
    "takeaway",
  );
  const [selectedStore, setSelectedStore] = useState("loc-1");

  const [country, setCountry] = useState("India");
  const [city, setCity] = useState("Kochi");
  const [district, setDistrict] = useState("");
  const [street, setStreet] = useState("");

  const [paymentOption, setPaymentOption] = useState<
    "takeaway_store" | "cod" | "bank"
  >("takeaway_store");

  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [createdOrderRecord, setCreatedOrderRecord] = useState<OrderRecord | null>(null);

  // Pre-fill user data if logged in
  useEffect(() => {
    if (user) {
      if (user.firstName && !firstName) setFirstName(user.firstName);
      if (user.lastName && !lastName) setLastName(user.lastName);
      if (user.email && !email) setEmail(user.email);
      if (user.companyName && !companyName) {
        setCompanyName(user.companyName);
        setIsB2B(true);
      }
    }
  }, [user]);

  const subtotal = getTotalPrice();
  const vatAmount = subtotal * 0.18; // 18% GST / Tax
  const shippingFee =
    fulfillmentType === "takeaway"
      ? 0
      : subtotal >= 5000 || subtotal === 0
        ? 0
        : 250.0;
  const totalPrice = subtotal + vatAmount + shippingFee;
  const totalItems = getTotalItems();

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!isAuthenticated) {
      setErrorMessage("Please log in or create an account to complete your takeaway order.");
      return;
    }

    if (!firstName || !phone) {
      setErrorMessage("Please fill in your contact name and phone number.");
      return;
    }

    if (fulfillmentType === "delivery" && !street) {
      setErrorMessage("Please fill in your delivery street address.");
      return;
    }

    if (items.length === 0) {
      setErrorMessage("Your cart is empty. Please add products before checking out.");
      return;
    }

    try {
      setSubmitting(true);
      const selectedLoc = STORE_LOCATIONS.find((l) => l.id === selectedStore);
      const storeAddressStr = selectedLoc
        ? `${selectedLoc.name} - ${selectedLoc.address}`
        : "Samud Shabkat Main Store";

      const payload: CreateOrderPayload = {
        companyName: isB2B && companyName ? companyName : undefined,
        contactPhone: phone,
        billingAddress:
          fulfillmentType === "takeaway"
            ? `Store Pickup: ${storeAddressStr}`
            : `${street}, ${district}, ${city}, ${country}`,
        shippingAddress:
          fulfillmentType === "takeaway"
            ? `Store Pickup: ${storeAddressStr}`
            : `${street}, ${district}, ${city}, ${country}`,
        fulfillmentType:
          fulfillmentType === "takeaway" ? "STORE_PICKUP" : "HOME_DELIVERY",
        paymentMethod:
          fulfillmentType === "takeaway" ? "CASH_ON_PICKUP" : "CASH_ON_DELIVERY",
        notes: `Customer: ${firstName} ${lastName}. Email: ${email}. ${vatNumber ? `GST/Tax ID: ${vatNumber}.` : ""}`,
        items: items.map((item) => ({
          productId: item.product.id,
          productName: item.product.name,
          sku: item.product.sku || `SKU-${item.product.id.slice(0, 8)}`,
          unitPrice: Number(item.product.price),
          quantity: item.quantity,
          specifications: item.product.specifications || {},
        })),
      };

      const res = await ordersApi.createOrder(payload);
      setCreatedOrderRecord(res);
      setOrderPlaced(true);
      clearCart();
    } catch (err: any) {
      console.error("Failed to place order:", err);
      const serverMsg =
        err?.response?.data?.message || err?.message || "Failed to place order. Please try again.";
      setErrorMessage(serverMsg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="w-full bg-slate-50/50 min-h-screen text-slate-900 font-sans pb-16">
      {/* Checkout Header */}
      <div className="bg-white border-b border-slate-200/80 py-4 sm:py-6">
        <div className="w-full max-w-7xl md:max-w-4/5 mx-auto px-4 md:px-0 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Link
              href="/"
              className="text-lg font-black text-slate-950 uppercase tracking-tight"
            >
              Samud<span className="text-[#15803d]">Shabkat</span>
            </Link>
            <span className="text-xs font-bold text-slate-400 border-l border-slate-200 pl-2">
              Takeaway & Store Ordering
            </span>
          </div>

          <div className="flex items-center gap-2 text-xs font-extrabold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200">
            <Lock className="w-3.5 h-3.5" />
            <span>Official Invoice & Order System</span>
          </div>
        </div>
      </div>

      {/* Main Checkout Container */}
      <div className="w-full max-w-7xl md:max-w-4/5 mx-auto px-4 md:px-0 pt-6 sm:pt-8">
        {/* Authentication Notice Banner if user is not logged in */}
        {!isAuthenticated && !orderPlaced && (
          <div className="mb-6 bg-amber-50 border border-amber-200 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-2xs">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center shrink-0">
                <LogIn className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-black text-amber-950 uppercase tracking-wider">
                  Account Sign In Required
                </h4>
                <p className="text-xs font-medium text-amber-800">
                  Please log in to your Samud Shabkat account to place takeaway orders and receive instant status updates.
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <Link
                href="/login?redirect=/checkout"
                className="bg-amber-800 hover:bg-amber-900 text-white font-extrabold text-xs px-4 py-2.5 rounded-xl uppercase tracking-wider transition cursor-pointer"
              >
                Sign In
              </Link>
              <Link
                href="/register?redirect=/checkout"
                className="bg-white border border-amber-300 hover:bg-amber-100 text-amber-900 font-extrabold text-xs px-4 py-2.5 rounded-xl uppercase tracking-wider transition cursor-pointer"
              >
                Register
              </Link>
            </div>
          </div>
        )}

        {/* Global Error Banner */}
        {errorMessage && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-2xl p-4 flex items-center gap-3 text-red-800 text-xs font-bold shadow-2xs">
            <AlertCircle className="w-5 h-5 text-red-600 shrink-0" />
            <span className="flex-1">{errorMessage}</span>
          </div>
        )}

        {orderPlaced && createdOrderRecord ? (
          /* Order Confirmation View */
          <div className="bg-white border border-slate-200/90 rounded-2xl p-8 sm:p-12 text-center space-y-6 shadow-2xs max-w-2xl mx-auto">
            <div className="w-16 h-16 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto animate-bounce">
              <PackageCheck className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <span className="text-xs font-black uppercase tracking-widest text-emerald-700 bg-emerald-50 px-3 py-1 rounded-md">
                Order Confirmed
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-950 uppercase tracking-tight">
                {createdOrderRecord.fulfillmentType === "STORE_PICKUP"
                  ? "Takeaway Order Confirmed!"
                  : "Order Placed Successfully!"}
              </h2>
              <p className="text-xs sm:text-sm font-medium text-slate-600 max-w-md mx-auto">
                Order{" "}
                <strong className="font-extrabold text-slate-950">
                  #{createdOrderRecord.orderNumber}
                </strong>{" "}
                has been recorded in our system. A confirmation email has been sent to{" "}
                <strong className="font-extrabold text-slate-950">{email || user?.email}</strong>.
              </p>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 text-left space-y-3 text-xs">
              <div className="flex justify-between font-bold text-slate-700">
                <span>Fulfillment Method:</span>
                <span className="text-emerald-700 font-extrabold uppercase">
                  {createdOrderRecord.fulfillmentType === "STORE_PICKUP"
                    ? "Store Pickup (Takeaway)"
                    : "Home Delivery"}
                </span>
              </div>

              {createdOrderRecord.fulfillmentType === "STORE_PICKUP" ? (
                <div className="flex justify-between font-bold text-slate-700">
                  <span>Pickup Store Location:</span>
                  <span className="text-slate-950 font-extrabold">
                    {STORE_LOCATIONS.find((l) => l.id === selectedStore)?.name}
                  </span>
                </div>
              ) : (
                <div className="flex justify-between font-bold text-slate-700">
                  <span>Shipping Address:</span>
                  <span className="text-slate-950 font-extrabold">
                    {createdOrderRecord.shippingAddress}
                  </span>
                </div>
              )}

              <div className="flex justify-between font-bold text-slate-700">
                <span>Payment Method:</span>
                <span className="text-slate-950 uppercase font-black">
                  {createdOrderRecord.paymentMethod === "CASH_ON_PICKUP"
                    ? "Pay at Shop Counter"
                    : createdOrderRecord.paymentMethod === "CASH_ON_DELIVERY"
                      ? "Cash on Delivery"
                      : "Cash Payment"}
                </span>
              </div>

              <div className="flex justify-between font-bold text-slate-700 pt-3 border-t border-slate-200">
                <span>Total Payable Amount:</span>
                <span className="text-emerald-700 text-sm font-black">
                  ₹{" "}
                  {Number(createdOrderRecord.totalAmount).toLocaleString("en-IN", {
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
                <span>Print Invoice Copy</span>
              </button>
              <Link
                href="/my-orders"
                className="bg-[#15803d] hover:bg-emerald-700 text-white font-extrabold text-xs px-6 py-3 rounded-xl uppercase tracking-wider transition cursor-pointer"
              >
                View My Orders
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
                        Pick up directly at our shop counter. No shipping fees. Pay cash/card at shop.
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
                          Express Delivery
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 font-medium">
                        Doorstep courier delivery to your specified shipping address.
                      </p>
                    </div>
                    <span className="text-xs font-black text-slate-900 bg-white px-2 py-1 rounded border border-slate-200">
                      {subtotal >= 5000 ? "FREE" : "₹ 250"}
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
                    <span>Corporate / Company Order</span>
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
                      placeholder="John"
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
                      placeholder="Doe"
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
                      placeholder="john@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold focus:outline-none focus:border-emerald-600"
                    />
                  </div>
                  <div>
                    <label className="font-extrabold text-slate-700 block mb-1">
                      Contact Phone / WhatsApp *
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="+91 98460 00000"
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
                        placeholder="Samud Technology Solutions Ltd"
                        value={companyName}
                        onChange={(e) => setCompanyName(e.target.value)}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold focus:outline-none focus:border-emerald-600"
                      />
                    </div>
                    <div>
                      <label className="font-extrabold text-slate-700 block mb-1">
                        Tax / GST ID
                      </label>
                      <input
                        type="text"
                        placeholder="GSTIN32AAACG1234F1Z5"
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
                    Select Store Pickup Location
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
                        <option value="India">India</option>
                        <option value="Saudi Arabia">Saudi Arabia</option>
                        <option value="UAE">United Arab Emirates</option>
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
                        {CITIES.map((c) => (
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
                        placeholder="Downtown / Business District"
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
                        placeholder="Building 4, Tech Park Road"
                        value={street}
                        onChange={(e) => setStreet(e.target.value)}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold focus:outline-none focus:border-emerald-600"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Step 4: Payment Selection */}
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
                            Pay at Shop Counter upon Pickup (Takeaway)
                          </span>
                          <span className="text-[11px] text-slate-500 font-medium">
                            Pay directly with Cash or Card at our shop counter when collecting your products.
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
                            Cash on Delivery (COD)
                          </span>
                          <span className="text-[11px] text-slate-500 font-medium">
                            Pay cash to the delivery courier upon doorstep package delivery.
                          </span>
                        </div>
                      </div>
                    </button>
                  )}
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
                  {items.length === 0 ? (
                    <p className="text-xs text-slate-500 font-medium">No items in cart.</p>
                  ) : (
                    items.map((item) => (
                      <div
                        key={item.product.id}
                        className="flex items-center justify-between text-xs font-bold gap-2"
                      >
                        <span className="line-clamp-1 flex-1 text-slate-700">
                          {item.quantity}x {item.product.name}
                        </span>
                        <span className="text-slate-950 shrink-0">
                          ₹{" "}
                          {(
                            Number(item.product.price) * item.quantity
                          ).toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                        </span>
                      </div>
                    ))
                  )}
                </div>

                {/* Price Breakdown */}
                <div className="space-y-2 text-xs font-bold pt-3 border-t border-slate-100">
                  <div className="flex justify-between text-slate-600">
                    <span>Subtotal</span>
                    <span className="text-slate-950">
                      ₹{" "}
                      {subtotal.toLocaleString("en-IN", {
                        minimumFractionDigits: 2,
                      })}
                    </span>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>
                      Fulfillment (
                      {fulfillmentType === "takeaway"
                        ? "Store Pickup"
                        : "Express Delivery"}
                      )
                    </span>
                    <span className="text-slate-950">
                      {shippingFee === 0
                        ? "FREE"
                        : `₹ ${shippingFee.toFixed(2)}`}
                    </span>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>Estimated Tax (18%)</span>
                    <span className="text-slate-950">
                      ₹{" "}
                      {vatAmount.toLocaleString("en-IN", {
                        minimumFractionDigits: 2,
                      })}
                    </span>
                  </div>

                  <div className="flex justify-between text-base font-black text-slate-950 pt-3 border-t border-slate-200">
                    <span>Total Amount</span>
                    <span className="text-emerald-700">
                      ₹{" "}
                      {totalPrice.toLocaleString("en-IN", {
                        minimumFractionDigits: 2,
                      })}
                    </span>
                  </div>
                </div>

                {/* Confirm Order CTA */}
                <button
                  type="submit"
                  disabled={submitting || items.length === 0}
                  className="w-full bg-[#15803d] hover:bg-emerald-700 disabled:opacity-50 text-white font-extrabold text-xs py-3.5 rounded-xl uppercase tracking-wider transition flex items-center justify-center gap-2 cursor-pointer shadow-sm active:scale-95"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Processing Order...</span>
                    </>
                  ) : (
                    <>
                      <span>
                        {fulfillmentType === "takeaway"
                          ? "Confirm Takeaway Order"
                          : "Place Order"}
                      </span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>

                <div className="flex items-center justify-center gap-1.5 text-[11px] font-bold text-slate-500 pt-1">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>Official Business Ordering Platform</span>
                </div>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
