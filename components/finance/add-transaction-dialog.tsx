"use client";

import { useState } from "react";
import { createTransaction } from "@/app/actions";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { categories } from "@/db/schema";

type Category = typeof categories.$inferSelect;

export function AddTransactionDialog({
  categories,
}: {
  categories: Category[];
}) {
  const [open, setOpen] = useState(false);

  async function action(formData: FormData) {
    await createTransaction(formData);
    setOpen(false);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="lg">Add transaction</Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Add transaction</DialogTitle>
          <DialogDescription>
            Add an income or expense to your personal finance tracker.
          </DialogDescription>
        </DialogHeader>

        <form action={action} className="grid gap-4 pt-2">
          <div className="grid gap-2">
            <Label>Type</Label>
            <Select name="type" defaultValue="expense">
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="expense">Expense</SelectItem>
                <SelectItem value="income">Income</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="title">Title</Label>
            <Input id="title" name="title" placeholder="Groceries" />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="amount">Amount</Label>
            <Input
              id="amount"
              name="amount"
              type="number"
              step="0.01"
              placeholder="25.50"
            />
          </div>

          <div className="grid gap-2">
            <div className="grid gap-2">
              <Label>Category</Label>
              <Select name="category" defaultValue="Food">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.name}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="note">Note</Label>
            <Textarea id="note" name="note" placeholder="Optional" />
          </div>

          <Button type="submit" className="mt-2 w-full">
            Save transaction
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
