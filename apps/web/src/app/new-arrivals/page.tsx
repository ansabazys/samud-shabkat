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
  Sparkles,
  Clock,
  Zap,
  Check,
  Bell,
} from "lucide-react";
import { ProductCard, ProductItem } from "@/components/products/product-card";
import { ProductFilters } from "@/components/products/product-filters";

// Extended Product Item interface for New Arrivals
export interface NewArrivalProductItem extends ProductItem {
  timeframe: "just-in" | "this-week" | "this-month" | "pre-order";
  releaseDate: string;
  isExclusive?: boolean;
}

const NEW_ARRIVALS_CATALOG: NewArrivalProductItem[] = [
  {
    id: "na-page-1",
    name: "Ubiquiti UniFi Express Pocket Cloud Gateway & Access Point",
    category: "Networking",
    brand: "Ubiquiti",
    tag: "WiFi 6 Cloud Gateway",
    discount: undefined,
    badge: "JUST RELEASED",
    rating: 5,
    reviewsCount: 18,
    price: 780.0,
    originalPrice: undefined,
    inStock: true,
    image:
      "https://images.unsplash.com/photo-1543512214-318c7553f230?w=600&auto=format&fit=crop",
    specs: ["Built-in WiFi 6 AP", "UniFi Network Engine", "Pocket Form Factor"],
    timeframe: "just-in",
    releaseDate: "2026-08-20",
    isExclusive: true,
  },
  {
    id: "na-page-2",
    name: 'Apple iPad Pro 13" M4 Ultra Retina XDR 256GB Space Black',
    category: "Computers",
    brand: "Apple",
    tag: "M4 OLED Chip",
    discount: "-5%",
    badge: "FLAGSHIP",
    rating: 5,
    reviewsCount: 34,
    price: 4899.0,
    originalPrice: 5150.0,
    inStock: true,
    image:
      "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=600&auto=format&fit=crop",
    specs: ["M4 Chip 9-Core CPU", "Tandem OLED Display", "Thin 5.1mm Design"],
    timeframe: "just-in",
    releaseDate: "2026-08-19",
  },
  {
    id: "na-page-3",
    name: 'Asus ROG Swift 32" OLED 240Hz 4K Gaming Monitor (PG32UCDM)',
    category: "Monitors",
    brand: "ASUS",
    tag: "4K QD-OLED 0.03ms",
    discount: "-8%",
    badge: "HOT ARRIVAL",
    rating: 5,
    reviewsCount: 42,
    price: 4250.0,
    originalPrice: 4600.0,
    inStock: true,
    image:
      "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=600&auto=format&fit=crop",
    specs: ["32-inch 4K QD-OLED", "240Hz Refresh Rate", "Custom Heatsink"],
    timeframe: "this-week",
    releaseDate: "2026-08-15",
  },
  {
    id: "na-page-4",
    name: "Cisco Business 250 Series 16-Port Smart Managed Switch (CBS250-16T-2G)",
    category: "Networking",
    brand: "Cisco",
    tag: "16-Port Gigabit Switch",
    discount: undefined,
    badge: "ENTERPRISE",
    rating: 5,
    reviewsCount: 15,
    price: 1150.0,
    originalPrice: undefined,
    inStock: true,
    image:
      "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=600&auto=format&fit=crop",
    specs: ["16 x 10/100/1000 Ports", "2 x Gigabit SFP", "Web GUI Management"],
    timeframe: "this-week",
    releaseDate: "2026-08-14",
  },
  {
    id: "na-page-5",
    name: "Synology DiskStation DS1823xs+ 8-Bay Enterprise Tower NAS",
    category: "Storage & NAS",
    brand: "Synology",
    tag: "8-Bay RAID NAS",
    discount: undefined,
    badge: "NEW",
    rating: 5,
    reviewsCount: 21,
    price: 6450.0,
    originalPrice: undefined,
    inStock: true,
    image:
      "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=600&auto=format&fit=crop",
    specs: ["AMD Ryzen V1780B", "10GbE RJ-45 Port", "Expandable up to 18 Bays"],
    timeframe: "this-month",
    releaseDate: "2026-08-10",
  },
  {
    id: "na-page-6",
    name: "Keychron Q1 Max Tri-Mode Wireless Custom Mechanical Keyboard",
    category: "Components",
    brand: "Keychron",
    tag: "Custom Keychron Hotswap",
    discount: "-10%",
    badge: "LIMITED DROP",
    rating: 5,
    reviewsCount: 29,
    price: 820.0,
    originalPrice: 910.0,
    inStock: true,
    image:
      "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=600&auto=format&fit=crop",
    specs: [
      "Full Aluminum Body",
      "2.4GHz / BT 5.1 / Type-C",
      "QMK/VIA Support",
    ],
    timeframe: "this-week",
    releaseDate: "2026-08-16",
    isExclusive: true,
  },
  {
    id: "na-page-7",
    name: "Dell Precision 7780 Workstation i9-13980HX / 128GB RAM / 2TB NVMe",
    category: "Computers",
    brand: "Dell",
    tag: "Workstation Beast",
    discount: "-6%",
    badge: "POWERHOUSE",
    rating: 5,
    reviewsCount: 11,
    price: 15400.0,
    originalPrice: 16400.0,
    inStock: true,
    image:
      "https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=600&auto=format&fit=crop",
    specs: ["Intel i9-13980HX", "NVIDIA RTX 5000 Ada 16GB", "128GB DDR5 ECC"],
    timeframe: "this-month",
    releaseDate: "2026-08-05",
  },
  {
    id: "na-page-8",
    name: "NVIDIA GeForce RTX 4090 Founder Edition 24GB GDDR6X",
    category: "Components",
    brand: "NVIDIA",
    tag: "Ada Lovelace Flagship",
    discount: undefined,
    badge: "RESTOCKED",
    rating: 5,
    reviewsCount: 88,
    price: 8990.0,
    originalPrice: undefined,
    inStock: true,
    image:
      "https://images.unsplash.com/photo-1591488320449-011701bb6704?w=600&auto=format&fit=crop",
    specs: ["24GB GDDR6X", "DLSS 3 Frame Gen", "3-Slot Vapor Chamber"],
    timeframe: "just-in",
    releaseDate: "2026-08-21",
  },
  {
    id: "na-page-9",
    name: "Ubiquiti UniFi U7 Pro WiFi 7 Tri-Band Ceiling Mount AP",
    category: "Networking",
    brand: "Ubiquiti",
    tag: "WiFi 7 Next-Gen",
    discount: undefined,
    badge: "PRE-ORDER",
    rating: 5,
    reviewsCount: 6,
    price: 950.0,
    originalPrice: undefined,
    inStock: false,
    image:
      "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=600&auto=format&fit=crop",
    specs: ["WiFi 7 6 GHz Support", "2.5 GbE Uplink", "Multi-Link Operation"],
    timeframe: "pre-order",
    releaseDate: "2026-09-01",
  },
  {
    id: "na-page-10",
    name: 'Apple MacBook Pro 14" M3 Max 36GB RAM / 1TB SSD Silver',
    category: "Computers",
    brand: "Apple",
    tag: "M3 Max Chip",
    discount: "-4%",
    badge: "JUST ARRIVED",
    rating: 5,
    reviewsCount: 37,
    price: 11499.0,
    originalPrice: 11999.0,
    inStock: true,
    image:
      "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600&auto=format&fit=crop",
    specs: ["M3 Max 14-Core CPU", "30-Core GPU", "120Hz Liquid Retina XDR"],
    timeframe: "just-in",
    releaseDate: "2026-08-20",
  },
];

