"use client";

import Link from "next/link";

const BRANDS = [
  {
    id: "cisco",
    name: "Cisco",
    tagline: "Enterprise Networking",
    href: "/products?brand=cisco",
    logoText: "CISCO",
  },
  {
    id: "ubiquiti",
    name: "Ubiquiti",
    tagline: "UniFi & Wireless",
    href: "/products?brand=ubiquiti",
    logoText: "UBIQUITI",
  },
  {
    id: "synology",
    name: "Synology",
    tagline: "NAS Storage & Cloud",
    href: "/products?brand=synology",
    logoText: "SYNOLOGY",
  },
  {
    id: "dell",
    name: "Dell Technologies",
    tagline: "Servers & Workstations",
    href: "/products?brand=dell",
    logoText: "DELL",
  },
  {
    id: "nvidia",
    name: "NVIDIA",
    tagline: "GPUs & AI Hardware",
    href: "/products?brand=nvidia",
    logoText: "NVIDIA",
  },
  {
    id: "apple",
    name: "Apple",
    tagline: "MacBook & Professional",
    href: "/products?brand=apple",
    logoText: "APPLE",
  },
  {
    id: "lenovo",
    name: "Lenovo",
    tagline: "ThinkCentre & Legion",
    href: "/products?brand=lenovo",
    logoText: "LENOVO",
  },
  {
    id: "hp",
    name: "HP Enterprise",
    tagline: "ProLiant & Servers",
    href: "/products?brand=hp",
    logoText: "HP",
  },
];

export function HomepageFeaturedBrands() {
  // Duplicate array so marquee scrolls infinitely and seamlessly
  const marqueeBrands = [...BRANDS, ...BRANDS];

  return (
    <section className="w-full max-w-7xl md:max-w-4/5 mx-auto px-4 md:px-0 py-8 sm:py-12 bg-white font-sans overflow-hidden">
      {/* Header Row */}
      <div className="flex items-center justify-between pb-3 mb-8">
        <h2 className="text-sm sm:text-base font-extrabold text-slate-900 tracking-tight uppercase relative inline-block">
          Featured Brands & Partners
          <span className="absolute bottom-[-13px] left-0 w-full h-[3px] bg-[#FFD400] rounded-full" />
        </h2>
        <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
          Official Distributors
        </span>
      </div>

      {/* Infinite Scrolling Marquee Track */}
      <div className="relative w-full overflow-hidden py-2 before:absolute before:left-0 before:top-0 before:z-10 before:h-full before:w-16 before:bg-gradient-to-r before:from-white before:to-transparent after:absolute after:right-0 after:top-0 after:z-10 after:h-full after:w-16 after:bg-gradient-to-l after:from-white after:to-transparent">
        <div className="animate-marquee flex items-center gap-5">
          {marqueeBrands.map((brand, idx) => (
            <Link
              key={`${brand.id}-${idx}`}
              href={brand.href}
              className="group bg-[#F4F5F7] hover:bg-[#FFD400]/25 border border-slate-200/80 hover:border-slate-300 rounded-2xl px-8 py-4 flex flex-col items-center justify-center text-center transition-all duration-300 shadow-2xs hover:shadow group-hover:scale-105 shrink-0 min-w-[170px] h-24 cursor-pointer"
            >
              <span className="text-lg font-black tracking-widest text-slate-900 group-hover:text-slate-950 transition-colors uppercase">
                {brand.logoText}
              </span>
              <span className="text-[10px] font-bold text-slate-500 group-hover:text-slate-800 transition-colors mt-1 uppercase tracking-wider whitespace-nowrap">
                {brand.tagline}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
