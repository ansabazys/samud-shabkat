"use client";

import { useState, use } from "react";
import Link from "next/link";
import {
  ChevronRight,
  Star,
  ShoppingCart,
  Check,
  Truck,
  ShieldCheck,
  FileText,
  Minus,
  Plus,
  Heart,
  Building2,
} from "lucide-react";
import { ProductGallery } from "@/components/products/product-gallery";
import { ProductSpecsTable } from "@/components/products/product-specs-table";
import { ProductReviews } from "@/components/products/product-reviews";
import { ProductCard, ProductItem } from "@/components/products/product-card";
import { useCartStore } from "@/store/cart-store";

// Mock Product Database by Slug / ID
const MOCK_PRODUCT_DETAILS = {
  id: "cat-prod-1",
  name: "Cisco Catalyst 9300 48-Port Managed PoE+ Switch (740W Power Budget)",
  sku: "C9300-48P-A",
  category: "Networking",
  categorySlug: "networking",
  brand: "Cisco",
  badge: "ENTERPRISE",
  discount: "-12%",
  rating: 5,
  reviewsCount: 46,
  price: 4250.0,
  originalPrice: 4850.0,
  inStock: true,
  stockCount: 14,
  description:
    "The Cisco Catalyst 9300 Series is Cisco's lead stackable enterprise switching platform built for security, IoT, mobility, and cloud. Featuring 48 full PoE+ ports with 740W power budget, StackWise-480 architecture, and advanced Layer 3 routing capabilities for high-performance enterprise enterprise Saudi networks.",
  images: [
    {
      id: "img-1",
      url: "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=800&auto=format&fit=crop",
      alt: "Cisco Catalyst 9300 Switch Front View",
    },
    {
      id: "img-2",
      url: "https://images.unsplash.com/photo-1543512214-318c7553f230?w=800&auto=format&fit=crop",
      alt: "Cisco Catalyst 9300 Back View",
    },
    {
      id: "img-3",
      url: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&auto=format&fit=crop",
      alt: "Cisco Catalyst Stack Ports",
    },
  ],
  specifications: [
    { key: "Total Ports", value: "48x 10/100/1000 Gigabit Ethernet" },
    { key: "PoE Power Budget", value: "740W PoE+ (IEEE 802.3at)" },
    { key: "Switching Capacity", value: "256 Gbps (Up to 480 Gbps stacked)" },
    { key: "Forwarding Rate", value: "190.4 Mpps" },
    { key: "Form Factor", value: "1U Rack-Mountable" },
    { key: "Stacking Technology", value: "StackWise-480 (480 Gbps Stack)" },
    { key: "Power Supply", value: "Dual Hot-Swappable 1100W AC" },
    { key: "Warranty", value: "2-Year Cisco Official Agency Warranty" },
  ],
  reviews: [
    {
      id: "rev-1",
      author: "Fahad A. (Network Architect)",
      rating: 5,
      date: "August 10, 2026",
      title: "Rock Solid Enterprise Switch for Riyadh Data Center",
      comment:
        "Installed two 9300 switches in our core stack. Stacking bandwidth is phenomenal and PoE+ power budget handles 40+ IP phones and Wi-Fi 6 APs effortlessly. Tax invoice was sent immediately.",
      verified: true,
    },
    {
      id: "rev-2",
      author: "Tariq K. (IT Director)",
      rating: 5,
      date: "July 28, 2026",
      title: "Fast Delivery across KSA & Official Cisco Partner",
      comment:
        "Received original sealed box within 48 hours in Jeddah. Great pricing compared to local distributors.",
      verified: true,
    },
  ],
};

const RELATED_PRODUCTS: ProductItem[] = [
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
];