const CATEGORIES_SUMMARY = [
  { id: "cat-1", name: "Networking", count: 3 },
  { id: "cat-2", name: "Computers", count: 3 },
  { id: "cat-3", name: "Storage & NAS", count: 1 },
  { id: "cat-4", name: "Components", count: 2 },
  { id: "cat-5", name: "Monitors", count: 1 },
];

const BRANDS_SUMMARY = [
  { id: "b-1", name: "Ubiquiti", count: 2 },
  { id: "b-2", name: "Apple", count: 2 },
  { id: "b-3", name: "ASUS", count: 1 },
  { id: "b-4", name: "Cisco", count: 1 },
  { id: "b-5", name: "Synology", count: 1 },
  { id: "b-6", name: "Keychron", count: 1 },
  { id: "b-7", name: "Dell", count: 1 },
  { id: "b-8", name: "NVIDIA", count: 1 },
];

const TIMEFRAME_OPTIONS = [
  { value: "all", label: "All New Releases", icon: Sparkles },
  { value: "just-in", label: "Just In (48 Hrs)", icon: Zap },
  { value: "this-week", label: "This Week", icon: Clock },
  { value: "this-month", label: "This Month", icon: Sparkles },
  { value: "pre-order", label: "Pre-Orders & Drops", icon: Bell },
];

