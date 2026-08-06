"use client";

const sampleOrders = [
  {
    id: "ord-1001",
    orderNumber: "ORD-20260806-4892",
    createdAt: "2026-08-06",
    status: "PROCESSING",
    paymentStatus: "PAID",
    totalAmount: 14500,
    itemsCount: 1,
  },
  {
    id: "ord-1002",
    orderNumber: "ORD-20260802-1204",
    createdAt: "2026-08-02",
    status: "DELIVERED",
    paymentStatus: "PAID",
    totalAmount: 9180,
    itemsCount: 2,
  },
];

export default function MyOrdersPage() {
  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold text-white tracking-tight">
          Order History & Status
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          View and track your B2B hardware orders
        </p>
      </div>

      <div className="space-y-4">
        {sampleOrders.map((order) => (
          <div
            key={order.id}
            className="p-6 rounded-2xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition space-y-4"
          >
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-4">
              <div>
                <span className="text-[11px] font-mono text-cyan-400 font-bold block">
                  {order.orderNumber}
                </span>
                <span className="text-xs text-slate-400">
                  Placed on {order.createdAt}
                </span>
              </div>

              <div className="flex items-center gap-3">
                <span
                  className={`px-3 py-1 rounded-full text-xs font-bold ${
                    order.status === "DELIVERED"
                      ? "bg-emerald-950 text-emerald-400 border border-emerald-500/30"
                      : "bg-cyan-950 text-cyan-400 border border-cyan-500/30"
                  }`}
                >
                  {order.status}
                </span>
                <span className="text-xs font-bold text-emerald-400 bg-emerald-950/40 px-2.5 py-1 rounded-lg border border-emerald-500/20">
                  {order.paymentStatus}
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs text-slate-300">
              <div>
                <span className="text-slate-400">Items: </span>
                <span className="font-semibold">
                  {order.itemsCount} Products
                </span>
              </div>

              <div>
                <span className="text-slate-400">Total: </span>
                <span className="text-sm font-bold text-white">
                  AED {order.totalAmount.toLocaleString()}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
