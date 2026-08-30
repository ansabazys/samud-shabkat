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

let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value?: unknown) => void;
  reject: (reason?: unknown) => void;
}> = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

function handleAuthFailure() {
  if (typeof window === "undefined") return;
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
  localStorage.removeItem("samud-auth-storage");

  const currentPath = window.location.pathname;
  if (currentPath.startsWith("/admin") && currentPath !== "/admin/login") {
    window.location.href = `/admin/login?redirect=${encodeURIComponent(currentPath)}&error=session_expired`;
  }
}

// Add response interceptor to handle expired JWT tokens with silent refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (
      error.response?.status === 401 &&
      originalRequest &&
      !originalRequest._retry &&
      typeof window !== "undefined"
    ) {
      const isAuthEndpoint =
        originalRequest.url?.includes("/auth/login") ||
        originalRequest.url?.includes("/auth/register") ||
        originalRequest.url?.includes("/auth/refresh");

      if (isAuthEndpoint) {
        return Promise.reject(error);
      }

      const refreshToken = localStorage.getItem("refreshToken");
      if (
        !refreshToken ||
        refreshToken.startsWith("demo-") ||
        refreshToken === "undefined"
      ) {
        handleAuthFailure();
        return Promise.reject(error);
      }

      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return api(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const response = await axios.post(
          `${API_BASE_URL}/auth/refresh`,
          { refreshToken },
          { headers: { "Content-Type": "application/json" } }
        );

        const body = response.data?.data ?? response.data;
        const newAccessToken = body.accessToken;
        const newRefreshToken = body.refreshToken;

        if (newAccessToken) {
          localStorage.setItem("accessToken", newAccessToken);
          if (newRefreshToken) {
            localStorage.setItem("refreshToken", newRefreshToken);
          }
          api.defaults.headers.common.Authorization = `Bearer ${newAccessToken}`;
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

          processQueue(null, newAccessToken);
          return api(originalRequest);
        } else {
          throw new Error("Invalid token refresh payload");
        }
      } catch (refreshErr) {
        processQueue(refreshErr, null);
        handleAuthFailure();
        return Promise.reject(refreshErr);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

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

import { clientCache } from "./cache-client";

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

  const cacheKey = `products:${query.toString()}`;

  return clientCache.dedupeAndCache(
    cacheKey,
    async () => {
      const res = await api.get<any>(`/products?${query.toString()}`);
      const payload = res.data?.data ?? res.data;
      if (Array.isArray(payload)) {
        return {
          data: payload,
          total: payload.length,
          page: params.page || 1,
          limit: params.limit || 20,
          totalPages: 1,
        };
      }
      return {
        data: Array.isArray(payload?.data) ? payload.data : [],
        total: payload?.total ?? (Array.isArray(payload?.data) ? payload.data.length : 0),
        page: payload?.page ?? 1,
        limit: payload?.limit ?? 20,
        totalPages: payload?.totalPages ?? 1,
      };
    },
    30_000, // 30s client cache
  );
}

export async function fetchProductBySlug(
  slug: string
): Promise<Product | null> {
  const cacheKey = `product:slug:${slug}`;
  return clientCache.dedupeAndCache(
    cacheKey,
    async () => {
      try {
        const res = await api.get<any>(`/products/${slug}`);
        return res.data?.data ?? res.data ?? null;
      } catch {
        return null;
      }
    },
    60_000, // 60s client cache
  );
}

export async function fetchBrands(): Promise<Brand[]> {
  return clientCache.dedupeAndCache(
    "brands:list:50",
    async () => {
      try {
        const res = await api.get<any>("/brands?limit=50");
        const payload = res.data?.data ?? res.data;
        return Array.isArray(payload) ? payload : Array.isArray(payload?.data) ? payload.data : [];
      } catch {
        return [];
      }
    },
    300_000, // 5 min client cache
  );
}

export async function fetchCategories(): Promise<Category[]> {
  return clientCache.dedupeAndCache(
    "categories:list:50",
    async () => {
      try {
        const res = await api.get<any>("/categories?limit=50");
        const payload = res.data?.data ?? res.data;
        return Array.isArray(payload) ? payload : Array.isArray(payload?.data) ? payload.data : [];
      } catch {
        return [];
      }
    },
    300_000, // 5 min client cache
  );
}

