"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import {
  ChevronRight,
  Grid,
  List,
  SlidersHorizontal,
  X,
  PackageSearch,
  ArrowUpDown,
} from "lucide-react";
import { ProductCard, ProductItem } from "@/components/products/product-card";
import { ProductFilters } from "@/components/products/product-filters";

const CATALOG_PRODUCTS: ProductItem[] = [
  {
    id: "cat-prod-1",
    name: "Cisco Catalyst 9300 48-Port Managed PoE+ Switch (740W)",
    category: "Networking",
    brand: "Cisco",
    tag: "48-Port PoE+",
    discount: "-12%",
    badge: "ENTERPRISE",
    rating: 5,
    reviewsCount: 46,
    price: 4250.0,
    originalPrice: 4850.0,
    inStock: true,
    image:
      "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=600&auto=format&fit=crop",
    specs: ["48-Port Gigabit", "740W PoE+", "StackWise-480"],
  },
  {
    id: "cat-prod-2",
    name: "Ubiquiti UniFi Dream Machine Pro Security Gateway",
    category: "Networking",
    brand: "Ubiquiti",
    tag: "Security Gateway",
    discount: "-10%",
    badge: "TOP SELLER",
    rating: 5,
    reviewsCount: 64,
    price: 1950.0,
    originalPrice: 2200.0,
    inStock: true,
    image:
      "https://images.unsplash.com/photo-1543512214-318c7553f230?w=600&auto=format&fit=crop",
    specs: ["10G SFP+ WAN", "Built-in NVR", "UniFi OS"],
  },
  {
    id: "cat-prod-3",
    name: 'Apple MacBook Pro 16" M3 Max 36GB / 1TB SSD Space Black',
    category: "Computers",
    brand: "Apple",
    tag: "M3 Max Chip",
    discount: "-8%",
    badge: "PRO RIG",
    rating: 5,
    reviewsCount: 58,
    price: 12499.0,
    originalPrice: 13500.0,
    inStock: true,
    image:
      "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600&auto=format&fit=crop",
    specs: ["M3 Max 16-Core", "36GB RAM", '16.2" Liquid Retina'],
  },
  {
    id: "cat-prod-4",
    name: "Synology DiskStation DS1823xs+ 8-Bay Enterprise NAS",
    category: "Storage & NAS",
    brand: "Synology",
    tag: "8-Bay RAID",
    discount: undefined,
    badge: "STORAGE",
    rating: 5,
    reviewsCount: 31,
    price: 6450.0,
    originalPrice: undefined,
    inStock: true,
    image:
      "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=600&auto=format&fit=crop",
    specs: ["AMD Ryzen V1780B", "10GbE Built-in", "ECC RAM"],
  },
  {
    id: "cat-prod-5",
    name: "NVIDIA GeForce RTX 4090 24GB GDDR6X Gaming GPU",
    category: "Components",
    brand: "NVIDIA",
    tag: "24GB GDDR6X",
    discount: "-7%",
    badge: "FLAGSHIP",
    rating: 5,
    reviewsCount: 72,
    price: 8450.0,
    originalPrice: 9100.0,
    inStock: true,
    image:
      "https://images.unsplash.com/photo-1591488320449-011701bb6704?w=600&auto=format&fit=crop",
    specs: ["Ada Lovelace", "DLSS 3", "24GB VRAM"],
  },
  {
    id: "cat-prod-6",
    name: 'Asus ROG Swift 32" OLED 240Hz 4K Gaming Monitor',
    category: "Monitors",
    brand: "ASUS",
    tag: "4K OLED 0.03ms",
    discount: "-12%",
    badge: "NEW RELEASE",
    rating: 5,
    reviewsCount: 45,
    price: 4250.0,
    originalPrice: 4800.0,
    inStock: true,
    image:
      "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=600&auto=format&fit=crop",
    specs: ['32" 4K QD-OLED', "240Hz Refresh", "G-Sync Compatible"],
  },
  {
    id: "cat-prod-7",
    name: "Dell Precision 5680 Workstation i9-13900H / 64GB RAM",
    category: "Computers",
    brand: "Dell",
    tag: "Pro Workstation",
    discount: undefined,
    badge: "PRO RIG",
    rating: 5,
    reviewsCount: 22,
    price: 11200.0,
    originalPrice: undefined,
    inStock: true,
    image:
      "https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=600&auto=format&fit=crop",
    specs: ["i9-13900H", "NVIDIA RTX 3500", "64GB DDR5"],
  },
  {
    id: "cat-prod-8",
    name: "Logitech MX Keys S Wireless Illumination Keyboard",
    category: "Accessories",
    brand: "Logitech",
    tag: "Smart Illumination",
    discount: "-15%",
    badge: "TOP SELLER",
    rating: 5,
    reviewsCount: 94,
    price: 480.0,
    originalPrice: 565.0,
    inStock: true,
    image:
      "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=600&auto=format&fit=crop",
    specs: ["Logi Bolt USB", "Bluetooth LE", "Smart Backlight"],
  },
];

