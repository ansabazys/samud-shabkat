"use client";

import { Search, Filter, RotateCcw, Check } from "lucide-react";

interface FilterState {
  search: string;
  category: string;
  brand: string;
  minPrice: string;
  maxPrice: string;
  inStockOnly: boolean;
  onSaleOnly: boolean;
}

interface ProductFiltersProps {
  filters: FilterState;
  onFilterChange: (newFilters: FilterState) => void;
  onResetFilters: () => void;
  categories: { id: string; name: string; count: number }[];
  brands: { id: string; name: string; count: number }[];
}

export function ProductFilters({
  filters,
  onFilterChange,
  onResetFilters,
  categories,
  brands,
}: ProductFiltersProps) {
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
            Filter Products
          </h3>
        </div>
        <button
          onClick={onResetFilters}
          className="text-[11px] font-bold text-slate-500 hover:text-emerald-700 flex items-center gap-1 cursor-pointer transition"
        >
          <RotateCcw className="w-3 h-3" />
          <span>Reset All</span>
        </button>
      </div>

      {/* Search Filter */}
      <div className="space-y-2">
        <label className="text-[11px] font-black uppercase tracking-wider text-slate-700 block">
          Search Catalog
        </label>
        <div className="relative">
          <input
            type="text"
            placeholder="Search switches, MacBooks, GPUs..."
            value={filters.search}
            onChange={(e) =>
              onFilterChange({ ...filters, search: e.target.value })
            }
            className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-emerald-600 font-medium"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
        </div>
      </div>

      {/* Department Categories Filter */}
      <div className="space-y-2.5 pt-2">
        <label className="text-[11px] font-black uppercase tracking-wider text-slate-700 block">
          Department Category
        </label>
        <div className="space-y-1 max-h-52 overflow-y-auto no-scrollbar pr-1">
          {categories.map((cat) => {
            const isSelected =
              filters.category.toLowerCase() === cat.name.toLowerCase();
            return (
              <button
                key={cat.id}
                onClick={() => handleCategorySelect(cat.name)}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
                  isSelected
                    ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                    : "text-slate-700 hover:bg-slate-50"
                }`}
              >
                <div className="flex items-center gap-2">
                  <div
                    className={`w-3.5 h-3.5 rounded border flex items-center justify-center ${
                      isSelected
                        ? "bg-[#15803d] border-[#15803d] text-white"
                        : "border-slate-300 bg-white"
                    }`}
                  >
                    {isSelected && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                  </div>
                  <span>{cat.name}</span>
                </div>
                <span className="text-[10px] font-extrabold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">
                  {cat.count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Brand Hardware Filter */}
      <div className="space-y-2.5 pt-2 border-t border-slate-100">
        <label className="text-[11px] font-black uppercase tracking-wider text-slate-700 block">
          Hardware Brand
        </label>
        <div className="space-y-1 max-h-48 overflow-y-auto no-scrollbar pr-1">
          {brands.map((b) => {
            const isSelected =
              filters.brand.toLowerCase() === b.name.toLowerCase();
            return (
              <button
                key={b.id}
                onClick={() => handleBrandSelect(b.name)}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
                  isSelected
                    ? "bg-blue-50 text-blue-800 border border-blue-200"
                    : "text-slate-700 hover:bg-slate-50"
                }`}
              >
                <div className="flex items-center gap-2">
                  <div
                    className={`w-3.5 h-3.5 rounded border flex items-center justify-center ${
                      isSelected
                        ? "bg-blue-600 border-blue-600 text-white"
                        : "border-slate-300 bg-white"
                    }`}
                  >
                    {isSelected && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                  </div>
                  <span>{b.name}</span>
                </div>
                <span className="text-[10px] font-extrabold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">
                  {b.count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Price Range Inputs */}
      <div className="space-y-2.5 pt-2 border-t border-slate-100">
        <label className="text-[11px] font-black uppercase tracking-wider text-slate-700 block">
          Price Range (SAR)
        </label>
        <div className="flex items-center gap-2">
          <input
            type="number"
            placeholder="Min"
            value={filters.minPrice}
            onChange={(e) =>
              onFilterChange({ ...filters, minPrice: e.target.value })
            }
            className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-emerald-600 font-bold"
          />
          <span className="text-slate-400 text-xs font-bold">-</span>
          <input
            type="number"
            placeholder="Max"
            value={filters.maxPrice}
            onChange={(e) =>
              onFilterChange({ ...filters, maxPrice: e.target.value })
            }
            className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-emerald-600 font-bold"
          />
        </div>
      </div>

      {/* Availability Toggle */}
      <div className="space-y-2 pt-2 border-t border-slate-100">
        <label className="flex items-center justify-between text-xs font-bold text-slate-700 cursor-pointer">
          <span>In Stock Only</span>
          <input
            type="checkbox"
            checked={filters.inStockOnly}
            onChange={(e) =>
              onFilterChange({ ...filters, inStockOnly: e.target.checked })
            }
            className="w-4 h-4 accent-emerald-600 rounded cursor-pointer"
          />
        </label>
        <label className="flex items-center justify-between text-xs font-bold text-slate-700 cursor-pointer">
          <span>Discounted / On Sale</span>
          <input
            type="checkbox"
            checked={filters.onSaleOnly}
            onChange={(e) =>
              onFilterChange({ ...filters, onSaleOnly: e.target.checked })
            }
            className="w-4 h-4 accent-emerald-600 rounded cursor-pointer"
          />
        </label>
      </div>
    </aside>
  );
}
