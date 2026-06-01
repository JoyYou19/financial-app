"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { transactions } from "@/db/schema";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type Transaction = typeof transactions.$inferSelect;

export function SpendingChart({
  transactions,
}: {
  transactions: Transaction[];
}) {
  const categoryMap = new Map<string, number>();

  for (const transaction of transactions) {
    if (transaction.type !== "expense") continue;

    categoryMap.set(
      transaction.category,
      (categoryMap.get(transaction.category) ?? 0) +
        transaction.amountCents / 100,
    );
  }

  const data = Array.from(categoryMap.entries()).map(([category, amount]) => ({
    category,
    amount,
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle>Spending by category</CardTitle>
      </CardHeader>

      <CardContent className="h-80">
        {data.length === 0 ? (
          <p className="text-muted-foreground">No expenses yet.</p>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
              <CartesianGrid vertical={false} />
              <XAxis dataKey="category" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="amount" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
}
