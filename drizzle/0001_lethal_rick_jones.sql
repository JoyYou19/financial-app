CREATE TABLE "planned_expenses" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"amount_cents" integer NOT NULL,
	"category" text NOT NULL,
	"due_date" timestamp NOT NULL,
	"note" text,
	"status" text DEFAULT 'upcoming' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
