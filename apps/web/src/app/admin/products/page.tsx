"use client";

import { useState } from "react";
import { Search, Plus, Edit2 } from "lucide-react";

interface ProductRow {
  id: string;
  sku: string;
  name: string;
  categoryName: string;
  brandName: string;
  price: string;
  isActive: boolean;
}

const mockProducts: ProductRow[] = [
  {
    id: "prod-1",
    sku: "C9300-48P-A",
    name: "Cisco Catalyst 9300 48-Port PoE+ Managed Switch",
    categoryName: "Switches & Routers",
    brandName: "Cisco",
    price: "14,500.00",
    isActive: true,
  },
  {
    id: "prod-2",
    sku: "FG-60F-BDL",
    name: "Fortinet FortiGate 60F Next-Gen Firewall",
    categoryName: "Firewalls & Security",
    brandName: "Fortinet",
    price: "4,200.00",
    isActive: true,
  },
  {
    id: "prod-3",
    sku: "MX84-HW",
    name: "Cisco Meraki MX84 Cloud Managed Security Appliance",
    categoryName: "Firewalls & Security",
    brandName: "Cisco",
    price: "8,900.00",
    isActive: false,
  },
];

export default function AdminProductsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [productsList, setProductsList] = useState<ProductRow[]>(mockProducts);
  const [isAdding, setIsAdding] = useState(false);
  const [newProduct, setNewProduct] = useState({
    sku: "",
    name: "",
    categoryName: "Switches & Routers",
    brandName: "Cisco",
    price: "",
  });

  const filteredProducts = productsList.filter(
    (p) =>
      p.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const handleToggleActive = (id: string) => {
    setProductsList((prev) =>
      prev.map((p) => (p.id === id ? { ...p, isActive: !p.isActive } : p)),
    );
  };

  const handleAddProduct = () => {
    if (!newProduct.sku || !newProduct.name || !newProduct.price) return;

    setProductsList((prev) => [
      ...prev,
      {
        id: `prod-${Date.now()}`,
        sku: newProduct.sku,
        name: newProduct.name,
        categoryName: newProduct.categoryName,
        brandName: newProduct.brandName,
        price: Number(newProduct.price).toLocaleString() + ".00",
        isActive: true,
      },
    ]);

    setIsAdding(false);
    setNewProduct({
      sku: "",
      name: "",
      categoryName: "Switches & Routers",
      brandName: "Cisco",
      price: "",
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">
            Product Catalog Management
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Add, edit, or deactivate hardware items in your B2B enterprise
            catalog
          </p>
        </div>

        <button
          onClick={() => setIsAdding(true)}
          className="px-4 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-semibold text-xs transition flex items-center gap-2 shadow-lg shadow-cyan-900/40"
        >
          <Plus className="w-4 h-4" /> Add New Product
        </button>
      </div>

      {/* Search */}
      <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between">
        <div className="w-80 relative">
          <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by SKU or hardware product name..."
            className="w-full pl-10 pr-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition"
          />
        </div>
      </div>

      {/* Table */}
      <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950/60 text-slate-400 uppercase text-[10px] tracking-wider font-semibold border-b border-slate-800">
              <tr>
                <th className="p-3.5 pl-4">SKU</th>
                <th className="p-3.5">Product Name</th>
                <th className="p-3.5">Category</th>
                <th className="p-3.5">Brand</th>
                <th className="p-3.5">Wholesale Price</th>
                <th className="p-3.5">Active Status</th>
                <th className="p-3.5 pr-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredProducts.map((p) => (
                <tr key={p.id} className="hover:bg-slate-800/40 transition">
                  <td className="p-3.5 pl-4 font-mono font-bold text-cyan-400">
                    {p.sku}
                  </td>
                  <td className="p-3.5 font-semibold text-white">{p.name}</td>
                  <td className="p-3.5 text-slate-400">{p.categoryName}</td>
                  <td className="p-3.5 text-slate-400">{p.brandName}</td>
                  <td className="p-3.5 font-bold text-white">AED {p.price}</td>
                  <td className="p-3.5">
                    <button
                      onClick={() => handleToggleActive(p.id)}
                      className={`px-2.5 py-1 rounded-md text-[10px] font-bold border transition ${
                        p.isActive
                          ? "bg-emerald-950/80 border-emerald-500/40 text-emerald-400"
                          : "bg-slate-800 border-slate-700 text-slate-500"
                      }`}
                    >
                      {p.isActive ? "ACTIVE" : "INACTIVE"}
                    </button>
                  </td>
                  <td className="p-3.5 pr-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition">
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Modal */}
      {isAdding && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4 shadow-2xl">
            <h3 className="text-base font-bold text-white pb-3 border-b border-slate-800">
              Add New Hardware Product
            </h3>

            <div className="space-y-3 text-xs">
              <div>
                <label className="text-slate-300 font-semibold block mb-1">
                  SKU
                </label>
                <input
                  type="text"
                  placeholder="C9300-48P-A"
                  value={newProduct.sku}
                  onChange={(e) =>
                    setNewProduct({ ...newProduct, sku: e.target.value })
                  }
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white font-mono"
                />
              </div>

              <div>
                <label className="text-slate-300 font-semibold block mb-1">
                  Product Name
                </label>
                <input
                  type="text"
                  placeholder="Cisco Catalyst Switch"
                  value={newProduct.name}
                  onChange={(e) =>
                    setNewProduct({ ...newProduct, name: e.target.value })
                  }
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white"
                />
              </div>

              <div>
                <label className="text-slate-300 font-semibold block mb-1">
                  Wholesale Price (AED)
                </label>
                <input
                  type="number"
                  placeholder="14500"
                  value={newProduct.price}
                  onChange={(e) =>
                    setNewProduct({ ...newProduct, price: e.target.value })
                  }
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white font-mono"
                />
              </div>
            </div>

            <div className="flex gap-3 pt-3">
              <button
                onClick={() => setIsAdding(false)}
                className="flex-1 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs transition"
              >
                Cancel
              </button>
              <button
                onClick={handleAddProduct}
                className="flex-1 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-semibold text-xs transition"
              >
                Save Product
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
