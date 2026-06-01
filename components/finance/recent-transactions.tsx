import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { transactions } from "@/db/schema";

type Transaction = typeof transactions.$inferSelect;

type RecentTransactionsProps = {
  transactions: Transaction[];
};

function formatMoney(cents: number) {
  return `€${(cents / 100).toFixed(2)}`;
}

export function RecentTransactions({ transactions }: RecentTransactionsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent transactions</CardTitle>
      </CardHeader>

      <CardContent className="space-y-3">
        {transactions.length === 0 ? (
          <p className="text-muted-foreground">No transactions yet.</p>
        ) : (
          transactions.map((transaction) => (
            <div
              key={transaction.id}
              className="flex items-center justify-between border-b py-3 last:border-0"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <p className="font-medium">{transaction.title}</p>
                  <Badge variant="secondary">{transaction.category}</Badge>
                </div>

                <p className="text-sm text-muted-foreground">
                  {transaction.note || "No note"}
                </p>
              </div>

              <p
                className={
                  transaction.type === "expense"
                    ? "font-semibold text-red-600"
                    : "font-semibold text-emerald-600"
                }
              >
                {transaction.type === "expense" ? "-" : "+"}
                {formatMoney(transaction.amountCents)}
              </p>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
}
