ALTER TABLE "cart_items" DROP CONSTRAINT IF EXISTS "cart_items_warehouse_id_warehouses_id_fk";--> statement-breakpoint
ALTER TABLE "inventory_transactions" DROP CONSTRAINT IF EXISTS "inventory_transactions_warehouse_id_warehouses_id_fk";--> statement-breakpoint
ALTER TABLE "product_inventory" DROP CONSTRAINT IF EXISTS "product_inventory_warehouse_id_warehouses_id_fk";--> statement-breakpoint
ALTER TABLE "warehouses" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
DROP TABLE IF EXISTS "warehouses" CASCADE;--> statement-breakpoint
DROP INDEX IF EXISTS "idx_inventory_tx_warehouse_id";--> statement-breakpoint
DROP INDEX IF EXISTS "idx_product_inventory_unique";--> statement-breakpoint
DROP INDEX IF EXISTS "idx_product_inventory_warehouse_id";--> statement-breakpoint
DROP INDEX IF EXISTS "idx_cart_items_unique";--> statement-breakpoint
DROP INDEX IF EXISTS "idx_product_inventory_product_id";--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "idx_cart_items_unique" ON "cart_items" USING btree ("cart_id","product_id");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "idx_product_inventory_product_id" ON "product_inventory" USING btree ("product_id");--> statement-breakpoint
ALTER TABLE "cart_items" DROP COLUMN IF EXISTS "warehouse_id";--> statement-breakpoint
ALTER TABLE "inventory_transactions" DROP COLUMN IF EXISTS "warehouse_id";--> statement-breakpoint
ALTER TABLE "product_inventory" DROP COLUMN IF EXISTS "warehouse_id";