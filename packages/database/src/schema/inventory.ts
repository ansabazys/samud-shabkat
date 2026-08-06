import {
  pgTable,
  uuid,
  varchar,
  text,
  integer,
  boolean,
  timestamp,
  index,
  uniqueIndex,
} from "drizzle-orm/pg-core";
import { users } from "./auth.js";
import { products } from "./catalog.js";
import { orders } from "./orders.js";

export const warehouses = pgTable(
  "warehouses",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    name: varchar("name", { length: 150 }).notNull(),
    code: varchar("code", { length: 50 }).notNull().unique(),
    address: text("address"),
    isActive: boolean("is_active").default(true).notNull(),
    isDefault: boolean("is_default").default(false).notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
    deletedAt: timestamp("deleted_at"),
  },
  (table) => ({
    codeIdx: index("idx_warehouses_code").on(table.code),
  }),
);

export const productInventory = pgTable(
  "product_inventory",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    productId: uuid("product_id")
      .notNull()
      .references(() => products.id, { onDelete: "cascade" }),
    warehouseId: uuid("warehouse_id")
      .notNull()
      .references(() => warehouses.id, { onDelete: "restrict" }),
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
    productWarehouseIdx: uniqueIndex("idx_product_inventory_unique").on(
      table.productId,
      table.warehouseId,
    ),
    productIdx: index("idx_product_inventory_product_id").on(table.productId),
    warehouseIdx: index("idx_product_inventory_warehouse_id").on(
      table.warehouseId,
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
    warehouseId: uuid("warehouse_id")
      .notNull()
      .references(() => warehouses.id, { onDelete: "restrict" }),
    orderId: uuid("order_id").references(() => orders.id, {
      onDelete: "set null",
    }),
    transactionType: varchar("transaction_type", { length: 50 }).notNull(), // RESERVATION, RELEASE, SALE, ADJUSTMENT, INCOMING_PO, TRANSFER
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
    warehouseIdx: index("idx_inventory_tx_warehouse_id").on(table.warehouseId),
    orderIdx: index("idx_inventory_tx_order_id").on(table.orderId),
  }),
);
