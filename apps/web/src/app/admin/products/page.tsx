"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import {
  Package,
  Plus,
  Search,
  Edit3,
  Trash2,
  X,
  Loader2,
  AlertCircle,
  CheckCircle2,
  UploadCloud,
  RefreshCw,
  PlusCircle,
  Tag,
  Layers,
  DollarSign,
  ImageIcon,
} from "lucide-react";
import {
  productsApi,
  type CreateProductInput,
  type UpdateProductInput,
  type ProductQueryParams,
} from "@/lib/api/products-api";
import { mediaApi } from "@/lib/api/media-api";
import type { Product, Category, Brand } from "@/lib/api";

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filters State
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedBrand, setSelectedBrand] = useState("");
  const [activeFilter, setActiveFilter] = useState("");
  const [page, setPage] = useState(1);

  // Modal & Form State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [formName, setFormName] = useState("");
  const [formSku, setFormSku] = useState("");
  const [formPrice, setFormPrice] = useState("");
  const [formCategoryId, setFormCategoryId] = useState("");
  const [formBrandId, setFormBrandId] = useState("");
  const [formShortDesc, setFormShortDesc] = useState("");
  const [formDesc, setFormDesc] = useState("");
  const [formIsActive, setFormIsActive] = useState(true);
  const [formImageUrl, setFormImageUrl] = useState("");
  const [uploadingImage, setUploadingImage] = useState(false);

  // Specifications pairs array
  const [specs, setSpecs] = useState<Array<{ key: string; value: string }>>([
    { key: "Processor", value: "" },
    { key: "RAM", value: "" },
    { key: "Storage", value: "" },
  ]);

  const [submitting, setSubmitting] = useState(false);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);
  const [modalError, setModalError] = useState<string | null>(null);

  // Delete Dialog State
  const [deleteTarget, setDeleteTarget] = useState<Product | null>(null);
  const [deleting, setDeleting] = useState(false);

  const fetchDependencies = async () => {
    try {
      const [cats, brds] = await Promise.all([
        productsApi.getCategories(),
        productsApi.getBrands(),
      ]);
      setCategories(cats);
      setBrands(brds);
    } catch (err) {
      console.error("Failed to fetch catalog categories/brands:", err);
    }
  };

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError(null);

      const params: ProductQueryParams = {
        page,
        limit: 20,
        search: search || undefined,
        categoryId: selectedCategory || undefined,
        brandId: selectedBrand || undefined,
        isActive: activeFilter === "" ? undefined : activeFilter === "true",
      };

      const res = await productsApi.getProducts(params);
      setProducts(res.data);
      setTotal(res.total);
    } catch (err: any) {
      console.error("Failed to load products:", err);
      setError(
        err?.response?.data?.message || err?.message || "Failed to load product catalog.",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDependencies();
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [page, selectedCategory, selectedBrand, activeFilter]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    fetchProducts();
  };

  const handleOpenCreateModal = () => {
    setEditingProduct(null);
    setFormName("");
    setFormSku(`SKU-${Math.floor(100000 + Math.random() * 900000)}`);
    setFormPrice("");
    setFormCategoryId(categories[0]?.id || "");
    setFormBrandId(brands[0]?.id || "");
    setFormShortDesc("");
    setFormDesc("");
    setFormIsActive(true);
    setFormImageUrl("");
    setSpecs([
      { key: "Processor", value: "" },
      { key: "RAM", value: "" },
      { key: "Storage", value: "" },
    ]);
    setModalError(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (p: Product) => {
    setEditingProduct(p);
    setFormName(p.name);
    setFormSku(p.sku);
    setFormPrice(String(p.price));
    setFormCategoryId(p.categoryId);
    setFormBrandId(p.brandId);
    setFormShortDesc(p.shortDescription || "");
    setFormDesc(p.description || "");
    setFormIsActive(p.isActive);

    const primaryImg = p.images?.find((img) => img.isPrimary) || p.images?.[0];
    setFormImageUrl(primaryImg?.url || "");

    // Format specs dictionary to array
    if (p.specifications && typeof p.specifications === "object") {
      const arr = Object.entries(p.specifications).map(([k, v]) => ({
        key: k,
        value: String(v),
      }));
      setSpecs(arr.length > 0 ? arr : [{ key: "Warranty", value: "1 Year" }]);
    } else {
      setSpecs([{ key: "Warranty", value: "1 Year" }]);
    }

    setModalError(null);
    setIsModalOpen(true);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploadingImage(true);
      setModalError(null);
      const uploaded = await mediaApi.uploadSingle(file, "products");
      setFormImageUrl(uploaded.url);
    } catch (err: any) {
      console.error("Image upload failed:", err);
      setModalError("Failed to upload image to Cloudflare R2.");
    } finally {
      setUploadingImage(false);
    }
  };

  const handleAddSpecRow = () => {
    setSpecs((prev) => [...prev, { key: "", value: "" }]);
  };

  const handleRemoveSpecRow = (index: number) => {
    setSpecs((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSpecChange = (index: number, field: "key" | "value", val: string) => {
    setSpecs((prev) =>
      prev.map((item, i) => (i === index ? { ...item, [field]: val } : item)),
    );
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    setModalError(null);
    setActionSuccess(null);

    if (!formName || !formSku || !formPrice || !formCategoryId || !formBrandId) {
      setModalError("Product name, SKU, price, category, and brand are required.");
      return;
    }

    // Convert specs array to object
    const specObj: Record<string, string> = {};
    specs.forEach((s) => {
      if (s.key.trim()) {
        specObj[s.key.trim()] = s.value.trim();
      }
    });

    try {
      setSubmitting(true);
      const numericPrice = Number(formPrice);

      if (editingProduct) {
        // Update product
        const updatePayload: UpdateProductInput = {
          name: formName,
          sku: formSku,
          price: numericPrice,
          categoryId: formCategoryId,
          brandId: formBrandId,
          shortDescription: formShortDesc || undefined,
          description: formDesc || undefined,
          specifications: specObj,
          isActive: formIsActive,
        };

        const updated = await productsApi.updateProduct(editingProduct.id, updatePayload);

        // Attach primary image if uploaded
        if (formImageUrl && formImageUrl !== (editingProduct.images?.[0]?.url || "")) {
          await productsApi.addImage(editingProduct.id, {
            url: formImageUrl,
            isPrimary: true,
            altText: formName,
          });
        }

        setProducts((prev) =>
          prev.map((item) => (item.id === editingProduct.id ? updated : item)),
        );
        setActionSuccess(`Product "${updated.name}" updated successfully.`);
      } else {
        // Create product
        const createPayload: CreateProductInput = {
          name: formName,
          sku: formSku,
          price: numericPrice,
          categoryId: formCategoryId,
          brandId: formBrandId,
          shortDescription: formShortDesc || undefined,
          description: formDesc || undefined,
          specifications: specObj,
          isActive: formIsActive,
          imageUrl: formImageUrl || undefined,
        };

        const created = await productsApi.createProduct(createPayload);
        if (formImageUrl) {
          await productsApi.addImage(created.id, {
            url: formImageUrl,
            isPrimary: true,
            altText: formName,
          });
        }

        setProducts((prev) => [created, ...prev]);
        setTotal((prev) => prev + 1);
        setActionSuccess(`New product "${created.name}" created successfully.`);
      }

      setIsModalOpen(false);
      fetchProducts();
    } catch (err: any) {
      console.error("Failed to save product:", err);
      setModalError(
        err?.response?.data?.message || err?.message || "Failed to save product record.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteProduct = async () => {
    if (!deleteTarget) return;

    try {
      setDeleting(true);
      setActionSuccess(null);
      await productsApi.deleteProduct(deleteTarget.id);
      setProducts((prev) => prev.filter((p) => p.id !== deleteTarget.id));
      setTotal((prev) => prev - 1);
      setActionSuccess(`Product "${deleteTarget.name}" deleted.`);
      setDeleteTarget(null);
    } catch (err: any) {
      alert(err?.response?.data?.message || "Failed to delete product.");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-950 uppercase tracking-tight flex items-center gap-3">
            <Package className="w-7 h-7 text-emerald-700" />
            Product Catalog Management
          </h1>
          <p className="text-xs text-slate-500 font-medium mt-1">
            Add, update, and manage hardware products, specifications, and Cloudflare R2 media.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={fetchProducts}
            disabled={loading}
            className="bg-white hover:bg-slate-50 border border-slate-200/90 text-slate-800 text-xs font-bold px-3.5 py-2.5 rounded-xl transition flex items-center gap-2 cursor-pointer shadow-2xs disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-emerald-700 ${loading ? "animate-spin" : ""}`} />
            <span>Refresh</span>
          </button>

          <button
            onClick={handleOpenCreateModal}
            className="bg-[#15803d] hover:bg-emerald-700 text-white font-extrabold text-xs px-4 py-2.5 rounded-xl uppercase tracking-wider transition flex items-center gap-2 cursor-pointer shadow-2xs"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Product</span>
          </button>
        </div>
      </div>

      {/* Global Success Notification */}
      {actionSuccess && (
        <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 flex items-center gap-3 text-emerald-900 text-xs font-bold shadow-2xs">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span className="flex-1">{actionSuccess}</span>
        </div>
      )}

      {/* Global Error Banner */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-2xl p-4 flex items-center gap-3 text-red-800 text-xs font-bold shadow-2xs">
          <AlertCircle className="w-5 h-5 text-red-600 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Filter Bar & Search */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-4 space-y-4 shadow-2xs">
        <form
          onSubmit={handleSearchSubmit}
          className="flex flex-col md:flex-row items-center gap-3"
        >
          {/* Search Input */}
          <div className="flex-1 relative w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              placeholder="Search by Product Name or SKU..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-emerald-600 focus:bg-white font-medium"
            />
          </div>

          {/* Category Dropdown */}
          <select
            value={selectedCategory}
            onChange={(e) => {
              setSelectedCategory(e.target.value);
              setPage(1);
            }}
            className="w-full md:w-48 px-3 py-2.5 bg-slate-50 border border-slate-200 text-slate-800 text-xs font-bold rounded-xl focus:outline-none"
          >
            <option value="">All Categories</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>

          {/* Brand Dropdown */}
          <select
            value={selectedBrand}
            onChange={(e) => {
              setSelectedBrand(e.target.value);
              setPage(1);
            }}
            className="w-full md:w-44 px-3 py-2.5 bg-slate-50 border border-slate-200 text-slate-800 text-xs font-bold rounded-xl focus:outline-none"
          >
            <option value="">All Brands</option>
            {brands.map((b) => (
              <option key={b.id} value={b.id}>
                {b.name}
              </option>
            ))}
          </select>

          {/* Active Status Dropdown */}
          <select
            value={activeFilter}
            onChange={(e) => {
              setActiveFilter(e.target.value);
              setPage(1);
            }}
            className="w-full md:w-36 px-3 py-2.5 bg-slate-50 border border-slate-200 text-slate-800 text-xs font-bold rounded-xl focus:outline-none"
          >
            <option value="">All Statuses</option>
            <option value="true">Active Only</option>
            <option value="false">Inactive Only</option>
          </select>

          <button
            type="submit"
            className="w-full md:w-auto bg-[#15803d] hover:bg-emerald-700 text-white font-extrabold text-xs px-5 py-2.5 rounded-xl uppercase tracking-wider transition cursor-pointer shadow-2xs"
          >
            Search
          </button>
        </form>
      </div>

      {/* Products Data Table */}
      <div className="bg-white border border-slate-200/90 rounded-2xl overflow-hidden shadow-2xs">
        {loading ? (
          <div className="py-20 text-center flex flex-col items-center justify-center space-y-3">
            <Loader2 className="w-8 h-8 text-emerald-600 animate-spin" />
            <span className="text-xs text-slate-500 font-medium">Fetching catalog database...</span>
          </div>
        ) : products.length === 0 ? (
          <div className="py-16 text-center text-xs text-slate-500 font-medium">
            No products match the selected filters.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/80 text-slate-500 font-extrabold uppercase text-[10px] tracking-wider">
                  <th className="py-3.5 px-4">Product</th>
                  <th className="py-3.5 px-4">SKU & Brand</th>
                  <th className="py-3.5 px-4">Category</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-right">Price</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-800 font-medium">
                {products.map((p) => {
                  const primaryImg = p.images?.find((i) => i.isPrimary)?.url || p.images?.[0]?.url;
                  return (
                    <tr key={p.id} className="hover:bg-slate-50 transition">
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-slate-100 border border-slate-200 overflow-hidden shrink-0 flex items-center justify-center relative">
                            {primaryImg ? (
                              <img
                                src={primaryImg}
                                alt={p.name}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <ImageIcon className="w-5 h-5 text-slate-400" />
                            )}
                          </div>
                          <div>
                            <span className="font-extrabold text-slate-950 block line-clamp-1">
                              {p.name}
                            </span>
                            {p.shortDescription && (
                              <span className="text-[11px] text-slate-500 block font-normal line-clamp-1">
                                {p.shortDescription}
                              </span>
                            )}
                          </div>
                        </div>
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="space-y-0.5">
                          <span className="font-mono text-slate-950 font-bold block">
                            {p.sku}
                          </span>
                          {p.brand && (
                            <span className="text-slate-600 font-bold text-[10px]">
                              {p.brand.name}
                            </span>
                          )}
                        </div>
                      </td>

                      <td className="py-3.5 px-4">
                        <span className="inline-block px-2.5 py-1 rounded-lg text-[10px] font-extrabold bg-slate-100 text-slate-700">
                          {p.category?.name || "Uncategorized"}
                        </span>
                      </td>

                      <td className="py-3.5 px-4">
                        <span
                          className={`inline-block px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider ${
                            p.isActive
                              ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                              : "bg-slate-100 text-slate-600"
                          }`}
                        >
                          {p.isActive ? "Active" : "Inactive"}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 text-right font-black text-slate-950 text-sm">
                        ₹{" "}
                        {Number(p.price).toLocaleString("en-IN", {
                          minimumFractionDigits: 2,
                        })}
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleOpenEditModal(p)}
                            className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition cursor-pointer"
                            title="Edit Product"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setDeleteTarget(p)}
                            className="p-2 rounded-xl bg-rose-50 text-rose-700 border border-rose-200 hover:bg-rose-100 transition cursor-pointer"
                            title="Delete Product"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination Bar */}
        {products.length > 0 && (
          <div className="p-4 bg-slate-50/80 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-slate-700">
            <span>
              Showing {products.length} of {total} products (Page {page} of {Math.ceil(total / 20) || 1})
            </span>
            <div className="flex items-center gap-2">
              <button
                disabled={page <= 1}
                onClick={() => setPage((prev) => Math.max(1, prev - 1))}
                className="bg-white hover:bg-slate-100 text-slate-800 border border-slate-200 px-3 py-1.5 rounded-xl transition cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
              >
                &larr; Previous
              </button>
              <button
                disabled={page >= (Math.ceil(total / 20) || 1)}
                onClick={() => setPage((prev) => prev + 1)}
                className="bg-white hover:bg-slate-100 text-slate-800 border border-slate-200 px-3 py-1.5 rounded-xl transition cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Next &rarr;
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Create / Edit Product Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-2xl bg-white border border-slate-200/90 rounded-2xl p-6 sm:p-8 space-y-6 shadow-2xl text-slate-900 max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div>
                <span className="text-[10px] font-black uppercase tracking-widest text-emerald-800 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-md">
                  {editingProduct ? "Edit Product Record" : "New Hardware Entry"}
                </span>
                <h2 className="text-lg font-black text-slate-950 uppercase tracking-tight mt-1">
                  {editingProduct ? editingProduct.name : "Create Hardware Product"}
                </h2>
              </div>

              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Error */}
            {modalError && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-3 flex items-center gap-2 text-red-800 text-xs font-bold">
                <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
                <span>{modalError}</span>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSaveProduct} className="space-y-4 text-xs font-bold">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-slate-700 block mb-1">Product Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="Dell Latitude 5440 Core i7"
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold focus:outline-none focus:border-emerald-600"
                  />
                </div>
                <div>
                  <label className="text-slate-700 block mb-1">SKU Number *</label>
                  <input
                    type="text"
                    required
                    placeholder="SKU-887410"
                    value={formSku}
                    onChange={(e) => setFormSku(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold focus:outline-none focus:border-emerald-600 font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="text-slate-700 block mb-1">Price (₹) *</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    placeholder="75000"
                    value={formPrice}
                    onChange={(e) => setFormPrice(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold focus:outline-none focus:border-emerald-600"
                  />
                </div>
                <div>
                  <label className="text-slate-700 block mb-1">Category *</label>
                  <select
                    value={formCategoryId}
                    onChange={(e) => setFormCategoryId(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-extrabold focus:outline-none focus:border-emerald-600"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-slate-700 block mb-1">Brand *</label>
                  <select
                    value={formBrandId}
                    onChange={(e) => setFormBrandId(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-extrabold focus:outline-none focus:border-emerald-600"
                  >
                    {brands.map((b) => (
                      <option key={b.id} value={b.id}>
                        {b.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="text-slate-700 block mb-1">Short Description</label>
                <input
                  type="text"
                  placeholder="Enterprise 14-inch Business Laptop with 16GB RAM"
                  value={formShortDesc}
                  onChange={(e) => setFormShortDesc(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold focus:outline-none focus:border-emerald-600"
                />
              </div>

              <div>
                <label className="text-slate-700 block mb-1">Full Product Overview</label>
                <textarea
                  rows={3}
                  placeholder="Detailed specifications, features, ports, and performance summary..."
                  value={formDesc}
                  onChange={(e) => setFormDesc(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold focus:outline-none focus:border-emerald-600"
                />
              </div>

              {/* Cloudflare R2 Product Image Upload */}
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-3">
                <label className="text-slate-700 block font-extrabold">
                  Product Primary Image (Cloudflare R2)
                </label>

                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-xl bg-white border border-slate-200 flex items-center justify-center overflow-hidden shrink-0">
                    {formImageUrl ? (
                      <img src={formImageUrl} alt="Preview" className="w-full h-full object-cover" />
                    ) : (
                      <ImageIcon className="w-6 h-6 text-slate-400" />
                    )}
                  </div>

                  <div className="flex-1">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      disabled={uploadingImage}
                      className="hidden"
                      id="r2-image-file"
                    />
                    <label
                      htmlFor="r2-image-file"
                      className="bg-white hover:bg-slate-100 text-slate-800 border border-slate-300 font-extrabold text-xs px-4 py-2 rounded-xl transition cursor-pointer inline-flex items-center gap-2"
                    >
                      {uploadingImage ? (
                        <Loader2 className="w-4 h-4 animate-spin text-emerald-600" />
                      ) : (
                        <UploadCloud className="w-4 h-4 text-emerald-600" />
                      )}
                      <span>Upload Image to R2</span>
                    </label>
                    <span className="text-[10px] text-slate-500 font-normal block mt-1">
                      Supports JPG, PNG, WEBP. Uploads directly to Cloudflare R2 bucket.
                    </span>
                  </div>
                </div>
              </div>

              {/* Specs Editor */}
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-slate-700 font-extrabold block">
                    Product Specifications
                  </label>
                  <button
                    type="button"
                    onClick={handleAddSpecRow}
                    className="text-emerald-700 hover:text-emerald-800 font-extrabold text-xs inline-flex items-center gap-1 cursor-pointer"
                  >
                    <PlusCircle className="w-3.5 h-3.5" />
                    <span>Add Spec</span>
                  </button>
                </div>

                <div className="space-y-2">
                  {specs.map((spec, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <input
                        type="text"
                        placeholder="Spec Name (e.g. RAM)"
                        value={spec.key}
                        onChange={(e) => handleSpecChange(index, "key", e.target.value)}
                        className="w-1/2 px-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs font-bold"
                      />
                      <input
                        type="text"
                        placeholder="Value (e.g. 16GB DDR5)"
                        value={spec.value}
                        onChange={(e) => handleSpecChange(index, "value", e.target.value)}
                        className="w-1/2 px-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs font-bold"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveSpecRow(index)}
                        className="text-slate-400 hover:text-rose-600 p-1.5 cursor-pointer"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Active Checkbox */}
              <div>
                <label className="flex items-center gap-2 cursor-pointer text-slate-800 font-bold">
                  <input
                    type="checkbox"
                    checked={formIsActive}
                    onChange={(e) => setFormIsActive(e.target.checked)}
                    className="w-4 h-4 accent-emerald-600 rounded"
                  />
                  <span>Product Published & Active in Storefront Catalog</span>
                </label>
              </div>

              {/* Form Footer */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="bg-slate-100 hover:bg-slate-200 text-slate-800 font-extrabold text-xs px-4 py-2.5 rounded-xl uppercase tracking-wider transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="bg-[#15803d] hover:bg-emerald-700 text-white font-extrabold text-xs px-6 py-2.5 rounded-xl uppercase tracking-wider transition flex items-center gap-2 cursor-pointer shadow-2xs disabled:opacity-50"
                >
                  {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
                  <span>{editingProduct ? "Save Product" : "Create Product"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-white border border-slate-200/90 rounded-2xl p-6 space-y-4 shadow-2xl text-slate-900">
            <h3 className="text-base font-black text-slate-950 uppercase tracking-tight">
              Delete Hardware Product?
            </h3>
            <p className="text-xs text-slate-600 font-medium">
              Are you sure you want to soft delete{" "}
              <strong className="font-extrabold text-slate-950">{deleteTarget.name}</strong>?
              This will remove it from storefront catalog listings.
            </p>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-3">
              <button
                onClick={() => setDeleteTarget(null)}
                className="bg-slate-100 hover:bg-slate-200 text-slate-800 font-extrabold text-xs px-4 py-2 rounded-xl transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteProduct}
                disabled={deleting}
                className="bg-rose-600 hover:bg-rose-700 text-white font-extrabold text-xs px-5 py-2 rounded-xl uppercase tracking-wider transition flex items-center gap-2 cursor-pointer shadow-2xs disabled:opacity-50"
              >
                {deleting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                <span>Confirm Delete</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
