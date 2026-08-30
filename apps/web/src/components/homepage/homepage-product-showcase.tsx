"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { Star, ChevronLeft, ChevronRight, ShoppingCart } from "lucide-react";
import { useCartStore } from "@/store/cart-store";
import { fetchProducts, fetchCategories, Product, Category } from "@/lib/api";

export function HomepageProductShowcase() {
  const addItem = useCartStore((state) => state.addItem);
  const [categories, setCategories] = useState<Category[]>([]);
  const [activeTab, setActiveTab] = useState<string>("");
  const [products, setProducts] = useState<Product[]>([]);
  const [loadingCats, setLoadingCats] = useState(true);
  const [loadingProducts, setLoadingProducts] = useState(false);

  useEffect(() => {
    fetchCategories()
      .then((cats) => {
        setCategories(cats);
        if (cats.length > 0) setActiveTab(cats[0].slug);
      })
      .catch(() => setCategories([]))
      .finally(() => setLoadingCats(false));
  }, []);

  const loadProducts = useCallback((categorySlug: string) => {
    if (!categorySlug) return;
    setLoadingProducts(true);
    fetchProducts({ limit: 6, category: categorySlug, isActive: true })
      .then((res) => setProducts(res.data))
      .catch(() => setProducts([]))
      .finally(() => setLoadingProducts(false));
  }, []);

  useEffect(() => {
    if (activeTab) loadProducts(activeTab);
  }, [activeTab, loadProducts]);

  return (
    <section className="w-full max-w-7xl md:max-w-4/5 mx-auto px-4 md:px-0 py-8 sm:py-12 bg-white">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-3 mb-6">
        <div className="flex items-center gap-6 sm:gap-8 overflow-x-auto no-scrollbar">
          {loadingCats
            ? [...Array(3)].map((_, i) => (
                <div key={i} className="w-28 h-5 bg-slate-100 rounded animate-pulse" />
              ))
            : categories.map((cat) => {
                const isActive = activeTab === cat.slug;
                return (
                  <button
                    key={cat.id}
                    onClick={() => setActiveTab(cat.slug)}
                    className={`text-xs sm:text-sm font-bold tracking-tight pb-3 transition-all relative whitespace-nowrap cursor-pointer ${isActive ? "text-slate-900 font-extrabold" : "text-slate-500 hover:text-slate-800 font-semibold"}`}
                  >
                    {cat.name}
                    {isActive && <span className="absolute bottom-0 left-0 right-0 h-[3px] bg-[#FFD400] rounded-full" />}
                  </button>
                );
              })}
        </div>
        <div className="flex items-center gap-2 self-end sm:self-center">
          <button className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center transition cursor-pointer" aria-label="Previous Products">
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center transition cursor-pointer" aria-label="Next Products">
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 sm:gap-5">
        {loadingProducts
          ? [...Array(6)].map((_, i) => (
              <div key={i} className="bg-slate-50 border border-slate-100 rounded-xl p-3.5 animate-pulse h-56" />
            ))
          : products.map((product) => {
              const primaryImage = product.images?.find((img) => img.isPrimary) ?? product.images?.[0];
              const price = Number(product.price);
              const inStock = product.stockStatus ? product.stockStatus !== "OUT_OF_STOCK" : product.isActive !== false;
              return (
                <div key={product.id} className="group bg-white border border-slate-200/80 hover:border-slate-300 rounded-xl p-3.5 flex flex-col justify-between transition-all duration-300 shadow-2xs hover:shadow-md relative">
                  <div className="flex items-center justify-between w-full mb-2 h-5">
                    <span />
                  </div>
                  <Link href={`/products/${product.slug}`} className="block aspect-square w-full rounded-lg bg-slate-50 border border-slate-100/80 p-2 overflow-hidden relative mb-3 group-hover:scale-105 transition-transform duration-300">
                    {primaryImage?.url ? (
                      <img src={primaryImage.url} alt={product.name} className={`w-full h-full object-cover rounded ${!inStock ? "opacity-35" : ""}`} />
                    ) : (
                      <div className="w-full h-full bg-slate-100 rounded flex items-center justify-center text-[10px] font-bold text-slate-400 uppercase tracking-wider">No Image</div>
                    )}
                    {!inStock && (
                      <div className="absolute inset-0 flex items-center justify-center bg-slate-900/60 rounded backdrop-blur-[1px]">
                        <span className="text-[9px] font-black text-white px-2 py-1 bg-slate-950 rounded uppercase tracking-wider">OUT OF STOCK</span>
                      </div>
                    )}
                  </Link>
                  <div className="flex items-center gap-0.5 mb-1.5">
                    {[...Array(5)].map((_, i) => <Star key={i} className="w-3 h-3 fill-[#FFD400] text-[#FFD400]" />)}
                  </div>
                  <Link href={`/products/${product.slug}`} className="text-xs font-semibold text-slate-800 hover:text-amber-600 line-clamp-2 leading-snug transition-colors mb-2 flex-1">
                    {product.name}
                  </Link>
                  <div className="flex items-center justify-between pt-2 border-t border-slate-100 mt-auto">
                    <span className="text-xs font-extrabold text-slate-900">SAR {price.toFixed(2)}</span>
                    {inStock && (
                      <button onClick={() => addItem({ id: product.id, name: product.name, slug: product.slug, sku: product.sku, price, categoryId: product.categoryId, brandId: product.brandId, isActive: product.isActive, images: product.images ?? [] })} className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white transition cursor-pointer" title="Add to cart">
                        <ShoppingCart className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
      </div>
    </section>
  );
}
