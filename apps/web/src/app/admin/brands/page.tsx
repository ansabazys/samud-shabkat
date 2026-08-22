"use client";

import { useEffect, useState } from "react";
import {
  Tag,
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
  brandsApi,
  type CreateBrandInput,
  type UpdateBrandInput,
  type BrandQueryParams,
} from "@/lib/api/brands-api";
import { mediaApi } from "@/lib/api/media-api";
import type { Brand } from "@/lib/api";

export default function AdminBrandsPage() {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filter States
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBrand, setEditingBrand] = useState<Brand | null>(null);
  const [formName, setFormName] = useState("");
  const [formSlug, setFormSlug] = useState("");
  const [formDesc, setFormDesc] = useState("");
  const [formLogoUrl, setFormLogoUrl] = useState("");
  const [uploadingLogo, setUploadingLogo] = useState(false);

  const [submitting, setSubmitting] = useState(false);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);
  const [modalError, setModalError] = useState<string | null>(null);

  // Delete Dialog State
  const [deleteTarget, setDeleteTarget] = useState<Brand | null>(null);
  const [deleting, setDeleting] = useState(false);

  const fetchBrands = async () => {
    try {
      setLoading(true);
      setError(null);

      const params: BrandQueryParams = {
        page,
        limit: 25,
        search: search || undefined,
      };

      const res = await brandsApi.getBrands(params);
      setBrands(res.data);
      setTotal(res.total);
    } catch (err: any) {
      console.error("Failed to load brands:", err);
      setError(
        err?.response?.data?.message || err?.message || "Failed to load brand list.",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBrands();
  }, [page]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    fetchBrands();
  };

  const handleNameChange = (val: string) => {
    setFormName(val);
    if (!editingBrand) {
      const generatedSlug = val
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)+/g, "");
      setFormSlug(generatedSlug);
    }
  };

  const handleOpenCreateModal = () => {
    setEditingBrand(null);
    setFormName("");
    setFormSlug("");
    setFormDesc("");
    setFormLogoUrl("");
    setModalError(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (b: Brand) => {
    setEditingBrand(b);
    setFormName(b.name);
    setFormSlug(b.slug);
    setFormDesc(b.description || "");
    setFormLogoUrl(b.logoUrl || "");
    setModalError(null);
    setIsModalOpen(true);
  };

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploadingLogo(true);
      setModalError(null);
      const uploaded = await mediaApi.uploadSingle(file, "brands");
      setFormLogoUrl(uploaded.url);
    } catch (err: any) {
      console.error("Logo upload failed:", err);
      setModalError("Failed to upload brand logo to Cloudflare R2.");
    } finally {
      setUploadingLogo(false);
    }
  };

  const handleSaveBrand = async (e: React.FormEvent) => {
    e.preventDefault();
    setModalError(null);
    setActionSuccess(null);

    if (!formName) {
      setModalError("Brand name is required.");
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

      if (editingBrand) {
        // Update brand
        const updatePayload: UpdateBrandInput = {
          name: formName,
          slug: slugVal,
          description: formDesc || undefined,
          logoUrl: formLogoUrl || undefined,
        };

        const updated = await brandsApi.updateBrand(editingBrand.id, updatePayload);
        setBrands((prev) =>
          prev.map((b) => (b.id === editingBrand.id ? updated : b)),
        );
        setActionSuccess(`Brand "${updated.name}" updated successfully.`);
      } else {
        // Create brand
        const createPayload: CreateBrandInput = {
          name: formName,
          slug: slugVal,
          description: formDesc || undefined,
          logoUrl: formLogoUrl || undefined,
        };

        const created = await brandsApi.createBrand(createPayload);
        setBrands((prev) => [created, ...prev]);
        setTotal((prev) => prev + 1);
        setActionSuccess(`Brand "${created.name}" created successfully.`);
      }

      setIsModalOpen(false);
    } catch (err: any) {
      console.error("Failed to save brand:", err);
      setModalError(
        err?.response?.data?.message || err?.message || "Failed to save brand record.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteBrand = async () => {
    if (!deleteTarget) return;

    try {
      setDeleting(true);
      setActionSuccess(null);
      await brandsApi.deleteBrand(deleteTarget.id);
      setBrands((prev) => prev.filter((b) => b.id !== deleteTarget.id));
      setTotal((prev) => prev - 1);
      setActionSuccess(`Brand "${deleteTarget.name}" deleted.`);
      setDeleteTarget(null);
    } catch (err: any) {
      alert(err?.response?.data?.message || "Failed to delete brand.");
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
            <Tag className="w-7 h-7 text-emerald-700" />
            Brand Management
          </h1>
          <p className="text-xs text-slate-500 font-medium mt-1">
            Manage manufacturer brands, logos, slugs, and Cloudflare R2 media assets.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={fetchBrands}
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
            <span>Add Brand</span>
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
              placeholder="Search brand by Name or Description..."
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

      {/* Brands Data Table */}
      <div className="bg-white border border-slate-200/90 rounded-2xl overflow-hidden shadow-2xs">
        {loading ? (
          <div className="py-20 text-center flex flex-col items-center justify-center space-y-3">
            <Loader2 className="w-8 h-8 text-emerald-600 animate-spin" />
            <span className="text-xs text-slate-500 font-medium">Loading brands database...</span>
          </div>
        ) : brands.length === 0 ? (
          <div className="py-16 text-center text-xs text-slate-500 font-medium">
            No brands found.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/80 text-slate-500 font-extrabold uppercase text-[10px] tracking-wider">
                  <th className="py-3.5 px-4">Brand</th>
                  <th className="py-3.5 px-4">URL Slug</th>
                  <th className="py-3.5 px-4">Description</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-800 font-medium">
                {brands.map((b) => (
                  <tr key={b.id} className="hover:bg-slate-50 transition">
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-slate-100 border border-slate-200 overflow-hidden shrink-0 flex items-center justify-center relative">
                          {b.logoUrl ? (
                            <img
                              src={b.logoUrl}
                              alt={b.name}
                              className="w-full h-full object-contain p-1"
                            />
                          ) : (
                            <Tag className="w-5 h-5 text-slate-400" />
                          )}
                        </div>
                        <span className="font-extrabold text-slate-950 block">
                          {b.name}
                        </span>
                      </div>
                    </td>

                    <td className="py-3.5 px-4 font-mono font-bold text-slate-700">
                      /{b.slug}
                    </td>

                    <td className="py-3.5 px-4 text-slate-500 font-normal">
                      {b.description || "No description provided."}
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleOpenEditModal(b)}
                          className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition cursor-pointer"
                          title="Edit Brand"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setDeleteTarget(b)}
                          className="p-2 rounded-xl bg-rose-50 text-rose-700 border border-rose-200 hover:bg-rose-100 transition cursor-pointer"
                          title="Delete Brand"
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
        {brands.length > 0 && (
          <div className="p-4 bg-slate-50/80 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-slate-700">
            <span>
              Showing {brands.length} of {total} brands (Page {page} of {Math.ceil(total / 25) || 1})
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

      {/* Create / Edit Brand Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-white border border-slate-200/90 rounded-2xl p-6 sm:p-8 space-y-6 shadow-2xl text-slate-900">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div>
                <span className="text-[10px] font-black uppercase tracking-widest text-emerald-800 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-md">
                  {editingBrand ? "Edit Brand" : "New Brand Entry"}
                </span>
                <h2 className="text-lg font-black text-slate-950 uppercase tracking-tight mt-1">
                  {editingBrand ? editingBrand.name : "Create Manufacturer Brand"}
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
            <form onSubmit={handleSaveBrand} className="space-y-4 text-xs font-bold">
              <div>
                <label className="text-slate-700 block mb-1">Brand Name *</label>
                <input
                  type="text"
                  required
                  placeholder="Dell / Cisco / HP"
                  value={formName}
                  onChange={(e) => handleNameChange(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold focus:outline-none focus:border-emerald-600"
                />
              </div>

              <div>
                <label className="text-slate-700 block mb-1">URL Slug</label>
                <input
                  type="text"
                  placeholder="dell"
                  value={formSlug}
                  onChange={(e) => setFormSlug(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold focus:outline-none focus:border-emerald-600 font-mono"
                />
              </div>

              <div>
                <label className="text-slate-700 block mb-1">Description</label>
                <textarea
                  rows={3}
                  placeholder="Global enterprise technology manufacturer..."
                  value={formDesc}
                  onChange={(e) => setFormDesc(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold focus:outline-none focus:border-emerald-600"
                />
              </div>

              {/* R2 Logo Upload */}
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-3">
                <label className="text-slate-700 block font-extrabold">
                  Brand Logo Image (Cloudflare R2)
                </label>

                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-xl bg-white border border-slate-200 flex items-center justify-center overflow-hidden shrink-0">
                    {formLogoUrl ? (
                      <img src={formLogoUrl} alt="Preview" className="w-full h-full object-contain p-1" />
                    ) : (
                      <Tag className="w-5 h-5 text-slate-400" />
                    )}
                  </div>

                  <div className="flex-1">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleLogoUpload}
                      disabled={uploadingLogo}
                      className="hidden"
                      id="r2-brand-file"
                    />
                    <label
                      htmlFor="r2-brand-file"
                      className="bg-white hover:bg-slate-100 text-slate-800 border border-slate-300 font-extrabold text-xs px-3.5 py-2 rounded-xl transition cursor-pointer inline-flex items-center gap-2"
                    >
                      {uploadingLogo ? (
                        <Loader2 className="w-4 h-4 animate-spin text-emerald-600" />
                      ) : (
                        <UploadCloud className="w-4 h-4 text-emerald-600" />
                      )}
                      <span>Upload Logo</span>
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
                  <span>{editingBrand ? "Save Brand" : "Create Brand"}</span>
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
              Delete Brand?
            </h3>
            <p className="text-xs text-slate-600 font-medium">
              Are you sure you want to delete brand{" "}
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
                onClick={handleDeleteBrand}
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
