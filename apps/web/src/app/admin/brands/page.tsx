"use client";

import { useState } from "react";

interface BrandRow {
  id: string;
  name: string;
  slug: string;
  description: string;
}

const mockBrands: BrandRow[] = [
  {
    id: "b-1",
    name: "Cisco Systems",
    slug: "cisco",
    description: "Leader in enterprise networking, switching, and routing.",
  },
  {
    id: "b-2",
    name: "Fortinet",
    slug: "fortinet",
    description: "Global leader in cybersecurity and next-gen firewalls.",
  },
  {
    id: "b-3",
    name: "Ubiquiti Networks",
    slug: "ubiquiti",
    description:
      "High-performance enterprise wireless access points and UniFi OS.",
  },
  {
    id: "b-4",
    name: "Aruba Networks",
    slug: "aruba",
    description: "Hewlett Packard Enterprise wireless networking and switches.",
  },
];

export default function AdminBrandsPage() {
  const [brands] = useState<BrandRow[]>(mockBrands);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">
            Brand Partners Management
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Manage hardware manufacturers and brand vendor listings
          </p>
        </div>
      </div>

      <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950/60 text-slate-400 uppercase text-[10px] tracking-wider font-semibold border-b border-slate-800">
              <tr>
                <th className="p-3.5 pl-4">Brand Name</th>
                <th className="p-3.5">Slug</th>
                <th className="p-3.5">Description</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {brands.map((b) => (
                <tr key={b.id} className="hover:bg-slate-800/40 transition">
                  <td className="p-3.5 pl-4 font-bold text-white">{b.name}</td>
                  <td className="p-3.5 font-mono text-cyan-400">{b.slug}</td>
                  <td className="p-3.5 text-slate-400">{b.description}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
