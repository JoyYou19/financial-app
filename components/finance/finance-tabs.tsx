"use client";

import { plannedExpenses, transactions } from "@/db/schema";

import { RecentTransactions } from "./recent-transactions";
import { SpendingChart } from "./spending-chart";
import { PlannedExpenses } from "./planned-expenses";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

type Transaction = typeof transactions.$inferSelect;
type PlannedExpense = typeof plannedExpenses.$inferSelect;

export function FinanceTabs({
  transactions,
  plannedExpenses,
}: {
  transactions: Transaction[];
  plannedExpenses: PlannedExpense[];
}) {
  return (
    <Tabs defaultValue="transactions" className="w-full">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="transactions">Transactions</TabsTrigger>
        <TabsTrigger value="planned">Planned</TabsTrigger>
        <TabsTrigger value="charts">Charts</TabsTrigger>
      </TabsList>

      <TabsContent value="transactions" className="mt-4">
        <RecentTransactions transactions={transactions.slice(0, 20)} />
      </TabsContent>

      <TabsContent value="planned" className="mt-4">
        <PlannedExpenses plannedExpenses={plannedExpenses} />
      </TabsContent>

      <TabsContent value="charts" className="mt-4">
        <SpendingChart transactions={transactions} />
      </TabsContent>
    </Tabs>
  );
}
