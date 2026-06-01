import { db } from "@/db";
import { transactions } from "@/db/schema";
import { desc } from "drizzle-orm";
import { plannedExpenses } from "@/db/schema";

import { AddTransactionDialog } from "@/components/finance/add-transaction-dialog";
import { FinanceTabs } from "@/components/finance/finance-tabs";
import { SummaryCards } from "@/components/finance/summary-cards";

export default async function Home() {
  const rows = await db
    .select()
    .from(transactions)
    .orderBy(desc(transactions.createdAt))
    .limit(100);

  const income = rows
    .filter((t) => t.type === "income")
    .reduce((sum, t) => sum + t.amountCents, 0);

  const expenses = rows
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + t.amountCents, 0);

  const balance = income - expenses;

  const planned = await db
    .select()
    .from(plannedExpenses)
    .orderBy(desc(plannedExpenses.dueDate));

  return (
    <main className="min-h-screen bg-background p-4 pb-24 md:p-6">
      <div className="mx-auto flex max-w-6xl flex-col gap-6">
        <header className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Finance App</h1>
            <p className="text-muted-foreground">
              Track cash, spending, planned expenses, and runway.
            </p>
          </div>

          <div className="hidden sm:block">
            <AddTransactionDialog />
          </div>
        </header>

        <SummaryCards
          income={income}
          expenses={expenses}
          balance={balance}
          plannedExpenses={planned}
        />

        <FinanceTabs transactions={rows} plannedExpenses={planned} />

        <div className="fixed inset-x-0 bottom-0 border-t bg-background p-4 sm:hidden">
          <AddTransactionDialog />
        </div>
      </div>
    </main>
  );
}
