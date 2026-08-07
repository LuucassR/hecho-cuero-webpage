CREATE TYPE "public"."delivery_method" AS ENUM('envio', 'retiro');--> statement-breakpoint
ALTER TYPE "public"."payment_method" ADD VALUE 'efectivo';--> statement-breakpoint
ALTER TABLE "orders" ALTER COLUMN "shipping_street" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "orders" ALTER COLUMN "shipping_city" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "orders" ALTER COLUMN "shipping_province" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "orders" ALTER COLUMN "shipping_postal_code" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "orders" ADD COLUMN "delivery_method" "delivery_method" DEFAULT 'envio' NOT NULL;