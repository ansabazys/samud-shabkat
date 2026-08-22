import { api, type Category, type PaginatedResponse } from "../api";

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
    const res = await api.get<{
      success: boolean;
      data: PaginatedResponse<Category>;
    }>("/categories", { params });
    return res.data.data;
  },

  async getCategoryById(id: string): Promise<Category> {
    const res = await api.get<{ success: boolean; data: Category }>(
      `/categories/${id}`,
    );
    return res.data.data;
  },

  async createCategory(input: CreateCategoryInput): Promise<Category> {
    const res = await api.post<{ success: boolean; data: Category }>(
      "/categories",
      input,
    );
    return res.data.data;
  },

  async updateCategory(id: string, input: UpdateCategoryInput): Promise<Category> {
    const res = await api.put<{ success: boolean; data: Category }>(
      `/categories/${id}`,
      input,
    );
    return res.data.data;
  },

  async deleteCategory(id: string): Promise<void> {
    await api.delete(`/categories/${id}`);
  },
};
