"use client";

const brands = [
  { name: "Cisco", category: "Enterprise Networking" },
  { name: "Dell Technologies", category: "Servers & Workstations" },
  { name: "Lenovo", category: "Enterprise Laptops" },
  { name: "ASUS ProArt", category: "Studio Displays" },
  { name: "HP Enterprise", category: "Networking & Servers" },
  { name: "Apple", category: "Mac Workstations" },
  { name: "Logitech", category: "Workspace Accessories" },
  { name: "MikroTik", category: "Routing Hardware" },
  { name: "Ubiquiti", category: "Wireless & Security" },
  { name: "Kingston", category: "Memory & Storage" },
  { name: "Intel", category: "Processors & NPU" },
  { name: "NVIDIA", category: "AI & Workstation GPUs" },
];

export function HomepageBrands() {
  return (
    <section className="py-14 bg-white border-b border-neutral-200/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="text-center space-y-1">
          <span className="text-[11px] font-mono font-bold uppercase tracking-widest text-slate-400">
            AUTHORIZED DISTRIBUTOR & STOCKIST
          </span>
          <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">
            Industry Leading Hardware Brands
          </h3>
        </div>

        {/* Clean Muted Corporate Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {brands.map((b) => (
            <div
              key={b.name}
              className="p-4 rounded-xl bg-neutral-50/80 border border-neutral-200/60 text-center hover:bg-neutral-100 hover:border-neutral-300 transition duration-300 group cursor-pointer"
            >
              <span className="font-extrabold text-slate-700 text-sm block group-hover:text-slate-900 transition font-sans">
                {b.name}
              </span>
              <span className="text-[10px] text-slate-400 font-mono block mt-0.5 truncate">
                {b.category}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
