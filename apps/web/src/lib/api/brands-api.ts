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
    const res = await api.get<any>("/brands", { params });
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

  async getBrandById(id: string): Promise<Brand> {
    const res = await api.get<any>(`/brands/${id}`);
    return res.data?.data ?? res.data;
  },

  async createBrand(input: CreateBrandInput): Promise<Brand> {
    const res = await api.post<any>("/brands", input);
    return res.data?.data ?? res.data;
  },

  async updateBrand(id: string, input: UpdateBrandInput): Promise<Brand> {
    const res = await api.put<any>(`/brands/${id}`, input);
    return res.data?.data ?? res.data;
  },

  async deleteBrand(id: string): Promise<void> {
    await api.delete(`/brands/${id}`);
  },
};
