import Link from "next/link";
import { ArrowRight, Server, Cpu, Zap, Layers, Globe } from "lucide-react";
import { ProductCard } from "@/components/product/product-card";
import type { Product, Category } from "@/lib/api";

// Fallback sample data for rich UI rendering when API is offline/connecting
const sampleCategories: Category[] = [
  {
    id: "cat-1",
    name: "Enterprise Switches & Routers",
    slug: "switches-routers",
    description: "High-density Layer 2 & 3 managed switches and core routers.",
  },
  {
    id: "cat-2",
    name: "Fiber Optic Solutions",
    slug: "fiber-optics",
    description:
      "Single-mode & Multi-mode patch cables, transceivers & SFP+ modules.",
  },
  {
    id: "cat-3",
    name: "Rack Servers & Storage",
    slug: "servers-storage",
    description:
      "High-performance Xeon enterprise servers & NAS storage arrays.",
  },
  {
    id: "cat-4",
    name: "Wireless Access Points",
    slug: "wireless-ap",
    description: "Wi-Fi 6 & 7 enterprise wireless access points & controllers.",
  },
];

const sampleProducts: Product[] = [
  {
    id: "prod-1",
    name: "Cisco Catalyst 9300 48-Port PoE+ Managed Switch",
    slug: "cisco-catalyst-9300-48p",
    sku: "C9300-48P-A",
    shortDescription:
      "Stackable enterprise switch with 48 PoE+ ports, UPOE capability and dual power supply support.",
    price: 14500,
    categoryId: "cat-1",
    brandId: "brand-cisco",
    isActive: true,
    category: {
      id: "cat-1",
      name: "Switches & Routers",
      slug: "switches-routers",
    },
    brand: { id: "brand-cisco", name: "Cisco", slug: "cisco" },
    images: [
      {
        id: "img-1",
        url: "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=800&auto=format&fit=crop",
        isPrimary: true,
      },
    ],
  },
  {
    id: "prod-2",
    name: "MikroTik CCR2216-1G-12XS-2XQ 100G Router",
    slug: "mikrotik-ccr2216",
    sku: "CCR2216-12XS-2XQ",
    shortDescription:
      "Flagship Cloud Core Router with 16-core Marvell CPU, 2x 100G QSFP28 ports and 12x 25G SFP28.",
    price: 8900,
    categoryId: "cat-1",
    brandId: "brand-mikrotik",
    isActive: true,
    category: {
      id: "cat-1",
      name: "Switches & Routers",
      slug: "switches-routers",
    },
    brand: { id: "brand-mikrotik", name: "MikroTik", slug: "mikrotik" },
    images: [
      {
        id: "img-2",
        url: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&auto=format&fit=crop",
        isPrimary: true,
      },
    ],
  },
  {
    id: "prod-3",
    name: "Ubiquiti UniFi U7 Pro Wi-Fi 7 Access Point",
    slug: "ubiquiti-u7-pro",
    sku: "U7-PRO-US",
    shortDescription:
      "Ceiling-mounted Wi-Fi 7 access point with 6 GHz support, 9.3 Gbps throughput and 2.5G PoE+.",
    price: 1250,
    categoryId: "cat-4",
    brandId: "brand-ubiquiti",
    isActive: true,
    category: {
      id: "cat-4",
      name: "Wireless Access Points",
      slug: "wireless-ap",
    },
    brand: { id: "brand-ubiquiti", name: "Ubiquiti", slug: "ubiquiti" },
    images: [
      {
        id: "img-3",
        url: "https://images.unsplash.com/photo-1606904825846-647eb07f5be2?w=800&auto=format&fit=crop",
        isPrimary: true,
      },
    ],
  },
  {
    id: "prod-4",
    name: "10G SFP+ Single-Mode LC Fiber Transceiver 10km",
    slug: "sfp-plus-10g-lr",
    sku: "SFP-10G-LR-SM",
    shortDescription:
      "Duplex LC 1310nm 10GBASE-LR optical transceiver module for Cisco & HP switches.",
    price: 280,
    categoryId: "cat-2",
    brandId: "brand-generic",
    isActive: true,
    category: {
      id: "cat-2",
      name: "Fiber Optic Solutions",
      slug: "fiber-optics",
    },
    brand: { id: "brand-generic", name: "OptiLink", slug: "optilink" },
    images: [
      {
        id: "img-4",
        url: "https://images.unsplash.com/photo-1517420784984-2244be3057d6?w=800&auto=format&fit=crop",
        isPrimary: true,
      },
    ],
  },
];

