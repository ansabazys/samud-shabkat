"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import {
  Search,
  CheckCircle2,
  Clock,
  Truck,
  XCircle,
  Package,
  Store,
  Banknote,
  Loader2,
  RefreshCw,
} from "lucide-react";
import { ordersApi, type OrderRecord } from "@/lib/api/orders-api";

export default function AdminOrdersPage() {
  const [selectedStatus, setSelectedStatus] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [ordersList, setOrdersList] = useState<OrderRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Cash collection modal state
  const [collectCashOrder, setCollectCashOrder] = useState<OrderRecord | null>(
    null,
  );
  const [paymentNotes, setPaymentNotes] = useState("");
  const [isSubmittingCash, setIsSubmittingCash] = useState(false);

  const fetchOrders = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await ordersApi.getOrders({
        search: searchQuery || undefined,
        orderStatus: selectedStatus !== "ALL" ? selectedStatus : undefined,
      });
      setOrdersList(res.data || []);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to load orders";
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  }, [searchQuery, selectedStatus]);

  useEffect(() => {
    let isMounted = true;
    (async () => {
      if (isMounted) {
        await fetchOrders();
      }
    })();
    return () => {
      isMounted = false;
    };
  }, [fetchOrders]);

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    try {
      await ordersApi.updateOrderStatus(orderId, newStatus);
      fetchOrders();
    } catch (err: unknown) {
      const msg =
        err instanceof Error ? err.message : "Failed to update status";
      alert(msg);
    }
  };

  const handleCollectCashSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!collectCashOrder) return;

    setIsSubmittingCash(true);
    try {
      const method =
        collectCashOrder.fulfillmentType === "STORE_PICKUP"
          ? "CASH_ON_PICKUP"
          : "CASH_ON_DELIVERY";
      await ordersApi.collectCash(collectCashOrder.id, method, paymentNotes);
      setCollectCashOrder(null);
      setPaymentNotes("");
      fetchOrders();
    } catch (err: unknown) {
      const msg =
        err instanceof Error ? err.message : "Failed to record payment";
      alert(msg);
    } finally {
      setIsSubmittingCash(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Title & Actions */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Order Management</h1>
          <p className="text-xs text-slate-400 mt-1">
            Review takeaway pickups, cash on delivery orders, and process
            payments
          </p>
        </div>
        <button
          onClick={fetchOrders}
          disabled={isLoading}
          className="flex items-center gap-1.5 bg-slate-900 border border-slate-800 text-slate-300 hover:text-white px-3 py-2 rounded-xl text-xs font-semibold transition"
        >
          <RefreshCw
            className={`w-3.5 h-3.5 ${isLoading ? "animate-spin text-cyan-400" : ""}`}
          />
          Refresh
        </button>
      </div>

      {/* Filters & Search Header */}
      <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex flex-wrap gap-4 items-center justify-between">
        {/* Status Filter Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          {[
            "ALL",
            "PENDING",
            "CONFIRMED",
            "READY_FOR_PICKUP",
            "OUT_FOR_DELIVERY",
            "DELIVERED",
            "COMPLETED",
            "CANCELLED",
          ].map((status) => (
            <button
              key={status}
              onClick={() => setSelectedStatus(status)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition whitespace-nowrap ${
                selectedStatus === status
                  ? "bg-cyan-600 text-white shadow-md shadow-cyan-900/50"
                  : "bg-slate-950/60 text-slate-400 hover:text-white hover:bg-slate-800"
              }`}
            >
              {status.replace(/_/g, " ")}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="w-72 relative">
          <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by order #, phone or address..."
            className="w-full pl-10 pr-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition"
          />
        </div>
      </div>

      {error && (
        <div className="p-4 bg-rose-950/60 border border-rose-800/60 rounded-xl text-xs text-rose-300">
          {error}
        </div>
      )}

      {/* Orders Data Table */}
      <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950/60 text-slate-400 uppercase text-[10px] tracking-wider font-semibold border-b border-slate-800">
              <tr>
                <th className="p-3.5 pl-4">Order Number</th>
                <th className="p-3.5">Fulfillment</th>
                <th className="p-3.5">Customer / Contact</th>
                <th className="p-3.5">Total Amount</th>
                <th className="p-3.5">Payment</th>
                <th className="p-3.5">Order Status</th>
                <th className="p-3.5">Placed Date</th>
                <th className="p-3.5 pr-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {isLoading ? (
                <tr>
                  <td colSpan={8} className="text-center py-12 text-slate-500">
                    <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2 text-cyan-500" />
                    Loading orders...
                  </td>
                </tr>
              ) : ordersList.length === 0 ? (
                <tr>
                  <td colSpan={8} className="text-center py-12 text-slate-500">
                    No orders match your filter criteria.
                  </td>
                </tr>
              ) : (
                ordersList.map((ord) => (
                  <tr key={ord.id} className="hover:bg-slate-800/40 transition">
                    <td className="p-3.5 pl-4 font-mono font-bold text-white">
                      <Link
                        href={`/admin/orders/${ord.id}`}
                        className="hover:text-cyan-400 flex items-center gap-1"
                      >
                        {ord.orderNumber}
                      </Link>
                    </td>
                    <td className="p-3.5">
                      {ord.fulfillmentType === "STORE_PICKUP" ? (
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-950 text-amber-300 border border-amber-500/30 flex items-center gap-1 w-fit">
                          <Store className="w-3 h-3" /> TAKEAWAY
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-sky-950 text-sky-300 border border-sky-500/30 flex items-center gap-1 w-fit">
                          <Truck className="w-3 h-3" /> COD DELIVERY
                        </span>
                      )}
                    </td>
                    <td className="p-3.5">
                      <span className="font-bold text-white block">
                        {ord.user?.fullName ||
                          ord.companyName ||
                          "Guest Customer"}
                      </span>
                      <span className="text-[11px] text-slate-400 font-mono">
                        {ord.contactPhone}
                      </span>
                    </td>
                    <td className="p-3.5 font-bold text-cyan-400">
                      ₹{ord.totalAmount}
                    </td>
                    <td className="p-3.5">
                      <div className="flex items-center gap-2">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            ord.paymentStatus === "PAID"
                              ? "bg-emerald-950 text-emerald-400 border border-emerald-500/30"
                              : "bg-amber-950 text-amber-300 border border-amber-500/30"
                          }`}
                        >
                          {ord.paymentStatus}
                        </span>
                        {ord.paymentStatus !== "PAID" && (
                          <button
                            onClick={() => setCollectCashOrder(ord)}
                            className="bg-emerald-600 hover:bg-emerald-500 text-white px-2 py-0.5 rounded text-[10px] font-bold flex items-center gap-1 transition"
                            title="Record Cash Collection"
                          >
                            <Banknote className="w-3 h-3" /> Cash
                          </button>
                        )}
                      </div>
                    </td>
                    <td className="p-3.5">
                      {ord.orderStatus === "PENDING" && (
                        <span className="px-2.5 py-1 rounded-md bg-amber-950/80 border border-amber-500/40 text-amber-300 font-bold text-[10px] inline-flex items-center gap-1">
                          <Clock className="w-3 h-3" /> PENDING
                        </span>
                      )}
                      {ord.orderStatus === "CONFIRMED" && (
                        <span className="px-2.5 py-1 rounded-md bg-cyan-950/80 border border-cyan-500/40 text-cyan-300 font-bold text-[10px] inline-flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" /> CONFIRMED
                        </span>
                      )}
                      {ord.orderStatus === "READY_FOR_PICKUP" && (
                        <span className="px-2.5 py-1 rounded-md bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 font-bold text-[10px] inline-flex items-center gap-1">
                          <Store className="w-3 h-3" /> READY FOR PICKUP
                        </span>
                      )}
                      {ord.orderStatus === "OUT_FOR_DELIVERY" && (
                        <span className="px-2.5 py-1 rounded-md bg-sky-950/80 border border-sky-500/40 text-sky-300 font-bold text-[10px] inline-flex items-center gap-1">
                          <Truck className="w-3 h-3" /> OUT FOR DELIVERY
                        </span>
                      )}
                      {ord.orderStatus === "DELIVERED" && (
                        <span className="px-2.5 py-1 rounded-md bg-indigo-950/80 border border-indigo-500/40 text-indigo-300 font-bold text-[10px] inline-flex items-center gap-1">
                          <Package className="w-3 h-3" /> DELIVERED
                        </span>
                      )}
                      {ord.orderStatus === "COMPLETED" && (
                        <span className="px-2.5 py-1 rounded-md bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 font-bold text-[10px] inline-flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" /> COMPLETED
                        </span>
                      )}
                      {ord.orderStatus === "CANCELLED" && (
                        <span className="px-2.5 py-1 rounded-md bg-rose-950/80 border border-rose-500/40 text-rose-300 font-bold text-[10px] inline-flex items-center gap-1">
                          <XCircle className="w-3 h-3" /> CANCELLED
                        </span>
                      )}
                    </td>
                    <td className="p-3.5 text-slate-400">
                      {new Date(ord.createdAt).toLocaleDateString()}
                    </td>
                    <td className="p-3.5 pr-4 text-right">
                      <select
                        value={ord.orderStatus}
                        onChange={(e) =>
                          handleStatusChange(ord.id, e.target.value)
                        }
                        className="bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-cyan-500 font-semibold"
                      >
                        <option value="PENDING">PENDING</option>
                        <option value="CONFIRMED">CONFIRMED</option>
                        <option value="READY_FOR_PICKUP">
                          READY FOR PICKUP (Takeaway)
                        </option>
                        <option value="OUT_FOR_DELIVERY">
                          OUT FOR DELIVERY (COD)
                        </option>
                        <option value="DELIVERED">DELIVERED</option>
                        <option value="COMPLETED">COMPLETED</option>
                        <option value="CANCELLED">CANCELLED</option>
                      </select>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Collect Cash Modal Dialog */}
      {collectCashOrder && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 max-w-md w-full shadow-2xl">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Banknote className="w-5 h-5 text-emerald-400" /> Collect Cash
              Payment
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Order:{" "}
              <span className="text-cyan-400 font-mono font-bold">
                {collectCashOrder.orderNumber}
              </span>
            </p>

            <div className="my-4 p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-1.5 text-xs">
              <div className="flex justify-between text-slate-400">
                <span>Customer:</span>
                <span className="text-white font-semibold">
                  {collectCashOrder.user?.fullName || "Guest"}
                </span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Fulfillment Type:</span>
                <span className="text-amber-400 font-semibold">
                  {collectCashOrder.fulfillmentType}
                </span>
              </div>
              <div className="flex justify-between text-slate-400 pt-1 border-t border-slate-800">
                <span>Total Amount Due:</span>
                <span className="text-emerald-400 font-bold text-sm">
                  ₹{collectCashOrder.totalAmount}
                </span>
              </div>
            </div>

            <form onSubmit={handleCollectCashSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Payment Notes (Optional)
                </label>
                <input
                  type="text"
                  value={paymentNotes}
                  onChange={(e) => setPaymentNotes(e.target.value)}
                  placeholder="e.g. Cash received by cashier at counter"
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setCollectCashOrder(null)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-semibold transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingCash}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 transition disabled:opacity-50"
                >
                  {isSubmittingCash ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <Banknote className="w-3.5 h-3.5" />
                  )}
                  Confirm Cash Paid
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
