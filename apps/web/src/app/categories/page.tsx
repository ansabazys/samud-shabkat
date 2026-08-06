import Link from "next/link";
import { Server, Globe, Cpu, Layers, ArrowRight } from "lucide-react";

const categories = [
  {
    id: "cat-1",
    name: "Enterprise Switches & Routers",
    slug: "switches-routers",
    description:
      "Layer 2 & Layer 3 managed switches, core routers, stackable switches for enterprise networks.",
    count: 42,
  },
  {
    id: "cat-2",
    name: "Fiber Optic Solutions",
    slug: "fiber-optics",
    description:
      "Single-mode & multi-mode fiber patch cables, optical transceivers, patch panels, and SFP+ modules.",
    count: 68,
  },
  {
    id: "cat-3",
    name: "Rack Servers & Storage",
    slug: "servers-storage",
    description:
      "1U/2U enterprise rack servers, RAID controllers, enterprise SSDs, and SAN/NAS storage arrays.",
    count: 24,
  },
  {
    id: "cat-4",
    name: "Wireless Access Points",
    slug: "wireless-ap",
    description:
      "Wi-Fi 6 & 7 indoor and outdoor wireless access points, PoE injectors, and hardware controllers.",
    count: 35,
  },
];

export default function CategoriesPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-white tracking-tight">
          Hardware Categories
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Browse our complete spectrum of enterprise infrastructure categories
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {categories.map((cat, idx) => {
          const icons = [Server, Globe, Cpu, Layers];
          const IconComponent = icons[idx % icons.length];

          return (
            <Link
              key={cat.id}
              href={`/products?category=${cat.slug}`}
              className="group p-8 rounded-3xl bg-slate-900 border border-slate-800 hover:border-cyan-500/50 hover:bg-slate-850 transition-all duration-300 space-y-4 flex flex-col justify-between"
            >
              <div className="flex items-center justify-between">
                <div className="p-4 rounded-2xl bg-cyan-950/80 border border-cyan-500/30 text-cyan-400">
                  <IconComponent className="w-8 h-8" />
                </div>
                <span className="text-xs font-semibold text-slate-400 bg-slate-950 px-3 py-1.5 rounded-full border border-slate-800">
                  {cat.count} Products
                </span>
              </div>

              <div>
                <h2 className="text-xl font-bold text-white group-hover:text-cyan-400 transition">
                  {cat.name}
                </h2>
                <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                  {cat.description}
                </p>
              </div>

              <div className="pt-2 flex items-center gap-2 text-xs font-bold text-cyan-400 group-hover:translate-x-1 transition-transform">
                Explore Category <ArrowRight className="w-4 h-4" />
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
