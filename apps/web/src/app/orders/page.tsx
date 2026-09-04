"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import {
  ChevronRight,
  ChevronLeft,
  Package,
  Clock,
  CheckCircle2,
  Printer,
  RotateCcw,
  Truck,
  Store,
  Search,
  Copy,
  Check,
  X,
  FileText,
  ShoppingBag,
  CreditCard,
  Lock,
  User,
  AlertCircle,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { useCartStore } from "@/store/cart-store";
import { useAuthStore } from "@/store/auth-store";
import { useLanguageStore } from "@/store/language-store";
import { ordersApi, type OrderRecord } from "@/lib/api/orders-api";
import { Logo } from "@/components/ui/logo";

export default function OrdersPage() {
  const tOrders = useTranslations("orders");
  const tCommon = useTranslations("common");
  const language = useLanguageStore((state) => state.language);
  const isRtl = language === "ar";

  const { user, isAuthenticated } = useAuthStore();
  const addItem = useCartStore((state) => state.addItem);

  const [orders, setOrders] = useState<OrderRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [activeTab, setActiveTab] = useState<
    "all" | "in_progress" | "delivered" | "takeaway"
  >("all");
  const [searchQuery, setSearchQuery] = useState("");

  // Modals & User Feedback
  const [selectedOrderTracking, setSelectedOrderTracking] =
    useState<OrderRecord | null>(null);
  const [selectedInvoiceOrder, setSelectedInvoiceOrder] =
    useState<OrderRecord | null>(null);
  const [copiedOrderId, setCopiedOrderId] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const fetchOrders = async () => {
    if (!isAuthenticated) {
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const res = await ordersApi.getMyOrders({ limit: 50 });
      setOrders(res.data || []);
    } catch (err: unknown) {
      console.error("Failed to fetch my orders:", err);
      const error = err as {
        response?: { data?: { message?: unknown }; status?: number };
        message?: unknown;
      };
      if (error.response?.status === 401) {
        useAuthStore.getState().logout();
        return;
      }
      setError(
        typeof error.response?.data?.message === "string"
          ? error.response.data.message
          : typeof error.message === "string"
            ? error.message
            : "Failed to load orders",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchOrders();
    } else {
      setLoading(false);
    }
  }, [isAuthenticated]);

  const handleCopyOrderNumber = (num: string) => {
    navigator.clipboard.writeText(num);
    setCopiedOrderId(num);
    triggerToast(
      isRtl
        ? `تم نسخ رقم الطلب ${num}`
        : `Order number ${num} copied to clipboard!`,
    );
    setTimeout(() => setCopiedOrderId(null), 2000);
  };

  const handleReorder = (order: OrderRecord) => {
    order.items.forEach((item) => {
      addItem(
        {
          id: item.productId || item.id,
          name: item.productName,
          slug: item.productId || item.sku,
          sku: item.sku,
          price: Number(item.unitPrice),
          categoryId: "reorder",
          brandId: "reorder",
          isActive: true,
          images: [],
        },
        item.quantity,
      );
    });
    triggerToast(
      isRtl
        ? `تمت إضافة عناصر الطلب ${order.orderNumber} إلى السلة!`
        : `All items from ${order.orderNumber} added to cart!`,
    );
  };

  // Filter Logic
  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      const isDelivered =
        order.orderStatus === "DELIVERED" || order.orderStatus === "COMPLETED";
      const isCancelled = order.orderStatus === "CANCELLED";
      const isTakeaway = order.fulfillmentType === "STORE_PICKUP";

      if (activeTab === "in_progress") {
        if (isDelivered || isCancelled) return false;
      } else if (activeTab === "delivered") {
        if (!isDelivered) return false;
      } else if (activeTab === "takeaway") {
        if (!isTakeaway) return false;
      }

      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        const matchesNumber = order.orderNumber.toLowerCase().includes(query);
        const matchesItems = (order.items || []).some(
          (i) =>
            i.productName.toLowerCase().includes(query) ||
            i.sku.toLowerCase().includes(query),
        );
        return matchesNumber || matchesItems;
      }
      return true;
    });
  }, [orders, activeTab, searchQuery]);

  // KPI Calculations
  const totalSpent = useMemo(
    () => orders.reduce((acc, o) => acc + Number(o.totalAmount || 0), 0),
    [orders],
  );

  const activeCount = useMemo(
    () =>
      orders.filter(
        (o) =>
          o.orderStatus !== "DELIVERED" &&
          o.orderStatus !== "COMPLETED" &&
          o.orderStatus !== "CANCELLED",
      ).length,
    [orders],
  );

  const deliveredCount = useMemo(
    () =>
      orders.filter(
        (o) => o.orderStatus === "DELIVERED" || o.orderStatus === "COMPLETED",
      ).length,
    [orders],
  );

  // Unauthenticated Guard Screen
  if (!isAuthenticated) {
    return (
      <div className="w-full bg-slate-50/50 min-h-screen text-slate-900 font-sans pb-16">
        <div className="bg-white border-b border-slate-200/80 py-6 sm:py-8">
          <div className="w-full max-w-7xl md:max-w-4/5 mx-auto px-4 md:px-0">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-500 mb-3">
              <Link href="/" className="hover:text-emerald-700 transition">
                {tCommon("home")}
              </Link>
              {isRtl ? (
                <ChevronLeft className="w-3.5 h-3.5 text-slate-400" />
              ) : (
                <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
              )}
              <span className="text-slate-900 font-extrabold">
                {tOrders("pageTitle")}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-950 uppercase tracking-tight">
              {tOrders("pageTitle")}
            </h1>
          </div>
        </div>

        <div className="w-full max-w-7xl md:max-w-4/5 mx-auto px-4 md:px-0 pt-12">
          <div className="bg-white border border-slate-200/90 rounded-3xl p-8 sm:p-14 text-center max-w-md mx-auto shadow-sm space-y-5">
            <div className="w-16 h-16 rounded-2xl bg-emerald-50 text-emerald-700 border border-emerald-200/80 flex items-center justify-center mx-auto shadow-2xs">
              <Lock className="w-8 h-8 stroke-[1.75]" />
            </div>

            <div className="space-y-1.5">
              <h2 className="text-xl font-black text-slate-950 uppercase tracking-tight">
                {tCommon("login")}
              </h2>
              <p className="text-xs text-slate-500 font-medium leading-relaxed">
                {isRtl
                  ? "يرجى تسجيل الدخول لعرض قائمة طلباتك وتتبع الشحنات."
                  : "Please sign in with your account to view your past purchases, live tracking, and ZATCA tax invoices."}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <Link
                href="/login?redirect=/orders"
                className="w-full sm:w-auto bg-[#15803d] hover:bg-emerald-700 text-white font-extrabold text-xs px-6 py-3 rounded-xl uppercase tracking-wider transition shadow-2xs flex items-center justify-center gap-2 cursor-pointer"
              >
                <User className="w-4 h-4" />
                <span>{tCommon("login")}</span>
              </Link>
              <Link
                href="/register"
                className="w-full sm:w-auto bg-slate-100 hover:bg-slate-200 text-slate-800 font-extrabold text-xs px-6 py-3 rounded-xl uppercase tracking-wider transition flex items-center justify-center cursor-pointer"
              >
                {tCommon("register")}
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full bg-slate-50/50 min-h-screen text-slate-900 font-sans pb-16">
      {/* Toast Alert Banner */}
      {toastMessage && (
        <div className="fixed bottom-6 end-6 bg-slate-900 text-white text-xs font-bold px-4 py-3 rounded-xl shadow-2xl z-50 flex items-center gap-2 border border-slate-700 animate-in fade-in duration-200">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Header & Breadcrumbs */}
      <div className="bg-white border-b border-slate-200/80 py-6 sm:py-8">
        <div className="w-full max-w-7xl md:max-w-4/5 mx-auto px-4 md:px-0">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-500 mb-3">
            <Link href="/" className="hover:text-emerald-700 transition">
              {tCommon("home")}
            </Link>
            {isRtl ? (
              <ChevronLeft className="w-3.5 h-3.5 text-slate-400" />
            ) : (
              <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            )}
            <Link href="/profile" className="hover:text-emerald-700 transition">
              {tCommon("myAccount")}
            </Link>
            {isRtl ? (
              <ChevronLeft className="w-3.5 h-3.5 text-slate-400" />
            ) : (
              <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            )}
            <span className="text-slate-900 font-extrabold">
              {tOrders("pageTitle")}
            </span>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-black text-slate-950 uppercase tracking-tight relative inline-block">
                {tOrders("pageTitle")}
                <span className="absolute bottom-[-8px] start-0 w-full h-[3px] bg-[#FFD400] rounded-full" />
              </h1>
              <p className="text-xs sm:text-sm font-semibold text-slate-500 mt-2">
                {tOrders("pageSubtitle")}
              </p>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <Link
                href="/products"
                className="text-xs font-extrabold text-white bg-[#15803d] hover:bg-emerald-700 px-4 py-2.5 rounded-xl uppercase tracking-wider transition shadow-2xs flex items-center gap-1.5 cursor-pointer"
              >
                <ShoppingBag className="w-3.5 h-3.5" />
                <span>{tCommon("catalog")}</span>
              </Link>
              <Link
                href="/profile"
                className="text-xs font-extrabold text-slate-700 bg-slate-100 hover:bg-slate-200 px-4 py-2.5 rounded-xl border border-slate-200 transition cursor-pointer"
              >
                {tCommon("myAccount")}
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Main Body */}
      <div className="w-full max-w-7xl md:max-w-4/5 mx-auto px-4 md:px-0 pt-6 sm:pt-8 space-y-6">
        {/* KPI Summary Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-2xs space-y-1">
            <span className="text-[11px] font-black uppercase text-slate-400 tracking-wider">
              {tOrders("tabs.all")}
            </span>
            <div className="flex items-baseline justify-between">
              <span className="text-xl sm:text-2xl font-black text-slate-950">
                {orders.length}
              </span>
              <Package className="w-5 h-5 text-emerald-600" />
            </div>
          </div>

          <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-2xs space-y-1">
            <span className="text-[11px] font-black uppercase text-slate-400 tracking-wider">
              {tOrders("tabs.active")}
            </span>
            <div className="flex items-baseline justify-between">
              <span className="text-xl sm:text-2xl font-black text-amber-600">
                {activeCount}
              </span>
              <Truck className="w-5 h-5 text-amber-500" />
            </div>
          </div>

          <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-2xs space-y-1">
            <span className="text-[11px] font-black uppercase text-slate-400 tracking-wider">
              {tOrders("tabs.delivered")}
            </span>
            <div className="flex items-baseline justify-between">
              <span className="text-xl sm:text-2xl font-black text-emerald-700">
                {deliveredCount}
              </span>
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
            </div>
          </div>

          <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-2xs space-y-1">
            <span className="text-[11px] font-black uppercase text-slate-400 tracking-wider">
              {tCommon("total")}
            </span>
            <div className="flex items-baseline justify-between">
              <span className="text-lg sm:text-xl font-black text-slate-950">
                {tCommon("currency")}{" "}
                {totalSpent.toLocaleString(isRtl ? "ar-SA" : "en-US", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </span>
              <CreditCard className="w-5 h-5 text-blue-600" />
            </div>
          </div>
        </div>

        {/* Filter Toolbar Bar */}
        <div className="bg-white border border-slate-200/90 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-2xs">
          {/* Tab Filters */}
          <div className="flex items-center gap-2 border-b sm:border-b-0 border-slate-100 pb-2 sm:pb-0 w-full sm:w-auto overflow-x-auto no-scrollbar">
            {[
              { id: "all", label: `${tOrders("tabs.all")} (${orders.length})` },
              {
                id: "in_progress",
                label: `${tOrders("tabs.active")} (${activeCount})`,
              },
              {
                id: "delivered",
                label: `${tOrders("tabs.delivered")} (${deliveredCount})`,
              },
              { id: "takeaway", label: tOrders("tabs.takeaway") },
            ].map((tab) => {
              const isSelected = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as typeof activeTab)}
                  className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition cursor-pointer shrink-0 ${
                    isSelected
                      ? "bg-[#15803d] text-white shadow-2xs"
                      : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>

          {/* Search Box */}
          <div className="relative w-full sm:w-72">
            <input
              type="text"
              placeholder={tCommon("searchPlaceholder")}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full ps-9 pe-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:outline-none focus:border-emerald-600"
            />
            <Search className="w-4 h-4 text-slate-400 absolute start-3 top-2.5" />
          </div>
        </div>

        {/* Loading Skeleton */}
        {loading && (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="bg-white border border-slate-200 rounded-2xl p-6 h-48 animate-pulse"
              />
            ))}
          </div>
        )}

        {/* Error Alert */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-800 text-xs font-semibold p-4 rounded-2xl flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
              <span>{error}</span>
            </div>
            <button
              onClick={fetchOrders}
              className="underline font-bold hover:text-red-950 cursor-pointer"
            >
              {tOrders("trackStatus")}
            </button>
          </div>
        )}

        {/* Orders Card List */}
        {!loading && !error && (
          <div className="space-y-5">
            {filteredOrders.length === 0 ? (
              <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center space-y-4 shadow-2xs">
                <Package className="w-12 h-12 text-slate-300 mx-auto" />
                <h3 className="text-base font-black text-slate-950 uppercase">
                  {tOrders("noOrders")}
                </h3>
                <p className="text-xs text-slate-500 font-medium max-w-sm mx-auto">
                  {tOrders("noOrdersDesc")}
                </p>
                <div className="pt-2">
                  <Link
                    href="/products"
                    className="bg-[#15803d] hover:bg-emerald-700 text-white text-xs font-extrabold px-6 py-2.5 rounded-xl uppercase tracking-wider transition inline-block"
                  >
                    {tOrders("startShopping")}
                  </Link>
                </div>
              </div>
            ) : (
              filteredOrders.map((order) => {
                const totalAmt = Number(order.totalAmount || 0);
                const formattedDate = new Date(
                  order.createdAt,
                ).toLocaleDateString(isRtl ? "ar-SA" : "en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                });

                return (
                  <div
                    key={order.id}
                    className="bg-white border border-slate-200/90 rounded-2xl p-5 sm:p-6 space-y-4 shadow-2xs hover:border-slate-300 transition-all duration-300"
                  >
                    {/* Order Header Row */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-3">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
                          <span className="text-base font-black text-slate-950 uppercase tracking-tight flex items-center gap-1.5">
                            {order.orderNumber}
                            <button
                              onClick={() =>
                                handleCopyOrderNumber(order.orderNumber)
                              }
                              className="p-1 hover:bg-slate-100 rounded text-slate-400 hover:text-slate-700 transition cursor-pointer"
                              title="Copy Order Number"
                            >
                              {copiedOrderId === order.orderNumber ? (
                                <Check className="w-3.5 h-3.5 text-emerald-600" />
                              ) : (
                                <Copy className="w-3.5 h-3.5" />
                              )}
                            </button>
                          </span>

                          {/* Fulfillment Type Tag */}
                          {order.fulfillmentType === "STORE_PICKUP" ? (
                            <span className="bg-emerald-50 text-emerald-800 border border-emerald-200/80 text-[10px] font-black px-2.5 py-0.5 rounded-full inline-flex items-center gap-1">
                              <Store className="w-3 h-3 text-emerald-700" />
                              <span>
                                {isRtl ? "استلام من الفرع" : "STORE PICKUP"}
                              </span>
                            </span>
                          ) : (
                            <span className="bg-blue-50 text-blue-800 border border-blue-200/80 text-[10px] font-black px-2.5 py-0.5 rounded-full inline-flex items-center gap-1">
                              <Truck className="w-3 h-3 text-blue-700" />
                              <span>
                                {isRtl ? "توصيل للمنزل" : "HOME DELIVERY"}
                              </span>
                            </span>
                          )}

                          {/* Payment Method Badge */}
                          <span className="bg-slate-100 text-slate-700 border border-slate-200/80 text-[10px] font-extrabold px-2.5 py-0.5 rounded-full uppercase">
                            {order.paymentMethod.replace(/_/g, " ")}
                          </span>
                        </div>

                        <div className="flex items-center gap-2 text-xs font-semibold text-slate-400 pt-0.5">
                          <span>
                            {tOrders("placedOn", { date: formattedDate })}
                          </span>
                          <span>•</span>
                          <span>
                            {(order.items || []).length} {tCommon("item")}
                          </span>
                        </div>
                      </div>

                      {/* Status Badge */}
                      <div className="flex items-center gap-3 self-start sm:self-auto">
                        {order.orderStatus === "PENDING" && (
                          <span className="bg-amber-100 text-amber-900 border border-amber-300 text-xs font-black px-3.5 py-1.5 rounded-xl uppercase tracking-wider shadow-2xs inline-flex items-center gap-1.5">
                            <Clock className="w-4 h-4 text-amber-700" />
                            <span>{tOrders("status.pending")}</span>
                          </span>
                        )}
                        {(order.orderStatus === "CONFIRMED" ||
                          order.orderStatus === "PROCESSING") && (
                          <span className="bg-blue-600 text-white text-xs font-black px-3.5 py-1.5 rounded-xl uppercase tracking-wider shadow-2xs inline-flex items-center gap-1.5">
                            <Package className="w-4 h-4" />
                            <span>{tOrders("status.processing")}</span>
                          </span>
                        )}
                        {(order.orderStatus === "READY_FOR_PICKUP" ||
                          order.orderStatus === "READY_FOR_COLLECTION") && (
                          <span className="bg-[#15803d] text-white text-xs font-black px-3.5 py-1.5 rounded-xl uppercase tracking-wider shadow-2xs inline-flex items-center gap-1.5">
                            <Store className="w-4 h-4" />
                            <span>{tOrders("status.ready")}</span>
                          </span>
                        )}
                        {order.orderStatus === "OUT_FOR_DELIVERY" && (
                          <span className="bg-amber-500 text-slate-950 text-xs font-black px-3.5 py-1.5 rounded-xl uppercase tracking-wider shadow-2xs inline-flex items-center gap-1.5">
                            <Truck className="w-4 h-4" />
                            <span>{tOrders("status.outForDelivery")}</span>
                          </span>
                        )}
                        {(order.orderStatus === "DELIVERED" ||
                          order.orderStatus === "COMPLETED") && (
                          <span className="bg-slate-900 text-white text-xs font-black px-3.5 py-1.5 rounded-xl uppercase tracking-wider shadow-2xs inline-flex items-center gap-1.5">
                            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                            <span>{tOrders("status.delivered")}</span>
                          </span>
                        )}
                        {order.orderStatus === "CANCELLED" && (
                          <span className="bg-red-600 text-white text-xs font-black px-3.5 py-1.5 rounded-xl uppercase tracking-wider shadow-2xs inline-flex items-center gap-1.5">
                            <X className="w-4 h-4" />
                            <span>{tOrders("status.cancelled")}</span>
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Items List Table/Rows */}
                    <div className="space-y-3">
                      {(order.items || []).map((item) => {
                        const unitP = Number(item.unitPrice || 0);
                        const totalP = unitP * item.quantity;
                        return (
                          <div
                            key={item.id}
                            className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 sm:p-4 bg-slate-50/80 rounded-xl border border-slate-100"
                          >
                            <div className="flex items-center gap-3 sm:gap-4 flex-1">
                              <div className="w-12 h-12 rounded-xl bg-white border border-slate-200/80 p-1 shrink-0 flex items-center justify-center text-slate-400">
                                <Package className="w-6 h-6" />
                              </div>
                              <div className="space-y-0.5 flex-1">
                                <div className="flex items-center gap-2 text-[10px] font-black uppercase text-slate-400 tracking-wider">
                                  <span className="font-mono text-slate-500">
                                    SKU: {item.sku}
                                  </span>
                                </div>
                                <span className="text-xs sm:text-sm font-extrabold text-slate-900 block line-clamp-1">
                                  {item.productName}
                                </span>
                                <span className="text-xs font-semibold text-slate-500 block">
                                  {item.quantity} × {tCommon("currency")}{" "}
                                  {unitP.toFixed(2)}
                                </span>
                              </div>
                            </div>

                            <div className="flex items-center justify-between sm:justify-end gap-3 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-200/60">
                              <span className="text-xs sm:text-sm font-black text-slate-950">
                                {tCommon("currency")} {totalP.toFixed(2)}
                              </span>
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {/* Footer Totals & Actions Row */}
                    <div className="flex flex-col md:flex-row md:items-center justify-between pt-4 border-t border-slate-100 gap-4">
                      <div className="space-y-0.5">
                        <span className="text-xs font-semibold text-slate-500">
                          {tCommon("total")} ({tCommon("zatcaVatIncluded")}):
                        </span>
                        <div className="text-lg font-black text-slate-950">
                          {tCommon("currency")} {totalAmt.toFixed(2)}
                        </div>
                      </div>

                      <div className="flex items-center gap-2 flex-wrap">
                        <button
                          onClick={() => setSelectedOrderTracking(order)}
                          className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-extrabold transition flex items-center gap-1.5 cursor-pointer"
                        >
                          <Truck className="w-3.5 h-3.5" />
                          <span>{tOrders("trackStatus")}</span>
                        </button>

                        <button
                          onClick={() => setSelectedInvoiceOrder(order)}
                          className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-extrabold transition flex items-center gap-1.5 cursor-pointer"
                        >
                          <FileText className="w-3.5 h-3.5" />
                          <span>{tOrders("vatInvoice")}</span>
                        </button>

                        <button
                          onClick={() => handleReorder(order)}
                          className="px-4 py-2 bg-[#15803d] hover:bg-emerald-700 text-white rounded-xl text-xs font-extrabold transition flex items-center gap-1.5 cursor-pointer shadow-2xs"
                        >
                          <RotateCcw className="w-3.5 h-3.5" />
                          <span>{tOrders("buyAgain")}</span>
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        )}
      </div>

      {/* Tracking Modal */}
      {selectedOrderTracking && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider">
                  {tOrders("trackStatus")}
                </span>
                <h3 className="text-lg font-black text-slate-950 uppercase">
                  {selectedOrderTracking.orderNumber}
                </h3>
              </div>
              <button
                onClick={() => setSelectedOrderTracking(null)}
                className="p-1.5 rounded-full hover:bg-slate-100 text-slate-500 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                <span className="text-[10px] font-extrabold text-slate-400 uppercase">
                  {isRtl ? "عنوان الاستلام / التوصيل" : "Destination / Pickup"}
                </span>
                <p className="text-xs font-bold text-slate-800">
                  {selectedOrderTracking.shippingAddress}
                </p>
                <p className="text-xs text-slate-500 font-medium">
                  {tCommon("phone")}: {selectedOrderTracking.contactPhone}
                </p>
              </div>

              {/* Progress Bar */}
              <div className="space-y-3 pt-2">
                <div className="flex items-center justify-between text-xs font-bold text-slate-700">
                  <span>{tOrders("status.pending")}</span>
                  <span>{tOrders("status.processing")}</span>
                  <span>{tOrders("status.outForDelivery")}</span>
                  <span>{tOrders("status.delivered")}</span>
                </div>
                <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#15803d] rounded-full transition-all duration-500"
                    style={{
                      width:
                        selectedOrderTracking.orderStatus === "DELIVERED" ||
                        selectedOrderTracking.orderStatus === "COMPLETED"
                          ? "100%"
                          : selectedOrderTracking.orderStatus ===
                                "OUT_FOR_DELIVERY" ||
                              selectedOrderTracking.orderStatus ===
                                "READY_FOR_PICKUP"
                            ? "75%"
                            : selectedOrderTracking.orderStatus ===
                                  "CONFIRMED" ||
                                selectedOrderTracking.orderStatus ===
                                  "PROCESSING"
                              ? "50%"
                              : "25%",
                    }}
                  />
                </div>
              </div>
            </div>

            <button
              onClick={() => setSelectedOrderTracking(null)}
              className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-black uppercase tracking-wider transition cursor-pointer"
            >
              {tCommon("close")}
            </button>
          </div>
        </div>
      )}

      {/* VAT Invoice Preview Modal */}
      {selectedInvoiceOrder && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-2xl w-full shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <Logo href="/" size="sm" />
                <span className="text-[10px] font-black uppercase text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  {tCommon("zatcaVatBadge")}
                </span>
              </div>
              <button
                onClick={() => setSelectedInvoiceOrder(null)}
                className="p-1.5 rounded-full hover:bg-slate-100 text-slate-500 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-4 pb-4 border-b border-slate-100">
                <div>
                  <span className="text-[10px] font-extrabold text-slate-400 uppercase">
                    {tOrders("vatInvoice")}
                  </span>
                  <p className="font-black text-slate-900 mt-0.5">
                    {isRtl ? "رقم الفاتورة" : "Invoice"}: #
                    {selectedInvoiceOrder.orderNumber}
                  </p>
                  <p className="text-slate-500">
                    {new Date(selectedInvoiceOrder.createdAt).toLocaleString(
                      isRtl ? "ar-SA" : "en-US",
                    )}
                  </p>
                  <p className="text-slate-500">
                    {selectedInvoiceOrder.paymentMethod}
                  </p>
                </div>
                <div>
                  <span className="text-[10px] font-extrabold text-slate-400 uppercase">
                    {isRtl ? "بيانات العميل" : "Customer Details"}
                  </span>
                  <p className="font-black text-slate-900 mt-0.5">
                    {user?.firstName} {user?.lastName}
                  </p>
                  <p className="text-slate-500">{user?.email}</p>
                  <p className="text-slate-500">
                    {selectedInvoiceOrder.contactPhone}
                  </p>
                </div>
              </div>

              {/* Items Table */}
              <div className="divide-y divide-slate-100">
                <div className="grid grid-cols-12 font-black uppercase text-[10px] text-slate-400 pb-2">
                  <span className="col-span-6">
                    {isRtl ? "وصف المنتج" : "Item Description"}
                  </span>
                  <span className="col-span-2 text-center">
                    {isRtl ? "الكمية" : "Qty"}
                  </span>
                  <span className="col-span-2 text-right rtl:text-left">
                    {isRtl ? "السعر" : "Price"}
                  </span>
                  <span className="col-span-2 text-right rtl:text-left">
                    {tCommon("total")}
                  </span>
                </div>
                {(selectedInvoiceOrder.items || []).map((item) => (
                  <div
                    key={item.id}
                    className="grid grid-cols-12 py-2 text-xs font-semibold"
                  >
                    <span className="col-span-6 text-slate-900 font-bold truncate">
                      {item.productName}
                    </span>
                    <span className="col-span-2 text-center text-slate-600">
                      {item.quantity}
                    </span>
                    <span className="col-span-2 text-right rtl:text-left text-slate-600">
                      {tCommon("currency")} {Number(item.unitPrice).toFixed(2)}
                    </span>
                    <span className="col-span-2 text-right rtl:text-left font-black text-slate-950">
                      {tCommon("currency")}{" "}
                      {(Number(item.unitPrice) * item.quantity).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>

              {/* Summary */}
              <div className="border-t border-slate-200 pt-3 space-y-1.5 text-right rtl:text-left font-bold">
                <div className="flex justify-between text-slate-500 text-xs">
                  <span>{tCommon("subtotal")}:</span>
                  <span>
                    {tCommon("currency")}{" "}
                    {(Number(selectedInvoiceOrder.totalAmount) / 1.15).toFixed(
                      2,
                    )}
                  </span>
                </div>
                <div className="flex justify-between text-slate-500 text-xs">
                  <span>{tCommon("zatcaVatIncluded")}:</span>
                  <span>
                    {tCommon("currency")}{" "}
                    {(
                      Number(selectedInvoiceOrder.totalAmount) -
                      Number(selectedInvoiceOrder.totalAmount) / 1.15
                    ).toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between text-slate-950 text-sm font-black pt-1 border-t border-slate-100">
                  <span>{tCommon("total")}:</span>
                  <span>
                    {tCommon("currency")}{" "}
                    {Number(selectedInvoiceOrder.totalAmount).toFixed(2)}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={() => window.print()}
                className="flex-1 py-2.5 bg-[#15803d] hover:bg-emerald-700 text-white rounded-xl text-xs font-black uppercase tracking-wider transition flex items-center justify-center gap-2 cursor-pointer shadow-2xs"
              >
                <Printer className="w-4 h-4" />
                <span>
                  {isRtl ? "طباعة الفاتورة الضريبية" : "Print Tax Invoice"}
                </span>
              </button>
              <button
                onClick={() => setSelectedInvoiceOrder(null)}
                className="py-2.5 px-5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-extrabold transition cursor-pointer"
              >
                {tCommon("close")}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
