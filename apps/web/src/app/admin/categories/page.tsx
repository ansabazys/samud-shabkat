"use client";

import { useState } from "react";

interface CategoryRow {
  id: string;
  name: string;
  slug: string;
  description: string;
  productsCount: number;
}

const mockCategories: CategoryRow[] = [
  {
    id: "cat-1",
    name: "Switches & Routers",
    slug: "switches-routers",
    description:
      "Enterprise layer 2 & layer 3 switches, routers, and stacking modules.",
    productsCount: 42,
  },
  {
    id: "cat-2",
    name: "Firewalls & Security",
    slug: "firewalls-security",
    description:
      "Next-gen threat defense firewalls, VPN gateways, and UTM appliances.",
    productsCount: 28,
  },
  {
    id: "cat-3",
    name: "Wireless & Access Points",
    slug: "wireless-access-points",
    description:
      "High-density Wi-Fi 6/6E access points and wireless LAN controllers.",
    productsCount: 35,
  },
];

export default function AdminCategoriesPage() {
  const [categories] = useState<CategoryRow[]>(mockCategories);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">
            Categories Management
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Organize hardware product taxonomies and department categories
          </p>
        </div>
      </div>

      <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950/60 text-slate-400 uppercase text-[10px] tracking-wider font-semibold border-b border-slate-800">
              <tr>
                <th className="p-3.5 pl-4">Category Name</th>
                <th className="p-3.5">Slug</th>
                <th className="p-3.5">Description</th>
                <th className="p-3.5">Assigned Products</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {categories.map((c) => (
                <tr key={c.id} className="hover:bg-slate-800/40 transition">
                  <td className="p-3.5 pl-4 font-bold text-white">{c.name}</td>
                  <td className="p-3.5 font-mono text-cyan-400">{c.slug}</td>
                  <td className="p-3.5 text-slate-400">{c.description}</td>
                  <td className="p-3.5 font-semibold text-emerald-400">
                    {c.productsCount} Items
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
