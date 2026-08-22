import { api } from "../api";

export interface DashboardStats {
  totalOrders: number;
  pendingOrders: number;
  totalProducts: number;
  totalCustomers: number;
  totalRevenue: string;
  recentOrders: Array<{
    id: string;
    orderNumber: string;
    totalAmount: string;
    orderStatus: string;
    paymentStatus: string;
    createdAt: string;
  }>;
}

export const dashboardApi = {
  async getStats(): Promise<DashboardStats> {
    const res = await api.get<{ success: boolean; data: DashboardStats }>(
      "/dashboard/stats",
    );
    return res.data.data;
  },
};
