"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/db";
import { eq } from "drizzle-orm";
import { plannedExpenses } from "@/db/schema";
import { transactions } from "@/db/schema";

export async function createTransaction(formData: FormData) {
  const title = String(formData.get("title"));
  const amount = Number(formData.get("amount"));
  const type = String(formData.get("type")) as "income" | "expense";
  const category = String(formData.get("category"));
  const note = String(formData.get("note") || "");

  if (!title || !amount || !type || !category) {
    throw new Error("Missing required fields");
  }

  await db.insert(transactions).values({
    title,
    amountCents: Math.round(amount * 100),
    type,
    category,
    note,
  });

  revalidatePath("/");
}

export async function createPlannedExpense(formData: FormData) {
  const name = String(formData.get("name"));
  const amount = Number(formData.get("amount"));
  const category = String(formData.get("category"));
  const dueDate = String(formData.get("dueDate"));
  const note = String(formData.get("note") || "");

  if (!name || !amount || !category || !dueDate) {
    throw new Error("Missing required fields");
  }

  await db.insert(plannedExpenses).values({
    name,
    amountCents: Math.round(amount * 100),
    category,
    dueDate: new Date(dueDate),
    note,
    status: "upcoming",
  });

  revalidatePath("/");
}

export async function updatePlannedExpense(formData: FormData) {
  const id = Number(formData.get("id"));
  const name = String(formData.get("name"));
  const amount = Number(formData.get("amount"));
  const category = String(formData.get("category"));
  const dueDate = String(formData.get("dueDate"));
  const note = String(formData.get("note") || "");
  const status = String(formData.get("status") || "upcoming");

  if (!id || !name || !amount || !category || !dueDate) {
    throw new Error("Missing required fields");
  }

  await db
    .update(plannedExpenses)
    .set({
      name,
      amountCents: Math.round(amount * 100),
      category,
      dueDate: new Date(dueDate),
      note,
      status,
    })
    .where(eq(plannedExpenses.id, id));

  revalidatePath("/");
}

export async function deletePlannedExpense(formData: FormData) {
  const id = Number(formData.get("id"));

  if (!id) {
    throw new Error("Missing planned expense id");
  }

  await db.delete(plannedExpenses).where(eq(plannedExpenses.id, id));

  revalidatePath("/");
}
