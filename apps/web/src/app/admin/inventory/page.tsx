"use client";

import { useState } from "react";
import {
  Search,
  Warehouse,
  CheckCircle2,
  AlertTriangle,
  XCircle,
} from "lucide-react";

interface InventoryRow {
  id: string;
  productId: string;
  sku: string;
  productName: string;
  warehouseCode: string;
  currentStock: number;
  reservedStock: number;
  availableStock: number;
  reorderLevel: number;
  stockStatus: "IN_STOCK" | "LOW_STOCK" | "OUT_OF_STOCK";
}

const mockInventory: InventoryRow[] = [
  {
    id: "inv-1",
    productId: "prod-1",
    sku: "C9300-48P-A",
    productName: "Cisco Catalyst 9300 48-Port PoE+ Managed Switch",
    warehouseCode: "DXB-MAIN",
    currentStock: 50,
    reservedStock: 5,
    availableStock: 45,
    reorderLevel: 10,
    stockStatus: "IN_STOCK",
  },
  {
    id: "inv-2",
    productId: "prod-2",
    sku: "FG-60F-BDL",
    productName: "Fortinet FortiGate 60F Next-Gen Firewall",
    warehouseCode: "DXB-MAIN",
    currentStock: 12,
    reservedStock: 4,
    availableStock: 8,
    reorderLevel: 10,
    stockStatus: "LOW_STOCK",
  },
  {
    id: "inv-3",
    productId: "prod-3",
    sku: "MX84-HW",
    productName: "Cisco Meraki MX84 Cloud Managed Security Appliance",
    warehouseCode: "DXB-MAIN",
    currentStock: 0,
    reservedStock: 0,
    availableStock: 0,
    reorderLevel: 5,
    stockStatus: "OUT_OF_STOCK",
  },
  {
    id: "inv-4",
    productId: "prod-4",
    sku: "U6-PRO-US",
    productName: "Ubiquiti UniFi 6 Pro Access Point",
    warehouseCode: "DXB-MAIN",
    currentStock: 120,
    reservedStock: 15,
    availableStock: 105,
    reorderLevel: 20,
    stockStatus: "IN_STOCK",
  },
];

