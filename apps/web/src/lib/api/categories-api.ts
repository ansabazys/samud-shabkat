import { api, type Category, type PaginatedResponse } from "../api";
import { clientCache } from "../cache-client";

export interface CategoryQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  isActive?: boolean;
}

export interface CreateCategoryInput {
  name: string;
  slug?: string;
  description?: string;
  imageUrl?: string;
  sortOrder?: number;
  isActive?: boolean;
}

export interface UpdateCategoryInput {
  name?: string;
  slug?: string;
  description?: string;
  imageUrl?: string;
  sortOrder?: number;
  isActive?: boolean;
}

export const categoriesApi = {
  async getCategories(params?: CategoryQueryParams): Promise<PaginatedResponse<Category>> {
    const res = await api.get<any>("/categories", { params });
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

  async getCategoryById(id: string): Promise<Category> {
    const res = await api.get<any>(`/categories/${id}`);
    return res.data?.data ?? res.data;
  },

  async createCategory(input: CreateCategoryInput): Promise<Category> {
    const res = await api.post<any>("/categories", input);
    clientCache.invalidate();
    return res.data?.data ?? res.data;
  },

  async updateCategory(id: string, input: UpdateCategoryInput): Promise<Category> {
    const res = await api.put<any>(`/categories/${id}`, input);
    clientCache.invalidate();
    return res.data?.data ?? res.data;
  },

  async deleteCategory(id: string): Promise<void> {
    await api.delete(`/categories/${id}`);
    clientCache.invalidate();
  },
};
