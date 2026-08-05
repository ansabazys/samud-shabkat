import {
  pgTable,
  uuid,
  varchar,
  text,
  boolean,
  timestamp,
} from "drizzle-orm/pg-core";

export const settings = pgTable("settings", {
  id: uuid("id").primaryKey().defaultRandom(),
  companyName: varchar("company_name", { length: 255 })
    .default("Samud Shabkat")
    .notNull(),
  supportEmail: varchar("support_email", { length: 255 })
    .default("support@samudshabkat.com")
    .notNull(),
  contactPhone: varchar("contact_phone", { length: 50 })
    .default("+971 4 123 4567")
    .notNull(),
  officeAddress: text("office_address")
    .default("Dubai, United Arab Emirates")
    .notNull(),
  defaultCurrency: varchar("default_currency", { length: 10 })
    .default("AED")
    .notNull(),
  isMaintenanceMode: boolean("is_maintenance_mode").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});