export default function AdminInventoryPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [inventoryList, setInventoryList] =
    useState<InventoryRow[]>(mockInventory);
  const [editingRow, setEditingRow] = useState<InventoryRow | null>(null);
  const [adjustmentDelta, setAdjustmentDelta] = useState<number>(10);
  const [adjustmentNote, setAdjustmentNote] = useState("");

  const filteredInventory = inventoryList.filter(
    (row) =>
      row.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
      row.productName.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const handleAdjustStock = () => {
    if (!editingRow) return;

    setInventoryList((prev) =>
      prev.map((item) => {
        if (item.id === editingRow.id) {
          const newCurrent = Math.max(0, item.currentStock + adjustmentDelta);
          const newAvailable = Math.max(0, newCurrent - item.reservedStock);
          let newStatus: InventoryRow["stockStatus"] = "IN_STOCK";
          if (newAvailable <= 0) newStatus = "OUT_OF_STOCK";
          else if (newAvailable <= item.reorderLevel) newStatus = "LOW_STOCK";

          return {
            ...item,
            currentStock: newCurrent,
            availableStock: newAvailable,
            stockStatus: newStatus,
          };
        }
        return item;
      }),
    );

    setEditingRow(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">
            Stock & Inventory Management
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Real-time warehouse stock tracking, reservation monitoring, and
            manual stock adjustments
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs">
            <Warehouse className="w-4 h-4 text-cyan-400" />
            <span className="font-bold text-white">
              Main Dubai Warehouse (DXB-MAIN)
            </span>
          </div>
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
            placeholder="Search by SKU or hardware name..."
            className="w-full pl-10 pr-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition"
          />
        </div>
        <div className="text-xs text-slate-400">
          Formula:{" "}
          <span className="font-mono text-cyan-400">
            Available = Current - Reserved
          </span>
        </div>
      </div>

      {/* Inventory Table */}
      <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950/60 text-slate-400 uppercase text-[10px] tracking-wider font-semibold border-b border-slate-800">
              <tr>
                <th className="p-3.5 pl-4">SKU</th>
                <th className="p-3.5">Hardware Product Name</th>
                <th className="p-3.5">Warehouse</th>
                <th className="p-3.5">Current Stock</th>
                <th className="p-3.5">Reserved Stock</th>
                <th className="p-3.5">Available Stock</th>
                <th className="p-3.5">Stock Status</th>
                <th className="p-3.5 pr-4 text-right">Stock Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredInventory.map((row) => (
                <tr key={row.id} className="hover:bg-slate-800/40 transition">
                  <td className="p-3.5 pl-4 font-mono font-bold text-cyan-400">
                    {row.sku}
                  </td>
                  <td className="p-3.5 font-semibold text-white">
                    {row.productName}
                  </td>
                  <td className="p-3.5 font-mono text-slate-400">
                    {row.warehouseCode}
                  </td>
                  <td className="p-3.5 font-bold text-white">
                    {row.currentStock} Units
                  </td>
                  <td className="p-3.5 text-amber-300 font-bold">
                    {row.reservedStock} Reserved
                  </td>
                  <td className="p-3.5 font-extrabold text-emerald-400">
                    {row.availableStock} Available
                  </td>
                  <td className="p-3.5">
                    {row.stockStatus === "IN_STOCK" && (
                      <span className="px-2.5 py-1 rounded-md bg-emerald-950/80 border border-emerald-500/40 text-emerald-400 font-bold text-[10px] inline-flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" /> IN STOCK
                      </span>
                    )}
                    {row.stockStatus === "LOW_STOCK" && (
                      <span className="px-2.5 py-1 rounded-md bg-amber-950/80 border border-amber-500/40 text-amber-300 font-bold text-[10px] inline-flex items-center gap-1">
                        <AlertTriangle className="w-3 h-3" /> LOW STOCK
                      </span>
                    )}
                    {row.stockStatus === "OUT_OF_STOCK" && (
                      <span className="px-2.5 py-1 rounded-md bg-rose-950/80 border border-rose-500/40 text-rose-300 font-bold text-[10px] inline-flex items-center gap-1">
                        <XCircle className="w-3 h-3" /> OUT OF STOCK
                      </span>
                    )}
                  </td>
                  <td className="p-3.5 pr-4 text-right">
                    <button
                      onClick={() => setEditingRow(row)}
                      className="px-3 py-1.5 rounded-lg bg-cyan-600/20 hover:bg-cyan-500 text-cyan-300 hover:text-white border border-cyan-500/30 transition text-[11px] font-semibold"
                    >
                      Adjust Stock
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Stock Adjustment Modal */}
      {editingRow && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-6 shadow-2xl">
            <div className="flex justify-between items-center pb-4 border-b border-slate-800">
              <h3 className="text-base font-bold text-white">
                Adjust Stock: {editingRow.sku}
              </h3>
              <button
                onClick={() => setEditingRow(null)}
                className="text-slate-400 hover:text-white text-xs"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex justify-between">
                <span className="text-slate-400">Current Stock:</span>
                <span className="font-bold text-white">
                  {editingRow.currentStock} Units
                </span>
              </div>

              <div>
                <label className="text-slate-300 font-semibold block mb-1.5">
                  Adjustment Quantity (+/- Delta)
                </label>
                <input
                  type="number"
                  value={adjustmentDelta}
                  onChange={(e) => setAdjustmentDelta(Number(e.target.value))}
                  className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-cyan-500 font-mono"
                />
                <span className="text-[10px] text-slate-500 mt-1 block">
                  Positive number adds incoming PO stock, negative reduces
                  stock.
                </span>
              </div>

              <div>
                <label className="text-slate-300 font-semibold block mb-1.5">
                  Adjustment Reference / Note
                </label>
                <input
                  type="text"
                  placeholder="PO-2026-884 Shipment Received"
                  value={adjustmentNote}
                  onChange={(e) => setAdjustmentNote(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-cyan-500"
                />
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                onClick={() => setEditingRow(null)}
                className="flex-1 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs transition"
              >
                Cancel
              </button>
              <button
                onClick={handleAdjustStock}
                className="flex-1 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-semibold text-xs transition"
              >
                Confirm Adjustment
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
