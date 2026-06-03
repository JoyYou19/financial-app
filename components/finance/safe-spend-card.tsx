import { plannedExpenses } from "@/db/schema";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

type PlannedExpense = typeof plannedExpenses.$inferSelect;

type SafeSpendCardProps = {
  balance: number;
  plannedExpenses: PlannedExpense[];
};

function formatMoney(cents: number) {
  return `€${(cents / 100).toFixed(2)}`;
}

function getDaysLeftInMonth() {
  const now = new Date();
  const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0);

  return Math.max(1, lastDay.getDate() - now.getDate() + 1);
}

export function SafeSpendCard({
  balance,
  plannedExpenses,
}: SafeSpendCardProps) {
  const upcomingTotal = plannedExpenses
    .filter((expense) => expense.status !== "paid")
    .reduce((sum, expense) => sum + expense.amountCents, 0);

  const safeToSpend = balance - upcomingTotal;
  const daysLeft = getDaysLeftInMonth();
  const safeDailySpend = Math.floor(safeToSpend / daysLeft);

  const health =
    safeToSpend <= 0 ? "danger" : safeDailySpend < 3000 ? "warning" : "good";

  const healthText = {
    danger: "You are over planned budget",
    warning: "Spend carefully",
    good: "You are in a good position",
  }[health];

  const progressValue =
    balance <= 0
      ? 0
      : Math.max(0, Math.min(100, (safeToSpend / balance) * 100));

  return (
    <Card className="border-zinc-200 bg-white">
      <CardHeader>
        <CardTitle className="text-sm font-medium text-zinc-500">
          Safe to spend
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        <div>
          <p
            className={
              safeToSpend >= 0
                ? "text-4xl font-bold text-emerald-600"
                : "text-4xl font-bold text-red-600"
            }
          >
            {formatMoney(safeToSpend)}
          </p>

          <p className="mt-1 text-sm text-zinc-500">
            After upcoming planned expenses
          </p>
        </div>

        <Progress value={progressValue} />

        <div className="grid gap-3 sm:grid-cols-3">
          <div className="rounded-lg border p-3">
            <p className="text-sm text-zinc-500">Per day</p>
            <p
              className={
                safeDailySpend >= 0
                  ? "text-xl font-bold text-zinc-950"
                  : "text-xl font-bold text-red-600"
              }
            >
              {formatMoney(safeDailySpend)}
            </p>
          </div>

          <div className="rounded-lg border p-3">
            <p className="text-sm text-zinc-500">Days left</p>
            <p className="text-xl font-bold text-zinc-950">{daysLeft}</p>
          </div>

          <div className="rounded-lg border p-3">
            <p className="text-sm text-zinc-500">Status</p>
            <p
              className={
                health === "danger"
                  ? "text-xl font-bold text-red-600"
                  : health === "warning"
                    ? "text-xl font-bold text-amber-600"
                    : "text-xl font-bold text-emerald-600"
              }
            >
              {healthText}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