export default function ProductDetailsPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const resolvedParams = use(params);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<
    "overview" | "specs" | "reviews" | "rfq"
  >("overview");
  const [isAdded, setIsAdded] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false);

  const addItem = useCartStore((state) => state.addItem);

  const product = MOCK_PRODUCT_DETAILS;

  const handleAddToCart = () => {
    addItem({
      id: product.id,
      name: product.name,
      slug: resolvedParams.slug || product.id,
      sku: product.sku,
      price: product.price,
      categoryId: "cat-1",
      brandId: "brand-1",
      isActive: true,
      images: [{ id: "img-1", url: product.images[0].url, isPrimary: true }],
    });

    setIsAdded(true);
    setTimeout(() => {
      setIsAdded(false);
    }, 1500);
  };

  const installmentAmount = (product.price / 4).toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  return (
    <div className="w-full bg-slate-50/50 min-h-screen text-slate-900 font-sans pb-16">
      {/* Breadcrumb Header */}
      <div className="bg-white border-b border-slate-200/80 py-4">
        <div className="w-full max-w-7xl md:max-w-4/5 mx-auto px-4 md:px-0 flex items-center gap-2 text-xs font-bold text-slate-500 overflow-x-auto no-scrollbar">
          <Link href="/" className="hover:text-emerald-700 transition">
            Home
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          <Link
            href="/products"
            className="hover:text-emerald-700 transition shrink-0"
          >
            Products
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          <Link
            href={`/products?category=${product.categorySlug}`}
            className="hover:text-emerald-700 transition shrink-0"
          >
            {product.category}
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          <span className="text-slate-900 font-extrabold truncate">
            {product.name}
          </span>
        </div>
      </div>

      {/* Main Product Container */}
      <div className="w-full max-w-7xl md:max-w-4/5 mx-auto px-4 md:px-0 pt-6 sm:pt-8 space-y-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          {/* Left Column: Product Gallery (5 cols) */}
          <div className="col-span-12 lg:col-span-6">
            <ProductGallery
              images={product.images}
              title={product.name}
              badge={product.badge}
              discount={product.discount}
            />
          </div>

          {/* Right Column: Buy Box & Product Info (6 cols) */}
          <div className="col-span-12 lg:col-span-6 bg-white border border-slate-200/90 rounded-2xl p-6 sm:p-8 space-y-6 shadow-2xs">
            {/* Header Tags & SKU */}
            <div className="flex items-center justify-between gap-2 text-xs font-extrabold">
              <div className="flex items-center gap-2">
                <span className="bg-emerald-50 text-emerald-800 border border-emerald-200/80 px-2.5 py-1 rounded uppercase tracking-wider">
                  {product.brand}
                </span>
                <span className="text-slate-400">•</span>
                <span className="text-slate-500 uppercase tracking-wider">
                  {product.category}
                </span>
              </div>
              <span className="text-slate-400 font-mono text-[11px]">
                SKU: {product.sku}
              </span>
              <span
                className={`text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded ${
                  product.inStock
                    ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                    : "bg-rose-50 text-rose-800 border border-rose-200"
                }`}
              >
                {product.inStock ? "In Stock (Available at Counter)" : "Out of Stock"}
              </span>
            </div>

            {/* Title */}
            <h1 className="text-xl sm:text-2xl font-black text-slate-950 leading-tight">
              {product.name}
            </h1>

            {/* Rating Stars & Reviews Count */}
            <div className="flex items-center gap-3 pb-2 border-b border-slate-100">
              <div className="flex items-center gap-1 text-xs">
                {[...Array(product.rating)].map((_, i) => (
                  <Star
                    key={i}
                    className="w-4 h-4 fill-amber-400 text-amber-400"
                  />
                ))}
              </div>
              <span className="text-xs font-extrabold text-slate-700">
                5.0 ({product.reviewsCount} verified customer reviews)
              </span>
            </div>

            {/* Price Box & Tabby/Tamara Installments */}
            <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-4 space-y-3">
              <div className="flex items-baseline gap-3">
                <span className="text-2xl sm:text-3xl font-black text-slate-950">
                  SAR{" "}
                  {product.price.toLocaleString("en-US", {
                    minimumFractionDigits: 2,
                  })}
                </span>
                {product.originalPrice && (
                  <span className="text-sm font-semibold text-slate-400 line-through">
                    SAR{" "}
                    {product.originalPrice.toLocaleString("en-US", {
                      minimumFractionDigits: 2,
                    })}
                  </span>
                )}
                <span className="text-xs font-extrabold text-emerald-700 ml-auto">
                  Taxes Included (15% VAT)
                </span>
              </div>

              {/* Installment Badge */}
              <div className="flex items-center gap-2 bg-white border border-emerald-200/80 px-3 py-2 rounded-lg text-xs font-bold text-emerald-800 shadow-2xs">
                <span className="bg-[#15803d] text-white text-[9px] font-black px-1.5 py-0.5 rounded">
                  Tabby / Tamara
                </span>
                <span>
                  Or 4 payments of{" "}
                  <strong className="font-extrabold">
                    SAR {installmentAmount}
                  </strong>
                  /mo with zero interest.
                </span>
              </div>
            </div>

            {/* Stock Availability Indicator */}
            <div className="flex items-center gap-2 text-xs font-bold text-emerald-700">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 animate-pulse" />
              <span>
                In Stock in KSA Warehouse ({product.stockCount} units available
                for express dispatch)
              </span>
            </div>

            {/* Quantity Selector & Action Buttons */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center gap-3">
                {/* Quantity Box */}
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

                {/* Primary Add to Cart Button */}
                <button
                  onClick={handleAddToCart}
                  className={`flex-1 py-3.5 rounded-xl font-extrabold text-xs uppercase tracking-wider transition cursor-pointer flex items-center justify-center gap-2 active:scale-95 shadow-sm ${
                    isAdded
                      ? "bg-emerald-600 text-white"
                      : "bg-[#15803d] hover:bg-emerald-700 text-white"
                  }`}
                >
                  {isAdded ? (
                    <>
                      <Check className="w-4 h-4 stroke-[3]" />
                      <span>Added to Cart</span>
                    </>
                  ) : (
                    <>
                      <ShoppingCart className="w-4 h-4" />
                      <span>Add to Cart</span>
                    </>
                  )}
                </button>
              </div>

              {/* Corporate B2B RFQ Button */}
              <Link
                href="/contact?subject=RFQ"
                className="w-full bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs py-3 rounded-xl uppercase tracking-wider transition flex items-center justify-center gap-2 cursor-pointer shadow-2xs"
              >
                <Building2 className="w-4 h-4 text-emerald-400" />
                <span>Request B2B Corporate RFQ & Tax Invoice</span>
              </Link>
            </div>

            {/* Store Guarantee Checks */}
            <div className="grid grid-cols-3 gap-2 pt-4 border-t border-slate-100 text-[11px] font-extrabold text-slate-700 uppercase tracking-wider">
              <div className="flex items-center gap-1.5">
                <Truck className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Express KSA Delivery</span>
              </div>
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-blue-600 shrink-0" />
                <span>Official Warranty</span>
              </div>
              <div className="flex items-center gap-1.5">
                <FileText className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>VAT Invoice</span>
              </div>
            </div>
          </div>
        </div>

        {/* Product Information Tabs */}
        <div className="bg-white border border-slate-200/90 rounded-2xl p-6 sm:p-8 space-y-6 shadow-2xs">
          {/* Tab Selector Buttons */}
          <div className="flex items-center gap-2 border-b border-slate-200/80 overflow-x-auto no-scrollbar pb-3">
            <button
              onClick={() => setActiveTab("overview")}
              className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition cursor-pointer shrink-0 ${
                activeTab === "overview"
                  ? "bg-[#15803d] text-white shadow-2xs"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              Overview & Features
            </button>
            <button
              onClick={() => setActiveTab("specs")}
              className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition cursor-pointer shrink-0 ${
                activeTab === "specs"
                  ? "bg-[#15803d] text-white shadow-2xs"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              Technical Specs
            </button>
            <button
              onClick={() => setActiveTab("reviews")}
              className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition cursor-pointer shrink-0 ${
                activeTab === "reviews"
                  ? "bg-[#15803d] text-white shadow-2xs"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              Customer Reviews ({product.reviewsCount})
            </button>
          </div>

          {/* Tab Content Panels */}
          {activeTab === "overview" && (
            <div className="space-y-4 text-xs sm:text-sm text-slate-700 leading-relaxed font-medium">
              <h3 className="text-base font-black text-slate-900 uppercase">
                Product Description
              </h3>
              <p>{product.description}</p>
              <div className="pt-2 space-y-2">
                <h4 className="font-extrabold text-slate-900 uppercase">
                  Key Enterprise Features:
                </h4>
                <ul className="list-disc list-inside space-y-1 text-slate-600 font-bold">
                  <li>48 Full PoE+ ports with 740W dedicated power budget</li>
                  <li>
                    Cisco StackWise-480 technology for high-speed switch
                    stacking
                  </li>
                  <li>Dual redundant hot-swappable 1100W AC power supplies</li>
                  <li>
                    Full Layer 3 routing including OSPF, EIGRP, BGP, and IS-IS
                  </li>
                  <li>
                    ZATCA VAT tax invoice included for commercial B2B
                    procurement
                  </li>
                </ul>
              </div>
            </div>
          )}

          {activeTab === "specs" && (
            <ProductSpecsTable specifications={product.specifications} />
          )}

          {activeTab === "reviews" && (
            <ProductReviews
              rating={product.rating}
              reviewsCount={product.reviewsCount}
              reviews={product.reviews}
            />
          )}
        </div>

        {/* Related Products Section */}
        <div className="space-y-6 pt-4">
          <div className="flex items-center justify-between border-b border-slate-200/80 pb-4">
            <h3 className="text-lg font-black text-slate-950 uppercase tracking-tight">
              Related Hardware & Accessories
            </h3>
            <Link
              href="/products"
              className="text-xs font-black text-emerald-700 hover:underline inline-flex items-center gap-1"
            >
              <span>View All Catalog</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
            {RELATED_PRODUCTS.map((prod) => (
              <ProductCard key={prod.id} product={prod} layout="grid" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