export default async function HomePage() {
  return (
    <div className="space-y-16">
      {/* Hero Section */}
      <section className="relative rounded-3xl overflow-hidden glass-panel p-8 sm:p-12 border border-slate-800 shadow-2xl">
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-950/80 border border-cyan-500/30 text-cyan-300 text-xs font-semibold">
            <Zap className="w-3.5 h-3.5" /> Direct B2B Distribution & Stockist
            in UAE
          </div>

          <h1 className="text-4xl sm:text-6xl font-black text-white tracking-tight leading-[1.1]">
            Enterprise Network <br />
            <span className="gradient-text">Hardware & Infrastructure</span>
          </h1>

          <p className="text-base sm:text-lg text-slate-300 leading-relaxed">
            Source authentic Cisco, MikroTik, Ubiquiti, and fiber optic hardware
            at wholesale prices. Fast delivery across Dubai, Abu Dhabi, and the
            wider GCC region.
          </p>

          <div className="flex flex-wrap gap-4 pt-2">
            <Link
              href="/products"
              className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold text-sm shadow-lg shadow-cyan-500/25 transition flex items-center gap-2"
            >
              Browse Full Catalog <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/categories"
              className="px-6 py-3.5 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 text-white font-semibold text-sm transition"
            >
              Explore Categories
            </Link>
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-12 pt-8 border-t border-slate-800/80 text-center sm:text-left">
          <div>
            <span className="block text-2xl font-bold text-cyan-400">
              10,000+
            </span>
            <span className="text-xs text-slate-400">SKUs in Local Stock</span>
          </div>
          <div>
            <span className="block text-2xl font-bold text-cyan-400">100%</span>
            <span className="text-xs text-slate-400">Genuine Guarantee</span>
          </div>
          <div>
            <span className="block text-2xl font-bold text-cyan-400">
              Same-Day
            </span>
            <span className="text-xs text-slate-400">Dubai Dispatch</span>
          </div>
          <div>
            <span className="block text-2xl font-bold text-cyan-400">24/7</span>
            <span className="text-xs text-slate-400">B2B Order Support</span>
          </div>
        </div>
      </section>

      {/* Featured Categories */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-white tracking-tight">
              Core Product Categories
            </h2>
            <p className="text-xs text-slate-400">
              Select a category to view specialized enterprise equipment
            </p>
          </div>
          <Link
            href="/categories"
            className="text-xs font-semibold text-cyan-400 hover:text-cyan-300 flex items-center gap-1 transition"
          >
            View All <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {sampleCategories.map((cat, idx) => {
            const icons = [Server, Globe, Cpu, Layers];
            const IconComponent = icons[idx % icons.length];
            return (
              <Link
                key={cat.id}
                href={`/products?category=${cat.slug}`}
                className="group p-6 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-cyan-500/40 hover:bg-slate-850/80 transition-all duration-300 flex flex-col justify-between"
              >
                <div className="p-3 w-12 h-12 rounded-xl bg-slate-800 group-hover:bg-cyan-950 group-hover:text-cyan-400 text-slate-300 border border-slate-700/60 transition mb-4">
                  <IconComponent className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-white text-base group-hover:text-cyan-400 transition">
                    {cat.name}
                  </h3>
                  <p className="text-xs text-slate-400 mt-1 line-clamp-2">
                    {cat.description}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Trending Products Grid */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-white tracking-tight">
              Trending Hardware
            </h2>
            <p className="text-xs text-slate-400">
              Featured in-stock products for immediate procurement
            </p>
          </div>
          <Link
            href="/products"
            className="text-xs font-semibold text-cyan-400 hover:text-cyan-300 flex items-center gap-1 transition"
          >
            Browse Catalog <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {sampleProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* Why Choose Us Banner */}
      <section className="rounded-3xl bg-slate-900 border border-slate-800 p-8 sm:p-12 relative overflow-hidden">
        <div className="max-w-2xl space-y-4 relative z-10">
          <h2 className="text-2xl sm:text-3xl font-bold text-white">
            Need Bulk B2B Quotations or Custom Telecom Orders?
          </h2>
          <p className="text-sm text-slate-300 leading-relaxed">
            Our engineering team assists IT integrators, ISPs, and government
            contractors with bill-of-materials (BOM) pricing, tax invoice
            processing, and expedited logistics.
          </p>
          <div className="pt-2">
            <a
              href="mailto:sales@samudshabkat.com"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-semibold text-sm transition shadow-lg shadow-cyan-600/20"
            >
              Request Custom B2B Quote
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
