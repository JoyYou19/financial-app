import { plannedExpenses } from "@/db/schema";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type PlannedExpense = typeof plannedExpenses.$inferSelect;

type SummaryCardsProps = {
  income: number;
  expenses: number;
  balance: number;
  plannedExpenses: PlannedExpense[];
};

function formatMoney(cents: number) {
  return `€${(cents / 100).toFixed(2)}`;
}

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("en-GB", {
    month: "short",
    day: "numeric",
  }).format(date);
}

export function SummaryCards({
  income,
  expenses,
  balance,
  plannedExpenses,
}: SummaryCardsProps) {
  const upcoming = plannedExpenses
    .filter((expense) => expense.status !== "paid")
    .sort((a, b) => a.dueDate.getTime() - b.dueDate.getTime());

  const upcomingTotal = upcoming.reduce(
    (sum, expense) => sum + expense.amountCents,
    0,
  );

  const nextExpense = upcoming[0];
  const safeBalance = balance - upcomingTotal;

  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      <Card className="border-zinc-200 bg-white">
        <CardHeader>
          <CardTitle className="text-sm font-medium text-zinc-500">
            Income
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-3xl font-bold text-emerald-600">
            {formatMoney(income)}
          </p>
          <p className="mt-1 text-sm text-zinc-500">Money received</p>
        </CardContent>
      </Card>

      <Card className="border-zinc-200 bg-white">
        <CardHeader>
          <CardTitle className="text-sm font-medium text-zinc-500">
            Spent
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-3xl font-bold text-red-600">
            {formatMoney(expenses)}
          </p>
          <p className="mt-1 text-sm text-zinc-500">Money already gone</p>
        </CardContent>
      </Card>

      <Card className="border-zinc-200 bg-white">
        <CardHeader>
          <CardTitle className="text-sm font-medium text-zinc-500">
            Balance
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p
            className={
              safeBalance >= 0
                ? "text-3xl font-bold text-zinc-950"
                : "text-3xl font-bold text-red-600"
            }
          >
            {formatMoney(balance)}
          </p>

          <p
            className={
              safeBalance >= 0
                ? "mt-1 text-sm text-emerald-600"
                : "mt-1 text-sm text-red-600"
            }
          >
            {formatMoney(safeBalance)} after planned
          </p>
        </CardContent>
      </Card>

      <Card className="border-amber-200 bg-amber-50/60">
        <CardHeader>
          <CardTitle className="text-sm font-medium text-amber-700">
            Upcoming
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-3xl font-bold text-amber-700">
            {formatMoney(upcomingTotal)}
          </p>

          {nextExpense ? (
            <p className="mt-1 text-sm text-amber-700/80">
              Next: {nextExpense.name} · {formatDate(nextExpense.dueDate)}
            </p>
          ) : (
            <p className="mt-1 text-sm text-zinc-500">Nothing planned</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
