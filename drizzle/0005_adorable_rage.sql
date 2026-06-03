CREATE TYPE "public"."apartment_item_status" AS ENUM('planned', 'ordered', 'delivered', 'installed');--> statement-breakpoint
CREATE TABLE "apartment_items" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"room" text NOT NULL,
	"estimated_cost_cents" integer NOT NULL,
	"actual_cost_cents" integer,
	"status" "apartment_item_status" DEFAULT 'planned' NOT NULL,
	"note" text,
	"created_at" timestamp DEFAULT now() NOT NULL
);
