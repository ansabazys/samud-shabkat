"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import {
  ChevronRight,
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
} from "lucide-react";
import { useCartStore } from "@/store/cart-store";

export interface OrderItem {
  id: string;
  name: string;
  sku: string;
  image: string;
  quantity: number;
  price: number;
  brand?: string;
  category?: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  date: string;
  fulfillmentType: "delivery" | "takeaway";
  status:
    | "processing"
    | "dispatched"
    | "delivered"
    | "ready_for_pickup"
    | "cancelled";
  paymentStatus: "paid" | "pending_store_pickup" | "cod";
  paymentMethod:
    "Mada / Visa" | "Tabby 4x Pay" | "Cash on Delivery" | "Cash on Pickup";
  subtotalAmount: number;
  vatAmount: number;
  totalAmount: number;
  items: OrderItem[];
  trackingNumber?: string;
  carrier?: string;
  storeLocation?: string;
  customerName: string;
  customerPhone: string;
  shippingAddress?: string;
  zatcaQrCodeUrl?: string;
}

const MOCK_ORDERS: Order[] = [
  {
    id: "ord-1",
    orderNumber: "ORD-984214",
    date: "August 20, 2026",
    fulfillmentType: "delivery",
    status: "dispatched",
    paymentStatus: "cod",
    paymentMethod: "Cash on Delivery",
    subtotalAmount: 4250.0,
    vatAmount: 637.5,
    totalAmount: 4887.5,
    trackingNumber: "SMSA-8849201",
    carrier: "SMSA Express",
    customerName: "Ahmed Al-Mansoor",
    customerPhone: "+966 50 123 4567",
    shippingAddress:
      "Building 42, King Fahd Road, Olaya District, Riyadh 12211, KSA",
    items: [
      {
        id: "cat-prod-1",
        name: "Cisco Catalyst 9300 48-Port Managed PoE+ Switch (740W)",
        sku: "CS-C9300-48P",
        brand: "Cisco",
        category: "Networking",
        image:
          "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=300&auto=format&fit=crop",
        quantity: 1,
        price: 4250.0,
      },
    ],
  },
  {
    id: "ord-2",
    orderNumber: "ORD-761920",
    date: "August 18, 2026",
    fulfillmentType: "takeaway",
    status: "ready_for_pickup",
    paymentStatus: "pending_store_pickup",
    paymentMethod: "Cash on Pickup",
    storeLocation: "Riyadh Main Store - Olaya Computer Market, Store #14",
    subtotalAmount: 12499.0,
    vatAmount: 1874.85,
    totalAmount: 14373.85,
    customerName: "Ahmed Al-Mansoor",
    customerPhone: "+966 50 123 4567",
    items: [
      {
        id: "cat-prod-3",
        name: 'Apple MacBook Pro 16" M3 Max 36GB / 1TB SSD Space Black',
        sku: "APL-MBP16-M3M",
        brand: "Apple",
        category: "Computers",
        image:
          "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=300&auto=format&fit=crop",
        quantity: 2,
        price: 5699.0,
      },
      {
        id: "cat-prod-8",
        name: "Logitech MX Keys S Wireless Illumination Keyboard",
        sku: "LOG-MXKEYS-S",
        brand: "Logitech",
        category: "Accessories",
        image:
          "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=300&auto=format&fit=crop",
        quantity: 2,
        price: 480.0,
      },
    ],
  },
  {
    id: "ord-3",
    orderNumber: "ORD-541902",
    date: "August 10, 2026",
    fulfillmentType: "delivery",
    status: "delivered",
    paymentStatus: "paid",
    paymentMethod: "Tabby 4x Pay",
    subtotalAmount: 1950.0,
    vatAmount: 292.5,
    totalAmount: 2242.5,
    trackingNumber: "ARAMEX-992014",
    carrier: "Aramex Express",
    customerName: "Ahmed Al-Mansoor",
    customerPhone: "+966 50 123 4567",
    shippingAddress: "Villa 18, Al-Yasmin District, Riyadh 13322, KSA",
    items: [
      {
        id: "cat-prod-2",
        name: "Ubiquiti UniFi Dream Machine Pro Security Gateway",
        sku: "UBQ-UDM-PRO",
        brand: "Ubiquiti",
        category: "Networking",
        image:
          "https://images.unsplash.com/photo-1543512214-318c7553f230?w=300&auto=format&fit=crop",
        quantity: 1,
        price: 1950.0,
      },
    ],
  },
  {
    id: "ord-4",
    orderNumber: "ORD-319084",
    date: "July 28, 2026",
    fulfillmentType: "delivery",
    status: "delivered",
    paymentStatus: "paid",
    paymentMethod: "Mada / Visa",
    subtotalAmount: 6450.0,
    vatAmount: 967.5,
    totalAmount: 7417.5,
    trackingNumber: "SMSA-7730192",
    carrier: "SMSA Express",
    customerName: "Ahmed Al-Mansoor",
    customerPhone: "+966 50 123 4567",
    shippingAddress: "Villa 18, Al-Yasmin District, Riyadh 13322, KSA",
    items: [
      {
        id: "cat-prod-4",
        name: "Synology DiskStation DS1823xs+ 8-Bay Enterprise NAS",
        sku: "SYN-DS1823XS",
        brand: "Synology",
        category: "Storage & NAS",
        image:
          "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=300&auto=format&fit=crop",
        quantity: 1,
        price: 6450.0,
      },
    ],
  },
];

