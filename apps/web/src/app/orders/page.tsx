"use client";

import { useState } from "react";
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
} from "lucide-react";
import { useCartStore } from "@/store/cart-store";

interface Order {
  id: string;
  orderNumber: string;
  date: string;
  fulfillmentType: "delivery" | "takeaway";
  status: "processing" | "dispatched" | "delivered" | "ready_for_pickup";
  paymentStatus: "paid" | "pending_store_pickup" | "cod";
  totalAmount: number;
  vatAmount: number;
  items: {
    id: string;
    name: string;
    image: string;
    quantity: number;
    price: number;
  }[];
  trackingNumber?: string;
  storeLocation?: string;
}

const MOCK_ORDERS: Order[] = [
  {
    id: "ord-1",
    orderNumber: "ORD-984214",
    date: "August 12, 2026",
    fulfillmentType: "delivery",
    status: "dispatched",
    paymentStatus: "cod",
    totalAmount: 4887.5,
    vatAmount: 637.5,
    trackingNumber: "SMSA-8849201",
    items: [
      {
        id: "cat-prod-1",
        name: "Cisco Catalyst 9300 48-Port Managed PoE+ Switch",
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
    date: "August 04, 2026",
    fulfillmentType: "takeaway",
    status: "ready_for_pickup",
    paymentStatus: "pending_store_pickup",
    storeLocation: "Riyadh Main Store - Olaya Computer Market",
    totalAmount: 14373.85,
    vatAmount: 1874.85,
    items: [
      {
        id: "cat-prod-3",
        name: 'Apple MacBook Air 15" M3 16GB / 512GB SSD',
        image:
          "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=300&auto=format&fit=crop",
        quantity: 2,
        price: 5699.0,
      },
      {
        id: "cat-prod-8",
        name: "Logitech MX Keys S Wireless Keyboard",
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
    date: "July 22, 2026",
    fulfillmentType: "delivery",
    status: "delivered",
    paymentStatus: "paid",
    totalAmount: 2242.5,
    vatAmount: 292.5,
    trackingNumber: "ARAMEX-992014",
    items: [
      {
        id: "cat-prod-2",
        name: "Ubiquiti UniFi Dream Machine Pro Security Gateway",
        image:
          "https://images.unsplash.com/photo-1543512214-318c7553f230?w=300&auto=format&fit=crop",
        quantity: 1,
        price: 1950.0,
      },
    ],
  },
];

export default function OrdersPage() {
  const [activeTab, setActiveTab] = useState<
    "all" | "in_progress" | "completed"
  >("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedOrderTracking, setSelectedOrderTracking] =
    useState<Order | null>(null);

  const addItem = useCartStore((state) => state.addItem);

  const handleReorder = (order: Order) => {
    order.items.forEach((item) => {
      addItem(
        {
          id: item.id,
          name: item.name,
          slug: item.id,
          sku: item.id,
          price: item.price,
          categoryId: "cat-1",
          brandId: "brand-1",
          isActive: true,
          images: [{ id: "img-1", url: item.image, isPrimary: true }],
        },
        item.quantity,
      );
    });
    alert("Order items added to your cart!");
  };

  const filteredOrders = MOCK_ORDERS.filter((order) => {
    if (activeTab === "in_progress" && order.status === "delivered")
      return false;
    if (activeTab === "completed" && order.status !== "delivered") return false;

    if (searchQuery) {
      return (
        order.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.items.some((i) =>
          i.name.toLowerCase().includes(searchQuery.toLowerCase()),
        )
      );
    }
    return true;
  });

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
            <Link href="/profile" className="hover:text-emerald-700 transition">
              My Account
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-slate-900 font-extrabold">Order History</span>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-black text-slate-950 uppercase tracking-tight">
                My Orders & Purchases
              </h1>
              <p className="text-xs sm:text-sm font-medium text-slate-500 mt-1">
                Track live KSA deliveries, takeaway pickups, and download ZATCA
                VAT tax invoices.
              </p>
            </div>

            <Link
              href="/profile"
              className="text-xs font-black text-emerald-700 bg-emerald-50 px-3.5 py-2 rounded-xl border border-emerald-200/80 hover:bg-emerald-100 transition shrink-0"
            >
              Manage Profile & VAT Info
            </Link>
          </div>
        </div>
      </div>

      {/* Main Body Container */}
      <div className="max-w-4/5 mx-auto md:px-0 px-4 pt-8 space-y-6">
        {/* Filter Controls Bar */}
        <div className="bg-white border border-slate-200/90 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-2xs">
          {/* Filter Tabs */}
          <div className="flex items-center gap-2 border-b sm:border-b-0 border-slate-100 pb-2 sm:pb-0 w-full sm:w-auto overflow-x-auto no-scrollbar">
            <button
              onClick={() => setActiveTab("all")}
              className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition cursor-pointer shrink-0 ${
                activeTab === "all"
                  ? "bg-[#15803d] text-white shadow-2xs"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              All Orders ({MOCK_ORDERS.length})
            </button>
            <button
              onClick={() => setActiveTab("in_progress")}
              className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition cursor-pointer shrink-0 ${
                activeTab === "in_progress"
                  ? "bg-[#15803d] text-white shadow-2xs"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              In Progress / Takeaway
            </button>
            <button
              onClick={() => setActiveTab("completed")}
              className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition cursor-pointer shrink-0 ${
                activeTab === "completed"
                  ? "bg-[#15803d] text-white shadow-2xs"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              Completed
            </button>
          </div>

          {/* Search Box */}
          <div className="relative w-full sm:w-64">
            <input
              type="text"
              placeholder="Search by order # or product..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:outline-none focus:border-emerald-600"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          </div>
        </div>

        {/* Orders Card List */}
        <div className="space-y-4">
          {filteredOrders.length === 0 ? (
            <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center space-y-4 shadow-2xs">
              <Package className="w-12 h-12 text-slate-300 mx-auto" />
              <h3 className="text-base font-black text-slate-900 uppercase">
                No Orders Found
              </h3>
              <p className="text-xs text-slate-500 font-medium max-w-sm mx-auto">
                No purchases match your selected filter tab or search terms.
              </p>
            </div>
          ) : (
            filteredOrders.map((order) => (
              <div
                key={order.id}
                className="bg-white border border-slate-200/90 rounded-2xl p-5 sm:p-6 space-y-4 shadow-2xs hover:shadow-xs transition"
              >
                {/* Order Top Bar */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-black text-slate-950 uppercase tracking-tight">
                        {order.orderNumber}
                      </span>
                      {order.fulfillmentType === "takeaway" ? (
                        <span className="bg-emerald-50 text-emerald-800 border border-emerald-200 text-[10px] font-black px-2.5 py-0.5 rounded-full inline-flex items-center gap-1">
                          <Store className="w-3 h-3" />
                          <span>Store Takeaway</span>
                        </span>
                      ) : (
                        <span className="bg-blue-50 text-blue-800 border border-blue-200 text-[10px] font-black px-2.5 py-0.5 rounded-full inline-flex items-center gap-1">
                          <Truck className="w-3 h-3" />
                          <span>Express Delivery</span>
                        </span>
                      )}
                    </div>
                    <span className="text-xs font-bold text-slate-400 block">
                      Placed on {order.date}
                    </span>
                  </div>

                  {/* Status Badge */}
                  <div className="flex items-center gap-3 self-start sm:self-auto">
                    {order.status === "dispatched" && (
                      <span className="bg-blue-600 text-white text-xs font-extrabold px-3 py-1 rounded-xl uppercase tracking-wider shadow-2xs inline-flex items-center gap-1.5">
                        <Truck className="w-3.5 h-3.5" />
                        <span>Dispatched & In Transit</span>
                      </span>
                    )}
                    {order.status === "ready_for_pickup" && (
                      <span className="bg-[#15803d] text-white text-xs font-extrabold px-3 py-1 rounded-xl uppercase tracking-wider shadow-2xs inline-flex items-center gap-1.5">
                        <Store className="w-3.5 h-3.5" />
                        <span>Ready for Store Pickup</span>
                      </span>
                    )}
                    {order.status === "delivered" && (
                      <span className="bg-slate-900 text-white text-xs font-extrabold px-3 py-1 rounded-xl uppercase tracking-wider shadow-2xs inline-flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Delivered</span>
                      </span>
                    )}
                  </div>
                </div>

                {/* Products List Preview */}
                <div className="space-y-3">
                  {order.items.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between gap-4 p-3 bg-slate-50/80 rounded-xl border border-slate-100"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-14 h-14 rounded-lg bg-white border border-slate-200 p-1 shrink-0 overflow-hidden">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-full h-full object-cover rounded"
                          />
                        </div>
                        <div>
                          <h4 className="text-xs font-bold text-slate-900 line-clamp-1">
                            {item.name}
                          </h4>
                          <span className="text-[11px] font-bold text-slate-500 block">
                            Qty: {item.quantity} × SAR{" "}
                            {item.price.toLocaleString("en-US", {
                              minimumFractionDigits: 2,
                            })}
                          </span>
                        </div>
                      </div>

                      <span className="text-xs font-black text-slate-950 shrink-0">
                        SAR{" "}
                        {(item.price * item.quantity).toLocaleString("en-US", {
                          minimumFractionDigits: 2,
                        })}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Footer Info & Actions */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between pt-3 border-t border-slate-100 gap-4">
                  <div className="text-xs font-bold text-slate-700">
                    <span>Total Paid (incl. 15% VAT): </span>
                    <span className="text-sm font-black text-slate-950">
                      SAR{" "}
                      {order.totalAmount.toLocaleString("en-US", {
                        minimumFractionDigits: 2,
                      })}
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    {order.trackingNumber && (
                      <button
                        onClick={() => setSelectedOrderTracking(order)}
                        className="bg-slate-100 hover:bg-slate-200 text-slate-900 text-xs font-black px-3.5 py-2 rounded-xl uppercase tracking-wider transition cursor-pointer flex items-center gap-1.5"
                      >
                        <Clock className="w-3.5 h-3.5 text-emerald-700" />
                        <span>Track Status</span>
                      </button>
                    )}

                    <button
                      onClick={() => window.print()}
                      className="bg-white hover:bg-slate-100 text-slate-800 border border-slate-200 text-xs font-black px-3.5 py-2 rounded-xl uppercase tracking-wider transition cursor-pointer flex items-center gap-1.5"
                    >
                      <Printer className="w-3.5 h-3.5 text-slate-500" />
                      <span>ZATCA VAT Invoice</span>
                    </button>

                    <button
                      onClick={() => handleReorder(order)}
                      className="bg-[#15803d] hover:bg-emerald-700 text-white text-xs font-extrabold px-4 py-2 rounded-xl uppercase tracking-wider transition cursor-pointer flex items-center gap-1.5 shadow-2xs"
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

      {/* Tracking Modal */}
      {selectedOrderTracking && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-sm font-black uppercase tracking-wider text-slate-950">
                Tracking {selectedOrderTracking.orderNumber}
              </h3>
              <button
                onClick={() => setSelectedOrderTracking(null)}
                className="text-slate-400 hover:text-slate-600 font-bold"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4 text-xs font-bold">
              <div className="bg-emerald-50 border border-emerald-200 p-3 rounded-xl">
                <span className="text-emerald-900 block">
                  Courier Tracking Number:
                </span>
                <span className="text-sm font-mono font-black text-emerald-950">
                  {selectedOrderTracking.trackingNumber}
                </span>
              </div>

              {/* Progress Timeline */}
              <div className="space-y-4 pl-4 border-l-2 border-emerald-600">
                <div className="relative">
                  <div className="w-3 h-3 rounded-full bg-emerald-600 absolute -left-[23px] top-0.5" />
                  <span className="font-extrabold text-slate-900 block">
                    Order Dispatched
                  </span>
                  <span className="text-[11px] text-slate-500 font-semibold">
                    Handed over to KSA Courier (SMSA / Aramex)
                  </span>
                </div>
                <div className="relative">
                  <div className="w-3 h-3 rounded-full bg-emerald-600 absolute -left-[23px] top-0.5" />
                  <span className="font-extrabold text-slate-900 block">
                    Warehouse Verification Completed
                  </span>
                  <span className="text-[11px] text-slate-500 font-semibold">
                    Quality check & ZATCA invoice generated
                  </span>
                </div>
                <div className="relative">
                  <div className="w-3 h-3 rounded-full bg-emerald-600 absolute -left-[23px] top-0.5" />
                  <span className="font-extrabold text-slate-900 block">
                    Order Placed
                  </span>
                  <span className="text-[11px] text-slate-500 font-semibold">
                    Received by Samud Shabkat
                  </span>
                </div>
              </div>
            </div>

            <button
              onClick={() => setSelectedOrderTracking(null)}
              className="w-full bg-slate-900 text-white text-xs font-extrabold py-3 rounded-xl uppercase tracking-wider"
            >
              Close Tracking
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
