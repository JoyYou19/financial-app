import {
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
