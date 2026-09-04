"use client";

import { Search, Filter, RotateCcw, Check } from "lucide-react";
import { useTranslations } from "next-intl";
import { useLanguageStore } from "@/store/language-store";

export interface FilterState {
  search: string;
  category: string;
  brand: string;
  minPrice: string;
  maxPrice: string;
  inStockOnly: boolean;
  onSaleOnly: boolean;
}

export interface ProductFiltersProps {
  filters: FilterState;
  onFilterChange: (newFilters: FilterState) => void;
  onResetFilters: () => void;
  categories?: Array<{ id: string; name: string; count?: number }>;
  brands?: Array<{ id: string; name: string; count?: number }>;
}

const categoryArabicMap: Record<string, string> = {
  networking: "الشبكات والراوترات",
  computers: "الحواسيب ومحطات العمل",
  laptops: "الحواسيب المحمولة (لابتوب)",
  "desktops & workstations": "حواسيب مكتبية ومحطات عمل",
  "monitors & displays": "الشاشات والعرض",
  monitors: "الشاشات",
  components: "المعالجات والقطع",
  "servers & nas": "الخوادم وتخزين NAS",
  servers: "الخوادم والتخزين",
  accessories: "الملحقات والكابلات",
  deals: "العروض والتخفيضات",
  "hot deals": "عروض مميزة",
  "storage & ssds": "أقراص التخزين وSSD",
  "power & ups": "إمدادات الطاقة والـ UPS",
};

export function ProductFilters({
  filters,
  onFilterChange,
  onResetFilters,
  categories = [],
  brands = [],
}: ProductFiltersProps) {
  const t = useTranslations("products");
  const tCommon = useTranslations("common");
  const language = useLanguageStore((state) => state.language);
  const isRtl = language === "ar";

  const getCategoryLabel = (name: string) => {
    if (!isRtl) return name;
    const lower = name.toLowerCase();
    return categoryArabicMap[lower] || name;
  };

  const handleCategorySelect = (catName: string) => {
    onFilterChange({
      ...filters,
      category: filters.category === catName ? "" : catName,
    });
  };

  const handleBrandSelect = (brandName: string) => {
    onFilterChange({
      ...filters,
      brand: filters.brand === brandName ? "" : brandName,
    });
  };

  return (
    <aside className="w-full bg-white border border-slate-200/90 rounded-2xl p-5 space-y-6 shadow-2xs font-sans">
      {/* Header & Reset */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-emerald-700" />
          <h3 className="text-xs font-black uppercase tracking-wider text-slate-900">
            {t("filters")}
          </h3>
        </div>
        <button
          onClick={onResetFilters}
          className="text-[11px] font-bold text-slate-500 hover:text-emerald-700 flex items-center gap-1 cursor-pointer transition"
        >
          <RotateCcw className="w-3 h-3" />
          <span>{t("resetFilters")}</span>
        </button>
      </div>

      {/* Search Filter */}
      <div className="space-y-2">
        <label className="text-[11px] font-black uppercase tracking-wider text-slate-500 block">
          {tCommon("search")}
        </label>
        <div className="relative">
          <input
            type="text"
            placeholder={tCommon("searchPlaceholder")}
            value={filters.search}
            onChange={(e) =>
              onFilterChange({ ...filters, search: e.target.value })
            }
            className="w-full ps-9 pe-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-emerald-600 focus:bg-white transition"
          />
          <Search className="w-4 h-4 text-slate-400 absolute start-3 top-2.5" />
        </div>
      </div>

      {/* Categories Filter */}
      {categories.length > 0 && (
        <div className="space-y-2.5 pt-2 border-t border-slate-100">
          <label className="text-[11px] font-black uppercase tracking-wider text-slate-500 block">
            {t("categoryFilter")}
          </label>
          <div className="space-y-1 max-h-48 overflow-y-auto no-scrollbar pe-1">
            {categories.map((cat) => {
              const isSelected =
                filters.category.toLowerCase() === cat.name.toLowerCase() ||
                filters.category.toLowerCase() === cat.id.toLowerCase();
              return (
                <button
                  key={cat.id}
                  onClick={() => handleCategorySelect(cat.name)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
                    isSelected
                      ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                      : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                  }`}
                >
                  <span className="truncate">{getCategoryLabel(cat.name)}</span>
                  {isSelected && (
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Brands Filter */}
      {brands.length > 0 && (
        <div className="space-y-2.5 pt-2 border-t border-slate-100">
          <label className="text-[11px] font-black uppercase tracking-wider text-slate-500 block">
            {t("brandFilter")}
          </label>
          <div className="space-y-1 max-h-48 overflow-y-auto no-scrollbar pe-1">
            {brands.map((b) => {
              const isSelected =
                filters.brand.toLowerCase() === b.name.toLowerCase() ||
                filters.brand.toLowerCase() === b.id.toLowerCase();
              return (
                <button
                  key={b.id}
                  onClick={() => handleBrandSelect(b.name)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
                    isSelected
                      ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                      : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                  }`}
                >
                  <span className="truncate">{b.name}</span>
                  {isSelected && (
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Price Range Filter */}
      <div className="space-y-2.5 pt-2 border-t border-slate-100">
        <label className="text-[11px] font-black uppercase tracking-wider text-slate-500 block">
          {t("priceRange")} ({tCommon("currency")})
        </label>
        <div className="grid grid-cols-2 gap-2">
          <input
            type="number"
            placeholder={t("minPrice")}
            value={filters.minPrice}
            onChange={(e) =>
              onFilterChange({ ...filters, minPrice: e.target.value })
            }
            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:outline-none focus:border-emerald-600"
          />
          <input
            type="number"
            placeholder={t("maxPrice")}
            value={filters.maxPrice}
            onChange={(e) =>
              onFilterChange({ ...filters, maxPrice: e.target.value })
            }
            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:outline-none focus:border-emerald-600"
          />
        </div>
      </div>

      {/* Toggles */}
      <div className="space-y-2 pt-2 border-t border-slate-100 text-xs font-bold text-slate-700">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={filters.inStockOnly}
            onChange={(e) =>
              onFilterChange({ ...filters, inStockOnly: e.target.checked })
            }
            className="w-4 h-4 accent-emerald-600 rounded"
          />
          <span>{t("inStockOnly")}</span>
        </label>

        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={filters.onSaleOnly}
            onChange={(e) =>
              onFilterChange({ ...filters, onSaleOnly: e.target.checked })
            }
            className="w-4 h-4 accent-emerald-600 rounded"
          />
          <span>{t("onSaleOnly")}</span>
        </label>
      </div>
    </aside>
  );
}
