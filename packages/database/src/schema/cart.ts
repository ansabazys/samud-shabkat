import {
  pgTable,
  uuid,
  varchar,
  numeric,
  integer,
  timestamp,
  jsonb,
  index,
  uniqueIndex,
} from "drizzle-orm/pg-core";
import { users } from "./auth.js";
import { products } from "./catalog.js";

export const carts = pgTable(
  "carts",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .notNull()
      .unique()
      .references(() => users.id, { onDelete: "cascade" }),
    status: varchar("status", { length: 50 }).default("ACTIVE").notNull(), // ACTIVE, CHECKOUT_PROCESSING, COMPLETED, ABANDONED
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
    deletedAt: timestamp("deleted_at"),
  },
  (table) => ({
    userIdx: index("idx_carts_user_id").on(table.userId),
    statusIdx: index("idx_carts_status").on(table.status),
  }),
);

export const cartItems = pgTable(
  "cart_items",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    cartId: uuid("cart_id")
      .notNull()
      .references(() => carts.id, { onDelete: "cascade" }),
    productId: uuid("product_id")
      .notNull()
      .references(() => products.id, { onDelete: "cascade" }),
    productNameSnapshot: varchar("product_name_snapshot", {
      length: 255,
    }).notNull(),
    skuSnapshot: varchar("sku_snapshot", { length: 100 }).notNull(),
    unitPriceSnapshot: numeric("unit_price_snapshot", {
      precision: 12,
      scale: 2,
    }).notNull(),
    quantity: integer("quantity").default(1).notNull(),
    discount: numeric("discount", { precision: 12, scale: 2 })
      .default("0.00")
      .notNull(),
    subtotal: numeric("subtotal", { precision: 12, scale: 2 }).notNull(),
    specificationsSnapshot: jsonb("specifications_snapshot")
      .default({})
      .notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => ({
    cartProductIdx: uniqueIndex("idx_cart_items_unique").on(
      table.cartId,
      table.productId,
    ),
    cartIdx: index("idx_cart_items_cart_id").on(table.cartId),
    productIdx: index("idx_cart_items_product_id").on(table.productId),
  }),
);
