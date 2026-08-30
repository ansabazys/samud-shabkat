import { api, type Product, type Category, type Brand, type PaginatedResponse } from "../api";
import { clientCache } from "../cache-client";

export interface ProductQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  categoryId?: string;
  brandId?: string;
  isActive?: boolean;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

export interface CreateProductInput {
  name: string;
  sku: string;
  price: number;
  categoryId: string;
  brandId: string;
  shortDescription?: string;
  description?: string;
  specifications?: Record<string, unknown>;
  isActive?: boolean;
  imageUrl?: string;
}

export interface UpdateProductInput {
  name?: string;
  sku?: string;
  price?: number;
  categoryId?: string;
  brandId?: string;
  shortDescription?: string;
  description?: string;
  specifications?: Record<string, unknown>;
  isActive?: boolean;
}

export const productsApi = {
  async getProducts(params?: ProductQueryParams): Promise<PaginatedResponse<Product>> {
    const res = await api.get<any>("/products", { params });
    const payload = res.data?.data ?? res.data;
    if (Array.isArray(payload)) {
      return {
        data: payload,
        total: payload.length,
        page: params?.page || 1,
        limit: params?.limit || 20,
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

  async getProductById(id: string): Promise<Product> {
    const res = await api.get<any>(`/products/${id}`);
    return res.data?.data ?? res.data;
  },

  async createProduct(input: CreateProductInput): Promise<Product> {
    const res = await api.post<any>("/products", input);
    clientCache.invalidate();
    return res.data?.data ?? res.data;
  },

  async updateProduct(id: string, input: UpdateProductInput): Promise<Product> {
    const res = await api.put<any>(`/products/${id}`, input);
    clientCache.invalidate();
    return res.data?.data ?? res.data;
  },

  async deleteProduct(id: string): Promise<void> {
    await api.delete(`/products/${id}`);
    clientCache.invalidate();
  },

  async addImage(productId: string, imageData: { url: string; storageKey?: string; isPrimary?: boolean; altText?: string }) {
    const res = await api.post<any>(`/products/${productId}/images`, {
      url: imageData.url,
      storageKey: imageData.storageKey || `img-${Date.now()}`,
      isPrimary: imageData.isPrimary ?? true,
      altText: imageData.altText || "Product Image",
      sortOrder: 0,
    });
    clientCache.invalidate();
    return res.data?.data ?? res.data;
  },

  async getCategories(): Promise<Category[]> {
    const res = await api.get<any>("/categories");
    const payload = res.data?.data ?? res.data;
    return Array.isArray(payload) ? payload : Array.isArray(payload?.data) ? payload.data : [];
  },

  async getBrands(): Promise<Brand[]> {
    const res = await api.get<any>("/brands");
    const payload = res.data?.data ?? res.data;
    return Array.isArray(payload) ? payload : Array.isArray(payload?.data) ? payload.data : [];
  },
};
