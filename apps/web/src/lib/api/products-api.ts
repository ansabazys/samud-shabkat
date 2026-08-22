import { api, type Product, type Category, type Brand, type PaginatedResponse } from "../api";

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
    const res = await api.get<{
      success: boolean;
      data: PaginatedResponse<Product>;
    }>("/products", { params });
    return res.data.data;
  },

  async getProductById(id: string): Promise<Product> {
    const res = await api.get<{ success: boolean; data: Product }>(
      `/products/${id}`,
    );
    return res.data.data;
  },

  async createProduct(input: CreateProductInput): Promise<Product> {
    const res = await api.post<{ success: boolean; data: Product }>(
      "/products",
      input,
    );
    return res.data.data;
  },

  async updateProduct(id: string, input: UpdateProductInput): Promise<Product> {
    const res = await api.put<{ success: boolean; data: Product }>(
      `/products/${id}`,
      input,
    );
    return res.data.data;
  },

  async deleteProduct(id: string): Promise<void> {
    await api.delete(`/products/${id}`);
  },

  async addImage(productId: string, imageData: { url: string; isPrimary?: boolean; altText?: string }) {
    const res = await api.post<{ success: boolean; data: unknown }>(
      `/products/${productId}/images`,
      imageData,
    );
    return res.data.data;
  },

  async getCategories(): Promise<Category[]> {
    const res = await api.get<{ success: boolean; data: { data: Category[] } | Category[] }>(
      "/categories",
    );
    const data = res.data.data;
    return Array.isArray(data) ? data : data.data || [];
  },

  async getBrands(): Promise<Brand[]> {
    const res = await api.get<{ success: boolean; data: { data: Brand[] } | Brand[] }>(
      "/brands",
    );
    const data = res.data.data;
    return Array.isArray(data) ? data : data.data || [];
  },
};
