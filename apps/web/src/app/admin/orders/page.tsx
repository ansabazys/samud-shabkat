"use client";

import { useState } from "react";
import Link from "next/link";
import { Search, CheckCircle2, Clock, Truck, XCircle } from "lucide-react";

interface OrderRecord {
  id: string;
  orderNumber: string;
  customerName: string;
  companyName: string;
  contactPhone: string;
  totalAmount: string;
  orderStatus: "PENDING" | "CONFIRMED" | "SHIPPED" | "DELIVERED" | "CANCELLED";
  paymentStatus: "PENDING" | "PAID" | "FAILED" | "REFUNDED";
  createdAt: string;
  itemsCount: number;
}

const mockOrders: OrderRecord[] = [
  {
    id: "ord-1001",
    orderNumber: "ORD-20260806-4892",
    customerName: "Mohammed Ansab",
    companyName: "Gulf Networking Tech FZ-LLC",
    contactPhone: "+971 4 123 4567",
    totalAmount: "43,500.00",
    orderStatus: "PENDING",
    paymentStatus: "PENDING",
    createdAt: "2026-08-06 14:30",
    itemsCount: 3,
  },
  {
    id: "ord-1002",
    orderNumber: "ORD-20260806-3104",
    customerName: "Rashid Al-Maktoum",
    companyName: "Emirates Cloud Systems",
    contactPhone: "+971 50 987 6543",
    totalAmount: "14,500.00",
    orderStatus: "CONFIRMED",
    paymentStatus: "PAID",
    createdAt: "2026-08-06 12:15",
    itemsCount: 1,
  },
  {
    id: "ord-1003",
    orderNumber: "ORD-20260805-9921",
    customerName: "Sari Kabbani",
    companyName: "Apex Telecom Solutions",
    contactPhone: "+971 55 444 3322",
    totalAmount: "98,200.00",
    orderStatus: "SHIPPED",
    paymentStatus: "PAID",
    createdAt: "2026-08-05 16:45",
    itemsCount: 5,
  },
  {
    id: "ord-1004",
    orderNumber: "ORD-20260804-1188",
    customerName: "David Miller",
    companyName: "Middle East Data Centers",
    contactPhone: "+971 4 999 8877",
    totalAmount: "185,000.00",
    orderStatus: "DELIVERED",
    paymentStatus: "PAID",
    createdAt: "2026-08-04 09:20",
    itemsCount: 12,
  },
  {
    id: "ord-1005",
    orderNumber: "ORD-20260803-0042",
    customerName: "Tariq Aziz",
    companyName: "Smart Infrastructure Systems",
    contactPhone: "+971 52 111 2233",
    totalAmount: "29,000.00",
    orderStatus: "CANCELLED",
    paymentStatus: "FAILED",
    createdAt: "2026-08-03 18:10",
    itemsCount: 2,
  },
];

export default function AdminOrdersPage() {
  const [selectedStatus, setSelectedStatus] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [ordersList, setOrdersList] = useState<OrderRecord[]>(mockOrders);

  const filteredOrders = ordersList.filter((ord) => {
    const matchesStatus =
      selectedStatus === "ALL" || ord.orderStatus === selectedStatus;
    const matchesSearch =
      ord.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ord.companyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ord.customerName.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesStatus && matchesSearch;
  });

  const handleStatusChange = (
    orderId: string,
    newStatus: OrderRecord["orderStatus"],
  ) => {
    setOrdersList((prev) =>
      prev.map((ord) =>
        ord.id === orderId ? { ...ord, orderStatus: newStatus } : ord,
      ),
    );
  };

  return (
    <div className="space-y-6">
      {/* Title & Actions */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Order Management</h1>
          <p className="text-xs text-slate-400 mt-1">
            Review customer orders, update statuses, and trigger inventory
            fulfillment
          </p>
        </div>
      </div>

      {/* Filters & Search Header */}
      <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex flex-wrap gap-4 items-center justify-between">
        {/* Status Filter Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          {[
            "ALL",
            "PENDING",
            "CONFIRMED",
            "SHIPPED",
            "DELIVERED",
            "CANCELLED",
          ].map((status) => (
            <button
              key={status}
              onClick={() => setSelectedStatus(status)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
                selectedStatus === status
                  ? "bg-cyan-600 text-white shadow-md shadow-cyan-900/50"
                  : "bg-slate-950/60 text-slate-400 hover:text-white hover:bg-slate-800"
              }`}
            >
              {status}
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
            placeholder="Search by order #, company or name..."
            className="w-full pl-10 pr-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition"
          />
        </div>
      </div>

      {/* Orders Data Table */}
      <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950/60 text-slate-400 uppercase text-[10px] tracking-wider font-semibold border-b border-slate-800">
              <tr>
                <th className="p-3.5 pl-4">Order Number</th>
                <th className="p-3.5">Company / Customer</th>
                <th className="p-3.5">Phone</th>
                <th className="p-3.5">Total Amount</th>
                <th className="p-3.5">Payment</th>
                <th className="p-3.5">Order Status</th>
                <th className="p-3.5">Placed Date</th>
                <th className="p-3.5 pr-4 text-right">Fulfillment Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={8} className="text-center py-12 text-slate-500">
                    No orders match your filter criteria.
                  </td>
                </tr>
              ) : (
                filteredOrders.map((ord) => (
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
                      <span className="font-bold text-white block">
                        {ord.companyName}
                      </span>
                      <span className="text-[11px] text-slate-400">
                        {ord.customerName}
                      </span>
                    </td>
                    <td className="p-3.5 font-mono text-slate-400">
                      {ord.contactPhone}
                    </td>
                    <td className="p-3.5 font-bold text-cyan-400">
                      AED {ord.totalAmount}
                    </td>
                    <td className="p-3.5">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          ord.paymentStatus === "PAID"
                            ? "bg-emerald-950 text-emerald-400 border border-emerald-500/30"
                            : "bg-amber-950 text-amber-300 border border-amber-500/30"
                        }`}
                      >
                        {ord.paymentStatus}
                      </span>
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
                          <Truck className="w-3 h-3" /> SHIPPED
                        </span>
                      )}
                      {ord.orderStatus === "DELIVERED" && (
                        <span className="px-2.5 py-1 rounded-md bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 font-bold text-[10px] inline-flex items-center gap-1">
                          <Package className="w-3 h-3" /> DELIVERED
                        </span>
                      )}
                      {ord.orderStatus === "CANCELLED" && (
                        <span className="px-2.5 py-1 rounded-md bg-rose-950/80 border border-rose-500/40 text-rose-300 font-bold text-[10px] inline-flex items-center gap-1">
                          <XCircle className="w-3 h-3" /> CANCELLED
                        </span>
                      )}
                    </td>
                    <td className="p-3.5 text-slate-400">{ord.createdAt}</td>
                    <td className="p-3.5 pr-4 text-right">
                      <select
                        value={ord.orderStatus}
                        onChange={(e) =>
                          handleStatusChange(
                            ord.id,
                            e.target.value as OrderRecord["orderStatus"],
                          )
                        }
                        className="bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-cyan-500 font-semibold"
                      >
                        <option value="PENDING">Set PENDING</option>
                        <option value="CONFIRMED">
                          Confirm & Reserve Stock
                        </option>
                        <option value="SHIPPED">Ship & Fulfill Stock</option>
                        <option value="DELIVERED">Set DELIVERED</option>
                        <option value="CANCELLED">
                          Cancel & Release Stock
                        </option>
                      </select>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
