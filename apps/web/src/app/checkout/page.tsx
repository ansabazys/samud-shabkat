"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  ShieldCheck,
  Truck,
  Lock,
  ArrowRight,
  ArrowLeft,
  PackageCheck,
  Printer,
  Store,
  Banknote,
  Loader2,
  AlertCircle,
  LogIn,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { useCartStore } from "@/store/cart-store";
import { useAuthStore } from "@/store/auth-store";
import { useLanguageStore } from "@/store/language-store";
import {
  ordersApi,
  type CreateOrderPayload,
  type OrderRecord,
} from "@/lib/api/orders-api";
import { Logo } from "@/components/ui/logo";

const STORE_LOCATIONS = [
  {
    id: "loc-1",
    name: "Samud Shabkat - Main IT Hardware & Technology Hub",
    address: "Olaya Street, Riyadh, Saudi Arabia",
    hours: "9:00 AM - 9:00 PM",
  },
  {
    id: "loc-2",
    name: "Samud Shabkat - Distribution & Service Counter",
    address: "King Fahd Road, Riyadh, Saudi Arabia",
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
  "Tabuk",
  "Abha",
];

export default function CheckoutPage() {
  const tCheckout = useTranslations("checkout");
  const tCommon = useTranslations("common");
  const language = useLanguageStore((state) => state.language);
  const isRtl = language === "ar";

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

  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [createdOrderRecord, setCreatedOrderRecord] =
    useState<OrderRecord | null>(null);

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
  const vatAmount = subtotal * 0.15; // 15% ZATCA VAT
  const shippingFee =
    fulfillmentType === "takeaway"
      ? 0
      : subtotal >= 499 || subtotal === 0
        ? 0
        : 35.0;
  const totalPrice = subtotal + vatAmount + shippingFee;
  const totalItems = getTotalItems();

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!isAuthenticated) {
      setErrorMessage(
        isRtl
          ? "يرجى تسجيل الدخول أولاً لإتمام طلبك."
          : "Please log in or create an account to complete your takeaway order.",
      );
      return;
    }

    if (!firstName || !phone) {
      setErrorMessage(
        isRtl
          ? "يرجى إدخال اسمك ورقم الهاتف."
          : "Please fill in your contact name and phone number.",
      );
      return;
    }

    if (fulfillmentType === "delivery" && !street) {
      setErrorMessage(
        isRtl
          ? "يرجى إدخال عنوان التوصيل."
          : "Please fill in your delivery street address.",
      );
      return;
    }

    if (items.length === 0) {
      setErrorMessage(
        isRtl
          ? "سلة التسوق فارغة."
          : "Your cart is empty. Please add products before checking out.",
      );
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
          fulfillmentType === "takeaway"
            ? "CASH_ON_PICKUP"
            : "CASH_ON_DELIVERY",
        notes: `Customer: ${firstName} ${lastName}. Email: ${email}. ${vatNumber ? `VAT ID: ${vatNumber}.` : ""}`,
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
    } catch (err: unknown) {
      console.error("Failed to place order:", err);
      const error = err as {
        response?: { data?: { message?: unknown } };
        message?: unknown;
      };
      const serverMsg =
        error.response?.data?.message ||
        error.message ||
        "Failed to place order. Please try again.";
      setErrorMessage(
        typeof serverMsg === "string"
          ? serverMsg
          : "Failed to place order. Please try again.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="w-full bg-slate-50/50 min-h-screen text-slate-900 font-sans pb-16">
      {/* Checkout Header */}
      <div className="bg-white border-b border-slate-200/80 py-4 sm:py-6">
        <div className="w-full max-w-7xl md:max-w-4/5 mx-auto px-4 md:px-0 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Logo href="/" size="sm" />
            <span className="text-xs font-bold text-slate-400 border-s border-slate-200 ps-3">
              {tCheckout("pageTitle")}
            </span>
          </div>

          <div className="flex items-center gap-2 text-xs font-extrabold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200">
            <Lock className="w-3.5 h-3.5" />
            <span>{tCheckout("secureCheckoutBadge")}</span>
          </div>
        </div>
      </div>

      {/* Main Checkout Container */}
      <div className="w-full max-w-7xl md:max-w-4/5 mx-auto px-4 md:px-0 pt-6 sm:pt-8">
        {/* Authentication Notice Banner */}
        {!isAuthenticated && !orderPlaced && (
          <div className="mb-6 bg-amber-50 border border-amber-200 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-2xs">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center shrink-0">
                <LogIn className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-black text-amber-950 uppercase tracking-wider">
                  {tCommon("login")}
                </h4>
                <p className="text-xs font-medium text-amber-800">
                  {isRtl
                    ? "يرجى تسجيل الدخول لحسابك لإتمام عملية الشراء ومتابعة الطلب."
                    : "Please log in to your Samud Shabkat account to place orders and receive instant status updates."}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <Link
                href="/login?redirect=/checkout"
                className="bg-amber-800 hover:bg-amber-900 text-white font-extrabold text-xs px-4 py-2.5 rounded-xl uppercase tracking-wider transition cursor-pointer"
              >
                {tCommon("login")}
              </Link>
              <Link
                href="/register?redirect=/checkout"
                className="bg-white border border-amber-300 hover:bg-amber-100 text-amber-900 font-extrabold text-xs px-4 py-2.5 rounded-xl uppercase tracking-wider transition cursor-pointer"
              >
                {tCommon("register")}
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
                {tCheckout("orderSuccessTitle")}
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-950 uppercase tracking-tight">
                {createdOrderRecord.fulfillmentType === "STORE_PICKUP"
                  ? isRtl
                    ? "تم تأكيد طلب الاستلام من المتجر!"
                    : "Takeaway Order Confirmed!"
                  : tCheckout("orderSuccessTitle")}
              </h2>
              <p className="text-xs sm:text-sm font-medium text-slate-600 max-w-md mx-auto">
                {tCheckout("orderSuccessDesc", {
                  orderNumber: createdOrderRecord.orderNumber,
                })}
              </p>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 text-start space-y-3 text-xs">
              <div className="flex justify-between font-bold text-slate-700">
                <span>{tCheckout("shippingAddress")}:</span>
                <span className="text-emerald-700 font-extrabold uppercase">
                  {createdOrderRecord.fulfillmentType === "STORE_PICKUP"
                    ? isRtl
                      ? "استلام من المتجر"
                      : "Store Pickup"
                    : isRtl
                      ? "توصيل سريع للمنزل"
                      : "Home Delivery"}
                </span>
              </div>

              {createdOrderRecord.fulfillmentType === "STORE_PICKUP" ? (
                <div className="flex justify-between font-bold text-slate-700">
                  <span>{isRtl ? "فرع الاستلام:" : "Pickup Location:"}</span>
                  <span className="text-slate-950 font-extrabold">
                    {STORE_LOCATIONS.find((l) => l.id === selectedStore)?.name}
                  </span>
                </div>
              ) : (
                <div className="flex justify-between font-bold text-slate-700">
                  <span>{tCheckout("shippingAddress")}:</span>
                  <span className="text-slate-950 font-extrabold">
                    {createdOrderRecord.shippingAddress}
                  </span>
                </div>
              )}

              <div className="flex justify-between font-bold text-slate-700">
                <span>{tCheckout("paymentMethod")}:</span>
                <span className="text-slate-950 uppercase font-black">
                  {createdOrderRecord.paymentMethod === "CASH_ON_PICKUP"
                    ? isRtl
                      ? "الدفع عند الاستلام من الفرع"
                      : "Pay at Store Counter"
                    : createdOrderRecord.paymentMethod === "CASH_ON_DELIVERY"
                      ? isRtl
                        ? "الدفع عند الاستلام (COD)"
                        : "Cash on Delivery"
                      : isRtl
                        ? "دفع إلكتروني"
                        : "Cash Payment"}
                </span>
              </div>

              <div className="flex justify-between font-bold text-slate-700 pt-3 border-t border-slate-200">
                <span>{tCommon("total")}:</span>
                <span className="text-emerald-700 text-sm font-black">
                  {tCommon("currency")}{" "}
                  {Number(createdOrderRecord.totalAmount).toLocaleString(
                    isRtl ? "ar-SA" : "en-US",
                    {
                      minimumFractionDigits: 2,
                    },
                  )}
                </span>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <button
                onClick={() => window.print()}
                className="bg-slate-100 hover:bg-slate-200 text-slate-900 font-extrabold text-xs px-5 py-3 rounded-xl uppercase tracking-wider transition inline-flex items-center gap-2 cursor-pointer"
              >
                <Printer className="w-4 h-4" />
                <span>{isRtl ? "طباعة الفاتورة" : "Print Invoice Copy"}</span>
              </button>
              <Link
                href="/orders"
                className="bg-[#15803d] hover:bg-emerald-700 text-white font-extrabold text-xs px-6 py-3 rounded-xl uppercase tracking-wider transition cursor-pointer"
              >
                {tCommon("myOrders")}
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
              {/* Step 1: Fulfillment Mode Selector */}
              <div className="bg-white border border-slate-200/90 rounded-2xl p-6 space-y-4 shadow-2xs">
                <h3 className="text-xs font-black uppercase tracking-wider text-slate-950 flex items-center gap-2 pb-3 border-b border-slate-100">
                  <span className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center text-[10px]">
                    1
                  </span>
                  {isRtl
                    ? "طريقة استلام الطلب"
                    : "Select Order Fulfillment Mode"}
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Takeaway Option */}
                  <button
                    type="button"
                    onClick={() => {
                      setFulfillmentType("takeaway");
                      setPaymentOption("takeaway_store");
                    }}
                    className={`p-4 rounded-2xl border text-start flex items-start justify-between transition cursor-pointer ${
                      fulfillmentType === "takeaway"
                        ? "bg-emerald-50 border-emerald-600 text-emerald-950 font-bold shadow-2xs"
                        : "border-slate-200 bg-white hover:bg-slate-50"
                    }`}
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <Store className="w-4 h-4 text-emerald-700" />
                        <span className="font-black text-sm uppercase">
                          {isRtl
                            ? "استلام من الفرع"
                            : "Store Pickup / Takeaway"}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 font-medium">
                        {isRtl
                          ? "استلم مباشرة من فرعنا بالرياض بدون رسوم شحن."
                          : "Pick up directly at our shop counter. No shipping fees. Pay cash/card at shop."}
                      </p>
                    </div>
                    <span className="text-xs font-black text-emerald-700 bg-white px-2 py-1 rounded border border-emerald-200">
                      {tCommon("free")}
                    </span>
                  </button>

                  {/* Express Delivery Option */}
                  <button
                    type="button"
                    onClick={() => {
                      setFulfillmentType("delivery");
                      setPaymentOption("cod");
                    }}
                    className={`p-4 rounded-2xl border text-start flex items-start justify-between transition cursor-pointer ${
                      fulfillmentType === "delivery"
                        ? "bg-emerald-50 border-emerald-600 text-emerald-950 font-bold shadow-2xs"
                        : "border-slate-200 bg-white hover:bg-slate-50"
                    }`}
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <Truck className="w-4 h-4 text-blue-600" />
                        <span className="font-black text-sm uppercase">
                          {isRtl ? "توصيل سريع" : "Express Delivery"}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 font-medium">
                        {isRtl
                          ? "توصيل مباشر إلى باب منزلك أو مقر شركتك."
                          : "Doorstep courier delivery to your specified shipping address."}
                      </p>
                    </div>
                    <span className="text-xs font-black text-slate-900 bg-white px-2 py-1 rounded border border-slate-200">
                      {subtotal >= 499
                        ? tCommon("free")
                        : `${tCommon("currency")} 35.00`}
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
                    {tCheckout("contactInfo")}
                  </h3>
                  <label className="flex items-center gap-2 text-xs font-bold text-slate-700 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isB2B}
                      onChange={(e) => setIsB2B(e.target.checked)}
                      className="w-4 h-4 accent-emerald-600 rounded"
                    />
                    <span>
                      {isRtl
                        ? "طلب تجاري / شركات (B2B)"
                        : "Corporate / Company Order"}
                    </span>
                  </label>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div>
                    <label className="font-extrabold text-slate-700 block mb-1">
                      {tCheckout("firstName")} *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Ahmed"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold focus:outline-none focus:border-emerald-600"
                    />
                  </div>
                  <div>
                    <label className="font-extrabold text-slate-700 block mb-1">
                      {tCheckout("lastName")} *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Al-Saud"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold focus:outline-none focus:border-emerald-600"
                    />
                  </div>
                  <div>
                    <label className="font-extrabold text-slate-700 block mb-1">
                      {tCheckout("email")} *
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="ahmed@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold focus:outline-none focus:border-emerald-600"
                    />
                  </div>
                  <div>
                    <label className="font-extrabold text-slate-700 block mb-1">
                      {tCheckout("phone")} *
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="+966 50 000 0000"
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
                        {isRtl ? "اسم الشركة" : "Company Name"}
                      </label>
                      <input
                        type="text"
                        placeholder="Samud Tech Est."
                        value={companyName}
                        onChange={(e) => setCompanyName(e.target.value)}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold focus:outline-none focus:border-emerald-600"
                      />
                    </div>
                    <div>
                      <label className="font-extrabold text-slate-700 block mb-1">
                        {isRtl ? "الرقم الضريبي ZATCA" : "Tax / VAT ID (ZATCA)"}
                      </label>
                      <input
                        type="text"
                        placeholder="300000000000003"
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
                    {isRtl
                      ? "اختر فرع الاستلام"
                      : "Select Store Pickup Location"}
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
                            {isRtl
                              ? `أوقات العمل: ${loc.hours}`
                              : `Hours: ${loc.hours}`}
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
                    {tCheckout("shippingAddress")}
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                    <div>
                      <label className="font-extrabold text-slate-700 block mb-1">
                        {isRtl ? "الدولة" : "Country"}
                      </label>
                      <select
                        value={country}
                        onChange={(e) => setCountry(e.target.value)}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold focus:outline-none"
                      >
                        <option value="Saudi Arabia">
                          Saudi Arabia (المملكة العربية السعودية)
                        </option>
                        <option value="UAE">
                          United Arab Emirates (الإمارات)
                        </option>
                      </select>
                    </div>
                    <div>
                      <label className="font-extrabold text-slate-700 block mb-1">
                        {tCheckout("city")} *
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
                        {isRtl ? "الحي" : "District / Area"} *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder={isRtl ? "حي العليا" : "Olaya District"}
                        value={district}
                        onChange={(e) => setDistrict(e.target.value)}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold focus:outline-none focus:border-emerald-600"
                      />
                    </div>
                    <div>
                      <label className="font-extrabold text-slate-700 block mb-1">
                        {tCheckout("streetAddress")} *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder={
                          isRtl
                            ? "شارع العليا العام، مبنى 12"
                            : "Olaya Main Road, Building 12"
                        }
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
                  {tCheckout("paymentMethod")}
                </h3>

                <div className="space-y-3 text-xs">
                  {fulfillmentType === "takeaway" && (
                    <button
                      type="button"
                      onClick={() => setPaymentOption("takeaway_store")}
                      className={`w-full p-4 rounded-xl border text-start flex items-center justify-between transition cursor-pointer ${
                        paymentOption === "takeaway_store"
                          ? "bg-emerald-50 border-emerald-600 text-emerald-950 font-bold"
                          : "border-slate-200 bg-white hover:bg-slate-50"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <Store className="w-5 h-5 text-emerald-700 shrink-0" />
                        <div>
                          <span className="font-extrabold block">
                            {isRtl
                              ? "الدفع عند الاستلام من الفرع (نقداً أو مدى)"
                              : "Pay at Shop Counter upon Pickup (Takeaway)"}
                          </span>
                          <span className="text-[11px] text-slate-500 font-medium">
                            {isRtl
                              ? "ادفع نقداً أو عبر البطاقة عند استلام أجهزتك من المتجر."
                              : "Pay directly with Cash or Card at our shop counter when collecting your products."}
                          </span>
                        </div>
                      </div>
                    </button>
                  )}

                  {fulfillmentType === "delivery" && (
                    <button
                      type="button"
                      onClick={() => setPaymentOption("cod")}
                      className={`w-full p-4 rounded-xl border text-start flex items-center justify-between transition cursor-pointer ${
                        paymentOption === "cod"
                          ? "bg-emerald-50 border-emerald-600 text-emerald-950 font-bold"
                          : "border-slate-200 bg-white hover:bg-slate-50"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <Banknote className="w-5 h-5 text-emerald-700 shrink-0" />
                        <div>
                          <span className="font-extrabold block">
                            {tCheckout("cashOnDelivery")}
                          </span>
                          <span className="text-[11px] text-slate-500 font-medium">
                            {isRtl
                              ? "ادفع للمندوب عند استلام الشحنة."
                              : "Pay cash to the delivery courier upon doorstep package delivery."}
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
                  {tCheckout("orderSummary")} ({totalItems} {tCommon("item")})
                </h3>

                {/* Items List */}
                <div className="space-y-3 max-h-48 overflow-y-auto no-scrollbar">
                  {items.length === 0 ? (
                    <p className="text-xs text-slate-500 font-medium">
                      {tCheckout("emptyCart")}
                    </p>
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
                          {tCommon("currency")}{" "}
                          {(
                            Number(item.product.price) * item.quantity
                          ).toLocaleString(isRtl ? "ar-SA" : "en-US", {
                            minimumFractionDigits: 2,
                          })}
                        </span>
                      </div>
                    ))
                  )}
                </div>

                {/* Price Breakdown */}
                <div className="space-y-2 text-xs font-bold pt-3 border-t border-slate-100">
                  <div className="flex justify-between text-slate-600">
                    <span>{tCommon("subtotal")}</span>
                    <span className="text-slate-950">
                      {tCommon("currency")}{" "}
                      {subtotal.toLocaleString(isRtl ? "ar-SA" : "en-US", {
                        minimumFractionDigits: 2,
                      })}
                    </span>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>
                      {isRtl ? "الشحن والتوصيل" : "Fulfillment"} (
                      {fulfillmentType === "takeaway"
                        ? isRtl
                          ? "استلام من الفرع"
                          : "Store Pickup"
                        : isRtl
                          ? "توصيل سريع"
                          : "Express Delivery"}
                      )
                    </span>
                    <span className="text-slate-950">
                      {shippingFee === 0
                        ? tCommon("free")
                        : `${tCommon("currency")} ${shippingFee.toFixed(2)}`}
                    </span>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>{tCommon("zatcaVatIncluded")}</span>
                    <span className="text-slate-950">
                      {tCommon("currency")}{" "}
                      {vatAmount.toLocaleString(isRtl ? "ar-SA" : "en-US", {
                        minimumFractionDigits: 2,
                      })}
                    </span>
                  </div>

                  <div className="flex justify-between text-base font-black text-slate-950 pt-3 border-t border-slate-200">
                    <span>{tCommon("total")}</span>
                    <span className="text-emerald-700">
                      {tCommon("currency")}{" "}
                      {totalPrice.toLocaleString(isRtl ? "ar-SA" : "en-US", {
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
                      <span>{tCheckout("processing")}</span>
                    </>
                  ) : (
                    <>
                      <span>{tCheckout("placeOrder")}</span>
                      {isRtl ? (
                        <ArrowLeft className="w-4 h-4" />
                      ) : (
                        <ArrowRight className="w-4 h-4" />
                      )}
                    </>
                  )}
                </button>

                <div className="flex items-center justify-center gap-1.5 text-[11px] font-bold text-slate-500 pt-1">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>{tCommon("zatcaVatBadge")}</span>
                </div>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
