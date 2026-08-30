"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  ShoppingBag,
  Users,
  Package,
  Clock,
  TrendingUp,
  ArrowUpRight,
  Loader2,
  RefreshCw,
  AlertCircle,
  ChevronRight,
  Store,
} from "lucide-react";
import { dashboardApi, type DashboardStats } from "@/lib/api/dashboard-api";

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await dashboardApi.getStats();
      setStats(data);
    } catch (err: any) {
      console.error("Failed to load dashboard stats:", err);
      setError(
        err?.response?.data?.message || err?.message || "Failed to load dashboard statistics",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  return (
    <div className="space-y-8">
      {/* Top Header & Refresh */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-950 uppercase tracking-tight flex items-center gap-3">
            <Store className="w-7 h-7 text-emerald-700" />
            Executive Dashboard
          </h1>
          <p className="text-xs text-slate-500 font-medium mt-1">
            Real-time business performance, order metrics, and store takeaway operations.
          </p>
        </div>

        <button
          onClick={fetchStats}
          disabled={loading}
          className="bg-white hover:bg-slate-50 border border-slate-200/90 text-slate-800 text-xs font-bold px-4 py-2.5 rounded-xl transition flex items-center gap-2 cursor-pointer shadow-2xs disabled:opacity-50"
        >
          <RefreshCw className={`w-3.5 h-3.5 text-emerald-700 ${loading ? "animate-spin" : ""}`} />
          <span>Refresh Metrics</span>
        </button>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-red-800 text-xs font-bold shadow-2xs">
          <div className="flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 shrink-0" />
            <span>{error}</span>
          </div>
          {error.toLowerCase().includes("token") ||
          error.toLowerCase().includes("auth") ||
          error.toLowerCase().includes("expired") ? (
            <Link
              href="/admin/login"
              className="px-3.5 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 shrink-0"
            >
              Sign In to Admin Portal
            </Link>
          ) : null}
        </div>
      )}

      {/* Metric Cards Grid */}
      {loading && !stats ? (
        <div className="py-20 text-center flex flex-col items-center justify-center space-y-3">
          <Loader2 className="w-8 h-8 text-emerald-600 animate-spin" />
          <span className="text-xs text-slate-500 font-medium">Loading live store metrics...</span>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {/* Card 1: Total Revenue */}
            <div className="bg-white border border-slate-200/90 rounded-2xl p-5 space-y-3 shadow-2xs hover:border-emerald-300 transition">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-black text-slate-500 uppercase tracking-wider">
                  Total Revenue
                </span>
                <div className="p-2 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200">
                  <TrendingUp className="w-4 h-4" />
                </div>
              </div>
              <div>
                <span className="text-2xl font-black text-slate-950 tracking-tight">
                  ₹{" "}
                  {Number(stats?.totalRevenue || 0).toLocaleString("en-IN", {
                    minimumFractionDigits: 2,
                  })}
                </span>
                <span className="text-[10px] text-emerald-700 font-extrabold block mt-0.5">
                  Confirmed & Paid Orders
                </span>
              </div>
            </div>

            {/* Card 2: Pending Orders */}
            <div className="bg-amber-50/60 border border-amber-200 rounded-2xl p-5 space-y-3 shadow-2xs hover:border-amber-300 transition">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-black text-amber-900 uppercase tracking-wider">
                  Pending Orders
                </span>
                <div className="p-2 rounded-xl bg-white text-amber-700 border border-amber-200">
                  <Clock className="w-4 h-4" />
                </div>
              </div>
              <div>
                <span className="text-2xl font-black text-amber-950 tracking-tight">
                  {stats?.pendingOrders || 0}
                </span>
                <span className="text-[10px] text-amber-800 font-extrabold block mt-0.5">
                  Requires takeaway action
                </span>
              </div>
            </div>

            {/* Card 3: Total Orders */}
            <div className="bg-white border border-slate-200/90 rounded-2xl p-5 space-y-3 shadow-2xs hover:border-slate-300 transition">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-black text-slate-500 uppercase tracking-wider">
                  Total Orders
                </span>
                <div className="p-2 rounded-xl bg-slate-100 text-slate-700">
                  <ShoppingBag className="w-4 h-4" />
                </div>
              </div>
              <div>
                <span className="text-2xl font-black text-slate-950 tracking-tight">
                  {stats?.totalOrders || 0}
                </span>
                <span className="text-[10px] text-slate-500 font-medium block mt-0.5">
                  All customer placements
                </span>
              </div>
            </div>

            {/* Card 4: Registered Customers */}
            <div className="bg-white border border-slate-200/90 rounded-2xl p-5 space-y-3 shadow-2xs hover:border-slate-300 transition">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-black text-slate-500 uppercase tracking-wider">
                  Customers
                </span>
                <div className="p-2 rounded-xl bg-slate-100 text-slate-700">
                  <Users className="w-4 h-4" />
                </div>
              </div>
              <div>
                <span className="text-2xl font-black text-slate-950 tracking-tight">
                  {stats?.totalCustomers || 0}
                </span>
                <span className="text-[10px] text-slate-500 font-medium block mt-0.5">
                  Registered accounts
                </span>
              </div>
            </div>

            {/* Card 5: Total Products */}
            <div className="bg-white border border-slate-200/90 rounded-2xl p-5 space-y-3 shadow-2xs hover:border-slate-300 transition">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-black text-slate-500 uppercase tracking-wider">
                  Catalog Items
                </span>
                <div className="p-2 rounded-xl bg-slate-100 text-slate-700">
                  <Package className="w-4 h-4" />
                </div>
              </div>
              <div>
                <span className="text-2xl font-black text-slate-950 tracking-tight">
                  {stats?.totalProducts || 0}
                </span>
                <span className="text-[10px] text-slate-500 font-medium block mt-0.5">
                  Active IT Hardware
                </span>
              </div>
            </div>
          </div>

          {/* Quick Actions Bar */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link
              href="/admin/orders"
              className="bg-emerald-50/80 border border-emerald-200 hover:border-emerald-300 p-5 rounded-2xl flex items-center justify-between group transition shadow-2xs"
            >
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-xl bg-white text-emerald-700 border border-emerald-200">
                  <ShoppingBag className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-extrabold text-emerald-950">Order Management</h3>
                  <p className="text-xs text-emerald-800/80 font-medium">Process takeaway orders & counter cash</p>
                </div>
              </div>
              <ArrowUpRight className="w-5 h-5 text-emerald-700 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition" />
            </Link>

            <Link
              href="/admin/products"
              className="bg-white border border-slate-200/90 hover:border-slate-300 p-5 rounded-2xl flex items-center justify-between group transition shadow-2xs"
            >
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-xl bg-slate-50 text-slate-700 border border-slate-200">
                  <Package className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-extrabold text-slate-950">Product Catalog</h3>
                  <p className="text-xs text-slate-500 font-medium">Manage hardware specs & prices</p>
                </div>
              </div>
              <ArrowUpRight className="w-5 h-5 text-slate-400 group-hover:text-slate-950 transition" />
            </Link>

            <Link
              href="/admin/users"
              className="bg-white border border-slate-200/90 hover:border-slate-300 p-5 rounded-2xl flex items-center justify-between group transition shadow-2xs"
            >
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-xl bg-slate-50 text-slate-700 border border-slate-200">
                  <Users className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-extrabold text-slate-950">Customer Accounts</h3>
                  <p className="text-xs text-slate-500 font-medium">View company & corporate profiles</p>
                </div>
              </div>
              <ArrowUpRight className="w-5 h-5 text-slate-400 group-hover:text-slate-950 transition" />
            </Link>
          </div>

          {/* Recent Orders Section */}
          <div className="bg-white border border-slate-200/90 rounded-2xl p-6 space-y-4 shadow-2xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h2 className="text-sm font-black text-slate-950 uppercase tracking-wider">
                  Recent Takeaway Orders
                </h2>
                <p className="text-xs text-slate-500 font-medium">
                  Latest customer placements needing status verification or store payment.
                </p>
              </div>

              <Link
                href="/admin/orders"
                className="text-xs font-black text-emerald-700 hover:text-emerald-800 flex items-center gap-1 transition"
              >
                <span>View All Orders</span>
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>

            {stats?.recentOrders.length === 0 ? (
              <div className="py-12 text-center text-xs text-slate-500 font-medium">
                No orders placed yet.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-slate-100 text-slate-500 font-extrabold uppercase text-[10px] tracking-wider">
                      <th className="py-3 px-4">Order #</th>
                      <th className="py-3 px-4">Date</th>
                      <th className="py-3 px-4">Order Status</th>
                      <th className="py-3 px-4">Payment Status</th>
                      <th className="py-3 px-4 text-right">Total Amount</th>
                      <th className="py-3 px-4 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-800 font-medium">
                    {stats?.recentOrders.map((ord) => (
                      <tr key={ord.id} className="hover:bg-slate-50 transition">
                        <td className="py-3.5 px-4 font-mono font-extrabold text-slate-950">
                          #{ord.orderNumber}
                        </td>
                        <td className="py-3.5 px-4 text-slate-500">
                          {new Date(ord.createdAt).toLocaleDateString("en-IN", {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                          })}
                        </td>
                        <td className="py-3.5 px-4">
                          <span
                            className={`inline-block px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider ${
                              ord.orderStatus === "PENDING"
                                ? "bg-amber-50 text-amber-800 border border-amber-200"
                                : ord.orderStatus === "READY_FOR_COLLECTION"
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
                        <td className="py-3.5 px-4">
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
                        <td className="py-3.5 px-4 text-right font-black text-slate-950">
                          ₹{" "}
                          {Number(ord.totalAmount).toLocaleString("en-IN", {
                            minimumFractionDigits: 2,
                          })}
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <Link
                            href={`/admin/orders?id=${ord.id}`}
                            className="text-emerald-700 hover:text-emerald-800 font-extrabold hover:underline"
                          >
                            Manage
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
