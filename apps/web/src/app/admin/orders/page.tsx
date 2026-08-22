"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import {
  ShoppingBag,
  Search,
  RefreshCw,
  Loader2,
  AlertCircle,
  X,
  CheckCircle2,
  Store,
  Truck,
  Building2,
  Phone,
  Mail,
  Banknote,
  Printer,
  ChevronRight,
} from "lucide-react";
import { ordersApi, type OrderRecord, type OrderQueryParams } from "@/lib/api/orders-api";

const STATUS_FILTERS = [
  { label: "All Orders", value: "" },
  { label: "Pending", value: "PENDING" },
  { label: "Confirmed", value: "CONFIRMED" },
  { label: "Ready for Pickup", value: "READY_FOR_COLLECTION" },
  { label: "Completed", value: "COMPLETED" },
  { label: "Cancelled", value: "CANCELLED" },
];

export default function AdminOrdersPage() {
  const searchParams = useSearchParams();
  const highlightOrderId = searchParams.get("id");

  const [orders, setOrders] = useState<OrderRecord[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filters state
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [paymentFilter, setPaymentFilter] = useState("");
  const [page, setPage] = useState(1);

  // Selected Order Drawer
  const [selectedOrder, setSelectedOrder] = useState<OrderRecord | null>(null);
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [collectingCash, setCollectingCash] = useState(false);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError(null);

      const params: OrderQueryParams = {
        page,
        limit: 25,
        search: search || undefined,
        orderStatus: statusFilter || undefined,
        paymentStatus: paymentFilter || undefined,
      };

      const res = await ordersApi.getOrders(params);
      setOrders(res.data);
      setTotal(res.total);

      // Auto open drawer if highlightOrderId is present in query
      if (highlightOrderId && !selectedOrder) {
        const found = res.data.find((o) => o.id === highlightOrderId);
        if (found) setSelectedOrder(found);
      }
    } catch (err: any) {
      console.error("Failed to load orders:", err);
      setError(
        err?.response?.data?.message || err?.message || "Failed to load order list.",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [page, statusFilter, paymentFilter]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    fetchOrders();
  };

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    try {
      setUpdatingStatus(true);
      setActionSuccess(null);
      const updated = await ordersApi.updateOrderStatus(orderId, newStatus);

      // Update state locally
      setOrders((prev) => prev.map((o) => (o.id === orderId ? updated : o)));
      if (selectedOrder?.id === orderId) {
        setSelectedOrder(updated);
      }
      setActionSuccess(`Order status updated to ${newStatus.replace(/_/g, " ")}.`);
    } catch (err: any) {
      alert(err?.response?.data?.message || "Failed to update order status.");
    } finally {
      setUpdatingStatus(false);
    }
  };

  const handleCollectCash = async (orderId: string) => {
    try {
      setCollectingCash(true);
      setActionSuccess(null);
      const updated = await ordersApi.collectCash(orderId, "CASH", "Paid at counter");

      setOrders((prev) => prev.map((o) => (o.id === orderId ? updated : o)));
      if (selectedOrder?.id === orderId) {
        setSelectedOrder(updated);
      }
      setActionSuccess("Payment successfully recorded as PAID at counter.");
    } catch (err: any) {
      alert(err?.response?.data?.message || "Failed to record cash payment.");
    } finally {
      setCollectingCash(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Title */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-950 uppercase tracking-tight flex items-center gap-3">
            <ShoppingBag className="w-7 h-7 text-emerald-700" />
            Order Management Portal
          </h1>
          <p className="text-xs text-slate-500 font-medium mt-1">
            Review customer orders, update takeaway status, and confirm payments at counter.
          </p>
        </div>

        <button
          onClick={fetchOrders}
          disabled={loading}
          className="bg-white hover:bg-slate-50 border border-slate-200/90 text-slate-800 text-xs font-bold px-4 py-2.5 rounded-xl transition flex items-center gap-2 cursor-pointer shadow-2xs disabled:opacity-50"
        >
          <RefreshCw className={`w-3.5 h-3.5 text-emerald-700 ${loading ? "animate-spin" : ""}`} />
          <span>Refresh Orders</span>
        </button>
      </div>

      {/* Filter Tabs & Search Bar */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-4 space-y-4 shadow-2xs">
        {/* Status Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1 border-b border-slate-100">
          {STATUS_FILTERS.map((tab) => {
            const isActive = statusFilter === tab.value;
            return (
              <button
                key={tab.value}
                onClick={() => {
                  setStatusFilter(tab.value);
                  setPage(1);
                }}
                className={`px-3.5 py-2 rounded-xl text-xs font-extrabold uppercase tracking-wider whitespace-nowrap transition cursor-pointer ${
                  isActive
                    ? "bg-emerald-50 text-emerald-800 border border-emerald-200 shadow-2xs"
                    : "text-slate-600 hover:text-slate-950 hover:bg-slate-50"
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Search & Secondary Filters */}
        <form
          onSubmit={handleSearchSubmit}
          className="flex flex-col sm:flex-row items-center gap-3"
        >
          <div className="flex-1 relative w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              placeholder="Search by Order #, Customer Name, Email, or Phone..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-emerald-600 focus:bg-white font-medium"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto shrink-0">
            <select
              value={paymentFilter}
              onChange={(e) => {
                setPaymentFilter(e.target.value);
                setPage(1);
              }}
              className="px-3.5 py-2.5 bg-slate-50 border border-slate-200 text-slate-800 text-xs font-bold rounded-xl focus:outline-none"
            >
              <option value="">All Payment Statuses</option>
              <option value="PENDING">Payment Pending</option>
              <option value="PAID">Paid</option>
            </select>

            <button
              type="submit"
              className="bg-[#15803d] hover:bg-emerald-700 text-white font-extrabold text-xs px-5 py-2.5 rounded-xl uppercase tracking-wider transition cursor-pointer shadow-2xs"
            >
              Search
            </button>
          </div>
        </form>
      </div>

      {/* Global Error Banner */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-2xl p-4 flex items-center gap-3 text-red-800 text-xs font-bold shadow-2xs">
          <AlertCircle className="w-5 h-5 text-red-600 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Orders Data Table */}
      <div className="bg-white border border-slate-200/90 rounded-2xl overflow-hidden shadow-2xs">
        {loading ? (
          <div className="py-20 text-center flex flex-col items-center justify-center space-y-3">
            <Loader2 className="w-8 h-8 text-emerald-600 animate-spin" />
            <span className="text-xs text-slate-500 font-medium">Fetching orders database...</span>
          </div>
        ) : orders.length === 0 ? (
          <div className="py-16 text-center text-xs text-slate-500 font-medium">
            No orders match the selected filters.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/80 text-slate-500 font-extrabold uppercase text-[10px] tracking-wider">
                  <th className="py-3.5 px-4">Order #</th>
                  <th className="py-3.5 px-4">Customer Details</th>
                  <th className="py-3.5 px-4">Fulfillment Mode</th>
                  <th className="py-3.5 px-4">Order Status</th>
                  <th className="py-3.5 px-4">Payment</th>
                  <th className="py-3.5 px-4 text-right">Total Amount</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-800 font-medium">
                {orders.map((ord) => (
                  <tr
                    key={ord.id}
                    className={`hover:bg-slate-50 transition ${
                      selectedOrder?.id === ord.id ? "bg-emerald-50/40" : ""
                    }`}
                  >
                    <td className="py-4 px-4 font-mono font-extrabold text-slate-950">
                      #{ord.orderNumber}
                      <span className="text-[10px] text-slate-400 block font-sans font-normal mt-0.5">
                        {new Date(ord.createdAt).toLocaleDateString("en-IN", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        })}
                      </span>
                    </td>

                    <td className="py-4 px-4">
                      <div className="font-black text-slate-950">
                        {ord.user ? ord.user.fullName : "Customer"}
                      </div>
                      <div className="text-[11px] text-slate-500 flex items-center gap-2 mt-0.5">
                        <span>{ord.contactPhone}</span>
                        {ord.companyName && (
                          <span className="text-emerald-800 font-extrabold bg-emerald-50 border border-emerald-200 px-1.5 py-0.5 rounded text-[10px]">
                            {ord.companyName}
                          </span>
                        )}
                      </div>
                    </td>

                    <td className="py-4 px-4">
                      <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700">
                        {ord.fulfillmentType === "STORE_PICKUP" ? (
                          <>
                            <Store className="w-3.5 h-3.5 text-emerald-700" />
                            <span className="text-emerald-800">Store Takeaway</span>
                          </>
                        ) : (
                          <>
                            <Truck className="w-3.5 h-3.5 text-blue-600" />
                            <span>Home Delivery</span>
                          </>
                        )}
                      </div>
                    </td>

                    <td className="py-4 px-4">
                      <span
                        className={`inline-block px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider ${
                          ord.orderStatus === "PENDING"
                            ? "bg-amber-50 text-amber-800 border border-amber-200"
                            : ord.orderStatus === "READY_FOR_COLLECTION" ||
                                ord.orderStatus === "READY_FOR_PICKUP"
                              ? "bg-sky-50 text-sky-800 border border-sky-200"
                              : ord.orderStatus === "COMPLETED"
                                ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                                : ord.orderStatus === "CANCELLED"
                                  ? "bg-rose-50 text-rose-800 border border-rose-200"
                                  : "bg-slate-100 text-slate-700"
                        }`}
                      >
                        {ord.orderStatus.replace(/_/g, " ")}
                      </span>
                    </td>

                    <td className="py-4 px-4">
                      <span
                        className={`inline-block px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider ${
                          ord.paymentStatus === "PAID"
                            ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                            : "bg-amber-50 text-amber-800 border border-amber-200"
                        }`}
                      >
                        {ord.paymentStatus}
                      </span>
                    </td>

                    <td className="py-4 px-4 text-right font-black text-slate-950 text-sm">
                      ₹{" "}
                      {Number(ord.totalAmount).toLocaleString("en-IN", {
                        minimumFractionDigits: 2,
                      })}
                    </td>

                    <td className="py-4 px-4 text-right">
                      <button
                        onClick={() => {
                          setSelectedOrder(ord);
                          setActionSuccess(null);
                        }}
                        className="bg-slate-100 hover:bg-slate-200 text-slate-900 font-extrabold text-xs px-3 py-1.5 rounded-xl border border-slate-200 transition cursor-pointer inline-flex items-center gap-1"
                      >
                        <span>Manage</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination Bar */}
        {orders.length > 0 && (
          <div className="p-4 bg-slate-50/80 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-slate-700">
            <span>
              Showing {orders.length} of {total} orders (Page {page} of {Math.ceil(total / 25) || 1})
            </span>
            <div className="flex items-center gap-2">
              <button
                disabled={page <= 1}
                onClick={() => setPage((prev) => Math.max(1, prev - 1))}
                className="bg-white hover:bg-slate-100 text-slate-800 border border-slate-200 px-3 py-1.5 rounded-xl transition cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
              >
                &larr; Previous
              </button>
              <button
                disabled={page >= (Math.ceil(total / 25) || 1)}
                onClick={() => setPage((prev) => prev + 1)}
                className="bg-white hover:bg-slate-100 text-slate-800 border border-slate-200 px-3 py-1.5 rounded-xl transition cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Next &rarr;
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Order Details & Lifecycle Modal Drawer */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex justify-end">
          <div className="w-full max-w-2xl bg-white border-l border-slate-200/90 h-full overflow-y-auto p-6 sm:p-8 space-y-6 flex flex-col justify-between shadow-2xl text-slate-900">
            <div className="space-y-6">
              {/* Drawer Header */}
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <div>
                  <span className="text-[10px] font-black uppercase tracking-widest text-emerald-800 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-md">
                    Order Details
                  </span>
                  <h2 className="text-xl font-black text-slate-950 uppercase tracking-tight mt-1">
                    Order #{selectedOrder.orderNumber}
                  </h2>
                </div>

                <button
                  onClick={() => setSelectedOrder(null)}
                  className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 transition cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Action Success Alert */}
              {actionSuccess && (
                <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3.5 flex items-center gap-2.5 text-emerald-900 text-xs font-bold">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{actionSuccess}</span>
                </div>
              )}

              {/* Order Status & Payment Actions Control Box */}
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 space-y-4">
                <h3 className="text-xs font-black uppercase tracking-wider text-slate-700 pb-2 border-b border-slate-200">
                  Lifecycle Controls & Counter Payment
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Status Lifecycle Dropdown */}
                  <div>
                    <label className="text-[11px] font-extrabold text-slate-700 block mb-1.5">
                      Update Order Status
                    </label>
                    <select
                      value={selectedOrder.orderStatus}
                      disabled={updatingStatus}
                      onChange={(e) =>
                        handleStatusChange(selectedOrder.id, e.target.value)
                      }
                      className="w-full px-3 py-2.5 bg-white border border-slate-300 text-slate-950 font-black text-xs rounded-xl focus:outline-none focus:border-emerald-600"
                    >
                      <option value="PENDING">PENDING</option>
                      <option value="CONFIRMED">CONFIRMED</option>
                      <option value="READY_FOR_COLLECTION">READY FOR PICKUP</option>
                      <option value="COMPLETED">COMPLETED</option>
                      <option value="CANCELLED">CANCELLED</option>
                    </select>
                  </div>

                  {/* Cash Collection Button */}
                  <div>
                    <label className="text-[11px] font-extrabold text-slate-700 block mb-1.5">
                      Shop Payment Status
                    </label>
                    {selectedOrder.paymentStatus === "PAID" ? (
                      <div className="w-full px-3 py-2.5 bg-emerald-50 border border-emerald-200 text-emerald-800 font-black text-xs rounded-xl flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        <span>Payment Received (PAID)</span>
                      </div>
                    ) : (
                      <button
                        onClick={() => handleCollectCash(selectedOrder.id)}
                        disabled={collectingCash}
                        className="w-full bg-[#15803d] hover:bg-emerald-700 text-white font-extrabold text-xs py-2.5 px-3 rounded-xl uppercase tracking-wider transition flex items-center justify-center gap-2 cursor-pointer shadow-2xs disabled:opacity-50"
                      >
                        {collectingCash ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <>
                            <Banknote className="w-4 h-4" />
                            <span>Mark Paid at Counter</span>
                          </>
                        )}
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Customer & Business Info */}
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 space-y-3 text-xs">
                <h3 className="font-black uppercase tracking-wider text-slate-700 pb-2 border-b border-slate-200">
                  Customer & Business Details
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-slate-800 font-medium">
                  <div>
                    <span className="text-slate-500 block text-[10px] uppercase font-bold">
                      Customer Name
                    </span>
                    <span className="font-extrabold text-slate-950">
                      {selectedOrder.user ? selectedOrder.user.fullName : "Customer"}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[10px] uppercase font-bold">
                      Contact Phone
                    </span>
                    <span className="font-extrabold text-slate-950 flex items-center gap-1.5">
                      <Phone className="w-3.5 h-3.5 text-emerald-700" />
                      {selectedOrder.contactPhone}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[10px] uppercase font-bold">
                      Account Email
                    </span>
                    <span className="font-extrabold text-slate-950 flex items-center gap-1.5">
                      <Mail className="w-3.5 h-3.5 text-emerald-700" />
                      {selectedOrder.user?.email || "N/A"}
                    </span>
                  </div>
                  {selectedOrder.companyName && (
                    <div>
                      <span className="text-slate-500 block text-[10px] uppercase font-bold">
                        Corporate Company
                      </span>
                      <span className="font-extrabold text-emerald-800 flex items-center gap-1.5">
                        <Building2 className="w-3.5 h-3.5 text-emerald-700" />
                        {selectedOrder.companyName}
                      </span>
                    </div>
                  )}
                </div>

                <div className="pt-2 border-t border-slate-200">
                  <span className="text-slate-500 block text-[10px] uppercase font-bold">
                    Pickup Location / Address
                  </span>
                  <span className="font-bold text-slate-950 block mt-0.5">
                    {selectedOrder.shippingAddress}
                  </span>
                </div>
              </div>

              {/* Items Table */}
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 space-y-3">
                <h3 className="text-xs font-black uppercase tracking-wider text-slate-700 pb-2 border-b border-slate-200">
                  Ordered Products ({selectedOrder.items?.length || 0})
                </h3>

                <div className="space-y-3">
                  {selectedOrder.items?.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between text-xs font-bold border-b border-slate-200/80 pb-2.5"
                    >
                      <div>
                        <span className="text-slate-950 block">{item.productName}</span>
                        <span className="text-[10px] text-slate-500 font-mono">
                          SKU: {item.sku} &bull; Qty: {item.quantity}
                        </span>
                      </div>
                      <div className="text-right">
                        <span className="text-slate-950 block">
                          ₹{" "}
                          {Number(item.totalPrice).toLocaleString("en-IN", {
                            minimumFractionDigits: 2,
                          })}
                        </span>
                        <span className="text-[10px] text-slate-500 font-normal">
                          ₹{Number(item.unitPrice).toFixed(2)} each
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Total Summary */}
                <div className="pt-3 border-t border-slate-200 space-y-1.5 text-xs font-bold text-slate-700">
                  <div className="flex justify-between text-base font-black text-slate-950 pt-2 border-t border-slate-200">
                    <span>Total Amount</span>
                    <span className="text-emerald-700">
                      ₹{" "}
                      {Number(selectedOrder.totalAmount).toLocaleString("en-IN", {
                        minimumFractionDigits: 2,
                      })}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer Close / Print Button */}
            <div className="pt-4 border-t border-slate-200 flex items-center justify-between">
              <button
                onClick={() => window.print()}
                className="bg-slate-100 hover:bg-slate-200 text-slate-900 font-extrabold text-xs px-4 py-2.5 rounded-xl uppercase tracking-wider transition inline-flex items-center gap-2 cursor-pointer"
              >
                <Printer className="w-4 h-4" />
                <span>Print Invoice</span>
              </button>
              <button
                onClick={() => setSelectedOrder(null)}
                className="bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs px-6 py-2.5 rounded-xl uppercase tracking-wider transition cursor-pointer"
              >
                Close Drawer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
