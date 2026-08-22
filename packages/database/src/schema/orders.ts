import {
  pgTable,
  uuid,
  varchar,
  text,
  numeric,
  integer,
  timestamp,
  jsonb,
  index,
} from "drizzle-orm/pg-core";
import { users } from "./auth.js";
import { products } from "./catalog.js";

export const orders = pgTable(
  "orders",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    orderNumber: varchar("order_number", { length: 50 }).notNull().unique(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "restrict" }),
    orderStatus: varchar("order_status", { length: 50 })
      .default("PENDING")
      .notNull(),
    paymentStatus: varchar("payment_status", { length: 50 })
      .default("PENDING")
      .notNull(),
    fulfillmentType: varchar("fulfillment_type", { length: 50 })
      .default("STORE_PICKUP")
      .notNull(),
    paymentMethod: varchar("payment_method", { length: 50 })
      .default("CASH_ON_PICKUP")
      .notNull(),
    totalAmount: numeric("total_amount", { precision: 12, scale: 2 }).notNull(),
    companyName: varchar("company_name", { length: 255 }),
    contactPhone: varchar("contact_phone", { length: 30 }),
    billingAddress: text("billing_address").default("Store Address").notNull(),
    shippingAddress: text("shipping_address").default("Store Pickup").notNull(),
    notes: text("notes"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => ({
    orderNumberIdx: index("idx_orders_order_number").on(table.orderNumber),
    userIdx: index("idx_orders_user_id").on(table.userId),
    statusIdx: index("idx_orders_status").on(table.orderStatus),
  }),
);

export const orderItems = pgTable(
  "order_items",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    orderId: uuid("order_id")
      .notNull()
      .references(() => orders.id, { onDelete: "cascade" }),
    productId: uuid("product_id").references(() => products.id, {
      onDelete: "set null",
    }),
    productName: varchar("product_name", { length: 255 }).notNull(),
    sku: varchar("sku", { length: 100 }).notNull(),
    unitPrice: numeric("unit_price", { precision: 12, scale: 2 }).notNull(),
    quantity: integer("quantity").notNull().default(1),
    totalPrice: numeric("total_price", { precision: 12, scale: 2 }).notNull(),
    specifications: jsonb("specifications").default({}).notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => ({
    orderIdx: index("idx_order_items_order_id").on(table.orderId),
    productIdx: index("idx_order_items_product_id").on(table.productId),
  }),
);
