import { api } from "../api";

export interface OrderItem {
  id: string;
  orderId: string;
  productId?: string;
  productName: string;
  sku: string;
  unitPrice: string;
  quantity: number;
  totalPrice: string;
}

export interface UserSummary {
  id: string;
  email: string;
  fullName: string;
}

export interface OrderRecord {
  id: string;
  orderNumber: string;
  userId: string;
  orderStatus:
    | "PENDING"
    | "CONFIRMED"
    | "PROCESSING"
    | "READY_FOR_COLLECTION"
    | "READY_FOR_PICKUP"
    | "OUT_FOR_DELIVERY"
    | "DELIVERED"
    | "COMPLETED"
    | "CANCELLED";
  paymentStatus: "PENDING" | "PAID" | "FAILED" | "REFUNDED";
  fulfillmentType: "STORE_PICKUP" | "HOME_DELIVERY";
  paymentMethod: "CASH_ON_DELIVERY" | "CASH_ON_PICKUP" | "CASH";
  totalAmount: string;
  companyName?: string | null;
  contactPhone: string;
  billingAddress: string;
  shippingAddress: string;
  notes?: string | null;
  createdAt: string;
  updatedAt: string;
  user?: UserSummary;
  items: OrderItem[];
}

export interface PaginatedOrdersResponse {
  data: OrderRecord[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface OrderQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  orderStatus?: string;
  paymentStatus?: string;
  fulfillmentType?: string;
}

export const ordersApi = {
  async getOrders(params?: OrderQueryParams): Promise<PaginatedOrdersResponse> {
    const res = await api.get<{
      success: boolean;
      data: PaginatedOrdersResponse;
    }>("/orders", { params });
    return res.data.data;
  },

  async getOrderById(id: string): Promise<OrderRecord> {
    const res = await api.get<{ success: boolean; data: OrderRecord }>(
      `/orders/${id}`,
    );
    return res.data.data;
  },

  async updateOrderStatus(
    id: string,
    orderStatus: string,
  ): Promise<OrderRecord> {
    const res = await api.patch<{ success: boolean; data: OrderRecord }>(
      `/orders/${id}/status`,
      { orderStatus },
    );
    return res.data.data;
  },

  async updatePaymentStatus(
    id: string,
    paymentStatus: string,
  ): Promise<OrderRecord> {
    const res = await api.patch<{ success: boolean; data: OrderRecord }>(
      `/orders/${id}/payment-status`,
      { paymentStatus },
    );
    return res.data.data;
  },

  async collectCash(
    id: string,
    paymentMethod = "CASH",
    notes?: string,
  ): Promise<OrderRecord> {
    const res = await api.post<{ success: boolean; data: OrderRecord }>(
      `/orders/${id}/collect-cash`,
      { paymentMethod, notes },
    );
    return res.data.data;
  },
};
