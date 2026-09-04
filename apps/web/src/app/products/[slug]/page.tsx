"use client";

import { useState, useEffect, use } from "react";
import Link from "next/link";
import {
  ChevronRight,
  ChevronLeft,
  Star,
  ShoppingCart,
  Check,
  Truck,
  ShieldCheck,
  FileText,
  Minus,
  Plus,
  Building2,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { useLanguageStore } from "@/store/language-store";
import { ProductGallery } from "@/components/products/product-gallery";
import { ProductSpecsTable } from "@/components/products/product-specs-table";
import { ProductReviews } from "@/components/products/product-reviews";
import { ProductCard, ProductItem } from "@/components/products/product-card";
import { useCartStore } from "@/store/cart-store";
import { fetchProductBySlug, fetchProducts, Product } from "@/lib/api";

export default function ProductDetailsPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const resolvedParams = use(params);
  const t = useTranslations("productDetail");
  const tCommon = useTranslations("common");
  const language = useLanguageStore((state) => state.language);
  const isRtl = language === "ar";

  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<"overview" | "specs" | "reviews">(
    "overview",
  );
  const [isAdded, setIsAdded] = useState(false);
  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  const addItem = useCartStore((state) => state.addItem);

  useEffect(() => {
    if (!resolvedParams.slug) return;
    setLoading(true);
    fetchProductBySlug(resolvedParams.slug)
      .then((p) => {
        if (!p) {
          setNotFound(true);
          return;
        }
        setProduct(p);
        fetchProducts({ limit: 4, category: p.categoryId, isActive: true })
          .then((res) =>
            setRelatedProducts(
              res.data.filter((r) => r.id !== p.id).slice(0, 3),
            ),
          )
          .catch(() => setRelatedProducts([]));
      })
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false));
  }, [resolvedParams.slug]);

  const handleAddToCart = () => {
    if (!product) return;
    addItem({
      id: product.id,
      name: product.name,
      slug: product.slug,
      sku: product.sku,
      price: Number(product.price),
      categoryId: product.categoryId,
      brandId: product.brandId,
      isActive: product.isActive,
      images: product.images ?? [],
    });
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 1500);
  };

  if (loading) {
    return (
      <div className="w-full bg-slate-50/50 min-h-screen text-slate-900 font-sans pb-16">
        <div className="bg-white border-b border-slate-200/80 py-4">
          <div className="w-full max-w-7xl md:max-w-4/5 mx-auto px-4 md:px-0">
            <div className="h-4 w-64 bg-slate-100 rounded animate-pulse" />
          </div>
        </div>
        <div className="w-full max-w-7xl md:max-w-4/5 mx-auto px-4 md:px-0 pt-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="col-span-6 aspect-square bg-slate-100 rounded-2xl animate-pulse" />
            <div className="col-span-6 space-y-4">
              {[...Array(6)].map((_, i) => (
                <div
                  key={i}
                  className="h-6 bg-slate-100 rounded animate-pulse"
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (notFound || !product) {
    return (
      <div className="w-full min-h-screen flex flex-col items-center justify-center font-sans text-slate-700 gap-4">
        <h1 className="text-2xl font-black">{t("productNotFound")}</h1>
        <p className="text-sm text-slate-500">{t("productNotFoundDesc")}</p>
        <Link
          href="/products"
          className="text-xs font-extrabold text-emerald-700 underline underline-offset-4 hover:text-emerald-900 transition"
        >
          {t("browseProducts")}
        </Link>
      </div>
    );
  }

  const price = Number(product.price);
  const inStock = product.stockStatus
    ? product.stockStatus !== "OUT_OF_STOCK"
    : product.isActive !== false;
  const installmentAmount = (price / 4).toLocaleString(
    isRtl ? "ar-SA" : "en-US",
    { minimumFractionDigits: 2, maximumFractionDigits: 2 },
  );

  const galleryImages = (product.images ?? []).map((img) => ({
    id: img.id,
    url: img.url,
    alt: img.altText ?? product.name,
  }));

  const specifications = product.specifications
    ? Object.entries(product.specifications).map(([key, value]) => ({
        key,
        value: String(value),
      }))
    : [];

  const relatedItems: ProductItem[] = relatedProducts.map((p) => ({
    id: p.id,
    name: p.name,
    category: p.category?.name ?? "",
    brand: p.brand?.name ?? "",
    tag: p.category?.name ?? "",
    discount: undefined,
    badge: tCommon("newArrival"),
    rating: 5,
    reviewsCount: 0,
    price: Number(p.price),
    originalPrice: undefined,
    inStock: p.stockStatus === "IN_STOCK" || p.stockStatus === "LOW_STOCK",
    image:
      p.images?.find((img) => img.isPrimary)?.url ?? p.images?.[0]?.url ?? "",
    specs: [],
  }));

  return (
    <div className="w-full bg-slate-50/50 min-h-screen text-slate-900 font-sans pb-16">
      <div className="bg-white border-b border-slate-200/80 py-4">
        <div className="w-full max-w-7xl md:max-w-4/5 mx-auto px-4 md:px-0 flex items-center gap-2 text-xs font-bold text-slate-500 overflow-x-auto no-scrollbar">
          <Link href="/" className="hover:text-emerald-700 transition">
            {tCommon("home")}
          </Link>
          {isRtl ? (
            <ChevronLeft className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          ) : (
            <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          )}
          <Link
            href="/products"
            className="hover:text-emerald-700 transition shrink-0"
          >
            {tCommon("catalog")}
          </Link>
          {isRtl ? (
            <ChevronLeft className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          ) : (
            <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          )}
          <Link
            href={`/products?category=${product.category?.slug ?? ""}`}
            className="hover:text-emerald-700 transition shrink-0"
          >
            {product.category?.name ?? "Category"}
          </Link>
          {isRtl ? (
            <ChevronLeft className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          ) : (
            <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          )}
          <span className="text-slate-900 font-extrabold truncate">
            {product.name}
          </span>
        </div>
      </div>

      <div className="w-full max-w-7xl md:max-w-4/5 mx-auto px-4 md:px-0 pt-6 sm:pt-8 space-y-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          <div className="col-span-12 lg:col-span-6">
            <ProductGallery
              images={galleryImages}
              title={product.name}
              badge={undefined}
              discount={undefined}
            />
          </div>

          <div className="col-span-12 lg:col-span-6 bg-white border border-slate-200/90 rounded-2xl p-6 sm:p-8 space-y-6 shadow-2xs">
            <div className="flex items-center justify-between gap-2 text-xs font-extrabold">
              <div className="flex items-center gap-2">
                <span className="bg-emerald-50 text-emerald-800 border border-emerald-200/80 px-2.5 py-1 rounded uppercase tracking-wider">
                  {product.brand?.name ?? "Brand"}
                </span>
                <span className="text-slate-400">•</span>
                <span className="text-slate-500 uppercase tracking-wider">
                  {product.category?.name ?? "Category"}
                </span>
              </div>
              <span className="text-slate-400 font-mono text-[11px]">
                {t("sku")} {product.sku}
              </span>
              <span
                className={`text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded ${inStock ? "bg-emerald-50 text-emerald-800 border border-emerald-200" : "bg-rose-50 text-rose-800 border border-rose-200"}`}
              >
                {inStock ? tCommon("inStock") : tCommon("outOfStock")}
              </span>
            </div>

            <h1 className="text-xl sm:text-2xl font-black text-slate-950 leading-tight">
              {product.name}
            </h1>

            <div className="flex items-center gap-3 pb-2 border-b border-slate-100">
              <div className="flex items-center gap-1 text-xs">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className="w-4 h-4 fill-amber-400 text-amber-400"
                  />
                ))}
              </div>
              <span className="text-xs font-extrabold text-slate-700">5.0</span>
            </div>

            <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-4 space-y-3">
              <div className="flex items-baseline gap-3">
                <span className="text-2xl sm:text-3xl font-black text-slate-950">
                  {tCommon("currency")}{" "}
                  {price.toLocaleString(isRtl ? "ar-SA" : "en-US", {
                    minimumFractionDigits: 2,
                  })}
                </span>
                <span className="text-xs font-extrabold text-emerald-700 ms-auto">
                  {tCommon("zatcaVatIncluded")}
                </span>
              </div>
              <div className="flex items-center gap-2 bg-white border border-emerald-200/80 px-3 py-2 rounded-lg text-xs font-bold text-emerald-800 shadow-2xs">
                <span className="bg-[#15803d] text-white text-[9px] font-black px-1.5 py-0.5 rounded">
                  {tCommon("tabbyOrTamara")}
                </span>
                <span>
                  {tCommon("installmentsText", { amount: installmentAmount })}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2 text-xs font-bold text-emerald-700">
              <span
                className={`w-2.5 h-2.5 rounded-full ${inStock ? "bg-emerald-600 animate-pulse" : "bg-rose-400"}`}
              />
              <span>
                {inStock ? tCommon("inStock") : tCommon("outOfStock")}
              </span>
            </div>

            <div className="space-y-3 pt-2">
              <div className="flex items-center gap-3">
                <div className="flex items-center border border-slate-200 rounded-xl bg-slate-50 p-1">
                  <button
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className="w-8 h-8 rounded-lg bg-white border border-slate-200 hover:bg-slate-100 flex items-center justify-center text-slate-700 transition cursor-pointer"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="w-10 text-center text-xs font-black text-slate-900">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity((q) => q + 1)}
                    className="w-8 h-8 rounded-lg bg-white border border-slate-200 hover:bg-slate-100 flex items-center justify-center text-slate-700 transition cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
                <button
                  onClick={handleAddToCart}
                  disabled={!inStock}
                  className={`flex-1 py-3.5 rounded-xl font-extrabold text-xs uppercase tracking-wider transition cursor-pointer flex items-center justify-center gap-2 active:scale-95 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed ${isAdded ? "bg-emerald-600 text-white" : "bg-[#15803d] hover:bg-emerald-700 text-white"}`}
                >
                  {isAdded ? (
                    <>
                      <Check className="w-4 h-4 stroke-[3]" />
                      <span>{tCommon("addedToCart")}</span>
                    </>
                  ) : (
                    <>
                      <ShoppingCart className="w-4 h-4" />
                      <span>{tCommon("addToCart")}</span>
                    </>
                  )}
                </button>
              </div>
              <Link
                href="/contact?subject=RFQ"
                className="w-full bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs py-3 rounded-xl uppercase tracking-wider transition flex items-center justify-center gap-2 cursor-pointer shadow-2xs"
              >
                <Building2 className="w-4 h-4 text-emerald-400" />
                <span>{t("guarantees.b2b")}</span>
              </Link>
            </div>

            <div className="grid grid-cols-3 gap-2 pt-4 border-t border-slate-100 text-[11px] font-extrabold text-slate-700 uppercase tracking-wider">
              <div className="flex items-center gap-1.5">
                <Truck className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{tCommon("freeShipping")}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-blue-600 shrink-0" />
                <span>{tCommon("officialSaudiWarranty")}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <FileText className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{tCommon("vat")}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white border border-slate-200/90 rounded-2xl p-6 sm:p-8 space-y-6 shadow-2xs">
          <div className="flex items-center gap-2 border-b border-slate-200/80 overflow-x-auto no-scrollbar pb-3">
            {(["overview", "specs", "reviews"] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition cursor-pointer shrink-0 ${activeTab === tab ? "bg-[#15803d] text-white shadow-2xs" : "bg-slate-100 text-slate-600 hover:bg-slate-200"}`}
              >
                {tab === "overview"
                  ? t("tabs.overview")
                  : tab === "specs"
                    ? t("tabs.specs")
                    : t("tabs.reviews")}
              </button>
            ))}
          </div>
          {activeTab === "overview" && (
            <div className="space-y-4 text-xs sm:text-sm text-slate-700 leading-relaxed font-medium">
              <h3 className="text-base font-black text-slate-900 uppercase">
                {t("tabs.overview")}
              </h3>
              <p>
                {product.description ??
                  product.shortDescription ??
                  t("productNotFoundDesc")}
              </p>
            </div>
          )}
          {activeTab === "specs" && (
            <ProductSpecsTable specifications={specifications} />
          )}
          {activeTab === "reviews" && (
            <ProductReviews rating={5} reviewsCount={0} reviews={[]} />
          )}
        </div>

        {relatedItems.length > 0 && (
          <div className="space-y-6 pt-4">
            <div className="flex items-center justify-between border-b border-slate-200/80 pb-4">
              <h3 className="text-lg font-black text-slate-950 uppercase tracking-tight">
                {t("relatedProducts")}
              </h3>
              <Link
                href="/products"
                className="text-xs font-black text-emerald-700 hover:underline inline-flex items-center gap-1"
              >
                <span>{tCommon("viewAll")}</span>
                {isRtl ? (
                  <ChevronLeft className="w-3.5 h-3.5" />
                ) : (
                  <ChevronRight className="w-3.5 h-3.5" />
                )}
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
              {relatedItems.map((prod) => (
                <ProductCard key={prod.id} product={prod} layout="grid" />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
