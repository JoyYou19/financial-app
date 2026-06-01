CREATE TYPE "public"."transaction_type" AS ENUM('income', 'expense');--> statement-breakpoint
CREATE TABLE "transactions" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"amount_cents" integer NOT NULL,
	"type" "transaction_type" DEFAULT 'expense' NOT NULL,
	"category" text NOT NULL,
	"note" text,
	"created_at" timestamp DEFAULT now() NOT NULL
);
