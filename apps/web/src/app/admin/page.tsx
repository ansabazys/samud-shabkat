"use client";

import Link from "next/link";
import {
  DollarSign,
  ShoppingBag,
  Package,
  ArrowUpRight,
  Clock,
  CheckCircle2,
  AlertTriangle,
  ChevronRight,
} from "lucide-react";

const stats = [
  {
    title: "Total Revenue",
    value: "AED 348,500",
    change: "+14.2% vs last month",
    icon: DollarSign,
    color: "text-emerald-400",
    bg: "bg-emerald-950/80 border-emerald-500/30",
  },
  {
    title: "Active Orders",
    value: "24",
    change: "6 Pending Confirmation",
    icon: ShoppingBag,
    color: "text-cyan-400",
    bg: "bg-cyan-950/80 border-cyan-500/30",
  },
  {
    title: "Low Stock Alerts",
    value: "3 Items",
    change: "Stock <= Reorder level",
    icon: AlertTriangle,
    color: "text-amber-400",
    bg: "bg-amber-950/80 border-amber-500/30",
  },
  {
    title: "Catalog Products",
    value: "142",
    change: "Across 6 Categories",
    icon: Package,
    color: "text-indigo-400",
    bg: "bg-indigo-950/80 border-indigo-500/30",
  },
];

const recentOrders = [
  {
    id: "ord-1001",
    orderNumber: "ORD-20260806-4892",
    companyName: "Gulf Networking Tech FZ-LLC",
    itemsCount: 3,
    totalAmount: "AED 43,500",
    orderStatus: "PENDING",
    createdAt: "15 mins ago",
  },
  {
    id: "ord-1002",
    orderNumber: "ORD-20260806-3104",
    companyName: "Emirates Cloud Systems",
    itemsCount: 1,
    totalAmount: "AED 14,500",
    orderStatus: "CONFIRMED",
    createdAt: "2 hours ago",
  },
  {
    id: "ord-1003",
    orderNumber: "ORD-20260805-9921",
    companyName: "Apex Telecom Solutions",
    itemsCount: 5,
    totalAmount: "AED 98,200",
    orderStatus: "SHIPPED",
    createdAt: "Yesterday",
  },
];

export default function AdminDashboardPage() {
  return (
    <div className="space-y-8">
      {/* Title Header */}
      <div>
        <h1 className="text-2xl font-bold text-white">Backoffice Dashboard</h1>
        <p className="text-xs text-slate-400 mt-1">
          Real-time overview of orders, inventory stock, and sales performance
        </p>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        {stats.map((item) => {
          const Icon = item.icon;
          return (
            <div
              key={item.title}
              className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-400">
                  {item.title}
                </span>
                <div className={`p-2.5 rounded-xl border ${item.bg}`}>
                  <Icon className={`w-5 h-5 ${item.color}`} />
                </div>
              </div>
              <div>
                <span className="text-2xl font-extrabold text-white block">
                  {item.value}
                </span>
                <span className="text-[11px] text-slate-400 font-medium">
                  {item.change}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Recent Orders Section */}
      <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-6">
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div>
            <h2 className="text-base font-bold text-white">
              Recent B2B Orders
            </h2>
            <p className="text-xs text-slate-400">
              Incoming hardware procurement orders
            </p>
          </div>
          <Link
            href="/admin/orders"
            className="text-xs font-semibold text-cyan-400 hover:text-cyan-300 flex items-center gap-1 transition"
          >
            View All Orders <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950/60 text-slate-400 uppercase text-[10px] tracking-wider font-semibold border-b border-slate-800">
              <tr>
                <th className="p-3.5 pl-4">Order Number</th>
                <th className="p-3.5">Company / Customer</th>
                <th className="p-3.5">Items</th>
                <th className="p-3.5">Total Amount</th>
                <th className="p-3.5">Status</th>
                <th className="p-3.5">Placed</th>
                <th className="p-3.5 pr-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {recentOrders.map((ord) => (
                <tr key={ord.id} className="hover:bg-slate-800/40 transition">
                  <td className="p-3.5 pl-4 font-mono font-bold text-white">
                    {ord.orderNumber}
                  </td>
                  <td className="p-3.5 font-medium">{ord.companyName}</td>
                  <td className="p-3.5">{ord.itemsCount} Items</td>
                  <td className="p-3.5 font-bold text-cyan-400">
                    {ord.totalAmount}
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
                    {ord.orderStatus === "SHIPPED" && (
                      <span className="px-2.5 py-1 rounded-md bg-indigo-950/80 border border-indigo-500/40 text-indigo-300 font-bold text-[10px] inline-flex items-center gap-1">
                        <Package className="w-3 h-3" /> SHIPPED
                      </span>
                    )}
                  </td>
                  <td className="p-3.5 text-slate-400">{ord.createdAt}</td>
                  <td className="p-3.5 pr-4 text-right">
                    <Link
                      href={`/admin/orders/${ord.id}`}
                      className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-white font-semibold text-[11px] transition inline-flex items-center gap-1"
                    >
                      Manage <ArrowUpRight className="w-3 h-3" />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
