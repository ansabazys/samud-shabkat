import axios from "axios";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api/v1";

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add request interceptor to attach JWT token if available
api.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("accessToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

export interface ProductImage {
  id: string;
  url: string;
  altText?: string;
  isPrimary?: boolean;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  imageUrl?: string;
}

export interface Brand {
  id: string;
  name: string;
  slug: string;
  logoUrl?: string;
  description?: string;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  sku: string;
  shortDescription?: string;
  description?: string;
  price: string | number;
  categoryId: string;
  brandId: string;
  specifications?: Record<string, unknown>;
  isActive: boolean;
  category?: Category;
  brand?: Brand;
  images?: ProductImage[];
  currentStock?: number;
  reservedStock?: number;
  availableStock?: number;
  stockStatus?:
    "IN_STOCK" | "LOW_STOCK" | "OUT_OF_STOCK" | "PRE_ORDER" | "DISCONTINUED";
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// ── Fetch Helpers ────────────────────────────────────────────────────────────

export interface FetchProductsParams {
  page?: number;
  limit?: number;
  category?: string;
  brand?: string;
  search?: string;
  sort?: "newest" | "price_asc" | "price_desc" | "bestseller";
  isActive?: boolean;
}

export async function fetchProducts(
  params: FetchProductsParams = {}
): Promise<PaginatedResponse<Product>> {
  const query = new URLSearchParams();
  if (params.page) query.set("page", String(params.page));
  if (params.limit) query.set("limit", String(params.limit));
  if (params.category) query.set("category", params.category);
  if (params.brand) query.set("brand", params.brand);
  if (params.search) query.set("search", params.search);
  if (params.sort) query.set("sort", params.sort);
  if (params.isActive !== undefined) query.set("isActive", String(params.isActive));

  const res = await api.get<PaginatedResponse<Product>>(
    `/products?${query.toString()}`
  );
  return res.data;
}

export async function fetchProductBySlug(
  slug: string
): Promise<Product | null> {
  try {
    const res = await api.get<Product>(`/products/${slug}`);
    return res.data;
  } catch {
    return null;
  }
}

export async function fetchBrands(): Promise<Brand[]> {
  try {
    const res = await api.get<PaginatedResponse<Brand>>("/brands?limit=50");
    return res.data.data ?? [];
  } catch {
    return [];
  }
}

export async function fetchCategories(): Promise<Category[]> {
  try {
    const res = await api.get<PaginatedResponse<Category>>(
      "/categories?limit=50"
    );
    return res.data.data ?? [];
  } catch {
    return [];
  }
}

