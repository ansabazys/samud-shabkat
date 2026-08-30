"use client";

import { useEffect, useState } from "react";
import {
  Boxes,
  Search,
  RefreshCw,
  AlertTriangle,
  ArrowUpRight,
  ArrowDownRight,
  Plus,
  Minus,
  Sliders,
  History,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Package,
  Layers,
  FileText,
  X,
  TrendingDown,
  ShieldCheck,
  Building2,
} from "lucide-react";
import { productsApi } from "@/lib/api/products-api";
import {
  inventoryApi,
  type InventoryDetails,
  type InventoryTransactionRecord,
} from "@/lib/api/inventory-api";
import type { Product, Category } from "@/lib/api";

interface ProductWithInventory extends Product {
  inventory?: InventoryDetails;
  loadingInv?: boolean;
}

export default function AdminInventoryPage() {
  const [activeTab, setActiveTab] = useState<"all" | "low-stock" | "history">("all");
  const [products, setProducts] = useState<ProductWithInventory[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [transactions, setTransactions] = useState<InventoryTransactionRecord[]>([]);
  const [lowStockItems, setLowStockItems] = useState<any[]>([]);

  const [loading, setLoading] = useState(true);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);

  // Filters
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");

  // Quick Adjust Modal State
  const [selectedProduct, setSelectedProduct] = useState<ProductWithInventory | null>(null);
  const [adjustmentType, setAdjustmentType] = useState<"ADD" | "SUBTRACT" | "SET">("ADD");
  const [adjustQuantity, setAdjustQuantity] = useState<string>("10");
  const [adjustReference, setAdjustReference] = useState("Manual Stock Adjustment");
  const [adjustNotes, setAdjustNotes] = useState("");
  const [submittingAdjust, setSubmittingAdjust] = useState(false);
  const [modalError, setModalError] = useState<string | null>(null);

  const fetchDependencies = async () => {
    try {
      const cats = await productsApi.getCategories();
      setCategories(Array.isArray(cats) ? cats : []);
    } catch (err) {
      console.error("Failed to load categories:", err);
    }
  };

  const fetchInventoryData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch all products
      const prodRes = await productsApi.getProducts({
        limit: 100,
        search: search || undefined,
        categoryId: categoryFilter || undefined,
      });

      const productList = Array.isArray(prodRes?.data) ? prodRes.data : [];

      // Fetch inventory details for each product in parallel
      const enrichedProducts = await Promise.all(
        productList.map(async (prod) => {
          try {
            const inv = await inventoryApi.getProductInventory(prod.id);
            return { ...prod, inventory: inv };
          } catch {
            return {
              ...prod,
              inventory: {
                productId: prod.id,
                currentStock: 0,
                reservedStock: 0,
                availableStock: 0,
                incomingStock: 0,
                minStock: 5,
                maxStock: 500,
                reorderLevel: 10,
                safetyStock: 5,
                stockStatus: "OUT_OF_STOCK" as const,
                isAvailable: false,
              },
            };
          }
        }),
      );

      setProducts(enrichedProducts);

      // Fetch low stock summary
      try {
        const lowRes = await inventoryApi.getLowStock({ limit: 50 });
        setLowStockItems(Array.isArray(lowRes?.data) ? lowRes.data : []);
      } catch {
        setLowStockItems([]);
      }
    } catch (err: any) {
      console.error("Failed to load inventory:", err);
      setError(err?.response?.data?.message || err?.message || "Failed to load inventory data.");
    } finally {
      setLoading(false);
    }
  };

  const fetchHistory = async () => {
    try {
      setLoadingHistory(true);
      const res = await inventoryApi.getTransactions({ limit: 50 });
      setTransactions(Array.isArray(res?.data) ? res.data : []);
    } catch (err) {
      console.error("Failed to fetch inventory transactions:", err);
    } finally {
      setLoadingHistory(false);
    }
  };

  useEffect(() => {
    fetchDependencies();
  }, []);

  useEffect(() => {
    fetchInventoryData();
  }, [categoryFilter]);

  useEffect(() => {
    if (activeTab === "history") {
      fetchHistory();
    }
  }, [activeTab]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchInventoryData();
  };

  const handleOpenAdjustModal = (product: ProductWithInventory, defaultType: "ADD" | "SUBTRACT" | "SET" = "ADD") => {
    setSelectedProduct(product);
    setAdjustmentType(defaultType);
    setAdjustQuantity("10");
    setAdjustReference(
      defaultType === "ADD"
        ? "Purchase Order Restock"
        : defaultType === "SUBTRACT"
          ? "Damaged / Audit Deduction"
          : "Inventory Count Reconciliation",
    );
    setAdjustNotes("");
    setModalError(null);
  };

  const handleExecuteAdjustment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProduct) return;

    const qty = parseInt(adjustQuantity, 10);
    if (isNaN(qty) || qty < 0) {
      setModalError("Please enter a valid non-negative quantity.");
      return;
    }

    try {
      setSubmittingAdjust(true);
      setModalError(null);

      await inventoryApi.adjustStock({
        productId: selectedProduct.id,
        adjustmentType,
        quantity: qty,
        reference: adjustReference.trim() || undefined,
        notes: adjustNotes.trim() || undefined,
      });

      setActionSuccess(`Successfully updated stock for ${selectedProduct.name}`);
      setSelectedProduct(null);
      fetchInventoryData();
      if (activeTab === "history") fetchHistory();

      setTimeout(() => setActionSuccess(null), 4000);
    } catch (err: any) {
      console.error("Stock adjustment failed:", err);
      setModalError(
        err?.response?.data?.message || err?.message || "Failed to adjust inventory stock.",
      );
    } finally {
      setSubmittingAdjust(false);
    }
  };

  // Summary KPIs
  const totalProducts = products.length;
  const totalUnits = products.reduce((acc, p) => acc + (p.inventory?.currentStock || 0), 0);
  const lowStockCount = products.filter(
    (p) => (p.inventory?.availableStock || 0) > 0 && (p.inventory?.availableStock || 0) <= (p.inventory?.reorderLevel || 10),
  ).length;
  const outOfStockCount = products.filter(
    (p) => (p.inventory?.availableStock || 0) <= 0,
  ).length;

  return (
    <div className="space-y-8">
      {/* Header & Actions */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-950 uppercase tracking-tight flex items-center gap-3">
            <Boxes className="w-7 h-7 text-emerald-700" />
            Stock & Inventory Control
          </h1>
          <p className="text-xs text-slate-500 font-medium mt-1">
            Real-time multi-SKU warehouse stock levels, low inventory alerts, and replenishment logs.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              fetchInventoryData();
              if (activeTab === "history") fetchHistory();
            }}
            className="flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold rounded-xl transition cursor-pointer shadow-2xs"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin text-emerald-600" : ""}`} />
            Refresh Inventory
          </button>
        </div>
      </div>

      {/* Global Notifications */}
      {actionSuccess && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-semibold p-4 rounded-2xl flex items-center justify-between shadow-2xs">
          <div className="flex items-center gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{actionSuccess}</span>
          </div>
          <button onClick={() => setActionSuccess(null)} className="text-emerald-700 hover:text-emerald-950">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-800 text-xs font-semibold p-4 rounded-2xl flex items-start gap-2.5 shadow-2xs">
          <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      {/* Metric KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-2xs space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500">
              Tracked SKUs
            </span>
            <Package className="w-4 h-4 text-slate-400" />
          </div>
          <p className="text-2xl font-black text-slate-950">{totalProducts}</p>
          <span className="text-[10px] text-slate-400 font-medium block">Catalog items in inventory</span>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-2xs space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500">
              Total On Hand
            </span>
            <Boxes className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="text-2xl font-black text-slate-950">{totalUnits} units</p>
          <span className="text-[10px] text-emerald-700 font-semibold block">Available warehouse stock</span>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-2xs space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-amber-700">
              Low Stock Warnings
            </span>
            <AlertTriangle className="w-4 h-4 text-amber-600" />
          </div>
          <p className="text-2xl font-black text-amber-600">{lowStockCount}</p>
          <span className="text-[10px] text-amber-700/80 font-medium block">At or below reorder threshold</span>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-2xs space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-rose-600">
              Out of Stock
            </span>
            <TrendingDown className="w-4 h-4 text-rose-500" />
          </div>
          <p className="text-2xl font-black text-rose-600">{outOfStockCount}</p>
          <span className="text-[10px] text-rose-500 font-medium block">Unavailable for order checkout</span>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
        <button
          onClick={() => setActiveTab("all")}
          className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition cursor-pointer flex items-center gap-2 ${
            activeTab === "all"
              ? "bg-[#15803d] text-white shadow-2xs"
              : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
          }`}
        >
          <Boxes className="w-3.5 h-3.5" />
          Stock Levels ({products.length})
        </button>

        <button
          onClick={() => setActiveTab("low-stock")}
          className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition cursor-pointer flex items-center gap-2 ${
            activeTab === "low-stock"
              ? "bg-amber-600 text-white shadow-2xs"
              : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
          }`}
        >
          <AlertTriangle className="w-3.5 h-3.5" />
          Low Stock Alerts ({lowStockCount + outOfStockCount})
        </button>

        <button
          onClick={() => setActiveTab("history")}
          className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition cursor-pointer flex items-center gap-2 ${
            activeTab === "history"
              ? "bg-[#15803d] text-white shadow-2xs"
              : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
          }`}
        >
          <History className="w-3.5 h-3.5" />
          Audit & Transaction Log
        </button>
      </div>

      {/* Tab 1: All Stock Levels Table */}
      {activeTab === "all" && (
        <div className="space-y-4">
          {/* Filters Bar */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-2xs flex flex-col md:flex-row items-center justify-between gap-4">
            <form onSubmit={handleSearchSubmit} className="flex items-center gap-3 w-full md:w-auto flex-1 max-w-md">
              <div className="relative w-full">
                <input
                  type="text"
                  placeholder="Search product name or SKU..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-emerald-600 focus:bg-white transition"
                />
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              </div>
              <button
                type="submit"
                className="bg-[#15803d] hover:bg-emerald-700 text-white font-extrabold text-xs px-4 py-2 rounded-xl uppercase tracking-wider transition cursor-pointer shadow-2xs shrink-0"
              >
                Search
              </button>
            </form>

            <div className="flex items-center gap-3 w-full md:w-auto">
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="w-full md:w-48 py-2 px-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:outline-none focus:border-emerald-600"
              >
                <option value="">All Categories</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Table */}
          <div className="bg-white border border-slate-200/90 rounded-2xl overflow-hidden shadow-2xs">
            {loading ? (
              <div className="py-20 text-center flex flex-col items-center justify-center space-y-3">
                <Loader2 className="w-8 h-8 text-emerald-600 animate-spin" />
                <span className="text-xs text-slate-500 font-medium">Fetching real-time stock levels...</span>
              </div>
            ) : (products || []).length === 0 ? (
              <div className="py-16 text-center text-xs text-slate-500 font-medium">
                No inventory records match the search filter.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-slate-100 bg-slate-50/80 text-slate-500 font-extrabold uppercase text-[10px] tracking-wider">
                      <th className="py-3.5 px-4">Product Details</th>
                      <th className="py-3.5 px-4">SKU</th>
                      <th className="py-3.5 px-4 text-center">Physical Stock</th>
                      <th className="py-3.5 px-4 text-center">Reserved</th>
                      <th className="py-3.5 px-4 text-center">Available Stock</th>
                      <th className="py-3.5 px-4 text-center">Status</th>
                      <th className="py-3.5 px-4 text-right">Stock Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-800 font-medium">
                    {(products || []).map((p) => {
                      const inv = p.inventory;
                      const current = inv?.currentStock ?? 0;
                      const reserved = inv?.reservedStock ?? 0;
                      const available = inv?.availableStock ?? current - reserved;
                      const reorder = inv?.reorderLevel ?? 10;

                      let statusBadge = (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-black uppercase bg-emerald-50 text-emerald-700 border border-emerald-200">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>
                          In Stock
                        </span>
                      );

                      if (available <= 0) {
                        statusBadge = (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-black uppercase bg-rose-50 text-rose-700 border border-rose-200">
                            <span className="w-1.5 h-1.5 rounded-full bg-rose-600"></span>
                            Out of Stock
                          </span>
                        );
                      } else if (available <= reorder) {
                        statusBadge = (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-black uppercase bg-amber-50 text-amber-800 border border-amber-200">
                            <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                            Low Stock (≤{reorder})
                          </span>
                        );
                      }

                      return (
                        <tr key={p.id} className="hover:bg-slate-50 transition">
                          <td className="py-4 px-4">
                            <div className="font-black text-slate-950 text-xs">{p.name}</div>
                            <div className="text-[11px] text-slate-500 flex items-center gap-2 mt-0.5">
                              <span>Price: ₹{parseFloat(p.price as any || "0").toLocaleString("en-IN")}</span>
                              {p.category && (
                                <span className="text-slate-600 bg-slate-100 px-1.5 py-0.5 rounded text-[10px] font-medium">
                                  {p.category.name}
                                </span>
                              )}
                            </div>
                          </td>

                          <td className="py-4 px-4 font-mono font-bold text-slate-700 text-xs">
                            {p.sku}
                          </td>

                          <td className="py-4 px-4 text-center font-bold text-slate-900 text-sm">
                            {current}
                          </td>

                          <td className="py-4 px-4 text-center font-bold text-amber-700 text-xs">
                            {reserved > 0 ? `${reserved} reserved` : "0"}
                          </td>

                          <td className="py-4 px-4 text-center">
                            <span
                              className={`text-sm font-black ${
                                available <= 0
                                  ? "text-rose-600"
                                  : available <= reorder
                                    ? "text-amber-600"
                                    : "text-emerald-700"
                              }`}
                            >
                              {available}
                            </span>
                          </td>

                          <td className="py-4 px-4 text-center">{statusBadge}</td>

                          <td className="py-4 px-4 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              <button
                                onClick={() => handleOpenAdjustModal(p, "ADD")}
                                title="Restock / Add Units"
                                className="p-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 transition cursor-pointer flex items-center gap-1 font-bold text-[11px] px-2.5"
                              >
                                <Plus className="w-3 h-3 text-emerald-700" />
                                Restock
                              </button>

                              <button
                                onClick={() => handleOpenAdjustModal(p, "SUBTRACT")}
                                title="Subtract Units"
                                className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 transition cursor-pointer flex items-center gap-1 font-bold text-[11px] px-2"
                              >
                                <Minus className="w-3 h-3 text-slate-600" />
                              </button>

                              <button
                                onClick={() => handleOpenAdjustModal(p, "SET")}
                                title="Set Exact Quantity"
                                className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 transition cursor-pointer"
                              >
                                <Sliders className="w-3.5 h-3.5 text-slate-600" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Tab 2: Low Stock Alerts */}
      {activeTab === "low-stock" && (
        <div className="space-y-4">
          <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 flex items-center gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />
            <p className="text-xs font-semibold">
              The products listed below have reached or fallen below their configured safety re-order levels. Replenish purchase orders immediately to avoid stockout.
            </p>
          </div>

          <div className="bg-white border border-slate-200/90 rounded-2xl overflow-hidden shadow-2xs">
            {products.filter((p) => (p.inventory?.availableStock || 0) <= (p.inventory?.reorderLevel || 10)).length === 0 ? (
              <div className="py-16 text-center text-xs text-slate-500 font-medium">
                All catalog items currently meet healthy warehouse inventory levels.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-slate-100 bg-slate-50/80 text-slate-500 font-extrabold uppercase text-[10px] tracking-wider">
                      <th className="py-3.5 px-4">Item Name</th>
                      <th className="py-3.5 px-4">SKU</th>
                      <th className="py-3.5 px-4 text-center">Current Stock</th>
                      <th className="py-3.5 px-4 text-center">Safety Reorder Point</th>
                      <th className="py-3.5 px-4 text-center">Urgency Level</th>
                      <th className="py-3.5 px-4 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-800 font-medium">
                    {products
                      .filter((p) => (p.inventory?.availableStock || 0) <= (p.inventory?.reorderLevel || 10))
                      .map((p) => {
                        const inv = p.inventory;
                        const available = inv?.availableStock ?? 0;
                        const reorder = inv?.reorderLevel ?? 10;
                        const isCritical = available <= 0;

                        return (
                          <tr key={p.id} className="hover:bg-slate-50 transition">
                            <td className="py-4 px-4 font-black text-slate-950">
                              {p.name}
                            </td>
                            <td className="py-4 px-4 font-mono font-bold text-slate-700">
                              {p.sku}
                            </td>
                            <td className="py-4 px-4 text-center font-black text-sm text-rose-600">
                              {available} units
                            </td>
                            <td className="py-4 px-4 text-center font-bold text-slate-600">
                              {reorder} units
                            </td>
                            <td className="py-4 px-4 text-center">
                              {isCritical ? (
                                <span className="px-2.5 py-1 rounded-full text-[10px] font-black uppercase bg-rose-100 text-rose-800 border border-rose-300">
                                  CRITICAL OUT OF STOCK
                                </span>
                              ) : (
                                <span className="px-2.5 py-1 rounded-full text-[10px] font-black uppercase bg-amber-100 text-amber-900 border border-amber-300">
                                  REORDER REQUIRED
                                </span>
                              )}
                            </td>
                            <td className="py-4 px-4 text-right">
                              <button
                                onClick={() => handleOpenAdjustModal(p, "ADD")}
                                className="px-3 py-1.5 bg-[#15803d] hover:bg-emerald-700 text-white font-extrabold rounded-lg text-xs transition cursor-pointer shadow-2xs"
                              >
                                Restock Item
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Tab 3: Transaction Audit Logs */}
      {activeTab === "history" && (
        <div className="space-y-4">
          <div className="bg-white border border-slate-200/90 rounded-2xl overflow-hidden shadow-2xs">
            {loadingHistory ? (
              <div className="py-20 text-center flex flex-col items-center justify-center space-y-3">
                <Loader2 className="w-8 h-8 text-emerald-600 animate-spin" />
                <span className="text-xs text-slate-500 font-medium">Loading inventory transaction history...</span>
              </div>
            ) : (transactions || []).length === 0 ? (
              <div className="py-16 text-center text-xs text-slate-500 font-medium">
                No recorded stock movement transactions found.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-slate-100 bg-slate-50/80 text-slate-500 font-extrabold uppercase text-[10px] tracking-wider">
                      <th className="py-3.5 px-4">Date & Time</th>
                      <th className="py-3.5 px-4">Operation Type</th>
                      <th className="py-3.5 px-4 text-center">Change (Δ)</th>
                      <th className="py-3.5 px-4 text-center">Stock Balance After</th>
                      <th className="py-3.5 px-4">Reference & Reason</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-800 font-medium">
                    {(transactions || []).map((tx) => {
                      const isPositive = tx.quantityDelta > 0;
                      const isZero = tx.quantityDelta === 0;

                      return (
                        <tr key={tx.id} className="hover:bg-slate-50 transition">
                          <td className="py-3.5 px-4 font-mono text-[11px] text-slate-500">
                            {new Date(tx.createdAt).toLocaleString("en-IN", {
                              day: "2-digit",
                              month: "short",
                              year: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </td>

                          <td className="py-3.5 px-4">
                            <span className="font-extrabold text-slate-900 uppercase text-[11px] px-2 py-0.5 bg-slate-100 rounded border border-slate-200">
                              {tx.transactionType}
                            </span>
                          </td>

                          <td className="py-3.5 px-4 text-center font-mono font-extrabold text-sm">
                            {isZero ? (
                              <span className="text-slate-400">0</span>
                            ) : isPositive ? (
                              <span className="text-emerald-700 flex items-center justify-center gap-0.5">
                                <ArrowUpRight className="w-3.5 h-3.5" /> +{tx.quantityDelta}
                              </span>
                            ) : (
                              <span className="text-rose-600 flex items-center justify-center gap-0.5">
                                <ArrowDownRight className="w-3.5 h-3.5" /> {tx.quantityDelta}
                              </span>
                            )}
                          </td>

                          <td className="py-3.5 px-4 text-center font-mono font-bold text-slate-900">
                            {tx.stockAfter} units
                          </td>

                          <td className="py-3.5 px-4">
                            <div className="font-bold text-slate-800 text-xs">
                              {tx.reference || "Direct adjustment"}
                            </div>
                            {tx.notes && (
                              <div className="text-[11px] text-slate-500 font-normal mt-0.5">
                                {tx.notes}
                              </div>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Quick Stock Adjustment Modal */}
      {selectedProduct && (
        <div className="fixed inset-0 z-50 bg-slate-950/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-slate-200 max-w-lg w-full p-6 sm:p-8 space-y-6 shadow-2xl animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <h3 className="text-lg font-black text-slate-950 uppercase tracking-tight flex items-center gap-2">
                  <Boxes className="w-5 h-5 text-emerald-700" />
                  Adjust Stock Level
                </h3>
                <p className="text-xs text-slate-500 font-medium mt-0.5">
                  Update inventory counts for <strong className="text-slate-900">{selectedProduct.name}</strong>
                </p>
              </div>
              <button
                onClick={() => setSelectedProduct(null)}
                className="p-1.5 rounded-xl hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {modalError && (
              <div className="bg-red-50 border border-red-200 text-red-800 text-xs font-semibold p-3.5 rounded-xl flex items-start gap-2.5">
                <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                <span>{modalError}</span>
              </div>
            )}

            <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200/90 flex items-center justify-between text-xs">
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-black tracking-wider block">Current Stock</span>
                <span className="text-base font-black text-slate-950">{selectedProduct.inventory?.currentStock ?? 0} units</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-black tracking-wider block">Reserved</span>
                <span className="text-base font-black text-amber-700">{selectedProduct.inventory?.reservedStock ?? 0} units</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-black tracking-wider block">Available</span>
                <span className="text-base font-black text-emerald-700">{selectedProduct.inventory?.availableStock ?? 0} units</span>
              </div>
            </div>

            <form onSubmit={handleExecuteAdjustment} className="space-y-4">
              {/* Adjustment Mode Selection */}
              <div className="space-y-1.5">
                <label className="text-xs font-black uppercase tracking-wider text-slate-700 block">
                  Action Type
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setAdjustmentType("ADD")}
                    className={`py-2.5 px-3 rounded-xl text-xs font-black uppercase tracking-wider transition cursor-pointer flex items-center justify-center gap-1.5 border ${
                      adjustmentType === "ADD"
                        ? "bg-emerald-50 text-emerald-800 border-emerald-300 shadow-2xs"
                        : "bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100"
                    }`}
                  >
                    <Plus className="w-3.5 h-3.5" /> Add Stock
                  </button>

                  <button
                    type="button"
                    onClick={() => setAdjustmentType("SUBTRACT")}
                    className={`py-2.5 px-3 rounded-xl text-xs font-black uppercase tracking-wider transition cursor-pointer flex items-center justify-center gap-1.5 border ${
                      adjustmentType === "SUBTRACT"
                        ? "bg-rose-50 text-rose-800 border-rose-300 shadow-2xs"
                        : "bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100"
                    }`}
                  >
                    <Minus className="w-3.5 h-3.5" /> Deduct
                  </button>

                  <button
                    type="button"
                    onClick={() => setAdjustmentType("SET")}
                    className={`py-2.5 px-3 rounded-xl text-xs font-black uppercase tracking-wider transition cursor-pointer flex items-center justify-center gap-1.5 border ${
                      adjustmentType === "SET"
                        ? "bg-blue-50 text-blue-800 border-blue-300 shadow-2xs"
                        : "bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100"
                    }`}
                  >
                    <Sliders className="w-3.5 h-3.5" /> Set Total
                  </button>
                </div>
              </div>

              {/* Quantity */}
              <div className="space-y-1.5">
                <label className="text-xs font-black uppercase tracking-wider text-slate-700 block">
                  {adjustmentType === "SET" ? "Exact New Stock Count" : "Quantity Units"}
                </label>
                <input
                  type="number"
                  min="1"
                  required
                  value={adjustQuantity}
                  onChange={(e) => setAdjustQuantity(e.target.value)}
                  placeholder="e.g. 25"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:border-emerald-600 focus:bg-white transition"
                />
              </div>

              {/* Reference */}
              <div className="space-y-1.5">
                <label className="text-xs font-black uppercase tracking-wider text-slate-700 block">
                  PO / Audit Reference
                </label>
                <input
                  type="text"
                  value={adjustReference}
                  onChange={(e) => setAdjustReference(e.target.value)}
                  placeholder="e.g. PO-8491, Warehouse Audit 2026"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:outline-none focus:border-emerald-600 focus:bg-white transition"
                />
              </div>

              {/* Notes */}
              <div className="space-y-1.5">
                <label className="text-xs font-black uppercase tracking-wider text-slate-700 block">
                  Optional Notes
                </label>
                <textarea
                  rows={2}
                  value={adjustNotes}
                  onChange={(e) => setAdjustNotes(e.target.value)}
                  placeholder="Additional context about this inventory update..."
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:outline-none focus:border-emerald-600 focus:bg-white transition"
                />
              </div>

              <div className="pt-3 flex items-center justify-end gap-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setSelectedProduct(null)}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-xs font-bold text-slate-700 transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submittingAdjust}
                  className="px-5 py-2.5 rounded-xl bg-[#15803d] hover:bg-emerald-700 text-white text-xs font-black uppercase tracking-wider transition cursor-pointer flex items-center gap-2 shadow-2xs active:scale-98 disabled:opacity-50"
                >
                  {submittingAdjust ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      Updating...
                    </>
                  ) : (
                    "Apply Adjustment"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