const CATEGORIES_SUMMARY = [
  { id: "cat-1", name: "Networking", count: 24 },
  { id: "cat-2", name: "Computers", count: 32 },
  { id: "cat-3", name: "Storage & NAS", count: 18 },
  { id: "cat-4", name: "Components", count: 45 },
  { id: "cat-5", name: "Monitors", count: 16 },
  { id: "cat-6", name: "Accessories", count: 28 },
];

const BRANDS_SUMMARY = [
  { id: "b-1", name: "Cisco", count: 18 },
  { id: "b-2", name: "Ubiquiti", count: 14 },
  { id: "b-3", name: "Apple", count: 22 },
  { id: "b-4", name: "Synology", count: 12 },
  { id: "b-5", name: "NVIDIA", count: 20 },
  { id: "b-6", name: "Dell", count: 16 },
  { id: "b-7", name: "ASUS", count: 25 },
];

export default function ProductsPage() {
  const [layoutMode, setLayoutMode] = useState<"grid" | "list">("grid");
  const [sortBy, setSortBy] = useState<string>("featured");
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  const [filters, setFilters] = useState({
    search: "",
    category: "",
    brand: "",
    minPrice: "",
    maxPrice: "",
    inStockOnly: false,
    onSaleOnly: false,
  });

  const handleResetFilters = () => {
    setFilters({
      search: "",
      category: "",
      brand: "",
      minPrice: "",
      maxPrice: "",
      inStockOnly: false,
      onSaleOnly: false,
    });
  };

  // Filter & Sort Logic
  const filteredProducts = useMemo(() => {
    return CATALOG_PRODUCTS.filter((product) => {
      // Search
      if (
        filters.search &&
        !product.name.toLowerCase().includes(filters.search.toLowerCase()) &&
        !product.brand.toLowerCase().includes(filters.search.toLowerCase()) &&
        !product.category.toLowerCase().includes(filters.search.toLowerCase())
      ) {
        return false;
      }
      // Category
      if (
        filters.category &&
        product.category.toLowerCase() !== filters.category.toLowerCase()
      ) {
        return false;
      }
      // Brand
      if (
        filters.brand &&
        product.brand.toLowerCase() !== filters.brand.toLowerCase()
      ) {
        return false;
      }
      // Price
      if (filters.minPrice && product.price < parseFloat(filters.minPrice)) {
        return false;
      }
      if (filters.maxPrice && product.price > parseFloat(filters.maxPrice)) {
        return false;
      }
      // In Stock
      if (filters.inStockOnly && !product.inStock) {
        return false;
      }
      // On Sale
      if (filters.onSaleOnly && !product.discount) {
        return false;
      }
      return true;
    }).sort((a, b) => {
      if (sortBy === "price-low") return a.price - b.price;
      if (sortBy === "price-high") return b.price - a.price;
      if (sortBy === "rating") return b.rating - a.rating;
      return 0; // Default featured
    });
  }, [filters, sortBy]);

  const activeFilterCount = [
    filters.search,
    filters.category,
    filters.brand,
    filters.minPrice,
    filters.maxPrice,
    filters.inStockOnly,
    filters.onSaleOnly,
  ].filter(Boolean).length;

  return (
    <div className="w-full bg-slate-50/50 min-h-screen text-slate-900 font-sans pb-16">
      {/* Top Header & Breadcrumbs */}
      <div className="bg-white border-b border-slate-200/80 py-6 sm:py-8">
        <div className="max-w-4/5 mx-auto md:px-0 px-4">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-500 mb-2">
            <Link href="/" className="hover:text-emerald-700 transition">
              Home
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-slate-900 font-extrabold">
              Hardware Catalog
            </span>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-black text-slate-950 uppercase tracking-tight">
                All Products & Hardware
              </h1>
              <p className="text-xs sm:text-sm font-medium text-slate-500 mt-1">
                Explore enterprise networking, pro workstations, NAS storage,
                and PC components.
              </p>
            </div>

            <span className="text-xs font-extrabold text-slate-700 bg-slate-100 px-3 py-1.5 rounded-xl border border-slate-200 shrink-0 self-start sm:self-auto">
              Showing {filteredProducts.length} Products
            </span>
          </div>
        </div>
      </div>

      {/* Catalog Body Container */}
      <div className="max-w-4/5 mx-auto md:px-0 px-4 pt-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Desktop Filters Sidebar (3 cols) */}
          <div className="hidden lg:block lg:col-span-3 sticky top-6">
            <ProductFilters
              filters={filters}
              onFilterChange={setFilters}
              onResetFilters={handleResetFilters}
              categories={CATEGORIES_SUMMARY}
              brands={BRANDS_SUMMARY}
            />
          </div>

          {/* Main Product Catalog Display (9 cols) */}
          <div className="col-span-12 lg:col-span-9 space-y-6">
            {/* Controls Bar (Mobile Filter Toggle, Active Tags, Layout Switcher, Sort Dropdown) */}
            <div className="bg-white border border-slate-200/90 rounded-2xl p-4 flex flex-wrap items-center justify-between gap-4 shadow-2xs">
              {/* Mobile Filter Button */}
              <button
                onClick={() => setMobileFilterOpen(true)}
                className="lg:hidden bg-slate-900 text-white font-extrabold text-xs px-4 py-2.5 rounded-xl uppercase tracking-wider flex items-center gap-2"
              >
                <SlidersHorizontal className="w-4 h-4" />
                <span>
                  Filters {activeFilterCount > 0 && `(${activeFilterCount})`}
                </span>
              </button>

              {/* Active Filter Tags */}
              <div className="flex flex-wrap items-center gap-2 flex-1">
                {filters.category && (
                  <span className="bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold px-2.5 py-1 rounded-lg flex items-center gap-1.5">
                    Category: {filters.category}
                    <X
                      className="w-3.5 h-3.5 cursor-pointer hover:text-emerald-950"
                      onClick={() => setFilters({ ...filters, category: "" })}
                    />
                  </span>
                )}
                {filters.brand && (
                  <span className="bg-blue-50 text-blue-800 border border-blue-200 text-xs font-bold px-2.5 py-1 rounded-lg flex items-center gap-1.5">
                    Brand: {filters.brand}
                    <X
                      className="w-3.5 h-3.5 cursor-pointer hover:text-blue-950"
                      onClick={() => setFilters({ ...filters, brand: "" })}
                    />
                  </span>
                )}
                {activeFilterCount > 0 && (
                  <button
                    onClick={handleResetFilters}
                    className="text-xs font-bold text-red-600 hover:underline px-1"
                  >
                    Clear All
                  </button>
                )}
              </div>

              {/* Sort & Layout View Controls */}
              <div className="flex items-center gap-3">
                {/* Sort Dropdown */}
                <div className="flex items-center gap-2">
                  <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 focus:outline-none focus:border-emerald-600 cursor-pointer"
                  >
                    <option value="featured">Featured Hardware</option>
                    <option value="price-low">Price: Low to High</option>
                    <option value="price-high">Price: High to Low</option>
                    <option value="rating">Highest Customer Rating</option>
                  </select>
                </div>

                {/* Grid / List Switcher */}
                <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200">
                  <button
                    onClick={() => setLayoutMode("grid")}
                    className={`p-1.5 rounded-lg transition cursor-pointer ${
                      layoutMode === "grid"
                        ? "bg-white text-slate-900 shadow-2xs"
                        : "text-slate-500"
                    }`}
                    aria-label="Grid View"
                  >
                    <Grid className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setLayoutMode("list")}
                    className={`p-1.5 rounded-lg transition cursor-pointer ${
                      layoutMode === "list"
                        ? "bg-white text-slate-900 shadow-2xs"
                        : "text-slate-500"
                    }`}
                    aria-label="List View"
                  >
                    <List className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Product Display List or Grid */}
            {filteredProducts.length === 0 ? (
              <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center space-y-4 shadow-2xs">
                <div className="w-14 h-14 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
                  <PackageSearch className="w-7 h-7" />
                </div>
                <h3 className="text-base font-black text-slate-900 uppercase">
                  No Products Found
                </h3>
                <p className="text-xs text-slate-500 max-w-sm mx-auto font-medium">
                  We couldn't find any products matching your search criteria.
                  Try clearing some filters.
                </p>
                <button
                  onClick={handleResetFilters}
                  className="bg-[#15803d] hover:bg-emerald-700 text-white font-extrabold text-xs px-5 py-2.5 rounded-xl uppercase tracking-wider transition cursor-pointer"
                >
                  Reset All Filters
                </button>
              </div>
            ) : layoutMode === "grid" ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5">
                {filteredProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    layout="grid"
                  />
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {filteredProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    layout="list"
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Filters Drawer Overlay */}
      {mobileFilterOpen && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs z-50 flex justify-end lg:hidden">
          <div className="w-full max-w-xs bg-white h-full p-6 overflow-y-auto space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <h3 className="text-sm font-black uppercase tracking-wider text-slate-900">
                Filter Products
              </h3>
              <button
                onClick={() => setMobileFilterOpen(false)}
                className="p-1 rounded-lg hover:bg-slate-100 text-slate-500"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <ProductFilters
              filters={filters}
              onFilterChange={setFilters}
              onResetFilters={handleResetFilters}
              categories={CATEGORIES_SUMMARY}
              brands={BRANDS_SUMMARY}
            />

            <button
              onClick={() => setMobileFilterOpen(false)}
              className="w-full bg-[#15803d] text-white font-extrabold text-xs py-3.5 rounded-xl uppercase tracking-wider"
            >
              Apply Filters ({filteredProducts.length})
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
