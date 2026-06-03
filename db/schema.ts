import {
  boolean,
  integer,
  pgEnum,
  pgTable,
  serial,
  text,
  timestamp,
} from "drizzle-orm/pg-core";

export const transactionType = pgEnum("transaction_type", [
  "income",
  "expense",
]);

export const transactions = pgTable("transactions", {
  id: serial("id").primaryKey(),

  title: text("title").notNull(),
  amountCents: integer("amount_cents").notNull(),

  type: transactionType("type").notNull().default("expense"),
  category: text("category").notNull(),

  note: text("note"),

  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const plannedExpenses = pgTable("planned_expenses", {
  id: serial("id").primaryKey(),

  name: text("name").notNull(),
  amountCents: integer("amount_cents").notNull(),
  category: text("category").notNull(),

  dueDate: timestamp("due_date").notNull(),

  note: text("note"),
  status: text("status").notNull().default("upcoming"),

  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const fuelLogs = pgTable("fuel_logs", {
  id: serial("id").primaryKey(),

  amountCents: integer("amount_cents").notNull(),
  liters: integer("liters"),
  pricePerLiterCents: integer("price_per_liter_cents"),

  odometerKm: integer("odometer_km"),

  note: text("note"),

  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const categoryKind = pgEnum("category_kind", ["income", "expense"]);

export const categoryBehavior = pgEnum("category_behavior", ["normal", "fuel"]);

export const categories = pgTable("categories", {
  id: serial("id").primaryKey(),

  name: text("name").notNull(),
  kind: categoryKind("kind").notNull(),
  behavior: categoryBehavior("behavior").notNull().default("normal"),

  isDefault: boolean("is_default").default(false).notNull(),

  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const apartmentItemStatus = pgEnum("apartment_item_status", [
  "planned",
  "ordered",
  "delivered",
  "installed",
]);

export const apartmentItems = pgTable("apartment_items", {
  id: serial("id").primaryKey(),

  name: text("name").notNull(),

  room: text("room").notNull(),

  estimatedCostCents: integer("estimated_cost_cents").notNull(),

  actualCostCents: integer("actual_cost_cents"),

  status: apartmentItemStatus("status").notNull().default("planned"),

  note: text("note"),

  createdAt: timestamp("created_at").defaultNow().notNull(),
});
