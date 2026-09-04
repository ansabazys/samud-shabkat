"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import {
  ChevronRight,
  ChevronLeft,
  Grid,
  List,
  SlidersHorizontal,
  X,
  PackageSearch,
  ArrowUpDown,
  Sparkles,
  Loader2,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { useLanguageStore } from "@/store/language-store";
import {
  ProductCard,
  type ProductItem,
} from "@/components/products/product-card";
import {
  ProductFilters,
  type FilterState,
} from "@/components/products/product-filters";
import {
  fetchProducts,
  fetchCategories,
  fetchBrands,
  type Product,
  type Category,
  type Brand,
} from "@/lib/api";

export default function NewArrivalsPage() {
  const tHome = useTranslations("home");
  const tProducts = useTranslations("products");
  const tCommon = useTranslations("common");
  const language = useLanguageStore((state) => state.language);
  const isRtl = language === "ar";

  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(true);
  const [layout, setLayout] = useState<"grid" | "list">("grid");
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);

  // Filters State
  const [filters, setFilters] = useState<FilterState>({
    category: "",
    brand: "",
    minPrice: "",
    maxPrice: "",
    inStockOnly: false,
    onSaleOnly: false,
    search: "",
  });

  const [sortBy, setSortBy] = useState<string>("newest");

  useEffect(() => {
    Promise.all([fetchCategories(), fetchBrands()])
      .then(([cats, brds]) => {
        setCategories(Array.isArray(cats) ? cats : []);
        setBrands(Array.isArray(brds) ? brds : []);
      })
      .catch((err) => console.error("Failed to load metadata:", err));
  }, []);

  const loadNewArrivals = async () => {
    try {
      setLoading(true);
      const res = await fetchProducts({
        limit: 50,
        sort: "newest",
        search: filters.search || undefined,
        category: filters.category || undefined,
        brand: filters.brand || undefined,
        isActive: true,
      });

      setProducts(Array.isArray(res?.data) ? res.data : []);
    } catch (err) {
      console.error("Failed to load new arrivals:", err);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadNewArrivals();
  }, [filters.category, filters.brand, filters.search]);

  // Client-side transform for ProductCard compatibility
  const productItems: ProductItem[] = useMemo(() => {
    return products.map((p) => {
      const primaryImage =
        p.images?.find((img) => img.isPrimary)?.url ||
        p.images?.[0]?.url ||
        "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=600&auto=format&fit=crop";

      const priceNum =
        typeof p.price === "string" ? parseFloat(p.price) : p.price || 0;

      let specList: string[] = [];
      if (p.specifications && typeof p.specifications === "object") {
        specList = Object.entries(p.specifications)
          .filter(([, v]) => v)
          .map(([k, v]) => `${k}: ${v}`)
          .slice(0, 3);
      }

      return {
        id: p.id,
        name: p.name,
        slug: p.slug,
        sku: p.sku,
        category: p.category?.name || "Hardware",
        categoryId: p.categoryId,
        brand: p.brand?.name || "General",
        brandId: p.brandId,
        badge: tCommon("newArrival"),
        rating: 5,
        reviewsCount: 12,
        price: priceNum,
        inStock: p.isActive,
        image: primaryImage,
        specs: specList,
      };
    });
  }, [products, tCommon]);

  const filteredProducts = useMemo(() => {
    return productItems
      .filter((product) => {
        if (filters.minPrice && product.price < parseFloat(filters.minPrice)) {
          return false;
        }
        if (filters.maxPrice && product.price > parseFloat(filters.maxPrice)) {
          return false;
        }
        if (filters.inStockOnly && !product.inStock) {
          return false;
        }
        return true;
      })
      .sort((a, b) => {
        if (sortBy === "price-low" || sortBy === "price_asc")
          return a.price - b.price;
        if (sortBy === "price-high" || sortBy === "price_desc")
          return b.price - a.price;
        return 0;
      });
  }, [
    productItems,
    filters.minPrice,
    filters.maxPrice,
    filters.inStockOnly,
    sortBy,
  ]);

  const handleResetFilters = () => {
    setFilters({
      category: "",
      brand: "",
      minPrice: "",
      maxPrice: "",
      inStockOnly: false,
      onSaleOnly: false,
      search: "",
    });
  };

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
      {/* Hero Header */}
      <div className="bg-white border-b border-slate-200/80 py-8">
        <div className="w-full max-w-7xl md:max-w-4/5 mx-auto px-4 md:px-0">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-500 mb-3">
            <Link href="/" className="hover:text-emerald-700 transition">
              {tCommon("home")}
            </Link>
            {isRtl ? (
              <ChevronLeft className="w-3.5 h-3.5 text-slate-400" />
            ) : (
              <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            )}
            <span className="text-slate-900 font-extrabold">
              {tHome("newArrivalsTitle")}
            </span>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div className="space-y-1">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-[11px] font-black uppercase tracking-wider mb-1">
                <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                <span>{tHome("newArrivalsTitle")}</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-slate-950 uppercase tracking-tight">
                {tHome("newArrivalsTitle")}
              </h1>
              <p className="text-xs sm:text-sm font-medium text-slate-500">
                {tProducts("catalogSubtitle")}
              </p>
            </div>

            <span className="text-xs font-extrabold text-slate-700 bg-slate-100 px-3 py-1.5 rounded-xl border border-slate-200 shrink-0 self-start sm:self-auto">
              {tProducts("itemsCount", { count: filteredProducts.length })}
            </span>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="w-full max-w-7xl md:max-w-4/5 mx-auto px-4 md:px-0 pt-6 sm:pt-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Desktop Filter Sidebar (3 cols) */}
          <div className="hidden lg:block lg:col-span-3 sticky top-6">
            <ProductFilters
              filters={filters}
              onFilterChange={setFilters}
              onResetFilters={handleResetFilters}
              categories={categories}
              brands={brands}
            />
          </div>

          {/* Product Grid & Controls (9 cols) */}
          <div className="lg:col-span-9 space-y-6">
            {/* Toolbar */}
            <div className="bg-white p-3.5 sm:p-4 rounded-2xl border border-slate-200/90 shadow-2xs flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setIsMobileFiltersOpen(true)}
                  className="lg:hidden flex items-center gap-2 px-3.5 py-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 rounded-xl text-xs font-extrabold transition cursor-pointer"
                >
                  <SlidersHorizontal className="w-4 h-4 text-emerald-700" />
                  <span>{tProducts("filters")}</span>
                  {activeFilterCount > 0 && (
                    <span className="w-5 h-5 rounded-full bg-[#15803d] text-white text-[10px] flex items-center justify-center font-black">
                      {activeFilterCount}
                    </span>
                  )}
                </button>

                <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200">
                  <button
                    onClick={() => setLayout("grid")}
                    className={`p-1.5 rounded-lg transition cursor-pointer ${
                      layout === "grid"
                        ? "bg-white text-slate-950 shadow-xs"
                        : "text-slate-500 hover:text-slate-900"
                    }`}
                    title={tProducts("gridView")}
                  >
                    <Grid className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setLayout("list")}
                    className={`p-1.5 rounded-lg transition cursor-pointer ${
                      layout === "list"
                        ? "bg-white text-slate-950 shadow-xs"
                        : "text-slate-500 hover:text-slate-900"
                    }`}
                    title={tProducts("listView")}
                  >
                    <List className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-500 hidden sm:inline-block">
                  {tProducts("sortBy")}
                </span>
                <div className="relative">
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="appearance-none ps-3 pe-8 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:border-emerald-600 cursor-pointer"
                  >
                    <option value="newest">{tProducts("sortNewest")}</option>
                    <option value="price-low">
                      {tProducts("sortPriceLow")}
                    </option>
                    <option value="price-high">
                      {tProducts("sortPriceHigh")}
                    </option>
                  </select>
                  <ArrowUpDown className="w-3.5 h-3.5 text-slate-400 absolute end-2.5 top-3 pointer-events-none" />
                </div>
              </div>
            </div>

            {/* Products List */}
            {loading ? (
              <div className="py-24 text-center flex flex-col items-center justify-center space-y-3 bg-white rounded-3xl border border-slate-200">
                <Loader2 className="w-8 h-8 text-emerald-600 animate-spin" />
                <span className="text-xs text-slate-500 font-medium">
                  {tCommon("loading")}
                </span>
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="bg-white border border-slate-200/90 rounded-3xl p-12 text-center space-y-4">
                <div className="w-14 h-14 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
                  <PackageSearch className="w-7 h-7" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-lg font-black text-slate-950 uppercase tracking-tight">
                    {tProducts("noProductsFound")}
                  </h3>
                  <p className="text-xs text-slate-500 max-w-sm mx-auto font-medium">
                    {tProducts("noProductsDesc")}
                  </p>
                </div>
                <button
                  onClick={handleResetFilters}
                  className="px-4 py-2 bg-[#15803d] hover:bg-emerald-700 text-white font-extrabold text-xs uppercase tracking-wider rounded-xl transition cursor-pointer shadow-xs"
                >
                  {tProducts("resetFilters")}
                </button>
              </div>
            ) : layout === "grid" ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
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

      {/* Mobile Drawer */}
      {isMobileFiltersOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="fixed inset-0 bg-slate-950/40 backdrop-blur-xs"
            onClick={() => setIsMobileFiltersOpen(false)}
          />
          <div className="fixed inset-y-0 end-0 max-w-xs w-full bg-white shadow-2xl p-6 overflow-y-auto flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-6">
                <h3 className="text-base font-black text-slate-950 uppercase tracking-tight flex items-center gap-2">
                  <SlidersHorizontal className="w-4 h-4 text-emerald-700" />
                  {tProducts("filters")}
                </h3>
                <button
                  onClick={() => setIsMobileFiltersOpen(false)}
                  className="p-1 rounded-lg text-slate-400 hover:text-slate-700 cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <ProductFilters
                filters={filters}
                onFilterChange={setFilters}
                onResetFilters={handleResetFilters}
                categories={categories}
                brands={brands}
              />
            </div>

            <div className="pt-6 border-t border-slate-100">
              <button
                onClick={() => setIsMobileFiltersOpen(false)}
                className="w-full py-3 bg-[#15803d] hover:bg-emerald-700 text-white font-black text-xs uppercase tracking-wider rounded-xl transition cursor-pointer shadow-xs"
              >
                {tProducts("viewResults", { count: filteredProducts.length })}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
