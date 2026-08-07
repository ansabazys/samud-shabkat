import { orders, orderItems, users } from "@samud/database";
import { eq, and, ilike, count, sql, desc, asc } from "drizzle-orm";
import { getDb } from "../../../common/db.js";
import type {
  CreateOrderInput,
  OrderQueryParams,
  UpdateOrderStatusInput,
  UpdatePaymentStatusInput,
} from "../schemas/order.schema.js";

export class OrderRepository {
  private generateOrderNumber(): string {
    const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, "");
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    return `ORD-${dateStr}-${randomSuffix}`;
  }

  async findAll(params: OrderQueryParams) {
    const database = getDb();
    const {
      page,
      limit,
      search,
      orderStatus,
      paymentStatus,
      fulfillmentType,
      userId,
      sortBy,
      sortOrder,
    } = params;
    const offset = (page - 1) * limit;

    const conditions = [];

    if (userId) {
      conditions.push(eq(orders.userId, userId));
    }

    if (orderStatus) {
      conditions.push(eq(orders.orderStatus, orderStatus));
    }

    if (paymentStatus) {
      conditions.push(eq(orders.paymentStatus, paymentStatus));
    }

    if (fulfillmentType) {
      conditions.push(eq(orders.fulfillmentType, fulfillmentType));
    }

    if (search) {
      conditions.push(
        sql`(${ilike(orders.orderNumber, `%${search}%`)} OR ${ilike(
          orders.companyName,
          `%${search}%`,
        )} OR ${ilike(orders.contactPhone, `%${search}%`)})`,
      );
    }

    const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

    const [countResult] = await database
      .select({ total: count() })
      .from(orders)
      .where(whereClause);

    const total = Number(countResult?.total ?? 0);

    const orderColumn =
      sortBy === "orderNumber"
        ? orders.orderNumber
        : sortBy === "totalAmount"
          ? orders.totalAmount
          : orders.createdAt;

    const orderDirection =
      sortOrder === "asc" ? asc(orderColumn) : desc(orderColumn);

    const rawOrders = await database
      .select({
        order: orders,
        userEmail: users.email,
        firstName: users.firstName,
        lastName: users.lastName,
      })
      .from(orders)
      .innerJoin(users, eq(orders.userId, users.id))
      .where(whereClause)
      .orderBy(orderDirection)
      .limit(limit)
      .offset(offset);

    const orderIds = rawOrders.map((o) => o.order.id);
    let itemsMap: Record<string, (typeof orderItems.$inferSelect)[]> = {};

    if (orderIds.length > 0) {
      const items = await database
        .select()
        .from(orderItems)
        .where(sql`${orderItems.orderId} IN ${orderIds}`);

      itemsMap = items.reduce(
        (acc, item) => {
          if (!acc[item.orderId]) acc[item.orderId] = [];
          acc[item.orderId].push(item);
          return acc;
        },
        {} as Record<string, (typeof orderItems.$inferSelect)[]>,
      );
    }

    const data = rawOrders.map((item) => ({
      ...item.order,
      user: {
        id: item.order.userId,
        email: item.userEmail,
        fullName: `${item.firstName} ${item.lastName}`.trim(),
      },
      items: itemsMap[item.order.id] ?? [],
    }));

    return {
      data,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findById(id: string) {
    const database = getDb();
    const [result] = await database
      .select({
        order: orders,
        userEmail: users.email,
        firstName: users.firstName,
        lastName: users.lastName,
      })
      .from(orders)
      .innerJoin(users, eq(orders.userId, users.id))
      .where(eq(orders.id, id))
      .limit(1);

    if (!result) return null;

    const items = await database
      .select()
      .from(orderItems)
      .where(eq(orderItems.orderId, id));

    return {
      ...result.order,
      user: {
        id: result.order.userId,
        email: result.userEmail,
        fullName: `${result.firstName} ${result.lastName}`.trim(),
      },
      items,
    };
  }

  async createWithTransaction(
    tx: unknown,
    userId: string,
    data: CreateOrderInput,
  ) {
    const database = (tx as ReturnType<typeof getDb>) || getDb();
    const orderNumber = this.generateOrderNumber();

    const totalAmount = data.items
      .reduce((sum, item) => sum + item.unitPrice * item.quantity, 0)
      .toFixed(2);

    const [newOrder] = await database
      .insert(orders)
      .values({
        orderNumber,
        userId,
        orderStatus: "PENDING",
        paymentStatus: "PENDING",
        fulfillmentType: data.fulfillmentType ?? "HOME_DELIVERY",
        paymentMethod:
          data.paymentMethod ??
          (data.fulfillmentType === "STORE_PICKUP"
            ? "CASH_ON_PICKUP"
            : "CASH_ON_DELIVERY"),
        totalAmount,
        companyName: data.companyName ?? null,
        contactPhone: data.contactPhone,
        billingAddress: data.billingAddress ?? "Store Address",
        shippingAddress:
          data.shippingAddress ??
          (data.fulfillmentType === "STORE_PICKUP"
            ? "Store Pickup"
            : "Customer Address"),
        notes: data.notes ?? null,
      })
      .returning();

    const itemsToInsert = data.items.map((item) => ({
      orderId: newOrder.id,
      productId: item.productId ?? null,
      productName: item.productName,
      sku: item.sku,
      unitPrice: item.unitPrice.toFixed(2),
      quantity: item.quantity,
      totalPrice: (item.unitPrice * item.quantity).toFixed(2),
      specifications: item.specifications ?? {},
    }));

    const insertedItems = await database
      .insert(orderItems)
      .values(itemsToInsert)
      .returning();

    return {
      ...newOrder,
      items: insertedItems,
    };
  }

  async updateOrderStatusWithTx(
    tx: unknown,
    id: string,
    data: UpdateOrderStatusInput,
  ) {
    const database = (tx as ReturnType<typeof getDb>) || getDb();
    const [updated] = await database
      .update(orders)
      .set({
        orderStatus: data.orderStatus,
        updatedAt: sql`NOW()`,
      })
      .where(eq(orders.id, id))
      .returning();

    return updated ?? null;
  }

  async updatePaymentStatus(id: string, data: UpdatePaymentStatusInput) {
    const [updated] = await getDb()
      .update(orders)
      .set({
        paymentStatus: data.paymentStatus,
        updatedAt: sql`NOW()`,
      })
      .where(eq(orders.id, id))
      .returning();

    return updated ?? null;
  }

  async collectCash(id: string, paymentMethod = "CASH", notes?: string) {
    const database = getDb();
    const updateData: Record<string, unknown> = {
      paymentStatus: "PAID",
      paymentMethod,
      updatedAt: sql`NOW()`,
    };

    if (notes) {
      updateData.notes = sql`COALESCE(${orders.notes}, '') || ${` [Cash Collected: ${notes}]`}`;
    }

    const [updated] = await database
      .update(orders)
      .set(updateData)
      .where(eq(orders.id, id))
      .returning();

    return updated ?? null;
  }
}

export const orderRepository = new OrderRepository();
