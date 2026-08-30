import { api } from "../api";

export interface InventoryDetails {
  productId: string;
  currentStock: number;
  reservedStock: number;
  availableStock: number;
  incomingStock: number;
  minStock: number;
  maxStock: number;
  reorderLevel: number;
  safetyStock: number;
  stockStatus:
    "IN_STOCK" | "LOW_STOCK" | "OUT_OF_STOCK" | "PRE_ORDER" | "DISCONTINUED";
  isAvailable: boolean;
}

export interface AdjustInventoryPayload {
  productId: string;
  adjustmentType: "ADD" | "SUBTRACT" | "SET";
  quantity: number;
  reference?: string;
  notes?: string;
}

export interface InventoryTransactionRecord {
  id: string;
  productId: string;
  orderId?: string | null;
  transactionType: string;
  quantityDelta: number;
  reservedDelta: number;
  stockAfter: number;
  reservedAfter: number;
  reference?: string | null;
  notes?: string | null;
  createdAt: string;
}

export interface PaginatedLowStockResponse {
  data: Array<{
    id: string;
    productId: string;
    productName: string;
    productSku: string;
    currentStock: number;
    reservedStock: number;
    availableStock: number;
    reorderLevel: number;
  }>;
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export const inventoryApi = {
  async getProductInventory(productId: string): Promise<InventoryDetails> {
    const res = await api.get<any>(`/inventory/products/${productId}`);
    return res.data?.data ?? res.data;
  },

  async adjustStock(input: AdjustInventoryPayload) {
    const res = await api.post<any>("/inventory/adjust", input);
    return res.data?.data ?? res.data;
  },

  async getLowStock(params?: {
    page?: number;
    limit?: number;
    search?: string;
  }): Promise<PaginatedLowStockResponse> {
    const res = await api.get<any>("/inventory/low-stock", { params });
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

  async getTransactions(params?: {
    page?: number;
    limit?: number;
    productId?: string;
  }): Promise<{ data: InventoryTransactionRecord[]; total: number }> {
    const res = await api.get<any>("/inventory/transactions", { params });
    const payload = res.data?.data ?? res.data;
    if (Array.isArray(payload)) {
      return {
        data: payload,
        total: payload.length,
      };
    }
    return {
      data: Array.isArray(payload?.data) ? payload.data : [],
      total: payload?.total ?? (Array.isArray(payload?.data) ? payload.data.length : 0),
    };
  },
};
