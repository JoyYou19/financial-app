"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/db";
import { eq } from "drizzle-orm";
import { apartmentItems, fuelLogs, plannedExpenses } from "@/db/schema";
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

  const amountCents = Math.round(amount * 100);

  await db.insert(transactions).values({
    title,
    amountCents,
    type,
    category,
    note,
  });

  const isFuel =
    type === "expense" && ["fuel", "degviela"].includes(category.toLowerCase());

  if (isFuel) {
    await db.insert(fuelLogs).values({
      amountCents,
      liters: null,
      odometerKm: null,
      pricePerLiterCents: null,
      note: `Auto-created from transaction: ${title}${note ? ` — ${note}` : ""}`,
    });
  }

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

export async function createFuelLog(formData: FormData) {
  const amount = Number(formData.get("amount"));
  const liters = Number(formData.get("liters"));
  const odometerKmRaw = formData.get("odometerKm");
  const note = String(formData.get("note") || "");

  if (!amount || !liters) {
    throw new Error("Missing required fields");
  }

  const pricePerLiter = amount / liters;

  await db.insert(fuelLogs).values({
    amountCents: Math.round(amount * 100),
    liters: Math.round(liters),
    odometerKm: odometerKmRaw ? Number(odometerKmRaw) : null,
    pricePerLiterCents: Math.round(pricePerLiter * 100),
    note,
  });

  revalidatePath("/");
}

export async function createApartmentItem(formData: FormData) {
  const name = String(formData.get("name"));
  const room = String(formData.get("room"));
  const estimatedCost = Number(formData.get("estimatedCost"));
  const actualCostRaw = formData.get("actualCost");
  const status = String(formData.get("status") || "planned") as
    | "planned"
    | "ordered"
    | "delivered"
    | "installed";
  const note = String(formData.get("note") || "");

  if (!name || !room || !estimatedCost || !status) {
    throw new Error("Missing required fields");
  }

  await db.insert(apartmentItems).values({
    name,
    room,
    estimatedCostCents: Math.round(estimatedCost * 100),
    actualCostCents: actualCostRaw
      ? Math.round(Number(actualCostRaw) * 100)
      : null,
    status,
    note,
  });

  revalidatePath("/");
}

export async function updateApartmentItem(formData: FormData) {
  const id = Number(formData.get("id"));
  const name = String(formData.get("name"));
  const room = String(formData.get("room"));
  const estimatedCost = Number(formData.get("estimatedCost"));
  const actualCostRaw = formData.get("actualCost");
  const status = String(formData.get("status") || "planned") as
    | "planned"
    | "ordered"
    | "delivered"
    | "installed";
  const note = String(formData.get("note") || "");

  if (!id || !name || !room || !estimatedCost || !status) {
    throw new Error("Missing required fields");
  }

  await db
    .update(apartmentItems)
    .set({
      name,
      room,
      estimatedCostCents: Math.round(estimatedCost * 100),
      actualCostCents: actualCostRaw
        ? Math.round(Number(actualCostRaw) * 100)
        : null,
      status,
      note,
    })
    .where(eq(apartmentItems.id, id));

  revalidatePath("/");
}

export async function deleteApartmentItem(formData: FormData) {
  const id = Number(formData.get("id"));

  if (!id) {
    throw new Error("Missing apartment item id");
  }

  await db.delete(apartmentItems).where(eq(apartmentItems.id, id));

  revalidatePath("/");
}