export default function OrdersPage() {
  const [activeTab, setActiveTab] = useState<
    "all" | "in_progress" | "delivered" | "takeaway"
  >("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedOrderTracking, setSelectedOrderTracking] =
    useState<Order | null>(null);
  const [selectedInvoiceOrder, setSelectedInvoiceOrder] =
    useState<Order | null>(null);
  const [copiedOrderId, setCopiedOrderId] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const addItem = useCartStore((state) => state.addItem);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleCopyOrderNumber = (num: string) => {
    navigator.clipboard.writeText(num);
    setCopiedOrderId(num);
    triggerToast(`Order number ${num} copied to clipboard!`);
    setTimeout(() => setCopiedOrderId(null), 2000);
  };

  const handleReorder = (order: Order) => {
    order.items.forEach((item) => {
      addItem(
        {
          id: item.id,
          name: item.name,
          slug: item.id,
          sku: item.sku,
          price: item.price,
          categoryId: "cat-1",
          brandId: "brand-1",
          isActive: true,
          images: [{ id: "img-1", url: item.image, isPrimary: true }],
        },
        item.quantity,
      );
    });
    triggerToast(
      `All ${order.items.length} items from ${order.orderNumber} added to cart!`,
    );
  };

  // Filter Logic
  const filteredOrders = useMemo(() => {
    return MOCK_ORDERS.filter((order) => {
      if (activeTab === "in_progress") {
        if (order.status === "delivered" || order.status === "cancelled")
          return false;
      } else if (activeTab === "delivered") {
        if (order.status !== "delivered") return false;
      } else if (activeTab === "takeaway") {
        if (order.fulfillmentType !== "takeaway") return false;
      }

      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        const matchesNumber = order.orderNumber.toLowerCase().includes(query);
        const matchesItems = order.items.some(
          (i) =>
            i.name.toLowerCase().includes(query) ||
            i.sku.toLowerCase().includes(query) ||
            (i.brand && i.brand.toLowerCase().includes(query)),
        );
        return matchesNumber || matchesItems;
      }
      return true;
    });
  }, [activeTab, searchQuery]);

  // KPI Calculations
  const totalSpent = useMemo(
    () => MOCK_ORDERS.reduce((acc, o) => acc + o.totalAmount, 0),
    [],
  );
  const activeCount = useMemo(
    () =>
      MOCK_ORDERS.filter(
        (o) =>
          o.status === "processing" ||
          o.status === "dispatched" ||
          o.status === "ready_for_pickup",
      ).length,
    [],
  );
  const deliveredCount = useMemo(
    () => MOCK_ORDERS.filter((o) => o.status === "delivered").length,
    [],
  );

  return (
    <div className="w-full bg-slate-50/50 min-h-screen text-slate-900 font-sans pb-16">
      {/* Toast Alert Banner */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 bg-slate-900 text-white text-xs font-bold px-4 py-3 rounded-xl shadow-2xl z-50 flex items-center gap-2 border border-slate-700 animate-in fade-in slide-in-from-bottom-3 duration-200">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Header & Breadcrumbs */}
      <div className="bg-white border-b border-slate-200/80 py-6 sm:py-8">
        <div className="w-full max-w-7xl md:max-w-4/5 mx-auto px-4 md:px-0">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-500 mb-3">
            <Link href="/" className="hover:text-emerald-700 transition">
              Home
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            <Link href="/profile" className="hover:text-emerald-700 transition">
              My Account
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-slate-900 font-extrabold">My Orders</span>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-black text-slate-950 uppercase tracking-tight relative inline-block">
                My Orders & Purchases
                <span className="absolute bottom-[-8px] left-0 w-full h-[3px] bg-[#FFD400] rounded-full" />
              </h1>
              <p className="text-xs sm:text-sm font-semibold text-slate-500 mt-2">
                Track live KSA courier deliveries, store takeaway pick-ups, and
                download official ZATCA VAT tax invoices.
              </p>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <Link
                href="/products"
                className="text-xs font-extrabold text-white bg-[#15803d] hover:bg-emerald-700 px-4 py-2.5 rounded-xl uppercase tracking-wider transition shadow-2xs flex items-center gap-1.5"
              >
                <ShoppingBag className="w-3.5 h-3.5" />
                <span>Browse Catalog</span>
              </Link>
              <Link
                href="/profile"
                className="text-xs font-extrabold text-slate-700 bg-slate-100 hover:bg-slate-200 px-4 py-2.5 rounded-xl border border-slate-200 transition"
              >
                Account Info
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
              Total Orders
            </span>
            <div className="flex items-baseline justify-between">
              <span className="text-xl sm:text-2xl font-black text-slate-950">
                {MOCK_ORDERS.length}
              </span>
              <Package className="w-5 h-5 text-emerald-600" />
            </div>
          </div>

          <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-2xs space-y-1">
            <span className="text-[11px] font-black uppercase text-slate-400 tracking-wider">
              Active Shipments
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
              Delivered
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
              Total Value (SAR)
            </span>
            <div className="flex items-baseline justify-between">
              <span className="text-lg sm:text-xl font-black text-slate-950">
                SAR{" "}
                {totalSpent.toLocaleString("en-US", {
                  minimumFractionDigits: 2,
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
              { id: "all", label: `All Orders (${MOCK_ORDERS.length})` },
              { id: "in_progress", label: `Active & Pickup (${activeCount})` },
              { id: "delivered", label: `Delivered (${deliveredCount})` },
              { id: "takeaway", label: "Store Takeaway" },
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
              placeholder="Search by order #, SKU, or product..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:outline-none focus:border-emerald-600"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          </div>
        </div>

        {/* Orders Card List */}
        <div className="space-y-5">
          {filteredOrders.length === 0 ? (
            <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center space-y-4 shadow-2xs">
              <Package className="w-12 h-12 text-slate-300 mx-auto" />
              <h3 className="text-base font-black text-slate-900 uppercase">
                No Orders Match Your Filter
              </h3>
              <p className="text-xs text-slate-500 font-medium max-w-sm mx-auto">
                We couldn&apos;t find any purchases matching your selected
                filter or search term.
              </p>
              <button
                onClick={() => {
                  setActiveTab("all");
                  setSearchQuery("");
                }}
                className="bg-slate-900 text-white text-xs font-extrabold px-4 py-2 rounded-xl uppercase tracking-wider"
              >
                Clear Search & Filters
              </button>
            </div>
          ) : (
            filteredOrders.map((order) => (
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
                      {order.fulfillmentType === "takeaway" ? (
                        <span className="bg-emerald-50 text-emerald-800 border border-emerald-200/80 text-[10px] font-black px-2.5 py-0.5 rounded-full inline-flex items-center gap-1">
                          <Store className="w-3 h-3 text-emerald-700" />
                          <span>STORE TAKEAWAY</span>
                        </span>
                      ) : (
                        <span className="bg-blue-50 text-blue-800 border border-blue-200/80 text-[10px] font-black px-2.5 py-0.5 rounded-full inline-flex items-center gap-1">
                          <Truck className="w-3 h-3 text-blue-700" />
                          <span>EXPRESS HOME DELIVERY</span>
                        </span>
                      )}

                      {/* Payment Method Badge */}
                      <span className="bg-slate-100 text-slate-700 border border-slate-200/80 text-[10px] font-extrabold px-2.5 py-0.5 rounded-full">
                        {order.paymentMethod}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-xs font-semibold text-slate-400 pt-0.5">
                      <span>Placed on {order.date}</span>
                      <span>•</span>
                      <span>
                        {order.items.length} Item
                        {order.items.length > 1 ? "s" : ""}
                      </span>
                    </div>
                  </div>

                  {/* Status Badge */}
                  <div className="flex items-center gap-3 self-start sm:self-auto">
                    {order.status === "dispatched" && (
                      <span className="bg-amber-500 text-slate-950 text-xs font-black px-3.5 py-1.5 rounded-xl uppercase tracking-wider shadow-2xs inline-flex items-center gap-1.5">
                        <Truck className="w-4 h-4" />
                        <span>IN TRANSIT</span>
                      </span>
                    )}
                    {order.status === "ready_for_pickup" && (
                      <span className="bg-[#15803d] text-white text-xs font-black px-3.5 py-1.5 rounded-xl uppercase tracking-wider shadow-2xs inline-flex items-center gap-1.5">
                        <Store className="w-4 h-4" />
                        <span>READY FOR PICKUP</span>
                      </span>
                    )}
                    {order.status === "delivered" && (
                      <span className="bg-slate-900 text-white text-xs font-black px-3.5 py-1.5 rounded-xl uppercase tracking-wider shadow-2xs inline-flex items-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                        <span>DELIVERED</span>
                      </span>
                    )}
                  </div>
                </div>

                {/* Items List Table/Rows */}
                <div className="space-y-3">
                  {order.items.map((item) => (
                    <div
                      key={item.id}
                      className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 sm:p-4 bg-slate-50/80 rounded-xl border border-slate-100"
                    >
                      <div className="flex items-center gap-3 sm:gap-4 flex-1">
                        <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl bg-white border border-slate-200/80 p-1.5 shrink-0 overflow-hidden">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-full h-full object-cover rounded-lg"
                          />
                        </div>
                        <div className="space-y-0.5 flex-1">
                          <div className="flex items-center gap-2 text-[10px] font-black uppercase text-slate-400 tracking-wider">
                            <span>{item.brand}</span>
                            <span>•</span>
                            <span className="text-emerald-700">
                              {item.category}
                            </span>
                            <span>•</span>
                            <span className="font-mono text-slate-500">
                              SKU: {item.sku}
                            </span>
                          </div>
                          <Link
                            href={`/products/${item.id}`}
                            className="text-xs sm:text-sm font-extrabold text-slate-900 hover:text-emerald-700 transition-colors line-clamp-1"
                          >
                            {item.name}
                          </Link>
                          <span className="text-xs font-semibold text-slate-500 block">
                            Qty: {item.quantity} × SAR{" "}
                            {item.price.toLocaleString("en-US", {
                              minimumFractionDigits: 2,
                            })}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between sm:justify-end gap-3 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-200/60">
                        <span className="text-xs sm:text-sm font-black text-slate-950">
                          SAR{" "}
                          {(item.price * item.quantity).toLocaleString(
                            "en-US",
                            { minimumFractionDigits: 2 },
                          )}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Footer Totals & Actions Row */}
                <div className="flex flex-col md:flex-row md:items-center justify-between pt-4 border-t border-slate-100 gap-4">
                  <div className="space-y-0.5">
                    <div className="flex items-baseline gap-2">
                      <span className="text-xs font-bold text-slate-500">
                        Total Amount:
                      </span>
                      <span className="text-base font-black text-slate-950">
                        SAR{" "}
                        {order.totalAmount.toLocaleString("en-US", {
                          minimumFractionDigits: 2,
                        })}
                      </span>
                      <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200/60">
                        Incl. 15% VAT (SAR{" "}
                        {order.vatAmount.toLocaleString("en-US", {
                          minimumFractionDigits: 2,
                        })}
                        )
                      </span>
                    </div>

                    {order.storeLocation && (
                      <span className="text-xs font-semibold text-emerald-800 block flex items-center gap-1 pt-1">
                        <Store className="w-3.5 h-3.5 shrink-0" />
                        Pickup Location: {order.storeLocation}
                      </span>
                    )}

                    {order.shippingAddress && (
                      <span className="text-xs font-semibold text-slate-600 block flex items-center gap-1 pt-0.5">
                        <Truck className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        Deliver to: {order.shippingAddress}
                      </span>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      onClick={() => setSelectedOrderTracking(order)}
                      className="bg-slate-100 hover:bg-slate-200 text-slate-900 text-xs font-black px-3.5 py-2.5 rounded-xl uppercase tracking-wider transition cursor-pointer flex items-center gap-1.5"
                    >
                      <Clock className="w-3.5 h-3.5 text-emerald-700" />
                      <span>Track Status</span>
                    </button>

                    <button
                      onClick={() => setSelectedInvoiceOrder(order)}
                      className="bg-white hover:bg-slate-50 text-slate-900 border border-slate-200 text-xs font-black px-3.5 py-2.5 rounded-xl uppercase tracking-wider transition cursor-pointer flex items-center gap-1.5 shadow-2xs"
                    >
                      <FileText className="w-3.5 h-3.5 text-blue-600" />
                      <span>ZATCA VAT Invoice</span>
                    </button>

                    <button
                      onClick={() => handleReorder(order)}
                      className="bg-[#15803d] hover:bg-emerald-700 text-white text-xs font-extrabold px-4 py-2.5 rounded-xl uppercase tracking-wider transition cursor-pointer flex items-center gap-1.5 shadow-2xs"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>Reorder Items</span>
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* 1. Live Order Tracking Modal */}
      {selectedOrderTracking && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-6 shadow-2xl border border-slate-200 animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <span className="text-[10px] font-black uppercase text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full tracking-wider">
                  LIVE SHIPMENT TRACKING
                </span>
                <h3 className="text-base font-black text-slate-950 uppercase tracking-tight mt-1">
                  Order {selectedOrderTracking.orderNumber}
                </h3>
              </div>
              <button
                onClick={() => setSelectedOrderTracking(null)}
                className="p-1 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Courier Info Box */}
            <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-4 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-extrabold text-slate-500">
                  Fulfillment Method
                </span>
                <span className="text-xs font-black text-slate-900 uppercase">
                  {selectedOrderTracking.fulfillmentType === "takeaway"
                    ? "Store Pickup"
                    : selectedOrderTracking.carrier || "SMSA Express"}
                </span>
              </div>
              {selectedOrderTracking.trackingNumber && (
                <div className="flex items-center justify-between pt-2 border-t border-slate-200/60">
                  <span className="text-xs font-extrabold text-slate-500">
                    Tracking Number
                  </span>
                  <span className="text-xs font-mono font-black text-emerald-700">
                    {selectedOrderTracking.trackingNumber}
                  </span>
                </div>
              )}
            </div>

            {/* Timeline Steps */}
            <div className="space-y-6 pl-4 border-l-2 border-emerald-600 py-1">
              {/* Step 1 */}
              <div className="relative">
                <div className="w-4 h-4 rounded-full bg-emerald-600 text-white flex items-center justify-center absolute -left-[25px] top-0.5">
                  <Check className="w-2.5 h-2.5 stroke-[3]" />
                </div>
                <h4 className="text-xs font-extrabold text-slate-900 uppercase tracking-wide">
                  Order Placed & Confirmed
                </h4>
                <p className="text-[11px] font-medium text-slate-500">
                  {selectedOrderTracking.date} • Received by Samud Shabkat
                </p>
              </div>

              {/* Step 2 */}
              <div className="relative">
                <div className="w-4 h-4 rounded-full bg-emerald-600 text-white flex items-center justify-center absolute -left-[25px] top-0.5">
                  <Check className="w-2.5 h-2.5 stroke-[3]" />
                </div>
                <h4 className="text-xs font-extrabold text-slate-900 uppercase tracking-wide">
                  Payment Verified & ZATCA Invoice Generated
                </h4>
                <p className="text-[11px] font-medium text-slate-500">
                  15% VAT tax invoice issued for{" "}
                  {selectedOrderTracking.customerName}
                </p>
              </div>

              {/* Step 3 */}
              <div className="relative">
                <div
                  className={`w-4 h-4 rounded-full flex items-center justify-center absolute -left-[25px] top-0.5 ${
                    selectedOrderTracking.status !== "processing"
                      ? "bg-emerald-600 text-white"
                      : "bg-amber-400 text-slate-950"
                  }`}
                >
                  <Check className="w-2.5 h-2.5 stroke-[3]" />
                </div>
                <h4 className="text-xs font-extrabold text-slate-900 uppercase tracking-wide">
                  Warehouse Packaged & Serial Checked
                </h4>
                <p className="text-[11px] font-medium text-slate-500">
                  Olaya Central Hub • Quality inspection completed
                </p>
              </div>

              {/* Step 4 */}
              <div className="relative">
                <div
                  className={`w-4 h-4 rounded-full flex items-center justify-center absolute -left-[25px] top-0.5 ${
                    selectedOrderTracking.status === "delivered"
                      ? "bg-emerald-600 text-white"
                      : selectedOrderTracking.status === "dispatched" ||
                          selectedOrderTracking.status === "ready_for_pickup"
                        ? "bg-amber-400 text-slate-950"
                        : "bg-slate-300 text-slate-600"
                  }`}
                >
                  <Truck className="w-2.5 h-2.5" />
                </div>
                <h4 className="text-xs font-extrabold text-slate-900 uppercase tracking-wide">
                  {selectedOrderTracking.fulfillmentType === "takeaway"
                    ? "Ready at Riyadh Main Store"
                    : "In Transit with Courier"}
                </h4>
                <p className="text-[11px] font-medium text-slate-500">
                  {selectedOrderTracking.fulfillmentType === "takeaway"
                    ? "Ready for pickup at Olaya Computer Market"
                    : "Handed over to SMSA Express for KSA Delivery"}
                </p>
              </div>

              {/* Step 5 */}
              <div className="relative">
                <div
                  className={`w-4 h-4 rounded-full flex items-center justify-center absolute -left-[25px] top-0.5 ${
                    selectedOrderTracking.status === "delivered"
                      ? "bg-emerald-600 text-white"
                      : "bg-slate-200 text-slate-400"
                  }`}
                >
                  <CheckCircle2 className="w-2.5 h-2.5" />
                </div>
                <h4 className="text-xs font-extrabold text-slate-900 uppercase tracking-wide">
                  Delivery / Collection Completed
                </h4>
                <p className="text-[11px] font-medium text-slate-500">
                  {selectedOrderTracking.status === "delivered"
                    ? "Successfully signed and delivered"
                    : "Pending final delivery confirmation"}
                </p>
              </div>
            </div>

            <button
              onClick={() => setSelectedOrderTracking(null)}
              className="w-full bg-slate-900 hover:bg-slate-800 text-white text-xs font-extrabold py-3.5 rounded-xl uppercase tracking-wider transition cursor-pointer"
            >
              Close Live Tracking
            </button>
          </div>
        </div>
      )}

      {/* 2. ZATCA VAT Tax Invoice Printable Modal */}
      {selectedInvoiceOrder && (
        <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-10 space-y-6 shadow-2xl border border-slate-200 animate-in zoom-in-95 duration-200 my-8">
            {/* Modal Top Actions */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-4 no-print">
              <span className="text-xs font-black uppercase text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full">
                ZATCA Tax Invoice Preview
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => window.print()}
                  className="bg-[#15803d] hover:bg-emerald-700 text-white text-xs font-extrabold px-4 py-2 rounded-xl uppercase tracking-wider flex items-center gap-1.5 cursor-pointer transition shadow-2xs"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print Tax Invoice</span>
                </button>
                <button
                  onClick={() => setSelectedInvoiceOrder(null)}
                  className="p-1.5 rounded-xl hover:bg-slate-100 text-slate-500 cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Official Printable Tax Invoice Layout */}
            <div className="space-y-6 text-slate-900 font-sans print:p-0">
              {/* Header Box */}
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-6 border-b border-slate-200">
                <div className="space-y-1">
                  <h2 className="text-xl font-black tracking-tight text-slate-950 uppercase">
                    samud<span className="text-emerald-600">.</span>shabkat
                  </h2>
                  <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                    SAMUD SHABKAT FOR TRADING & HARDWARE LTD.
                  </p>
                  <p className="text-[10px] text-slate-500 font-medium">
                    Commercial Reg (CR): 1010884920 • VAT ID: 300928174900003
                  </p>
                  <p className="text-[10px] text-slate-500 font-medium">
                    Olaya Computer Market, Building 14, Riyadh, Kingdom of Saudi
                    Arabia
                  </p>
                </div>

                <div className="text-left sm:text-right space-y-1">
                  <span className="inline-block bg-slate-900 text-white text-xs font-black px-3 py-1 rounded uppercase tracking-wider">
                    ZATCA TAX INVOICE
                  </span>
                  <div className="text-xs font-extrabold text-slate-900 pt-1">
                    Invoice #:{" "}
                    <span className="font-mono">
                      INV-{selectedInvoiceOrder.orderNumber}
                    </span>
                  </div>
                  <div className="text-[11px] font-medium text-slate-500">
                    Date: {selectedInvoiceOrder.date}
                  </div>
                </div>
              </div>

              {/* Customer & Payment Info Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-200/80 text-xs">
                <div className="space-y-1">
                  <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider block">
                    Billed & Delivered To:
                  </span>
                  <span className="font-extrabold text-slate-900 block">
                    {selectedInvoiceOrder.customerName}
                  </span>
                  <span className="font-semibold text-slate-600 block">
                    Phone: {selectedInvoiceOrder.customerPhone}
                  </span>
                  {selectedInvoiceOrder.shippingAddress && (
                    <span className="font-medium text-slate-500 block">
                      Address: {selectedInvoiceOrder.shippingAddress}
                    </span>
                  )}
                </div>

                <div className="space-y-1 sm:text-right">
                  <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider block">
                    Payment & Fulfillment Details:
                  </span>
                  <span className="font-extrabold text-emerald-800 block">
                    Method: {selectedInvoiceOrder.paymentMethod}
                  </span>
                  <span className="font-semibold text-slate-600 block">
                    Status: {selectedInvoiceOrder.paymentStatus.toUpperCase()}
                  </span>
                  <span className="font-medium text-slate-500 block">
                    Type:{" "}
                    {selectedInvoiceOrder.fulfillmentType === "takeaway"
                      ? "Store Pickup"
                      : "Express Delivery"}
                  </span>
                </div>
              </div>

              {/* Itemized Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b-2 border-slate-900 text-[10px] font-black uppercase tracking-wider text-slate-600">
                      <th className="py-2.5 px-2">Item Description</th>
                      <th className="py-2.5 px-2">SKU</th>
                      <th className="py-2.5 px-2 text-center">Qty</th>
                      <th className="py-2.5 px-2 text-right">Unit Price</th>
                      <th className="py-2.5 px-2 text-right">VAT (15%)</th>
                      <th className="py-2.5 px-2 text-right">Total (SAR)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-medium text-slate-800">
                    {selectedInvoiceOrder.items.map((item) => {
                      const itemSubtotal = item.price * item.quantity;
                      const itemVat = itemSubtotal * 0.15;
                      const itemTotal = itemSubtotal + itemVat;
                      return (
                        <tr key={item.id}>
                          <td className="py-3 px-2 font-bold text-slate-950">
                            {item.name}
                          </td>
                          <td className="py-3 px-2 font-mono text-[11px] text-slate-500">
                            {item.sku}
                          </td>
                          <td className="py-3 px-2 text-center font-bold">
                            {item.quantity}
                          </td>
                          <td className="py-3 px-2 text-right">
                            SAR{" "}
                            {item.price.toLocaleString("en-US", {
                              minimumFractionDigits: 2,
                            })}
                          </td>
                          <td className="py-3 px-2 text-right text-slate-500">
                            SAR{" "}
                            {itemVat.toLocaleString("en-US", {
                              minimumFractionDigits: 2,
                            })}
                          </td>
                          <td className="py-3 px-2 text-right font-black text-slate-950">
                            SAR{" "}
                            {itemTotal.toLocaleString("en-US", {
                              minimumFractionDigits: 2,
                            })}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Totals & ZATCA QR Box */}
              <div className="flex flex-col sm:flex-row items-center justify-between pt-4 border-t-2 border-slate-900 gap-6">
                {/* Simulated ZATCA QR Code */}
                <div className="flex items-center gap-3 bg-slate-50 p-3 rounded-xl border border-slate-200">
                  <div className="w-16 h-16 bg-slate-900 p-1 rounded flex items-center justify-center text-white shrink-0">
                    <div className="grid grid-cols-3 gap-0.5 w-full h-full p-1 bg-white">
                      <div className="bg-slate-900" />
                      <div className="bg-white" />
                      <div className="bg-slate-900" />
                      <div className="bg-white" />
                      <div className="bg-slate-900" />
                      <div className="bg-white" />
                      <div className="bg-slate-900" />
                      <div className="bg-slate-900" />
                      <div className="bg-slate-900" />
                    </div>
                  </div>
                  <div className="text-[10px] space-y-0.5 text-slate-500 font-medium">
                    <span className="font-bold text-slate-900 block">
                      ZATCA Compliant Invoice
                    </span>
                    <span>Verified Saudi Tax Timestamp</span>
                    <span className="block font-mono text-[9px]">
                      ID: 300928174900003
                    </span>
                  </div>
                </div>

                {/* Final Calculation Table */}
                <div className="w-full sm:w-64 space-y-1.5 text-xs font-bold text-slate-700">
                  <div className="flex justify-between">
                    <span>Subtotal (Excl. VAT):</span>
                    <span>
                      SAR{" "}
                      {selectedInvoiceOrder.subtotalAmount.toLocaleString(
                        "en-US",
                        { minimumFractionDigits: 2 },
                      )}
                    </span>
                  </div>
                  <div className="flex justify-between text-slate-500">
                    <span>VAT (15% Saudi Tax):</span>
                    <span>
                      SAR{" "}
                      {selectedInvoiceOrder.vatAmount.toLocaleString("en-US", {
                        minimumFractionDigits: 2,
                      })}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm font-black text-slate-950 pt-2 border-t border-slate-200">
                    <span>Grand Total:</span>
                    <span>
                      SAR{" "}
                      {selectedInvoiceOrder.totalAmount.toLocaleString(
                        "en-US",
                        { minimumFractionDigits: 2 },
                      )}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 flex justify-end no-print">
              <button
                onClick={() => setSelectedInvoiceOrder(null)}
                className="bg-slate-900 text-white text-xs font-extrabold px-6 py-2.5 rounded-xl uppercase tracking-wider cursor-pointer"
              >
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
