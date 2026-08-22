import { api, type Brand, type PaginatedResponse } from "../api";

export interface BrandQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  isActive?: boolean;
}

export interface CreateBrandInput {
  name: string;
  slug?: string;
  description?: string;
  logoUrl?: string;
  isActive?: boolean;
}

export interface UpdateBrandInput {
  name?: string;
  slug?: string;
  description?: string;
  logoUrl?: string;
  isActive?: boolean;
}

export const brandsApi = {
  async getBrands(params?: BrandQueryParams): Promise<PaginatedResponse<Brand>> {
    const res = await api.get<{
      success: boolean;
      data: PaginatedResponse<Brand>;
    }>("/brands", { params });
    return res.data.data;
  },

  async getBrandById(id: string): Promise<Brand> {
    const res = await api.get<{ success: boolean; data: Brand }>(
      `/brands/${id}`,
    );
    return res.data.data;
  },

  async createBrand(input: CreateBrandInput): Promise<Brand> {
    const res = await api.post<{ success: boolean; data: Brand }>(
      "/brands",
      input,
    );
    return res.data.data;
  },

  async updateBrand(id: string, input: UpdateBrandInput): Promise<Brand> {
    const res = await api.put<{ success: boolean; data: Brand }>(
      `/brands/${id}`,
      input,
    );
    return res.data.data;
  },

  async deleteBrand(id: string): Promise<void> {
    await api.delete(`/brands/${id}`);
  },
};
