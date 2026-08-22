"use client";

import { useEffect, useState } from "react";
import {
  Layers,
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
  ImageIcon,
} from "lucide-react";
import {
  categoriesApi,
  type CreateCategoryInput,
  type UpdateCategoryInput,
  type CategoryQueryParams,
} from "@/lib/api/categories-api";
import { mediaApi } from "@/lib/api/media-api";
import type { Category } from "@/lib/api";

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filter States
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [formName, setFormName] = useState("");
  const [formSlug, setFormSlug] = useState("");
  const [formDesc, setFormDesc] = useState("");
  const [formSortOrder, setFormSortOrder] = useState("0");
  const [formImageUrl, setFormImageUrl] = useState("");
  const [uploadingImage, setUploadingImage] = useState(false);

  const [submitting, setSubmitting] = useState(false);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);
  const [modalError, setModalError] = useState<string | null>(null);

  // Delete Dialog State
  const [deleteTarget, setDeleteTarget] = useState<Category | null>(null);
  const [deleting, setDeleting] = useState(false);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      setError(null);

      const params: CategoryQueryParams = {
        page,
        limit: 25,
        search: search || undefined,
      };

      const res = await categoriesApi.getCategories(params);
      setCategories(res.data);
      setTotal(res.total);
    } catch (err: any) {
      console.error("Failed to load categories:", err);
      setError(
        err?.response?.data?.message || err?.message || "Failed to load category list.",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, [page]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    fetchCategories();
  };

  const handleNameChange = (val: string) => {
    setFormName(val);
    if (!editingCategory) {
      const generatedSlug = val
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)+/g, "");
      setFormSlug(generatedSlug);
    }
  };

  const handleOpenCreateModal = () => {
    setEditingCategory(null);
    setFormName("");
    setFormSlug("");
    setFormDesc("");
    setFormSortOrder("0");
    setFormImageUrl("");
    setModalError(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (c: Category) => {
    setEditingCategory(c);
    setFormName(c.name);
    setFormSlug(c.slug);
    setFormDesc(c.description || "");
    setFormSortOrder("0");
    setFormImageUrl(c.imageUrl || "");
    setModalError(null);
    setIsModalOpen(true);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploadingImage(true);
      setModalError(null);
      const uploaded = await mediaApi.uploadSingle(file, "categories");
      setFormImageUrl(uploaded.url);
    } catch (err: any) {
      console.error("Image upload failed:", err);
      setModalError("Failed to upload category image to Cloudflare R2.");
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSaveCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    setModalError(null);
    setActionSuccess(null);

    if (!formName) {
      setModalError("Category name is required.");
      return;
    }

    try {
      setSubmitting(true);
      const slugVal =
        formSlug ||
        formName
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/(^-|-$)+/g, "");

      if (editingCategory) {
        // Update category
        const updatePayload: UpdateCategoryInput = {
          name: formName,
          slug: slugVal,
          description: formDesc || undefined,
          imageUrl: formImageUrl || undefined,
          sortOrder: Number(formSortOrder) || 0,
        };

        const updated = await categoriesApi.updateCategory(editingCategory.id, updatePayload);
        setCategories((prev) =>
          prev.map((c) => (c.id === editingCategory.id ? updated : c)),
        );
        setActionSuccess(`Category "${updated.name}" updated successfully.`);
      } else {
        // Create category
        const createPayload: CreateCategoryInput = {
          name: formName,
          slug: slugVal,
          description: formDesc || undefined,
          imageUrl: formImageUrl || undefined,
          sortOrder: Number(formSortOrder) || 0,
        };

        const created = await categoriesApi.createCategory(createPayload);
        setCategories((prev) => [created, ...prev]);
        setTotal((prev) => prev + 1);
        setActionSuccess(`Category "${created.name}" created successfully.`);
      }

      setIsModalOpen(false);
    } catch (err: any) {
      console.error("Failed to save category:", err);
      setModalError(
        err?.response?.data?.message || err?.message || "Failed to save category record.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteCategory = async () => {
    if (!deleteTarget) return;

    try {
      setDeleting(true);
      setActionSuccess(null);
      await categoriesApi.deleteCategory(deleteTarget.id);
      setCategories((prev) => prev.filter((c) => c.id !== deleteTarget.id));
      setTotal((prev) => prev - 1);
      setActionSuccess(`Category "${deleteTarget.name}" deleted.`);
      setDeleteTarget(null);
    } catch (err: any) {
      alert(err?.response?.data?.message || "Failed to delete category.");
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
            <Layers className="w-7 h-7 text-emerald-700" />
            Category Management
          </h1>
          <p className="text-xs text-slate-500 font-medium mt-1">
            Organize IT hardware product categories, slugs, descriptions, and Cloudflare R2 images.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={fetchCategories}
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
            <span>Add Category</span>
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

      {/* Search Bar */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-4 space-y-4 shadow-2xs">
        <form onSubmit={handleSearchSubmit} className="flex items-center gap-3">
          <div className="flex-1 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              placeholder="Search category by Name, Slug, or Description..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-emerald-600 focus:bg-white font-medium"
            />
          </div>

          <button
            type="submit"
            className="bg-[#15803d] hover:bg-emerald-700 text-white font-extrabold text-xs px-5 py-2.5 rounded-xl uppercase tracking-wider transition cursor-pointer shadow-2xs shrink-0"
          >
            Search
          </button>
        </form>
      </div>

      {/* Categories Data Table */}
      <div className="bg-white border border-slate-200/90 rounded-2xl overflow-hidden shadow-2xs">
        {loading ? (
          <div className="py-20 text-center flex flex-col items-center justify-center space-y-3">
            <Loader2 className="w-8 h-8 text-emerald-600 animate-spin" />
            <span className="text-xs text-slate-500 font-medium">Loading categories database...</span>
          </div>
        ) : categories.length === 0 ? (
          <div className="py-16 text-center text-xs text-slate-500 font-medium">
            No categories found.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/80 text-slate-500 font-extrabold uppercase text-[10px] tracking-wider">
                  <th className="py-3.5 px-4">Category</th>
                  <th className="py-3.5 px-4">URL Slug</th>
                  <th className="py-3.5 px-4">Description</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-800 font-medium">
                {categories.map((c) => (
                  <tr key={c.id} className="hover:bg-slate-50 transition">
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-slate-100 border border-slate-200 overflow-hidden shrink-0 flex items-center justify-center relative">
                          {c.imageUrl ? (
                            <img
                              src={c.imageUrl}
                              alt={c.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <ImageIcon className="w-5 h-5 text-slate-400" />
                          )}
                        </div>
                        <span className="font-extrabold text-slate-950 block">
                          {c.name}
                        </span>
                      </div>
                    </td>

                    <td className="py-3.5 px-4 font-mono font-bold text-slate-700">
                      /{c.slug}
                    </td>

                    <td className="py-3.5 px-4 text-slate-500 font-normal">
                      {c.description || "No description provided."}
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleOpenEditModal(c)}
                          className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition cursor-pointer"
                          title="Edit Category"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setDeleteTarget(c)}
                          className="p-2 rounded-xl bg-rose-50 text-rose-700 border border-rose-200 hover:bg-rose-100 transition cursor-pointer"
                          title="Delete Category"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination Bar */}
        {categories.length > 0 && (
          <div className="p-4 bg-slate-50/80 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-slate-700">
            <span>
              Showing {categories.length} of {total} categories (Page {page} of {Math.ceil(total / 25) || 1})
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
                disabled={page >= (Math.ceil(total / 25) || 1)}
                onClick={() => setPage((prev) => prev + 1)}
                className="bg-white hover:bg-slate-100 text-slate-800 border border-slate-200 px-3 py-1.5 rounded-xl transition cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Next &rarr;
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Create / Edit Category Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-white border border-slate-200/90 rounded-2xl p-6 sm:p-8 space-y-6 shadow-2xl text-slate-900">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div>
                <span className="text-[10px] font-black uppercase tracking-widest text-emerald-800 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-md">
                  {editingCategory ? "Edit Category" : "New Category Entry"}
                </span>
                <h2 className="text-lg font-black text-slate-950 uppercase tracking-tight mt-1">
                  {editingCategory ? editingCategory.name : "Create Hardware Category"}
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
            <form onSubmit={handleSaveCategory} className="space-y-4 text-xs font-bold">
              <div>
                <label className="text-slate-700 block mb-1">Category Name *</label>
                <input
                  type="text"
                  required
                  placeholder="Laptops & Notebooks"
                  value={formName}
                  onChange={(e) => handleNameChange(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold focus:outline-none focus:border-emerald-600"
                />
              </div>

              <div>
                <label className="text-slate-700 block mb-1">URL Slug</label>
                <input
                  type="text"
                  placeholder="laptops-notebooks"
                  value={formSlug}
                  onChange={(e) => setFormSlug(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold focus:outline-none focus:border-emerald-600 font-mono"
                />
              </div>

              <div>
                <label className="text-slate-700 block mb-1">Description</label>
                <textarea
                  rows={3}
                  placeholder="Enterprise ultrabooks, workstations, and high-performance notebooks..."
                  value={formDesc}
                  onChange={(e) => setFormDesc(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold focus:outline-none focus:border-emerald-600"
                />
              </div>

              {/* R2 Image Upload */}
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-3">
                <label className="text-slate-700 block font-extrabold">
                  Category Banner Image (Cloudflare R2)
                </label>

                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-xl bg-white border border-slate-200 flex items-center justify-center overflow-hidden shrink-0">
                    {formImageUrl ? (
                      <img src={formImageUrl} alt="Preview" className="w-full h-full object-cover" />
                    ) : (
                      <ImageIcon className="w-5 h-5 text-slate-400" />
                    )}
                  </div>

                  <div className="flex-1">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      disabled={uploadingImage}
                      className="hidden"
                      id="r2-cat-file"
                    />
                    <label
                      htmlFor="r2-cat-file"
                      className="bg-white hover:bg-slate-100 text-slate-800 border border-slate-300 font-extrabold text-xs px-3.5 py-2 rounded-xl transition cursor-pointer inline-flex items-center gap-2"
                    >
                      {uploadingImage ? (
                        <Loader2 className="w-4 h-4 animate-spin text-emerald-600" />
                      ) : (
                        <UploadCloud className="w-4 h-4 text-emerald-600" />
                      )}
                      <span>Upload Image</span>
                    </label>
                  </div>
                </div>
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
                  <span>{editingCategory ? "Save Category" : "Create Category"}</span>
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
              Delete Hardware Category?
            </h3>
            <p className="text-xs text-slate-600 font-medium">
              Are you sure you want to delete category{" "}
              <strong className="font-extrabold text-slate-950">{deleteTarget.name}</strong>?
            </p>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-3">
              <button
                onClick={() => setDeleteTarget(null)}
                className="bg-slate-100 hover:bg-slate-200 text-slate-800 font-extrabold text-xs px-4 py-2 rounded-xl transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteCategory}
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
