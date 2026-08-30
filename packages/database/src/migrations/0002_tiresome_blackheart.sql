ALTER TABLE "orders" ALTER COLUMN "fulfillment_type" SET DEFAULT 'STORE_PICKUP';--> statement-breakpoint
ALTER TABLE "orders" ALTER COLUMN "payment_method" SET DEFAULT 'CASH_ON_PICKUP';--> statement-breakpoint
ALTER TABLE "orders" ALTER COLUMN "billing_address" SET DEFAULT 'Store Address';--> statement-breakpoint
ALTER TABLE "orders" ALTER COLUMN "shipping_address" SET DEFAULT 'Store Pickup';