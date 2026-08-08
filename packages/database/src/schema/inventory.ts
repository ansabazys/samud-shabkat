import {
  pgTable,
  uuid,
  varchar,
  text,
  integer,
  timestamp,
  index,
  uniqueIndex,
} from "drizzle-orm/pg-core";
import { users } from "./auth.js";
import { products } from "./catalog.js";
import { orders } from "./orders.js";

export const productInventory = pgTable(
  "product_inventory",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    productId: uuid("product_id")
      .notNull()
      .references(() => products.id, { onDelete: "cascade" }),
    currentStock: integer("current_stock").default(0).notNull(),
    reservedStock: integer("reserved_stock").default(0).notNull(),
    incomingStock: integer("incoming_stock").default(0).notNull(),
    minStock: integer("min_stock").default(0).notNull(),
    maxStock: integer("max_stock").default(1000).notNull(),
    reorderLevel: integer("reorder_level").default(10).notNull(),
    safetyStock: integer("safety_stock").default(5).notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => ({
    productIdx: uniqueIndex("idx_product_inventory_product_id").on(
      table.productId,
    ),
  }),
);

export const inventoryTransactions = pgTable(
  "inventory_transactions",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    productId: uuid("product_id")
      .notNull()
      .references(() => products.id, { onDelete: "cascade" }),
    orderId: uuid("order_id").references(() => orders.id, {
      onDelete: "set null",
    }),
    transactionType: varchar("transaction_type", { length: 50 }).notNull(), // RESERVATION, RELEASE, SALE, RESTOCK, ADJUSTMENT
    quantityDelta: integer("quantity_delta").notNull(),
    reservedDelta: integer("reserved_delta").default(0).notNull(),
    stockAfter: integer("stock_after").notNull(),
    reservedAfter: integer("reserved_after").notNull(),
    reference: varchar("reference", { length: 255 }),
    notes: text("notes"),
    createdById: uuid("created_by_id").references(() => users.id, {
      onDelete: "set null",
    }),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => ({
    productIdx: index("idx_inventory_tx_product_id").on(table.productId),
    orderIdx: index("idx_inventory_tx_order_id").on(table.orderId),
  }),
);
