import { api } from "../api";

export interface CartItem {
  id: string;
  cartId: string;
  productId: string;
  productNameSnapshot: string;
  skuSnapshot: string;
  unitPriceSnapshot: string;
  quantity: number;
  discount: string;
  subtotal: string;
  specificationsSnapshot: Record<string, unknown>;
  imageUrl: string | null;
  currentProductPrice: string;
  isProductActive: boolean;
  availableStock: number;
  stockStatus:
    "IN_STOCK" | "LOW_STOCK" | "OUT_OF_STOCK" | "PRE_ORDER" | "DISCONTINUED";
  isStockValid: boolean;
  validationMessage: string | null;
}

export interface CartResponse {
  cartId: string;
  userId: string;
  status: string;
  items: CartItem[];
  totalItems: number;
  subtotal: string;
  estimatedTotal: string;
  updatedAt: string;
  isCartValid: boolean;
}

export const cartApi = {
  async getCart(): Promise<CartResponse> {
    const res = await api.get<{ success: boolean; data: CartResponse }>(
      "/cart",
    );
    return res.data.data;
  },

  async addItem(productId: string, quantity = 1): Promise<CartResponse> {
    const res = await api.post<{ success: boolean; data: CartResponse }>(
      "/cart/items",
      {
        productId,
        quantity,
      },
    );
    return res.data.data;
  },

  async updateItem(itemId: string, quantity: number): Promise<CartResponse> {
    const res = await api.patch<{ success: boolean; data: CartResponse }>(
      `/cart/items/${itemId}`,
      {
        quantity,
      },
    );
    return res.data.data;
  },

  async removeItem(itemId: string): Promise<CartResponse> {
    const res = await api.delete<{ success: boolean; data: CartResponse }>(
      `/cart/items/${itemId}`,
    );
    return res.data.data;
  },

  async clearCart(): Promise<CartResponse> {
    const res = await api.delete<{ success: boolean; data: CartResponse }>(
      "/cart",
    );
    return res.data.data;
  },

  async validateCart(): Promise<{
    valid: boolean;
    message: string;
    data?: unknown;
  }> {
    const res = await api.post("/cart/validate");
    return res.data;
  },
};
