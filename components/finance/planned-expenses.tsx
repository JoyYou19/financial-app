"use client";

import { useState } from "react";
import {
  createPlannedExpense,
  deletePlannedExpense,
  updatePlannedExpense,
} from "@/app/actions";
import { plannedExpenses } from "@/db/schema";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";

type PlannedExpense = typeof plannedExpenses.$inferSelect;

function formatMoney(cents: number) {
  return `€${(cents / 100).toFixed(2)}`;
}

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("en-GB", {
    month: "short",
    day: "numeric",
  }).format(date);
}

function toDateInputValue(date: Date) {
  return date.toISOString().slice(0, 10);
}

export function PlannedExpenses({
  plannedExpenses,
}: {
  plannedExpenses: PlannedExpense[];
}) {
  const total = plannedExpenses.reduce(
    (sum, expense) => sum + expense.amountCents,
    0,
  );

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Planned expenses</CardTitle>
        <AddPlannedExpenseDialog />
      </CardHeader>

      <CardContent className="space-y-4">
        <div>
          <div className="mb-2 flex items-center justify-between">
            <p className="text-sm text-muted-foreground">Planned this month</p>
            <p className="font-semibold">{formatMoney(total)}</p>
          </div>

          <Progress value={plannedExpenses.length ? 65 : 0} />
        </div>

        <div className="space-y-3">
          {plannedExpenses.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              No planned expenses yet.
            </p>
          ) : (
            plannedExpenses.map((expense) => (
              <div
                key={expense.id}
                className="flex items-center justify-between gap-4 rounded-lg border p-3"
              >
                <div>
                  <p className="font-medium">{expense.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {expense.category} · Due {formatDate(expense.dueDate)} ·{" "}
                    {expense.status}
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <p className="font-semibold">
                    {formatMoney(expense.amountCents)}
                  </p>
                  <EditPlannedExpenseDialog expense={expense} />
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}

function AddPlannedExpenseDialog() {
  const [open, setOpen] = useState(false);

  async function action(formData: FormData) {
    await createPlannedExpense(formData);
    setOpen(false);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm">Add planned</Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add planned expense</DialogTitle>
        </DialogHeader>

        <form action={action} className="grid gap-4">
          <div className="grid gap-2">
            <Label>Name</Label>
            <Input name="name" placeholder="Rent" required />
          </div>

          <div className="grid gap-2">
            <Label>Amount</Label>
            <Input name="amount" type="number" step="0.01" required />
          </div>

          <div className="grid gap-2">
            <Label>Category</Label>
            <Input name="category" placeholder="Housing" required />
          </div>

          <div className="grid gap-2">
            <Label>Due date</Label>
            <Input name="dueDate" type="date" required />
          </div>

          <div className="grid gap-2">
            <Label>Note</Label>
            <Textarea name="note" placeholder="Optional" />
          </div>

          <Button type="submit">Save planned expense</Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function EditPlannedExpenseDialog({ expense }: { expense: PlannedExpense }) {
  const [open, setOpen] = useState(false);

  async function updateAction(formData: FormData) {
    await updatePlannedExpense(formData);
    setOpen(false);
  }

  async function deleteAction(formData: FormData) {
    await deletePlannedExpense(formData);
    setOpen(false);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" variant="outline">
          Edit
        </Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit planned expense</DialogTitle>
        </DialogHeader>

        <form action={updateAction} className="grid gap-4">
          <input type="hidden" name="id" value={expense.id} />

          <div className="grid gap-2">
            <Label>Name</Label>
            <Input name="name" defaultValue={expense.name} required />
          </div>

          <div className="grid gap-2">
            <Label>Amount</Label>
            <Input
              name="amount"
              type="number"
              step="0.01"
              defaultValue={(expense.amountCents / 100).toFixed(2)}
              required
            />
          </div>

          <div className="grid gap-2">
            <Label>Category</Label>
            <Input name="category" defaultValue={expense.category} required />
          </div>

          <div className="grid gap-2">
            <Label>Due date</Label>
            <Input
              name="dueDate"
              type="date"
              defaultValue={toDateInputValue(expense.dueDate)}
              required
            />
          </div>

          <div className="grid gap-2">
            <Label>Status</Label>
            <Input name="status" defaultValue={expense.status} required />
          </div>

          <div className="grid gap-2">
            <Label>Note</Label>
            <Textarea name="note" defaultValue={expense.note ?? ""} />
          </div>

          <Button type="submit">Save changes</Button>
        </form>

        <form action={deleteAction}>
          <input type="hidden" name="id" value={expense.id} />
          <Button type="submit" variant="destructive" className="w-full">
            Delete planned expense
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
