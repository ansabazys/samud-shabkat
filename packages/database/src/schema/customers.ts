import {
  pgTable,
  uuid,
  varchar,
  text,
  timestamp,
  index,
} from "drizzle-orm/pg-core";
import { users } from "./auth.js";

export const customerProfiles = pgTable(
  "customer_profiles",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .notNull()
      .unique()
      .references(() => users.id, { onDelete: "cascade" }),
    companyName: varchar("company_name", { length: 255 }),
    taxId: varchar("tax_id", { length: 50 }),
    phoneNumber: varchar("phone_number", { length: 30 }),
    billingAddress: text("billing_address"),
    shippingAddress: text("shipping_address"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
    deletedAt: timestamp("deleted_at"),
  },
  (table) => ({
    userIdx: index("idx_customer_profiles_user_id").on(table.userId),
  }),
);
