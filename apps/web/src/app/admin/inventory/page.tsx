"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Search,
  Package,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  PlusCircle,
  History,
  Loader2,
  RefreshCw,
} from "lucide-react";
import {
  inventoryApi,
  type InventoryTransactionRecord,
} from "@/lib/api/inventory-api";

interface LowStockItem {
  id: string;
  productId: string;
  productName: string;
  productSku: string;
  currentStock: number;
  reservedStock: number;
  availableStock: number;
  reorderLevel: number;
}

export default function AdminInventoryPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [lowStockItems, setLowStockItems] = useState<LowStockItem[]>([]);
  const [transactions, setTransactions] = useState<
    InventoryTransactionRecord[]
  >([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Adjustment Modal State
  const [isAdjustModalOpen, setIsAdjustModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [adjustData, setAdjustData] = useState({
    productId: "",
    adjustmentType: "ADD" as "ADD" | "SUBTRACT" | "SET",
    quantity: 10,
    reference: "",
    notes: "",
  });

  // History Modal State
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);

  const fetchInventoryData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [lowStockRes, txRes] = await Promise.all([
        inventoryApi.getLowStock({ search: searchQuery || undefined }),
        inventoryApi.getTransactions({ limit: 20 }),
      ]);
      setLowStockItems(lowStockRes.data || []);
      setTransactions(txRes.data || []);
    } catch (err: unknown) {
      const msg =
        err instanceof Error ? err.message : "Failed to load inventory data";
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  }, [searchQuery]);

  useEffect(() => {
    let isMounted = true;
    (async () => {
      if (isMounted) {
        await fetchInventoryData();
      }
    })();
    return () => {
      isMounted = false;
    };
  }, [fetchInventoryData]);

  const handleAdjustSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!adjustData.productId) {
      alert("Please enter a valid Product ID");
      return;
    }

    setIsSubmitting(true);
    try {
      await inventoryApi.adjustStock(adjustData);
      setIsAdjustModalOpen(false);
      setAdjustData({
        productId: "",
        adjustmentType: "ADD",
        quantity: 10,
        reference: "",
        notes: "",
      });
      fetchInventoryData();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to adjust stock";
      alert(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <Package className="w-6 h-6 text-cyan-400" /> Stock & Inventory
            Management
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Real-time single-pool stock tracking, low-stock alerts, and
            restocking adjustments
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsHistoryModalOpen(true)}
            className="flex items-center gap-1.5 bg-slate-900 border border-slate-800 text-slate-300 hover:text-white px-3.5 py-2 rounded-xl text-xs font-semibold transition"
          >
            <History className="w-3.5 h-3.5 text-cyan-400" /> Audit Log
          </button>
          <button
            onClick={() => setIsAdjustModalOpen(true)}
            className="flex items-center gap-1.5 bg-cyan-600 hover:bg-cyan-500 text-white px-4 py-2 rounded-xl text-xs font-semibold shadow-lg shadow-cyan-950 transition"
          >
            <PlusCircle className="w-4 h-4" /> Restock / Adjust Stock
          </button>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-rose-950/60 border border-rose-800/60 rounded-xl text-xs text-rose-300">
          {error}
        </div>
      )}

      {/* Low Stock Warning Alert Banner */}
      <div className="p-5 rounded-2xl bg-amber-950/40 border border-amber-500/30 flex items-start gap-4">
        <div className="p-2 rounded-xl bg-amber-900/60 border border-amber-500/40 text-amber-400 shrink-0">
          <AlertTriangle className="w-5 h-5" />
        </div>
        <div className="flex-1">
          <h3 className="text-sm font-bold text-amber-200">
            Low Stock Monitoring ({lowStockItems.length} items requiring
            attention)
          </h3>
          <p className="text-xs text-amber-300/80 mt-0.5">
            Products at or below their reorder threshold are highlighted below
            for restock planning.
          </p>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between">
        <div className="w-80 relative">
          <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search low stock items..."
            className="w-full pl-10 pr-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition"
          />
        </div>
        <button
          onClick={fetchInventoryData}
          disabled={isLoading}
          className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition"
        >
          <RefreshCw
            className={`w-3.5 h-3.5 ${isLoading ? "animate-spin text-cyan-400" : ""}`}
          />{" "}
          Refresh Data
        </button>
      </div>

      {/* Inventory Table */}
      <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800">
        <h2 className="text-sm font-bold text-white mb-4">
          Low Stock Warning Table
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950/60 text-slate-400 uppercase text-[10px] tracking-wider font-semibold border-b border-slate-800">
              <tr>
                <th className="p-3.5 pl-4">Product Details</th>
                <th className="p-3.5">Current Stock</th>
                <th className="p-3.5">Reserved Stock</th>
                <th className="p-3.5">Available Stock</th>
                <th className="p-3.5">Reorder Level</th>
                <th className="p-3.5">Stock Status</th>
                <th className="p-3.5 pr-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {isLoading ? (
                <tr>
                  <td colSpan={7} className="text-center py-12 text-slate-500">
                    <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2 text-cyan-500" />
                    Checking single-pool stock levels...
                  </td>
                </tr>
              ) : lowStockItems.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-12 text-slate-500">
                    <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto mb-2 opacity-80" />
                    All products are adequately stocked above reorder
                    thresholds!
                  </td>
                </tr>
              ) : (
                lowStockItems.map((item) => (
                  <tr
                    key={item.id}
                    className="hover:bg-slate-800/40 transition"
                  >
                    <td className="p-3.5 pl-4">
                      <span className="font-bold text-white block">
                        {item.productName || item.productId}
                      </span>
                      <span className="text-[10px] font-mono text-cyan-400">
                        SKU: {item.productSku || "—"}
                      </span>
                    </td>
                    <td className="p-3.5 font-bold text-white">
                      {item.currentStock}
                    </td>
                    <td className="p-3.5 text-amber-400 font-mono">
                      {item.reservedStock}
                    </td>
                    <td className="p-3.5 font-bold text-cyan-400">
                      {item.availableStock}
                    </td>
                    <td className="p-3.5 text-slate-400 font-mono">
                      {item.reorderLevel}
                    </td>
                    <td className="p-3.5">
                      {item.availableStock <= 0 ? (
                        <span className="px-2.5 py-1 rounded-md bg-rose-950/80 border border-rose-500/40 text-rose-300 font-bold text-[10px] inline-flex items-center gap-1">
                          <XCircle className="w-3 h-3" /> OUT OF STOCK
                        </span>
                      ) : (
                        <span className="px-2.5 py-1 rounded-md bg-amber-950/80 border border-amber-500/40 text-amber-300 font-bold text-[10px] inline-flex items-center gap-1">
                          <AlertTriangle className="w-3 h-3" /> LOW STOCK
                        </span>
                      )}
                    </td>
                    <td className="p-3.5 pr-4 text-right">
                      <button
                        onClick={() => {
                          setAdjustData((prev) => ({
                            ...prev,
                            productId: item.productId,
                            adjustmentType: "ADD",
                            quantity: 50,
                          }));
                          setIsAdjustModalOpen(true);
                        }}
                        className="bg-cyan-600 hover:bg-cyan-500 text-white px-3 py-1 rounded-lg text-xs font-semibold transition"
                      >
                        Restock Now
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Restock / Adjust Stock Modal */}
      {isAdjustModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 max-w-md w-full shadow-2xl space-y-4">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <PlusCircle className="w-5 h-5 text-cyan-400" /> Restock / Adjust
              Inventory
            </h3>

            <form onSubmit={handleAdjustSubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Product ID (UUID) *
                </label>
                <input
                  type="text"
                  required
                  value={adjustData.productId}
                  onChange={(e) =>
                    setAdjustData({ ...adjustData, productId: e.target.value })
                  }
                  placeholder="e.g. 550e8400-e29b-41d4-a716-446655440000"
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Adjustment Operation *
                </label>
                <select
                  value={adjustData.adjustmentType}
                  onChange={(e) =>
                    setAdjustData({
                      ...adjustData,
                      adjustmentType: e.target.value as
                        "ADD" | "SUBTRACT" | "SET",
                    })
                  }
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-cyan-500"
                >
                  <option value="ADD">ADD (+) Restock Incoming Shipment</option>
                  <option value="SUBTRACT">
                    SUBTRACT (-) Damaged / Missing Stock
                  </option>
                  <option value="SET">
                    SET (=) Exact Physical Audit Count
                  </option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Quantity Units *
                </label>
                <input
                  type="number"
                  min={1}
                  required
                  value={adjustData.quantity}
                  onChange={(e) =>
                    setAdjustData({
                      ...adjustData,
                      quantity: parseInt(e.target.value) || 0,
                    })
                  }
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Reference / Invoice # (Optional)
                </label>
                <input
                  type="text"
                  value={adjustData.reference}
                  onChange={(e) =>
                    setAdjustData({ ...adjustData, reference: e.target.value })
                  }
                  placeholder="e.g. INV-2026-0801"
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Adjustment Notes (Optional)
                </label>
                <input
                  type="text"
                  value={adjustData.notes}
                  onChange={(e) =>
                    setAdjustData({ ...adjustData, notes: e.target.value })
                  }
                  placeholder="e.g. Received new batch at shop counter"
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setIsAdjustModalOpen(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-semibold transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 transition disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <PlusCircle className="w-3.5 h-3.5" />
                  )}
                  Save Adjustment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Transaction History Audit Modal */}
      {isHistoryModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 max-w-2xl w-full shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <History className="w-5 h-5 text-cyan-400" /> Inventory Audit
                Log
              </h3>
              <button
                onClick={() => setIsHistoryModalOpen(false)}
                className="text-xs text-slate-400 hover:text-white"
              >
                Close
              </button>
            </div>

            <div className="max-h-96 overflow-y-auto">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-slate-950 text-slate-400 uppercase text-[10px] tracking-wider font-semibold border-b border-slate-800 sticky top-0">
                  <tr>
                    <th className="p-3">Type</th>
                    <th className="p-3">Qty Delta</th>
                    <th className="p-3">Stock After</th>
                    <th className="p-3">Reference</th>
                    <th className="p-3">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {transactions.length === 0 ? (
                    <tr>
                      <td
                        colSpan={5}
                        className="text-center py-8 text-slate-500"
                      >
                        No inventory audit logs found.
                      </td>
                    </tr>
                  ) : (
                    transactions.map((tx) => (
                      <tr key={tx.id} className="hover:bg-slate-800/40">
                        <td className="p-3 font-bold text-cyan-300">
                          {tx.transactionType}
                        </td>
                        <td
                          className={`p-3 font-mono font-bold ${
                            tx.quantityDelta > 0
                              ? "text-emerald-400"
                              : tx.quantityDelta < 0
                                ? "text-rose-400"
                                : "text-slate-400"
                          }`}
                        >
                          {tx.quantityDelta > 0
                            ? `+${tx.quantityDelta}`
                            : tx.quantityDelta}
                        </td>
                        <td className="p-3 font-bold text-white">
                          {tx.stockAfter}
                        </td>
                        <td className="p-3 text-slate-400">
                          {tx.reference || "—"}
                        </td>
                        <td className="p-3 text-slate-400">
                          {new Date(tx.createdAt).toLocaleDateString()}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
