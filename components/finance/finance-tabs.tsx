"use client";

import {
  apartmentItems,
  fuelLogs,
  plannedExpenses,
  transactions,
} from "@/db/schema";

import { PlannedExpenses } from "./planned-expenses";
import { RecentTransactions } from "./recent-transactions";
import { SpendingChart } from "./spending-chart";
import { MobilityDashboard } from "./mobility-dashboard";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ApartmentDashboard } from "./apartment-dashboard";

type Transaction = typeof transactions.$inferSelect;
type PlannedExpense = typeof plannedExpenses.$inferSelect;
type FuelLog = typeof fuelLogs.$inferSelect;
type ApartmentItem = typeof apartmentItems.$inferSelect;

export function FinanceTabs({
  transactions,
  plannedExpenses,
  fuelLogs,
  apartmentItems,
}: {
  transactions: Transaction[];
  plannedExpenses: PlannedExpense[];
  fuelLogs: FuelLog[];
  apartmentItems: ApartmentItem[];
}) {
  return (
    <Tabs defaultValue="transactions" className="w-full">
      <TabsList className="grid w-full grid-cols-5">
        <TabsTrigger value="transactions">Transactions</TabsTrigger>
        <TabsTrigger value="planned">Planned</TabsTrigger>
        <TabsTrigger value="mobility">Mobility</TabsTrigger>
        <TabsTrigger value="charts">Charts</TabsTrigger>
        <TabsTrigger value="apartment">Apartment</TabsTrigger>
      </TabsList>

      <TabsContent value="transactions" className="mt-4">
        <RecentTransactions transactions={transactions.slice(0, 20)} />
      </TabsContent>

      <TabsContent value="planned" className="mt-4">
        <PlannedExpenses plannedExpenses={plannedExpenses} />
      </TabsContent>

      <TabsContent value="mobility" className="mt-4">
        <MobilityDashboard fuelLogs={fuelLogs} />
      </TabsContent>

      <TabsContent value="charts" className="mt-4">
        <SpendingChart transactions={transactions} />
      </TabsContent>
      <TabsContent value="apartment" className="mt-4">
        <ApartmentDashboard apartmentItems={apartmentItems} />
      </TabsContent>
    </Tabs>
  );
}
