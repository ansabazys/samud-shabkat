"use client";

import { useState, use } from "react";
import Link from "next/link";
import { useCartStore } from "@/store/cart-store";
import {
  ShoppingBag,
  ShieldCheck,
  Truck,
  ArrowLeft,
  Layers,
  Phone,
  AlertTriangle,
} from "lucide-react";
import type { Product } from "@/lib/api";

const sampleProductsMap: Record<string, Product> = {
  "prod-1": {
    id: "prod-1",
    name: "Cisco Catalyst 9300 48-Port PoE+ Managed Switch",
    slug: "cisco-catalyst-9300-48p",
    sku: "C9300-48P-A",
    shortDescription:
      "Stackable enterprise switch with 48 PoE+ ports, UPOE capability and dual power supply support.",
    description:
      "The Cisco Catalyst 9300 Series is Cisco's lead stackable enterprise switching platform built for security, IoT, mobility, and cloud. C9300-48P-A is 48 ports PoE+, Network Advantage switch of 9300 series.",
    price: 14500,
    categoryId: "cat-1",
    brandId: "brand-cisco",
    specifications: {
      "Total Ports": "48 Port PoE+",
      "PoE Power Budget": "437 W",
      "Switching Capacity": "256 Gbps",
      "Staking Bandwidth": "480 Gbps",
      DRAM: "16 GB",
      "Flash Memory": "16 GB",
    },
    isActive: true,
    category: {
      id: "cat-1",
      name: "Switches & Routers",
      slug: "switches-routers",
    },
    brand: { id: "brand-cisco", name: "Cisco", slug: "cisco" },
    availableStock: 45,
    stockStatus: "IN_STOCK",
    images: [
      {
        id: "img-1",
        url: "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=1000&auto=format&fit=crop",
        isPrimary: true,
      },
    ],
  },
};

export default function ProductDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const productId = resolvedParams.id;
  const product = sampleProductsMap[productId] || sampleProductsMap["prod-1"];

  const availableStock = product.availableStock ?? 45;
  const isOutOfStock = availableStock <= 0;
  const isLowStock = availableStock > 0 && availableStock <= 10;

  const [quantity, setQuantity] = useState(1);
  const addItem = useCartStore((state) => state.addItem);

  const primaryImage =
    product.images?.find((img) => img.isPrimary)?.url ||
    product.images?.[0]?.url ||
    "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=1000&auto=format&fit=crop";

  return (
    <div className="space-y-12">
      {/* Breadcrumb / Back Link */}
      <div>
        <Link
          href="/products"
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-cyan-400 transition"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Catalog
        </Link>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
        {/* Product Image */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 aspect-square relative flex items-center justify-center overflow-hidden">
          <img
            src={primaryImage}
            alt={product.name}
            className="w-full h-full object-cover rounded-2xl"
          />
        </div>

        {/* Product Info & Purchase Form */}
        <div className="space-y-6">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 mb-2">
              <span>SKU: {product.sku}</span>
              <span>•</span>
              <span>{product.brand?.name}</span>
            </div>
            <h1 className="text-3xl font-bold text-white leading-tight">
              {product.name}
            </h1>
          </div>

          {/* Low Stock Alert */}
          {isLowStock && (
            <div className="p-4 rounded-2xl bg-amber-950/70 border border-amber-500/40 text-amber-200 text-xs flex items-center gap-3">
              <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0" />
              <div>
                <span className="font-bold block">Low Stock Alert</span>
                <span>
                  Only {availableStock} units remaining. Order soon to reserve
                  hardware.
                </span>
              </div>
            </div>
          )}

          <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 flex items-center justify-between">
            <div>
              <span className="text-xs text-slate-400 uppercase tracking-wider block font-semibold">
                Wholesale Unit Price
              </span>
              <span className="text-3xl font-extrabold text-cyan-400">
                AED {Number(product.price).toLocaleString()}
              </span>
            </div>
            <div className="text-right">
              <span className="text-xs text-slate-400 uppercase tracking-wider block font-semibold">
                Available Stock
              </span>
              <span
                className={`text-lg font-bold ${availableStock > 0 ? "text-emerald-400" : "text-rose-400"}`}
              >
                {availableStock} Units Available
              </span>
            </div>
          </div>

          <p className="text-sm text-slate-300 leading-relaxed">
            {product.description}
          </p>

          {/* Quantity Picker & Add to Cart */}
          <div className="space-y-4 pt-4 border-t border-slate-800">
            <div className="flex items-center justify-between gap-4">
              <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                Quantity Required:
              </span>
              <div className="flex items-center bg-slate-900 border border-slate-700 rounded-xl p-1">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-3 py-1 text-slate-300 hover:text-white font-bold text-sm"
                >
                  -
                </button>
                <span className="px-4 py-1 text-sm font-bold text-white">
                  {quantity}
                </span>
                <button
                  onClick={() =>
                    setQuantity(Math.min(availableStock, quantity + 1))
                  }
                  disabled={quantity >= availableStock}
                  className="px-3 py-1 text-slate-300 hover:text-white font-bold text-sm disabled:opacity-30"
                >
                  +
                </button>
              </div>
            </div>

            <div className="flex gap-4">
              <button
                onClick={() => addItem(product, quantity)}
                disabled={isOutOfStock}
                className={`flex-1 py-4 px-6 rounded-2xl font-bold text-sm shadow-xl transition flex items-center justify-center gap-2 ${
                  isOutOfStock
                    ? "bg-slate-800 text-slate-500 border border-slate-700 cursor-not-allowed"
                    : "bg-gradient-to-r from-cyan-500 via-sky-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white shadow-cyan-500/20"
                }`}
              >
                <ShoppingBag className="w-5 h-5" />{" "}
                {isOutOfStock ? "Out of Stock" : "Add to Order Cart"}
              </button>
              <a
                href={`https://wa.me/97141234567?text=Quotation%20Request%20for%20${encodeURIComponent(product.sku)}`}
                target="_blank"
                rel="noreferrer"
                className="px-5 py-4 rounded-2xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white font-semibold text-sm transition flex items-center justify-center gap-2"
              >
                <Phone className="w-4 h-4 text-cyan-400" /> WhatsApp Sales
              </a>
            </div>
          </div>

          {/* Value Props */}
          <div className="grid grid-cols-2 gap-4 pt-4 text-xs text-slate-300">
            <div className="flex items-center gap-2 p-3 rounded-xl bg-slate-900/60 border border-slate-800">
              <ShieldCheck className="w-4 h-4 text-cyan-400 shrink-0" />{" "}
              Official Manufacturer Warranty
            </div>
            <div className="flex items-center gap-2 p-3 rounded-xl bg-slate-900/60 border border-slate-800">
              <Truck className="w-4 h-4 text-cyan-400 shrink-0" /> Same-day
              Dispatch Available
            </div>
          </div>
        </div>
      </div>

      {/* Specifications Table */}
      {product.specifications &&
        Object.keys(product.specifications).length > 0 && (
          <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-8 space-y-6">
            <div className="flex items-center gap-2 text-lg font-bold text-white pb-4 border-b border-slate-800">
              <Layers className="w-5 h-5 text-cyan-400" /> Technical
              Specifications
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.entries(product.specifications).map(([key, val]) => (
                <div
                  key={key}
                  className="flex items-center justify-between p-3.5 rounded-xl bg-slate-950/60 border border-slate-800/80 text-xs"
                >
                  <span className="text-slate-400 font-medium">{key}</span>
                  <span className="text-white font-semibold">
                    {String(val)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
    </div>
  );
}
