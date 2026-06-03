CREATE TABLE "fuel_logs" (
	"id" serial PRIMARY KEY NOT NULL,
	"amount_cents" integer NOT NULL,
	"liters" integer NOT NULL,
	"odometer_km" integer,
	"price_per_liter_cents" integer NOT NULL,
	"note" text,
	"created_at" timestamp DEFAULT now() NOT NULL
);
