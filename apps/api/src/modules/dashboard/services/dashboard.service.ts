import { orders, products, users } from "@samud/database";
import { eq, count, sql, isNull, desc } from "drizzle-orm";
import { getDb } from "../../../common/db.js";

export class DashboardService {
  async getStats() {
    const database = getDb();

    const [ordersCountResult] = await database
      .select({ total: count() })
      .from(orders);

    const [pendingOrdersResult] = await database
      .select({ total: count() })
      .from(orders)
      .where(eq(orders.orderStatus, "PENDING"));

    const [productsCountResult] = await database
      .select({ total: count() })
      .from(products)
      .where(isNull(products.deletedAt));

    const [usersCountResult] = await database
      .select({ total: count() })
      .from(users);

    const [revenueResult] = await database
      .select({
        totalRevenue: sql<string>`COALESCE(SUM(${orders.totalAmount}), '0.00')`,
      })
      .from(orders)
      .where(eq(orders.paymentStatus, "PAID"));

    const recentOrders = await database
      .select({
        id: orders.id,
        orderNumber: orders.orderNumber,
        totalAmount: orders.totalAmount,
        orderStatus: orders.orderStatus,
        paymentStatus: orders.paymentStatus,
        createdAt: orders.createdAt,
      })
      .from(orders)
      .orderBy(desc(orders.createdAt))
      .limit(5);

    return {
      totalOrders: Number(ordersCountResult?.total ?? 0),
      pendingOrders: Number(pendingOrdersResult?.total ?? 0),
      totalProducts: Number(productsCountResult?.total ?? 0),
      totalCustomers: Number(usersCountResult?.total ?? 0),
      totalRevenue: revenueResult?.totalRevenue ?? "0.00",
      recentOrders,
    };
  }
}

export const dashboardService = new DashboardService();