export default function NewArrivalsPage() {
  const [layoutMode, setLayoutMode] = useState<"grid" | "list">("grid");
  const [sortBy, setSortBy] = useState<string>("latest");
  const [selectedTimeframe, setSelectedTimeframe] = useState<string>("all");
  const [selectedCategoryTab, setSelectedCategoryTab] = useState<string>("all");
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const [alertEmail, setAlertEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

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
    setSelectedTimeframe("all");
    setSelectedCategoryTab("all");
  };

  // Filter & Sort Logic
  const filteredProducts = useMemo(() => {
    return NEW_ARRIVALS_CATALOG.filter((product) => {
      // Timeframe Filter
      if (
        selectedTimeframe !== "all" &&
        product.timeframe !== selectedTimeframe
      ) {
        return false;
      }
      // Category Tab Pill
      if (
        selectedCategoryTab !== "all" &&
        product.category.toLowerCase() !== selectedCategoryTab.toLowerCase()
      ) {
        return false;
      }
      // Search
      if (
        filters.search &&
        !product.name.toLowerCase().includes(filters.search.toLowerCase()) &&
        !product.brand.toLowerCase().includes(filters.search.toLowerCase()) &&
        !product.category.toLowerCase().includes(filters.search.toLowerCase())
      ) {
        return false;
      }
      // Category Sidebar
      if (
        filters.category &&
        product.category.toLowerCase() !== filters.category.toLowerCase()
      ) {
        return false;
      }
      // Brand Sidebar
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
      if (sortBy === "latest") {
        return (
          new Date(b.releaseDate).getTime() - new Date(a.releaseDate).getTime()
        );
      }
      if (sortBy === "price-low") return a.price - b.price;
      if (sortBy === "price-high") return b.price - a.price;
      if (sortBy === "rating") return b.rating - a.rating;
      return 0;
    });
  }, [filters, selectedTimeframe, selectedCategoryTab, sortBy]);

  const activeFilterCount = [
    filters.search,
    filters.category,
    filters.brand,
    filters.minPrice,
    filters.maxPrice,
    filters.inStockOnly,
    filters.onSaleOnly,
    selectedTimeframe !== "all" ? selectedTimeframe : "",
    selectedCategoryTab !== "all" ? selectedCategoryTab : "",
  ].filter(Boolean).length;

  const handleSubscribeAlerts = (e: React.FormEvent) => {
    e.preventDefault();
    if (alertEmail.trim()) {
      setSubscribed(true);
      setAlertEmail("");
      setTimeout(() => setSubscribed(false), 5000);
    }
  };

  return (
    <div className="w-full bg-slate-50/50 min-h-screen text-slate-900 font-sans pb-16">
      {/* Top Breadcrumb Navigation */}
      <div className="bg-white border-b border-slate-200/80 py-3.5">
        <div className="w-full max-w-7xl md:max-w-4/5 mx-auto px-4 md:px-0">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-500">
            <Link href="/" className="hover:text-emerald-700 transition">
              Home
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            <Link
              href="/products"
              className="hover:text-emerald-700 transition"
            >
              Catalog
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-slate-900 font-extrabold flex items-center gap-1">
              New Arrivals
            </span>
          </div>
        </div>
      </div>

      {/* 2. Main Catalog Body with Sidebar Filters */}
      <div className="w-full max-w-7xl md:max-w-4/5 mx-auto px-4 md:px-0 pt-6 sm:pt-8 space-y-6">
        {/* Title Header with Signature Yellow Accent */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-2 border-b border-slate-200/80">
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-950 uppercase tracking-tight relative inline-block">
              Latest Hardware Drops
              <span className="absolute bottom-[-9px] left-0 w-full h-[3px] bg-[#FFD400] rounded-full" />
            </h2>
            <p className="text-xs sm:text-sm font-semibold text-slate-500 mt-2">
              Browse brand-new releases added in the last 30 days across all
              tech categories.
            </p>
          </div>

          {/* Timeframe Filter Buttons Pills */}
          <div className="flex flex-wrap items-center gap-2">
            {TIMEFRAME_OPTIONS.map((tf) => {
              const Icon = tf.icon;
              const isSelected = selectedTimeframe === tf.value;
              return (
                <button
                  key={tf.value}
                  onClick={() => setSelectedTimeframe(tf.value)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                    isSelected
                      ? "bg-[#15803d] text-white shadow-xs"
                      : "bg-white border border-slate-200 text-slate-700 hover:bg-slate-100"
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{tf.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Category Pill Filters Bar */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-2">
          <span className="text-xs font-black uppercase text-slate-400 shrink-0 mr-1">
            Filter Category:
          </span>
          {[
            { id: "all", label: "All Departments" },
            { id: "networking", label: "Networking" },
            { id: "computers", label: "Computers & Workstations" },
            { id: "monitors", label: "Monitors & OLEDs" },
            { id: "storage & nas", label: "Storage & NAS" },
            { id: "components", label: "PC Components" },
          ].map((cat) => {
            const isSelected = selectedCategoryTab === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategoryTab(cat.id)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-extrabold whitespace-nowrap transition cursor-pointer ${
                  isSelected
                    ? "bg-slate-900 text-white shadow-2xs"
                    : "bg-white text-slate-700 border border-slate-200/90 hover:bg-slate-100"
                }`}
              >
                {cat.label}
              </button>
            );
          })}
        </div>

        {/* Grid Layout Container */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Desktop Filters Sidebar (3 cols) */}
          <div className="hidden lg:block lg:col-span-3 sticky top-24">
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
            {/* Top Toolbar (Mobile Filter Toggle, Active Tags, Layout Switcher, Sort Dropdown) */}
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
                {selectedTimeframe !== "all" && (
                  <span className="bg-amber-50 text-amber-900 border border-amber-200 text-xs font-bold px-2.5 py-1 rounded-lg flex items-center gap-1.5">
                    Timeframe: {selectedTimeframe}
                    <X
                      className="w-3.5 h-3.5 cursor-pointer hover:text-amber-950"
                      onClick={() => setSelectedTimeframe("all")}
                    />
                  </span>
                )}
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
                    className="text-xs font-bold text-red-600 hover:underline px-1 cursor-pointer"
                  >
                    Clear All
                  </button>
                )}
              </div>

              {/* Sort & Layout Controls */}
              <div className="flex items-center gap-3">
                {/* Sort Dropdown */}
                <div className="flex items-center gap-2">
                  <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 focus:outline-none focus:border-emerald-600 cursor-pointer"
                  >
                    <option value="latest">Latest Release Date</option>
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

            {/* Results Count Indicator */}
            <div className="flex items-center justify-between text-xs font-bold text-slate-500 px-1">
              <span>Showing {filteredProducts.length} New Arrivals</span>
              <span>Updated Daily</span>
            </div>

            {/* Product Display Grid / List */}
            {filteredProducts.length === 0 ? (
              <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center space-y-4 shadow-2xs">
                <div className="w-14 h-14 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
                  <PackageSearch className="w-7 h-7" />
                </div>
                <h3 className="text-base font-black text-slate-900 uppercase">
                  No New Arrivals Match Your Criteria
                </h3>
                <p className="text-xs text-slate-500 max-w-sm mx-auto font-medium">
                  Try clearing some filters or selecting a different timeframe
                  to explore more tech drops.
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

      {/* 3. New Release Stock Notification Alert Bar */}
      <section className="w-full max-w-7xl md:max-w-4/5 mx-auto px-4 md:px-0 mt-12 sm:mt-16">
        <div className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-10 shadow-2xs flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center md:text-left">
            <span className="text-[10px] font-black text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full uppercase tracking-wider inline-block">
              NEVER MISS A TECH DROP
            </span>
            <h3 className="text-lg sm:text-xl font-black text-slate-950 uppercase tracking-tight">
              Get Instant Stock Alerts for New Releases
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 font-medium max-w-md">
              Subscribe to get notified whenever new Cisco, Ubiquiti, Apple
              M-Series, or RTX GPUs drop in KSA.
            </p>
          </div>

          <form
            onSubmit={handleSubscribeAlerts}
            className="w-full md:w-auto flex flex-col sm:flex-row items-center gap-3"
          >
            <input
              type="email"
              required
              placeholder="Enter your email address..."
              value={alertEmail}
              onChange={(e) => setAlertEmail(e.target.value)}
              className="w-full sm:w-72 px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:outline-none focus:border-emerald-600"
            />
            <button
              type="submit"
              className="w-full sm:w-auto bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs px-6 py-3 rounded-xl uppercase tracking-wider transition cursor-pointer flex items-center justify-center gap-2 shrink-0"
            >
              {subscribed ? (
                <>
                  <Check className="w-4 h-4 text-emerald-400 stroke-[3]" />
                  <span>Subscribed!</span>
                </>
              ) : (
                <>
                  <Bell className="w-4 h-4 text-amber-400" />
                  <span>Notify Me</span>
                </>
              )}
            </button>
          </form>
        </div>
      </section>

      {/* Mobile Filters Drawer Overlay */}
      {mobileFilterOpen && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs z-50 flex justify-end lg:hidden">
          <div className="w-full max-w-xs bg-white h-full p-6 overflow-y-auto space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <h3 className="text-sm font-black uppercase tracking-wider text-slate-900">
                Filter New Arrivals
              </h3>
              <button
                onClick={() => setMobileFilterOpen(false)}
                className="p-1 rounded-lg hover:bg-slate-100 text-slate-500 cursor-pointer"
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
              className="w-full bg-[#15803d] text-white font-extrabold text-xs py-3.5 rounded-xl uppercase tracking-wider cursor-pointer"
            >
              Apply Filters ({filteredProducts.length})
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
